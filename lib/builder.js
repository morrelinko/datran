'use strict'

const camelCase = require('lodash/camelCase')
const upperFirst = require('lodash/upperFirst')
const serializer = require('./serializer')
const types = require('./types')
const Scope = require('./scope')
const Transformer = require('./transformer')

class Builder {
  constructor (resource, options = {}) {
    /**
         * Identifiers to include
         */
    this.requestedIncludes = []

    this.requestedIncludeParams = {}

    /**
         * Identfiers to exclude
         */
    this.reqestedExcludes = []

    /**
         * Character used to separate parameters
         */
    this.delimiter = ','

    /**
         * Output composer
         */
    this.serializer = options.serializer || serializer

    if (options.include) {
      this.parseIncludes(options.include)
    }

    if (options.exclude) {
      this.parseExcludes(options.exclude)
    }

    /**
         * Root scope
         */
    this.scope = this.createRootScope(resource)
  }

  setSerializer (serializer) {
    this.serializer = serializer
  }

  createRootScope (resource) {
    return new Scope({
      resource,
      excludes: this.reqestedExcludes,
      includes: this.requestedIncludes
    })
  }

  /**
       * Parses include parameter
       *
       * Include Format:
       *  - post,post.comments,post.author
       *  - post:limit(5):order(created_at|desc),post.comments
       *
       * TODO: Parser abstraction
       *
       * @param {*} includes
       */
  parseIncludes (includes) {
    let requestedIncludes = []

    if (typeof includes === 'string') {
      includes = includes.split(',')
    }

    for (let include of includes) {
      include = include.trim()

      if (include.length === 0) {
        continue
      }

      let [identifier, ...modifiers] = include.split(':')

      requestedIncludes.push(identifier)

      if (modifiers.length === 0) {
        continue
      }

      let modifierArg = {}
      let modifierRegex = /([\w]+)(\(([^)]+)\))?/

      for (let modifier of modifiers) {
        let [, modName, , modParams] = modifierRegex.exec(modifier)
        modifierArg[modName] = modParams.split('|')
      }

      this.requestedIncludeParams[identifier] = modifierArg
    }

    this.requestedIncludes = requestedIncludes
  }

  /**
       *
       * @param {*} excludes
       */
  parseExcludes (excludes) {
    let requestedExcludes = []

    if (typeof excludes === 'string') {
      excludes = excludes.split(',')
    }

    requestedExcludes = excludes.map(str => str.trim()).filter(Boolean)

    this.reqestedExcludes = requestedExcludes
  }

  async toObject () {
    let { scope } = this
    let { resource, resource: { transformer, model } } = scope

    let data = resource.emptyData()

    if (resource instanceof types.Item) {
      data = await this.transform(transformer, model, scope)
    } else if (resource instanceof types.Collection) {
      for (let item in model) {
        data.push(await this.transform(transformer, item, scope))
      }
    }

    return data
  }

  toJson () {
    return JSON.stringify(this.toObject())
  }

  /**
       * Runs the main transform on the model passed
       *
       * @param {*} transformer
       * @param {*} model
       * @param {*} scope
       * @private
       */
  async transform (transformer, model, scope) {
    let data = {}
    let includes = {}

    if (
      typeof transformer === 'function' &&
      transformer.constructor === Function
    ) {
      // Anonymous function passed
      data = transformer.call(transformer, model)
    } else if (transformer instanceof Transformer) {
      // Transformer instance
      data = transformer.transform(data)

      // If the transformer has includes defined,
      // parse and merge included data
      if (transformer.hasIncludes()) {
        includes = await this.processIncludes(transformer, model, scope)
        data = this.serializer.embedIncludes(data, includes)
      }
    }

    return this.serialize(data, scope)
  }

  /**
       *
       * @param {*} data
       * @param {*} scope {identifier, resource}
       */
  serialize (data, { identifier, resource }) {
    if (resource instanceof types.Item) {
      return this.serializer.item(identifier, data)
    }

    if (resource instanceof types.Collection) {
      return this.serializer.collection(identifier, data)
    }

    return this.serializer.item(identifier, data)
  }

  /**
       * Process resources to be included
       *
       * @param {*} transformer
       * @param {*} model
       * @param {*} currentScope
       * @returns {Object} Included data
       * @private
       */
  async processIncludes (transformer, model, scope) {
    // Holds the included data
    let data = {}
    let includes = []
    let availableIncludes = transformer.getAvailableIncludes()
    let defaultIncludes = transformer.getDefaultIncludes()

    for (let include of availableIncludes) {
      if (scope.isExcluded(include)) {
        continue
      }

      if (defaultIncludes.indexOf(include) !== -1) {
        includes.push(include)
      }

      if (scope.isIncluded(include)) {
        includes.push(include)
      }
    }

    for (let include of includes) {
      // Execute include function
      let method = `include${upperFirst(camelCase(include))}`

      if (transformer[method] !== undefined) {
        let result = transformer[method](model)

        if (result instanceof types.Type) {
          let { transformer, model } = result

          result = await this.transform(
            transformer,
            model,
            scope.createScope(include, result)
          )
        }

        data[include] = result
      }
    }

    return data
  }
}

module.exports = Builder
