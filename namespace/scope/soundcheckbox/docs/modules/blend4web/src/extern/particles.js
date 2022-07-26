import register from "../util/register.js";

import m_particles_fact from "../intern/particles.js";
import m_print_fact from "../intern/print.js";

/**
 * {@link https://www.blend4web.com/doc/en/particles.html|Particle system} API. Please note that particle emission itself is controlled by the {@link module:animation} module.
 * @module particles
 */
function Particles(ns, exports) {

var m_particles = m_particles_fact(ns);
var m_print     = m_print_fact(ns);

/**
 * Set particle size.
 * @method module:particles.set_size
 * @param {Object3D} obj Emitter object.
 * @param {string} psys_name Particle system name.
 * @param {number} size Particle size.
 * @example var m_particles = require("particles");
 * var m_scenes = require("scenes");
 *
 * var cube = m_scenes.get_object_by_name("Cube");
 * m_particles.set_size(cube, "MyParticleSystem", 2.4);
 */
exports.set_size = function(obj, psys_name, size) {
    if (!m_particles.obj_has_psys(obj, psys_name)) {
        m_print.error("set_size(): Object \"" + obj.name + "\" has not a particle system named \"" 
                + psys_name + "\"");
        return;
    }
    m_particles.set_size(obj, psys_name, size);
}


/**
 * Set particle normal factor.
 * @method module:particles.set_normal_factor
 * @param {Object3D} obj Emitter object.
 * @param {string} psys_name Particle system name.
 * @param {number} nfactor Particle normal factor.
 * @example var m_particles = require("particles");
 * var m_scenes = require("scenes");
 *
 * var cube = m_scenes.get_object_by_name("Cube");
 * m_particles.set_normal_factor(cube, "MyParticleSystem", 15);
 */
exports.set_normal_factor = function(obj, psys_name, nfactor) {
    if (!m_particles.obj_has_psys(obj, psys_name)) {
        m_print.error("set_normal_factor(): Object \"" + obj.name + "\" has not a particle system named \"" 
                + psys_name + "\"");
        return;
    }
    m_particles.set_normal_factor(obj, psys_name, nfactor);
}

/**
 * Set particle number factor.
 * @method module:particles.set_factor
 * @param {Object3D} obj Emitter object.
 * @param {string} psys_name Particle system name.
 * @param {number} factor Particle number factor. A coefficient defining the 
 * number of particles to be emitted. 1 - all particles, 0 - none.
 * @example var m_particles = require("particles");
 * var m_scenes = require("scenes");
 *
 * var cube = m_scenes.get_object_by_name("Cube");
 * m_particles.set_factor(cube, "MyParticleSystem", 0.3);
 */
exports.set_factor = function(obj, psys_name, factor) {
    if (!m_particles.obj_has_psys(obj, psys_name)) {
        m_print.error("set_factor(): Object \"" + obj.name + "\" has not a particle system named \"" 
                + psys_name + "\"");
        return;
    }
    factor = Math.min(factor, 1);
    factor = Math.max(factor, 0);

    m_particles.set_factor(obj, psys_name, factor);
}

}

var particles_factory = register("particles", Particles);

export default particles_factory;
