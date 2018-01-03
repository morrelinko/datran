'use strict'

/**
 * Default Serializer
 */
module.exports = {
  /**
   * Serializes a collection
   *
   * @param {*} key
   * @param {*} data
   */
  collection (key, data) {
    return data
  },

  /**
   * Serializes a resource item
   *
   * @param {*} key
   * @param {*} data
   */
  item (key, data) {
    return data
  },

  /**
   * Serialize an empty resource
   * @returns {Object}
  */
  empty () {
    return {}
  },

  /**
   * Embeds the includes data to the transformed data
   * @param {*} data
   * @param {*} includeData
   */
  embedIncludes (data, includeData) {
    Object.assign(data, includeData)
    return data
  }
}
