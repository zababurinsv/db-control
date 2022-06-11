'use strict'

export const isArray = Array.isArray
export const assign = Object.assign
export const isObject = v => typeof v === 'object'
export const isFunction = v => typeof v === 'function'
export const isBoolean = v => typeof v === 'boolean'
export const isRegex = v => v instanceof RegExp
export const keys = Object.keys
