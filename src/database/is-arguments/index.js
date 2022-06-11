'use strict';
import hasToStringTag from '../has-tostringtag/shams.js'
import callBound from '../call-bind/callBound.js'

var $toString = callBound('Object.prototype.toString');

var isStandardArguments = function isArguments(value) {
    if (hasToStringTag && value && typeof value === 'object' && Symbol.toStringTag in value) {
        return false;
    }
    return $toString(value) === '[object Arguments]';
};

var isLegacyArguments = function isArguments(value) {
    if (isStandardArguments(value)) {
        return true;
    }
    return value !== null
        && typeof value === 'object'
        && typeof value.length === 'number'
        && value.length >= 0
        && $toString(value) !== '[object Array]'
        && $toString(value.callee) === '[object Function]';
};

var supportsStandardArguments = (function () {
    return isStandardArguments(arguments);
}());

isStandardArguments.isLegacyArguments = isLegacyArguments; // for tests

export default supportsStandardArguments ? isStandardArguments : isLegacyArguments;
