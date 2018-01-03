'use strict'

const Builder = require('./builder')
const types = require('./types')

module.exports = {
  /**
   * @param {*} resource instance of the resource type (Collection|Item)
   * @param {*} options Optional parameters
   */
  create (resourceType, options = {}) {
    return new Builder(resourceType, options)
  },

  /**
   * Creates an item resource
   *
   * @param {*} model
   * @param {*} transformer
   */
  item (model, transformer) {
    return new types.Item(model, transformer)
  },

  /**
   * Creates a collection resource
   *
   * @param {*} model
   * @param {*} transformer
   */
  collection (model, transformer) {
    return new types.Collection(model, transformer)
  }
}
