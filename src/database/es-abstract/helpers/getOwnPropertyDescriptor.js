'use strict';

import GetIntrinsic from "../../get-intrinsic/index.js";

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
if ($gOPD) {
    try {
        $gOPD([], 'length');
    } catch (e) {
        // IE 8 has a broken gOPD
        $gOPD = null;
    }
}

export default $gOPD;
