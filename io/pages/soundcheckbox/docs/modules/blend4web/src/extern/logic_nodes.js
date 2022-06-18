import register from "../util/register.js";

import m_logn_fact from "../intern/logic_nodes.js";

/**
 * API methods to control the {@link https://www.blend4web.com/doc/en/logic_editor.html|Logic Editor}.
 * @module logic_nodes
 */
function Logic_nodes(ns, exports) {

var m_logn = m_logn_fact(ns);

/**
 * Register custom callback, used in logic editor.
 * @method module:logic_nodes.append_custom_callback
 * @param {string} cb_id Callback ID.
 * @param {Function} cb Callback function.
 * @example var m_log_nodes = require("logic_nodes");
 * var cb = function() {
 *     console.log("Blend4Web rules!");
 * }
 *
 * m_log_nodes.append_custom_callback("cb_ID", cb);
 */
exports.append_custom_callback = function(cb_id, cb) {
    m_logn.append_custom_cb(cb_id, cb);
}

/**
 * Remove registered custom callback by its ID.
 * @method module:logic_nodes.remove_custom_callback
 * @param {string} cb_id Callback ID.
 * @example var m_log_nodes = require("logic_nodes");
 *
 * m_log_nodes.remove_custom_callback("cb_ID");
 */
exports.remove_custom_callback = function(cb_id) {
    m_logn.remove_custom_cb(cb_id);
}

/**
 * Activate Entry Point node, used in logic editor.
 * @method module:logic_nodes.run_entrypoint
 * @param {string} scene_name Scene name.
 * @param {string} ep_name Entry Point node name.
 * @example var m_log_nodes = require("logic_nodes");
 * m_log_nodes.run_entrypoint("Scene", "B4WLogicNode");
 */
exports.run_entrypoint = function(scene_name, ep_name) {
    m_logn.run_ep(scene_name, ep_name);
}

}

var logic_nodes_factory = register("logic_nodes", Logic_nodes);

export default logic_nodes_factory;
