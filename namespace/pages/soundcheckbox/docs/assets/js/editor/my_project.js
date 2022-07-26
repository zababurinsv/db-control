"use strict"
var _CSRF;
var _CSRFToken;
var _currentUser_id;
var _load_rider = false;
// register the application module
b4w.register("my_project_main", function (exports, require) {

    // import modules used by the app
    var m_app = require("app");
    var m_cfg = require("config");
    var m_data = require("data");
    var m_preloader = require("preloader");
    var m_ver = require("version");
    var m_cam = require("camera");
    var m_cont = require("container");
    var m_ctl = require("controls");
    var m_mouse = require("mouse");
    var m_math = require("math");
    var m_obj = require("objects");
    var m_phy = require("physics");
    var m_scenes = require("scenes");
    var m_trans = require("transform");
    var m_quat = require("quat");
    var m_anchors = require("anchors");


    // detect application mode
    var DEBUG = (m_ver.type() == "DEBUG");

    var OUTLINE_COLOR_VALID = [0, 1, 0];
    var OUTLINE_COLOR_ERROR = [1, 0, 0];
    var FLOOR_PLANE_NORMAL = [0, 0, 1];

    var ROT_ANGLE = Math.PI / 4;

    var WALL_X_MAX = 5;
    var WALL_X_MIN = -5;
    var WALL_Y_MAX = 10;
    var WALL_Y_MIN = -10;

    // automatically detect assets path
    var APP_ASSETS_PATH = m_cfg.get_assets_path("my_project");


    var _obj_delta_xy = new Float32Array(2);
    var spawner_pos = new Float32Array(3);
    var _vec3_tmp = new Float32Array(3);
    var _vec3_tmp2 = new Float32Array(3);
    var _vec3_tmp3 = new Float32Array(3);
    var _vec4_tmp = new Float32Array(4);
    var _pline_tmp = m_math.create_pline();

    var _drag_mode = false;
    var _enable_camera_controls = true;

    var _rider_id = 0;

    var _rider_name = "";

    var _selected_obj = null;
    var _obj_params = [];
    var _uploading = false;
    var _count = 0;
    var _preset = null;
    var _last_index = 0;
    var _restore_preset_count = 0;
    var _load_timer = new Date() - 7000;
    var _show_input = false;
    var _show_output = false;
    var _show_grid = false;
    var _show_anchors = false;
    var _show_title = false;
    var _show_comment = false;
    var _restore_stage = false;
    var _restore_stage_index = -1;
    var _input_list_state = "button";
    var _output_list_state = "button";
    var _gear_list_state = "button";
    var _locked_input_channels = [];
    var _locked_output_channels = [];
    var _stage_input_list = [];
    var _rider_text = "";
    var _stage_title = "";
    var _stage_comment = "";
    var _stage_length = 20;
    var _stage_output_list = [];
    var _stage_gear_list = [];
    var _gear_categories = [];
    var _presets = [];
    var _presets_categories = [];
    var _presets_tags = [];
    var _presets_selected_category = -1;
    /**
     * export the method to initialize the app (called at the bottom of this file)
     */
    exports.init = function () {
        var show_fps = DEBUG;

        var url_params = m_app.get_url_params();

        if (url_params && "show_fps" in url_params)
            show_fps = true;
        m_app.init({
            canvas_container_id: "main_canvas_container",
            callback: init_cb,
            physics_enabled: true,
            show_fps: show_fps,
            alpha: false,
            assets_dds_available: false,
            assets_min50_available: !DEBUG,
            console_verbose: DEBUG,
            background_color: [1.0, 1.0, 1.0, 0.0]
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

        canvas_elem.addEventListener("mousedown", main_canvas_down);
        canvas_elem.addEventListener("touchstart", main_canvas_down);

        canvas_elem.addEventListener("mouseup", main_canvas_up);
        canvas_elem.addEventListener("touchend", main_canvas_up);

        canvas_elem.addEventListener("mousemove", main_canvas_move);
        canvas_elem.addEventListener("touchmove", main_canvas_move);

        window.onresize = m_cont.resize_to_container;
        m_cont.resize_to_container();
        var cont = document.getElementById("properties-form-container");
        hide_show_element(cont);
        var cont = document.getElementById("stage-form-container");
        hide_show_element(cont);
        cont = document.getElementById("list-edit-container");
        hide_show_element(cont);
        cont = document.getElementById("gear-list-edit-container");
        hide_show_element(cont);
        cont = document.getElementById("restore-form-container");
        hide_show_element(cont);
        cont = document.getElementById("addobject-form-container");
        hide_show_element(cont);
        cont = document.getElementById("savepreset-form-container");
        hide_show_element(cont);
        cont = document.getElementById("waiticon");
        hide_show_element(cont);
        load();
    }

    /**
     * load the scene data
     */
    function load() {
        try {
            var file = "../nr.json";
            var request = new XMLHttpRequest();
            request.open("GET", file, false);
            request.send(null);
            var nr = JSON.parse(request.responseText);
            if (nr.enable == true)
                m_data.load(APP_ASSETS_PATH + nr.model_src, load_cb, preloader_cb);
            else
                m_data.load(APP_ASSETS_PATH + "my_project.json", load_cb, preloader_cb);
        }
        catch (e) {
            console.log("ОШИБКА функции load");
            console.log(e);
        }
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
        try {
            m_app.enable_camera_controls(false, true, false, m_cont.get_canvas());
            init_controls();

            var spawner = m_scenes.get_object_by_name("spawner");
            m_trans.get_translation(spawner, spawner_pos);

            var file = "../stage.json";

            if (_load_rider) {
                file = "../rider.php?id=" + _load_rider;
            }

            restore_stage(file);

            if (_show_grid) {
                show_grid();
            }
            else {
                hide_grid();
            }

        }
        catch (e) {
            console.log("ОШИБКА функции init_controls");
            console.log(e);
        }
    }

    function init_controls() {
        try {
            //var controls_elem = document.getElementById("controls-container");
            //controls_elem.style.display = "block";


            var div_control = document.getElementById("controls-container");

            var hendler = function (e) { var form_container = document.getElementById("properties-form-container"); hide_show_element(form_container); };
            add_functional_button(div_control, "properties_button", "Properties of object", "obj_properties.png", hendler);

            add_menu_separator(div_control);
            if (_currentUser_id && _currentUser_id == 1) {
                hendler = function (e) { var form_container = document.getElementById("addobject-form-container"); hide_show_element(form_container); };
                add_functional_button(div_control, "addobject_button", "Upload 3d object", "add_preset.png", hendler);
            }

            hendler = function (e) { if (_selected_obj) { delete_object(); } };
            add_functional_button(div_control, "delete", "Delete selected object", "delete.png", hendler);

            hendler = function (e) { if (_selected_obj) { delete_object_ierarhy(); } };
            add_functional_button(div_control, "deletechild", "Delete object will all children", "delete-ierarhy.png", hendler);

            hendler = function (e) { rotate_button_push(1); };
            add_functional_button(div_control, "rot-ccw", "Rotate left", "turn-left.png", hendler);

            hendler = function (e) { rotate_button_push(-1); };
            add_functional_button(div_control, "rot-cw", "Rotate right", "turn-right.png", hendler);

            add_menu_separator(div_control);

            hendler = function (e) { var name = prompt("Please, Name of rider", _rider_name); if (name) save_rider(name); };
            add_functional_button(div_control, "rider_save_button", "Save Rider to database", "save-rider.png", hendler);

            hendler = function (e) { var restore_container = document.getElementById("restore-form-container"); hide_show_element(restore_container); };
            add_functional_button(div_control, "rider_restore_button", "Restore rider from database", "restore-stage.png", hendler);

            //hendler = function (e) { var file = prompt("Please, enter file name to save", 'save.json'); if (file) save_stage(file); };
            //add_functional_button(div_control, "stage_save_button", "Save stage to file", "save-stage.png", hendler);

            /*hendler = function (e) {
                var now = new Date(); if (now - _load_timer < 10000) alert("Victor, you need to sleep, your fingers do not listen you. Try after 10 seconds or leave that button in peace");
                else { _load_timer = new Date(); var file = prompt("Please, enter file name to restore stage. \n CAUTION: to complete this operation all current objects on stage will be deleted. If yon wanna save them cancel this operation and save stage or presets before.", 'save.json'); if (file) restore_stage("../save/" + file); }
            };
            add_functional_button(div_control, "stage_restore_button", "Restore stage from file", "restore-stage.png", hendler);
            */
            hendler = function (e) {
                if (!_selected_obj) alert("Please, select main object to save preset"); else {
                    var div = document.getElementById("savepreset-form-container");
                    hide_show_element(div); } };
            add_functional_button(div_control, "preset_save_button", "Save preset", "save-preset.png", hendler);

            add_menu_separator(div_control);

            add_functional_button(div_control, "show_anchors_button", "Show/hide annotations", "showannot.png", change_anchors);

            add_functional_button(div_control, "show_grid_button", "Show/hide coordinate grid", "showgrid.png", change_grid);

            add_menu_separator(div_control);

            hendler = function (e) { var form_container = document.getElementById("stage-form-container"); hide_show_element(form_container); };
            add_functional_button(div_control, "stage_button", "Properties of stage", "stage_properties.png", hendler);

            add_functional_button(div_control, "print_button", "Print of rider", "print.png", print_rider);

            add_menu_separator(div_control);

            hendler = function (e) { document.location = '/riders.php'; };
            add_functional_button(div_control, "exit_button", "Exit to My Riders", "close-button.png", hendler);



            document.getElementById("savepreset").addEventListener("click", save_preset);
            document.getElementById("addobject").addEventListener("click", add_object);
            document.getElementById("restorerider").addEventListener("click", restore_rider);
            document.getElementById("deleterider").addEventListener("click", delete_rider);
            document.getElementById("saveprop").addEventListener("click", save_prop);
            document.getElementById("savestage").addEventListener("click", save_stage_prop);
            document.getElementById("savelistrow").addEventListener("click", save_list_row);
            document.getElementById("deletelistrow").addEventListener("click", delete_list_row);
            document.getElementById("savegearlistrow").addEventListener("click", save_gear_list_row);
            document.getElementById("deletegearlistrow").addEventListener("click", delete_gear_list_row);
            document.getElementById("addinput").addEventListener("click", add_input);
            document.getElementById("addoutput").addEventListener("click", add_output);
            document.getElementById("addgear").addEventListener("click", add_gear);
            document.getElementById("toggle_controls").addEventListener("click", function (e) {
                var cont = document.getElementById("controls-container");
                hide_show_element(cont);
            });
            document.getElementById("addstageinput").addEventListener("click", function (e) {
                main_canvas_down(e);
                main_canvas_up(e);
                add_input(e);
            });
            document.getElementById("addstageoutput").addEventListener("click", function (e) {
                main_canvas_down(e);
                main_canvas_up(e);
                add_output(e);
            });
            document.getElementById("addstagegear").addEventListener("click", function (e) {
                main_canvas_down(e);
                main_canvas_up(e);
                add_gear(e);
            });
            document.getElementById("input-list-header").addEventListener("click", function (a) {
                show_list("input")
            });
            document.getElementById("output-list-header").addEventListener("click", function (a) {
                show_list("output")
            });
            document.getElementById("gear-list-header").addEventListener("click", function (a) {
                show_list("gear")
            });


            restore_rider_select();
            restore_objects_select();
            savepreset_as_select_update();
            preset_categories_select_update();
            preset_tags_select_update();

            /*var request = new XMLHttpRequest();
            request.open("GET", "../buttons.json", false);
            request.send(null);
            var buttons = JSON.parse(request.responseText);*/

            var div = document.getElementById("button-container");
            var div_cat = document.getElementById("tabs-container");
            var div_tag = document.getElementById("tags-container");

            //console.log(buttons.buttons_layer_id);
            //console.log(div);

            for (var j = 0; j < _presets_categories.length; j++) {
                if (_presets_categories[j].presets.length > 0) {
                    var div_but = document.createElement('div');
                    div_but.className = "category_button";
                    div_but.id = "menu_category_" + _presets_categories[j].name;
                    div_but.addEventListener("click", function (e) {
                        menu_category_click(this);
                    });
                    div_but.innerHTML = "" + _presets_categories[j].name; //"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                    div_cat.appendChild(div_but);
                    /*var sheet = document.createElement('style');
                    sheet.innerHTML = ".category_button#" + div_but.id + " { background-image: url('" + buttons.categories[j].image + "');}";
                    document.body.appendChild(sheet);*/
                }
            }
            for (var i = 0; i < _presets.length; i++) {
                var preset = _presets[i];
                var but = document.createElement('div');
                but.className = "button data-button hidden";
                but.title = preset.name;
                div.appendChild(but);
                but.id = "preset_button_" + preset.id;//button.preset.split('.')[0];
                but.data = preset.id;
                but.addEventListener("click", function (e) {
                    if (!_uploading) {
                        cursor_to_wait();
                        main_canvas_down(e);
                        main_canvas_up(e);
                        //console.log('Click:');
                        console.log('Load preset:' + this.data);
                        load_from_preset(this.data);
                    }
                    else {
                        alert('Please, wait, previous load still did not finish');
                    }
                });
                var img = document.createElement('img');
                img.src = preset.image;
                img.alt = preset.name;
                //img.width = img.height = "75";
                //console.log(div);
                //console.log(div.style.height);
                //console.log(div.height);
                but.appendChild(img);
                /*var sheet = document.createElement('style');
                sheet.innerHTML = ".data-button#" + but.id + " { background-image: url('" + preset.image + "');}";
                document.body.appendChild(sheet);*/
            }
            for (var j = 0; j < _presets_tags.length; j++) {
                var div_but = document.createElement('span');
                if (_presets_tags[j].name == "all")
                    div_but.className = "hidden active";
                else
                    div_but.className = "hidden";
                div_but.id = "preset_tag_" + _presets_tags[j].name;
                div_but.addEventListener("click", function (e) {
                    menu_tag_click(this);
                });
                div_but.innerHTML = "" + _presets_tags[j].name;
                div_tag.appendChild(div_but);
            }

            document.getElementById("addobject_form").elements.namedItem("object").addEventListener("change", addobject_form_object_change);

            document.getElementById("savepreset_form").elements.namedItem("id").addEventListener("change", savepreset_form_id_change);



            var elements = document.getElementsByClassName("close-button");

            for (var i = 0; i < elements.length; i++) {
                elements[i].addEventListener("click", function (e) {
                    hide_show_element(this.parentNode);
                    //this.parentNode.style.display = 'none';
                });
            }


            window.onunload = function () {
                return confirm('Are you sure want to leave? Rider has not been saved')
            }
            window.onbeforeunload = function () {
                return confirm('Are you sure want to leave? Rider has not been saved');
            }

        }
        catch (e) {
            console.log("ОШИБКА функции init_controls");
            console.log(e);
        }
    }

    function addobject_form_object_change(e) {
        try {
            var obj = document.getElementById("addobject_form").elements.namedItem("object");
            var name = obj.options[obj.selectedIndex].text;
            var rows = [];
            rows[0] = document.getElementById("jsonfile");
            rows[1] = document.getElementById("binfile");
            rows[2] = document.getElementById("imagefile");
            if (name == "Upload New Object") {
                for (var i = 0; i < 3; i++) {
                    if (rows[i].classList.contains("hidden")) rows[i].classList.remove("hidden");
                }
            }
            else {
                for (var i = 0; i < 3; i++) {
                    if (!rows[i].classList.contains("hidden")) rows[i].classList.add("hidden");
                }
            }
        }
        catch (e) {
            console.log("ОШИБКА функции addobject_form_object_change");
            console.log(e);
        }
    }

    function savepreset_form_id_change(e) {
        try {
            var form = document.getElementById("savepreset_form");
            var id_select = form.elements.namedItem("id");
            var id = parseInt(id_select.options[id_select.selectedIndex].value);
            var cat_sel = form.elements.namedItem("categories[]");
            var tag_sel = form.elements.namedItem("tags[]");
            var name = form.elements.namedItem("name");
            var img = document.getElementById("savepreset_img");
            if (id == 0) {
                for (var i = 0; i < cat_sel.options.length; i++) {
                    if (cat_sel.options[i].selected) cat_sel.options[i].selected = false;
                }
                cat_sel.options[cat_sel.options.length - 1].selected = true;
                for (var i = 0; i < tag_sel.options.length; i++) {
                    if (tag_sel.options[i].selected) tag_sel.options[i].selected = false;
                }
                img.src = '';
            }
            else {
                var prst = null;
                for (var i = 0; i < _presets.length; i++) {
                    if (_presets[i].id == id) {
                        prst = _presets[i];
                        break;
                    }
                }
                //console.log(_presets);
                var ctgs = prst.categories.split(",");
                var tgs = prst.tags.split(",");
                for (var i = 0; i < cat_sel.options.length; i++) {
                    if (ctgs.includes(cat_sel.options[i].text)) cat_sel.options[i].selected = true;
                    else cat_sel.options[i].selected = false;
                }
                for (var i = 0; i < tag_sel.options.length; i++) {
                    if (tgs.includes(tag_sel.options[i].text)) tag_sel.options[i].selected = true;
                    else tag_sel.options[i].selected = false;
                }
                img.src = prst.image;
                name.value = prst.name;
            }
        }
        catch (e) {
            console.log("ОШИБКА функции savepreset_form_id_change");
            console.log(e);
        }
    }

    //
    function add_menu_separator(div_control) {
        try {
            var but = document.createElement('div');
            but.className = "button data-button-controls bolt";
            div_control.appendChild(but);
        }
        catch (e) {
            console.log("ОШИБКА функции add_menu_separator");
            console.log(e);
        }
    }

    function add_functional_button(div_control, id, title, image, EventListener) {
        try {
            var but = document.createElement('div');
            but.title = title;
            but.className = "button data-button-controls";
            div_control.appendChild(but);
            but.id = id;
            but.addEventListener("click", EventListener);
            var span = document.createElement('span');
            span.classList.add("mobile-title");
            span.innerHTML = but.title;
            but.appendChild(span);
            var sheet = document.createElement('style');
            sheet.innerHTML = ".data-button-controls#" + but.id + ":before { background-image: url('../interface/" + image + "');}";
            document.body.appendChild(sheet);
        }
        catch (e) {
            console.log("ОШИБКА функции add_functional_button");
            console.log(e);
        }
    }

    function show_list(name) {
        try {
            var cont = document.getElementById(name + "-list-container"),
                header = document.getElementById(name + "-list-header");
            if (cont.classList.contains("hidden")) {
                hide_all_lists();
                cont.classList.remove("hidden");
                header.classList.add("active")
            } else cont.classList.add("hidden"), header.classList.remove("active")
        }
        catch (e) {
            console.log("ОШИБКА функции show_list");
            console.log(e);
        }
    }
    function hide_all_lists() {
        try {
            var lists = ["input", "output", "gear"];
            for (var i = 0; i < lists.length; i++) {
                var cont = document.getElementById(lists[i] + "-list-container");
                cont.classList.contains("hidden") || (cont.classList.add("hidden"), document.getElementById(lists[i] + "-list-header").classList.remove("active"))
            }
        }
        catch (e) {
            console.log("ОШИБКА функции hide_all_lists");
            console.log(e);
        }
    }
    function print_rider(e) {
        try {

            /*var prtContent = document.getElementById("main_canvas_container");
            var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=600,toolbar=0,scrollbars=0,status=0');
            console.log(prtContent.innerHTML);
            WinPrint.document.write(prtContent.innerHTML);
            WinPrint.document.close();
            WinPrint.focus();
            WinPrint.print();
            WinPrint.close();*/
            var div_ids = "main_canvas_container head controls-container properties-container stage-container list-edit-container gear-list-edit-container output-list-container input-list-container gear-list-container".split(" ");
            var div_ids2 = "gear-list-container output-list-container input-list-container rider-text".split(" ");
            for (var i = 0; i < div_ids.length; i++) {
                var id = div_ids[i];
                var div = document.getElementById(id);
                if (div) {
                    div.classList.add("print");
                    if (div_ids2.includes(div.id) && div.classList.contains("hidden")) {
                        div.classList.remove("hidden");
                    }
                }
                else {
                    console.log(id);
                }
            }
            var elements = document.getElementsByClassName("close-button");
            for (var i = 0; i < elements.length; i++) {
                elements[i].classList.add("hidden");
            }
            var main = document.getElementById("main_canvas_container");
            //console.log(main.offsetTop);
            if (_show_anchors) {
                for (var i = 0; i < _obj_params.length; i++) {
                    var anchor_elem = document.getElementById("anchor" + _obj_params[i].id);
                    anchor_elem.style.top = (parseFloat(anchor_elem.style.top) + main.offsetTop) + 'px';
                }
            }
            document.getElementById("rider-text").innerHTML = _rider_text;
            window.print();
            document.getElementById("rider-text").innerHTML = "";
            if (_show_anchors) {
                for (var i = 0; i < _obj_params.length; i++) {
                    var anchor_elem = document.getElementById("anchor" + _obj_params[i].id);
                    anchor_elem.style.top = (parseFloat(anchor_elem.style.top) - main.offsetTop) + 'px';
                }
            }
            for (var i = 0; i < div_ids.length; i++) {
                var id = div_ids[i];
                var div = document.getElementById(id);
                if (div) {
                    var div = document.getElementById(id);
                    div.classList.remove("print");
                    if (div_ids2.includes(div.id) && !div.classList.contains("hidden")) {
                        div.classList.add("hidden");
                    }
                }
                else {
                    console.log(id);
                }
            }
            var elements = document.getElementsByClassName("close-button");
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].classList.contains("hidden")) {
                    elements[i].classList.remove("hidden");
                }
            }
            var cont = document.getElementById("gear-list-table-container");
            hide_show_element(cont);
        }
        catch (e) {
            console.log("ОШИБКА функции print_rider");
            console.log(e);
        }
    }

    function menu_tag_click(span) {
        try {
            var name = span.id.split("_")[2];
            var tag;
            //console.log(name);
            if (_presets_selected_category < 0) return;
            //console.log(_presets_selected_category);
            var category = _presets_categories[_presets_selected_category];
            var preset_tag;
            //console.log(_presets_tags);
            for (var i = 0; i < _presets_tags.length; i++) {
                if (_presets_tags[i].name == name) {
                    preset_tag = _presets_tags[i];
                    break;
                }
            }

            //console.log(preset_tag);
            //console.log(category.selected_tags);
            //console.log(category.presets);

            if (name == "all") {
                if (category.selected_tags[0].name != "all") {
                    for (var i = 0; i < category.presets.length; i++) {
                        button = document.getElementById("preset_button_" + category.presets[i].id);
                        if (button.classList.contains("hidden")) {
                            button.classList.remove("hidden");
                        }
                    }
                    category.selected_tags = [preset_tag];
                    for (var i = 0; i < category.tags.length; i++) {
                        tag = document.getElementById("preset_tag_" + category.tags[i]);
                        if (tag.classList.contains("active")) {
                            tag.classList.remove("active");
                        }
                    }
                    tag = document.getElementById("preset_tag_all");
                    if (!tag.classList.contains("active")) tag.classList.add("active");
                }
            }
            else if (category.selected_tags[0].name == "all") {
                category.selected_tags = [];
                tag = document.getElementById("preset_tag_all");
                if (tag.classList.contains("active")) tag.classList.remove("active");
                category.selected_tags = [preset_tag];
                span.classList.add("active");
                for (var i = 0; i < category.presets.length; i++) {
                    button = document.getElementById("preset_button_" + category.presets[i].id);
                    if (category.presets[i].tags.split(",").includes(name)) {
                        if (button.classList.contains("hidden")) {
                            button.classList.remove("hidden");
                        }
                    }
                    else {
                        if (!button.classList.contains("hidden")) {
                            button.classList.add("hidden");
                        }
                    }
                }
            }
            else if (!span.classList.contains("active")) {
                category.selected_tags.push(preset_tag);
                span.classList.add("active");
                for (var i = 0; i < category.presets.length; i++) {
                    button = document.getElementById("preset_button_" + category.presets[i].id);
                    if (preset_match_to_tags(category.presets[i].tags, category.selected_tags)) {
                        if (button.classList.contains("hidden")) {
                            button.classList.remove("hidden");
                        }
                    }
                    else {
                        if (!button.classList.contains("hidden")) {
                            button.classList.add("hidden");
                        }
                    }
                }
            }
            else {
                var ind = category.selected_tags.indexOf(preset_tag);
                if (ind >= 0)
                    category.selected_tags.splice(ind,1);
                span.classList.remove("active");
                if (category.selected_tags.length == 0) {
                    category.selected_tags = [_presets_tags[0]];
                    tag = document.getElementById("preset_tag_all");
                    if (!tag.classList.contains("active")) tag.classList.add("active");
                }
                for (var i = 0; i < category.presets.length; i++) {
                    button = document.getElementById("preset_button_" + category.presets[i].id);
                    if (preset_match_to_tags(category.presets[i].tags, category.selected_tags)) {
                        if (button.classList.contains("hidden")) {
                            button.classList.remove("hidden");
                        }
                    }
                    else {
                        if (!button.classList.contains("hidden")) {
                            button.classList.add("hidden");
                        }
                    }
                }
            }
            //console.log(category.selected_tags);
            //console.log(category.presets);
        }
        catch (e) {
            console.log("ОШИБКА функции menu_tag_click");
            console.log(e);
        }
    }
    function preset_match_to_tags(tags, selected) {
        var classes = [[selected[0]]];
        var added, match, match2;
        for (var i = 0; i < selected.length; i++) {
            added = false;
            for (var j = 0; j < classes.length; j++) {
                if (classes[j][0].class == selected[i].class) {
                    added = true;
                    classes[j].push(selected[i]);
                }
            }
            if (!added) {
                classes.push([selected[i]]);
            }
        }
        match = true;
        for (var j = 0; j < classes.length; j++) {
            match2 = false;
            for (var i = 0; i < classes[j].length; i++) {
                match2 = match2 || tags.split(",").includes(classes[j][i].name);
            }
            match = match && match2;
        }
        return match;
    }
    function menu_category_click(div) {
        try {
            var button, tag;
            if (!div.classList.contains("category_active")) {
                var element = document.getElementById("menu-container");
                if (element.classList.contains("hidden"))
                    element.classList.remove("hidden");
                var elements = document.getElementsByClassName("category_button");
                var prev_name = "";
                for (var i = 0; i < elements.length; i++) {
                    if (elements[i].classList.contains("category_active")) {
                        prev_name = elements[i].id.split("_")[2];
                        elements[i].classList.remove("category_active");
                    }
                }
                div.classList.add("category_active");
                var name = div.id.split("_")[2];
                var index = -1;
                var prev_index = -1;
                for (var i = 0; i < _presets_categories.length; i++) {
                    if (_presets_categories[i].name == name) {
                        index = i;
                        _presets_selected_category = i;
                    }
                    if (_presets_categories[i].name == prev_name) {
                        prev_index = i;
                    }
                }
                //console.log(name);
                //console.log(prev_index);
                //console.log(index);
                if (prev_index >= 0) {
                    for (var i = 0; i < _presets.length; i++) {
                        button = document.getElementById("preset_button_" + _presets[i].id);
                        if (!button.classList.contains("hidden")) {
                            button.classList.add("hidden");
                        }
                    }
                    for (var i = 1; i < _presets_tags.length; i++) {
                        tag = document.getElementById("preset_tag_" + _presets_tags[i].name);
                        if (!tag.classList.contains("hidden")) {
                            tag.classList.add("hidden");
                        }
                    }
                }
                if (index >= 0) {
                    for (var i = 0; i < _presets_categories[index].presets.length; i++) {
                        button = document.getElementById("preset_button_" + _presets_categories[index].presets[i].id);
                        if (button.classList.contains("hidden")) {
                            button.classList.remove("hidden");
                        }
                    }
                    _presets_categories[index].selected_tags = [_presets_tags[0]];
                    for (var i = 0; i < _presets_categories[index].tags.length; i++) {
                        tag = document.getElementById("preset_tag_" + _presets_categories[index].tags[i]);
                        if (tag.classList.contains("hidden")) {
                            tag.classList.remove("hidden");
                        }
                        if (tag.classList.contains("active")) {
                            tag.classList.remove("active");
                        }
                    }
                    tag = document.getElementById("preset_tag_all");
                    if (!tag.classList.contains("active")) tag.classList.add("active");
                }
                console.log(_presets_categories[index]);
            }
            else {
                /*var element = document.getElementById(div.id + "_layer");
                hide_show_element(element);*/
                var element = document.getElementById("menu-container");
                hide_show_element(element);
                div.classList.remove("category_active");
                _presets_selected_category = -1;
            }
        }
        catch (e) {
            console.log("ОШИБКА функции menu_category_click");
            console.log(e);
        }
    }
    function clear_input_channels() {
        try {
            for (var i = 0; i < _obj_params.length; i++) {
                for (var j = 0; j < _obj_params[i].input_list.length; j++) {
                    if (!_obj_params[i].input_list[j].Locked) {
                        _obj_params[i].input_list[j].Channel = null;
                    }
                }
                for (var j = 0; j < _obj_params[i].output_list.length; j++) {
                    if (!_obj_params[i].output_list[j].Locked) {
                        _obj_params[i].output_list[j].Channel = null;
                    }
                }
            }
            for (var i = 0; i < _stage_input_list.length; i++) {
                if (!_stage_input_list[i].Locked) {
                    _stage_input_list[i].Channel = null;
                }
            }
            for (var i = 0; i < _stage_output_list.length; i++) {
                if (!_stage_output_list[i].Locked) {
                    _stage_output_list[i].Channel = null;
                }
            }
        }
        catch (e) {
            console.log("ОШИБКА функции clear_input_channels");
            console.log(e);
        }
    }
    function delete_object_ierarhy() {
        try {
            var id = m_scenes.get_object_data_id(_selected_obj);
            for (var i = _obj_params.length - 1; i >= 0; i--) {
                if (_obj_params[i].selected) {
                    //console.log('DELETING id:' + _obj_params[i].id + ' index:' + i);
                    m_data.unload(_obj_params[i].id);
                    var anch = document.getElementById("anchor" + _obj_params[i].id);
                    anch.parentNode.removeChild(anch);
                    _obj_params.splice(i, 1);
                }
            }
            clear_input_channels();
            _selected_obj = null;
            update_input_list();
            update_output_list();
            update_gear_list();
        }
        catch (e) {
            console.log("ОШИБКА функции delete_object_ierarhy");
            console.log(e);
        }
    }
    function delete_object() {
        try {
            var id = m_scenes.get_object_data_id(_selected_obj);
            delete_object_by_id(id);
        }
        catch (e) {
            console.log("ОШИБКА функции delete_object");
            console.log(e);
        }
    }
    function delete_object_by_id(id) {
        try {
            var index = param_index_by_id(id);
            //console.log('DELETING id:' + _obj_params[index].id + ' index:' + index);
            var children = _obj_params[index].children;
            m_data.unload(id);
            var anch = document.getElementById("anchor" + id);
            anch.parentNode.removeChild(anch);
            _obj_params.splice(index, 1);
            if (children && children.length > 0) {
                for (var i = 0; i < children.length; i++) {
                    children[i].parent = "";
                }
            }
            clear_input_channels();
            select_obj(null);
            update_input_list();
            update_output_list();
            update_gear_list();
        }
        catch (e) {
            console.log("ОШИБКА функции delete_object");
            console.log(e);
        }
    }
    function rotate_button_push(right) {
        if (_selected_obj) {
            rotate_object(_selected_obj, right * ROT_ANGLE);
            var anglegrad = parseInt(ROT_ANGLE / Math.PI * 180);
            //console.log("Поворот на ");
            //console.log(anglegrad);
            var index = param_index_by_id(_selected_obj.render.data_id);
            var pform = document.getElementById("properties_form");
            var turn = parseInt(_obj_params[index].turn) + right * anglegrad;
            if (turn > 360)
                turn -= 360;
            if (turn < 0)
                turn += 360;
            _obj_params[index].turn = turn;
            pform.elements.namedItem("turn").value = turn;
        }
    }

    _request = null;

    function save_stage(file) {
        try {

            console.log('Начинаем сохранение');
            var request = new XMLHttpRequest();
            request.open("POST", "../save.php", false);
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            _request = request;
            request.onreadystatechange = function () {
                //console.log(this.readyState);
                if (this.status == "200") {
                    alert("Сохранено! \n");
                }
                else {
                    console.log("Статус сохранения! \n" + this.status + "\n" + this.readyState + this.responseText);
                }
            };
            var stage = new Object();
            stage.name = "Stage";
            stage.model_src = "my_project.json";
            stage.X = 0;
            stage.Y = 0;
            stage.Z = 0;
            stage.turn = 0;
            stage.Title = "Stage";
            stage.Comment = "";
            stage.input_list = _stage_input_list;
            stage.output_list = _stage_output_list;
            stage.gear_list = _stage_gear_list;

            stage.Show_Grid = _show_grid;
            stage.Show_Channels = _show_anchors;
            stage.Show_CH = _show_input;
            stage.Show_MIX = _show_output;
            stage.Show_Title = _show_title;
            stage.Show_Comments = _show_comment;
            stage.gear_categories = _gear_categories;
            stage.Rider_text = _rider_text;
            stage.Title = _stage_title;
            stage.Comment = _stage_comment;
            stage.Length = _stage_length;
            stage.children = [];
            delete_objects_temporary()
            for (var i = 0; i <= _obj_params.length; i++) {
                var input_list, output_list;
                if (i == _obj_params.length) {
                    input_list = _stage_input_list;
                    output_list = _stage_output_list;
                }
                else {
                    input_list = _obj_params[i].input_list;
                    output_list = _obj_params[i].output_list;
                    if (!_obj_params[i].parent) {
                        stage.children.push(_obj_params[i]);
                    }
                }
                for (var j = 0; j < input_list.length; j++) {
                    input_list[j].Locked = true;
                }
                for (var j = 0; j < output_list.length; j++) {
                    output_list[j].Locked = true;
                }
            }
            //console.log(stage);
            var text = JSON.stringify(stage);
            var re = /"id":([0-9]+?),/g; //"Obj_id":2,"obj":null
            var newtext = text.replace(re, '');
            re = /("parent":)([0-9]+?),/g;
            text = newtext.replace(re, '');
            re = /"parent":"",/g;
            newtext = text.replace(re, '');
            re = /"obj":null,/g;
            text = newtext.replace(re, '');
            re = /"selected":true,/g;
            newtext = text.replace(re, '');
            re = /"Obj_id":([0-9]+?),/g;
            text = newtext.replace(re, '');
            re = /,"Zabs":([0-9.-]+?)}/g;
            newtext = text.replace(re, '}');
            re = /,"Yabs":([0-9.-]+?)}/g;
            text = newtext.replace(re, '}');
            re = /,"Xabs":([0-9.-]+?)}/g;
            newtext = text.replace(re, '}');
            re = /,"is_jump":false}/g;
            text = newtext.replace(re, '}');
            re = /,"obj":null}/g;
            newtext = text.replace(re, '}');
            //var re = /("id":)([0-9]+?),/g;
            //var newtext = text.replace(re, '$1null,');
            //text = "{\"name\":\"Stage\",\"model_src\":\"my_project.json\",\"X\":0,\"Y\":0,\"turn\":0,\"Title\":\"Stage\",\"Comment\":\"\",\"input_list\": [],\"output_list\":[],\"gear_list\":[],\"children\":" + newtext + "}";
            //console.log(text);
            return_objects_temporary();
            //console.log(_obj_params);
            request.send("file=" + encodeURIComponent(file) + "&stage=" + encodeURIComponent(newtext));
        }
        catch (e) {
            alert('Save error');
            console.log(e);
        }
    }

    function save_rider(name) {
        try {

            console.log('Начинаем сохранение');
            var request = new XMLHttpRequest();
            request.open("POST", "../rider.php", false);
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            /*var csrfCookie = document.cookie.match(/CSRF-TOKEN=([\w-]+)/);
            if (csrfCookie) {
                request.setRequestHeader("X-CSRF-TOKEN", csrfCookie[1]);
            }
            else {
                console.log("No X-CSRF-TOKEN");
            }*/
            _request = request;

            request.onreadystatechange = function () {
                //console.log(this.readyState);
                if (this.status == "200") {
                    alert("Rider has been saved! Push last button Exit to return into main workspace\n");
                    console.log(_request);
                    console.log(this);
                    console.log("Статус сохранения! \n" + this.status + "\n" + this.readyState + this.responseText);
                    restore_rider_select();
                }
                else {
                    console.log(_request);
                    console.log("Статус сохранения! \n" + this.status + "\n" + this.readyState + this.responseText);
                }
            };
            var stage = new Object();
            stage.name = "Stage";
            stage.model_src = "my_project.json";
            stage.X = 0;
            stage.Y = 0;
            stage.Z = 0;
            stage.turn = 0;
            stage.Title = "Stage";
            stage.Comment = "";
            stage.input_list = _stage_input_list;
            stage.output_list = _stage_output_list;
            stage.gear_list = _stage_gear_list;

            stage.Show_Grid = _show_grid;
            stage.Show_Channels = _show_anchors;
            stage.Show_CH = _show_input;
            stage.Show_MIX = _show_output;
            stage.Show_Title = _show_title;
            stage.Show_Comments = _show_comment;
            stage.gear_categories = _gear_categories;
            stage.Rider_text = _rider_text;
            stage.Title = _stage_title;
            stage.Comment = _stage_comment;
            stage.Length = _stage_length;
            stage.children = [];
            delete_objects_temporary()
            for (var i = 0; i <= _obj_params.length; i++) {
                var input_list, output_list;
                if (i == _obj_params.length) {
                    input_list = _stage_input_list;
                    output_list = _stage_output_list;
                }
                else {
                    input_list = _obj_params[i].input_list;
                    output_list = _obj_params[i].output_list;
                    if (!_obj_params[i].parent) {
                        stage.children.push(_obj_params[i]);
                    }
                }
                for (var j = 0; j < input_list.length; j++) {
                    input_list[j].Locked = true;
                }
                for (var j = 0; j < output_list.length; j++) {
                    output_list[j].Locked = true;
                }
            }
            //console.log(stage);
            var text = JSON.stringify(stage);
            var re = /"id":([0-9]+?),/g; //"Obj_id":2,"obj":null
            var newtext = text.replace(re, '');
            re = /("parent":)([0-9]+?),/g;
            text = newtext.replace(re, '');
            re = /"parent":"",/g;
            newtext = text.replace(re, '');
            re = /"obj":null,/g;
            text = newtext.replace(re, '');
            re = /"selected":true,/g;
            newtext = text.replace(re, '');
            re = /"Obj_id":([0-9]+?),/g;
            text = newtext.replace(re, '');
            re = /,"Zabs":([0-9.-]+?)}/g;
            newtext = text.replace(re, '}');
            re = /,"Yabs":([0-9.-]+?)}/g;
            text = newtext.replace(re, '}');
            re = /,"Xabs":([0-9.-]+?)}/g;
            newtext = text.replace(re, '}');
            re = /,"is_jump":false}/g;
            text = newtext.replace(re, '}');
            re = /,"obj":null}/g;
            newtext = text.replace(re, '}');
            //var re = /("id":)([0-9]+?),/g;
            //var newtext = text.replace(re, '$1null,');
            //text = "{\"name\":\"Stage\",\"model_src\":\"my_project.json\",\"X\":0,\"Y\":0,\"turn\":0,\"Title\":\"Stage\",\"Comment\":\"\",\"input_list\": [],\"output_list\":[],\"gear_list\":[],\"children\":" + newtext + "}";
            //console.log(text);
            return_objects_temporary();
            //console.log(_obj_params);
            request.send(_CSRF + "=" + _CSRFToken + "&id=" + _rider_id + "&name=" + encodeURIComponent(name) + "&stage=" + encodeURIComponent(newtext) + "&action=save");
        }
        catch (e) {
            alert('Save error');
            console.log(e);
        }
    }
    function save_preset() {
        try {
            if (_selected_obj) {
                var id = _selected_obj.render.data_id;
                var index = param_index_by_id(id);
                //console.log(stage);
                delete_objects_temporary();
                set_positions_relative(_obj_params[index]);
                var text = JSON.stringify(_obj_params[index]);
                set_positions_absolute(_obj_params[index]);
                return_objects_temporary();
                var re = /"id":([0-9]+?),/g; //"Obj_id":2,"obj":null
                var newtext = text.replace(re, '');
                re = /("parent":)([0-9]+?),/g;
                text = newtext.replace(re, '');
                re = /"parent":"",/g;
                newtext = text.replace(re, '');
                re = /"obj":null,/g;
                text = newtext.replace(re, '');
                re = /"selected":true,/g;
                newtext = text.replace(re, '');
                re = /,"Obj_id":([0-9]+?)}/g;
                text = newtext.replace(re, '}');
                re = /,"Zabs":([0-9.-]+?)}/g;
                newtext = text.replace(re, '}');
                re = /,"Yabs":([0-9.-]+?)}/g;
                text = newtext.replace(re, '}');
                re = /,"Xabs":([0-9.-]+?)}/g;
                newtext = text.replace(re, '}');
                re = /,"is_jump":false}/g;
                text = newtext.replace(re, '}');
                re = /,"obj":null}/g;
                newtext = text.replace(re, '}');

                cursor_to_wait();

                var aform = document.getElementById("savepreset_form");
                var FD = new FormData(aform);
                FD.append("action", "save");
                FD.append(_CSRF, _CSRFToken);
                FD.append("preset", newtext);

                console.log('Начинаем сохранение');
                var request = new XMLHttpRequest();
                request.open("POST", "../preset.php", false);
                _request = request;

                request.send(FD);
                if (request.statusText == "OK") {

                    try {
                        var resp = JSON.parse(request.responseText);
                        if (resp.status == "error") {
                            alert("Preset has not been saved:" + resp.error);
                        }
                        else {
                            alert("Preset has been saved");

                            var div = document.getElementById("savepreset-form-container");
                            hide_show_element(div);
                            savepreset_as_select_update();
                        }
                    }
                    catch (e) {
                        console.log("ОШИБКА функции save_preset JSON.parse");
                        console.log(e);
                        alert("Preset has not been saved");
                    }
                }
                else {
                    alert("ОШИБКА функции save_preset - request.statusText");
                    console.log('Ошибка  райдера');
                    console.log(request);
                    console.log(request.responseText);
                }
                cursor_to_default();
            }
            else {
                alert("Please, select object to save preset");
            }
        }
        catch (e) {
            console.log("ОШИБКА функции save_preset");
            console.log(e);
        }
    }
    function save_preset_as_file(file) {
        try {

            if (_selected_obj) {
                console.log('Начинаем сохранение');
                var request = new XMLHttpRequest();
                request.open("POST", "../preset.php", false);
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                _request = request;
                request.onreadystatechange = function () {
                    //console.log(this.readyState);
                    if (this.status == "200") {
                        alert("Сохранено! \n");
                    }
                    else {
                        console.log("Статус сохранения! \n" + this.status + "\n" + this.readyState + _request.responseText);
                    }
                };

                var id = _selected_obj.render.data_id;
                var index = param_index_by_id(id);
                //console.log(stage);
                delete_objects_temporary();
                set_positions_relative(_obj_params[index]);
                var text = JSON.stringify(_obj_params[index]);
                set_positions_absolute(_obj_params[index]);
                return_objects_temporary();
                var re = /"id":([0-9]+?),/g; //"Obj_id":2,"obj":null
                var newtext = text.replace(re, '');
                re = /("parent":)([0-9]+?),/g;
                text = newtext.replace(re, '');
                re = /"parent":"",/g;
                newtext = text.replace(re, '');
                re = /"obj":null,/g;
                text = newtext.replace(re, '');
                re = /"selected":true,/g;
                newtext = text.replace(re, '');
                re = /,"Obj_id":([0-9]+?)}/g;
                text = newtext.replace(re, '}');
                re = /,"Zabs":([0-9.-]+?)}/g;
                newtext = text.replace(re, '}');
                re = /,"Yabs":([0-9.-]+?)}/g;
                text = newtext.replace(re, '}');
                re = /,"Xabs":([0-9.-]+?)}/g;
                newtext = text.replace(re, '}');
                re = /,"is_jump":false}/g;
                text = newtext.replace(re, '}');
                re = /,"obj":null}/g;
                newtext = text.replace(re, '}');

                request.send("file=" + encodeURIComponent(file) + "&stage=" + encodeURIComponent(newtext));
            }
            else {
                alert("Please, select object to save preset");
            }
        }
        catch (e) {
            alert('Save error');
            console.log(e);
        }
    }
    function sort_objects_by_channel(id_start) {
        try {
            if (id_start < 0 || id_start > _obj_params.length - 1)
                id_start = 0;
            //console.log("id_start = " +id_start);
            var switching, i, x, y, shouldSwitch;
            //table = document.getElementById(ID);
            switching = true;
            while (switching) {
                switching = false;

                for (i = id_start; i < _obj_params.length - 1; i++) {
                    shouldSwitch = false;
                    //console.log(_obj_params[i]);
                    //console.log(i);
                    //console.log(_obj_params);
                    var list = _obj_params[i].input_list;
                    if (list.length > 0 && list[0].Channel)
                        x = parseInt(list[0].Channel);
                    else
                        x = 0;
                    list = _obj_params[i + 1].input_list;
                    if (list.length > 0 && list[0].Channel)
                        y = parseInt(list[0].Channel);
                    else
                        y = 0;
                    if (x > y) {
                        //console.log(x + ">" + y);
                        shouldSwitch = true;
                        break;
                    }
                    else {
                        //console.log(x + "<" + y);
                    }
                }
                if (shouldSwitch) {
                    var temp = _obj_params[i];
                    _obj_params[i] = _obj_params[i + 1];
                    _obj_params[i + 1] = temp;
                    //console.log("Меняем местами " + i + " и " + (i + 1));
                    switching = true;
                }
            }//*/

        }
        catch (e) {
            console.log("ОШИБКА функции sort_objects_by_channel");
            console.log(e);
        }
    }

    function set_children() {
        for (var i = 0; i < _obj_params.length; i++) {
            _obj_params[i].children = [];
        }
        for (var i = 0; i < _obj_params.length; i++) {
            if (_obj_params[i].parent) {
                var index = param_index_by_id(_obj_params[i].parent);
                if (index >= 0)
                    _obj_params[index].children.push(_obj_params[i]);
            }
        }
    }
    function delete_objects_temporary() {
        try {
            for (var i = 0; i < _obj_params.length; i++) {
                _obj_params[i].obj = null;
                for (var j = 0; j < _obj_params[i].input_list.length; j++) {
                    delete _obj_params[i].input_list[j].obj;
                }
                for (var j = 0; j < _obj_params[i].output_list.length; j++) {
                    delete _obj_params[i].output_list[j].obj;
                }
                for (var j = 0; j < _obj_params[i].gear_list.length; j++) {
                    delete _obj_params[i].gear_list[j].obj;
                }
            }
        }
        catch (e) {
            console.log("ОШИБКА функции delete_objects_temporary");
            console.log(e);
        }
    }
    function return_objects_temporary() {
        try {
            for (var i = 0; i < _obj_params.length; i++) {
                var objs = m_scenes.get_all_objects("ALL");
                //console.log(objs);
                for (var i = 0; i < objs.length; i++) {
                    var obj = objs[i];
                    if (m_obj.is_mesh(obj)) {
                        //console.log(obj);
                        var index = param_index_by_id(obj.render.data_id);
                        if (index > 0) {
                            //console.log(_obj_params[index]);
                            _obj_params[index].obj = obj;
                            for (var j = 0; j < _obj_params[index].input_list.length; j++) {
                                _obj_params[index].input_list[j].obj = obj;
                            }
                            for (var j = 0; j < _obj_params[index].output_list.length; j++) {
                                _obj_params[index].output_list[j].obj = obj;
                            }
                            for (var j = 0; j < _obj_params[index].gear_list.length; j++) {
                                _obj_params[index].gear_list[j].obj = obj;
                            }
                        }
                    }
                }
            }
        }
        catch (e) {
            console.log("ОШИБКА функции return_objects_temporary");
            console.log(e);
        }
    }
    function cursor_to_wait() {
        document.body.style.cursor = 'wait';
        var elements = document.getElementsByClassName('button');
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.cursor = 'wait';
        }
        cont = document.getElementById("waiticon");
        hide_show_element(cont);
    }
    function cursor_to_default() {
        document.body.style.cursor = 'default';
        var elements = document.getElementsByClassName('button');
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.cursor = 'pointer';
        }
        cont = document.getElementById("waiticon");
        hide_show_element(cont);
    }
    function add_object() {
        try {
            var aform = document.getElementById("addobject_form");
            var select = aform.elements.namedItem("object");
            var name = select.options[select.selectedIndex].text;
            if (name == "Upload New Object") {
                var FD = new FormData(aform);
                FD.append("action", "create");
                FD.append(_CSRF, _CSRFToken);

                var request = new XMLHttpRequest();
                request.open("POST", "../model.php", false);

                cursor_to_wait();

                request.send(FD);
                if (request.statusText == "OK") {

                    try {
                        var resp = JSON.parse(request.responseText);
                        if (resp.status == "error") {
                            alert("3d object has not been uploaded:" + resp.error);
                        }
                        else {
                            alert("3d object was uploaded as " + resp.name);
                            var preset = {};
                            preset.name = resp.name;
                            preset.Title = resp.name;
                            preset.Comment = '';
                            preset.model_src = resp.name + '.json';
                            preset.X = 0;
                            preset.Y = 0;
                            preset.Z = parseFloat(aform.elements.namedItem("Z").value);
                            preset.Is_Structure = aform.elements.namedItem("structure").checked;
                            preset.Height = parseFloat(aform.elements.namedItem("Height").value);
                            preset.turn = 0;
                            preset.Locked = false;
                            preset.Title_to_Source = aform.elements.namedItem("Title_to_Source").checked;
                            preset.children = [];
                            preset.input_list = [];
                            preset.output_list = [];
                            preset.gear_list = [];
                            _count = 1;
                            _uploading = true;
                            _preset = preset;
                            _last_index = _obj_params.length;
                            load_models_from_preset(preset);
                            var div = document.getElementById("addobject-form-container");
                            hide_show_element(div);
                            restore_objects_select();
                        }
                    }
                    catch (e) {
                        console.log("ОШИБКА функции add_object");
                        console.log(e);
                        alert("3d object was uploaded with errors");
                    }

                }
                else {
                    alert("Error while uploading object");
                    console.log('Ошибка получения райдера');
                    console.log(request);
                    console.log(request.responseText);
                }
                cursor_to_default();
            }
            else {
                var preset = {};
                preset.name = name;
                preset.Title = name;
                preset.Comment = '';
                preset.model_src = name + '.json';
                preset.X = 0;
                preset.Y = 0;
                preset.Z = parseFloat(aform.elements.namedItem("Z").value);
                preset.Is_Structure = aform.elements.namedItem("structure").checked;
                preset.Height = parseFloat(aform.elements.namedItem("Height").value);
                preset.turn = 0;
                preset.Locked = false;
                preset.Title_to_Source = aform.elements.namedItem("Title_to_Source").checked;
                preset.children = [];
                preset.input_list = [];
                preset.output_list = [];
                preset.gear_list = [];
                _count = 1;
                _uploading = true;
                _preset = preset;
                _last_index = _obj_params.length;
                load_models_from_preset(preset);
                var div = document.getElementById("addobject-form-container");
                hide_show_element(div);
            }
        }
        catch (e) {
            console.log("ОШИБКА функции add_object");
            console.log(e);
        }
    }
    function restore_rider() {
        try {
            var pform = document.getElementById("restore_form");
            var select = pform.elements.namedItem("rider");
            var id = select.options[select.selectedIndex].value;
            restore_stage("../rider.php?id=" + id);
            var div = document.getElementById("restore-form-container");
            hide_show_element(div);
        }
        catch (e) {
            console.log("ОШИБКА функции restore_rider");
            console.log(e);
        }
    }

    function delete_rider() {
        try {
            var pform = document.getElementById("restore_form");
            var select = pform.elements.namedItem("rider");
            var id = select.options[select.selectedIndex].value;
            var request = new XMLHttpRequest();
            request.open("POST", "../rider.php", false);
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            var data = _CSRF + "=" + _CSRFToken + "&action=deleterider&id=" + id + "&name=" + _stage_title;
            request.send(data);
            if (request.statusText == "OK") {
                var resp = JSON.parse(request.responseText);
                console.log(resp);
                restore_rider_select();
                alert("Rider " + resp.name + "(" + resp.id + ") has been deleted");
            }
            else {
                console.log('Ошибка удаления райдера');
                alert("Rider " + resp.name + "(" + resp.id + ") has NOT been deleted. System error");
                console.log(request);
                console.log(request.responseText);
                return;
            }
        }
        catch (e) {
            console.log("ОШИБКА функции delete_rider");
            console.log(e);
        }
    }

    function restore_stage(file) {
        try {

            if (_obj_params.length > 0) {
                for (var i = _obj_params.length - 1; i >= 0; i--) {
                    delete_object_by_id(_obj_params[i].id);
                }
            }
            var request = new XMLHttpRequest();
            var stage;
            if (file.includes("../rider.php?id="))
            {
                request.open("POST", "../rider.php", false);
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                var data = _CSRF + "=" + _CSRFToken + "&action=getrider&" + file.split("?")[1];
                request.send(data);
                if (request.statusText == "OK")
                {
                    var resp = JSON.parse(request.responseText);
                    stage = JSON.parse(resp.rider.JSON);
                    console.log(stage);
                    _rider_id = resp.rider.id;
                    _rider_name = resp.rider.name;                }
                else
                {
                    console.log('Ошибка получения райдера');
                    console.log(request);
                    console.log(request.responseText);
                    return;
                }
            }
            else
            {
                request.open("GET", file, false);
                request.send(null);
                stage = JSON.parse(request.responseText);
            }

            if (stage.input_list) _stage_input_list = stage.input_list;
            if (stage.output_list) _stage_output_list = stage.output_list;
            if (stage.gear_list) _stage_gear_list = stage.gear_list;
            for (var i = 0; i < _stage_gear_list.length; i++) {
                _stage_gear_list[i].Obj_id = "Stage";
                _stage_gear_list[i].obj = null;
            }
            _show_grid = stage.Show_Grid;
            _show_anchors = stage.Show_Channels;
            _show_input = stage.Show_CH;
            _show_output = stage.Show_MIX;
            _show_title = stage.Show_Title;
            _show_comment = stage.Show_Comments;
            if (stage.gear_categories) _gear_categories = stage.gear_categories;
            _rider_text = stage.Rider_text;
            _stage_title = stage.Title;
            _stage_comment = stage.Comment;
            _stage_length = stage.Length;
            var sform = document.getElementById("stage_form");

            sform.elements.namedItem("Length").value = stage.Length;
            sform.elements.namedItem("Text").value = _rider_text;
            sform.elements.namedItem("Title").value = _stage_title;
            sform.elements.namedItem("Comment").value = _stage_comment;
            sform.elements.namedItem("showtitle").checked = _show_title;
            sform.elements.namedItem("showch").checked = _show_input;
            sform.elements.namedItem("showmix").checked = _show_output;
            sform.elements.namedItem("showcomments").checked = _show_comment;

            save_stage_prop();
            var div = document.getElementById("stage-form-container");
            hide_show_element(div);

            //console.log(stage);
            //console.log(_preset.children);
            //console.log(_preset.children.length);
            if (stage.children.length > 0) {
                _preset = stage;
                _count = 0;//stage.children.length;
                _uploading = true;
                _restore_stage = true;
                _last_index = 0;//_obj_params.length - 1;
                cursor_to_wait();
                //_last_index = _obj_params.length-1;
                explode_preset(_preset);
                load_models_from_preset(_preset);
            }
            else {
                //alert("Stage is empty");
                console.log("Stage is empty");
                update_gear_list();
            }
        }
        catch (e) {
            alert('Restore error');
            console.log(e);
        }
    }

    function load_from_preset(id) {
        try {
            var preset = "";
            var preset_json = null;
            var preset_ind = -1;
            for (var i = 0; i < _presets.length; i++) {
                if (_presets[i].id == id) {
                    preset_ind = i;
                    if (_presets[i].JSON && _presets[i].JSON.length > 0) {
                        preset_json = _presets[i].JSON;
                        preset = JSON.parse(_presets[i].JSON);
                        break;
                    }
                }
            }
            if (preset_json == null) {
                var request = new XMLHttpRequest();
                request.open("POST", "../preset.php", false);
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                request.send(_CSRF + "=" + _CSRFToken + "&action=get&id=" + id);

                var resp = JSON.parse(request.responseText);
                if (resp.status == "OK" && resp.preset && resp.preset.JSON) {
                    preset = JSON.parse(resp.preset.JSON);
                    _presets[preset_ind].JSON = resp.preset.JSON;
                }
                else {
                    console.log("ОШИБКА функции load_from_preset: ");
                    console.log(request);
                    console.log(resp);
                    return;
                }
            }

            _count = 1;
            _uploading = true;
            _preset = preset;
            _last_index = _obj_params.length;
            if (_preset.children && _preset.children.length > 0) {
                explode_preset(_preset);
            }
            load_models_from_preset(preset);
            //m_data.load(APP_ASSETS_PATH + "KeyBoardPlayer.json", loaded_cb, null, null, true);
        }
        catch (e) {
            console.log("ОШИБКА функции load_from_preset");
            console.log(e);
        }
    }
    function load_models_from_preset(preset) {
        try {
            if (preset.model_src != "my_project.json")
                m_data.load(APP_ASSETS_PATH + preset.model_src, loaded_cb, null, null, true);
            if (_preset.children && preset.children.length > 0) {
                for (var i = 0; i < preset.children.length; i++) {
                    if (!_restore_stage && (preset.children[i].relative_coord === undefined || preset.children[i].relative_coord == true)) {
                        preset.children[i].X += preset.X;
                        preset.children[i].Y += preset.Y;
                        if (preset.children[i].Z === undefined)
                            preset.children[i].Z = 0;
                        if (preset.Z === undefined)
                            preset.Z = 0;
                        preset.children[i].Z += preset.Z;
                        //preset.children[i].turn += preset.turn;
                    }
                    load_models_from_preset(preset.children[i]);
                }
            }
            else {
                //console.log("нет children");
                //console.log(preset);
            }
        }
        catch (e) {
            console.log("ОШИБКА функции load_models_from_preset");
            console.log(e);
        }
    }
    function explode_preset(preset) {
        try {
            if (!preset.children) {
                console.log("Предатель");
                console.log(preset);
                preset.children = [];
            }
            else if (preset.children.length > 0) {
                for (var i = 0; i < preset.children.length; i++) {
                    _count++;
                    if (preset.children[i].src) {
                        var request = new XMLHttpRequest();
                        request.open("GET", '../presets/' + preset.children[i].src, false);
                        request.send(null);
                        var presetc = JSON.parse(request.responseText);
                        presetc.X = preset.children[i].X;
                        presetc.Y = preset.children[i].Y;
                        presetc.turn = preset.children[i].turn;
                        preset.children[i] = presetc;
                        delete preset.children[i].src;
                        explode_preset(presetc);
                    }
                    else {
                        var presetc = preset.children[i];
                        explode_preset(presetc);
                    }
                }
            }
        }
        catch (e) {
            console.log("ОШИБКА функции explode_preset");
            console.log(e);
        }
    }
    function param_index_by_id(id) {
        //console.log(_obj_params);
        for (var i = 0; i < _obj_params.length; i++) {
            if (_obj_params[i].id == id) {
                return i;
            }
        }
        return -1;
    }

    function loaded_cb(data_id) {
        try {
            //console.log("Загружаем на сцену обьекты ");
            //console.log(data_id);
            var objs = m_scenes.get_all_objects("ALL", data_id);
            for (var i = 0; i < objs.length; i++) {
                var obj = objs[i];
                //console.log(obj);
                if (m_phy.has_physics(obj)) {
                    //console.log("Есть физика");
                    m_phy.enable_simulation(obj);

                    // create sensors to detect collisions
                    var sensor_col = m_ctl.create_collision_sensor(obj, "MUSICOBJ");
                    var sensor_sel = m_ctl.create_selection_sensor(obj, true);

                    if (obj == _selected_obj)
                        m_ctl.set_custom_sensor(sensor_sel, 1);

                    m_ctl.create_sensor_manifold(obj, "COLLISION", m_ctl.CT_CONTINUOUS,
                        [sensor_col, sensor_sel], logic_func, trigger_outline);


                    // spawn appended object at a certain position
                    var obj_parent = m_obj.get_parent(obj);
                    if (obj_parent && m_obj.is_armature(obj_parent))
                        // translate the parent (armature) of the animated object
                        m_trans.set_translation_v(obj_parent, spawner_pos);
                    else
                        m_trans.set_translation_v(obj, spawner_pos);//*/
                }

                // show appended object
                if (m_obj.is_mesh(obj)) {
                    //console.log("Объект mesh");
                    var cyl_text = document.createElement("span");
                    cyl_text.id = "anchor" + obj.render.data_id;
                    cyl_text.classList.add("anchor");
                    /*cyl_text.style.position = "absolute";
                    cyl_text.style.backgroundColor = "#ddd";
                    cyl_text.style.opacity = "0.5";
                    cyl_text.style.color = "black";
                    cyl_text.style.fontSize = "10px";
                    cyl_text.style.padding = "2px";
                    cyl_text.innerHTML = "";*/

                    document.body.appendChild(cyl_text);

                    var anchor = obj.cons_descends[0];

                    m_anchors.attach_move_cb(anchor, function (x, y, appearance, objj, elem) {
                        var anchor_elem = document.getElementById("anchor" + obj.render.data_id);
                        anchor_elem.style.left = x + "px";
                        anchor_elem.style.top = y + "px";

                        if (_show_anchors)
                            anchor_elem.style.visibility = "visible";
                        else
                            anchor_elem.style.visibility = "hidden";
                    });
                    //obj.cons_descends[0].anchor.element_id='my_design'+obj.render.data_id;
                    m_scenes.show_object(obj);
                    //console.log("Показываем");
                    //console.log(obj);
                    if (_uploading) {
                        add_params(obj);
                    }
                    //console.log("Добавили параметры");
                    /*if (!_show_anchors)
                    {
                        hide_anchors();
                    }*/
                }
            }
        }
        catch (e) {
            console.log("ОШИБКА функции loaded_cb");
            console.log(e);
        }
    }
    function add_input(e) {
        try {
            var pform = document.getElementById("properties_form");
            var oid = pform.elements.namedItem("ID").value;
            var index = param_index_by_id(oid);
            var t = document.getElementById("input_list_table");
            if (!t) {
                t = document.createElement('table');
                t.id = 'input_list_table';
                t.classList.add("info-table");
                var listcont = document.getElementById("input-list-container");
                listcont.innerHTML = '<h2>input List (' + (t.rows.length - 1) + ')</h2>';
                var listheader = document.getElementById("input-list-header");
                listheader.innerHTML = 'Input List (' + (t.rows.length - 1) + ')';
                listcont.appendChild(t);
            }
            var num = find_empty_channel(t, _locked_input_channels);
            var input = new Object();
            input.Source = 'NEW';
            input.Type = 'NEW';
            input.ChName = 'NEW';
            input.Comment = '';
            input.Channel = num;

            if (index >= 0) {
                input.Obj_id = _obj_params[index].id;
                input.obj = _obj_params[index].obj;
                _obj_params[index].input_list.push(input);
            }
            else {
                _stage_input_list.push(input);
            }
            clear_input_channels();
            update_input_list();
        }
        catch (e) {
            console.log("ОШИБКА функции add_input");
            console.log(e);
        }
    }
    function find_empty_channel(table, list) {
        try {
            if (table.rows.length > 1) {
                if (!list) list = _locked_input_channels;
                for (var i = 1; i < table.rows.length; i++) {
                    if (i < parseInt(table.rows[i].cells[0].innerHTML) && !(i in list))
                        return i;
                }
                return table.rows.length;
            }
            else {
                return 1;
            }
        }
        catch (e) {
            console.log("ОШИБКА функции find_empty_channel");
            console.log(e);
        }
    }
    function add_output(e) {
        try {
            var pform = document.getElementById("properties_form");
            var oid = pform.elements.namedItem("ID").value;
            var index = param_index_by_id(oid);
            var t = document.getElementById("output_list_table");
            if (!t) {
                t = document.createElement('table');
                t.id = 'output_list_table';
                t.classList.add("info-table");
                var listcont = document.getElementById("output-list-container");
                listcont.innerHTML = '<h2>output List (' + (t.rows.length - 1) + ')</h2>';
                listcont.appendChild(t);
                var listheader = document.getElementById("output-list-header");
                listheader.innerHTML = 'output List (' + (t.rows.length - 1) + ')';
            }
            var num = find_empty_channel(t, _locked_output_channels);
            var output = new Object();
            output.Source = 'NEW';
            output.Type = 'NEW';
            output.ChName = 'NEW';
            output.Comment = '';
            output.Channel = num;
            if (index >= 0) {
                output.Obj_id = _obj_params[index].id;
                output.obj = _obj_params[index].obj;
                _obj_params[index].output_list.push(output);
            }
            else {
                _stage_output_list.push(output);
            }
            update_output_list();
        }
        catch (e) {
            console.log("ОШИБКА функции add_output");
            console.log(e);
        }
    }
    function add_gear(e) {
        try {
            var pform = document.getElementById("properties_form");
            var oid = pform.elements.namedItem("ID").value;
            var index = param_index_by_id(oid);
            var gear = new Object();
            gear.Name = 'NEW';
            gear.Category = 'NEW';
            gear.Image = '';
            gear.Comment = 'NEW';
            gear.Weight = 0;
            gear.Weight_round = 1;
            gear.Count = 1;
            gear.Count_round = 1;
            gear.Owner = 'Rent';
            gear.Power_consumption = 0;
            gear.Category = "Stage Gears";
            if (index >= 0) {
                gear.Obj_id = _obj_params[index].id;
                gear.obj = _obj_params[index].obj;
                _obj_params[index].gear_list.push(gear);
            }
            else {
                gear.Obj_id = "Stage";
                gear.Category = 'Stage NEW';
                gear.obj = null;
                _stage_gear_list.push(gear);
            }
            update_gear_list();
        }
        catch (e) {
            console.log("ОШИБКА функции add_gear");
            console.log(e);
        }
    }
    function scale_stage(coef) {
        var obj = m_scenes.get_object_by_name("Stage");
        //var scale = m_trans.get_scale(obj);
        //console.log(coef);
        m_trans.set_scale(obj, coef);
    }

    function save_stage_prop(e) {
        try {
            var sform = document.getElementById("stage_form");
            var len = parseFloat(sform.elements.namedItem("Length").value);
            _rider_text = sform.elements.namedItem("Text").value;
            _stage_length = len;
            _stage_title = sform.elements.namedItem("Title").value;
            _stage_comment = sform.elements.namedItem("Comment").value;
            _show_title = sform.elements.namedItem("showtitle").checked;
            _show_input = sform.elements.namedItem("showch").checked;
            _show_output = sform.elements.namedItem("showmix").checked;
            _show_comment = sform.elements.namedItem("showcomments").checked;

            if (len && len > 0) {
                var coef = len / 20;
                scale_stage(coef);
                WALL_X_MAX = 5 * coef;
                WALL_X_MIN = -5 * coef;
                WALL_Y_MAX = 10 * coef;
                WALL_Y_MIN = -10 * coef;
            }
            update_input_list();
            update_output_list();
            var div = document.getElementById("stage-form-container");
            hide_show_element(div);
        }
        catch (e) {
            console.log("ОШИБКА функции save_stage_prop");
            console.log(e);
        }
    }
    function lock_all_children(obj) {
        try {
            for (var i = 0; i < obj.children.length; i++) {
                obj.children[i].Locked = true;
                if (obj.children[i].children && obj.children[i].children.length > 0) {
                    lock_all_children(obj.children[i]);
                }
            }
        }
        catch (e) {
            console.log("ОШИБКА функции lock_all_children");
            console.log(e);
        }
    }
    function update_anchor(objp) {
        try {
            if (_show_title || _show_comment || _show_input || _show_output) {
                var anchor_elem = document.getElementById("anchor" + objp.id);
                anchor_elem.innerHTML = '';
                if (_show_title) {
                    anchor_elem.innerHTML += objp.Title;
                }
                if (_show_input && objp.input_list.length > 0) {
                    anchor_elem.innerHTML += ' (CH ' + objp.input_list[0].Channel;
                    for (var i = 1; i < objp.input_list.length; i++) {
                        anchor_elem.innerHTML += "," + objp.input_list[i].Channel;
                    }
                    anchor_elem.innerHTML += ')';
                    if (!anchor_elem.classList.contains("ch")) anchor_elem.classList.add("ch");
                }
                else {
                    anchor_elem.classList.remove("ch");
                }
                if (_show_output && objp.output_list.length > 0) {
                    anchor_elem.innerHTML += '(MIX ' + objp.output_list[0].Channel;
                    for (var i = 1; i < objp.output_list.length; i++) {
                        anchor_elem.innerHTML += "," + objp.output_list[i].Channel;
                    }
                    anchor_elem.innerHTML += ')';
                    if (!anchor_elem.classList.contains("mix")) anchor_elem.classList.add("mix");
                }
                else {
                    anchor_elem.classList.remove("mix");
                }
                if (_show_comment) {
                    anchor_elem.innerHTML += '<br/>' + objp.Comment;
                }
            }
        }
        catch (e) {
            console.log("ОШИБКА функции update_anchor");
            console.log(e);
        }
    }
    function save_prop(e) {
        try {
            var pform = document.getElementById("properties_form");
            var oid = pform.elements.namedItem("ID").value;
            var index = param_index_by_id(oid);
            if (index >= 0) {
                _obj_params[index].Title = pform.elements.namedItem("Title").value;
                _obj_params[index].Comment = pform.elements.namedItem("Comment").value;
                _obj_params[index].parent = pform.elements.namedItem("Parent").value;
                _obj_params[index].Locked = pform.elements.namedItem("lock").checked;
                _obj_params[index].Title_to_Source = pform.elements.namedItem("titletosource").checked;
                if (pform.elements.namedItem("lockall").checked && _obj_params[index].children.length > 0) {
                    lock_all_children(_obj_params[index]);
                }
                if (_obj_params[index].Title_to_Source) {
                    for (var i = 0; i < _obj_params[index].input_list.length; i++) {
                        _obj_params[index].input_list[i].Source = _obj_params[index].Title;
                    }
                }
                set_children();
                //console.log('saved:' + _obj_params[index].Parent);
                update_anchor(_obj_params[index]);
            }
            update_input_list();
            var div = document.getElementById("properties-form-container");
            hide_show_element(div);
        }
        catch (e) {
            console.log("ОШИБКА функции save_prop");
            console.log(e);
        }
    }

    function save_list_row(e) {
        try {
            var eform = document.getElementById("list_edit_form");
            var div = document.getElementById("list-edit-container");
            hide_show_element(div);
            var inds = eform.elements.namedItem("ID").value.split('_');
            var obj_id = param_index_by_id(inds[1]);
            if (inds[3] == 'CH') {
                var list;
                if (inds[1] == "Stage") {
                    list = _stage_input_list;
                }
                else {
                    list = _obj_params[obj_id].input_list;
                }
                list[inds[2]].ChName = eform.elements.namedItem("Name").value;
                list[inds[2]].Source = eform.elements.namedItem("Source").value;
                list[inds[2]].Type = eform.elements.namedItem("Type").value;
                list[inds[2]].Comment = eform.elements.namedItem("Comment").value;
                var lc = list[inds[2]].Locked = eform.elements.namedItem("Locked").checked;
                var ch = parseInt(eform.elements.namedItem("Channel").value);
                if (ch != list[inds[2]].Channel) {
                    if (!(ch in _locked_input_channels)) {
                        list[inds[2]].Channel = ch;
                    }
                    else {
                        alert("Channel No " + ch + " already busy and locked. Use another channel or unlock that one");
                    }
                    clear_input_channels();
                    update_output_list();
                    noedit_mode(document.getElementById("output_list_table"));
                }
                else if (lc && !(ch in _locked_input_channels)) {
                    _locked_input_channels.push(ch);
                }
                update_input_list();
                noedit_mode(document.getElementById("input_list_table"));
            }
            else if (inds[3] == 'MIX') {
                var list;
                if (inds[1] == "Stage") {
                    list = _stage_output_list;
                }
                else {
                    list = _obj_params[obj_id].output_list;
                }
                list[inds[2]].ChName = eform.elements.namedItem("Name").value;
                list[inds[2]].Source = eform.elements.namedItem("Source").value;
                list[inds[2]].Type = eform.elements.namedItem("Type").value;
                list[inds[2]].Comment = eform.elements.namedItem("Comment").value;
                var lc = list[inds[2]].Locked = eform.elements.namedItem("Locked").checked;
                var ch = parseInt(eform.elements.namedItem("Channel").value);
                if (ch != list[inds[2]].Channel) {
                    if (!(ch in _locked_output_channels)) {
                        list[inds[2]].Channel = ch;
                    }
                    else {
                        alert("Channel No " + ch + " already busy and locked. Use another channel or unlock that one");
                    }
                    clear_input_channels();
                    update_input_list();
                    noedit_mode(document.getElementById("input_list_table"));
                }
                else if (lc && !(ch in _locked_output_channels)) {
                    _locked_output_channels.push(ch);
                }
                update_output_list();
                noedit_mode(document.getElementById("output_list_table"));
            }
            else {

            }

            //console.log('END');
        }
        catch (e) {
            console.log("ОШИБКА функции save_list_row");
            console.log(e);
        }
    }
    function save_gear_list_row(e) {
        try {
            var eform = document.getElementById("gear_list_edit_form");
            var div = document.getElementById("gear-list-edit-container");
            hide_show_element(div);
            var inds = eform.elements.namedItem("ID").value.split('_');
            var gear;
            if (inds[1] == "Stage") {
                gear = _stage_gear_list[inds[2]];
            }
            else {
                var index = param_index_by_id(inds[1]);
                gear = _obj_params[index].gear_list[inds[2]];
            }

            gear.Name = eform.elements.namedItem("Name").value;
            gear.Category = eform.elements.namedItem("Category").value;
            gear.Image = eform.elements.namedItem("Image").value;
            gear.Comment = eform.elements.namedItem("Comment").value;
            gear.Weight = parseFloat(eform.elements.namedItem("Weight").value);
            gear.Count = parseFloat(eform.elements.namedItem("Count").value);
            gear.Power_consumption = parseInt(eform.elements.namedItem("Power").value);
            gear.Owner = eform.elements.namedItem("Owner").value;
            var cont = document.getElementById("gear-list-table-container");
            update_gear_list();
            hide_show_element(cont);
        }
        catch (e) {
            console.log("ОШИБКА функции save_gear_list_row");
            console.log(e);
        }
    }
    function delete_list_row(e) {
        try {
            var eform = document.getElementById("list_edit_form");
            var div = document.getElementById("list-edit-container");
            hide_show_element(div);
            //div.style.display = 'none';
            var inds = eform.elements.namedItem("ID").value.split('_');
            if (inds[1] == "Stage") {
                if (inds[3] == 'CH') {
                    _stage_input_list.splice(inds[2], 1);
                }
                else if (inds[3] == 'MIX') {
                    _stage_output_list.splice(inds[2], 1);
                }
            }
            else {
                var index = param_index_by_id(inds[1]);

                if (inds[3] == 'CH') {
                    _obj_params[index].input_list.splice(inds[2], 1);
                }
                else if (inds[3] == 'MIX') {
                    _obj_params[index].output_list.splice(inds[2], 1);
                }
            }
            //console.log('DELETED');

            clear_input_channels();
            update_input_list();
            update_output_list();
            noedit_mode(document.getElementById("input_list_table"));
            noedit_mode(document.getElementById("output_list_table"));
        }
        catch (e) {
            console.log("ОШИБКА функции delete_list_row");
            console.log(e);
        }
    }
    function delete_gear_list_row(e) {
        try {
            var eform = document.getElementById("gear_list_edit_form");
            var div = document.getElementById("gear-list-edit-container");
            hide_show_element(div);
            var inds = eform.elements.namedItem("ID").value.split('_');
            var gear;
            if (inds[1] == "Stage") {
                gear = _stage_gear_list[inds[2]];
                _stage_gear_list.splice(inds[2], 1);
            }
            else {
                var index = param_index_by_id(inds[1]);
                _obj_params[index].gear_list.splice(inds[2], 1);
            }


            update_gear_list();
            var gear_table = document.getElementById("gear-list-table-container");
            hide_show_element(gear_table);
            //console.log('DELETED');
        }
        catch (e) {
            console.log("ОШИБКА функции delete_gear_list_row");
            console.log(e);
        }
    }

    function sortTable(table) {
        try {
            var rows, switching, i, x, y, shouldSwitch;
            //table = document.getElementById(ID);
            switching = true;
            while (switching) {
                switching = false;
                rows = table.rows;//getElementsByTagName("TR");
                for (i = 1; i < (rows.length - 1); i++) {
                    shouldSwitch = false;
                    x = rows[i].getElementsByTagName("TD")[0];
                    y = rows[i + 1].getElementsByTagName("TD")[0];
                    if (parseInt(x.innerHTML) > parseInt(y.innerHTML)) {
                        shouldSwitch = true;
                        break;
                    }
                }
                if (shouldSwitch) {
                    //console.log("Меняем местами " + i + " и " + (i+1));
                    rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                    switching = true;
                }
            }

        }
        catch (e) {
            console.log("ОШИБКА функции sortTable");
            console.log(e);
        }
    }

    function gear_sort_categories(categories) {
        try {
            var switching, i, shouldSwitch;
            //table = document.getElementById(ID);
            switching = true;
            while (switching) {
                switching = false;
                for (i = 0; i < (categories.length - 1); i++) {
                    shouldSwitch = false;
                    if (categories[i].Index > categories[i + 1].Index) {
                        shouldSwitch = true;
                        break;
                    }
                }
                if (shouldSwitch) {
                    //console.log("Меняем местами " + i + " и " + (i+1));
                    //console.log(categories);
                    categories.splice(i, 2, categories[i + 1], categories[i]);
                    //console.log(categories);
                    switching = true;
                }
            }
        }
        catch (e) {
            console.log("ОШИБКА функции gear_sort_categories");
            console.log(e);
        }
    }

    function fill_empty_channels(table) {
        try {
            if (table.rows.length > 1) {
                //console.log(table.rows[table.rows.length-1]);
                var last_ch = parseInt(table.rows[table.rows.length - 1].cells[0].innerHTML);
                //console.log("Last Ch:" + last_ch);
                for (var i = 1; i < last_ch; i++) {
                    var cells = table.rows[i].cells;
                    if (parseInt(cells[0].innerHTML) != i) {
                        console.log("Ch:" + cells[0].innerHTML + "!=" + i);
                        var row = table.insertRow();
                        var cell = row.insertCell();
                        cell.innerHTML = i;
                        for (var j = 0; j < cells.length - 1; j++) {
                            row.insertCell();
                        }
                        table.rows[i].parentNode.insertBefore(row, table.rows[i]);
                    }
                } //*/
            }
        }
        catch (e) {
            console.log("ОШИБКА функции fill_empty_channels");
            console.log(e);
        }
    }
    function noedit_mode(table) {
        try {
            if (table.classList.contains("noedit-mode")) {
                table.classList.remove("noedit-mode");
            }
            else {
                table.classList.add("noedit-mode");
            }
        }
        catch (e) {
            console.log("ОШИБКА функции noedit_mode");
            console.log(e);
        }
    }
    function phantom_power_click(row, sup) {
        try {
            var ind = row.id.split("_");
            var index = param_index_by_id(ind[1]);
            var input = _obj_params[index].input_list[ind[2]];
            if (sub.classList.contains("active") && input.Phantom_power == "On") {
                sub.classList.remove("active");
                input.Phantom_power == "Off"
            }
            else {
                sub.classList.add("active");
                input.Phantom_power == "On"
            }
        }
        catch (e) {
            console.log("ОШИБКА функции phantom_power_click");
            console.log(e);
        }
    }

    function update_input_list(name) {
        try {
            if (!name) {
                name = 'input';
            }
            var c, r, t;
            t = document.createElement('table');
            t.id = name + '_list_table';
            t.classList.add("info-table");
            t.classList.add("noedit-mode");
            //var h = t.createTHead();

            r = t.insertRow();//h.insertRow();
            var hr = document.createElement("TH");
            hr.innerHTML = "№";
            r.appendChild(hr);
            hr = document.createElement("TH");
            hr.innerHTML = "";
            r.appendChild(hr);
            hr = document.createElement("TH");
            hr.innerHTML = "Source";
            r.appendChild(hr);
            hr = document.createElement("TH");
            hr.innerHTML = "Type";
            r.appendChild(hr);
            hr = document.createElement("TH");
            hr.innerHTML = "Name";
            r.appendChild(hr);
            hr = document.createElement("TH");
            hr.innerHTML = "Comment";
            r.appendChild(hr);
            hr = document.createElement("TH");
            hr.innerHTML = "";
            r.appendChild(hr);

            var count = 0;
            //console.log(_obj_params);
            for (var j = 0; j < _obj_params.length; j++) {
                var objp = _obj_params[j];
                if (objp) {
                    var list, prefix, lock;
                    if (name == 'input') {
                        list = objp.input_list;
                        prefix = 'CH';
                        lock = _locked_input_channels;
                    }
                    else if (name == 'output') {
                        list = objp.output_list;
                        prefix = 'MIX';
                        lock = _locked_output_channels;
                    }
                        //else if (name=='gear')
                    //list = objp.gear_list;
                    else
                        return;
                    if (list && list.length > 0) {
                        for (var i = 0; i < list.length; i++) {
                            count++;

                            var obj = list[i];
                            //console.log("BEFORE:" + obj.Channel);
                            //console.log(t);
                            if (!obj.Channel)
                                obj.Channel = find_empty_channel(t, lock);
                            //console.log("AFTER:" + obj.Channel);

                            if (i == 0 && prefix) {
                                update_anchor(objp);
                                //anchor_elem.innerHTML = objp.Title + '(' + prefix + ' ' + count + ')<br/>' + objp.Comment;
                            }

                            r = t.insertRow();
                            r.id = 'id_' + obj.Obj_id + '_' + i + '_' + prefix;
                            if (obj.obj == _selected_obj) {
                                r.classList.add('selected_row');
                                r.classList.add('input_' + obj.Obj_id);
                            }
                            else
                                r.classList.add('input_' + obj.Obj_id);

                            /*if (obj.Channel % 2 == 0) {
                                r.classList.add('odd_row');
                            }*/

                            var oid = obj.Obj_id;
                            var SelectObjClickHandler = function (row) { return function () { select_obj_row(row); }; };

                            c = r.insertCell();
                            c.innerHTML = obj.Channel;
                            c.onclick = SelectObjClickHandler(r);

                            var phantom = "";
                            if (name == 'input') {
                                var PhantomClickHandler = function (sup, row) { return function () { phantom_power_click(row, sup); }; };
                                var sup = document.createElement('sup');
                                sup.innerHTML = '+48v';
                                sup.onclick = PhantomClickHandler(this, r);
                                if (obj.Phantom_power == "On")
                                    sup.className = 'phantom';
                                else
                                    sup.className = 'phantom active';
                                c.appendChild(sup);
                            }

                            c = r.insertCell();
                            if (obj.Locked) {
                                c.innerHTML = '<img src="../interface/lock.png" />';
                            }
                            else {
                                if (obj.Channel > 1) {
                                    var but = document.createElement('div');
                                    but.title = "Move channel up (decrease number)";
                                    but.className = "arrow-up";
                                    c.appendChild(but);
                                    but.id = "up_" + obj.Obj_id + '_' + i + '_' + prefix;
                                    but.addEventListener("click", function (e) {
                                        move_input_channel(this);
                                    });
                                }
                                if (j < _obj_params.length - 1) {
                                    var but = document.createElement('div');
                                    but.title = "Move channel down (increase number)";
                                    but.className = "arrow-down";
                                    c.appendChild(but);
                                    but.id = "down_" + obj.Obj_id + '_' + i + '_' + prefix;
                                    but.addEventListener("click", function (e) {
                                        move_input_channel(this);
                                    });
                                }
                            }

                            c = r.insertCell();
                            c.innerHTML = obj.Source;
                            c.onclick = SelectObjClickHandler(r);

                            c = r.insertCell();
                            c.innerHTML = obj.Type;
                            c.onclick = SelectObjClickHandler(r);

                            c = r.insertCell();
                            c.innerHTML = obj.ChName;
                            c.onclick = SelectObjClickHandler(r);

                            c = r.insertCell();
                            c.innerHTML = obj.Comment; // + phantom;
                            c.onclick = SelectObjClickHandler(r);

                            c = r.insertCell();
                            var b = document.createElement("BUTTON");
                            b.innerHTML = '<img src="../interface/8_1.png" />';
                            b.className = "edit-mode-button";
                            var OpenListEditClickHandler = function (but) { return function () { open_list_edit_form(but.parentElement.parentElement); }; };
                            b.onclick = OpenListEditClickHandler(b);
                            c.appendChild(b);//*/
                            sortTable(t);
                            //console.log("After sort:");
                            //console.log(t);
                        }
                    }
                    else {
                        update_anchor(objp);
                        //anchor_elem.innerHTML = objp.Title + '(' + prefix + ' ' + count + ')<br/>' + objp.Comment;
                    }
                }
            }
            if (name == 'input') {
                list = _stage_input_list;
                prefix = 'CH';
                lock = _locked_input_channels;
            }
            else if (name == 'output') {
                list = _stage_output_list;
                prefix = 'MIX';
                lock = _locked_output_channels;
            }
            if (list && list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    var obj = list[i];
                    if (!obj.Channel)
                        obj.Channel = find_empty_channel(t, lock);
                    r = t.insertRow();
                    r.id = 'id_Stage_' + i + '_' + prefix;

                    c = r.insertCell();
                    c.innerHTML = obj.Channel;

                    /*if (obj.Channel % 2 == 0) {
                        r.classList.add('odd_row');
                    }*/

                    var phantom = "";
                    if (name == 'input' && obj.Phantom_power == "On") {
                        phantom = '<sup class="phantom">+48v</sup>';
                        c.innerHTML += phantom;
                    }

                    c = r.insertCell();
                    if (obj.Locked) {
                        c.innerHTML = '<img src="../interface/lock.png" />';
                    }
                    else {
                        if (i > 0) {
                            var but = document.createElement('div');
                            but.title = "Move channel up (decrease number)";
                            but.className = "arrow-up";
                            c.appendChild(but);
                            but.id = "up_Stage" + '_' + i + '_' + prefix;
                            but.addEventListener("click", function (e) {
                                move_input_channel(this);
                            });
                        }
                        if (i < list.length - 1) {
                            var but = document.createElement('div');
                            but.title = "Move channel down (increase number)";
                            but.className = "arrow-down";
                            c.appendChild(but);
                            but.id = "down_Stage" + '_' + i + '_' + prefix;
                            but.addEventListener("click", function (e) {
                                move_input_channel(this);
                            });
                        }
                    }

                    c = r.insertCell();
                    c.innerHTML = obj.Source;

                    c = r.insertCell();
                    c.innerHTML = obj.Type;

                    c = r.insertCell();
                    c.innerHTML = obj.ChName;

                    c = r.insertCell();
                    c.innerHTML = obj.Comment;// + phantom;

                    c = r.insertCell();
                    var b = document.createElement("BUTTON");
                    b.innerHTML = '<img src="../interface/8_1.png" />';
                    b.className = "edit-mode-button";
                    var OpenListEditClickHandler = function (but) { return function () { open_list_edit_form(but.parentElement.parentElement); }; };
                    b.onclick = OpenListEditClickHandler(b);
                    c.appendChild(b);//*/
                    sortTable(t);
                }
            }
            fill_empty_channels(t);
            var listcont = document.getElementById(name + "-list-container");
            var listheader = document.getElementById(name + "-list-header");
            listheader.innerHTML = name + ' List (' + (t.rows.length - 1) + ')';
            listcont.innerHTML = '';
            var b = document.createElement("BUTTON");
            b.innerHTML = '<img src="../interface/8_1.png" />';
            b.className = "edit-mode-button";
            var OpenListEditClickHandler = function (but) { return function () { noedit_mode(document.getElementById(name + "_list_table")); }; };
            b.onclick = OpenListEditClickHandler(b);
            listcont.appendChild(b);
            var header = document.createElement('h2');
            header.innerHTML = name + ' List (' + (t.rows.length - 1) + ')';
            listcont.appendChild(header);
            listcont.appendChild(t);
            //console.log('UPDATING FINISHED');
        }
        catch (e) {
            console.log("ОШИБКА функции update_input_list");
            console.log(e);
        }
    }
    function move_input_channel(div) {
        try {
            var inds = div.id.split('_');
            //console.log(div.id);
            var list;
            if (inds[1] == "Stage") {
                if (inds[3] == 'CH')
                    list = _stage_input_list;
                else if (inds[3] == 'MIX')
                    list = _stage_output_list;
                var i = parseInt(inds[2]);
                //console.log(inds[0]);
                //console.log(inds[3]);
                //console.log(i);
                if (inds[0] == "up" && i > 0) {
                    //console.log(list[i].Source + " меняем с " + list[i-1].Source);
                    list.splice(i - 1, 2, list[i], list[i - 1]);
                }
                else if (inds[0] == "down" && i < list.length - 1) {
                    //console.log(list[i].Source + " меняем с " + list[i+1].Source);
                    list.splice(i, 2, list[i + 1], list[i]);
                }
            }
            else {
                var index = param_index_by_id(inds[1]);
                if (inds[3] == 'CH')
                    list = _obj_params[index].input_list;
                else if (inds[3] == 'MIX')
                    list = _obj_params[index].output_list;
                var i = parseInt(inds[2]);
                //console.log(inds[0]);
                //console.log(inds[2]);
                //console.log(index);
                if (i == 0 && inds[0] == "up" && index > 0) {
                    //console.log(_obj_params[index].Title + " меняем с " + _obj_params[index-1].Title);
                    //_obj_params.splice(index-1, 2, _obj_params[index], _obj_params[index-1]);
                    var index2 = index - 1;
                    if (inds[3] == 'CH' && _obj_params[index2].input_list.length == 0) {
                        for (var i = index - 2; i >= 0; i--) {
                            if (_obj_params[i].input_list.length > 0 && !_obj_params[i].input_list[_obj_params[i].input_list.length - 1].Locked) {
                                index2 = i;
                                break;
                            }
                        }
                    }
                    else if (inds[3] == 'MIX' && _obj_params[index2].output_list.length == 0) {
                        for (var i = index - 2; i >= 0; i--) {
                            if (_obj_params[i].output_list.length > 0 && !_obj_params[i].output_list[_obj_params[i].output_list.length - 1].Locked) {
                                index2 = i;
                                break;
                            }
                        }
                    }
                    var temp = _obj_params[index];
                    _obj_params[index] = _obj_params[index2];
                    _obj_params[index2] = temp;
                }
                else if (i == list.length - 1 && inds[0] == "down" && index < _obj_params.length - 1) {
                    //console.log(_obj_params[index+1].Title + " меняем с " + _obj_params[index].Title);
                    //_obj_params.splice(index, 2, _obj_params[index+1], _obj_params[index]);
                    var index2 = index + 1;
                    if (inds[3] == 'CH' && _obj_params[index2].input_list.length == 0) {
                        for (var i = index + 2; i < _obj_params[index2].length; i++) {
                            if (_obj_params[i].input_list.length > 0 && !_obj_params[i].input_list[0].Locked) {
                                index2 = i;
                                break;
                            }
                        }
                    }
                    else if (inds[3] == 'MIX' && _obj_params[index2].output_list.length == 0) {
                        for (var i = index + 2; i < _obj_params[index2].length; i++) {
                            if (_obj_params[i].output_list.length > 0 && !_obj_params[i].output_list[0].Locked) {
                                index2 = i;
                                break;
                            }
                        }
                    }
                    var temp = _obj_params[index];
                    _obj_params[index] = _obj_params[index2];
                    _obj_params[index2] = temp;
                }
                else if (i > 0 && inds[0] == "up") {
                    //console.log(list[i].Source + " меняем с " + list[i-1].Source);
                    list.splice(i - 1, 2, list[i], list[i - 1]);
                }
                else if (i < list.length - 1 && inds[0] == "down") {
                    //console.log(list[i].Source + " меняем с " + list[i+1].Source);
                    list.splice(i, 2, list[i + 1], list[i]);
                }
            }
            clear_input_channels();
            update_input_list();
            update_output_list();
            if (inds[3] == 'CH')
                noedit_mode(document.getElementById("input_list_table"));
            else if (inds[3] == 'MIX')
                noedit_mode(document.getElementById("output_list_table"));
        }
        catch (e) {
            console.log("ОШИБКА функции move_input_channel");
            console.log(e);
        }
    }
    function open_list_edit_form(row) {
        try {
            //console.log('SUKA:'+row.id);
            var inds = row.id.split('_');
            //console.log('SUKA:'+inds[0]+' '+inds[1]+' '+inds[2]+' '+inds[3]);
            var list;
            if (inds[1] == "Stage") {
                if (inds[3] == 'CH')
                    list = _stage_input_list;
                else if (inds[3] == 'MIX')
                    list = _stage_output_list;
            }
            else {
                var index = param_index_by_id(inds[1]);
                if (inds[3] == 'CH')
                    list = _obj_params[index].input_list;
                else if (inds[3] == 'MIX')
                    list = _obj_params[index].output_list;
            }

            //console.log(list);
            var eform = document.getElementById("list_edit_form");
            eform.elements.namedItem("ID").value = row.id;
            eform.elements.namedItem("Name").value = list[inds[2]].ChName;
            eform.elements.namedItem("Source").value = list[inds[2]].Source;
            eform.elements.namedItem("Channel").value = list[inds[2]].Channel;
            eform.elements.namedItem("Type").value = list[inds[2]].Type;
            eform.elements.namedItem("Comment").value = list[inds[2]].Comment;
            if (('Locked' in list[inds[2]]) && list[inds[2]].Locked) {
                eform.elements.namedItem("Locked").checked = true;
            }
            else {
                eform.elements.namedItem("Locked").checked = false;
            }
            var div = document.getElementById("list-edit-container");
            hide_show_element(div);
            //div.style.display = "block";;
            //console.log('OK');
        }
        catch (e) {
            console.log("ОШИБКА функции open_list_edit_form");
            console.log(e);
        }
    }
    function open_gear_list_edit_form(row) {
        try {
            //console.log('SUKA:'+row.id);
            var inds = row.id.split('_');
            //                id_Obj , index in gear_list, category_index, index in category
            //console.log('SUKA:'+inds[0]+' '+inds[1]+' '+inds[2]+' '+inds[3]);
            var list;
            if (inds[1] == "Stage") {
                list = _stage_gear_list;
            }
            else {
                var index = param_index_by_id(inds[1]);
                list = _obj_params[index].gear_list;
            }

            //console.log(list);
            var eform = document.getElementById("gear_list_edit_form");
            eform.elements.namedItem("ID").value = row.id;
            eform.elements.namedItem("Name").value = list[inds[2]].Name;
            eform.elements.namedItem("Category").value = list[inds[2]].Category;
            eform.elements.namedItem("Image").value = list[inds[2]].Image;
            eform.elements.namedItem("Weight").value = list[inds[2]].Weight;
            eform.elements.namedItem("Count").value = list[inds[2]].Count;
            eform.elements.namedItem("Power").value = list[inds[2]].Power_consumption;
            eform.elements.namedItem("Owner").value = list[inds[2]].Owner;
            eform.elements.namedItem("Comment").value = list[inds[2]].Comment;
            var div = document.getElementById("gear-list-edit-container");
            hide_show_element(div);
            //div.style.display = "block";;
            //console.log('OK');
        }
        catch (e) {
            console.log("ОШИБКА функции open_list_edit_form");
            console.log(e);
        }
    }

    function update_output_list() {
        update_input_list('output');
    }
    function gear_category_index(categories, name) {
        for (var i = 0; i < categories.length; i++) {
            if (categories[i].Name == name) {
                return i;
            }
        }
        return -1;
    }
    function update_gear_list() {
        try {
            var c, r, t;
            t = document.createElement('table');
            t.id = 'gear_list_table';
            t.classList.add("info-table");
            t.classList.add("noedit-mode");
            //var h = //t.createTHead();
            r = t.insertRow();//h.insertRow();
            var hr = document.createElement("TH");
            hr.innerHTML = "№";
            r.appendChild(hr);
            hr = document.createElement("TH");
            hr.innerHTML = "Pic";
            r.appendChild(hr);
            hr = document.createElement("TH");
            hr.innerHTML = "Name";
            r.appendChild(hr);
            hr = document.createElement("TH");
            hr.innerHTML = "Count";
            r.appendChild(hr);
            hr = document.createElement("TH");
            hr.innerHTML = "Weight";
            r.appendChild(hr);
            hr = document.createElement("TH");
            hr.innerHTML = "Power";
            r.appendChild(hr);
            hr = document.createElement("TH");
            hr.innerHTML = "Owner";
            r.appendChild(hr);
            hr = document.createElement("TH");
            hr.innerHTML = "Comment";
            r.appendChild(hr);
            hr = document.createElement("TH");
            hr.innerHTML = "";
            r.appendChild(hr);

            var count = 0;
            var categories = [];
            var weight = 0;
            var power = 0;
            for (var j = 0; j <= _obj_params.length; j++) {
                if (j == _obj_params.length) {
                    list = _stage_gear_list;
                }
                else {
                    list = _obj_params[j].gear_list;
                }
                if (list && list.length > 0) {
                    for (var i = 0; i < list.length; i++) {
                        count++;
                        var gear = list[i];
                        if (gear.Category) {
                            var index = gear_category_index(categories, gear.Category);
                            if (index > -1) {
                                var inserted = false;
                                for (var k = 0; k < categories[index].gears.length; k++) {
                                    var next_gear = categories[index].gears[k];
                                    if (next_gear.Name == gear.Name) //  && next_gear.obj.name == gear.obj.name
                                    {
                                        if (next_gear.is_container) {
                                            next_gear.children.push(gear);
                                            next_gear.Count += gear.Count;
                                            next_gear.Weight += gear.Weight;
                                            next_gear.Power_consumption += gear.Power_consumption;
                                        }
                                        else {
                                            var gear_container = new Object();
                                            gear_container.Name = next_gear.Name;
                                            gear_container.obj = next_gear.obj;
                                            gear_container.Count = next_gear.Count + gear.Count;
                                            gear_container.Count_round = 1;
                                            gear_container.Weight = next_gear.Weight + gear.Weight;
                                            gear_container.Weight_round = 0.1;
                                            gear_container.Power_consumption = next_gear.Power_consumption + gear.Power_consumption;
                                            gear_container.Image = next_gear.Image;
                                            gear_container.Owner = next_gear.Owner;
                                            gear_container.Comment = next_gear.Comment;
                                            gear_container.is_container = true;
                                            gear_container.children = [next_gear];
                                            gear_container.children.push(gear);
                                            categories[index].gears[k] = gear_container;
                                        }
                                        inserted = true;
                                    }
                                }
                                if (!inserted)
                                    categories[index].gears.push(gear);
                            }
                            else {
                                var category = new Object();
                                category.Name = gear.Category;
                                category.gears = [gear];
                                category.Index = _gear_categories.indexOf(category.Name);
                                categories.push(category);
                                gear_sort_categories(categories);
                            }
                            if (gear.Owner == "Rent")
                                weight += parseFloat(gear.Weight);
                            power += gear.Power_consumption;
                        }
                        else {
                            alert('Наденька забыла ввести категорию у ' + gear.Name + ' ' + gear.Comment);
                        }
                    }
                }
            }
            var child_count = 0;
            for (var i = 0; i < categories.length; i++) {
                var category = categories[i];
                var r = t.insertRow();
                r.id = 'id_categry_' + i;
                r.className = "odd_row";
                var SelectObjClickHandler = function (row) { return function () { hide_show_gear_category(row); }; };
                r.onclick = SelectObjClickHandler(r);
                c = r.insertCell();
                c.colSpan = 8;
                c.innerHTML = category.Name;
                /*c = r.insertCell();
                c.innerHTML = "Name";
                c = r.insertCell();
                c.innerHTML = "Count";
                c = r.insertCell();
                c.innerHTML = "Weight";
                c = r.insertCell();
                c.innerHTML = "Power";
                c = r.insertCell();
                c.innerHTML = "Owner";
                c = r.insertCell();
                c.innerHTML = "Comment";*/
                c = r.insertCell();
                c.innerHTML = "";
                for (var j = 0; j < category.gears.length; j++) {
                    var gear = category.gears[j];
                    if (!gear.is_container) {
                        r = t.insertRow();
                        var index;
                        if (gear.Obj_id == "Stage") {
                            index = _stage_gear_list.indexOf(gear);
                        }
                        else {
                            //console.log(gear.Obj_id);
                            //console.log(param_index_by_id(gear.Obj_id));
                            //console.log(_obj_params[param_index_by_id(gear.Obj_id)]);
                            index = _obj_params[param_index_by_id(gear.Obj_id)].gear_list.indexOf(gear);
                        }
                        r.id = 'id_' + gear.Obj_id + '_' + index + '_' + i + '_' + j;
                        if (gear.obj == _selected_obj && _selected_obj != null) {
                            r.classList.add('selected_row');
                            r.classList.add('input_' + gear.Obj_id);
                        }
                        else
                            r.classList.add('input_' + gear.Obj_id);
                        //r.classList.add('hidden');
                        var oid = gear.Obj_id;
                        var SelectObjClickHandler = function (row) { return function () { select_obj_row(row); }; };
                        c = r.insertCell();
                        c.innerHTML = t.rows.length - i - 2 - child_count;
                        c.onclick = SelectObjClickHandler(r);
                        c = r.insertCell();
                        c.onclick = SelectObjClickHandler(r);
                        if (gear.Image) {
                            c.classList.add("wopadding");
                            c.innerHTML = "<img src='../gear_images/" + gear.Image + "'/>";
                        }

                        c = r.insertCell();
                        c.onclick = SelectObjClickHandler(r);
                        c.innerHTML = gear.Name;

                        c = r.insertCell();
                        c.onclick = SelectObjClickHandler(r);
                        c.innerHTML = Math.ceil(gear.Count / gear.Count_round) * gear.Count_round;

                        c = r.insertCell();
                        c.onclick = SelectObjClickHandler(r);
                        c.innerHTML = (Math.ceil(gear.Weight / gear.Weight_round) * gear.Weight_round).toFixed(2);

                        c = r.insertCell();
                        c.onclick = SelectObjClickHandler(r);
                        c.innerHTML = gear.Power_consumption;

                        c = r.insertCell();
                        c.onclick = SelectObjClickHandler(r);
                        c.innerHTML = gear.Owner;

                        c = r.insertCell();
                        c.onclick = SelectObjClickHandler(r);
                        c.title = gear.Comment;
                        if (gear.Comment.length > 20) {
                            c.innerHTML = gear.Comment.substr(0, 20) + '...';
                        }
                        else {
                            c.innerHTML = gear.Comment;
                        }

                        c = r.insertCell();
                        var b = document.createElement("BUTTON");
                        b.innerHTML = '<img src="../interface/8_1.png" />';
                        b.className = "edit-mode-button";
                        var OpenListEditClickHandler = function (but) { return function () { open_gear_list_edit_form(but.parentElement.parentElement); }; };
                        b.onclick = OpenListEditClickHandler(b);
                        c.appendChild(b);
                    }
                    else {
                        r = t.insertRow();
                        r.id = 'id_gear_' + gear.children.length + '_' + gear.Obj_id;
                        //r.classList.add('hidden');
                        var SelectContClickHandler = function (row) { return function () { hide_show_gear_container(row); }; };
                        r.onclick = SelectContClickHandler(r);
                        //console.log(gear);
                        //console.log(r.id);
                        c = r.insertCell();
                        c.innerHTML = t.rows.length - i - 2 - child_count;

                        c = r.insertCell();
                        c.onclick = SelectObjClickHandler(r);
                        if (gear.Image) {
                            c.classList.add("wopadding");
                            c.innerHTML = "<img src='../gear_images/" + gear.Image + "' width='100px'/>";
                        }
                        c = r.insertCell();
                        c.innerHTML = gear.Name;

                        c = r.insertCell();
                        c.innerHTML = Math.ceil(gear.Count / gear.Count_round) * gear.Count_round;

                        c = r.insertCell();
                        c.innerHTML = (Math.ceil(gear.Weight / gear.Weight_round) * gear.Weight_round).toFixed(2);

                        c = r.insertCell();
                        c.innerHTML = "";

                        c = r.insertCell();
                        c.innerHTML = gear.Owner;
                        c = r.insertCell();

                        c.title = gear.Comment;
                        if (gear.Comment.length > 20) {
                            c.innerHTML = gear.Comment.substr(0, 20) + '...';
                        }
                        else {
                            c.innerHTML = gear.Comment;
                        }

                        c = r.insertCell();
                        child_count += gear.children.length;
                        for (var k = 0; k < gear.children.length; k++) {
                            //console.log("gear.children[k]:");
                            //console.log(gear.children[k]);
                            r = t.insertRow();
                            var index;
                            if (gear.children[k].Obj_id == "Stage") {
                                index = _stage_gear_list.indexOf(gear.children[k]);
                            }
                            else {
                                //console.log(Obj_id);
                                //console.log("TUT");
                                //console.log("TUT");
                                index = _obj_params[param_index_by_id(gear.children[k].Obj_id)].gear_list.indexOf(gear.children[k]);
                            }
                            r.id = 'id_' + gear.children[k].Obj_id + '_' + index + '_' + i + '_' + j;
                            if (gear.children[k].obj == _selected_obj && _selected_obj != null) {
                                r.classList.add('selected_row');
                                r.classList.add('input_' + gear.children[k].Obj_id);
                            }
                            else
                                r.classList.add('input_' + gear.children[k].Obj_id);
                            r.classList.add('hidden');
                            var oid = gear.children[k].Obj_id;
                            var SelectObjClickHandler = function (row) { return function () { select_obj_row(row); }; };

                            c = r.insertCell();
                            c.innerHTML = '';
                            c.onclick = SelectObjClickHandler(r);

                            c = r.insertCell();
                            c.onclick = SelectObjClickHandler(r);
                            if (gear.children[k].Image) {
                                c.classList.add("wopadding");
                                c.innerHTML = "<img src='../gear_images/" + gear.children[k].Image + "' width='100px'/>";
                            }

                            c = r.insertCell();
                            c.onclick = SelectObjClickHandler(r);
                            c.innerHTML = gear.children[k].Name;

                            c = r.insertCell();
                            c.onclick = SelectObjClickHandler(r);
                            c.innerHTML = Math.ceil(gear.children[k].Count / gear.children[k].Count_round) * gear.children[k].Count_round;

                            c = r.insertCell();
                            c.onclick = SelectObjClickHandler(r);
                            c.innerHTML = (Math.ceil(gear.children[k].Weight / gear.children[k].Weight_round) * gear.children[k].Weight_round).toFixed(2);

                            c = r.insertCell();
                            c.onclick = SelectObjClickHandler(r);
                            c.innerHTML = gear.children[k].Power_consumption;

                            c = r.insertCell();
                            c.onclick = SelectObjClickHandler(r);
                            c.innerHTML = gear.children[k].Owner;

                            c = r.insertCell();
                            c.onclick = SelectObjClickHandler(r);
                            c.title = gear.children[k].Comment;

                            if (gear.Comment.length > 20) {
                                c.innerHTML = gear.children[k].Comment.substr(0, 20) + '...';
                            }
                            else {
                                c.innerHTML = gear.children[k].Comment;
                            }

                            c = r.insertCell();
                            var b = document.createElement("BUTTON");
                            b.innerHTML = '<img src="../interface/8_1.png" />';
                            b.className = "edit-mode-button";
                            var OpenListEditClickHandler = function (but) { return function () { open_gear_list_edit_form(but.parentElement.parentElement); }; };
                            b.onclick = OpenListEditClickHandler(b);
                            c.appendChild(b);
                        }
                    }
                }
            }

            var listcont = document.getElementById("gear-list-container");
            var listheader = document.getElementById("gear-list-header");

            weight = (Math.ceil(weight / 0.1) * 0.1).toFixed(1);
            power = (power / 1000).toFixed(1);
            t.rows[0].cells[4].innerHTML = "Weight (" + weight + ")";
            t.rows[0].cells[5].innerHTML = "Power (" + power + ")";
            var header = document.createElement('h2');
            header.className = "gear-list-header";
            header.innerHTML = 'Gear List (' + (t.rows.length - categories.length - 1) + ' it. w.: ' + weight + ' kg ' + power + ' kW)';
            listheader.innerHTML = 'Gear List (' + (t.rows.length - categories.length - 1) + ')';
            /*header.addEventListener("click", function (e) {
                hide_show_gear_list();
            });*/
            listcont.innerHTML = '';

            var b = document.createElement("BUTTON");
            b.innerHTML = '<img src="../interface/8_1.png" />';
            b.className = "edit-mode-button";
            var OpenListEditClickHandler = function (but) { return function () { noedit_mode(document.getElementById("gear_list_table")); }; };
            b.onclick = OpenListEditClickHandler(b);
            listcont.appendChild(b);
            listcont.appendChild(header);
            if (categories.length > 0 || _stage_gear_list.length > 0) {
                listcont.appendChild(t);
            }
            //console.log('UPDATING FINISHED');
        }
        catch (e) {
            console.log("ОШИБКА функции update_gear_list");
            console.log(e);
        }
    }
    function hide_show_gear_container(row) {
        try {
            var length = parseInt(row.id.split("_")[2]);
            var gear_list_table = document.getElementById("gear_list_table");
            var start_index = 1;
            for (var i = 0; i < gear_list_table.rows.length; i++) {
                if (row == gear_list_table.rows[i]) {
                    start_index = i + 1;
                    break;
                }
            }
            var is_hidden = gear_list_table.rows[start_index].classList.contains("hidden");
            for (var i = start_index; i < start_index + length; i++) {
                var r = gear_list_table.rows[i];
                if (is_hidden)
                    r.classList.remove("hidden");
                else
                    r.classList.add("hidden");
            }
        }
        catch (e) {
            console.log("ОШИБКА функции hide_show_gear_container");
            console.log(e);
        }
    }
    function hide_show_gear_category(row) {
        try {
            var cat_id = parseInt(row.id.split("_")[2]);
            //console.log('cat_id:'+cat_id);
            var row_next = document.getElementById("id_categry_" + (cat_id + 1));
            //console.log('row_next:');
            //console.log(row_next);
            var gear_list_table = document.getElementById("gear_list_table");
            var start_index = 1;
            var end_index = gear_list_table.rows.length;
            for (var i = 0; i < gear_list_table.rows.length; i++) {
                if (row == gear_list_table.rows[i])
                    start_index = i + 1;
                if (row_next == gear_list_table.rows[i]) {
                    end_index = i;
                    break;
                }
            }

            //console.log('start_index:'+start_index);
            //console.log('end_index:'+end_index);
            var is_hidden = gear_list_table.rows[start_index].classList.contains("hidden");
            //console.log('is_hidden:'+is_hidden);
            var start_hidden = 1000;
            var end_hidden = -1;
            for (var i = start_index; i < end_index; i++) {
                var r = gear_list_table.rows[i];
                if (r.id.includes("id_gear_")) {
                    var length = parseInt(r.id.split("_")[2]);
                    start_hidden = i + 1;
                    end_hidden = i + length;
                }
                if (r == row_next)
                    break;
                if (is_hidden && !((i >= start_hidden) && (i <= end_hidden)))
                    r.classList.remove("hidden");
                else
                    r.classList.add("hidden");
            }
        }
        catch (e) {
            console.log("ОШИБКА функции hide_show_gear_category");
            console.log(e);
        }
    }
    function hide_show_gear_list() {
        try {
            var div = document.getElementById("gear-list-table-container");
            hide_show_element(div);
        }
        catch (e) {
            console.log("ОШИБКА функции hide_show_gear_list");
            console.log(e);
        }
    }
    function hide_show_element(element) {
        try {
            if (element) {
                if (element.classList.contains("hidden")) {
                    element.classList.remove("hidden");
                }
                else {
                    element.classList.add("hidden");
                }
            }
        }
        catch (e) {
            console.log("ОШИБКА функции hide_show_element");
            console.log(e);
        }
    }
    function hide_anchors() {

        show_anchors();

    }
    function show_anchors() {

        for (var i = 0; i < _obj_params.length; i++) {
            var anchor_elem = document.getElementById("anchor" + _obj_params[i].id);
            if (_show_anchors)
                anchor_elem.style.visibility = "visible";
            else
                anchor_elem.style.visibility = "hidden";
        }
    }
    function change_anchors(e) {
        if (_show_anchors) {
            _show_anchors = false;
            hide_anchors();
        }
        else {
            _show_anchors = true;
            show_anchors();
        }
    }

    function change_grid(e) {
        if (_show_grid) {
            hide_grid();
        }
        else {
            show_grid();
        }
    }

    function show_grid() {
        _show_grid = true;
        var obj = m_scenes.get_object_by_name("Plane");
        m_scenes.show_object(obj);
    }
    function hide_grid() {
        _show_grid = false;
        var obj = m_scenes.get_object_by_name("Plane");
        m_scenes.hide_object(obj);
    }

    function add_params(obj) {
        try {
            var oid = param_index_by_id(obj.render.data_id);
            //console.log(_obj_params);
            if (oid >= 0) {
                console.log(_obj_params);
            }
            else {
                var oname = obj.name;
                var input, output, gear;
                var nobj = new Object();
                nobj.id = obj.render.data_id;
                nobj.obj = obj;
                nobj.obj = obj;
                nobj.name = oname;
                nobj.Comment = '';
                nobj.input_list = [];
                nobj.output_list = [];
                nobj.gear_list = [];
                nobj.parent = '';
                nobj.Title = oname;
                nobj.selected = false;
                _obj_params.push(nobj);
                if (!_uploading) {
                    alert('Ошибка! Пресет не загружен. Счетчик ожидаемых к загрузке обьектов: ' + _count);
                    console.log(_preset);
                    console.log(_obj_params);
                }
                else {
                    //console.log('_count:'+_count+'. Обновляем ' +nobj.Title+' id:' + nobj.id);
                    update_params_from_preset(_preset, '', nobj);

                    //console.log(_preset);
                    //console.log(_obj_params);
                }
                //sort_objects_by_channel(_obj_params.length-2);
            }
        }
        catch (e) {
            console.log("ОШИБКА функции add_params");
            console.log(e);
        }
    }
    function update_params_from_preset(preset, parent, obj) {
        try {
            if (!parent) parent = '';
            if (!preset.name)
                alert("Someone forget 'name' in preset of " + preset.model_src + " " + preset.Title);
            //console.log(preset.name);
            //console.log(obj.name);
            // Здесь анонимный добавленный 3D обьект находит своё место в дереве пресета
            if (!preset.id && preset.name == obj.name) {
                preset.id = obj.id;
                obj.Title = preset.Title;
                obj.Comment = preset.Comment;
                obj.model_src = preset.model_src;
                obj.X = preset.X;
                obj.Y = preset.Y;
                if (preset.Z === undefined)
                    obj.Z = preset.Z = 0;
                else
                    obj.Z = preset.Z;
                obj.Is_Structure = (preset.Is_Structure == true || preset.is_structure == true);
                obj.Height = preset.Height;
                if (obj.Height === undefined)
                    obj.Height = 0;
                obj.turn = preset.turn;
                obj.Locked = preset.Locked;
                obj.Title_to_Source = (preset.Title_to_Source == true);
                obj.children = [];
                for (var i = 0; i < preset.input_list.length; i++) {
                    var input = new Object();
                    input.Source = preset.input_list[i].Source;
                    input.Type = preset.input_list[i].Type;
                    input.ChName = preset.input_list[i].ChName;
                    input.Comment = preset.input_list[i].Comment;
                    input.Phantom_power = preset.input_list[i].Phantom_power;
                    input.Channel = preset.input_list[i].Channel;
                    input.Locked = (preset.input_list[i].Locked == true);
                    input.Obj_id = obj.id;
                    input.obj = obj.obj;
                    obj.input_list.push(input);
                }
                for (var i = 0; i < preset.output_list.length; i++) {
                    var output = new Object();
                    output.Source = preset.output_list[i].Source;
                    output.Type = preset.output_list[i].Type;
                    output.ChName = preset.output_list[i].ChName;
                    output.Comment = preset.output_list[i].Comment;
                    output.Channel = preset.output_list[i].Channel;
                    output.Locked = (preset.output_list[i].Locked == true);
                    output.Obj_id = obj.id;
                    output.obj = obj.obj;
                    obj.output_list.push(output);
                }
                for (var i = 0; i < preset.gear_list.length; i++) {
                    var gear = new Object();
                    gear.Name = preset.gear_list[i].Name;
                    gear.Category = preset.gear_list[i].Category;
                    gear.Image = preset.gear_list[i].Image;
                    gear.Comment = preset.gear_list[i].Comment;
                    gear.Weight = preset.gear_list[i].Weight;
                    if (preset.gear_list[i].Power_consumption)
                        gear.Power_consumption = parseInt(preset.gear_list[i].Power_consumption);
                    else
                        gear.Power_consumption = 0;
                    if (preset.gear_list[i].Weight_round)
                        gear.Weight_round = preset.gear_list[i].Weight_round;
                    else
                        gear.Weight_round = 0.1;
                    if (preset.gear_list[i].Count_round)
                        gear.Count_round = preset.gear_list[i].Count_round;
                    else
                        gear.Count_round = 1;
                    gear.Count = preset.gear_list[i].Count;
                    gear.Owner = preset.gear_list[i].Owner;
                    //gear.Parameters = preset.gear_list[i].Parameters;
                    gear.Obj_id = obj.id;
                    gear.obj = obj.obj;
                    obj.gear_list.push(gear);
                }
                obj.parent = parent;


                //console.log(obj.id + 'UPDATED');

                _count--;
                if (_count <= 0) {
                    _uploading = false;
                    _restore_stage = false;
                    check_parent_relations();
                    console.log("_last_index:" + _last_index);
                    set_children();
                    //set_positions();
                    console.log(_preset);
                    set_objects_to_positions(_last_index);
                    sort_objects_by_channel(_last_index);
                    clear_input_channels();
                    update_input_list();
                    update_output_list();
                    update_gear_list();
                    _last_index = _obj_params.length;
                    _preset = null;
                    cursor_to_default();
                }
            }
            else if (preset.children && preset.children.length > 0) {
                for (var i = 0; i < preset.children.length; i++) {
                    var c = _count;
                    update_params_from_preset(preset.children[i], preset.id, obj);
                    if (c != _count)
                        break;
                }
            }
        }
        catch (e) {
            console.log("ОШИБКА функции update_params_from_preset");
            console.log(e);
        }
    }
    function check_parent_relations(preset) {
        try {
            if (!preset)
                preset = _preset;
            if (preset.children && preset.children.length > 0) {
                for (var i = 0; i < preset.children.length; i++) {
                    var index = param_index_by_id(preset.children[i].id);
                    if (_obj_params[index].parent != preset.id)
                        _obj_params[index].parent = preset.id;
                    check_parent_relations(preset.children[i]);
                }
            }
        }
        catch (e) {
            console.log("ОШИБКА функции check_parent_relations");
            console.log(e);
        }
    }
    function set_positions_relative(obj) {
        try {
            if (obj.children.length > 0) {
                for (var i = 0; i < obj.children.length; i++) {
                    obj.children[i].Xabs = obj.children[i].X;
                    obj.children[i].Yabs = obj.children[i].Y;
                    obj.children[i].Zabs = obj.children[i].Z;
                    set_positions_relative(obj.children[i]);
                    obj.children[i].X -= obj.X;
                    obj.children[i].Y -= obj.Y;
                    obj.children[i].Z -= obj.Z;
                }
            }
        }
        catch (e) {
            console.log("ОШИБКА функции set_positions_relative");
            console.log(e);
        }
    }
    function set_positions_absolute(obj) {
        try {
            if (obj.children.length > 0) {
                for (var i = 0; i < obj.children.length; i++) {
                    if (obj.children[i].Xabs === undefined)
                        return;
                    else {
                        obj.children[i].X = obj.children[i].Xabs;
                        obj.children[i].Y = obj.children[i].Yabs;
                        obj.children[i].Z = obj.children[i].Zabs;
                        delete obj.children[i].Xabs;
                        delete obj.children[i].Yabs;
                        delete obj.children[i].Zabs;
                        //_obj_params[index].turn += preset.turn;
                        set_positions_absolute(obj.children[i]);
                    }
                }
            }
        }
        catch (e) {
            console.log("ОШИБКА функции set_positions_absolute");
            console.log(e);
        }
    }
    function set_objects_to_positions(fromindex) {
        try {
            if (!fromindex) {
                fromindex = 0;
            }
            //console.log("fromindex:"+fromindex);
            for (var i = fromindex; i < _obj_params.length; i++) {
                var obj_pos = new Float32Array(3);
                if (!_obj_params[i].parent && !_restore_stage) {
                    run(_obj_params[i]);
                }
                obj_pos[0] = _obj_params[i].X;
                obj_pos[1] = _obj_params[i].Y;
                obj_pos[2] = _obj_params[i].Z;
                var obj_parent = m_obj.get_parent(_obj_params[i].obj);
                if (obj_parent && m_obj.is_armature(obj_parent))
                    m_trans.set_translation_v(obj_parent, obj_pos);
                else
                    m_trans.set_translation_v(_obj_params[i].obj, obj_pos);

                if (_obj_params[i].turn != 0) {
                    rotate_object(_obj_params[i].obj, _obj_params[i].turn * Math.PI / 180);
                }
            }
        }
        catch (e) {
            console.log("ОШИБКА функции set_objects_to_positions");
            console.log(e);
        }
    }

    function run(obj) {
        try {
            var obj_pos;
            var mobj_pos;
            for (var i = 0; i < _obj_params.length; i++) {
                mobj_pos = m_trans.get_translation(_obj_params[i].obj, _vec3_tmp);
                obj_pos = m_trans.get_translation(obj.obj, _vec3_tmp2);
                /*console.log("ТАНЦУЕМ");
                console.log(_obj_params[i].id + ':' + obj.id);
                console.log(_obj_params[i].name + ':' + obj.name);
                console.log(mobj_pos);
                console.log(obj_pos);
                console.log(obj.X + ':' + obj.Y);*/
                if (_obj_params[i].id != obj.id && _obj_params[i].name == obj.name && mobj_pos[0] == obj.X + obj_pos[0] && mobj_pos[1] == obj.Y + obj_pos[1]) {
                    var rand = Math.random();
                    var oldX = obj.X;
                    var oldY = obj.Y
                    obj.X = WALL_X_MIN + (WALL_X_MAX - WALL_X_MIN) * rand;
                    rand = Math.random();
                    obj.Y = WALL_Y_MIN + (WALL_Y_MAX - WALL_Y_MIN) * rand;
                    console.log("rand:" + rand + "; obj.X:" + obj.X + "; obj.Y:" + obj.Y);
                    if (obj.X > WALL_X_MAX)
                        obj.X -= obj.X - WALL_X_MAX;
                    else if (obj.X < WALL_X_MIN)
                        obj.X += WALL_X_MIN - obj.X;

                    if (obj.Y > WALL_Y_MAX)
                        obj.Y -= obj.Y - WALL_Y_MAX;
                    else if (obj.Y < WALL_Y_MIN)
                        obj.Y += WALL_Y_MIN - obj.Y;
                    var deltaX = obj.X - oldX;
                    var deltaY = obj.Y - oldY;
                    children_change_pos(obj, deltaX, deltaY);
                    //limit_object_position(obj);
                    run(obj);
                }
            }
        }
        catch (e) {
            console.log("ОШИБКА функции run");
            console.log(e);
        }
    }

    function children_change_pos(obj, deltaX, deltaY) {
        try {
            if (obj.children.length > 0) {
                for (var i = 0; i < obj.children.length; i++) {
                    obj.children[i].X += deltaX;
                    obj.children[i].Y += deltaY;
                    children_change_pos(obj.children[i], deltaX, deltaY);
                }
            }
        }
        catch (e) {
            console.log("ОШИБКА функции children_change_pos");
            console.log(e);
        }
    }

    function logic_func(s) {
        return s[1];
    }

    function trigger_outline(obj, id, pulse) {
        try {
            if (pulse == 1) {
                // change outline color according to the
                // first manifold sensor (collision sensor) status
                var has_collision = m_ctl.get_sensor_value(obj, id, 0);
                if (has_collision) {
                    m_scenes.set_outline_color(OUTLINE_COLOR_ERROR);

                    var payload = m_ctl.get_sensor_payload(obj, id, 0);
                    var oid = payload.coll_obj.render.data_id;
                    var index = param_index_by_id(oid);
                    var ob_id = param_index_by_id(obj.render.data_id);
                    if (_obj_params[index].Is_Structure) {
                        /*var obj_pos;
                        var obj_parent = m_obj.get_parent(obj);
                        if (obj_parent && m_obj.is_armature(obj_parent))
                            // get translation from the parent (armature) of the animated object
                            obj_pos = m_trans.get_translation(obj_parent);
                        else
                            obj_pos = m_trans.get_translation(obj);
                        //console.log(obj_pos);
                        //var struct_pos = m_trans.get_translation(payload.coll_obj, _vec3_tmp);

                        /*
                        if (!_obj_params[ob_id].Z)
                            _obj_params[ob_id].Z = 0;
                        if (!_obj_params[index].Z)
                            _obj_params[index].Z = 0;*/

                        //obj_pos[2] = _obj_params[index].Z + _obj_params[index].Height;
                        //console.log(obj_pos);
                        //var obj_parent = m_obj.get_parent(obj);
                        /*if (obj_parent && m_obj.is_armature(obj_parent))
                            m_trans.set_translation_v(obj_parent, obj_pos);
                        else
                            m_trans.set_translation_v(obj, obj_pos); //*/


                        //console.log(index);
                        //console.log(payload.coll_obj);
                        //console.log(ob_id);
                        //console.log(obj);
                        _obj_params[ob_id].Z = _obj_params[index].Z + _obj_params[index].Height;
                        _obj_params[ob_id].is_jump = true;
                        if (_obj_params[ob_id].children.length > 0) {
                            // MOVE SELECTED CHILDREN
                            for (var i = 0; i < _obj_params.length; i++) {
                                if (_obj_params[i].selected && _obj_params[i].id != oid) {
                                    /*
                                    var obj_pos2;
                                    obj_parent = m_obj.get_parent(_obj_params[ob_id].children[i].obj);
                                    if (obj_parent && m_obj.is_armature(obj_parent))
                                        // get translation from the parent (armature) of the animated object
                                        obj_pos2 = m_trans.get_translation(obj_parent);
                                    else
                                        obj_pos2 = m_trans.get_translation(_obj_params[ob_id].children[i].obj);
                                    _obj_params[ob_id].children[i].Z = _obj_params[ob_id].Z;
                                    obj_pos2[2] = _obj_params[ob_id].Z;
                                    if (obj_parent && m_obj.is_armature(obj_parent))
                                        m_trans.set_translation_v(obj_parent, obj_pos2);
                                    else
                                        m_trans.set_translation_v(obj, obj_pos2);//*/
                                    _obj_params[i].Z = _obj_params[ob_id].Z + _obj_params[ob_id].Height;
                                    _obj_params[i].is_jump = true;
                                }
                            }
                        }
                    }
                    else if (!_obj_params[ob_id].Is_Structure) {
                        _obj_params[ob_id].Z = 0;
                        _obj_params[ob_id].is_jump = false;
                        if (_obj_params[ob_id].children.length > 0) {
                            for (var i = 0; i < _obj_params.length; i++) {
                                if (_obj_params[i].selected && _obj_params[i].id != oid) {
                                    _obj_params[i].Z = 0;
                                    _obj_params[i].is_jump = false;
                                }
                            }
                        }
                    }
                }
                else {
                    var ob_id = param_index_by_id(obj.render.data_id);
                    _obj_params[ob_id].Z = 0;
                    _obj_params[ob_id].is_jump = false;
                    if (_obj_params[ob_id].children.length > 0) {
                        for (var i = 0; i < _obj_params.length; i++) {
                            if (_obj_params[i].selected && _obj_params[i].id != oid) {
                                _obj_params[i].Z = 0;
                                _obj_params[i].is_jump = false;
                            }
                        }
                    }
                    m_scenes.set_outline_color(OUTLINE_COLOR_VALID);
                    //console.log("Slezli");
                }
            }
        }
        catch (e) {
            console.log("ОШИБКА функции trigger_outline");
            console.log(e);
        }
    }

    function rotate_object(obj, angle) {
        try {

            var anglegrad = parseInt(angle / Math.PI * 180);
            //console.log("Поворот на ");
            //console.log(anglegrad);
            var obj_parent = m_obj.get_parent(obj);
            if (obj_parent && m_obj.is_armature(obj_parent)) {
                // rotate the parent (armature) of the animated object
                var obj_quat = m_trans.get_rotation(obj_parent, _vec4_tmp);
                m_quat.rotateZ(obj_quat, angle, obj_quat);
                m_trans.set_rotation_v(obj_parent, obj_quat);
            } else {
                var obj_quat = m_trans.get_rotation(obj, _vec4_tmp);
                m_quat.rotateZ(obj_quat, angle, obj_quat);
                m_trans.set_rotation_v(obj, obj_quat);
            }

            limit_object_position(obj);
        }
        catch (e) {
            console.log("ОШИБКА функции rotate_object");
            console.log(e);
        }
    }

    function main_canvas_down(e) {
        try {

            _drag_mode = true;

            if (e.preventDefault)
                e.preventDefault();

            var x = m_mouse.get_coords_x(e);
            var y = m_mouse.get_coords_y(e);

            var obj = m_scenes.pick_object(x, y);

            // handling outline effect
            select_obj(obj)

            // calculate delta in viewport coordinates
            if (_selected_obj) {
                var cam = m_scenes.get_active_camera();

                var obj_parent = m_obj.get_parent(_selected_obj);
                if (obj_parent && m_obj.is_armature(obj_parent))
                    // get translation from the parent (armature) of the animated object
                    m_trans.get_translation(obj_parent, _vec3_tmp);
                else
                    m_trans.get_translation(_selected_obj, _vec3_tmp);
                m_cam.project_point(cam, _vec3_tmp, _obj_delta_xy);

                _obj_delta_xy[0] = x - _obj_delta_xy[0];
                _obj_delta_xy[1] = y - _obj_delta_xy[1];
            }
        }
        catch (e) {
            console.log("ОШИБКА функции main_canvas_down");
            console.log(e);
        }
    }
    function select_obj_id(id) {
        //console.log(id);
        var index = param_index_by_id(id);
        //console.log(index)
        if (index >= 0) {
            select_obj(_obj_params[index].obj);
        }
    }
    function select_obj_row(row) {
        try {
            var classname = row.classList[0];
            var id = classname.substr(6);
            select_obj_id(id);
        }
        catch (e) {
            console.log("ОШИБКА функции select_obj_row");
            console.log(e);
        }
    }
    function select_obj(obj) {
        try {
            if (_selected_obj != obj) {
                if (_selected_obj)
                    m_scenes.clear_outline_anim(_selected_obj);
                if (obj)
                    m_scenes.apply_outline_anim(obj, 1, 1, 0);
                _selected_obj = obj;
                //console.log(_selected_obj);
                if (_selected_obj) {
                    //console.log("_selected_obj");
                    var oname = _selected_obj.name;
                    var oid = _selected_obj.render.data_id;
                    var index = param_index_by_id(oid);
                    var pform = document.getElementById("properties_form");
                    pform.elements.namedItem("ID").value = oid;
                    pform.elements.namedItem("Name").value = oname;
                    pform.elements.namedItem("Title").value = _obj_params[index].Title;
                    pform.elements.namedItem("Comment").value = _obj_params[index].Comment;
                    pform.elements.namedItem("X").value = _obj_params[index].X.toFixed(1);
                    pform.elements.namedItem("Y").value = _obj_params[index].Y.toFixed(1);
                    pform.elements.namedItem("turn").value = _obj_params[index].turn;
                    pform.elements.namedItem("titletosource").checked = _obj_params[index].Title_to_Source;
                    pform.elements.namedItem("lock").checked = _obj_params[index].Locked;
                    pform.elements.namedItem("lockall").checked = false;

                    var name = document.getElementById("savepreset_form").elements.namedItem("name");
                    name.value = oname;

                    change_parent_select(oid);
                    select_all_rows(oid);
                    deselect_all();
                    _obj_params[index].selected = true;
                    select_group();
                } else {
                    //console.log("!_selected_obj");
                    var pform = document.getElementById("properties_form");
                    pform.elements.namedItem("ID").value = '';
                    pform.elements.namedItem("Name").value = '';
                    pform.elements.namedItem("Title").value = '';
                    pform.elements.namedItem("Comment").value = '';
                    pform.elements.namedItem("X").value = '';
                    pform.elements.namedItem("Y").value = '';
                    pform.elements.namedItem("turn").value = '';
                    pform.elements.namedItem("titletosource").checked = false;
                    pform.elements.namedItem("lock").checked = false;
                    pform.elements.namedItem("lockall").checked = false;
                    var div = document.getElementById("properties-form-container");
                    //div.style.display = 'none';
                    //hide_show_element(div);
                    change_parent_select();
                    deselect_all_rows();
                    deselect_all();
                }
            }
        }
        catch (e) {
            console.log("ОШИБКА функции select_obj");
            console.log(e);
        }
    }
    // Changing propertis form <select> for select parent object
    function change_parent_select(id) {
        try {
            var pform = document.getElementById("properties_form");
            var select = pform.elements.namedItem("Parent");
            //console.log(select);
            var option, parent;
            if (id)
                parent = _obj_params[param_index_by_id(id)].parent;
            else
                parent = '';
            //console.log('parent:'+parent);
            for (var i = select.options.length - 1; i >= 0; i--) {
                select.remove(i);
            }
            if (!id)
                return;
            option = new Option('Orphan (no Parent)', '', false, false);
            select.add(option);
            for (var i = 0; i < _obj_params.length; i++) {
                if (_obj_params[i].id != id) {
                    if (_obj_params[i].id == parent)
                        option = new Option(_obj_params[i].Title, _obj_params[i].id, true, true);
                    else
                        option = new Option(_obj_params[i].Title, _obj_params[i].id, false, false);
                    select.add(option);
                }
            }
            if (!parent)
                select.selectedIndex = -1;
        }
        catch (e) {
            console.log("ОШИБКА функции change_parent_select");
            console.log(e);
        }
    }
    function restore_rider_select() {
        try {
            var pform = document.getElementById("restore_form");
            var select = pform.elements.namedItem("rider");
            var option;
            for (var i = select.options.length - 1; i >= 0; i--) {
                select.remove(i);
            }
            var request = new XMLHttpRequest();
            request.open("POST", "../rider.php", false);
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            request.send(_CSRF + "=" + _CSRFToken + "&action=getriders");
            var resp = JSON.parse(request.responseText);
            if (resp.status == "OK" && resp.riders && resp.riders.length > 0) {
                for (var i = 0; i < resp.riders.length; i++) {
                    option = new Option(resp.riders[i].name + "; updated: " + resp.riders[i].change_date, resp.riders[i].id, false, false);
                    select.add(option);
                }
                console.log(resp);
            }
            else
            {
                console.log("ОШИБКА функции restore_rider_select: ");
                console.log(request);
                console.log(resp);
            }
        }
        catch (e) {
            console.log("ОШИБКА функции restore_rider_select");
            console.log(e);
        }
    }
    function savepreset_as_select_update() {
        try {
            var pform = document.getElementById("savepreset_form");
            var select = pform.elements.namedItem("id");
            var option;
            for (var i = select.options.length - 1; i > 0; i--) {
                select.remove(i);
            }
            var request = new XMLHttpRequest();
            request.open("POST", "../preset.php", false);
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            request.send(_CSRF + "=" + _CSRFToken + "&action=getall");
            var resp = JSON.parse(request.responseText);
            if (resp.status == "OK" && resp.presets && resp.presets.length > 0) {
                _presets = resp.presets;
                for (var i = 0; i < resp.presets.length; i++) {
                    if (_currentUser_id == resp.presets[i].user_id) {
                        option = new Option(resp.presets[i].name, resp.presets[i].id, false, false);
                        select.add(option);
                    }
                }
                console.log(resp);
            }
            else {
                console.log("ОШИБКА функции savepreset_as_select_update: ");
                console.log(request);
                console.log(resp);
            }
        }
        catch (e) {
            console.log("ОШИБКА функции savepreset_as_select_update");
            console.log(e);
        }
    }
    function preset_categories_select_update() {
        try {
            var pform = document.getElementById("savepreset_form");
            var select = pform.elements.namedItem("categories[]");
            var option;
            for (var i = select.options.length - 1; i >= 0; i--) {
                select.remove(i);
            }
            var request = new XMLHttpRequest();
            request.open("POST", "../preset.php", false);
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            request.send(_CSRF + "=" + _CSRFToken + "&action=getcategories");
            var resp = JSON.parse(request.responseText);
            if (resp.status == "OK" && resp.categories && resp.categories.length > 0) {
                _presets_categories = resp.categories;
                for (var i = 0; i < _presets_categories.length; i++) {
                    option = new Option(_presets_categories[i].name, _presets_categories[i].name, false, false);
                    if (i == _presets_categories.length - 1) option.selected = true;
                    select.add(option);
                    _presets_categories[i].presets = [];
                    _presets_categories[i].tags = [];
                    for (var j = 0; j < _presets.length; j++) {
                        if (_presets[j].categories.includes(_presets_categories[i].name)) {
                            _presets_categories[i].presets.push(_presets[j]);
                            var tags = _presets[j].tags.split(",");
                            for (var k = 0; k < tags.length; k++) {
                                if (!_presets_categories[i].tags.includes(tags[k])) {
                                    _presets_categories[i].tags.push(tags[k]);
                                }
                            }
                        }
                    }
                }
                console.log(resp);
            }
            else {
                console.log("ОШИБКА функции preset_categories_select_update: ");
                console.log(request);
                console.log(resp);
            }
        }
        catch (e) {
            console.log("ОШИБКА функции preset_categories_select_update");
            console.log(e);
        }
    }
    function preset_tags_select_update() {
        try {
            var pform = document.getElementById("savepreset_form");
            var select = pform.elements.namedItem("tags[]");
            var option, optgroup, currentclass;
            while (select.firstChild) {
                select.removeChild(select.firstChild);
            }
            //optgroup = document.createElement("OPTGROUP");
            //select.add(optgroup);
            var request = new XMLHttpRequest();
            request.open("POST", "../preset.php", false);
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            request.send(_CSRF + "=" + _CSRFToken + "&action=gettags");
            var resp = JSON.parse(request.responseText);
            if (resp.status == "OK" && resp.tags && resp.tags.length > 0) {
                _presets_tags = resp.tags;
                //currentclass = resp.tags[0].class;
                for (var i = 1; i < resp.tags.length; i++) { //exept 0 index with "all" tag
                    option = new Option(resp.tags[i].name, resp.tags[i].name, false, false);
                    if (currentclass != resp.tags[i].class) {
                        currentclass = resp.tags[i].class;
                        optgroup = document.createElement("OPTGROUP");
                        select.add(optgroup);
                    }
                    optgroup.appendChild(option);
                }
                for (var i = 1; i < _presets_categories.length; i++) {
                    if (_presets_categories[i].presets.length > 0) {
                        _presets_categories[i].selected_tags = [_presets_tags[0]];
                    }
                }
                //console.log(resp);
            }
            else {
                console.log("ОШИБКА функции preset_categories_select_update: ");
                console.log(request);
                console.log(resp);
            }
        }
        catch (e) {
            console.log("ОШИБКА функции preset_tags_select_update");
            console.log(e);
        }
    }
    function restore_objects_select() {
        try {
            var pform = document.getElementById("addobject_form");
            var select = pform.elements.namedItem("object");
            var option;
            for (var i = select.options.length - 1; i > 0; i--) {
                select.remove(i);
            }
            var request = new XMLHttpRequest();
            request.open("POST", "../model.php", false);
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            request.send(_CSRF + "=" + _CSRFToken + "&action=getmodels");
            var resp = JSON.parse(request.responseText);
            if (resp.status == "OK" && resp.models && resp.models.length > 0) {
                for (var i = 0; i < resp.models.length; i++) {
                    option = new Option(resp.models[i].name, resp.models[i].image, false, false);
                    select.add(option);
                }
                console.log(resp);
            }
            else {
                console.log("ОШИБКА функции restore_objects_select: ");
                console.log(request);
                console.log(resp);
            }
        }
        catch (e) {
            console.log("ОШИБКА функции restore_objects_select");
            console.log(e);
        }
    }
    function restore_categories_select() {
        try {
            var pform = document.getElementById("savepreset_form");
            var select = pform.elements.namedItem("categories[]");
            var option;
            for (var i = select.options.length - 1; i >= 0; i--) {
                select.remove(i);
            }
            var request = new XMLHttpRequest();
            request.open("POST", "../model.php", false);
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            request.send(_CSRF + "=" + _CSRFToken + "&action=getmodels");
            var resp = JSON.parse(request.responseText);
            if (resp.status == "OK" && resp.models && resp.models.length > 0) {
                for (var i = 0; i < resp.models.length; i++) {
                    option = new Option(resp.models[i].name, resp.models[i].image, false, false);
                    select.add(option);
                }
                console.log(resp);
            }
            else {
                console.log("ОШИБКА функции restore_objects_select: ");
                console.log(request);
                console.log(resp);
            }
        }
        catch (e) {
            console.log("ОШИБКА функции restore_objects_select");
            console.log(e);
        }
    }
    function select_all_rows(id) {
        var table, rows;
        table = document.getElementById("input_list_table");
        if (table) {
            rows = table.rows;
            select_rows(rows, id);
        }
        table = document.getElementById("output_list_table");
        if (table) {
            rows = table.rows;
            select_rows(rows, id);
        }
        table = document.getElementById("gear_list_table");
        if (table) {
            rows = table.rows
            select_rows(rows, id);
        }
    }
    function select_rows(rows, id) {
        for (var i = 0, row; row = rows[i]; i++) {
            if (row.classList.contains('input_' + id)) {
                if (!row.classList.contains('selected_row')) {
                    row.classList.add('selected_row');
                }
            }
            else if (row.classList.contains('selected_row')) {
                row.classList.remove('selected_row');
            }
            else {
                //console.log(row.classList);
            }
        }
    }
    function deselect_rows(rows) {
        for (var i = 0, row; row = rows[i]; i++) {
            if (row.classList.contains('selected_row')) {
                row.classList.remove('selected_row');
            }
        }
    }
    function deselect_all_rows() {
        var input_list_table = document.getElementById("input_list_table");
        if (input_list_table)
            deselect_rows(input_list_table.rows);
        var output_list_table = document.getElementById("output_list_table");
        if (output_list_table)
            deselect_rows(output_list_table.rows);
        var gear_list_table = document.getElementById("gear_list_table");
        if (gear_list_table)
            deselect_rows(gear_list_table.rows);
    }
    function main_canvas_up(e) {
        _drag_mode = false;
        // enable camera controls after releasing the object
        if (!_enable_camera_controls) {
            m_app.enable_camera_controls(false, true);
            _enable_camera_controls = true;
        }
    }

    function main_canvas_move(e) {
        try {
            if (_drag_mode)
                if (_selected_obj && !_obj_params[param_index_by_id(_selected_obj.render.data_id)].Locked) {
                    //console.log(_selected_obj.render.data_id);
                    //console.log(_obj_params[param_index_by_id(_selected_obj.render.data_id)].Locked);
                    // disable camera controls while moving the object
                    if (_enable_camera_controls) {
                        m_app.disable_camera_controls();
                        _enable_camera_controls = false;
                    }

                    // calculate viewport coordinates
                    var cam = m_scenes.get_active_camera();

                    var x = m_mouse.get_coords_x(e);
                    var y = m_mouse.get_coords_y(e);

                    if (x >= 0 && y >= 0) {
                        x -= _obj_delta_xy[0];
                        y -= _obj_delta_xy[1];

                        // emit ray from the camera
                        var pline = m_cam.calc_ray(cam, x, y, _pline_tmp);
                        var camera_ray = m_math.get_pline_directional_vec(pline, _vec3_tmp);

                        // calculate ray/floor_plane intersection point
                        var cam_trans = m_trans.get_translation(cam, _vec3_tmp2);
                        m_math.set_pline_initial_point(_pline_tmp, cam_trans);
                        m_math.set_pline_directional_vec(_pline_tmp, camera_ray);
                        var point = m_math.line_plane_intersect(FLOOR_PLANE_NORMAL, 0,
                            _pline_tmp, _vec3_tmp3);

                        // do not process the parallel case and intersections behind the camera

                        if (point && camera_ray[2] < 0) {

                            var obj_parent = m_obj.get_parent(_selected_obj);
                            var oid = _selected_obj.render.data_id;
                            var index = param_index_by_id(oid); //
                            var mobj = _selected_obj;
                            if (obj_parent && m_obj.is_armature(obj_parent)) {
                                mobj = obj_parent;
                                // translate the parent (armature) of the animated object
                                //m_trans.set_translation_v(obj_parent, point);
                                //console.log("Bliat");
                            }

                            var delta_x = point[0] - _obj_params[index].X;
                            var delta_y = point[1] - _obj_params[index].Y;

                            _obj_params[index].X = point[0];
                            _obj_params[index].Y = point[1];

                            if (_obj_params[index].is_jump) {
                                point[2] = _obj_params[index].Z;
                            }
                            _obj_params[index].Z = point[2];
                            //var delta_z = point[2] - _obj_params[index].Z;
                            // MOVE SELECTED ITEM
                            m_trans.set_translation_v(mobj, point);
                            //console.log("XYU");


                            limit_object_position(mobj);

                            if (!event.shiftKey) {
                                // MOVE SELECTED CHILDREN
                                for (var i = 0; i < _obj_params.length; i++) {
                                    if (_obj_params[i].selected && _obj_params[i].id != oid) {
                                        var npoint = new Float32Array(3);
                                        npoint[0] = _obj_params[i].X + delta_x;
                                        npoint[1] = _obj_params[i].Y + delta_y;
                                        if (_obj_params[i].is_jump) {
                                            point[2] = _obj_params[i].Z;
                                        }
                                        else {
                                            point[2] = 0;
                                        }
                                        npoint[2] = _obj_params[i].Z;
                                        var obj_parent = m_obj.get_parent(_obj_params[i].obj);
                                        if (obj_parent && m_obj.is_armature(obj_parent))
                                            m_trans.set_translation_v(obj_parent, npoint);
                                        else
                                            m_trans.set_translation_v(_obj_params[i].obj, npoint);
                                        _obj_params[i].X = npoint[0];
                                        _obj_params[i].Y = npoint[1];
                                        _obj_params[i].Z = npoint[2];
                                        limit_object_position(_obj_params[i].obj);
                                    }
                                }
                            }

                        }
                        var pform = document.getElementById("properties_form");
                        pform.elements.namedItem("X").value = point[0].toFixed(1);;
                        pform.elements.namedItem("Y").value = point[1].toFixed(1);;
                    }
                }
        }
        catch (e) {
            console.log("ОШИБКА функции main_canvas_move");
            console.log(e);
        }
    }

    function select_group() {
        var count = 0;
        for (var i = 0; i < _obj_params.length; i++) {
            if (_obj_params[i].parent && !_obj_params[i].selected && _obj_params[param_index_by_id(_obj_params[i].parent)].selected) {
                _obj_params[i].selected = true;
                m_scenes.apply_outline_anim(_obj_params[i].obj, 1, 1, 3);
                count++;
            }
        }
        if (count > 0) {
            select_group()
        }
    }
    function deselect_all() {
        for (var i = 0; i < _obj_params.length; i++) {
            _obj_params[i].selected = false;
        }
    }
    function limit_object_position(obj) {
        try {
            var bb = m_trans.get_object_bounding_box(obj);

            var obj_parent = m_obj.get_parent(obj);
            if (obj_parent && m_obj.is_armature(obj_parent))
                // get translation from the parent (armature) of the animated object
                var obj_pos = m_trans.get_translation(obj_parent, _vec3_tmp);
            else
                var obj_pos = m_trans.get_translation(obj, _vec3_tmp);

            if (obj_pos[0] > WALL_X_MAX) // bb.max_x
                obj_pos[0] -= obj_pos[0] - WALL_X_MAX; //bb.min_x
            else if (obj_pos[0] < WALL_X_MIN) //bb.min_x
                obj_pos[0] += WALL_X_MIN - obj_pos[0]; //bb.min_x

            if (obj_pos[1] > WALL_Y_MAX) // bb.max_y
                obj_pos[1] -= obj_pos[1] - WALL_Y_MAX; // bb.max_y
            else if (obj_pos[1] < WALL_Y_MIN) // bb.max_y
                obj_pos[1] += WALL_Y_MIN - obj_pos[1]; // bb.max_y
            if (obj) {
                var index = param_index_by_id(obj.render.data_id);
                if (index >= 0) {
                    _obj_params[index].X = obj_pos[0];
                    _obj_params[index].Y = obj_pos[1];
                }
            }
            if (obj_parent && m_obj.is_armature(obj_parent))
                // translate the parent (armature) of the animated object
                m_trans.set_translation_v(obj_parent, obj_pos);
            else
                m_trans.set_translation_v(obj, obj_pos);
        }
        catch (e) {
            console.log("ОШИБКА функции limit_object_position");
            console.log(e);
        }
    }


});

// import the app module and start the app by calling the init method
b4w.require("my_project_main").init();
