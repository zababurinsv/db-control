"use strict"

import b4w from "blend4web";

// import modules used by the app
var m_app       = b4w.app;
var m_cfg       = b4w.config;
var m_data      = b4w.data;
var m_preloader = b4w.preloader;
var m_ver       = b4w.version;
var m_anim      = b4w.animation;
var m_cont      = b4w.container;
var m_mouse     = b4w.mouse;
var m_scenes    = b4w.scenes;

var _previous_selected_obj = null;

// detect application mode
var DEBUG = (m_ver.type() == "DEBUG");

// automatically detect assets path
var APP_ASSETS_PATH = m_cfg.get_assets_path();

/**
 * export the method to initialize the app (called at the bottom of this file)
 */
function init() {
    m_app.init({
        canvas_container_id: "main_canvas_container",
        callback: init_cb,
        show_fps: DEBUG,
        console_verbose: DEBUG,
        autoresize: true
    });
}

/**
 * callback executed when the app is initialized 
 */
function init_cb(canvas_elem, success) {

    if (!success) {
        console.log("b4w init failure");
        return;
    }

    m_preloader.create_preloader();

    // ignore right-click on the canvas element
    canvas_elem.oncontextmenu = function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };

    load();
}

/**
 * load the scene data
 */
function load() {
    m_data.load(APP_ASSETS_PATH + "my_project.json", load_cb, preloader_cb);
}

/**
 * update the app's preloader
 */
function preloader_cb(percentage) {
    m_preloader.update_preloader(percentage);
}

/**
 * callback executed when the scene data is loaded
 */
function load_cb(data_id, success) {

    if (!success) {
        console.log("b4w load failure");
        return;
    }

    m_app.enable_camera_controls();

    // place your code here
    var canvas_elem = m_cont.get_canvas();
    canvas_elem.addEventListener("mousedown", main_canvas_click, false);
    canvas_elem.addEventListener("touchstart", main_canvas_click, false);
}

function main_canvas_click(e) {
    if (e.preventDefault)
        e.preventDefault();

    var x = m_mouse.get_coords_x(e);
    var y = m_mouse.get_coords_y(e);

    var obj = m_scenes.pick_object(x, y);

    if (obj) {
        if (_previous_selected_obj) {
            m_anim.stop(_previous_selected_obj);
            m_anim.set_frame(_previous_selected_obj, 0);
        }
        _previous_selected_obj = obj;

        m_anim.apply_def(obj);
        m_anim.play(obj);
    }
}

init();
