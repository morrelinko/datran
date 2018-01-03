'use strict'

const should = require('should')
const datran = require('../lib')
const types = require('../lib/types')
const models = require('./models')

describe('builder.parseIncludes()', function () {
  it('parses requested include', function () {
    let builder = datran.create(models.user())
    let includeStr = 'post:limit(5|1):order(created_at|desc),post.comments'

    builder.parseIncludes(includeStr)

    should.ok(builder.requestedIncludes)
  })
})
