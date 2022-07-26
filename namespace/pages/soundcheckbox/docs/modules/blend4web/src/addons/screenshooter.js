import register from "../util/register.js";

import m_screen_fact from "../extern/screen.js";
import m_print_fact from "../intern/print.js";

/**
 * Screen shooter add-on.
 * @module screenshooter
 */
function Screenshooter(ns, exports) {

var m_screen = m_screen_fact(ns);
var m_print  = m_print_fact(ns);

/**
 * Take a screenshot and download as screenshot.png image.
 * @method module:screenshooter.shot
 * @param {string} [format="image/png"] The MIME image format ("image/png",
 * "image/jpeg", "image/webp" and so on)
 * @param {number} [quality=1.0] Number between 0 and 1 for types: "image/jpeg",
 * "image/webp"
 * @example
 * var m_scrn = require("screenshooter");
 * m_scrn.shot();
 * @deprecated Use {@link module:screen.shot} instead
 */
exports.shot = function(format, quality) {
    m_print.error_deprecated("shot", "screen.shot");
    m_screen.shot(format, quality);
}

};

var screenshooter_factory = register("screenshooter", Screenshooter);

export default screenshooter_factory;
