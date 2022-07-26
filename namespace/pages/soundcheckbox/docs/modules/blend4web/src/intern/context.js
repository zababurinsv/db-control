import register from "../util/register.js";

function Context(ns, exports) {

var _gl = null;

exports.setup = function(gl) {
    _gl = gl;
}

exports.get_gl = function() {
    return _gl;
}

exports.reset = function() {
    _gl = null;
}

}

var context_fact = register("__context", Context);

export default context_fact;