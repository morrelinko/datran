'use strict'

class Type {
  /*
   * @param {*} Impl Transformer Implementation
   */
  createTransformer (Impl) {
    if (!Impl) {
      // No transformer, create a passthrough transformer
      // that mirrors back the model
      return model => model
    }

    if (typeof Impl === 'object' && Impl.transform) {
      // An instance of transformer passed
      return Impl
    }

    if (Impl.prototype.transform) {
      // A class extending Transformer
      return new Impl()
    }

    return Impl
  }
}

module.exports = Type
