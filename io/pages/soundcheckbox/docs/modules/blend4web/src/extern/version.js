import register from "../util/register.js";

import * as m_version from "../intern/version.js";

/**
 * Version API. Allows to query various information about the current release.
 * @module version
 */
function Version(ns, exports) {

/**
 * Get the version.
 * The version is an array of the format: [yy, mm] or [yy, mm, bugfix] for "RELEASE"
 * version or [yy, mm] for "DEBUG" version.
 * @method module:version.version
 * @returns {Array} Version: [yy, mm]
 */
exports.version = m_version.version;

/**
 * Get the version.
 * The version string has the format: "yy.mm" or "yy.mm.bugfix" for "RELEASE"
 * version or "yy.mm" for "DEBUG" version.
 * @method module:version.version_str
 * @returns {string} Version string
 */
exports.version_str = m_version.version_str;

/**
 * Get the release type: "DEBUG" or "RELEASE".
 * @method module:version.type
 * @returns {string} Release type
 */
exports.type = m_version.type;

/**
 * Return the build date or the current date for the "DEBUG" version.
 * @method module:version.date
 * @returns {Date} Date
 */
exports.date = m_version.date;

/**
 * Return the build date or the current date for the "DEBUG" version.
 * @method module:version.date_str
 * @returns {string} Date string in the format: "dd.mm.yyyy hh.mm.ss"
 */
exports.date_str = m_version.date_str;

/**
 * Returns a string representing the application version based on build time. 
 * Returns the current timestamp in the "DEBUG" mode.
 * @method module:version.get_build_version
 * @returns {string} Build version.
 */
exports.get_build_version = m_version.get_build_version;

}

var version_factory = register("version", Version);

export default version_factory;
