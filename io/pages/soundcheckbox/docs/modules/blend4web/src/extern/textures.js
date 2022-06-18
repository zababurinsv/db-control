import register from "../util/register.js";

import m_print_fact from "../intern/print.js";
import m_scenes_fact from "../intern/scenes.js";
import m_textures_fact from "../intern/textures.js";
import m_obj_util_fact from "../intern/obj_util.js";
import m_assets_fact from "../intern/assets.js";

import {normpath_preserve_protocol} from "../util/path.js";

/**
 * API methods to control textures.
 * @module textures
 * @local TexChangingFinishCallback
 * @see https://www.blend4web.com/doc/en/textures.html
 */
function Textures(ns, exports) {

var m_print    = m_print_fact(ns);
var m_scenes   = m_scenes_fact(ns);
var m_textures = m_textures_fact(ns);
var m_obj_util = m_obj_util_fact(ns);
var m_assets   = m_assets_fact(ns);

/**
 * Texture changing finish callback.
 * @callback TexChangingFinishCallback
 * @param {boolean} success Operation result
 */

/**
 * Play video.
 * @see https://www.blend4web.com/doc/en/textures.html#video-texture
 * @method module:textures.play_video
 * @param {string} texture_name Texture name
 * @param {number} [data_id=0] ID of loaded data
 */
exports.play_video = function(texture_name, data_id) {
    if (!data_id)
        data_id = 0;

    var vtex = m_textures.get_video_texture(texture_name, data_id);
    if (!vtex) {
        m_print.error("Texture with name \"" + texture_name + "\" not found!");
        return;
    }

    var scene = m_scenes.get_active();
    if (scene["b4w_use_nla"] && m_textures.video_allow_nla(vtex)) {
        m_print.error("NLA texture can't be controlled directly through API.");
        return;
    }

    m_textures.play_video(vtex)
}

/**
 * Pause video.
 * @method module:textures.pause_video
 * @param {string} texture_name Texture name
 * @param {number} [data_id=0] ID of loaded data
 */
exports.pause_video = function(texture_name, data_id) {
    if (!data_id)
        data_id = 0;

    var vtex = m_textures.get_video_texture(texture_name, data_id);
    if (!vtex) {
        m_print.error("Texture with name \"" + texture_name + "\" not found!");
        return;
    }

    var scene = m_scenes.get_active();
    if (scene["b4w_use_nla"] && m_textures.video_allow_nla(vtex)) {
        m_print.error("NLA texture can't be controlled directly through API.");
        return;
    }

    m_textures.pause_video(vtex)
}

/**
 * Reset video (considering frame_offset value from Blender).
 * @method module:textures.reset_video
 * @param {string} texture_name Texture name
 * @param {number} [data_id=0] ID of loaded data
 */
exports.reset_video = function(texture_name, data_id) {
    if (!data_id)
        data_id = 0;

    var vtex = m_textures.get_video_texture(texture_name, data_id);
    if (!vtex) {
        m_print.error("Texture with name \"" + texture_name + "\" not found!");
        return;
    }

    var scene = m_scenes.get_active();
    if (scene["b4w_use_nla"] && m_textures.video_allow_nla(vtex)) {
        m_print.error("NLA texture can't be controlled directly through API.");
        return;
    }

    m_textures.reset_video(vtex);
}
/**
 * Returns canvas texture context.
 * @see https://www.blend4web.com/doc/en/textures.html#canvas
 * @method module:textures.get_canvas_ctx
 * @param {Object3D} obj Object 3D
 * @param {string} text_name Texture name specified in Blender
 * @returns {CanvasRenderingContext2D} Canvas texture context
 * @example 
 * var m_scenes = require("scenes");
 * var m_tex = require("textures");
 *
 * var cube = m_scenes.get_object_by_name("Cube");
 * var ctx = m_tex.get_canvas_ctx(cube, "Texture");
 */
exports.get_canvas_ctx = function(obj, text_name) {

    if (!m_obj_util.is_mesh(obj))
        m_print.error("Object must be type of mesh.");
    else {
        var canvas_context = m_textures.get_canvas_context_by_object(obj, text_name);
        if (canvas_context)
            return canvas_context;
        m_print.error("Couldn't find canvas texture with this name: " + text_name);
    }
    return null;
}
/**
 * Update canvas texture context.
 * @see https://www.blend4web.com/doc/en/textures.html#canvas
 * @method module:textures.update_canvas_ctx
 * @param {Object3D} obj Object 3D
 * @param {string} text_name Texture name specified in Blender
 * @example 
 * var m_scenes = require("scenes");
 * var m_tex = require("textures");
 *
 * var cube = m_scenes.get_object_by_name("Cube");
 * m_tex.update_canvas_ctx(cube, "Texture");
 */
exports.update_canvas_ctx = function(obj, text_name) {
    if (!m_obj_util.is_mesh(obj)) {
        m_print.error("Object must be type of mesh.");
        return false;
    }

    var tex = m_textures.get_texture_by_name(obj, text_name);
    if (!tex || tex.source != "CANVAS") {
        m_print.error("Couldn't find canvas texture \"" + text_name + "\" in object \"" + obj.name + "\".");
        return false;
    }

    m_textures.update_texture_canvas(tex);
    return true;
}
/**
 * Change texture image. Changing video textures is forbidden.
 * @method module:textures.change_image
 * @param {Object3D} obj Object 3D
 * @param {string} text_name Texture name specified in Blender
 * @param {string} image_path Path to image (relative to the main html file)
 * @param {TexChangingFinishCallback} [callback] Callback to be executed after changing
 * @deprecated [17.08] Use {@link module:textures.replace_image} instead
 * @example 
 * var m_scenes  = require("scenes");
 * var m_tex = require("textures");
 *
 * var cube = m_scenes.get_object_by_name("Cube");
 * m_tex.change_image(cube, "Texture", "./test.png");
 */
exports.change_image = function(obj, text_name, image_path, callback) {
    m_print.error_deprecated("change_image", "replace_image");
    callback = callback || function() {};
    var tex = m_textures.get_texture_by_name(obj, text_name);
    if (!tex) {
        m_print.error("Couldn't find texture \"" + text_name + "\" in object \"" + obj.name + "\".");
        callback(false);
        return;
    }

    if (tex.is_movie) {
        m_print.error("Changing video textures is forbidden.");
        callback(false);
        return;
    }

    var norm_path = normpath_preserve_protocol(image_path);
    if (tex.img_full_filepath == norm_path) {
        callback(true);
        return;
    }

    var asset = {
        id: image_path,
        type: m_assets.AT_IMAGE_ELEMENT,
        url: image_path,
        request_method: "GET"
    };

    var asset_cb = function(data, id, type, url) {
        if (data) {
            m_textures.change_image(obj, tex, text_name, data, image_path);
            callback(true);
        } else
            callback(false);
    }
    m_assets.enqueue([asset], asset_cb, null, null);
}

/**
 * Change texture image. Changing video textures is forbidden.
 * @method module:textures.replace_image
 * @param {Object3D} obj Object 3D
 * @param {string} text_name Texture name specified in Blender
 * @param {HTMLElement} image HTML element Image.
 * @param {TexChangingFinishCallback} [callback] Callback to be executed after changing
 * @example 
 * var m_scenes  = require("scenes");
 * var m_tex = require("textures");
 *
 * var cube = m_scenes.get_object_by_name("Cube");
 * var image = new Image();
 * image.onload = function() {
 *     m_tex.replace_image(cube, "Texture", image);
 * }
 * image.src = "./test.png";
 */
exports.replace_image = function(obj, text_name, image, callback) {
    callback = callback || function() {};
    var tex = m_textures.get_texture_by_name(obj, text_name);

    if (!tex) {
        m_print.error("Couldn't find texture \"" + text_name + "\" in object \"" + obj.name + "\".");
        callback(false);
        return;
    }

    if (tex.is_movie) {
        m_print.error("Changing video textures is forbidden.");
        callback(false);
        return;
    }

    if (!("src" in image)) {
        m_print.error("Incorrect image.");
        callback(false);
        return;
    }

    var image_path = image.src;

    // There is no chance to check that the image is not found
    // but in this case the image is complete, so allow to handle
    // this situation in m_textures.change_image, moreover, the
    // corresponding "Not Found" is already rised. For the better
    // handling use onload/onerror for image immediately after creation.
    if (image.complete) {
        m_textures.change_image(obj, tex, text_name, image, image_path);
        callback(true);
    }
    else {
        var onload = image.onload;
        var onerror = image.onerror;
        image.onload = function() {
            if (onload)
                onload.call(image);
            m_textures.change_image(obj, tex, text_name, image, image_path);
            callback(true);
        }
        image.onerror = function() {
            if (onerror)
                onerror.call(image)
            callback(false);
        }
    }
}
/**
 * Get texture names.
 * @method module:textures.get_texture_names
 * @param {Object3D} obj Object 3D
 * @returns {Array} Texture names array
 */
exports.get_texture_names = function(obj) {
    if (!m_obj_util.is_mesh(obj)) {
        m_print.error("Object must be type of mesh.");
        return [];
    } else
        return m_textures.get_texture_names(obj);
}

}

var textures_factory = register("textures", Textures);

export default textures_factory;
