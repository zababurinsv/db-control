'use strict'

export const getCallback = function (options, callback) {
  return typeof options === 'function' ? options : callback
}

export const getOptions = function (options) {
  return typeof options === 'object' && options !== null ? options : {}
}

export default {
  getCallback,
  getOptions
}
