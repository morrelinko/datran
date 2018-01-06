'use strict'

const { assert } = require('chai')
const types = require('../lib/types')
const Builder = require('../lib/builder')

describe('builder', function () {
  it('transforms item resource using callback', async function () {
    let resource = new types.Item({ foo: 'bar' }, function (model) {
      return { foo_key: model.foo }
    })

    let builder = new Builder(resource)
    let data = await builder.toObject()
    let json = await builder.toJson()

    assert.hasAllKeys(data, ['foo_key'])
    assert.equal(json, '{"foo_key":"bar"}')
  })

  it('transforms collection resource using callback', async function () {
    let resource = new types.Collection(
      [{ foo: 'bar' }, { some: 'thing' }],
      function (model) {
        return model
      }
    )

    let builder = new Builder(resource)
    let json = await builder.toJson()

    assert.equal(json, '[{"foo":"bar"},{"some":"thing"}]')
  })
})
