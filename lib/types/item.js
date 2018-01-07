'use strict'

const ResourceType = require('./type')

class Item extends ResourceType {
  constructor (model, transformer) {
    super()
    this.model = model
    this.transformer = this.createTransformer(transformer)
  }

  emptyData () {
    return {}
  }
}

module.exports = Item
