'use strict';
import bind from '../function-bind/index.js'

export default bind.call(Function.call, Object.prototype.hasOwnProperty);
