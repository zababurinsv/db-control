import register from "../util/register.js";

import m_hud_fact from "../intern/hud.js";
import m_print_fact from "../intern/print.js";

/** 
 * Head-up display functions.
 * To work properly requires initialization of the separate canvas element.
 * @see module:main.init
 * @module hud
 */
function HUD(ns, exports) {

var m_hud   = m_hud_fact(ns);
var m_print = m_print_fact(ns);

/**
 * Draw the mixer strip.
 * Used by mixer addon.
 * @method module:hud.draw_mixer_strip
 * @deprecated Use {@link module:screen.draw_mixer_strip} instead
 */
exports.draw_mixer_strip = function(id, is_active, slot, params, active_param,
        mute, solo) {
    m_print.error_deprecated("draw_mixer_strip", "screen.draw_mixer_strip");
    m_hud.draw_mixer_strip(id, is_active, slot, params, active_param,
            mute, solo);
};

/**
 * Plot the array.
 * @method module:hud.plot_array
 * @param {string} header Plot header
 * @param {number} slot Slot number
 * @param {Float32Array} arr Array
 * @param {number} arg_min Minimum plot argument value
 * @param {number} arg_max Maximum plot argument value
 * @param {number} val_min Minimum plot value
 * @param {number} val_max Maximum plot value
 * @deprecated Use {@link module:screen.plot_array} instead
 */
exports.plot_array = function(header, slot, arr, arg_min, arg_max, val_min,
        val_max) {
    m_print.error_deprecated("plot_array", "screen.plot_array");
    m_hud.plot_array(header, slot, arr, arg_min, arg_max, val_min, val_max);
};

}

var hud_factory = register("hud", HUD);

export default hud_factory;
