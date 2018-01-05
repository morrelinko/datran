'use strict'

const { assert } = require('chai')
const Parser = require('../lib/parser')

describe('parser', function () {
  before(function () {
    let fields = 'post,comments'
    let parser = new Parser()
  })

  it('parses fields to include', function () {
    const parser = new Parser('post,users').parse()

    assert.isArray(parser.getIncludes())
    assert.include(parser.getIncludes(), 'post')
    assert.include(parser.getIncludes(), 'users')
    assert.notInclude(parser.getIncludes(), 'thread')
  })

  it('parses fields to exclude', function () {
    const parser = new Parser('post,-users').parse()

    assert.isArray(parser.getExcludes())
    assert.include(parser.getExcludes(), 'users')
    assert.notInclude(parser.getExcludes(), 'post')
  })

  it('parses field parameters', function () {
    const parser = new Parser('post:limit(5|1):order(created_at|desc)').parse()
    const parameters = parser.getParameters()

    assert.include(parser.getIncludes(), 'post')

    // parameters.post
    assert.hasAllKeys(parameters, ['post'])

    // parameters.post.limit && parameters.post.order
    assert.hasAllKeys(parameters.post, ['limit', 'order'])
  })
})
