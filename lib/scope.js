'use strict'

const { trim } = require('./toolbox/utils')

class Scope {
  /**
   * Constructor
   *
   * @param {Object} options
   *    - includes: Requested includes
   */
  constructor (options = {}) {
    this.resource = options.resource
    this.identifier = options.identifier || null
    this.parent = options.parent || null
    this.includes = options.includes || []
    this.excludes = options.excludes || []
    this.path = this.getPath()
  }

  /**
   * Creates a child scope that is
   * nested from current scope
   *
   * @param {String} identifier Child scope identifier
   * @param {*} resource Instance of resource type
   * @returns {Scope}
   */
  createScope (identifier, resource) {
    let { includes } = this

    return new Scope({
      identifier,
      resource,
      includes,
      parent: this
    })
  }

  /**
   * Checks if this scope is the root scope
   * @returns {Boolean}
   */
  isRoot () {
    return this.parent === null
  }

  /**
   * Checks if an identifier is included from current scope
   *
   * @param {*} identifier
   */
  isIncluded (identifier) {
    return this.includes.indexOf(this.toPath(identifier)) !== -1
  }

  /**
   * Checks if an identifier is excluded from current scope
   *
   * @param {*} identifier
   */
  isExcluded (identifier) {
    return this.excludes.indexOf(this.toPath(identifier)) !== -1
  }

  /**
   * Gets the scope identifier path
   *
   * @returns {String}
   */
  getPath () {
    if (this.isRoot()) {
      return ''
    }

    if (this.parent === null) {
      // return this.identifier
    }

    return trim(this.parent.getPath() + '.' + this.identifier, '.')
  }

  /**
   * Get scope (include) identifier
   * @returns scope identifier
   */
  getIdentifier () {
    return this.identifier
  }

  /**
   * @param {*} includeIdentifier
   */
  toPath (includeIdentifier) {
    return trim(this.path + '.' + includeIdentifier, '.')
  }
}

module.exports = Scope
