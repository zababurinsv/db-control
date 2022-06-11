'use strict';

import hasSymbols from "../has-symbols/index.js";

export default function hasToStringTag() {
    return hasSymbols() && typeof Symbol.toStringTag === 'symbol';
};
