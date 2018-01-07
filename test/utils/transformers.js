'use strict'

const Transformer = require('../../lib/transformer')

class User extends Transformer {
  constructor () {
    super()
    this.availableIncludes = ['photo']
  }

  transform (model) {
    return {
      name: `${model.firstName} ${model.lastName}`
    }
  }

  includePhoto (model) {
    return this.item(model, UserPhoto)
  }
}

class UserPhoto extends Transformer {
  transform (model) {
    console.log(model)
    return {
      url: model.photoUrl
    }
  }
}

module.exports = {
  User,
  UserPhoto
}
