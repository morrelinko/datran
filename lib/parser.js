'use strict'

/**
 * Fields parser
 *
 * Format
 *  - post,post.comments,post.author
 *  - post:limit(5):order(created_at|desc),-post.comments
 *  - post,-votes
 */
class Parser {
  constructor (fields) {
    /**
     * Character used to separate parameters
     */
    this.separator = ','

    /**
     * Included fields
     */
    this.includes = []

    /**
     * Fields to exclude
     */
    this.excludes = []

    /**
     * Included fields paramters
     */
    this.parameters = {}

    this.fields = fields || []
  }

  /**
   * Parses includes and exclude fields
   *
   * @returns {Parser}
   */
  parse () {
    let { fields } = this
    let includes = []
    let excludes = []
    let parameters = {}

    if (typeof fields === 'string') {
      fields = fields.split(',')
    }

    for (let field of fields) {
      field = field.trim()

      if (field.length === 0) {
        continue
      }

      if (field.startsWith('-')) {
        excludes.push(field.substr(1))
        continue
      }

      let [identifier, ...modifiers] = field.split(':')

      includes.push(identifier)

      if (modifiers.length === 0) {
        // Skip processing if no field modifiers specified
        continue
      }

      let modifierArg = {}
      let modifierRegex = /([\w]+)(\(([^)]+)\))?/

      for (let modifier of modifiers) {
        let [, modName, , modParams] = modifierRegex.exec(modifier)
        modifierArg[modName] = modParams.split('|')
      }

      parameters[identifier] = modifierArg
    }

    this.includes = includes
    this.excludes = excludes
    this.parameters = parameters

    return this
  }

  getIncludes () {
    return this.includes
  }

  getExcludes () {
    return this.excludes
  }

  getParameters () {
    return this.parameters
  }
}

module.exports = Parser
