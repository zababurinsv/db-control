'use strict';

import forEach from "../for-each/index.js";
import availableTypedArrays from "../available-typed-arrays/index.js";
import callBound from "../call-bind/callBound.js";
import HasToStringTag from '../has-tostringtag/shams.js'
import gOPD from "../es-abstract/helpers/getOwnPropertyDescriptor.js";
import isTypedArray from "../is-typed-array/index.js";

var $toString = callBound('Object.prototype.toString');
var hasToStringTag = HasToStringTag();
var g = typeof globalThis === 'undefined' ? global : globalThis;
var typedArrays = availableTypedArrays();

var $slice = callBound('String.prototype.slice');
var toStrTags = {};
var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');
if (hasToStringTag && gOPD && getPrototypeOf) {
    forEach(typedArrays, function (typedArray) {
        if (typeof g[typedArray] === 'function') {
            var arr = new g[typedArray]();
            if (Symbol.toStringTag in arr) {
                var proto = getPrototypeOf(arr);
                var descriptor = gOPD(proto, Symbol.toStringTag);
                if (!descriptor) {
                    var superProto = getPrototypeOf(proto);
                    descriptor = gOPD(superProto, Symbol.toStringTag);
                }
                toStrTags[typedArray] = descriptor.get;
            }
        }
    });
}

var tryTypedArrays = function tryAllTypedArrays(value) {
    var foundName = false;
    forEach(toStrTags, function (getter, typedArray) {
        if (!foundName) {
            try {
                var name = getter.call(value);
                if (name === typedArray) {
                    foundName = name;
                }
            } catch (e) {}
        }
    });
    return foundName;
};

export default function whichTypedArray(value) {
    if (!isTypedArray(value)) { return false; }
    if (!hasToStringTag || !(Symbol.toStringTag in value)) { return $slice($toString(value), 8, -1); }
    return tryTypedArrays(value);
};
