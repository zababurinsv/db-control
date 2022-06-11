'use strict'

import queueMicrotask from "../queue-microtask/index.js";

export default function (fn, ...args) {
    if (args.length === 0) {
        queueMicrotask(fn)
    } else {
        queueMicrotask(() => fn(...args))
    }
}
