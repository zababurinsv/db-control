'use strict'

export const getCallback = function (options, callback) {
  return typeof options === 'function' ? options : callback
}

export const getOptions = function (options, def) {
  if (typeof options === 'object' && options !== null) {
    return options
  }

  if (def !== undefined) {
    return def
  }

  return {}
}

export default {
  getCallback,
  getOptions
}
