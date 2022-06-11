'use strict'
import nextTick from "../next-tick/index.js";

export const fromCallback = function (callback, symbol) {
    if (callback === undefined) {
        var promise = new Promise(function (resolve, reject) {
            callback = function (err, res) {
                if (err) reject(err)
                else resolve(res)
            }
        })

        callback[symbol !== undefined ? symbol : 'promise'] = promise
    } else if (typeof callback !== 'function') {
        throw new TypeError('Callback must be a function')
    }

    return callback
}

export const fromPromise = function (promise, callback) {
    if (callback === undefined) return promise

    promise
        .then(function (res) { nextTick(() => callback(null, res)) })
        .catch(function (err) { nextTick(() => callback(err)) })
}

export default {
    fromPromise,
    fromCallback
}
