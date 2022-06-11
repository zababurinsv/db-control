'use strict';

import hasSymbols from "../has-symbols/shams.js";

export default function hasToStringTagShams() {
    return hasSymbols() && !!Symbol.toStringTag;
};
