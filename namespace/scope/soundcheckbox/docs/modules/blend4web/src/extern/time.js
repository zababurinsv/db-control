import register from "../util/register.js";

import m_time_fact from "../intern/time.js";

/**
 * Time API.
 * @module time
 */
function Time(ns, exports) {

var m_time = m_time_fact(ns);

/**
 * Set a new timeout.
 * this method has the same behavior as window.setTimeout(), except it uses
 * engine's timeline.
 * @method module:time.set_timeout
 * @param {timeout_callback} callback Timeout callback
 * @param {number} time Timeout
 * @returns {number} Timeout ID
 */
exports.set_timeout = m_time.set_timeout;

/**
 * Clear the timeout.
 * @method module:time.clear_timeout
 * @param {number} id Timeout ID
 */
exports.clear_timeout = m_time.clear_timeout;

/**
 * Get the engine's timeline (number of seconds after engine's initialization).
 * @method module:time.get_timeline
 * @returns {number} Timeline
 */
exports.get_timeline = m_time.get_timeline;

/**
 * Animate value.
 * @method module:time.animate
 * @param {number} from Value to animate from 
 * @param {number} to Value to animate to
 * @param {number} timeout Period of time to animate the value
 * @param {anim_callback} anim_cb Animation callback
 * @returns {number} Animator ID
 */
exports.animate = m_time.animate;

/**
 * Clear the animation.
 * @method module:time.clear_animation
 * @param {number} id Animator ID
 */
exports.clear_animation = m_time.clear_animation;

/**
 * Get current FPS.
 * @method module:time.get_framerate
 * @param {number} id Animator ID
 */
exports.get_framerate = get_framerate;
function get_framerate() {
    return m_time.get_framerate();
}

}

var time_factory = register("time", Time);

export default time_factory;
