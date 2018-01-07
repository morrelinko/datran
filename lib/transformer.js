'use strict'

const { Item, Collection } = require('./types')
const { createClass } = require('./toolbox/utils')

class Transformer {
  constructor () {
    if (!this.availableIncludes) {
      this.availableIncludes = []
    }

    if (!this.defaultIncludes) {
      this.defaultIncludes = []
    }
  }

  /**
   * Creates a new transformer blueprint using object pattern
   *
   * <code>
   *  const MyTransformer = Transformer.create({
   *    transform () {}
   *  })
   * </code>
   *
   * @param {*} proto
   */
  static create (proto) {
    return createClass(Transformer, proto)
  }

  transform () {
    return {}
  }

  /**
   * Helper for creating an Item resource
   *
   * @param {*} model
   * @param {*} transformer
   */
  item (model, transformer) {
    return new Item(model, transformer)
  }

  /**
   * Helper for creating a Collection resource
   *
   * @param {*} model
   * @param {*} transformer
   */
  collection (model, transformer) {
    return new Collection(model, transformer)
  }

  /**
   * Checks if the transformer has any includes defined
   *
   * @returns {Boolean}
   */
  hasIncludes () {
    return (
      this.defaultIncludes.length !== 0 || this.availableIncludes.length !== 0
    )
  }

  getAvailableIncludes () {
    return this.availableIncludes
  }

  getDefaultIncludes () {
    return this.defaultIncludes
  }
}

module.exports = Transformer
