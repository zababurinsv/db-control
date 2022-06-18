import register from "../util/register.js";

import m_assert_fact from "../util/assert.js";
import m_batch_fact from "./batch.js";
import * as m_bounds from "./boundings.js";
import m_cam_fact from "./camera.js";
import m_cfg_fact from "./config.js";
import m_cont_fact from "./container.js";
import m_debug_subscene_fact from "./debug/subscene.js";
import m_graph_fact from "./graph.js";
import m_hud_fact from "./hud.js";
import m_input_fact from "./input.js";
import * as m_mat4 from "../libs/gl_matrix/mat4.js";
import m_nodemat_fact from "./nodemat.js";
import m_obj_fact from "./objects.js";
import m_textures_fact from "./textures.js";
import m_obj_util_fact from "./obj_util.js";
import m_prerender_fact from "./prerender.js";
import m_primitives_fact from "./primitives.js";
import m_print_fact from "./print.js";
import * as m_quat from "../libs/gl_matrix/quat.js";
import m_render_fact from "./renderer.js";
import m_scgraph_fact from "./scenegraph.js";
import m_sfx_fact from "./sfx.js";
import m_shaders_fact from "./shaders.js";
import m_subs_fact from "./subscene.js";
import m_tex_fact from "./textures.js";
import * as m_tsr from "./tsr.js";
import * as m_util from "./util.js";
import * as m_vec3 from "../libs/gl_matrix/vec3.js";
import * as m_vec4 from "../libs/gl_matrix/vec4.js";
import {type} from "./version.js";

/**
 * Scene internal API.
 * @name scenes
 * @namespace
 * @exports exports as scenes
 */
