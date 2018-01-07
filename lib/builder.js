'use strict'

const camelCase = require('lodash/camelCase')
const upperFirst = require('lodash/upperFirst')
const serializer = require('./serializer')
const Parser = require('./parser')
const types = require('./types')
const Scope = require('./scope')
const Transformer = require('./transformer')

class Builder {
  constructor (resource, options = {}) {
    /**
     * Output serializer & composer
     */
    this.serializer = options.serializer || serializer

    /**
     * Field parser
     */
    this.parser = options.parser || this.createParser(options.fields)

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
      includes: this.parser.getIncludes(),
      excludes: this.parser.getExcludes()
    })
  }

  createParser (fields) {
    return new Parser(fields).parse()
  }

  async toObject () {
    let { scope } = this
    let { resource, resource: { transformer, model } } = scope

    let data = resource.emptyData()

    if (resource instanceof types.Item) {
      data = await this.transform(transformer, model, scope)
    } else if (resource instanceof types.Collection) {
      for (let item of model) {
        data.push(await this.transform(transformer, item, scope))
      }
    }

    return data
  }

  async toJson () {
    return JSON.stringify(await this.toObject())
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
      data = transformer.transform(model)

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
