import register from "../util/register.js";

import m_print_fact from "../intern/print.js";

/**
 * Local storage add-on.
 * @see http://www.w3.org/TR/webstorage/
 * @name storage
 * @namespace
 * @exports exports as storage
 */
function Storage(ns, exports) {

var m_print = m_print_fact(ns);

var _prefix = "b4w";
var _storage = null;

/**
 * Initialize the application storage.
 * @method module:storage.init
 * @param {string} prefix Storage prefix
 */
exports.init = init;
function init(prefix) {
    if (prefix)
        if (prefix !== "b4w")
            _prefix = prefix;
        else
            m_print.error("b4w prefix denied");
    else
        m_print.warn("Prefix should be a string. " +
                "Last declared storage prefix will be used.");
}

function init_storage() {
    try {
        _storage = window.localStorage;
        try {
            _storage["tmp"] = null;
            delete _storage["tmp"];
        } catch (e) {
            m_print.warn("localStorage quota is limited. Disabling localStorage");
            _storage = null;
        }
    } catch (e) {
        m_print.warn("Applying chrome localStorage bug workaround");
        _storage = null;
    }

    if (!_storage) {
        m_print.warn("localStorage is not available, initializing temporary storage");
        _storage = {};
    }
}

/**
 * Save the value in the local storage.
 * @param {string} key Key
 * @param {string} value Value
 * @param {?string} prefix Storage prefix.
 */
exports.set = function(key, value, prefix) {
    var b4w_st = get_b4w_storage(prefix);
    b4w_st[key] = String(value);
    set_b4w_storage(b4w_st, prefix);
}

function get_b4w_storage(prefix) {
    if (_storage[prefix? prefix: _prefix])
        return JSON.parse(_storage[prefix? prefix: _prefix]);
    else
        return {};
}

function set_b4w_storage(b4w_storage, prefix) {
    _storage[prefix? prefix: _prefix] = JSON.stringify(b4w_storage);
}

/**
 * Perform local storage cleanup.
 * @param {?string} prefix Storage prefix.
 */
exports.cleanup = function(prefix) {
    delete _storage[prefix? prefix: _prefix];
}

/**
 * Get the value from the local storage.
 * @param {string} key Key
 * @param {?string} prefix Storage prefix.
 * @returns {string} Value
 */
exports.get = function(key, prefix) {
    var b4w_st = get_b4w_storage(prefix);
    if (b4w_st[key])
        return b4w_st[key];
    else
        return "";
}

/**
 * Print the local storage.
 * @param {?string} prefix Storage prefix.
 */
exports.debug = function(prefix) {
    m_print.log(get_b4w_storage(prefix? prefix: _prefix));
}

// NOTE: initialize with default prefix for compatibility reasons
init_storage();

}

var storage_factory = register("storage", Storage);

export default storage_factory;