function Int_scenes(ns, exports) {

var m_assert     = m_assert_fact(ns);
var m_batch      = m_batch_fact(ns);
var m_cam        = m_cam_fact(ns);
var m_cfg        = m_cfg_fact(ns);
var m_cont       = m_cont_fact(ns);
var m_debug_subscene = m_debug_subscene_fact(ns);
var m_graph      = m_graph_fact(ns);
var m_hud        = m_hud_fact(ns);
var m_input      = m_input_fact(ns);
var m_nodemat    = m_nodemat_fact(ns);
var m_obj        = m_obj_fact(ns);
var m_textures   = m_textures_fact(ns);
var m_obj_util   = m_obj_util_fact(ns);
var m_prerender  = m_prerender_fact(ns);
var m_primitives = m_primitives_fact(ns);
var m_print      = m_print_fact(ns);
var m_render     = m_render_fact(ns);
var m_scgraph    = m_scgraph_fact(ns);
var m_sfx        = m_sfx_fact(ns);
var m_shaders    = m_shaders_fact(ns);
var m_subs       = m_subs_fact(ns);
var m_tex        = m_tex_fact(ns);

var cfg_dbg = m_cfg.debug_subs;
var cfg_def = m_cfg.defaults;
var cfg_lim = m_cfg.context_limits;
var cfg_out = m_cfg.outlining;
var cfg_scs = m_cfg.scenes;

var FRAME_EPS = 5;

/* subscene types for different aspects of processing */

// add objects
var OBJECT_SUBSCENE_TYPES = [m_subs.GRASS_MAP, m_subs.SHADOW_CAST, m_subs.MAIN_OPAQUE,
    m_subs.MAIN_BLEND, m_subs.MAIN_XRAY, m_subs.MAIN_GLOW, 
    m_subs.MAIN_PLANE_REFLECT, m_subs.MAIN_CUBE_REFLECT,
    m_subs.MAIN_PLANE_REFLECT_BLEND, m_subs.MAIN_CUBE_REFLECT_BLEND,
    m_subs.COLOR_PICKING, m_subs.COLOR_PICKING_XRAY, m_subs.SHADOW_RECEIVE, 
    m_subs.OUTLINE_MASK, m_subs.DEBUG_VIEW];
exports.OBJECT_SUBSCENE_TYPES = OBJECT_SUBSCENE_TYPES;
// need light update
var LIGHT_SUBSCENE_TYPES = [m_subs.MAIN_OPAQUE, m_subs.MAIN_BLEND, m_subs.MAIN_XRAY,
    m_subs.MAIN_GLOW, m_subs.MAIN_PLANE_REFLECT, m_subs.MAIN_CUBE_REFLECT,
    m_subs.GOD_RAYS, m_subs.GOD_RAYS_COMBINE, m_subs.SKY,
    m_subs.MAIN_PLANE_REFLECT_BLEND, m_subs.MAIN_CUBE_REFLECT_BLEND,
    m_subs.LUMINANCE_TRUNCED, m_subs.SHADOW_RECEIVE, m_subs.SHADOW_CAST,
    m_subs.COLOR_PICKING, m_subs.COLOR_PICKING_XRAY, m_subs.OUTLINE_MASK];

var FOG_SUBSCENE_TYPES = [m_subs.MAIN_OPAQUE, m_subs.SSAO, m_subs.MAIN_BLEND,
    m_subs.MAIN_XRAY, m_subs.MAIN_GLOW, m_subs.MAIN_PLANE_REFLECT,
    m_subs.MAIN_CUBE_REFLECT, m_subs.MAIN_PLANE_REFLECT_BLEND, m_subs.MAIN_CUBE_REFLECT_BLEND];

// need time update
var TIME_SUBSCENE_TYPES = [m_subs.SHADOW_CAST, m_subs.MAIN_OPAQUE,
    m_subs.MAIN_BLEND, m_subs.MAIN_XRAY, m_subs.MAIN_GLOW,
    m_subs.MAIN_PLANE_REFLECT, m_subs.MAIN_CUBE_REFLECT,
    m_subs.MAIN_PLANE_REFLECT_BLEND, m_subs.MAIN_CUBE_REFLECT_BLEND,
    m_subs.COLOR_PICKING, m_subs.COLOR_PICKING_XRAY, m_subs.SHADOW_RECEIVE,
    m_subs.GOD_RAYS, m_subs.OUTLINE_MASK, m_subs.DEBUG_VIEW];

// need camera water distance update
var MAIN_SUBSCENE_TYPES = [m_subs.MAIN_OPAQUE, m_subs.MAIN_BLEND, m_subs.MAIN_XRAY,
    m_subs.MAIN_GLOW, m_subs.MAIN_PLANE_REFLECT, m_subs.MAIN_CUBE_REFLECT,
    m_subs.MAIN_PLANE_REFLECT_BLEND, m_subs.MAIN_CUBE_REFLECT_BLEND];

var SHORE_DIST_COMPAT = 100;

var MAX_BATCH_TEXTURES = 8;

var _main_scene = null;
var _active_scene = null;
var _scenes = [];
// not to be confused with scenegraph
var _scenes_graph = null;

var GRASS_MAP_MARGIN = 1E-4;

var MAX_SHADOW_CAST_BB_PROPORTION = 2;
var MAX_OPTIMAL_BB_ANGLE = Math.PI / 2;
var OPTIMAL_BB_COUNT = 10;
var OPTIMAL_BB_THRESHOLD = 0.1;

// prevent shadows stretching near edges
var SHADOW_MAP_EPSILON_XY = 0.005;
// fix depth rendering near clipping planes
var SHADOW_MAP_EPSILON_Z = 0.005;

var _vec2_tmp = new Float32Array(2);
var _vec3_tmp = new Float32Array(3);
var _vec3_tmp2 = new Float32Array(3);
var _quat4_tmp = new Float32Array(4);
var _vec4_tmp = new Float32Array(4);
var _mat4_tmp = new Float32Array(16);
var _corners_cache = new Float32Array(24);
var _corners_cache2 = new Float32Array(24);

var _bb_tmp = m_bounds.create_bb();
var _bb_tmp2 = m_bounds.create_bb();

var _shadow_cast_min_z = 0;
var _shadow_cast_max_z = -Infinity;

var _pixel = new Uint8Array(4);

exports.create_scene_render = function() {
    var render = {

    };

    return render;
}

/**
 * Set given scene as active
 */
exports.set_active = function(scene) {
    _active_scene = scene;
    m_sfx.set_active_scene(scene);
}

/**
 * Prepare given scene for rendering.
 * Executed after all objects added to scene.
 */
exports.prepare_rendering = function(scene, scene_main) {

    var render = scene._render;
    var queue = m_scgraph.create_rendering_queue(render.graph);

    if (scene == scene_main) {
        setup_scene_dim(scene, m_cont.get_viewport_width(), m_cont.get_viewport_height());

        // attach to existing (may already containt RTT queue)
        for (var i = 0; i < queue.length; i++)
            scene._render.queue.push(queue[i]);

    } else {
        var tex0 = scene._render_to_textures[0];

        var width = tex0.source_size;
        var height = tex0.source_size;

        setup_scene_dim(scene, width, height);

        for (var i = 0; i < queue.length; i++)
            scene_main._render.queue.push(queue[i]);
    }

    var subs_arr = subs_array(scene, TIME_SUBSCENE_TYPES);
    for (var j = 0; j < subs_arr.length; j++)
        subs_arr[j].wind.set(render.wind);

    // NOTE: draw all SHADOW_CAST subscenes to fill them with correct DEPTH data
    // before rendering
    for (var i = 0; i < render.queue.length; i++)
        if (render.queue[i].type == m_subs.SHADOW_CAST)
            m_render.draw(render.queue[i]);
}

exports.get_main = get_main;
function get_main() {
    if (!_main_scene)
        _main_scene = find_main_scene(_scenes);

    return _main_scene;
}

/**
 * Main scene - first non-RTT scene
 * should be executed after RTT assignment in create_texture_bpy()
 */
exports.find_main_scene = find_main_scene;
function find_main_scene(scenes) {
    for (var i = 0; i < scenes.length; i++) {
        var scene = scenes[i];

        if (!scene._render_to_textures || !scene._render_to_textures.length)
            return scene;
    }

    return null;
}

exports.get_active = get_active;
/**
 * @methodOf scenes
 */
function get_active() {
    if (!_active_scene)
        m_assert.panic("No active scene available");
    return _active_scene;
}



exports.check_active = check_active;
function check_active() {
    if (_active_scene)
        return true;
    else
        return false;
}

exports.get_camera = function(scene) {
    return scene._camera;
}

exports.get_all_scenes = get_all_scenes;
function get_all_scenes() {
    return _scenes;
}

exports.get_rendered_scenes = function() {
    if (_scenes.length == 1)
        return _scenes;

    for (var i = 0; i < _scenes.length; i++) {
        var graph = _scenes[i]._render.graph;
        m_graph.traverse(graph, function(node, attr) {
            var subs = attr;
            var draw_data = subs.draw_data;
            for (var j = 0; j < draw_data.length; j++) {
                var bundles = draw_data[j].bundles;
                for (var k = 0; k < bundles.length; k++) {
                    var bundle = bundles[k];
                    var textures = bundle.batch.textures;
                    var bpy_tex_names = bundle.batch.bpy_tex_names;
                    var batch = null;
                    for (var m = 0; m < textures.length; m++)
                        if (textures[m].source == "SCENE" && textures[m].source_id == _scenes[i]["name"]
                                && subs.type != m_subs.COPY) {
                            m_print.error("Texture-scene loop detected. A scene is " +
                                "rendered to texture \"" + bpy_tex_names[m] +
                                "\" yet this texture belongs " +
                                "to the same scene.");
                            batch = bundle.batch;
                            break;
                        }

                    if (batch) {
                        var old_textures = batch.textures;
                        batch.textures = [];
                        batch.texture_names = [];
                        m_batch.update_batch_material_error(batch, null);
                        m_batch.update_shader(batch);
                        m_subs.append_draw_data(subs, bundle);
                        for (var m = 0; m < old_textures.length; m++) {
                            var old_tex = old_textures[m];
                            m_textures.cleanup_unused(old_tex);
                        }
                    }
                }
            }
        });
    }

    var scenes = [];

    for (var i = 0; i < _scenes.length; i++) {
        var scene = _scenes[i];

        // begin from the first non-RTT scene
        if (scene._render_to_textures.length)
            continue;

        var node = m_graph.node_by_attr(_scenes_graph, scene);
        m_graph.enforce_acyclic(_scenes_graph, node);
        var graph = m_graph.subgraph_node_conn(_scenes_graph, node, m_graph.BACKWARD_DIR);
        graph = m_graph.topsort(graph);

        m_graph.traverse(graph, function(node, attr) {
            scenes.push(attr);
        });

        break;
    }

    return scenes;
}

exports.update_scene_graph = update_scene_graph;
/**
 * Update scene._render
 * prepare camera before execution
 * @methodOf scenes
 */
function update_scene_graph(bpy_scene, scene_dst, scene_objects, lamps, bpy_mesh_objs, bpy_empty_objs) {
    var cam_scene_data = m_obj_util.get_scene_data(scene_dst._camera, scene_dst);
    var rtt_sort_fun = function(bpy_tex1, bpy_tex2) {
        return bpy_tex2.source_size - bpy_tex1.source_size;
    }
    var rtt_sorted = [];

    var updates = {
        reflection_params: extract_reflections_params(bpy_scene, scene_objects, bpy_mesh_objs)
    };

    m_scgraph.update_rendering_graph(scene_dst._render, cam_scene_data, scene_dst._camera.render, rtt_sorted, updates);

    exports.prepare_rendering(scene_dst, scene_dst);

    exports.generate_auxiliary_batches(scene_dst, scene_dst._render.graph)
}

exports.append_scene = append_scene;
/**
 * Update scene._render
 * prepare camera before execution
 * @methodOf scenes
 */
function append_scene(bpy_scene, scene_objects, lamps, bpy_mesh_objs, bpy_empty_objs) {
    bpy_scene._render_to_textures = bpy_scene._render_to_textures || [];
    bpy_scene._nla = null;

    var render = bpy_scene._render;
    var cam_scene_data = m_obj_util.get_scene_data(bpy_scene._camera, bpy_scene);
    var cam_render = bpy_scene._camera.render;

    render.video_textures = [];

    var world = bpy_scene["world"];

    render.lamps_number      = lamps.length;
    render.sun_exist         = check_scenes_sun(lamps);
    render.sky_params        = extract_sky_params(world, render.sun_exist);
    render.world_light_set   = get_world_light_set(world, render.sky_params);
    render.world_fog_set     = get_world_fog_set(world);
    render.hmd_stereo_use    = !bpy_scene._render_to_textures.length &&
                               check_hmd_stereo_use(cam_scene_data);
    render.anaglyph_use      = !bpy_scene._render_to_textures.length &&
                               check_anaglyph_use(cam_scene_data);
    // TODO: replace the flags (sidebyside_use, anaglyph_use, hmd_stereo_use) by an enum parameter
    render.sidebyside_use    = !bpy_scene._render_to_textures.length &&
                               check_sidebyside_use(cam_scene_data);
    render.anchor_visibility = !render.anaglyph_use && !render.sidebyside_use &&
                               check_anchor_visibility_objects(bpy_scene, bpy_empty_objs);
    render.reflection_params = extract_reflections_params(bpy_scene, scene_objects, bpy_mesh_objs);
    render.bloom_params      = extract_bloom_params(bpy_scene);
    render.mb_params         = extract_mb_params(bpy_scene);
    render.cc_params         = extract_cc_params(bpy_scene);
    render.god_rays_params   = extract_god_rays_params(bpy_scene);
    render.outline_params    = extract_outline_params(bpy_scene);
    render.glow_params       = extract_glow_params(bpy_scene);

    render.dof               = cfg_def.dof && (cam_render.dof_distance > 0 || cam_render.dof_object);
    render.motion_blur       = cfg_def.motion_blur && bpy_scene["b4w_enable_motion_blur"];
    render.compositing       = cfg_def.compositing && bpy_scene["b4w_enable_color_correction"];
    render.antialiasing      = cfg_def.antialiasing &&
                              cfg_def.msaa_samples == 1 &&
                              (bpy_scene["b4w_antialiasing_quality"] != "NONE");
    render.ssao              = cfg_def.ssao && bpy_scene["b4w_enable_ssao"];
    render.god_rays          = cfg_def.god_rays && bpy_scene["b4w_enable_god_rays"] && render.sun_exist;
    render.depth_tex         = cfg_def.depth_tex_available;
    render.glow_over_blend   = bpy_scene["b4w_glow_settings"]["render_glow_over_blend"];
    render.ssao_params       = extract_ssao_params(bpy_scene);

    var materials_params     = get_material_params(bpy_mesh_objs)
    render.materials_params  = materials_params;
    render.refractions       = check_refraction(bpy_scene, materials_params);
    render.shadow_params     = extract_shadow_params(bpy_scene, lamps, bpy_mesh_objs);
    render.water_params      = get_water_params(bpy_mesh_objs);
    render.xray              = check_xray_materials(bpy_mesh_objs);
    render.soft_particles    = check_soft_particles(bpy_mesh_objs);
    render.shore_smoothing   = check_shore_smoothing(bpy_mesh_objs);
    render.dynamic_grass     = check_dynamic_grass(bpy_scene, bpy_mesh_objs);
    render.color_picking     = check_selectable_objects(bpy_scene, bpy_mesh_objs);
    render.outline           = check_outlining_objects(bpy_scene, bpy_mesh_objs);
    render.glow_materials    = check_glow_materials(bpy_scene, bpy_mesh_objs);
    render.lod_smooth_type   = bpy_scene["b4w_lod_smooth_type"];
    render.lod_hyst_interval = bpy_scene["b4w_lod_hyst_interval"];

    var reflection_quality = cfg_def.reflection_quality ? cfg_def.reflection_quality :
            bpy_scene["b4w_reflection_quality"];

    switch (reflection_quality) {
    case "LOW":
        render.cubemap_refl_size = cfg_scs.cube_reflect_low;
        render.plane_refl_size = cfg_scs.plane_reflect_low;
        break;
    case "MEDIUM":
        render.cubemap_refl_size = cfg_scs.cube_reflect_medium;
        render.plane_refl_size = cfg_scs.plane_reflect_medium;
        break;
    case "HIGH":
        render.cubemap_refl_size = cfg_scs.cube_reflect_high;
        render.plane_refl_size = cfg_scs.plane_reflect_high;
        break;
    default:
        render.cubemap_refl_size = cfg_scs.cube_reflect_low;
        render.plane_refl_size = cfg_scs.plane_reflect_low;
        break;
    }

    if (m_cont.is_hidpi()) {
        m_print.log("%cENABLE HIDPI MODE", "color: #00a");
        render.aa_quality = "AA_QUALITY_LOW";
        render.resolution_factor = 1.0;
        cfg_def.msaa_samples = 1;
    } else if (cfg_def.msaa_samples > 1) {
        m_print.log("%cENABLE MSAA RENDERING: " + cfg_def.msaa_samples + "x",
                "color: #00a");
        render.resolution_factor = 1.0;
    } else {
        render.aa_quality = "AA_QUALITY_" + bpy_scene["b4w_antialiasing_quality"];

        if (cfg_def.quality === m_cfg.P_ULTRA)
            render.resolution_factor = 1.33;
        else
            render.resolution_factor = 1.0;

    }
    var rtt_sort_fun = function(bpy_tex1, bpy_tex2) {
        return bpy_tex2.source_size - bpy_tex1.source_size;
    }

    var rtt_sorted = bpy_scene._render_to_textures.sort(rtt_sort_fun);
    render.graph = m_scgraph.create_rendering_graph(render, cam_scene_data,
                cam_render, rtt_sorted);

    render.queue = [];

    render.need_shadow_update = false;
    render.need_grass_map_update = false;
    render.need_outline = false;
    render.wind = new Float32Array(3);

    _scenes.push(bpy_scene);

    if (!_scenes_graph)
        _scenes_graph = m_graph.create();

    m_graph.append_node_attr(_scenes_graph, bpy_scene);

    // scene_data is ready after scene appending
    for (var i = 0; i < scene_objects.length; i++)
        m_obj_util.scene_data_set_active(scene_objects[i], true, bpy_scene);

    var canvas_container_elem = m_cont.get_container();
    m_cont.resize(canvas_container_elem.clientWidth,
            canvas_container_elem.clientHeight, true);
}

exports.append_scene_vtex = function(scene, textures, data_id) {
    for (var i = 0; i < textures.length; i++) {
        var tex = textures[i]._render
        if (tex && tex.is_movie) {
            tex.vtex_data_id = data_id;
            scene._render.video_textures.push(textures[i]);
        }
    }
}

function extract_shadow_params(bpy_scene, lamps, bpy_mesh_objs) {

    if (!check_render_shadows(bpy_scene, lamps, bpy_mesh_objs))
        return null;

    var shs = bpy_scene["b4w_shadow_settings"];
    var rshs = {};
    if (shs["csm_resolution"] > cfg_lim.max_texture_size) {
        rshs.csm_resolution = cfg_lim.max_texture_size;
        m_print.error("Shadow map texture has unsupported size. Changed to "
                + cfg_lim.max_texture_size + ".");
    } else
        rshs.csm_resolution         = shs["csm_resolution"];

    cfg_def.shadow_blur_samples = cfg_def.shadow_blur_samples ? cfg_def.shadow_blur_samples : shs["blur_samples"];
    rshs.soft_shadows = shs["soft_shadows"];

    var use_ssao = cfg_def.ssao && bpy_scene["b4w_enable_ssao"];
    var shadow_lamps = m_obj_util.get_shadow_lamps(lamps, use_ssao);

    rshs.self_shadow_polygon_offset = shs["self_shadow_polygon_offset"];
    rshs.self_shadow_normal_offset  = shs["self_shadow_normal_offset"];
    rshs.enable_csm                 = shs["b4w_enable_csm"] && shadow_lamps.length == 1;
    
    if (shs["b4w_enable_csm"] && shs["csm_num"] > 1 && shadow_lamps.length > 1)
        m_print.warn("Disabling Cascaded Shadow Maps because of multiple shadow casting lamps.");

    rshs.lamp_types = [];
    rshs.spot_sizes = [];
    rshs.clip_start = [];
    rshs.clip_end = [];

    for (var i = 0; i < shadow_lamps.length; i++) {
        rshs.lamp_types.push(shadow_lamps[i].light.type);
        rshs.spot_sizes.push(shadow_lamps[i].light.spot_size);
        rshs.clip_start.push(shadow_lamps[i].light.clip_start);
        rshs.clip_end.push(shadow_lamps[i].light.clip_end);
        if ((rshs.lamp_types[i] == "SPOT" || rshs.lamp_types[i] == "POINT") &&
                rshs.enable_csm) {
            m_print.warn("Generating shadows for SPOT " +
                        "or POINT light. Disabling Cascaded Shadow Maps");
            rshs.enable_csm = false;
        }
    }

    if (rshs.enable_csm) {
        rshs.csm_num                    = shs["csm_num"];
        rshs.csm_first_cascade_border   = shs["csm_first_cascade_border"];
        rshs.first_cascade_blur_radius  = shs["first_cascade_blur_radius"];
        rshs.csm_last_cascade_border    = shs["csm_last_cascade_border"];
        rshs.last_cascade_blur_radius   = shs["last_cascade_blur_radius"];

        rshs.fade_last_cascade          = shs["fade_last_cascade"];
        rshs.blend_between_cascades     = shs["blend_between_cascades"];
    } else {
        rshs.csm_num                    = 1;
        rshs.csm_first_cascade_border   = shs["csm_first_cascade_border"];
        rshs.first_cascade_blur_radius  = shs["first_cascade_blur_radius"];
        rshs.csm_last_cascade_border    = shs["csm_last_cascade_border"];
        rshs.last_cascade_blur_radius   = shs["last_cascade_blur_radius"];

        rshs.fade_last_cascade          = false;
        rshs.blend_between_cascades     = false;
    }
    return rshs;
}

function check_render_shadows(bpy_scene, lamps, bpy_mesh_objs) {

    if (lamps.length == 0)
        return false;

    if (cfg_def.shadows) {
        switch (bpy_scene["b4w_render_shadows"]) {
        case "OFF":
            return false;
        case "ON":
            return true;
        case "AUTO":
        }
    } else
        return false

    var has_casters = false;
    var has_receivers = false;
    var use_ssao = cfg_def.ssao && bpy_scene["b4w_enable_ssao"];
    if (lamps.length == 0 && !use_ssao)
        return false;

    for (var i = 0; i < bpy_mesh_objs.length; i++) {
        var bpy_obj = bpy_mesh_objs[i];

        if (bpy_obj["b4w_shadow_cast"])
            has_casters = true;

        if (bpy_obj["b4w_shadow_receive"])
            has_receivers = true;

        if ((use_ssao || has_casters) && has_receivers)
            return true;
    }
    // no casters, no receivers
    return false;
}


function check_scenes_sun(lamps) {
    for (var i = 0; i < lamps.length; i++)
        if (lamps[i].light.type == "SUN")
            return true;
    return false;

}
/**
 * Check if shore smoothing required for given bpy objects which represent the scene.
 * Shore smoothing required if we have shore smoothing flag
 * enabled for water materials
 */
function check_shore_smoothing(bpy_objects) {

    if (!cfg_def.shore_smoothing)
        return false;

    var mats = get_objs_materials(bpy_objects);

    for (var i = 0; i < mats.length; i++) {
        var mat = mats[i];

        if (mat.water_settings.is_water && mat.water_settings.shore_smoothing)
            return true;
    }

    return false;
}

function check_soft_particles(bpy_objects) {
    for (var i = 0; i < bpy_objects.length; i++) {
        var bpy_obj = bpy_objects[i];
        var psystems = bpy_obj["particle_systems"];
        for (var j = 0; j < psystems.length; j++) {
            var pset = psystems[j]["settings"];
            if (m_obj_util.check_obj_soft_particles_accessibility(
                    bpy_objects[i]._object, pset))
                return true;
        }
    }
    return false;

}
/**
 * Check water parameters based on the given bpy objects.
 */
function get_water_params(bpy_objects) {

    // TODO: Now returns only parameters from a water obj which is considered
    // to be the most important one. Need to collect info from other water
    // objects.
    var mats = get_objs_materials(bpy_objects);
    var water_params = [];

    for (var i = 0; i < mats.length; i++) {
        var mat = mats[i];

        if (mat.water_settings.is_water) {

            var wp = {};
            // set water level to obect's origin y coord
            for (var j = 0; j < bpy_objects.length; j++) {
                var bpy_obj = bpy_objects[j];
                var mesh_mats = bpy_obj._object.materials;
                for (var k = 0; k < mesh_mats.length; k++) {
                    var mesh_mat = mesh_mats[k];
                    if (mesh_mat == mat)
                        wp.water_level = bpy_obj["location"][2];
                }
            }

            // fog stuff
            wp.fog_color_density = new Float32Array(4);
            wp.fog_color_density.set(mat.water_settings.fog_color);
            wp.fog_color_density[3] = mat.water_settings.fog_density;

            // dynamics stuff
            if (mat.water_settings.is_dynamic) {
                wp.dynamic           = true;
                wp.waves_height      = mat.water_settings.waves_height;
                wp.waves_length      = mat.water_settings.waves_length;
                wp.dst_noise_scale0  = mat.water_settings.dst_noise_scale0;
                wp.dst_noise_scale1  = mat.water_settings.dst_noise_scale1;
                wp.dst_noise_freq0   = mat.water_settings.dst_noise_freq0;
                wp.dst_noise_freq1   = mat.water_settings.dst_noise_freq1;
                wp.dir_min_shore_fac = mat.water_settings.dir_min_shore_fac;
                wp.dir_freq          = mat.water_settings.dir_freq;
                wp.dir_noise_scale   = mat.water_settings.dir_noise_scale;
                wp.dir_noise_freq    = mat.water_settings.dir_noise_freq;
                wp.dir_min_noise_fac = mat.water_settings.dir_min_noise_fac;
                wp.dst_min_fac       = mat.water_settings.dst_min_fac;
                wp.waves_hor_fac     = mat.water_settings.waves_hor_fac;
            } else {
                wp.dynamic      = false;
                wp.waves_height = 0.0;
                wp.waves_length = 0.0;
            }

            // caustics stuff
            wp.caustics           = mat.water_settings.enable_caust;
            wp.caustic_scale      = mat.water_settings.caust_scale;
            wp.caustic_brightness = mat.water_settings.caust_brightness;
            wp.caustic_speed      = new Float32Array([0.3, 0.7]);

            wp.shoremap_image  = null;

            var texture_slots = mat.texture_slots;

            for (var j = 0; j < texture_slots.length; j++) {
                var texture = texture_slots[j]["texture"];
                if (texture["b4w_shore_dist_map"] === true &&
                        texture["image"]["source"] == "FILE") {
                    wp.shoremap_image    = texture["image"];
                    wp.shoremap_tex_size = texture["image"]["size"][0];
                    wp.max_shore_dist    = texture["b4w_max_shore_dist"];

                    var shore_boundings = texture["b4w_shore_boundings"];
                    wp.shoremap_center = [(shore_boundings[0] + shore_boundings[1]) / 2,
                                          (shore_boundings[2] + shore_boundings[3]) / 2];

                    wp.shoremap_size = [shore_boundings[0] - shore_boundings[1],
                                        shore_boundings[2] - shore_boundings[3]];

                }
            }
            water_params.push(wp);
        }
    }

    if (water_params.length > 0) {
        var wp = water_params[0];
        if (!wp.dynamic)
            // set water params from water with "dynamic" property
            for (var i = 0; i < water_params.length; i++)
                if (water_params[i].dynamic)
                    wp = water_params[i];

        return wp;
    } else
        return null;
}

function get_material_params(bpy_objects) {

    var materials_properties_existance = {
        refractions: false
    };

    var materials = get_objs_materials(bpy_objects);

    var get_nodes_properties = function(node_tree, material) {
        if (!node_tree)
            return;
        var nodes = node_tree["nodes"];
        for (var j = 0; j < nodes.length; j++) {
            var node = nodes[j];

            if (node["type"] == "GROUP" && node["node_group"])
                get_nodes_properties(node["node_group"]["node_tree"], material);

            if (node["type"] == "GROUP" && node["node_tree_name"] == "B4W_REFRACTION")
                materials_properties_existance.refractions = true;

            if (node["type"] == "BSDF_TRANSPARENT")
                if (node["b4w_use_alpha"])
                    material.blend_mode = "ALPHA_SORT";  // dirty hack, should be improved
                else
                    materials_properties_existance.refractions = true;

            if (node["type"] == "BSDF_PRINCIPLED")
                materials_properties_existance.refractions = true;
        }
    }

    for (var i = 0; i < materials.length; i++) {
        var material = materials[i];

        if (material.is_refractive)
            materials_properties_existance.refractions = true;

        if (material.node_tree)
            get_nodes_properties(material.node_tree, material);
    }

    return materials_properties_existance;
}

function check_anaglyph_use(cam_scene_data) {
    // NOTE: disable anaglyph stereo for the non-PERSP camera
    if (cam_scene_data.cameras[0].type != m_cam.TYPE_PERSP && cfg_def.stereo == "ANAGLYPH") {
        m_print.warn("Anaglyph stereo is disabled for the non-perspective camera");
        cfg_def.stereo = "NONE";
        return false;
    } else
        return cfg_def.stereo == "ANAGLYPH";
}

function check_sidebyside_use(cam_scene_data) {
    // NOTE: disable side-by-side stereo for the non-PERSP camera
    if (cam_scene_data.cameras[0].type != m_cam.TYPE_PERSP && cfg_def.stereo == "SIDEBYSIDE") {
        m_print.warn("Side-by-side stereo is disabled for the non-perspective camera");
        cfg_def.stereo = "NONE";
        return false;
    } else
        return cfg_def.stereo == "SIDEBYSIDE";
}

function check_hmd_stereo_use(cam_scene_data) {
    // NOTE: disable head-mounted display stereo for the non-PERSP camera
    if (cfg_def.stereo == "HMD") {
        if (cam_scene_data.cameras[0].type != m_cam.TYPE_PERSP) {
            m_print.warn("Head-mounted display stereo is disabled for the non-perspective camera");
            cfg_def.stereo = "NONE";
            return false;
        }
        if (!m_input.can_use_device(m_input.DEVICE_HMD)) {
            m_print.warn("Head-mounted display stereo is disabled for the non-WebVR and non-mobile devices");
            cfg_def.stereo = "NONE";
            return false;
        }
    }
    return cfg_def.stereo == "HMD";
}

/**
 * Check if reflections are required for the given scene.
 * Returns an array of reflection planes and cube reflectibe objs on the scene.
 */
function extract_reflections_params(bpy_scene, scene_objects, bpy_mesh_objs) {

    if (cfg_def.reflections) {
        switch (bpy_scene["b4w_render_reflections"]) {
        case "OFF":
            return false;
        case "ON":
        }
    } else
        return false;

    var refl_plane_objs = [];
    var refl_cube_objs = [];
    var has_reflexible = false;
    var has_pbr_reflexible = false;
    var has_blend_reflexible = false;

    for (var i = 0; i < scene_objects.length; i++) {
        var obj = scene_objects[i];

        if (obj.render.reflective && obj.render.reflection_type == "CUBE")
            refl_cube_objs.push(obj);

        if (obj.render.reflective && obj.render.reflection_type == "PBR")
            has_pbr_reflexible = true;

        if (obj.reflective_objs.length) {
            var refl_plane_id = null;
            for (var j = 0; j < refl_plane_objs.length; j++) {
                var rp = refl_plane_objs[j];
                if (rp == obj) {
                     refl_plane_id = j;
                     break;
                }
            }

            // we need only unique reflection planes
            if (refl_plane_id == null)
                refl_plane_objs.push(obj);
        }

    }

    for (var i = 0; i < bpy_mesh_objs.length; i++) {
        var bpy_obj = bpy_mesh_objs[i];

        if (bpy_obj["b4w_reflexible"])
            has_reflexible = true;
        if (check_blend_reflexible(bpy_obj))
            has_blend_reflexible = true;
    }

    return {refl_plane_objs: refl_plane_objs,
            refl_cube_objs:   refl_cube_objs,
            cube_refl_subs:  [],
            cube_refl_subs_blend:  [],
            plane_refl_subs: [],
            plane_refl_subs_blend: [],
            has_reflexible: has_reflexible,
            has_pbr_reflexible: has_pbr_reflexible,
            has_blend_reflexible: has_blend_reflexible
           };
}

function check_blend_reflexible(bpy_obj) {

    if (!bpy_obj["b4w_reflexible"])
        return;

    var materials = bpy_obj._object.materials;
    for (var i = 0; i < materials.length; i++) {
        var blend_mode = materials[i].blend_mode;
        if (blend_mode != "OPAQUE" && blend_mode != "CLIP"
                && blend_mode != "ALPHA_ANTIALIASING")
            return true;
    }

    return false;
}

/**
 * Check dynamic sky parameters
 */
function extract_sky_params(world, sun_exist) {

    var sky_settings = world["b4w_sky_settings"];
    var sky_params = {};

    sky_params.render_sky                  = sky_settings["render_sky"] || sky_settings["procedural_skydome"];
    sky_params.procedural_skydome          = sky_settings["procedural_skydome"];
    sky_params.use_as_environment_lighting = sky_settings["use_as_environment_lighting"];
    sky_params.sky_color                   = sky_settings["color"];
    sky_params.rayleigh_brightness         = sky_settings["rayleigh_brightness"];
    sky_params.mie_brightness              = sky_settings["mie_brightness"];
    sky_params.spot_brightness             = sky_settings["spot_brightness"];
    sky_params.scatter_strength            = sky_settings["scatter_strength"];
    sky_params.rayleigh_strength           = sky_settings["rayleigh_strength"];
    sky_params.mie_strength                = sky_settings["mie_strength"];
    sky_params.rayleigh_collection_power   = sky_settings["rayleigh_collection_power"];
    sky_params.mie_collection_power        = sky_settings["mie_collection_power"];
    sky_params.mie_distribution            = sky_settings["mie_distribution"];
    sky_params.reflexible                  = sky_settings["reflexible"];
    sky_params.reflexible_only             = sky_settings["reflexible_only"];

    if (!sun_exist && sky_settings["procedural_skydome"])
        m_print.warn("There is no sun on the scene. " +
                          "Procedural sky will use a default sun position.");

    return sky_params;
}

/**
 * Extract ssao parameters
 */
function extract_ssao_params(bpy_scene) {
    var ssao_params   = {};
    var ssao_settings = bpy_scene["b4w_ssao_settings"];

    ssao_params.radius_increase         = ssao_settings["radius_increase"];
    ssao_params.hemisphere              = ssao_settings["hemisphere"];
    ssao_params.blur_depth              = ssao_settings["blur_depth"];
    ssao_params.blur_discard_value      = ssao_settings["blur_discard_value"];
    ssao_params.influence               = ssao_settings["influence"];
    ssao_params.dist_factor             = ssao_settings["dist_factor"];
    ssao_params.samples                 = ssao_settings["samples"];

    return ssao_params;
}

/**
 * Extract bloom parameters
 */
function extract_bloom_params(bpy_scene) {

    if (!(cfg_def.bloom && bpy_scene["b4w_enable_bloom"]))
        return null;

    var bloom_params   = {};
    var bloom_settings = bpy_scene["b4w_bloom_settings"];

    bloom_params.blur     = bloom_settings["blur"];
    bloom_params.edge_lum = bloom_settings["edge_lum"];
    bloom_params.key      = bloom_settings["key"];
    bloom_params.adaptive = bloom_settings["adaptive"];
    bloom_params.average_luminance = bloom_settings["average_luminance"];

    return bloom_params;
}

/**
 * Extract motion blur parameters
 */
function extract_mb_params(bpy_scene) {

    var mb_params   = {};
    var mb_settings = bpy_scene["b4w_motion_blur_settings"];

    mb_params.mb_decay_threshold = mb_settings["motion_blur_decay_threshold"];
    mb_params.mb_factor          = mb_settings["motion_blur_factor"];

    return mb_params;
}

/**
 * Extract color correction parameters
 */
function extract_cc_params(bpy_scene) {

    var cc_params   = {};
    var cc_settings = bpy_scene["b4w_color_correction_settings"];

    cc_params.brightness = cc_settings["brightness"];
    cc_params.contrast   = cc_settings["contrast"];
    cc_params.exposure   = cc_settings["exposure"];
    cc_params.saturation = cc_settings["saturation"];

    return cc_params;
}

/**
 * Extract god rays parameters
 */
function extract_god_rays_params(bpy_scene) {

    var god_rays_params   = {};
    var god_rays_settings = bpy_scene["b4w_god_rays_settings"];

    god_rays_params.intensity      = god_rays_settings["intensity"];
    god_rays_params.max_ray_length = god_rays_settings["max_ray_length"];
    god_rays_params.steps_per_pass = god_rays_settings["steps_per_pass"];

    return god_rays_params;
}

/**
 * Extract outline parameters
 */
function extract_outline_params(bpy_scene) {

    var outline_params   = {};

    outline_params.outline_color  = bpy_scene["b4w_outline_color"];
    outline_params.outline_factor = bpy_scene["b4w_outline_factor"];

    return outline_params;
}

/**
 * Extract glow parameters
 */
function extract_glow_params(bpy_scene) {

    var glow_params   = {};
    var glow_settings = bpy_scene["b4w_glow_settings"];

    glow_params.small_glow_mask_coeff = glow_settings["small_glow_mask_coeff"];
    glow_params.large_glow_mask_coeff = glow_settings["large_glow_mask_coeff"];
    glow_params.small_glow_mask_width = glow_settings["small_glow_mask_width"];
    glow_params.large_glow_mask_width = glow_settings["large_glow_mask_width"];

    return glow_params;
}

/**
 * Get world lights setting
 */
function get_world_light_set(world, sky_params) {

    var wls = world["light_settings"];

    var wls_params = {};
    wls_params.environment_energy       = wls["environment_energy"];
    wls_params.use_environment_light    = wls["use_environment_light"];
    wls_params.environment_color        = wls["environment_color"];
    wls_params.horizon_color            = world["horizon_color"].slice(0);
    wls_params.zenith_color             = world["zenith_color"].slice(0);
    wls_params.use_sky_paper            = world["use_sky_paper"];
    wls_params.use_sky_blend            = world["use_sky_blend"];
    wls_params.use_sky_real             = world["use_sky_real"];
    wls_params.sky_texture_slot         = null;
    wls_params.sky_texture_param        = null;
    wls_params.environment_texture_slot = null;
    wls_params.ngraph_proxy_id = "";

    if (sky_params.render_sky && world["use_nodes"] && world["node_tree"]) {
        var node_tree = world["node_tree"];
        var uuid = world["uuid"];
        var mat_name = world["name"];
        var ngraph_proxy = m_nodemat.compose_ngraph_proxy(node_tree, uuid, 
                false, world["name"] + "(World)", mat_name, "MAIN", null, []);

        wls_params.ngraph_proxy_id = ngraph_proxy.id;
    }

    var use_environment_light = true;
    if (wls_params.use_environment_light && wls_params.environment_color == "SKY_TEXTURE" &&
        !(sky_params.procedural_skydome && sky_params.use_as_environment_lighting)) {
        var tex_slot = null;
        for (var i = 0; i < world["texture_slots"].length; i++)
            if (world["texture_slots"][i]["texture"]["b4w_use_as_environment_lighting"] &&
                    !world["texture_slots"][i]["texture"]["b4w_use_as_skydome"]) {
                tex_slot = world["texture_slots"][i];
                break;
            }
        if (!tex_slot) {
            // m_print.warn("environment lighting is set to 'Sky Texture'" +
            //         ", but there is no world texture with 'Sky Texture Usage' property set to 'ENVIRONMENT_LIGHTING'");
            use_environment_light = false;
        } else
            wls_params.environment_texture_slot = tex_slot;
    }

    for (var i = 0; i < world["texture_slots"].length; i++)
        if (world["texture_slots"][i]["texture"]["b4w_use_as_skydome"]) {
            var sts = world["texture_slots"][i];
            if (sts["texture"]["image"]) {
                use_environment_light = true;
                wls_params.sky_texture_slot = sts;
                var tex_size = Math.min(cfg_lim.max_cube_map_texture_size,
                        m_tex.calc_pot_size(sts["texture"]["image"]["size"][0] / 3));
                wls_params.sky_texture_param = {
                    tex_size: tex_size,
                    blend_factor: sts["blend_factor"],
                    horizon_factor: sts["horizon_factor"],
                    zenith_up_factor: sts["zenith_up_factor"],
                    zenith_down_factor: sts["zenith_down_factor"],
                    color: sts["color"],
                    default_value: sts["default_value"],
                    invert: sts["invert"],
                    use_rgb_to_intensity: sts["use_rgb_to_intensity"],
                    blend_type: sts["blend_type"],
                    // stencil: sts["stencil"],
                    use_map_blend: sts["use_map_blend"],
                    use_map_horizon: sts["use_map_horizon"],
                    use_map_zenith_up: sts["use_map_zenith_up"],
                    use_map_zenith_down: sts["use_map_zenith_down"]
                }
            }
            break;
        }

    wls_params.use_environment_light = wls_params.use_environment_light ?
            use_environment_light : false;

    return wls_params;
}

function get_world_fog_set(world) {
    var wfs = world["fog_settings"];

    var wfs_params = {};
    wfs_params.use_fog = wfs["use_fog"];
    wfs_params.intensity = wfs["intensity"];
    wfs_params.depth = wfs["depth"];
    wfs_params.start = wfs["start"];
    wfs_params.height = wfs["height"];
    wfs_params.falloff = wfs["falloff"];
    if (wfs["use_custom_color"])
        wfs_params.color = wfs["color"].slice(0);
    else
        wfs_params.color = world["horizon_color"].slice(0);

    var fog_color = wfs_params.color;
    var fog_dens = 1.0 / wfs_params.depth;
    wfs_params.fog_color_density = new Float32Array([fog_color[0],
                                                 fog_color[1],
                                                 fog_color[2],
                                                 fog_dens]);
    wfs_params.fog_params = new Float32Array([wfs_params.intensity,
                                                 wfs_params.depth,
                                                 wfs_params.start,
                                                 wfs_params.height]);
    return wfs_params;
}

/**
 * To render dynamic grass following conditions must be met:
 * enabled global setting
 * at least one terrain material
 * at least one HAIR particle system (settings) with dynamic grass enabled
 */
function check_dynamic_grass(bpy_scene, bpy_objects) {

    if (!cfg_def.dynamic_grass)
        return false;

    switch (bpy_scene["b4w_render_dynamic_grass"]) {
    case "OFF":
        return false;
    case "ON":
        return true;
    case "AUTO":
        // process objects
    }

    var has_terrain = false;
    var has_dyn_grass = false;

    for (var i = 0; i < bpy_objects.length; i++) {
        var bpy_obj = bpy_objects[i];
        var materials = bpy_obj._object.materials;
        for (var j = 0; j < materials.length; j++) {
            var mat = materials[j];
            if (mat.terrain_settings.is_terrain)
                has_terrain = true;
        }

        var psystems = bpy_obj["particle_systems"];
        for (var j = 0; j < psystems.length; j++) {
            var pset = psystems[j]["settings"];
            if (pset["type"] == "HAIR" && pset["b4w_dynamic_grass"])
                has_dyn_grass = true;
        }

        if (has_terrain && has_dyn_grass)
            return true;
    }

    return false;
}

function check_selectable_objects(bpy_scene, bpy_objects) {
    if (cfg_out.outlining_overview_mode)
        return true;

    if (cfg_def.enable_selectable) {
        switch (bpy_scene["b4w_enable_object_selection"]) {
        case "OFF":
            return false;
        case "ON":
            return true;
        case "AUTO":
            for (var i = 0; i < bpy_objects.length; i++)
                if (bpy_objects[i]._object.render.selectable)
                    return true;
            return false;
        }
    } else
        return false;
}

function check_outlining_objects(bpy_scene, bpy_objects) {
    if (cfg_out.outlining_overview_mode)
        return true;

    if (cfg_def.enable_outlining)
        switch (bpy_scene["b4w_enable_outlining"]) {
        case "OFF":
            return false;
        case "ON":
            return true;
        case "AUTO":
            for (var i = 0; i < bpy_objects.length; i++)
                if (bpy_objects[i]._object.render.outlining)
                    return true;
            return false;
        }
    else
        return false;
}

function check_glow_materials(bpy_scene, bpy_objects) {
    if (cfg_def.glow_materials) {
        switch (bpy_scene["b4w_enable_glow_materials"]) {
        case "OFF":
            return false;
        case "ON":
            return true;
        case "AUTO":
            for (var i = 0; i < bpy_objects.length; i++) {
                var materials = bpy_objects[i]._object.materials;
                for (var j = 0; j < materials.length; j++) {
                    if (m_nodemat.check_material_glow_output(materials[j]))
                        return true;
                }
            }
            return false;
        }
    } else
        return false;
}

function check_refraction(bpy_scene, mat_params) {
    if (cfg_def.refractions) {
        switch (bpy_scene["b4w_render_refractions"]) {
        case "OFF":
            return false;
        case "ON":
            return true;
        case "AUTO":
            return mat_params.refractions
        }
    } else
        return false;
}

function check_xray_materials(bpy_objects) {
    for (var i = 0; i < bpy_objects.length; i++) {
        var materials = bpy_objects[i]._object.materials;
        for (var j = 0; j < materials.length; j++) {
            var mat = materials[j];
            if (mat.render_above_all && mat.blend_mode != "OPAQUE"
                    && mat.blend_mode != "CLIP" 
                    && mat.blend_mode != "ALPHA_ANTIALIASING")
                return true;
        }
    }
    return false;
}

function check_anchor_visibility_objects(bpy_scene, bpy_empty_objs) {

    switch (bpy_scene["b4w_enable_anchors_visibility"]) {
    case "OFF":
        return false;
    case "ON":
        return true;
    case "AUTO":
        for (var i = 0; i < bpy_empty_objs.length; i++) {
            var obj = bpy_empty_objs[i]._object;
            if (obj.anchor && obj.anchor.detect_visibility)
                return true;
        }
        return false;
    }
}

exports.get_graph = function(scene) {
    return scene._render.graph;
}

/**
 * Generate non-object batches for graph subscenes
 */
exports.generate_auxiliary_batches = function(scene, graph) {
    m_graph.traverse(graph, function(node, attr) {
        var subs = attr;

        var batch = null;

        switch (subs.type) {
        case m_subs.POSTPROCESSING:
            batch = m_batch.create_postprocessing_batch(subs.pp_effect);
            break;
        case m_subs.SSAO:
            batch = m_batch.create_ssao_batch(subs);
            break;
        case m_subs.SSAO_BLUR:
            batch = m_batch.create_ssao_blur_batch(subs);
            break;
        case m_subs.DEPTH_PACK:
            batch = m_batch.create_depth_pack_batch();
            break;
        case m_subs.GOD_RAYS:
            // needed for special underwater god rays
            var water = subs.water;
            var steps = subs.steps_per_pass;

            batch = m_batch.create_god_rays_batch(subs.pack, water, steps);

            break;

        case m_subs.GOD_RAYS_COMBINE:
            batch = m_batch.create_god_rays_combine_batch();
            break;

        case m_subs.MOTION_BLUR:
            batch = m_batch.create_motion_blur_batch(subs.mb_decay_threshold);
            break;

        case m_subs.COC:
            batch = m_batch.create_coc_batch(subs.coc_type);
            break;

        case m_subs.DOF:
            batch = m_batch.create_dof_batch(subs);

            var dof_power = subs.camera.dof_power;

            if (subs.dof_bokeh) {
                // half power because of downsized subs
                dof_power /= 2.0;
                var subs_pp_array = m_scgraph.get_inputs_by_type(graph, subs, m_subs.POSTPROCESSING);

                // Y_DOF_BLUR
                m_scgraph.set_texel_size_mult(subs_pp_array[0], dof_power);
                m_scgraph.set_texel_size_mult(subs_pp_array[1], dof_power);

                // X_DOF_BLUR
                subs_pp_array[0] = m_scgraph.find_input(graph, subs_pp_array[0],
                        m_subs.POSTPROCESSING);
                m_scgraph.set_texel_size_mult(subs_pp_array[0], dof_power);

            } else {
                // Y_BLUR
                var subs_pp1 = m_scgraph.find_input(graph, subs, m_subs.POSTPROCESSING);
                // X_BLUR
                var subs_pp2 = m_scgraph.find_input(graph, subs_pp1, m_subs.POSTPROCESSING);
                m_scgraph.set_texel_size_mult(subs_pp1, dof_power);
                m_scgraph.set_texel_size_mult(subs_pp2, dof_power);
            }

            break;

        case m_subs.OUTLINE:
            batch = m_batch.create_outline_batch();
            var subs_outline_blur_y = m_scgraph.find_input(graph, subs,
                    m_subs.POSTPROCESSING);
            var subs_outline_blur_x = m_scgraph.find_input(graph, subs_outline_blur_y,
                    m_subs.POSTPROCESSING);
            var subs_outline_extend_y = m_scgraph.find_input(graph, subs_outline_blur_x,
                    m_subs.POSTPROCESSING);
            var subs_outline_extend_x = m_scgraph.find_input(graph, subs_outline_extend_y,
                    m_subs.POSTPROCESSING);

            // set blur strength for 2 subscenes
            m_scgraph.set_texel_size_mult(subs_outline_blur_x, subs.blur_texel_size_mult);
            m_scgraph.set_texel_size_mult(subs_outline_blur_y, subs.blur_texel_size_mult);

            // set extend strength for 2 subscenes
            m_scgraph.set_texel_size_mult(subs_outline_extend_x,
                    subs.ext_texel_size_mult * subs.outline_factor);
            m_scgraph.set_texel_size_mult(subs_outline_extend_y,
                    subs.ext_texel_size_mult * subs.outline_factor);

            break;

        case m_subs.GLOW_COMBINE:
            batch = m_batch.create_glow_combine_batch();
            break;

        case m_subs.COMPOSITING:
            batch = m_batch.create_compositing_batch();
            break;

        case m_subs.ANTIALIASING:
            batch = m_batch.create_antialiasing_batch(subs);
            break;

        case m_subs.SMAA_RESOLVE:
        case m_subs.SMAA_EDGE_DETECTION:
        case m_subs.SMAA_BLENDING_WEIGHT_CALCULATION:
        case m_subs.SMAA_NEIGHBORHOOD_BLENDING:
            batch = m_batch.create_smaa_batch(subs.type);
            break;

        case m_subs.STEREO:
            batch = m_batch.create_stereo_batch(subs.subtype);
            break;

        case m_subs.SKY:
            batch = m_batch.create_cube_sky_batch(scene, subs);
            break;

        case m_subs.IRRADIANCE:
            batch = m_batch.create_cube_irradiance_batch(scene, subs);
            break;

        case m_subs.ROUGHNESS_CONVOLUTION:
            batch = m_batch.create_cube_roughness_convolution_batch(scene, subs);
            break;

        case m_subs.BRDF:
            batch = m_batch.create_brdf_batch(scene, subs);
            break;

        case m_subs.LUMINANCE:
            batch = m_batch.create_luminance_batch();

            break;
        case m_subs.AVERAGE_LUMINANCE:

            batch = m_batch.create_average_luminance_batch();

            break;
        case m_subs.LUMINANCE_TRUNCED:
            batch = m_batch.create_luminance_truncated_batch(subs.adaptive_bloom);

            break;
        case m_subs.BLOOM:
            batch = m_batch.create_bloom_combine_batch(subs.bloom_blur_num);
            break;
        case m_subs.RESIZE:
            batch = m_batch.create_postprocessing_batch("NONE");
            break;

        case m_subs.VELOCITY:
            batch = m_batch.create_velocity_batch();
            break;
        case m_subs.ANCHOR_VISIBILITY:
            batch = m_batch.create_anchor_visibility_batch();
            break;
        case m_subs.PERFORMANCE:
            batch = m_batch.create_performance_batch();
            break;
        }

        if (batch) {
            var rb = m_subs.init_bundle(batch, m_obj_util.create_render("NONE"));
            m_subs.append_draw_data(subs, rb);
            connect_render_targets_batch(graph, subs, batch, false);
            check_batch_textures_number(batch);
        }
    });
}

/**
 * Update light parameters on subscenes
 */
var update_lamp_scene = (function () {
    var _quat_tmp = m_quat.create();
    var _vec3_tmp = m_vec3.create();

    return function update_lamp_scene(lamp, scene) {
        //TODO: better precache this array
        var subs_arr = subs_array(scene, LIGHT_SUBSCENE_TYPES);

        var light = lamp.light;
        var lamp_render = lamp.render;
        var sc_data = m_obj_util.get_scene_data(lamp, scene);
        var trans = m_tsr.get_trans(lamp_render.world_tsr, _vec3_tmp);
        var quat = m_tsr.get_quat(lamp_render.world_tsr, _quat_tmp);

        for (var i = 0; i < subs_arr.length; i++) {
            var subs = subs_arr[i];

            update_subs_light_params(lamp, sc_data, subs);

            switch (light.type) {
                case "SUN":
                    subs.sun_quaternion.set(quat);
                    // by link
                    subs.sun_intensity = light.color_intensity;
                    m_vec3.copy(light.direction, subs.sun_direction);
                    if (subs.type == m_subs.SKY && subs.procedural_skydome) {
                        subs.need_fog_update = light.need_sun_fog_update;
                        update_sky(scene, subs);
                    }
                    break
                case "HEMI":
                case "POINT":
                case "SPOT":
                    break;
                default:
                    // TODO: prevent export of such lamps
                    m_print.error("Unknown light type: " + light.type + "\".");
                    break;
            }

            var draw_data = subs.draw_data;
            for (var j = 0; j < draw_data.length; j++) {
                var bundles = draw_data[j].bundles;
                for (var k = 0; k < bundles.length; k++) {
                    var batch = bundles[k].batch;
                    if (batch.lamp_uuid_indexes)
                        m_batch.set_lamp_data(batch, lamp);
                }
            }
        }

        // TODO: use subs_array(bpy_scene, [m_subs.MAIN_OPAQUE])
        // bcz there could be more one MAIN_OPAQUE
        var subs_main = get_subs(scene, m_subs.MAIN_OPAQUE);
        var cam_main = subs_main.camera;
        var shadow_subscenes = sc_data.shadow_subscenes;
        var sh_params = scene._render.shadow_params;

        for (var i = 0; i < shadow_subscenes.length; i++) {
            var subs = shadow_subscenes[i];
            var cam = subs.camera;
            m_cam.set_view_trans_quat(cam, trans, quat);
            update_subs_shadow(subs, scene, cam_main, sh_params, true);
            update_shadow_receive_subs(subs, scene._render.graph);
        }
    };
})();
exports.update_lamp_scene = update_lamp_scene;

/**
 * Extract batches from the object and add to subscenes
 * @methodOf scenes
 */
exports.append_object = function(scene, obj, copy) {
    var type = obj.type;

    switch (type) {
    case "MESH":
    case "LINE":
    case "WORLD":
        var graph = scene._render.graph;
        var obj_render = obj.render;

        if (!m_scgraph.find_subs(graph, m_subs.SHADOW_CAST) && obj_render.shadow_receive)
            obj_render.shadow_receive = false;

        var subs_arr = subs_array(scene, OBJECT_SUBSCENE_TYPES);

        for (var i = 0; i < subs_arr.length; i++) {
            var subs = subs_arr[i];
            add_object_sub(subs, obj, graph, scene, copy);
        }

        break;
    case "LAMP":
        update_lamp_scene(obj, scene);
        break;
    default:
        break;
    }

    // remove unused batches
    var scene_data = m_obj_util.get_scene_data(obj, scene);
    var batches = scene_data.batches;
    for (var j = 0; j < batches.length; j++)
        if (batches[j].shader == null && batches[j].type != "PHYSICS") {
            m_obj_util.scene_data_remove_batch(scene_data, j);
            j--;
        }

    m_obj_util.scene_data_set_active(obj, true, scene);
}

exports.init_cube_sky_dim = init_cube_sky_dim;
function init_cube_sky_dim(scene, world_obj) {
    if (scene && scene._render && scene._render.graph) {
        var graph = scene._render.graph;
        var subs_sky = m_scgraph.find_subs(scene._render.graph, m_subs.SKY);

        if (subs_sky) {
            var sky_cube_texture = null;

            m_scgraph.traverse_slinks(graph, function(slink, internal, subs1, subs2) {
                if (slink.from == "CUBEMAP" && subs1.type == m_subs.SKY && subs2.type == m_subs.SINK) {
                    sky_cube_texture = slink.texture;
                    return true;
                }
            });

            if (sky_cube_texture) {
                var tex_size = cfg_scs.cubemap_tex_size;
                var sky_batch = m_batch.get_batch_by_type(world_obj, "SKY", scene);

                if (sky_batch && sky_batch.has_nodes) {
                    var ngraph_proxy = m_nodemat.get_ngraph_proxy_cached(sky_batch.ngraph_proxy_id);
                    var ngraph = ngraph_proxy.graph;
                    var node_env_tex_height = m_nodemat.get_max_env_texture_height(ngraph);

                    if (node_env_tex_height != -1)
                        tex_size = m_textures.calc_pot_size(node_env_tex_height / 2);

                } else {
                    var sc_render = scene._render;
                    var wls = sc_render.world_light_set;
                    var tex_param = wls.sky_texture_param;
                    if (tex_param)
                        tex_size = tex_param.tex_size;
                }

                tex_size = Math.min(tex_size, cfg_lim.max_cube_map_texture_size);
                subs_sky.camera.width  = tex_size;
                subs_sky.camera.height = tex_size;

                m_tex.set_cubemap_tex_size(sky_cube_texture, tex_size);

                update_bsdf_cube_sky_dim(scene, tex_size);

                var subs_irradinace = m_scgraph.find_subs(scene._render.graph, m_subs.IRRADIANCE);
                if (subs_irradinace) {
                    var irradinace_size = 32;

                    subs_irradinace.camera.width  = irradinace_size;
                    subs_irradinace.camera.height = irradinace_size;

                    var irradiance_cube_texture = null;

                    m_scgraph.traverse_slinks(graph, function(slink, internal, subs1, subs2) {
                        if (slink.from == "CUBEMAP" && subs1.type == m_subs.IRRADIANCE && subs2.type == m_subs.MAIN_OPAQUE) {
                            irradiance_cube_texture = slink.texture;
                            return true;
                        }
                    });

                    if (irradiance_cube_texture)
                        m_tex.set_cubemap_tex_size(irradiance_cube_texture, irradinace_size);
                }

                var subs_r_convolution = m_scgraph.find_subs(scene._render.graph, m_subs.ROUGHNESS_CONVOLUTION);
                if (subs_r_convolution) {
                    subs_r_convolution.camera.width  = 128;
                    subs_r_convolution.camera.height = 128;

                    var r_convolution_cube_texture = null;

                    m_scgraph.traverse_slinks(graph, function(slink, internal, subs1, subs2) {
                        if (slink.from == "CUBEMAP" && subs1.type == m_subs.ROUGHNESS_CONVOLUTION && subs2.type == m_subs.MAIN_OPAQUE) {
                            r_convolution_cube_texture = slink.texture;
                            return true;
                        }
                    });

                    if (r_convolution_cube_texture)
                        m_tex.set_cubemap_tex_size(r_convolution_cube_texture, 128);
                }
            }
        }
    }
}

function update_bsdf_cube_sky_dim(scene, tex_size) {
    var main_subscenes = subs_array(scene, [m_subs.MAIN_OPAQUE,
                                            m_subs.MAIN_BLEND,
                                            m_subs.MAIN_GLOW]);

    for (var i = 0; i < main_subscenes.length; i++)
        main_subscenes[i].bsdf_cube_sky_dim = tex_size;
}

exports.update_cube_sky_dim = update_cube_sky_dim;
function update_cube_sky_dim(world, texture) {
    var scenes_data = world.scenes_data;
    for (var i = 0; i < scenes_data.length; i++) {
        var scene = scenes_data[i].scene;
        var graph = scene._render.graph;
        var subs_sky = m_scgraph.find_subs(scene._render.graph, m_subs.SKY);

        if (subs_sky) {
            var sky_cube_texture = null;

            m_scgraph.traverse_slinks(graph, function(slink, internal, subs1, subs2) {
                if (slink.from == "CUBEMAP" && subs1.type == m_subs.SKY && subs2.type == m_subs.IRRADIANCE) {
                    sky_cube_texture = slink.texture;
                    return true;
                }
            });

            if (sky_cube_texture) {
                // same for cubemaps and spheremaps
                var tex_size = m_textures.calc_pot_size(texture.height / 2);
                tex_size = Math.min(tex_size, cfg_lim.max_cube_map_texture_size);

                subs_sky.camera.width  = tex_size;
                subs_sky.camera.height = tex_size;

                m_tex.set_cubemap_tex_size(sky_cube_texture, tex_size);

                update_bsdf_cube_sky_dim(scene, tex_size);
            }
        }
    }
}

function add_existing_obj_sub(subs, obj, graph, bpy_scene, copy) {
    switch(subs.type) {
    case m_subs.MAIN_PLANE_REFLECT:
    case m_subs.MAIN_CUBE_REFLECT:
        add_object_subs_reflect(subs, obj, graph, false, bpy_scene, copy);
        break;
    case m_subs.MAIN_PLANE_REFLECT_BLEND:
    case m_subs.MAIN_CUBE_REFLECT_BLEND:
        add_object_subs_reflect(subs, obj, graph, true, bpy_scene, copy);
        break;
    }
}

/**
 * Filter batch to pass given subscene
 */
function add_object_sub(subs, obj, graph, bpy_scene, copy) {
    switch(subs.type) {
    case m_subs.MAIN_OPAQUE:
        add_object_subs_main(subs, obj, graph, "OPAQUE", bpy_scene, copy);
        break;
    case m_subs.MAIN_BLEND:
        add_object_subs_main(subs, obj, graph, "BLEND", bpy_scene, copy);
        break;
    case m_subs.MAIN_XRAY:
        add_object_subs_main(subs, obj, graph, "XRAY", bpy_scene, copy);
        break;
    case m_subs.MAIN_GLOW:
        add_object_subs_main(subs, obj, graph, "GLOW", bpy_scene, copy);
        break;
    case m_subs.MAIN_PLANE_REFLECT:
    case m_subs.MAIN_CUBE_REFLECT:
        add_object_subs_reflect(subs, obj, graph, false, bpy_scene, copy);
        break;
    case m_subs.MAIN_PLANE_REFLECT_BLEND:
    case m_subs.MAIN_CUBE_REFLECT_BLEND:
        add_object_subs_reflect(subs, obj, graph, true, bpy_scene, copy);
        break;
    case m_subs.SHADOW_RECEIVE:
        add_object_subs_shadow_receive(subs, obj, graph, bpy_scene, copy);
        break;
    case m_subs.SHADOW_CAST:
        add_object_subs_shadow(subs, obj, graph, bpy_scene, copy);
        break;
    case m_subs.COLOR_PICKING:
        add_object_subs_color_picking(subs, obj, graph, bpy_scene, copy);
        break;
    case m_subs.COLOR_PICKING_XRAY:
        add_object_subs_color_picking(subs, obj, graph, bpy_scene, copy);
        break;
    case m_subs.OUTLINE_MASK:
        add_object_subs_outline_mask(subs, obj, graph, bpy_scene, copy);
        break;
    case m_subs.GRASS_MAP:
        add_object_subs_grass_map(subs, obj, bpy_scene, copy);
        break;
    case m_subs.DEBUG_VIEW:
        add_object_subs_debug_view(subs, obj, graph, bpy_scene, copy);
        break;
    default:
        break;
    }
}

/**
 * Add object to main scene
 */
function add_object_subs_main(subs, obj, graph, main_type, scene, copy) {

    var obj_render = obj.render;
    var sc_data = m_obj_util.get_scene_data(obj, scene);

    // divide obj by batches
    var batches = sc_data.batches;
    for (var i = 0; i < batches.length; i++) {

        var batch = batches[i];

        if (batch.shadow_cast_only || batch.reflexible_only)
            continue;

        if (batch.type != "MAIN" && batch.type != "NODES_GLOW"
                && batch.type != "PARTICLES" && batch.type != "LINE")
            continue;

        if (!(batch.subtype == "OPAQUE" && main_type == "OPAQUE" ||
                batch.subtype == "BLEND" && main_type == "BLEND" ||
                batch.subtype == "XRAY" && main_type == "XRAY" ||
                batch.type == "NODES_GLOW" && main_type == "GLOW"))
            continue;

        if (!copy) {
            update_batch_subs(batch, subs, obj, graph, main_type, scene);
            if (!m_batch.update_shader(batch)) {
                if (type() === "DEBUG") {
                    m_batch.apply_shader(batch, "error.glslv", "error.glslf")
                    m_batch.update_shader(batch);
                } else
                    continue;
            }
        }
        var rb = m_subs.init_bundle(batch, obj_render, sc_data.batch_world_bounds[i]);
        m_subs.append_draw_data(subs, rb);

        connect_render_targets_batch(graph, subs, batch, false);
        check_batch_textures_number(batch);
    }
}

function assign_lod_transition_dirs(batch) {
    if (batch.lod_settings.use_smoothing)
        m_batch.set_batch_directive(batch, "USE_LOD_SMOOTHING", 1);
}

function update_batch_subs(batch, subs, obj, graph, main_type, bpy_scene) {
    var obj_render = obj.render;
    var sc_render = bpy_scene._render;
    var scene_data = m_obj_util.get_scene_data(obj, bpy_scene);

    var shadow_usage = "NO_SHADOWS";
    var subs_cast_arr = subs_array(bpy_scene, [m_subs.SHADOW_CAST]);
    if (subs_cast_arr.length && batch.shadow_receive) {
        switch (main_type) {
        case "OPAQUE":
            shadow_usage = "SHADOW_MAPPING_OPAQUE";
            break;
        case "BLEND":
        case "XRAY":
            shadow_usage = "SHADOW_MAPPING_BLEND";
            break;
        case "COLOR_ID":
        case "REFLECT":
        case "GLOW":
            shadow_usage = "NO_SHADOWS";
            break;
        case "SHADOW":
            shadow_usage = "SHADOW_MASK_GENERATION";
            break;
        default:
            m_assert.panic("Wrong subscene type");
        }

        for (var i = 0; i < subs_cast_arr.length; i++)
            m_batch.assign_shadow_receive_dirs(batch, bpy_scene._render.shadow_params, subs_cast_arr[i]);
    }
    var blur_samples = "NO_SOFT_SHADOWS";
    if (sc_render.shadow_params && sc_render.shadow_params.soft_shadows)
        switch(cfg_def.shadow_blur_samples) {
        case "16x":
            blur_samples = "POISSON_X_16";
            break;
        case "8x":
            blur_samples = "POISSON_X_8";
            break;
        case "4x":
            blur_samples = "POISSON_X_4";
            break;
        }
    var shaders_info = batch.shaders_info;

    m_shaders.set_directive(shaders_info, "SHADOW_USAGE", shadow_usage);
    m_shaders.set_directive(shaders_info, "POISSON_DISK_NUM", blur_samples);

    assign_lod_transition_dirs(batch);

    if (batch.dynamic_grass) {
        var subs_grass_map = m_scgraph.find_subs(graph, m_subs.GRASS_MAP);
        if (subs_grass_map)
            prepare_dynamic_grass_batch(batch, subs_grass_map, obj_render);
    }

    var cam = subs.camera;
    set_batch_cam_type(shaders_info, cam);

    if ((batch.type == "SHADOW" || main_type == "COLOR_ID") && !batch.has_nodes)
        return;

    var num_lights = subs.num_lights;
    m_shaders.set_directive(shaders_info, "NUM_LIGHTS", num_lights);
    var num_lfac = num_lights % 2 == 0 ? num_lights / 2:
                                         Math.floor(num_lights / 2) + 1;
    m_shaders.set_directive(shaders_info, "NUM_LFACTORS", num_lfac);

    m_shaders.set_directive(shaders_info, "REFLECTION_PASS", "REFL_PASS_NONE");

    m_shaders.set_directive(shaders_info, "SSAO_ONLY", 0);

    var wp = sc_render.water_params;
    if (wp) {
        m_shaders.set_directive(shaders_info, "WATER_EFFECTS", 1);
        m_shaders.set_directive(shaders_info, "WAVES_HEIGHT", m_shaders.glsl_value(wp.waves_height));
        m_shaders.set_directive(shaders_info, "WAVES_LENGTH", m_shaders.glsl_value(wp.waves_length));
        m_shaders.set_directive(shaders_info, "WATER_LEVEL", m_shaders.glsl_value(wp.water_level));
    }

    if (subs.caustics && batch.caustics) {
        m_shaders.set_directive(shaders_info, "CAUSTICS", 1);

        var sh_params = sc_render.shadow_params;
        if (sh_params) {
            var ltypes = sh_params.lamp_types;
            var sun_num = 0;
            for (var i = 0; i < ltypes.length; i++)
                if (ltypes[i] == "SUN")
                    sun_num = i;

            m_shaders.set_directive(shaders_info, "SUN_NUM", sun_num);
        }

        m_shaders.set_directive(shaders_info, "CAUST_SCALE", m_shaders.glsl_value(subs.caust_scale));
        m_shaders.set_directive(shaders_info, "CAUST_SPEED", m_shaders.glsl_value(subs.caust_speed, 2));
        m_shaders.set_directive(shaders_info, "CAUST_BRIGHT", m_shaders.glsl_value(subs.caust_brightness));
    }

    var subs_cube_refl = scene_data.cube_refl_subs;
    var subs_plane_refl = scene_data.plane_refl_subs;
    var subs_sky = m_scgraph.find_subs(graph, m_subs.SKY);
    var subs_irradinace = m_scgraph.find_subs(graph, m_subs.IRRADIANCE);
    var subs_r_convolution = m_scgraph.find_subs(graph, m_subs.ROUGHNESS_CONVOLUTION);

    if (batch.texture_names.indexOf("u_mirrormap") !== -1) {
        m_shaders.set_directive(shaders_info, "REFLECTION_TYPE", "REFL_MIRRORMAP");

    } else if (batch.reflective && subs_irradinace && subs_r_convolution && !subs_cube_refl && !subs_plane_refl.length) {
        var tex_irradiance = subs_irradinace.camera.color_attachment;
        m_batch.append_texture(batch, tex_irradiance, "u_cube_irradiance");

        var tex_r_convolution = subs_r_convolution.camera.color_attachment;
        m_batch.append_texture(batch, tex_r_convolution, "u_cube_r_convolution");

        m_shaders.set_directive(shaders_info, "REFLECTION_TYPE", "REFL_PBR_STANDARD");

    } else if (batch.reflective && !subs_cube_refl && !subs_plane_refl.length && cfg_def.quality != m_cfg.P_LOW) {
        if (subs_sky) {
            var tex_sky_refl = subs_sky.camera.color_attachment;
            m_batch.append_texture(batch, tex_sky_refl, "u_sky_reflection");

            m_shaders.set_directive(shaders_info, "REFLECTION_TYPE", "REFL_PBR_SIMPLE");
        } else
            m_shaders.set_directive(shaders_info, "REFLECTION_TYPE", "REFL_NONE");
    } else if (batch.reflective && subs_cube_refl) {

        var tex = subs_cube_refl.camera.color_attachment;

        if (!sc_render.reflection_params.has_reflexible) {
            subs_cube_refl.force_do_not_render = true;

            if (subs_sky)
                tex = subs_sky.camera.color_attachment;
        }

        m_batch.append_texture(batch, tex, "u_cube_reflection");
        m_shaders.set_directive(shaders_info, "REFLECTION_TYPE", "REFL_CUBE");

    } else if (batch.reflective && subs_plane_refl) {
        for (var i = 0; i < subs_plane_refl.length; i++) {
            var tex = subs_plane_refl[i].camera.color_attachment;
            m_batch.append_texture(batch, tex, "u_plane_reflection");
            m_shaders.set_directive(shaders_info, "REFLECTION_TYPE", "REFL_PLANE");
        }

    } else {
        m_shaders.set_directive(shaders_info, "REFLECTION_TYPE", "REFL_NONE");
    }

    if (subs_sky) {
        if (batch.draw_proc_sky) {
            var tex = subs_sky.camera.color_attachment;
            m_batch.append_texture(batch, tex, "u_sky");
        } else if (subs_sky.procedural_skydome) {
            // by link
            batch.cube_fog = subs_sky.cube_fog;
            m_shaders.set_directive(shaders_info, "PROCEDURAL_FOG", 1);
        }
    } else {
        m_shaders.set_directive(shaders_info, "PROCEDURAL_FOG", 0);
    }

    var wls = sc_render.world_light_set;
    if (wls.use_environment_light) {
        m_shaders.set_directive(shaders_info, "USE_ENVIRONMENT_LIGHT", 1);
        if (wls.environment_color == "SKY_TEXTURE") {
            if (wls.environment_texture_slot) {
                var bpy_tex = wls.environment_texture_slot["texture"];
                var tex = m_tex.get_batch_texture(wls.environment_texture_slot);
                m_batch.append_texture(batch, tex, "u_sky_texture", bpy_tex["name"]);
            } else if (subs_sky) {
                var tex = subs_sky.camera.color_attachment;
                m_batch.append_texture(batch, tex, "u_sky_texture");
            }

            m_shaders.set_directive(shaders_info, "SKY_TEXTURE", 1);
        } else if (wls.environment_color == "SKY_COLOR")
            m_shaders.set_directive(shaders_info, "SKY_COLOR", 1);
    }

    var wfs = sc_render.world_fog_set;
    if (wfs.use_fog) {
        m_shaders.set_directive(shaders_info, "USE_FOG", 1);
        m_shaders.set_directive(shaders_info, "FOG_TYPE", wfs.falloff);
    }

    if (batch.refractive && batch.blend) {
        // TODO: Too many directives. Refactoring needed
        if (cfg_def.depth_tex_available)
            m_shaders.set_directive(shaders_info, "USE_REFRACTION_CORRECTION", 1);
        if (batch.type == "MAIN" && batch.has_nodes
                || batch.type == "NODES_GLOW") {
            m_shaders.set_directive(shaders_info, "REFRACTIVE", 1);
            if (sc_render.refractions)
                m_shaders.set_directive(shaders_info, "USE_REFRACTION", 1);
            else
                m_shaders.set_directive(shaders_info, "USE_REFRACTION", 0);
        } else {
            if (sc_render.refractions)
                m_shaders.set_directive(shaders_info, "REFRACTIVE", 1);
            else
                m_shaders.set_directive(shaders_info, "REFRACTIVE", 0);
        }
        if (sc_render.materials_params.refractions || sc_render.refractions)
            m_shaders.set_directive(shaders_info, "HAS_REFRACT_TEXTURE", 1);
    } else {
        m_shaders.set_directive(shaders_info, "REFRACTIVE", 0);
        m_shaders.set_directive(shaders_info, "USE_REFRACTION", 0);
        m_shaders.set_directive(shaders_info, "USE_REFRACTION_CORRECTION", 0);
    }

    if (batch.water) {
        if (cfg_def.shore_smoothing && batch.water_shore_smoothing
                && m_scgraph.find_subs(graph, m_subs.DEPTH_PACK)) {
            m_shaders.set_directive(shaders_info, "SHORE_SMOOTHING", 1);
        } else
            m_shaders.set_directive(shaders_info, "SHORE_SMOOTHING", 0);

        if (batch.water_dynamic && wp && wp.waves_height)
            m_shaders.set_directive(shaders_info, "DYNAMIC", 1);
        else
            m_shaders.set_directive(shaders_info, "DYNAMIC", 0);
    }

    if (batch.type == "PARTICLES")
        m_shaders.set_directive(shaders_info, "COLOR_RAMP_LENGTH",
                batch.particles_data.color_ramp_length);

    // NOTE: temporary disabled T2X mode due to artifacts with blend objects
    //if (cfg_def.smaa && !m_cfg.context.alpha)
    //    m_shaders.set_directive(shaders_info, "SMAA_JITTER", 1);

    // update scenes graph according to RTT arrangement
    if (!batch.forked_batch) {
        var textures = batch.textures;
        for (var j = 0; j < textures.length; j++) {
            var tex = textures[j];

            if (tex.source == "SCENE")
                for (var k = 0; k < _scenes.length; k++) {
                    var scene_k = _scenes[k];
                    var rtt = _scenes[k]._render_to_textures;
                    for (var l = 0; l < rtt.length; l++)
                        if (rtt[l] == tex)
                            m_graph.append_edge_attr(_scenes_graph, scene_k, bpy_scene, null);
                }
        }
    }
}

function set_batch_cam_type(shaders_info, subs_cam) {
    if (subs_cam.type == m_cam.TYPE_ORTHO ||
            subs_cam.type == m_cam.TYPE_ORTHO_ASPECT ||
            subs_cam.type == m_cam.TYPE_ORTHO_ASYMMETRIC)
        m_shaders.set_directive(shaders_info, "CAMERA_TYPE", "CAM_TYPE_ORTHO");
    else
        m_shaders.set_directive(shaders_info, "CAMERA_TYPE", "CAM_TYPE_PERSP");
}

function check_batch_textures_number(batch) {
    if (batch.textures.length > MAX_BATCH_TEXTURES)
        m_print.warn(batch.type, "too many textures used - " +
            batch.textures.length + " (max " + MAX_BATCH_TEXTURES +
            "), materials \"" + batch.material_names.join(", ") + "\"");
}

function prepare_dynamic_grass_batch(batch, subs_grass_map, obj_render) {
    // by link
    batch.grass_map_dim = subs_grass_map.grass_map_dim;

    var low = subs_grass_map.grass_map_dim[0];
    var high = subs_grass_map.grass_map_dim[1];
    var size = subs_grass_map.grass_map_dim[2];

    var bb = obj_render.bb_local;
    var bb_max_size = Math.max(bb.max_x - bb.min_x, bb.max_y - bb.min_y);

    if (size == 0)
        size = bb_max_size;
    else
        size = Math.max(size, bb_max_size);

    // store back, affects batch and subs grass map
    subs_grass_map.grass_map_dim[2] = size;

    // update grass map camera
    var cam = subs_grass_map.camera;
    m_cam.set_frustum2(cam, size/2, size/2, -high, -low);
    m_cam.set_projection(cam, false);

    var bsize = batch.grass_size || 0;
    if (bsize == 0)
        bsize = bb_max_size;
    else
        bsize = Math.max(bsize, bb_max_size);
    batch.grass_size = bsize;
}

/**
 * Add object to main scene
 */
function add_object_subs_shadow_receive(subs, obj, graph, scene, copy) {
    // divide obj by batches
    var sc_data = m_obj_util.get_scene_data(obj, scene);
    var batches = sc_data.batches;

    for (var i = 0; i < batches.length; i++) {
        var batch = batches[i];

        if (batch.type != "SHADOW" || batch.subtype != "RECEIVE" ||
                !batch.shadow_receive)
            continue;

        if (!copy) {
            update_batch_subs(batch, subs, obj, graph, "SHADOW", scene);
            if (!m_batch.update_shader(batch))
                continue;
        }

        var rb = m_subs.init_bundle(batch, obj.render, sc_data.batch_world_bounds[i]);
        m_subs.append_draw_data(subs, rb)

        connect_render_targets_batch(graph, subs, batch, false);
        check_batch_textures_number(batch);
    }
}

function add_object_subs_shadow(subs, obj, graph, scene, copy) {
    var update_needed = false;
    var obj_render = obj.render;
    var sc_data = m_obj_util.get_scene_data(obj, scene);
    var batches = sc_data.batches;

    var subs_grass_map = m_scgraph.find_subs(graph, m_subs.GRASS_MAP);

    for (var i = 0; i < batches.length; i++) {
        var batch = batches[i];

        if (batch.type != "SHADOW")
            continue;

        if (batch.subtype != "CAST")
            continue;

        update_needed = true;

        if (!copy) {
            assign_lod_transition_dirs(batch);

            var num_lights = subs.num_lights;
            m_batch.set_batch_directive(batch, "NUM_LIGHTS", num_lights);
            var num_lfac = num_lights % 2 == 0 ? num_lights / 2:
                                                 Math.floor(num_lights / 2) + 1;
            m_batch.set_batch_directive(batch, "NUM_LFACTORS", num_lfac);

            set_batch_cam_type(batch.shaders_info, subs.camera);

            m_shaders.set_directive(batch.shaders_info, "SHADOW_USAGE", "SHADOW_CASTING");

            if (batch.dynamic_grass && subs_grass_map)
                prepare_dynamic_grass_batch(batch, subs_grass_map, obj_render);

            m_batch.set_batch_directive(batch, "SHADOW_TEX_RES",
                    m_shaders.glsl_value(
                    scene._render.shadow_params.csm_resolution));

            if (!m_batch.update_shader(batch))
                continue;
        }

        // NOTE: dynamic grass shadow casting requires update after camera transformations
        if (batch.dynamic_grass)
            scene._render.shadow_params.dynamic_grass_cast = true;

        var rb = m_subs.init_bundle(batch, obj_render, sc_data.batch_world_bounds[i]);
        m_subs.append_draw_data(subs, rb);
        
        connect_render_targets_batch(graph, subs, batch, false);
        check_batch_textures_number(batch);
    }

    if (update_needed) {
        var sh_params = scene._render.shadow_params;
        var subs_main = m_scgraph.find_subs(graph, m_subs.MAIN_OPAQUE);
        update_subs_shadow(subs, scene, subs_main.camera, sh_params,
                           true);
    }
}

exports.add_object_subs_reflect = add_object_subs_reflect;
function add_object_subs_reflect(subs, obj, graph, is_blend_subs, scene, copy) {
    var obj_render = obj.render;
    var sc_data = m_obj_util.get_scene_data(obj, scene);
    var batches = sc_data.batches;

    for (var i = 0; i < batches.length; i++) {
        var batch = batches[i];

        if (batch.type != "MAIN" && batch.type != "PARTICLES" && batch.type != "LINE")
            continue;

        if (batch.subtype != "REFLECT")
            continue;

        if (batch.blend != is_blend_subs)
            continue;

        // do not render reflected object on itself
        if (subs.type == m_subs.MAIN_PLANE_REFLECT ||
                subs.type == m_subs.MAIN_PLANE_REFLECT_BLEND) {
            var refl_id = get_plane_refl_id_by_subs(scene, subs);
            if (refl_id == obj_render.plane_reflection_id)
                continue;
        } else {
            var refl_id = get_cube_refl_id_by_subs(scene, subs);
            if (refl_id == obj_render.cube_reflection_id)
                continue;
        }

        if (!copy) {
            update_batch_subs(batch, subs, obj, graph, "REFLECT", scene);
            var shaders_info = batch.shaders_info;

            m_shaders.set_directive(shaders_info, "WATER_EFFECTS", 0);

            if (subs.type == m_subs.MAIN_PLANE_REFLECT ||
                    subs.type == m_subs.MAIN_PLANE_REFLECT_BLEND)
                m_shaders.set_directive(shaders_info, "REFLECTION_PASS", "REFL_PASS_PLANE");
            else
                m_shaders.set_directive(shaders_info, "REFLECTION_PASS", "REFL_PASS_CUBE");

            // disable normalmapping in shader for optimization purposes
            m_shaders.set_directive(shaders_info, "TEXTURE_NORM", 0);

            if (!m_batch.update_shader(batch)) {
                if (type() === "DEBUG") {
                    m_batch.apply_shader(batch, "error.glslv", "error.glslf")
                    m_batch.update_shader(batch);
                } else
                    continue;
            }
        }

        if (!m_subs.find_bundle(subs, batch, obj_render)) {
            var rb = m_subs.init_bundle(batch, obj_render, sc_data.batch_world_bounds[i]);
            m_subs.append_draw_data(subs, rb);

            connect_render_targets_batch(graph, subs, batch, false);
            check_batch_textures_number(batch);
        }

        // NOTE: temoporary disabled T2X mode due to artifacts with blend objects
        //if (cfg_def.smaa && !m_cfg.context.alpha)
        //    m_shaders.set_directive(shaders_info, "SMAA_JITTER", 1);
    }
}

exports.schedule_shadow_update = schedule_shadow_update;
/**
 * Schedule update of shadow subscenes on given bpy scene.
 * @methodOf scenes
 */
function schedule_shadow_update(bpy_scene) {
    bpy_scene._render.need_shadow_update = true;
}

/**
 * Update all shadow subscenes on active scene
 */
function update_shadow_subscenes(bpy_scene) {

    reset_shadow_cam_vm(bpy_scene);
    // also update shadow subscene camera

    // TODO: use subs_array(bpy_scene, [m_subs.MAIN_OPAQUE])
    // bcz there could be more one MAIN_OPAQUE
    var subs_main = get_subs(bpy_scene, m_subs.MAIN_OPAQUE);

    var graph = bpy_scene._render.graph;
    var recalc_z_bounds = true;
    var sh_params = bpy_scene._render.shadow_params

    m_graph.traverse(graph, function(node, attr) {
        var subs = attr;
        if (subs.type === m_subs.SHADOW_CAST) {
            update_subs_shadow(subs, bpy_scene, subs_main.camera, sh_params,
                               recalc_z_bounds);
            recalc_z_bounds = false;
        }
    });
}

function enable_outline_draw(scene) {
    var graph = scene._render.graph;
    m_graph.traverse(graph, function(node, subs) {
        if (subs.type === m_subs.OUTLINE)
            subs.draw_outline_flag = 1;
    });
}

exports.update_shadow_billboard_view = function(cam_main, graph) {
    m_graph.traverse(graph, function(node, attr) {
        var subs = attr;
        if (subs.type === m_subs.SHADOW_CAST) {
            // NOTE: inherit light camera world_tsr from main camera - used in LOD 
            // calculations, cylindrical billboarding shadows and dynamic grass shadows
            m_tsr.copy(cam_main.world_tsr, subs.camera.world_tsr);
            // NOTE: inherit view_tsr from main camera
            m_tsr.copy(cam_main.view_tsr,
                    subs.camera.shadow_cast_billboard_view_tsr);
        }
    });
}

var update_shadow_receive_subs = (function () {
    var _quat_tmp = m_quat.create();
    var _vec3_tmp = m_vec3.create();
    var _vec4_tmp = m_vec4.create();

    return function update_shadow_receive_subs(subs, graph) {
        var cam_cast = subs.camera;
        var outputs = m_scgraph.get_outputs(graph, subs);
        for (var i = 0; i < outputs.length; i++) {
            var output = outputs[i];

            // NOTE: it's for debug_subs
            if (output.type != m_subs.MAIN_OPAQUE && output.type != m_subs.SHADOW_RECEIVE
                && output.type != m_subs.MAIN_BLEND && output.type != m_subs.MAIN_XRAY)
                continue;

            if (cfg_def.mac_os_shadow_hack)
                output.v_light_tsr.set(cam_cast.view_tsr, subs.shadow_lamp_index * 9);
            else {
                var trans = m_tsr.get_trans(cam_cast.view_tsr, _vec3_tmp);
                var scale = m_tsr.get_scale(cam_cast.view_tsr);
                var quat = m_tsr.get_quat(cam_cast.view_tsr, _quat_tmp);

                m_vec4.set(trans[0], trans[1], trans[2], scale, _vec4_tmp);
                output.v_light_ts.set(_vec4_tmp, subs.shadow_lamp_index * 4);
                output.v_light_r.set(quat, subs.shadow_lamp_index * 4);
            }
        }
    };
})();
exports.update_shadow_receive_subs = update_shadow_receive_subs;

/**
 * Update shadow subscene camera based on main subscene light.
 * uses _vec3_tmp, _mat4_tmp, _corners_cache
 */
function update_subs_shadow(subs, scene, cam_main, sh_params,
                            recalc_z_bounds) {

    if (subs.draw_data.length == 0)
        return;

    var cam = subs.camera;

    // NOTE: inherit light camera world_tsr from main camera - used in LOD 
    // calculations, cylindrical billboarding shadows and dynamic grass shadows
    m_tsr.copy(cam_main.world_tsr, cam.world_tsr);

    // NOTE: inherit view_tsr from main camera
    m_tsr.copy(cam_main.view_tsr, cam.shadow_cast_billboard_view_tsr);
    if (sh_params.lamp_types[subs.shadow_lamp_index] === "SUN"
            || sh_params.lamp_types[subs.shadow_lamp_index] === "HEMI") {
        // determine camera frustum for shadow casting
        var bb_world = get_shadow_casters_bb(subs, cam_main.world_tsr, _bb_tmp);
        var bb_corners = m_bounds.extract_bb_corners(bb_world, _corners_cache);
        // transform bb corners to light view space
        m_util.positions_multiply_matrix(bb_corners, cam.view_matrix, bb_corners);

        if (sh_params.enable_csm) {
            // calculate world center and radius
            var center = m_vec3.copy(cam_main.csm_centers[subs.csm_index], _vec3_tmp);
            var main_view_inv = m_mat4.invert(cam_main.view_matrix, _mat4_tmp);

            m_util.positions_multiply_matrix(center, main_view_inv, center);

            // transform sphere center to light view space
            m_util.positions_multiply_matrix(center, cam.view_matrix, center);

            var radius = cam_main.csm_radii[subs.csm_index];

            // get minimum z value for bounding box from light camera for all casters
            if (recalc_z_bounds) {
                _shadow_cast_min_z = 0;
                _shadow_cast_max_z = -Infinity;
                for (var i = 2; i < bb_corners.length; i+=3) {
                    _shadow_cast_min_z = Math.min(_shadow_cast_min_z, bb_corners[i]);
                    _shadow_cast_max_z = Math.max(_shadow_cast_max_z, bb_corners[i]);
                }
            }

            var bb_view = _bb_tmp;
            bb_view.max_x = center[0] + radius;
            bb_view.max_y = center[1] + radius;
            bb_view.max_z = _shadow_cast_max_z;

            bb_view.min_x = center[0] - radius;
            bb_view.min_y = center[1] - radius; 
            bb_view.min_z = _shadow_cast_min_z;
        } else {
            var bb_view = _bb_tmp;
            var optimal_angle = get_optimal_bb_and_angle(bb_corners, bb_view);
            if (optimal_angle > 0) {
                var rot_mat = m_mat4.identity(_mat4_tmp);
                m_mat4.rotate(rot_mat, optimal_angle, m_util.AXIS_MZ, rot_mat);
                m_mat4.multiply(rot_mat, cam.view_matrix, cam.view_matrix);
                m_tsr.from_mat4(cam.view_matrix, cam.view_tsr);
            }
            bb_view = correct_bb_proportions(bb_view);

            // NOTE: it's not optimal method to update shadow cam quat
            // on shadow receive subs
            update_shadow_receive_subs(subs, scene._render.graph);
        }
        m_cam.set_frustum_asymmetric(cam, bb_view.min_x, bb_view.max_x,
                bb_view.min_y, bb_view.max_y, -bb_view.max_z, -bb_view.min_z);
        m_cam.set_projection(cam, false);

    } else if (sh_params.lamp_types[subs.shadow_lamp_index] === "SPOT"
            || sh_params.lamp_types[subs.shadow_lamp_index] === "POINT") {
        m_cam.set_projection(cam, false);
    }
}

/**
 * Get optimal bounding box in light space (smallest cross
 * sectional area seen from the light source) and angle for light rotation
 * uses _mat4_tmp, _corners_cache2, _bb_tmp2
 * @methodOf scenes
 */
function get_optimal_bb_and_angle(bb_corners, bb_dest) {
    var rot_corners = _corners_cache2;
    rot_corners.set(bb_corners);

    var angle_delta = MAX_OPTIMAL_BB_ANGLE / (OPTIMAL_BB_COUNT - 1);

    var rot_mat = m_mat4.identity(_mat4_tmp);
    m_mat4.rotate(rot_mat, angle_delta, m_util.AXIS_MZ, rot_mat);

    var min = -1;
    var min_index = -1;
    for (var i = 0; i < OPTIMAL_BB_COUNT; i++) {
        var bb_all = m_bounds.bb_from_coords(rot_corners, 0, rot_corners.length, _bb_tmp2);
        var S = (bb_all.max_x - bb_all.min_x) * (bb_all.max_y - bb_all.min_y);

        // use threshold to avoid calculation inaccuracy
        if (min == -1 || min - S > OPTIMAL_BB_THRESHOLD) {
            min = S;
            min_index = i;
            m_bounds.copy_bb(bb_all, bb_dest);
        }
        m_util.positions_multiply_matrix(rot_corners, rot_mat, rot_corners);
    }

    return min_index * angle_delta;
}

function correct_bb_proportions(bb) {
    var x = bb.max_x - bb.min_x;
    var y = bb.max_y - bb.min_y;

    if (x && y) {
        var diff = Math.abs(x - y) / 2;
        if (x/y > MAX_SHADOW_CAST_BB_PROPORTION) {
            bb.max_y += diff;
            bb.min_y -= diff;
        } else if (y/x > MAX_SHADOW_CAST_BB_PROPORTION) {
            bb.max_x += diff;
            bb.min_x -= diff;
        }
    }

    bb.max_x += SHADOW_MAP_EPSILON_XY;
    bb.max_y += SHADOW_MAP_EPSILON_XY;
    bb.max_z += SHADOW_MAP_EPSILON_Z;
    bb.min_x -= SHADOW_MAP_EPSILON_XY;
    bb.min_y -= SHADOW_MAP_EPSILON_XY;
    bb.min_z -= SHADOW_MAP_EPSILON_Z;

    return bb;
}

/**
 * uses _vec3_tmp2, _quat4_tmp, _bb_tmp2
 */
function get_shadow_casters_bb(subs, main_cam_tsr, dest) {
    m_bounds.zero_bounding_box(dest);

    for (var i = 0; i < subs.draw_data.length; i++) {
        var bundles = subs.draw_data[i].bundles;
        for (var j = 0; j < bundles.length; j++) {
            // not all casters will be unique

            var batch = bundles[j].batch;
            var render = bundles[j].obj_render;

            // trying to reproduce shader logic regarding the placing of instances
            if (batch.dynamic_grass) {
                var main_cam_quat = m_tsr.get_quat(main_cam_tsr, _quat4_tmp);
                var main_cam_view = m_vec3.transformQuat(m_util.AXIS_MZ, 
                        main_cam_quat, _vec3_tmp2);

                var sin_alpha = - main_cam_view[0];
                var cos_alpha = main_cam_view[1];
                var main_camera_eye = m_tsr.get_trans(main_cam_tsr, _vec3_tmp2);

                // get world position of base point ([0.0, 0.0] (left lower) on UV)
                var base_x = main_camera_eye[0] - batch.grass_size * (1 + sin_alpha) / 2;
                var base_y = main_camera_eye[1] - batch.grass_size * (1 - cos_alpha) / 2;

                // considering the height of a grass instance
                var bb_world = m_bounds.bounding_box_transform(batch.bounds_local.bb, 
                        render.world_tsr, _bb_tmp2);
                var grass_height = bb_world.max_z - bb_world.min_z;

                var bbox = _bb_tmp2;
                bbox.min_x = base_x;
                bbox.min_y = base_y;
                bbox.min_z = batch.grass_map_dim[0] - grass_height;
                bbox.max_x = base_x + batch.grass_size;
                bbox.max_y = base_y + batch.grass_size;
                bbox.max_z = batch.grass_map_dim[1] + grass_height;
            } else 
                var bbox = render.bb_world;

            if (i == 0 && j == 0)
                m_bounds.copy_bb(bbox, dest);
            else
                m_bounds.expand_bounding_box(dest, bbox);
        }
    }

    return dest;
}

exports.get_csm_borders = get_csm_borders;
/**
 * @methodOf scenes
 */
function get_csm_borders(scene, cam) {
    var shs = scene._render.shadow_params;

    var rslt = new Float32Array(shs.csm_num);
    for (var i = 0; i < shs.csm_num; i++)
        rslt[i] = m_cam.csm_far_plane(shs, cam, i);

    return rslt;
}

function add_object_subs_color_picking(subs, obj, graph, scene, copy) {

    var obj_render = obj.render;
    var sc_data = m_obj_util.get_scene_data(obj, scene);
    var batches = sc_data.batches;

    for (var i = 0; i < batches.length; i++) {
        var batch = batches[i];

        if (batch.type != "COLOR_ID")
            continue;

        if (!(subs.type == m_subs.COLOR_PICKING && batch.subtype == "COLOR_ID" ||
                subs.type == m_subs.COLOR_PICKING_XRAY && batch.subtype == "COLOR_ID_XRAY"))
            continue;

        if (!copy) {
            update_batch_subs(batch, subs, obj, graph, "COLOR_ID", scene);
            m_batch.set_batch_directive(batch, "USE_OUTLINE", 0);
            if (!m_batch.update_shader(batch))
                continue;
        }

        var rb = m_subs.init_bundle(batch, obj_render, sc_data.batch_world_bounds[i]);
        m_subs.append_draw_data(subs, rb)
    }
}

function add_object_subs_debug_view(subs, obj, graph, scene, copy) {

    var obj_render = obj.render;
    var sc_data = m_obj_util.get_scene_data(obj, scene);
    var batches = sc_data.batches;

    for (var i = 0; i < batches.length; i++) {
        var batch = batches[i];

        if (batch.type != "DEBUG_VIEW")
            continue;

        if (!copy) {
            if (batch.dynamic_grass) {
                var subs_grass_map = m_scgraph.find_subs(graph, m_subs.GRASS_MAP);
                if (subs_grass_map)
                    prepare_dynamic_grass_batch(batch, subs_grass_map, obj_render);
            }

            if (!m_batch.update_shader(batch)) {
                if (type() === "DEBUG") {
                    m_batch.apply_shader(batch, "error.glslv", "error.glslf")
                    m_batch.update_shader(batch);
                } else
                    return;
            }
        }

        var rb = m_subs.init_bundle(batch, obj_render, sc_data.batch_world_bounds[i]);
        m_subs.append_draw_data(subs, rb)

        connect_render_targets_batch(graph, subs, batch, false);
        check_batch_textures_number(batch);
    }
}

exports.connect_render_targets_batch = connect_render_targets_batch;
function connect_render_targets_batch(graph, subs, batch, is_replacing) {
    var id = m_graph.node_by_attr(graph, subs);

    // release unused textures from previous subscenes
    m_graph.traverse_inputs(graph, id, function(id_in, attr_in,
            attr_edge) {

        var slink = attr_edge;
        var subs_in = attr_in;

        if (!slink.active)
            return;

        switch (slink.from) {
        case "COLOR":
        case "CUBEMAP":
            var tex = subs_in.camera.color_attachment;
            break;
        case "DEPTH":
            var tex = subs_in.camera.depth_attachment;
            break;
        case "SCREEN":
            var tex = null;
            break;
        case m_subs.MAIN_CUBE_REFLECT:
            return;
        default:
            m_assert.panic("Wrong slink");
        }

        switch (slink.to) {
        case "COLOR":
        case "CUBEMAP":
        case "DEPTH":
        case "NONE":
        case "SCREEN":
        case "OFFSCREEN":
        case "RESOLVE":
        case "COPY":
        case "u_cube_reflection": // NOTE: set in update_batch_subs()
        case "u_plane_reflection": // NOTE: set in update_batch_subs()
            // nothing
            break;
        default:

            if (!tex)
                if (!is_replacing)
                    m_assert.panic("Connection of SCREEN is forbidden");
                else
                    return;
            if (tex.w_renderbuffer)
                m_assert.panic("Batch texture can't use renderbuffer");

            if (m_shaders.check_uniform(batch.shader, slink.to))
                if (is_replacing)
                    m_batch.replace_texture(batch, tex, slink.to);
                else
                    m_batch.append_texture(batch, tex, slink.to);

            break;
        }
    });

    for (var i = 0; i < subs.slinks_internal.length; i++) {
        var slink = subs.slinks_internal[i];
        var tex = subs.textures_internal[i];

        switch (slink.to) {
        case "COLOR":
        case "CUBEMAP":
        case "DEPTH":
        case "NONE":
        case "SCREEN":
        case "OFFSCREEN":
        case "RESOLVE":
        case "COPY":
            // nothing
            break;
        default:

            if (tex.w_renderbuffer)
                m_assert.panic("Batch texture can't use renderbuffer");

            if (m_shaders.check_uniform(batch.shader, slink.to))
                if (is_replacing)
                    m_batch.replace_texture(batch, tex, slink.to);
                else
                    m_batch.append_texture(batch, tex, slink.to);

            break;
        }
    }
}

/**
 * Add object to depth map scene
 */
function add_object_subs_grass_map(subs, obj, scene, copy) {

    var obj_render = obj.render;
    // divide obj by batches
    var sc_data = m_obj_util.get_scene_data(obj, scene);
    var batches = sc_data.batches;

    for (var i = 0; i < batches.length; i++) {
        var batch = batches[i];

        if (batch.type != "GRASS_MAP")
            continue;

        if (!copy)
            if (!m_batch.update_shader(batch)) {
                if (type() === "DEBUG") {
                    m_batch.apply_shader(batch, "error.glslv", "error.glslf")
                    m_batch.update_shader(batch);
                } else
                    continue;
            }

        var rb = m_subs.init_bundle(batch, obj_render, sc_data.batch_world_bounds[i]);
        m_subs.append_draw_data(subs, rb)

        // recalculate scene camera

        var cam = subs.camera;
        var bb = obj_render.bb_world;

        var low = subs.grass_map_dim[0];
        var high = subs.grass_map_dim[1];
        var size = subs.grass_map_dim[2];

        if (low == 0 && high == 0) {
            // initial exec
            low = bb.min_z;
            high = bb.max_z;
        } else {
            low = Math.min(low, bb.min_z);
            high = Math.max(high, bb.max_z);
        }

        // NOTE: issue for partially plain meshes near top or bottom
        var map_margin = (high - low) * GRASS_MAP_MARGIN;
        low = low - map_margin;
        high = high + map_margin;

        subs.grass_map_dim[0] = low;
        subs.grass_map_dim[1] = high;
        // subs.grass_map_dim[2] stays intact

        m_cam.set_frustum2(cam, size/2, size/2, -high, -low);
        m_cam.set_projection(cam, false);
    }
}

/**
 * Add object to outline mask scene
 */
function add_object_subs_outline_mask(subs, obj, graph, scene, copy) {

    var obj_render = obj.render;
    var sc_data = m_obj_util.get_scene_data(obj, scene);
    var batches = sc_data.batches;

    for (var i = 0; i < batches.length; i++) {
        var batch = batches[i];

        if (batch.type != "COLOR_ID")
            continue;

        if (batch.subtype != "OUTLINE")
            continue;

        if (!copy) {
            update_batch_subs(batch, subs, obj, graph, "COLOR_ID", scene);
            m_batch.set_batch_directive(batch, "USE_OUTLINE", 1);
            if (!m_batch.update_shader(batch))
                continue;
        }

        var rb = m_subs.init_bundle(batch, obj_render, sc_data.batch_world_bounds[i]);
        m_subs.append_draw_data(subs, rb)
    }

}

exports.change_visibility_rec = change_visibility_rec;
function change_visibility_rec(obj, hide) {

    change_visibility(obj, hide);

    // TODO: cons_descends array must be replaced with another container for
    // child objects
    for (var i = 0; i < obj.cons_descends.length; i++)
        if (obj.cons_descends[i].parent == obj)
            change_visibility_rec(obj.cons_descends[i], hide);
}

exports.change_visibility = change_visibility;
function change_visibility(obj, hide) {
    obj.render.hide = hide;
    if (m_obj_util.is_lamp(obj))
        for (var i = 0; i < obj.scenes_data.length; i++) {
            var scene_data = obj.scenes_data[i];
            var scene = scene_data.scene;
            var subs_arr = subs_array(scene, LIGHT_SUBSCENE_TYPES);
            for (var j = 0; j < subs_arr.length; j++)
                update_subs_light_factors(obj, scene_data, subs_arr[j]);
        }
}

/**
 * Check if object is hidden
 * @methodOf scenes
 */
exports.is_hidden = function(obj) {
    return obj.render.hide;
}

/**
 * Remove object bundles.
 * @methodOf scenes
 */
exports.remove_object_bundles = function(obj, mat_name) {
    for (var i = 0; i < obj.scenes_data.length; i++) {
        var scene = obj.scenes_data[i].scene;
        var subscenes = subs_array(scene, OBJECT_SUBSCENE_TYPES);
        
        for (var j = 0; j < subscenes.length; j++) {
            var draw_data = subscenes[j].draw_data;
            for (var k = 0; k < draw_data.length; k++) {
                var bundles = draw_data[k].bundles;
                for (var l = bundles.length - 1; l >= 0; l--) {
                    var bundle = bundles[l];
                    if (bundle.obj_render == obj.render) {
                        if (bundle.batch) {
                            if (typeof mat_name == "undefined" 
                                    || bundle.batch.material_names.indexOf(mat_name) != -1 
                                    || bundle.batch.material_names.length == 0) {
                                m_batch.clear_batch(bundle.batch);
                                bundles.splice(l, 1);
                            }
                        } else
                            bundles.splice(l, 1);
                    }
                }
            }
        }
    }
}

exports.update_lamp_scene_color_intensity = update_lamp_scene_color_intensity;
/**
 * Update light color intensities on subscenes
 */
function update_lamp_scene_color_intensity(lamp, scene) {
    var light = lamp.light;
    var sc_data = m_obj_util.get_scene_data(lamp, scene);
    var ind = sc_data.light_index;
    var subs_arr = subs_array(scene, LIGHT_SUBSCENE_TYPES);
    for (var i = 0; i < subs_arr.length; i++) {
        var subs = subs_arr[i];
        subs.light_color_intensities.set(light.color_intensity, ind * 4);
        subs.need_perm_uniforms_update = true;
    }
}

var update_subs_light_params = (function() {
    var _vec3_tmp = m_vec3.create();
    var _vec4_tmp = m_vec4.create();

    return function update_subs_light_params(lamp, sc_data, subs) {
        var lamp_render = lamp.render
        var light = lamp.light;
        var ind = sc_data.light_index;
        var trans = m_tsr.get_trans(lamp.render.world_tsr, _vec3_tmp);
        var intens = light.color_intensity;

        subs.light_directions.set(light.direction, ind * 3)

        _vec4_tmp[0] = trans[0];
        _vec4_tmp[1] = trans[1];
        _vec4_tmp[2] = trans[2];
        // NOTE: encoding light_factor for diffuse
        _vec4_tmp[3] = light.use_diffuse && !lamp_render.hide ? 1.0 : 0.0;
        subs.light_positions.set(_vec4_tmp, ind * 4);

        _vec4_tmp[0] = intens[0];
        _vec4_tmp[1] = intens[1];
        _vec4_tmp[2] = intens[2];
        // NOTE: encoding light_factor for specular
        _vec4_tmp[3] = light.use_specular && !lamp_render.hide ? 1.0 : 0.0;;
        subs.light_color_intensities.set(_vec4_tmp, ind * 4);

        subs.need_perm_uniforms_update = true;
    };
})();

function update_subs_light_factors(lamp, sc_data, subs) {
    var lamp_render = lamp.render
    var light = lamp.light;
    var ind = sc_data.light_index;

    var light_factor = light.use_diffuse && !lamp_render.hide ? 1.0 : 0.0;
    subs.light_positions[ind * 4 + 3] = light_factor;

    light_factor = light.use_specular && !lamp_render.hide ? 1.0 : 0.0;
    subs.light_color_intensities[ind * 4 + 3] = light_factor;

    subs.need_perm_uniforms_update = true;
}

function reset_shadow_cam_vm(bpy_scene) {
    var lamps = m_obj.get_scene_objs(bpy_scene, "LAMP", m_obj.DATA_ID_ALL);

    var use_ssao = cfg_def.ssao && bpy_scene["b4w_enable_ssao"];
    var shadow_lamps = m_obj_util.get_shadow_lamps(lamps, use_ssao);

    if (!shadow_lamps.length)
        return;

    for (var k = 0; k < shadow_lamps.length; k++) {
        var shadow_lamp = shadow_lamps[k];
        var lamp_render = shadow_lamp.render;
        var trans = m_tsr.get_trans(lamp_render.world_tsr, _vec3_tmp);
        var quat = m_tsr.get_quat(lamp_render.world_tsr, _quat4_tmp);

        for (var j = 0; j < shadow_lamp.scenes_data.length; j++) {
            var sc_data = shadow_lamp.scenes_data[j];
            var shadow_subscenes = sc_data.shadow_subscenes;
            if (sc_data.scene == bpy_scene)
                for (var i = 0; i < shadow_subscenes.length; i++) {
                    var subs = shadow_subscenes[i];
                    var cam = subs.camera;
                    m_cam.set_view_trans_quat(cam, trans, quat);
                }
        }
    }
}

exports.update_sky_texture = function(world) {
    var scenes_data = world.scenes_data;
    for (var i = 0; i < scenes_data.length; i++)
        update_world_texture(scenes_data[i].scene);
}

exports.update_world_texture = update_world_texture;
function update_world_texture(scene) {
    var subs_sky = get_subs(scene, m_subs.SKY);
    if (subs_sky)
        update_sky(scene, subs_sky);
}

exports.update_sky = update_sky;
function update_sky(scene, subs) {
    m_prerender.prerender_subs(subs);
    m_render.draw(subs);
    if (subs.need_fog_update) {
        var main_subs = subs_array(scene, FOG_SUBSCENE_TYPES);
        for (var i = 0; i < main_subs.length; i++) {
            var draw_data = main_subs[i].draw_data;
            for (var j = 0; j < draw_data.length; j++) {
                var bundles = draw_data[j].bundles;
                for (var k = 0; k < bundles.length; k++) {
                    var bundle = bundles[k];
                    if (bundle.do_render) {
                        var batch = bundle.batch;
                        if (m_batch.check_batch_perm_uniform(batch, "u_cube_fog"))
                            m_render.update_batch_permanent_uniform(batch,
                                                                    "u_cube_fog");
                    }
                }
            }
        }
    }

    update_pbr_sky(scene)
}

function update_pbr_sky(scene) {
    var subs_irradinace = get_subs(scene, m_subs.IRRADIANCE);
    if (subs_irradinace) {
        m_prerender.prerender_subs(subs_irradinace);
        m_render.draw(subs_irradinace);
    }

    var subs_r_convolution = get_subs(scene, m_subs.ROUGHNESS_CONVOLUTION);
    if (subs_r_convolution) {
        m_prerender.prerender_subs(subs_r_convolution);
        m_render.draw(subs_r_convolution);
    }

    var subs_brdf = get_subs(scene, m_subs.BRDF);
    if (subs_brdf) {
        m_prerender.prerender_subs(subs_brdf);
        m_render.draw(subs_brdf);
    }
}

/**
 * Perform module cleanup
 */
exports.cleanup = function() {
    for (var i = 0; i < _scenes.length; i++) {
        var scene = _scenes[i];
        var graph = scene._render.graph;

        m_graph.traverse(graph, function(node, attr) {
            if (!(attr.type == m_subs.SINK))
                clear_subscene(attr);
        });

        scene._render.graph = null;
        scene._render.queue = [];
    }

    _main_scene = null;
    _active_scene = null;
    _scenes.length = 0;
    _scenes_graph = null;
}

/**
 * Clear subscene
 */
exports.clear_subscene = clear_subscene;
function clear_subscene(subs) {

    var cam = subs.camera;

    m_render.render_target_cleanup(cam.framebuffer, cam.color_attachment,
            cam.depth_attachment, cam.width, cam.height);

    var draw_data = subs.draw_data;
    for (var i = 0; i < draw_data.length; i++) {
        var bundles = draw_data[i].bundles;
        for (var j = 0; j < bundles.length; j++) {
            var batch = bundles[j].batch
            if (batch)
                m_batch.clear_batch(batch);
        }
    }
}


/**
 * Extract frustum from camera, make debug geometry and add to active scene
 * for debug purposes only
 */
exports.make_frustum_shot = function(cam, subscene, color) {
    var corners = m_cam.extract_frustum_corners(cam, cam.near, cam.far, null, true);
    var submesh = m_primitives.generate_frustum(corners);

    var render = m_obj_util.create_render("DYNAMIC");

    render.bb_world = render.bb_local = m_bounds.big_bounding_box();
    render.bs_world = render.bs_local = m_bounds.big_bounding_sphere();

    var radius = render.bs_world.radius;
    render.be_world = render.be_local = m_bounds.be_from_values(
            [radius, 0, 0], [0, radius, 0], [0, 0, radius], 
            render.bs_world.center);

    var batch = m_batch.create_shadeless_batch(submesh, color, 0.5);
    batch.do_not_cull = true;

    var rb = m_subs.init_bundle(batch, render);
    m_subs.append_draw_data(subscene, rb);
}

/**
 * Get all unuque materials of mesh objects
 */
function get_objs_materials(bpy_objects) {

    var mats = [];

    for (var i = 0; i < bpy_objects.length; i++) {

        var obj_mats = bpy_objects[i]._object.materials;
        for (var j = 0; j < obj_mats.length; j++) {
            var mat = obj_mats[j];

            if (mats.indexOf(mat) == -1)
                mats.push(mat);
        }
    }

    return mats;
}

/**
 * Return blender scene timeline's start/end frames
 */
exports.get_scene_timeline = function(scene) {
    var start = scene["frame_start"];
    var end = scene["frame_end"];

    return [start, end];
}

exports.setup_dim = setup_dim;
function setup_dim(width, height, scale) {
    m_cont.setup_viewport_dim(width, height, scale);

    if (_active_scene)
        setup_scene_dim(_active_scene, width, height);
}

function get_slink_dim(slink, width, height, dest) {
    var cw = width;
    var ch = height;

    if (m_cont.is_hidpi()) {
        cw *= window.devicePixelRatio;
        ch *= window.devicePixelRatio;
    }

    // use only main scene for the canvas resizing
    var main_scene = get_main();
    if (main_scene) {
        var sc_render = main_scene._render;
        cw *= sc_render.resolution_factor;
        ch *= sc_render.resolution_factor;
    }

    cw *= slink.size_mult_x;
    ch *= slink.size_mult_y;

    dest[0] = Math.floor(cw);
    dest[1] = Math.floor(ch);

    return dest;
}

function get_down_scale(slink, width, height) {
    var slink_dim = get_slink_dim(slink, width, height, _vec2_tmp);

    if (slink_dim[0] > cfg_lim.max_texture_size ||
            slink_dim[1] > cfg_lim.max_texture_size) {
        m_print.warn("Texture size exceeds platform limits, downscaling");

        return Math.min(cfg_lim.max_texture_size / slink_dim[0],
                cfg_lim.max_texture_size / slink_dim[0]);
    }

    return 1;
}

/**
 * Setup dimension for specific scene subscenes
 */
function setup_scene_dim(scene, width, height) {
    var sc_render = scene._render;
    var cam_scene_data = m_obj_util.get_scene_data(scene._camera, scene);
    var upd_cameras = cam_scene_data.cameras;

    if (height != 0)
        var aspect = width/height;
    else
        var aspect = 1;

    for (var i = 0; i < upd_cameras.length; i++) {
        var cam = upd_cameras[i];

        m_cam.set_aspect(cam, aspect);
        m_cam.set_projection(cam, false);

        // NOTE: update size of camera shadow cascades
        if (sc_render.shadow_params)
            m_cam.update_camera_shadows(cam, sc_render.shadow_params);
    }

    if (sc_render.shadow_params) {
        sc_render.need_shadow_update = true;
        var shadow_receives = subs_array(scene, [m_subs.SHADOW_RECEIVE]);
        for (var i = 0; i < shadow_receives.length; i++)
            shadow_receives[i].need_perm_uniforms_update = true;

        var main_blends = subs_array(scene, [m_subs.MAIN_BLEND]);
        for (var i = 0; i < main_blends.length; i++)
            main_blends[i].need_perm_uniforms_update = true;
    }

    setup_slink_dim(scene, width, height);
}

function setup_slink_dim(scene, width, height) {
    var sc_render = scene._render;
    var graph = sc_render.graph;

    var scale = Infinity;
    m_scgraph.traverse_slinks(graph, function(slink, internal, subs1, subs2) {
        if (!slink.update_dim)
            return;

        scale = Math.min(scale, get_down_scale(slink, width, height));
    });

    m_scgraph.traverse_slinks(graph, function(slink, internal, subs1, subs2) {
        if (!slink.update_dim)
            return;

        var tex_width, tex_height, dims;

        if (subs2 && subs2.type == m_subs.SINK ||
                subs1.is_pp && !slink.apply_resolution_factors) {
            tex_width = width * slink.size_mult_x;
            tex_height = height * slink.size_mult_y;
        } else {
            dims = get_slink_dim(slink, width, height, _vec2_tmp);
            tex_width = dims[0] * scale;
            tex_height = dims[1] * scale;
        }

        if (internal) {
            for (var i = 0; i < subs1.slinks_internal.length; i++) {
                var slink_i = subs1.slinks_internal[i];
                if (slink_i == slink)
                    m_tex.resize(slink.texture, tex_width, tex_height);
            }
        } else {
            if (m_tex.is_texture(slink.texture)) {
                m_tex.resize(slink.texture, tex_width, tex_height);
                if (slink.texture.use_mipmap)
                    subs2.last_mip_map_ind = slink.texture.mipmap_count;
            }

            // NOTE: needed in set_dof_params() and several other places
            var cam = subs1.camera;
            cam.width = tex_width;
            cam.height = tex_height;

            switch (subs1.type) {
            case m_subs.DOF:
                set_dof_params(scene, {"dof_power": subs1.camera.dof_power});
                break;
            case m_subs.GLOW_COMBINE:
                set_glow_material_params(scene,
                        {"small_glow_mask_width": subs1.small_glow_mask_width,
                        "large_glow_mask_width": subs1.large_glow_mask_width});
                break;
            case m_subs.BLOOM:
                set_bloom_params(scene,
                        {"blur": subs1.bloom_blur});
                break;
            case m_subs.RESIZE:
                cam.width = cam.color_attachment.width;
                cam.height = cam.color_attachment.height;
                break;
            case m_subs.OUTLINE:
                var subs_outline_blur_y = m_scgraph.find_input(graph, subs1,
                        m_subs.POSTPROCESSING);
                var subs_outline_blur_x = m_scgraph.find_input(graph, subs_outline_blur_y,
                        m_subs.POSTPROCESSING);
                var subs_outline_extend_y = m_scgraph.find_input(graph, subs_outline_blur_x,
                        m_subs.POSTPROCESSING);
                var subs_outline_extend_x = m_scgraph.find_input(graph, subs_outline_extend_y,
                        m_subs.POSTPROCESSING);

                m_scgraph.set_texel_size(subs_outline_blur_y, 1/tex_width, 1/tex_width);
                m_scgraph.set_texel_size(subs_outline_blur_x, 1/tex_width, 1/tex_width);
                m_scgraph.set_texel_size(subs_outline_extend_y, 1/tex_width, 1/tex_width);
                m_scgraph.set_texel_size(subs_outline_extend_x, 1/tex_width, 1/tex_width);
                break;
            default:
                m_scgraph.set_texel_size(subs1, 1/tex_width, 1/tex_height);
                break;
            }
        }
    });
}

exports.subs_array = subs_array;
/**
 * Return subscene array matching types array
 * return only existing subscenes
 * @methodOf scenes
 */
function subs_array(scene, types) {
    var subscenes = [];

    // in strict succession
    for (var i = 0; i < types.length; i++) {
        var type = types[i];

        if (scene._render.graph)
            m_graph.traverse(scene._render.graph, function(node, attr) {
                var subs = attr;

                if (subs.type == type)
                    subscenes.push(subs);
            });
    }
    return subscenes;
}

exports.get_subs = get_subs;
/**
 * Return first subscene matching given type
 * @methodOf scenes
 */
function get_subs(scene, type) {
    var graph = scene._render.graph;
    return m_scgraph.find_subs(graph, type);
}

exports.render_both_eyes = function() {
    switch_stereo_render_eye_mode(false);
}

exports.render_one_eye = function() {
    switch_stereo_render_eye_mode(true);
}

function switch_stereo_render_eye_mode(is_one_eye) {
    var scene = get_main();
    if (!scene)
        return;
    var graph = scene._render.graph;
    m_graph.traverse(graph, function(node, attr) {
        var subs = attr;
        var camera = subs.camera;

        // CHECK: subs.camera can be null
        if (camera && camera.type == m_cam.TYPE_HMD_RIGHT)
            subs.force_do_not_render = is_one_eye;
    });
}
/**
 * Get horizon and zenith colors
 */
exports.get_environment_colors = function(scene) {

    var subs = get_subs(scene, m_subs.MAIN_OPAQUE);

    var hor = subs.horizon_color;
    var zen = subs.zenith_color;

    var hor_dest = [];
    var zen_dest = [];

    hor_dest[0] = hor[0];
    hor_dest[1] = hor[1];
    hor_dest[2] = hor[2];

    zen_dest[0] = zen[0];
    zen_dest[1] = zen[1];
    zen_dest[2] = zen[2];

    return [subs.environment_energy, hor_dest, zen_dest];
}

exports.set_environment_colors = set_environment_colors;
/**
 * Set environment energy, horizon and zenith colors
 */
function set_environment_colors(scene, environment_energy, horizon_color, zenith_color) {

    var subscenes = subs_array(scene, LIGHT_SUBSCENE_TYPES);

    for (var i = 0; i < subscenes.length; i++) {
        var subs = subscenes[i];

        subs.horizon_color.set(horizon_color);
        subs.zenith_color.set(zenith_color);
        subs.environment_energy = environment_energy;

        subs.need_perm_uniforms_update = true;
    }
    var subs_sky = m_scgraph.find_subs(scene._render.graph, m_subs.SKY);
    if (subs_sky)
        update_sky(scene, subs_sky);
}

/**
 * Get sky params
 */
exports.get_sky_params = function(scene) {

    var subs = get_subs(scene, m_subs.SKY);
    if (subs && subs.procedural_skydome) {
        var sky_params = {};
        sky_params.color = new Array(3);
        m_vec3.copy(subs.sky_color, sky_params.color);
        sky_params.procedural_skydome = subs.procedural_skydome;
        sky_params.use_as_environment_lighting = subs.use_as_environment_lighting;
        sky_params.rayleigh_brightness = subs.rayleigh_brightness;
        sky_params.mie_brightness = subs.mie_brightness;
        sky_params.spot_brightness = subs.spot_brightness;
        sky_params.scatter_strength = subs.scatter_strength;
        sky_params.rayleigh_strength = subs.rayleigh_strength;
        sky_params.mie_strength = subs.mie_strength;
        sky_params.rayleigh_collection_power = subs.rayleigh_collection_power;
        sky_params.mie_collection_power = subs.mie_collection_power;
        sky_params.mie_distribution = subs.mie_distribution;
        return sky_params;
    } else {
        return null;
    }
}

/**
 * Get fog params methods
 */
exports.get_fog_intensity = function(scene) {

    var subs = subs_array(scene, FOG_SUBSCENE_TYPES)[0];

    return subs.fog_params[0];
}

exports.get_fog_depth = function(scene) {

    var subs = subs_array(scene, FOG_SUBSCENE_TYPES)[0];

    return subs.fog_params[1];
}

exports.get_fog_start = function(scene) {

    var subs = subs_array(scene, FOG_SUBSCENE_TYPES)[0];

    return subs.fog_params[2];
}

exports.get_fog_height = function(scene) {

    var subs = subs_array(scene, FOG_SUBSCENE_TYPES)[0];

    return subs.fog_params[3];
}

/**
 * Set fog params methods
 */
exports.set_fog_intensity = function(scene, fog_intensity) {

    var subscenes = subs_array(scene, FOG_SUBSCENE_TYPES);

    for (var i = 0; i < subscenes.length; i++) {
        var subs = subscenes[i];
        subs.fog_params[0] = fog_intensity;
        subs.need_perm_uniforms_update = true;
    }
}

exports.set_fog_depth = function(scene, fog_depth) {

    var subscenes = subs_array(scene, FOG_SUBSCENE_TYPES);

    for (var i = 0; i < subscenes.length; i++) {
        var subs = subscenes[i];
        subs.fog_params[1] = fog_depth;
        subs.need_perm_uniforms_update = true;
    }
}

exports.set_fog_start = function(scene, fog_start) {

    var subscenes = subs_array(scene, FOG_SUBSCENE_TYPES);

    for (var i = 0; i < subscenes.length; i++) {
        var subs = subscenes[i];
        subs.fog_params[2] = fog_start;
        subs.need_perm_uniforms_update = true;
    }
}

exports.set_fog_height = function(scene, fog_height) {

    var subscenes = subs_array(scene, FOG_SUBSCENE_TYPES);

    for (var i = 0; i < subscenes.length; i++) {
        var subs = subscenes[i];
        subs.fog_params[3] = fog_height;
        subs.need_perm_uniforms_update = true;
    }
}

/**
 * Get fog color and density
 */
exports.get_fog_color_density = function(scene, opt_dest) {

    var dest = opt_dest || [];

    var subs = subs_array(scene, FOG_SUBSCENE_TYPES)[0];

    var fcd = subs.fog_color_density;

    dest[0] = fcd[0];
    dest[1] = fcd[1];
    dest[2] = fcd[2];
    dest[3] = fcd[3];

    return dest;
}

/**
 * Set fog color and density
 */
exports.set_fog_color_density = function(scene, val) {

    var subscenes = subs_array(scene, FOG_SUBSCENE_TYPES);

    for (var i = 0; i < subscenes.length; i++) {
        var subs = subscenes[i];
        subs.fog_color_density.set(val);
        subs.need_perm_uniforms_update = true;
    }
}

/**
 * Get ssao params
 */
exports.get_ssao_params = function(scene) {

    var subs = get_subs(scene, m_subs.SSAO);
    var subs_blur = get_subs(scene, m_subs.SSAO_BLUR);
    var subs_main = get_subs(scene, m_subs.MAIN_OPAQUE);
    if (!subs)
        return null;

    var ssao_params = {};
    ssao_params.quality = subs.ssao_samples;
    ssao_params.use_hemisphere = subs.ssao_hemisphere;
    ssao_params.use_blur_depth = subs_blur.ssao_blur_depth;
    ssao_params.blur_discard_value = subs_blur.ssao_blur_discard_value;
    ssao_params.radius_increase = subs.ssao_radius_increase;
    ssao_params.influence = subs.ssao_influence;
    ssao_params.dist_factor = subs.ssao_dist_factor;
    ssao_params.ssao_only = subs_main.ssao_only;
    ssao_params.ssao_white = subs.ssao_white;

    return ssao_params;
}

exports.get_dof_params = function(scene) {

    var subs = get_subs(scene, m_subs.DOF);
    if (!subs)
        return null;

    var dof_params = {};

    dof_params.dof_on = subs.camera.dof_on;
    dof_params.dof_bokeh = subs.dof_bokeh; // directly on the subs
    dof_params.dof_distance = subs.camera.dof_distance;
    dof_params.dof_front_start = subs.camera.dof_front_start;
    dof_params.dof_front_end = subs.camera.dof_front_end;
    dof_params.dof_rear_start = subs.camera.dof_rear_start;
    dof_params.dof_rear_end = subs.camera.dof_rear_end;
    dof_params.dof_power = subs.camera.dof_power;
    dof_params.dof_bokeh_intensity = subs.camera.dof_bokeh_intensity;
    dof_params.dof_object = subs.camera.dof_object;
    return dof_params;
}

exports.set_dof_params = set_dof_params;
function set_dof_params(scene, dof_params) {

    var subs_dofs = subs_array(scene, [m_subs.DOF]);
    if (!subs_dofs.length) {
        m_print.error("DOF is not enabled on the scene. Check camera settings");
        return 0;
    }

    for (var i = 0; i < subs_dofs.length; i++)
        set_params_dof_subs(subs_dofs[i], dof_params, scene);
}

function set_params_dof_subs(subs_dof, dof_params, scene) {
    var bokeh_enabled = subs_dof.dof_bokeh;

    var subs_coc_arr = bokeh_enabled ? subs_array(scene, [m_subs.COC]) : [];

    var graph = scene._render.graph;

    if (typeof dof_params.dof_on == "boolean") {
        subs_dof.camera.dof_on = dof_params.dof_on;
        if (bokeh_enabled)
            for (var i = 0; i < subs_coc_arr.length; i++)
                subs_coc_arr[i].camera.dof_on = dof_params.dof_on;
    }
    if (typeof dof_params.dof_distance == "number") {
        subs_dof.camera.dof_distance = dof_params.dof_distance;
        if (bokeh_enabled)
            for (var i = 0; i < subs_coc_arr.length; i++)
                subs_coc_arr[i].camera.dof_distance = dof_params.dof_distance;
    }
    if (typeof dof_params.dof_front_start == "number") {
        subs_dof.camera.dof_front_start = dof_params.dof_front_start;
        if (bokeh_enabled)
            for (var i = 0; i < subs_coc_arr.length; i++)
                subs_coc_arr[i].camera.dof_front_start = dof_params.dof_front_start;
    }
    if (typeof dof_params.dof_front_end == "number") {
        subs_dof.camera.dof_front_end = dof_params.dof_front_end;
        if (bokeh_enabled)
            for (var i = 0; i < subs_coc_arr.length; i++)
                subs_coc_arr[i].camera.dof_front_end = dof_params.dof_front_end;
    }
    if (typeof dof_params.dof_rear_start == "number") {
        subs_dof.camera.dof_rear_start = dof_params.dof_rear_start;
        if (bokeh_enabled)
            for (var i = 0; i < subs_coc_arr.length; i++)
                subs_coc_arr[i].camera.dof_rear_start = dof_params.dof_rear_start;
    }
    if (typeof dof_params.dof_rear_end == "number") {
        subs_dof.camera.dof_rear_end = dof_params.dof_rear_end;
        if (bokeh_enabled)
            for (var i = 0; i < subs_coc_arr.length; i++)
                subs_coc_arr[i].camera.dof_rear_end = dof_params.dof_rear_end;
    }
    if (typeof dof_params.dof_bokeh_intensity == "number") {
        subs_dof.camera.dof_bokeh_intensity = dof_params.dof_bokeh_intensity;
        if (bokeh_enabled) {
            var subs_pp_array = m_scgraph.get_inputs_by_type(graph, subs_dof,m_subs.POSTPROCESSING);
            // Y_DOF_BLUR
            subs_pp_array[0].camera.dof_bokeh_intensity = dof_params.dof_bokeh_intensity;
            subs_pp_array[1].camera.dof_bokeh_intensity = dof_params.dof_bokeh_intensity;
            // X_DOF_BLUR
            subs_pp_array[0] = m_scgraph.find_input(graph, subs_pp_array[0], m_subs.POSTPROCESSING);
            subs_pp_array[0].camera.dof_bokeh_intensity = dof_params.dof_bokeh_intensity;
        }
    }
    if (typeof dof_params.dof_power == "number") {
        if (bokeh_enabled) {
            var dof_power = dof_params.dof_power;
            subs_dof.camera.dof_power = dof_power;

            // half power because of downsized subs
            dof_power /= 2.0;

            var width  = subs_dof.camera.width;
            var height = subs_dof.camera.height;

            var texel_right = [1/width, 0.0];
            var texel_up_right = [1/width * 0.5, 1/height * 0.866];
            var texel_up_left  = [-1/width * 0.5, 1/height * 0.866];

            var subs_pp_array = m_scgraph.get_inputs_by_type(graph, subs_dof, m_subs.POSTPROCESSING);

            // Y_DOF_BLUR
            m_scgraph.set_texel_size_mult(subs_pp_array[0], dof_power);
            m_scgraph.set_texel_size(subs_pp_array[0], texel_up_left[0], texel_up_left[1]);
            m_scgraph.set_texel_size_mult(subs_pp_array[1], dof_power);
            m_scgraph.set_texel_size(subs_pp_array[1], texel_up_right[0], texel_up_right[1]);

            // X_DOF_BLUR
            subs_pp_array[0] = m_scgraph.find_input(graph, subs_pp_array[0],
                    m_subs.POSTPROCESSING);
            m_scgraph.set_texel_size_mult(subs_pp_array[0], dof_power);
            m_scgraph.set_texel_size(subs_pp_array[0], texel_right[0], texel_right[1]);

            if (subs_dof.camera.dof_foreground_blur) {
                // Y_ALPHA_BLUR
                subs_pp_array[0] = m_scgraph.find_input(graph, subs_pp_array[0],
                        m_subs.COC);
                subs_pp_array[0] = m_scgraph.find_input(graph, subs_pp_array[0],
                        m_subs.POSTPROCESSING);
                m_scgraph.set_texel_size(subs_pp_array[0], 1/width, 1/height);

                // X_ALPHA_BLUR
                subs_pp_array[0] = m_scgraph.find_input(graph, subs_pp_array[0],
                        m_subs.POSTPROCESSING);
                m_scgraph.set_texel_size(subs_pp_array[0], 1/width, 1/height);
            }

        } else {
            subs_dof.camera.dof_power = dof_params.dof_power;
            var subs_pp1 = m_scgraph.find_input(graph, subs_dof, m_subs.POSTPROCESSING);
            var subs_pp2 = m_scgraph.find_input(graph, subs_pp1, m_subs.POSTPROCESSING);

            m_scgraph.set_texel_size_mult(subs_pp1, subs_dof.camera.dof_power);
            m_scgraph.set_texel_size(subs_pp1, 1/subs_dof.camera.width,
                                               1/subs_dof.camera.height);
            m_scgraph.set_texel_size_mult(subs_pp2, subs_dof.camera.dof_power);
            m_scgraph.set_texel_size(subs_pp2, 1/subs_dof.camera.width,
                                               1/subs_dof.camera.height);
        }
    }
}

exports.get_god_rays_params = function(scene) {

    var gr_subs = subs_array(scene, [m_subs.GOD_RAYS]);
    var combo_subs = get_subs(scene, m_subs.GOD_RAYS_COMBINE);

    if (!gr_subs || !combo_subs)
        return null;

    var god_rays_params = {};

    god_rays_params.god_rays_max_ray_length = gr_subs[0].max_ray_length;
    god_rays_params.god_rays_intensity = combo_subs.god_rays_intensity;

    var batch = gr_subs[0].draw_data[0].bundles[0].batch;
    god_rays_params.god_rays_steps = m_batch.get_batch_directive(batch, "STEPS_PER_PASS")[1];

    return god_rays_params;
}

exports.set_god_rays_params = function(scene, god_rays_params) {

    var gr_subs = subs_array(scene, [m_subs.GOD_RAYS]);
    var combo_subs = subs_array(scene, [m_subs.GOD_RAYS_COMBINE]);

    if (!gr_subs.length || !combo_subs.length) {
        m_print.error("God Rays are not enabled on the scene");
        return 0;
    }

    if (typeof god_rays_params.god_rays_intensity == "number")
        for (var i = 0; i < combo_subs.length; i++)
            combo_subs[i].god_rays_intensity = god_rays_params.god_rays_intensity;
    if (typeof god_rays_params.god_rays_max_ray_length == "number") {
        var r_length = god_rays_params.god_rays_max_ray_length;
        for (var i = 0; i < gr_subs.length; i++) {
            gr_subs[i].max_ray_length = r_length;
            gr_subs[i].radial_blur_step = r_length / gr_subs[i].steps_per_pass / (i + 1);
            gr_subs[i].need_perm_uniforms_update = true;
        }
    }
    if (typeof god_rays_params.god_rays_steps == "number") {

        var steps = m_shaders.glsl_value(god_rays_params.god_rays_steps, 1);
        var r_length = gr_subs[0].max_ray_length

        for (var i = 0; i < gr_subs.length; i++) {
            gr_subs[i].steps_per_pass = steps;
            gr_subs[i].radial_blur_step = r_length / steps / (i + 1);
            gr_subs[i].need_perm_uniforms_update = true;

            var bundle = gr_subs[i].draw_data[0].bundles[0];
            var batch = bundle.batch;
            m_batch.set_batch_directive(batch, "STEPS_PER_PASS", steps);
            m_batch.update_shader(batch);
            m_subs.append_draw_data(gr_subs[i], bundle);
        }
    }

    for (var i = 0; i < combo_subs.length; i++)
        combo_subs.need_perm_uniforms_update = true;
}

exports.get_bloom_params = function(scene) {

    var lum_subs = get_subs(scene, m_subs.LUMINANCE_TRUNCED);
    var bloom_subs = get_subs(scene, m_subs.BLOOM);
    if (!lum_subs || !bloom_subs) {
        return null;
    }

    var bloom_params = {};

    bloom_params.key = lum_subs.bloom_key;
    bloom_params.edge_lum = lum_subs.bloom_edge_lum;
    bloom_params.blur = bloom_subs.bloom_blur;
    bloom_params.adaptive = lum_subs.adaptive_bloom;
    bloom_params.average_luminance = lum_subs.average_luminance;

    return bloom_params;
}

exports.set_bloom_params = set_bloom_params
function set_bloom_params(scene, bloom_params) {

    var lum_subs = subs_array(scene, [m_subs.LUMINANCE_TRUNCED]);
    var bloom_subs = subs_array(scene, [m_subs.BLOOM]);

    if (!lum_subs.length || !bloom_subs.length) {
        m_print.error("Bloom is not enabled on the scene");
        return 0;
    }

    if (typeof bloom_params.key == "number") {
        for (var i = 0; i < lum_subs.length; i++) {
            lum_subs[i].bloom_key = bloom_params.key;
            lum_subs[i].need_perm_uniforms_update = true;
        }
    }
    if (typeof bloom_params.edge_lum == "number") {
        for (var i = 0; i < lum_subs.length; i++) {
            lum_subs[i].bloom_edge_lum = bloom_params.edge_lum;
            lum_subs[i].need_perm_uniforms_update = true;
        }
    }

    if (typeof bloom_params.blur == "number") {
        for (var i = 0; i < bloom_subs.length; i++) {
            bloom_subs[i].bloom_blur = bloom_params.blur;
            var graph = scene._render.graph;

            var original_width = bloom_subs[i].camera.width / 0.5;
            var original_height = bloom_subs[i].camera.height / 0.5;
            var bloom_inputs = m_scgraph.get_inputs_by_type(graph, bloom_subs[i], m_subs.POSTPROCESSING);

            for (var j = 0; j < bloom_inputs.length; ++j) {
                var subs_blur_y = bloom_inputs[j];
                var subs_blur_x = m_scgraph.find_input(graph, subs_blur_y, m_subs.POSTPROCESSING);

                var width = original_width * subs_blur_y.bloom_blur_scale;
                var height = original_height * subs_blur_y.bloom_blur_scale;

                m_scgraph.set_texel_size_mult(subs_blur_y, bloom_params.blur);
                m_scgraph.set_texel_size(subs_blur_y, 1/width, 1/height);
                m_scgraph.set_texel_size_mult(subs_blur_x, bloom_params.blur);
                m_scgraph.set_texel_size(subs_blur_x, 1/width, 1/height);
            }
        }
    }
    if (typeof bloom_params.average_luminance == "number") {
        for (var i = 0; i < lum_subs.length; i++)
            if (!lum_subs[i].adaptive_bloom) {
                lum_subs[i].average_luminance = bloom_params.average_luminance;
                lum_subs[i].need_perm_uniforms_update = true;
            }
    }
}

exports.get_glow_material_params = function(scene) {
    var glow_combine_subs = get_subs(scene, m_subs.GLOW_COMBINE);

    if (!glow_combine_subs)
        return null;

    var glow_material_params = {};

    glow_material_params.small_glow_mask_coeff = glow_combine_subs.small_glow_mask_coeff;
    glow_material_params.large_glow_mask_coeff = glow_combine_subs.large_glow_mask_coeff;
    glow_material_params.small_glow_mask_width = glow_combine_subs.small_glow_mask_width;
    glow_material_params.large_glow_mask_width = glow_combine_subs.large_glow_mask_width;

    return glow_material_params;
}

exports.set_glow_material_params = set_glow_material_params;
function set_glow_material_params(scene, glow_material_params) {
    var glow_combine_subscenes = subs_array(scene, [m_subs.GLOW_COMBINE]);

    if (!glow_combine_subscenes.length) {
        m_print.error("Glow is not enabled on the scene");
        return null;
    }

    for (var i = 0; i < glow_combine_subscenes.length; i++)
        set_params_glow_subs(glow_combine_subscenes[i], glow_material_params, scene);
}


function set_params_glow_subs(glow_combine_subs, glow_material_params, scene) {
    var graph = scene._render.graph;
    var subs = m_scgraph.get_inputs(graph, glow_combine_subs);

    for (var i = 0; i < subs.length; ++i) {
        var subscene = subs[i];

        if (subscene.type == m_subs.POSTPROCESSING && subscene.subtype == "GLOW_MASK_LARGE")
            var postproc_y_blur_large_subs = subscene;
        if (subscene.type == m_subs.POSTPROCESSING && subscene.subtype == "GLOW_MASK_SMALL")
            var postproc_y_blur_small_subs = subscene;
    }

    var postproc_x_blur_large_subs = m_scgraph.find_input(graph,
            postproc_y_blur_large_subs, m_subs.POSTPROCESSING);
    var postproc_x_blur_small_subs = m_scgraph.find_input(graph,
            postproc_y_blur_small_subs, m_subs.POSTPROCESSING);

    if (typeof glow_material_params.small_glow_mask_coeff == "number") {
        glow_combine_subs.small_glow_mask_coeff = glow_material_params.small_glow_mask_coeff;
        glow_combine_subs.need_perm_uniforms_update = true;
    }

    if (typeof glow_material_params.large_glow_mask_coeff == "number") {
        glow_combine_subs.large_glow_mask_coeff = glow_material_params.large_glow_mask_coeff;
        glow_combine_subs.need_perm_uniforms_update = true;
    }

    if (typeof glow_material_params.small_glow_mask_width == "number") {
        glow_combine_subs.small_glow_mask_width = glow_material_params.small_glow_mask_width;
        m_scgraph.set_texel_size_mult(postproc_y_blur_small_subs,
                glow_material_params.small_glow_mask_width);
        m_scgraph.set_texel_size(postproc_y_blur_small_subs,
                1/glow_combine_subs.camera.width,
                1/glow_combine_subs.camera.height);
        postproc_y_blur_small_subs.need_perm_uniforms_update = true;

        m_scgraph.set_texel_size_mult(postproc_x_blur_small_subs,
                glow_material_params.small_glow_mask_width);
        m_scgraph.set_texel_size(postproc_x_blur_small_subs,
                1/glow_combine_subs.camera.width,
                1/glow_combine_subs.camera.height);
        postproc_x_blur_small_subs.need_perm_uniforms_update = true;
    }

    if (typeof glow_material_params.large_glow_mask_width == "number") {
        glow_combine_subs.large_glow_mask_width = glow_material_params.large_glow_mask_width;
        m_scgraph.set_texel_size_mult(postproc_y_blur_large_subs,
                glow_material_params.large_glow_mask_width);
        m_scgraph.set_texel_size(postproc_y_blur_large_subs,
                1/glow_combine_subs.camera.width,
                1/glow_combine_subs.camera.height);
        postproc_y_blur_large_subs.need_perm_uniforms_update = true;

        m_scgraph.set_texel_size_mult(postproc_x_blur_large_subs,
                glow_material_params.large_glow_mask_width);
        m_scgraph.set_texel_size(postproc_x_blur_large_subs,
                1/glow_combine_subs.camera.width,
                1/glow_combine_subs.camera.height);
        postproc_x_blur_large_subs.need_perm_uniforms_update = true;

    }
}

exports.get_wind_params = function(scene) {
    var wind = get_wind(scene);
    var length = m_vec3.length(wind);

    if (length == 0)
        return null;

    var angle = m_util.rad_to_deg(Math.atan2(wind[0], -wind[1]));

    var wind_params = {};
    wind_params.wind_dir = angle;
    wind_params.wind_strength = length;

    return wind_params;
}

exports.schedule_grass_map_update = schedule_grass_map_update;
/**
 * Schedule update of grass subscenes on given bpy scene.
 * @methodOf scenes
 */
function schedule_grass_map_update(bpy_scene) {
    bpy_scene._render.need_grass_map_update = true;
}

exports.get_water_surface_level = get_water_surface_level;
/**
 * Get water surface level
 * @methodOf scenes
 */
function get_water_surface_level(scene, pos_x, pos_y) {

    var render = scene._render;
    var wp = render.water_params;

    if (!wp.dynamic)
        return wp.water_level;

    var waves_height = wp.waves_height;
    var waves_length = wp.waves_length;
    var water_level  = wp.water_level;

    var wind_str = m_vec3.length(render.wind) || 1;

    var subs = get_subs(scene, m_subs.MAIN_OPAQUE);
    var time = subs.time;
    time *= wind_str;

    // small waves
    var cellular_coords = _vec2_tmp;
    cellular_coords[0] = 20.0 / waves_length * (pos_x - 0.25 * time);
    cellular_coords[1] = 20.0 / waves_length * (pos_y - 0.25 * time);
    var cellular1 = m_util.cellular2x2(cellular_coords);
    cellular_coords[0] = 17.0 / waves_length * (pos_y + 0.1  * time);
    cellular_coords[1] = 17.0 / waves_length * (pos_x + 0.1  * time);
    var cellular2 = m_util.cellular2x2(cellular_coords);
    var small_waves = cellular1 + cellular2 - 1;

    // distant waves (only noise)
    var dst_noise_scale0  = wp.dst_noise_scale0;
    var dst_noise_scale1  = wp.dst_noise_scale1;
    var dst_noise_freq0   = wp.dst_noise_freq0;
    var dst_noise_freq1   = wp.dst_noise_freq1;

    var noise_coords = _vec2_tmp;

    noise_coords[0] = dst_noise_scale0 * (pos_x + dst_noise_freq0 * time);
    noise_coords[1] = dst_noise_scale0 * (pos_y + dst_noise_freq0 * time);
    var noise1 = m_util.snoise(noise_coords);

    noise_coords[0] = dst_noise_scale1 * (pos_y - dst_noise_freq1 * time);
    noise_coords[1] = dst_noise_scale1 * (pos_x - dst_noise_freq1 * time);
    var noise2 = m_util.snoise(noise_coords);
    var dist_waves = waves_height * noise1 * noise2;

    // waves moving towards the shore
    if (wp.shoremap_image) {

        // center and size of shore distance field
        var size_x = wp.shoremap_size[0];
        var size_y = wp.shoremap_size[1];
        var center_x = wp.shoremap_center[0];
        var center_y = wp.shoremap_center[1];

        // get uv coords on shore distance map
        var x = (pos_x - center_x) / size_x;
        var y = (center_y + pos_y) / size_y;
        x += 0.5;
        y += 0.5;

        // if position is out of boundings, consider that shore dist = 1
        if (x > 1 || x < 0 || y > 1 || y < 0) {
            var wave_height = dist_waves;
        } else {
            var width = wp.shoremap_tex_size;
            var array = render.shore_distances;

            var shore_dist = m_util.get_array_smooth_value(array, width, x, y);
            var dir_min_shore_fac = wp.dir_min_shore_fac;
            var dir_freq          = wp.dir_freq;
            var dir_noise_scale   = wp.dir_noise_scale;
            var dir_noise_freq    = wp.dir_noise_freq;
            var dir_min_noise_fac = wp.dir_min_noise_fac;
            var dst_min_fac       = wp.dst_min_fac;

            var max_shore_dist = wp.max_shore_dist;
            var shore_waves_length = waves_length / max_shore_dist / Math.PI;
            // waves moving towards the shore
            var waves_coords = [dir_noise_scale / waves_length * (pos_x + dir_noise_freq * time),
                                dir_noise_scale / waves_length * (pos_y + dir_noise_freq * time)];

            var dist_fact = Math.sqrt(shore_dist);
            var shore_dir_waves = waves_height * Math.max(shore_dist, dir_min_shore_fac)
                    * Math.sin((dist_fact / shore_waves_length + dir_freq * time))
                    * Math.max( m_util.snoise(waves_coords), dir_min_noise_fac );
            // mix two types of waves basing on distance to the shore
            var mix_rate = Math.max(dist_fact, dst_min_fac);
            var wave_height = shore_dir_waves * (1 - mix_rate) + dist_waves * mix_rate;
            small_waves *= shore_dist;
        }
    } else
        var wave_height = dist_waves;

    wave_height += 0.05 * small_waves;
    var cur_water_level = water_level + wave_height;

    return cur_water_level;
}

exports.get_water_mat_params = function(scene, water_params) {

    var wp = scene._render.water_params;
    var subs = get_subs(scene, m_subs.MAIN_OPAQUE);

    if (!subs || !wp)
        return;

    water_params.waves_height = wp.waves_height;
    water_params.waves_length = wp.waves_length;

    water_params.water_fog_density = subs.water_fog_color_density[3];
    var wfc = water_params.water_fog_color = [];
    wfc[0]  = subs.water_fog_color_density[0];
    wfc[1]  = subs.water_fog_color_density[1];
    wfc[2]  = subs.water_fog_color_density[2];
}

exports.set_water_params = function(scene, water_params) {

    var wp = scene._render.water_params;

    if (!wp) {
        m_print.error("set_water_params() - no water parameters on the scene");
        return null;
    }

    if (typeof water_params.dst_noise_scale0 == "number")
        wp.dst_noise_scale0 = water_params.dst_noise_scale0;
    if (typeof water_params.dst_noise_scale1 == "number")
        wp.dst_noise_scale1 = water_params.dst_noise_scale1;
    if (typeof water_params.dst_noise_freq0 == "number")
        wp.dst_noise_freq0 = water_params.dst_noise_freq0;
    if (typeof water_params.dst_noise_freq1 == "number")
        wp.dst_noise_freq1 = water_params.dst_noise_freq1;
    if (typeof water_params.dir_min_shore_fac == "number")
        wp.dir_min_shore_fac = water_params.dir_min_shore_fac;
    if (typeof water_params.dir_freq == "number")
        wp.dir_freq = water_params.dir_freq;
    if (typeof water_params.dir_noise_scale == "number")
        wp.dir_noise_scale = water_params.dir_noise_scale;
    if (typeof water_params.dir_noise_freq == "number")
        wp.dir_noise_freq = water_params.dir_noise_freq;
    if (typeof water_params.dir_min_noise_fac == "number")
        wp.dir_min_noise_fac = water_params.dir_min_noise_fac;
    if (typeof water_params.dst_min_fac == "number")
        wp.dst_min_fac = water_params.dst_min_fac;
    if (typeof water_params.waves_hor_fac == "number")
        wp.waves_hor_fac = water_params.waves_hor_fac;
    if(typeof water_params.water_dynamic == "number")
        wp.dynamic = water_params.water_dynamic;

    var subscenes = subs_array(scene, MAIN_SUBSCENE_TYPES);

    for (var i = 0; i < subscenes.length; i++) {
        var sub = subscenes[i];

        if (typeof water_params.water_fog_density == "number" && wp.fog_color_density)
            sub.water_fog_color_density[3] = water_params.water_fog_density;

        if (typeof water_params.water_fog_color == "object" && wp.fog_color_density)
            sub.water_fog_color_density.set(water_params.water_fog_color)

        sub.need_perm_uniforms_update = true;
    }
}

exports.get_shore_dist = function(scene, trans, v_dist_mult) {

    var wp = scene._render.water_params;
    if (!wp.shoremap_image)
        return SHORE_DIST_COMPAT;

    // center and size of shore distance field
    var size_x = wp.shoremap_size[0];
    var size_y = wp.shoremap_size[1];
    var center_x = wp.shoremap_center[0];
    var center_y = wp.shoremap_center[1];
    var max_shore_dist = wp.max_shore_dist;

    var water_level = wp.water_level;

    // get uv coords on shore distance map
    var x = (trans[0] - center_x) / size_x;
    var y = (center_y + trans[1]) / size_y;
    x += 0.5;
    y += 0.5;

    // if position is out of boundings, consider that shore dist = 1
    if (x > 1 || x < 0 || y > 1 || y < 0) {
        var shore_dist = 1.0;
    } else {
        var width = wp.shoremap_tex_size;
        var array = _active_scene._render.shore_distances;
        var shore_dist_xy = max_shore_dist * m_util.get_array_smooth_value(array, width, x, y);
        var shore_dist_z  = (water_level - trans[2]) * v_dist_mult;

        var shore_dist = Math.sqrt(shore_dist_xy * shore_dist_xy +
                shore_dist_z * shore_dist_z);
        return shore_dist;
    }
}

/**
 * Executed every frame
 * update all scenes
 */
exports.update = function(timeline, elapsed) {
    m_render.clear();

    var active_cam_render = get_active()._camera.render;

    // update subscene params (uniforms)
    for (var i = 0; i < _scenes.length; i++) {
        var scene = _scenes[i];
        var graph = scene._render.graph;
        var render = scene._render;

        if (render.water_params) {
            var trans = m_tsr.get_trans(active_cam_render.world_tsr, _vec3_tmp);
            var cam_water_depth = trans[2] - get_water_surface_level(scene, trans[0], trans[1]);
            m_tsr.set_trans(trans, active_cam_render.world_tsr);
        }

        for (var j = 0; j < render.video_textures.length; j++) {
            var vtex = render.video_textures[j]._render;
            var video = vtex.video_file;
            var seq_video = vtex.seq_video;

            if (scene["b4w_use_nla"] && vtex.use_nla)
                continue;

            if (!video && !seq_video)
                continue;

            if (!m_tex.video_is_played(vtex))
                continue;

            var current_frame = m_tex.video_get_current_frame(vtex);
            var start_frame = m_tex.video_get_start_frame(vtex);
            if (video && cfg_def.is_mobile_device)
                start_frame -= FRAME_EPS;
            var end_frame = m_tex.video_get_end_frame(vtex);

            // NOTE: if frame_duration + frame_offset is bigger than the actual
            // video length, cycled non-NLA video won't consider frames at
            // the end of the cycle

            // loop and initial reset
            if (current_frame >= end_frame && vtex.use_cyclic
                    || current_frame < start_frame) {
                m_tex.reset_video(vtex);
                if (seq_video)
                    vtex.seq_last_discrete_mark = m_tex.seq_video_get_discrete_timemark(
                            vtex, timeline);
                continue;
            }

            // pause
            if (current_frame >= end_frame && !vtex.use_cyclic) {
                m_tex.pause_video(vtex);
                continue;
            }

            // update
            if (m_tex.video_update_is_available(vtex)) {
                if (video)
                    m_tex.update_video_texture(vtex);
                else {
                    var mark = m_tex.seq_video_get_discrete_timemark(vtex,
                            timeline);
                    if (mark != vtex.seq_last_discrete_mark) {
                        m_tex.update_seq_video_texture(vtex);
                        vtex.seq_cur_frame++;
                    }
                    vtex.seq_last_discrete_mark = mark;
                }
            }
        }

        m_graph.traverse(graph, function(node, attr) {
            var subs = attr;
            if (TIME_SUBSCENE_TYPES.indexOf(subs.type) > -1) {
                subs.time = timeline;
            }
            if (render.water_params) {
                subs.cam_water_depth = cam_water_depth;
            }
        });
    }

    // rendering
    for (var i = 0; i < _scenes.length; i++) {
        var scene = _scenes[i];
        var render = scene._render;
        var graph = render.graph
        var queue = render.queue;

        // check if rendering needed
        if (!queue.length)
            continue;

        if (render.need_shadow_update) {
            update_shadow_subscenes(scene);
            render.need_shadow_update = false;
        }
        if (render.need_grass_map_update) {
            update_subs_grass_map(scene);
            render.need_grass_map_update = false;
        }
        if (render.need_outline) {
            enable_outline_draw(scene);
            render.need_outline = false;
        }
        if (render.motion_blur)
            update_motion_blur_subscenes(graph, elapsed);

        // NOTE: temoporary disabled T2X mode due to artifacts with blend objects
        //if (cfg_def.smaa && !m_cfg.context.alpha)
        //    update_smaa_resolve_subscene(graph);

        // find outline mask scene index
        var outline_mask_subs = m_scgraph.find_subs(graph, m_subs.OUTLINE_MASK);

        for (var j = 0; j < queue.length; j++) {
            var qsubs = queue[j];
            m_prerender.prerender_subs(qsubs);

            // optimize outline supporting subscenes
            if (outline_mask_subs)
                optimize_outline_postprocessing(graph, qsubs, outline_mask_subs);

            m_render.draw(qsubs);
        }
    }

    // NOTE: temoporary disabled T2X mode due to artifacts with blend objects
    //if (cfg_def.smaa && !m_cfg.context.alpha) {
    //    m_render.increment_subpixel_index();
    //    var cameras = active_cam_render.cameras;
    //    for (var i = 0; i < cameras.length; i++) {
    //        var cam = cameras[i];
    //        m_mat4.copy(cam.view_proj_matrix, cam.prev_view_proj_matrix);
    //    }
    //}

    if (cfg_def.show_hud_debug_info)
        m_hud.show_debug_info(_scenes, elapsed);
}

exports.request_outline = function(scene) {
    scene._render.need_outline = true;
}

function optimize_outline_postprocessing(graph, qsubs, outline_mask_subs) {
    // optimize outline POSTPROCESSING subscenes rendering
    if (qsubs.is_for_outline && qsubs.type == m_subs.POSTPROCESSING)
        if (outline_mask_subs.do_render != qsubs.do_render)
            qsubs.do_render = outline_mask_subs.do_render;

    // optimize OUTLINE rendering if OUTLINE_MASK is switched off
    if (!outline_mask_subs.do_render && qsubs.type == m_subs.OUTLINE)
        qsubs.draw_outline_flag = 0;
}

function replace_attachment(graph, id, type, tex) {
    var subs = m_graph.get_node_attr(graph, id);
    m_cam.set_attachment(subs.camera, type, tex);

    // TODO: assign now, not every frame
    subs.assign_texture = true;

    // replace linked textures
    m_graph.traverse_outputs(graph, id, function(id_out, attr_out,
            attr_edge) {

        var slink = attr_edge;
        if (slink.active && slink.from == type &&
                m_scgraph.check_slink_tex_conn(slink))
            replace_texture(graph, id_out, slink.to, tex);
    });

    // NOTE: bottom-up only
    m_graph.traverse_inputs(graph, id, function(id_in, attr_in,
            attr_edge) {

        var slink = attr_edge;
        if (slink.active && slink.from == type && slink.from == slink.to)
            replace_attachment(graph, id_in, type, tex);
    });
}

function replace_texture(graph, id, name, tex) {
    var subs = m_graph.get_node_attr(graph, id);

    var draw_data = subs.draw_data;
    for (var i = 0; i < draw_data.length; i++) {
        var bundles = draw_data[i].bundles;
        for (var j = 0; j < bundles.length; j++) {
            var batch = bundles[j].batch;
            m_batch.replace_texture(batch, tex, name);
        }
    }
}


/**
 * Update position of grass map camera.
 * uses _vec3_tmp _vec3_tmp2 _quat4_tmp
 */
function update_subs_grass_map(bpy_scene) {

    var subscenes_grass_map = subs_array(bpy_scene, [m_subs.GRASS_MAP]);
    for (var i = 0; i < subscenes_grass_map.length; i++) {
        var subs_grass_map = subscenes_grass_map[i];
        var cam = subs_grass_map.camera;

        var camera_render = bpy_scene._camera.render;
        var camera_trans = m_tsr.get_trans(camera_render.world_tsr, _vec3_tmp);

        // calculate grass map center point position relative to camera position
        var trans = _vec3_tmp2;
        trans[0] = 0;
        trans[1] = 0;
        trans[2] = -subs_grass_map.grass_map_dim[2] / 2;
        var quat = m_tsr.get_quat(camera_render.world_tsr, _quat4_tmp);
        m_vec3.transformQuat(trans, quat, trans);

        // XY plane
        trans[0] += camera_trans[0];
        trans[1] += camera_trans[1];
        trans[2] = 0;

        // no rotation camera looks down
        m_quat.identity(quat);

        m_cam.set_view_trans_quat(cam, trans, quat);
    }
}


function update_motion_blur_subscenes(graph, elapsed) {
    // TODO: initialize motion blur accumulator texture from rendering input on
    // the first iteration

    m_graph.traverse(graph, function(id, attr) {
        var subs = attr;

        if (subs.type != m_subs.MOTION_BLUR)
            return;

        if (!subs.slinks_internal[0] || !subs.textures_internal[0])
            m_assert.panic("Wrong MOTION_BLUR subscene");

        var slink = subs.slinks_internal[0];
        var tex = subs.textures_internal[0];

        subs.textures_internal[0] = subs.camera.color_attachment;

        // next subscene may use same texture as input
        m_graph.traverse_outputs(graph, id, function(id_out, attr_out, attr_edge) {
            var slink_out = attr_edge;

            if (slink_out.active)
                replace_texture(graph, id_out, slink_out.to, tex);
        });

        replace_attachment(graph, id, slink.from, tex);
        replace_texture(graph, id, slink.to, subs.textures_internal[0]);
        subs.motion_blur_exp = Math.exp(-elapsed/subs.mb_factor);
    });
}

function update_smaa_resolve_subscene(graph) {
    m_graph.traverse(graph, function(id, attr) {
        var subs = attr;

        if (subs.type != m_subs.SMAA_RESOLVE)
            return;

        if (!subs.slinks_internal[0] || !subs.textures_internal[0])
            m_assert.panic("Wrong SMAA RESOLVE subscene");

        var tex = subs.textures_internal[0];

        m_graph.traverse_inputs(graph, id, function(id_in, subs_in,
                attr_edge) {
            if (subs_in.type != m_subs.VELOCITY) {
                subs.textures_internal[0] = subs_in.camera.color_attachment;
                replace_attachment(graph, id_in, attr_edge.from, tex);
            }
        });

        replace_texture(graph, id, "u_color", tex);
        replace_texture(graph, id, "u_color_prev", subs.textures_internal[0]);
    });
}

exports.get_all_subscenes = function(scene) {
    var graph = scene._render.graph;

    var subscenes = [];
    m_graph.traverse(graph, function(node, attr) {
        subscenes.push(attr);
    });

    return subscenes;
}

exports.get_cam_water_depth = function() {
    var subs = get_subs(_active_scene, m_subs.MAIN_BLEND);
    var scene = _active_scene;

    if (!subs && !scene._render.water_params)
        return null;

    return subs.cam_water_depth;
}

exports.update_scene_permanent_uniforms = update_scene_permanent_uniforms;
function update_scene_permanent_uniforms(scene) {
    var graph = scene._render.graph;

    m_graph.traverse(graph, function(node, subs){
        subs.need_perm_uniforms_update = true;
    });
}

exports.set_debug_view_mode = function(subs_debug_view, mode) {
    subs_debug_view.debug_view_mode = mode;
    subs_debug_view.do_render = mode != m_debug_subscene.DV_NONE;
    subs_debug_view.blend = (mode == m_debug_subscene.DV_TRANSPARENT_WIREFRAME);
    subs_debug_view.need_perm_uniforms_update = true;

    var active_scene = get_active();
    for (var i = 0; i < MAIN_SUBSCENE_TYPES.length; i++) {
        var subscenes = subs_array(active_scene, [MAIN_SUBSCENE_TYPES[i]]);
        for (var j = 0; j < subscenes.length; j++)
            subscenes[j].do_not_debug = (mode == m_debug_subscene.DV_RENDER_TIME);
    }
}

exports.set_debug_colors_seed = function(subs_debug_view, seed) {
    subs_debug_view.debug_colors_seed = seed;
    subs_debug_view.need_perm_uniforms_update = true;
}

exports.set_render_time_threshold = function(subs_debug_view, threshold) {
    subs_debug_view.debug_render_time_threshold = threshold;
    subs_debug_view.need_perm_uniforms_update = true;
}

exports.set_wireframe_edge_color = function(subs_debug_view, color) {
    var draw_data = subs_debug_view.draw_data;
    for (var i = 0; i < draw_data.length; i++) {
        var bundles = draw_data[i].bundles;
        for (var j = 0; j < bundles.length; j++) {
            var batch = bundles[j].batch;
            m_vec3.copy(color, batch.wireframe_edge_color);
            batch.shader.need_uniforms_update = true;
        }
    }
}

exports.update_force_scene = (function() {
    var _quat_tmp = m_quat.create();

    return function (scene, obj) {
        var field = obj.field;
        var sc_wind = scene._render.wind;
        if (field && field.type == "WIND" && sc_wind) {
            var render = obj.render;
            var quat = m_tsr.get_quat(render.world_tsr, _quat_tmp);
            m_vec3.transformQuat(m_util.AXIS_Z, quat, sc_wind);
            m_vec3.normalize(sc_wind, sc_wind);
            m_vec3.scale(sc_wind, field.strength, sc_wind);

            var subs_arr = subs_array(scene, TIME_SUBSCENE_TYPES);
            for (var j = 0; j < subs_arr.length; j++)
                subs_arr[j].wind.set(sc_wind);
            return true;
        }
        return false;
    };
})();

exports.pick_color = function(scene, canvas_x, canvas_y) {
    var subs_color_pick = get_subs(scene, m_subs.COLOR_PICKING);
    if (subs_color_pick) {
        // NOTE: rewrite camera.proj_matrix and camera.view_proj_matrix
        // restoring not needed
        var is_color_sub_debug = cfg_dbg.enabled && (cfg_dbg.subs_type === m_subs.COLOR_PICKING ||
                cfg_dbg.subs_type === m_subs.COLOR_PICKING_XRAY);
        if (is_color_sub_debug)
            var viewport_xy = m_cont.canvas_to_viewport_coords(canvas_x, canvas_y,
                    _vec2_tmp, subs_color_pick.camera);
        else {
            var canvas = m_cont.get_canvas();
            var h = canvas.clientHeight;
            var w = canvas.clientWidth;
            m_cam.set_color_pick_proj(subs_color_pick.camera, canvas_x, canvas_y, w, h);
        }

        // NOTE: may be some delay since exports.update() execution
        m_prerender.prerender_subs(subs_color_pick);
        if (subs_color_pick.do_render)
            m_render.draw(subs_color_pick);

        var subs_color_pick_xray = get_subs(scene, m_subs.COLOR_PICKING_XRAY);
        if (subs_color_pick_xray) {
            m_mat4.copy(subs_color_pick.camera.proj_matrix,
                    subs_color_pick_xray.camera.proj_matrix);
            m_mat4.copy(subs_color_pick.camera.view_proj_matrix,
                    subs_color_pick_xray.camera.view_proj_matrix)
            m_util.extract_frustum_planes(
                    subs_color_pick_xray.camera.view_proj_matrix,
                    subs_color_pick_xray.camera.frustum_planes);
            m_prerender.prerender_subs(subs_color_pick_xray);
            if (subs_color_pick_xray.do_render)
                m_render.draw(subs_color_pick_xray);
            var cam = subs_color_pick_xray.camera;
        } else
            var cam = subs_color_pick.camera;

        if (subs_color_pick.do_render ||
                subs_color_pick_xray && subs_color_pick_xray.do_render)
            if (is_color_sub_debug) {
                viewport_xy[1] = cam.height - viewport_xy[1];
                return m_render.read_pixels(cam.framebuffer, viewport_xy[0],
                        viewport_xy[1], 1, 1, _pixel);
            } else
                return m_render.read_pixels(subs_color_pick_xray?
                        subs_color_pick_xray.camera.framebuffer:
                        subs_color_pick.camera.framebuffer, 0, 0, 1, 1, _pixel);
        else
            return null;
    } else
        m_print.error("Object Selection is not available on the scene");

    return null;
}

exports.set_outline_color = set_outline_color;
function set_outline_color(color) {
    var scene = get_active();
    var outline_subscenes = subs_array(scene, [m_subs.OUTLINE]);
    for (var i = 0; i < outline_subscenes.length; i++) {
        var subs = outline_subscenes[i];
        subs.outline_color.set(color);
        subs.need_perm_uniforms_update = true;
    }
}

/**
 * return wind vector
 */
exports.get_wind = get_wind;
function get_wind(scene) {
    return scene._render.wind;
}

exports.get_meta_tags = function(scene) {
    var tags = {
        title: "",
        description: ""
    };

    if (scene["b4w_tags"]) {
        tags.title = scene["b4w_tags"]["title"];
        tags.description = scene["b4w_tags"]["description"];
    }

    return tags;
}

exports.get_custom_prop = function(scene) {
    return scene["b4w_custom_prop"];
}

exports.update_cube_reflect_subs = function(subs, trans) {
    var vm_trans = _vec3_tmp;
    m_vec3.negate(trans, vm_trans);
    for (var i = 0; i < 6; i++) {
        var vm = subs.cube_view_matrices[i];
        var frustum = subs.cube_cam_frustums[i];
        var cam = subs.camera;
        m_mat4.translate(m_util.INV_CUBE_VIEW_MATRS[i], vm_trans, vm);
        m_mat4.multiply(cam.proj_matrix, vm, cam.view_proj_matrix);
        m_util.extract_frustum_planes(cam.view_proj_matrix, frustum);
    }
}

exports.update_plane_reflect_subs = function(subs, trans, quat) {
    var cam = subs.camera;
    m_util.trans_quat_to_plane(trans, quat, m_util.AXIS_Z,
                               cam.reflection_plane);
}

exports.assign_scene_data_subs = function(scene, objects, lamps) {

    var reflection_params = scene._render.reflection_params;
    if (reflection_params && objects)
        for (var i = 0; i < objects.length; i++) {
            var obj = objects[i];
            var sc_data = m_obj_util.get_scene_data(obj, scene);

            if (obj.render.plane_reflection_id != -1) {
                var plane_refl_subs = reflection_params.plane_refl_subs;
                var plane_refl_subs_blend = reflection_params.plane_refl_subs_blend;
                var refl_id = obj.render.plane_reflection_id;

                if (plane_refl_subs_blend.length && refl_id < plane_refl_subs_blend.length) {
                    sc_data.plane_refl_subs = plane_refl_subs_blend[refl_id];
                } else if (plane_refl_subs.length && refl_id < plane_refl_subs.length)
                    sc_data.plane_refl_subs = plane_refl_subs[refl_id];

            } else if (obj.render.cube_reflection_id != -1) {
                var cube_refl_subs = reflection_params.cube_refl_subs;
                var cube_refl_subs_blend = reflection_params.cube_refl_subs_blend;
                var refl_id = obj.render.cube_reflection_id;

                if (cube_refl_subs_blend.length)
                    sc_data.cube_refl_subs = cube_refl_subs_blend[refl_id];
                else if (cube_refl_subs.length)
                    sc_data.cube_refl_subs = cube_refl_subs[refl_id];
            }
        }

    if (lamps) {
        var use_ssao = cfg_def.ssao && scene["b4w_enable_ssao"];
        var shadow_lamps = m_obj_util.get_shadow_lamps(lamps, use_ssao);
        var shadow_params = scene._render.shadow_params;

        for (var i = 0; i < shadow_lamps.length; i++) {
            var sc_data = m_obj_util.get_scene_data(shadow_lamps[i], scene);
            if (shadow_params) {
                //TODO: assign proper subscenes for each lamp
                var shadow_subscenes = subs_array(scene, [m_subs.SHADOW_CAST]);
                for (var j = 0; j < shadow_subscenes.length; j++)
                    if (i == shadow_subscenes[j].shadow_lamp_index)
                        sc_data.shadow_subscenes.push(shadow_subscenes[j]);
            }
        }
    }
}

function get_plane_refl_id_by_subs(scene, subs) {
    var refl_subs = scene._render.reflection_params.plane_refl_subs;
    for (var i = 0; i < refl_subs.length; i++) {
        for (var j = 0; j < refl_subs[i].length; j++)
            if (refl_subs[i][j] == subs)
                return i;
    }
    var refl_subs_blend = scene._render.reflection_params.plane_refl_subs_blend;
    for (var i = 0; i < refl_subs_blend.length; i++) {
        for (var j = 0; j < refl_subs_blend[i].length; j++)
            if (refl_subs_blend[i][j] == subs)
                return i;
    }
    return null;
}

function get_cube_refl_id_by_subs(scene, subs) {

    if (!scene._render.reflection_params)
        return null;

    var refl_subs = scene._render.reflection_params.cube_refl_subs;
    for (var i = 0; i < refl_subs.length; i++) {
        if (refl_subs[i] == subs)
            return i;
    }
    var refl_subs_blend = scene._render.reflection_params.cube_refl_subs_blend;
    for (var i = 0; i < refl_subs_blend.length; i++) {
        if (refl_subs_blend[i] == subs)
            return i;
    }
    return null;
}

exports.marker_frame = function(scene, name) {
    return scene["timeline_markers"][name];
}

exports.set_hmd_params = function(hmd_params) {
    var active_scene = get_active();
    var subs_stereo = get_subs(active_scene, m_subs.STEREO);

    if (!subs_stereo)
        return;

    if (hmd_params.distortion_coefs) {
        subs_stereo.distortion_params[0] = hmd_params.distortion_coefs[0];
        subs_stereo.distortion_params[1] = hmd_params.distortion_coefs[1];
        subs_stereo.need_perm_uniforms_update = true;
    }

    if (hmd_params.chromatic_aberration_coefs) {
        subs_stereo.chromatic_aberration_coefs[0] = hmd_params.chromatic_aberration_coefs[0];
        subs_stereo.chromatic_aberration_coefs[1] = hmd_params.chromatic_aberration_coefs[1];
        subs_stereo.chromatic_aberration_coefs[2] = hmd_params.chromatic_aberration_coefs[2];
        subs_stereo.chromatic_aberration_coefs[3] = hmd_params.chromatic_aberration_coefs[3];
        subs_stereo.need_perm_uniforms_update = true;
    }

    if (hmd_params.base_line_factor) {
        subs_stereo.distortion_params[2] = hmd_params.base_line_factor;
        subs_stereo.need_perm_uniforms_update = true;
    }
    if (hmd_params.inter_lens_factor) {
        subs_stereo.distortion_params[3] = hmd_params.inter_lens_factor;
        subs_stereo.need_perm_uniforms_update = true;
    }

    if (hmd_params.enable_hmd_stereo != null) {
        subs_stereo.enable_hmd_stereo = hmd_params.enable_hmd_stereo;
        subs_stereo.need_perm_uniforms_update = true;
    }
}

exports.multiply_size_mult = function(multiplier_x, multiplier_y) {
    var scenes = get_all_scenes();

    for (var i = 0; i < scenes.length; i++) {
        var scene = scenes[i];
        var graph = exports.get_graph(scene);

        m_scgraph.multiply_size_mult_by_graph(graph, multiplier_x, multiplier_y);
    }
}

exports.update_all_mesh_shaders = function(scene) {
    var lamps = m_obj.get_scene_objs(scene, "LAMP", m_obj.DATA_ID_ALL);
    var subs_arr = subs_array(scene, OBJECT_SUBSCENE_TYPES);

    for (var i = 0; i < subs_arr.length; i++) {
        var subs = subs_arr[i];
        var draw_data = subs.draw_data;
        for (var j = 0; j < draw_data.length; j++) {
            var bundles = draw_data[j].bundles;
            for (var k = 0; k < bundles.length; k++) {
                var bundle = bundles[k];
                var batch = bundle.batch;
                if (batch.type != "MAIN")
                    continue;
                m_batch.update_batch_lights(batch, lamps, scene);
                m_batch.update_shader(batch);
                m_subs.append_draw_data(subs, bundle);
            }
        }
    }
}

exports.recalculate_draw_data = function(batch) {
    // called only after batch.shader was recompiled
    for (var i = 0; i < _scenes.length; i++) {
        var graph = _scenes[i]._render.graph;
        m_graph.traverse(graph, function(node, attr) {
            var subs = attr;
            var draw_data = subs.draw_data;
            for (var j = 0; j < draw_data.length; j++) {
                var bundles = draw_data[j].bundles;
                for (var k = 0; k < bundles.length; k++) {
                    var bundle = bundles[k];
                    if (bundle.batch == batch)
                        m_subs.append_draw_data(subs, bundle);
                }
            }
        });
    }
}

}

var int_scenes_factory = register("__scenes", Int_scenes);

export default int_scenes_factory;
