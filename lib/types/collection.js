'use strict'

const ResourceType = require('./type')

class Collection extends ResourceType {
  constructor (model, transformer) {
    super()
    this.model = model
    this.transformer = transformer || this.passthruTransformer
  }

  emptyData () {
    return []
  }
}

module.exports = Collection
