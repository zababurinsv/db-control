import Axios from '../../axios/index.mjs'
const axios = Axios()
const server = ' http://localhost:4550'
// export const register = (formData) => async (dispatch) => {
//     try {
//         const res = await api.post('/users', formData);
//
//         dispatch({
//             type: REGISTER_SUCCESS,
//             payload: res.data
//         });
//         dispatch(loadUser());
//     } catch (err) {
//         const errors = err.response.data.errors;
//
//         if (errors) {
//             errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
//         }
//
//         dispatch({
//             type: REGISTER_FAIL
//         });
//     }
// };

const registration = (data) => {
  return axios.post(`${server}/api/users`, {
      name: data.name,
      email: data.email,
      password: data.password
    }).then((data) => {
      console.log('!!!!!!!!!!!!!!!! registration  ok !!!!!!!!!!!!!!!', data)
    }).catch((e) => {
      console.log('!!!!!!!!!!!!!!!! registration error !!!!!!!!!!!!!!!', e)
    })
}

const login = async (data) => {
    return axios.post(`${server}/api/auth`, {
        email: data.email,
        password: data.password
    }).then((data) => {
        console.log('!!!!!!!!!!!!!!!! auth  ok !!!!!!!!!!!!!!!', data)
    }).catch((e) => {
        console.log('!!!!!!!!!!!!!!!! auth error !!!!!!!!!!!!!!!', e)
    })
}

export default {
    registration,
    login
}
