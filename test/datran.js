'use strict'

const should = require('should')
const datran = require('../lib')
const types = require('../lib/types')
const models = require('./models')

describe('datran.create()', function () {
  it('returns an instance of data builder', function () {
    let builder = datran.create()
  })
})

describe('datran.item()', function () {
  it('returns an instance of item resource type', function () {
    let item = datran.item(models.user())

    should(item).be.instanceOf(types.Type)
    should(item).be.instanceOf(types.Item)
  })
})

describe('datran.collection()', function () {
  it('returns an instance of collection resource type', function () {
    let item = datran.collection([models.user()])

    should(item).be.instanceOf(types.Type)
    should(item).be.instanceOf(types.Collection)
  })
})
