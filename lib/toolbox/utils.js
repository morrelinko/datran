'use strict'

function createClass (Source, proto) {
  let Cls = class extends Source {}
  Object.assign(Cls.prototype, proto, Source.prototype)
  return Cls
}

function trim (str, characters) {
  return str.replace(new RegExp(`^[${characters}]+|[${characters}]+$`, 'g'), '')
}

module.exports = {
  trim,
  createClass
}
