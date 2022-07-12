import register from "../util/register.js";

import m_cam_fact from "../extern/camera.js";
import m_ctl_fact from "../extern/controls.js";
import m_scenes_fact from "../extern/scenes.js";
import m_trans_fact from "../extern/transform.js";
import m_util_fact from "../extern/util.js";
import * as m_vec3 from "../libs/gl_matrix/vec3.js";

/**
 * Gyroscope actions add-on.
 * Provides support for gyroscope on mobile devices.
 * @see http://www.w3.org/TR/orientation-event/
 * @module gyroscope
 */

function Gyroscope(ns, exports) {

var m_cam        = m_cam_fact(ns);
var m_ctl        = m_ctl_fact(ns);
var m_scenes     = m_scenes_fact(ns);
var m_trans      = m_trans_fact(ns);
var m_util       = m_util_fact(ns);

var _begin_angles = new Float32Array(3);
var _curr_angles = new Float32Array(3);

var _vec3_tmp = m_vec3.create();

var VERTICAL_BETA_ANGLE_THRESHOLD_UP = m_util.deg_to_rad(110);
var VERTICAL_BETA_ANGLE_THRESHOLD_DOWN = m_util.deg_to_rad(70);
var VERTICAL_GAMMA_ANGLE_THRESHOLD_UP = m_util.deg_to_rad(70);
var VERTICAL_GAMMA_ANGLE_THRESHOLD_DOWN = - m_util.deg_to_rad(70);

/**
 * Enable camera rotation according to orientation of mobile device.
 * @method module:gyroscope.enable_camera_rotation
 */
exports.enable_camera_rotation = function() {
    var cam_obj = m_scenes.get_active_camera();
    create_camera_rotation_sensors(cam_obj);
}

function create_camera_rotation_sensors(obj) {
    var g_a_sensor = m_ctl.create_gyro_angles_sensor();
    var g_q_sensor = m_ctl.create_gyro_quat_sensor();
    var save_angles = true;

    var cam_rotate_cb = function(obj, id, pulse) {
        if (pulse > 0) {
            if (m_cam.is_eye_camera(obj)) {
                var hmd_quat = m_ctl.get_sensor_payload(obj, id, 1);
                var up_axis = m_vec3.transformQuat(m_util.AXIS_MY, hmd_quat, _vec3_tmp);
                m_cam.set_vertical_axis(obj, up_axis);
                m_trans.set_rotation_v(obj, hmd_quat);
            } else {
                _curr_angles = m_ctl.get_sensor_payload(obj, id, 0);

                if (save_angles) {
                    _begin_angles[0] = _curr_angles[0];
                    _begin_angles[1] = _curr_angles[1];
                    _begin_angles[2] = _curr_angles[2];
                    save_angles = false;
                }
                var delta_beta = 0;
                var delta_gamma = 0;

                if (window.orientation == 0) {
                    delta_beta = (_curr_angles[1] - _begin_angles[1]);
                    delta_gamma = (_curr_angles[0] - _begin_angles[0]);
                    if (_curr_angles[1] > VERTICAL_BETA_ANGLE_THRESHOLD_DOWN &&
                            _curr_angles[1] < VERTICAL_BETA_ANGLE_THRESHOLD_UP)
                        delta_gamma = 0;
                }

                if (window.orientation == 180) {
                    delta_beta = (_curr_angles[1] - _begin_angles[1]);
                    if (_curr_angles[1] < 0)
                        delta_beta = -delta_beta;
                    delta_gamma = (_begin_angles[0] - _curr_angles[0]);
                    if (delta_beta > Math.PI / 2 || delta_beta < - Math.PI / 2)
                        delta_beta = 0;
                    if (_curr_angles[1] > - VERTICAL_BETA_ANGLE_THRESHOLD_UP &&
                            _curr_angles[1] < - VERTICAL_BETA_ANGLE_THRESHOLD_DOWN)
                        delta_gamma = 0;
                }

                if (window.orientation == -90) {
                    delta_beta = (_curr_angles[0] - _begin_angles[0]);
                    if (delta_beta > Math.PI / 2 || delta_beta < - Math.PI / 2)
                        delta_beta = 0;
                    delta_gamma = (_begin_angles[1] - _curr_angles[1]);
                    if (_curr_angles[0] > VERTICAL_GAMMA_ANGLE_THRESHOLD_UP ||
                            _curr_angles[0] < VERTICAL_GAMMA_ANGLE_THRESHOLD_DOWN)
                        delta_gamma = 0;
                }

                if (window.orientation == 90) {
                    delta_beta = (_begin_angles[0] - _curr_angles[0]);
                    if (delta_beta > Math.PI / 2 || delta_beta < - Math.PI / 2)
                        delta_beta = 0;
                    delta_gamma = (_curr_angles[1] - _begin_angles[1]);
                    if (_curr_angles[0] > VERTICAL_GAMMA_ANGLE_THRESHOLD_UP ||
                            _curr_angles[0] < VERTICAL_GAMMA_ANGLE_THRESHOLD_DOWN)
                        delta_gamma = 0;
                }

                m_cam.rotate_camera(obj, delta_gamma, delta_beta);
                _begin_angles[0] = _curr_angles[0];
                _begin_angles[1] = _curr_angles[1];
                _begin_angles[2] = _curr_angles[2];
            }
        }
    }
    m_ctl.create_sensor_manifold(obj, "CAMERA_ROTATE_GYRO",
            m_ctl.CT_CONTINUOUS, [g_a_sensor, g_q_sensor], null,
            cam_rotate_cb);
}

/**
 * Disable camera rotation according to orientation of mobile device.
 * @method module:gyroscope.disable_camera_rotation
 */
exports.disable_camera_rotation = function() {
    var cam_obj = m_scenes.get_active_camera();
    m_ctl.remove_sensor_manifold(cam_obj, "CAMERA_ROTATE_GYRO");
}

};

var gyroscope_factory = register("gyroscope", Gyroscope);

export default gyroscope_factory;