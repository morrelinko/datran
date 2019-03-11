'use strict'

const Builder = require('./builder')
const types = require('./types')

module.exports = {
  Transformer: require('./transformer'),
  /**
   * @param {*} resource instance of the resource type (Collection|Item)
   * @param {*} options Optional parameters
   *    - exlcudes: Exclude string (eg req.query.exclude)
   *    - includes: Include string (eg req.query.include)
   *    - serializer
   *    - parser
   */
  create (resourceType, options = {}) {
    if (!(resourceType instanceof types.Type)) {
      resourceType = this.item(resourceType)
    }

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
