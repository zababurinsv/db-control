'use strict';

import hasSymbolSham from "./shams.js";

var origSymbol = typeof Symbol !== 'undefined' && Symbol;
export default function hasNativeSymbols() {
    if (typeof origSymbol !== 'function') { return false; }
    if (typeof Symbol !== 'function') { return false; }
    if (typeof origSymbol('foo') !== 'symbol') { return false; }
    if (typeof Symbol('bar') !== 'symbol') { return false; }

    return hasSymbolSham();
};
