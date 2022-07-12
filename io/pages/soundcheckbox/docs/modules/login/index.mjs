import {auth} from '../api/index.mjs'

export default () => {

    const error = {
        removeErrorMessages: () => {

        },
        displayErrorMessage: () => {

        }
    }

    const validation = {
        password: (password, repeat) => {
            let valid = true;
            error.removeErrorMessages();
            if(password !== repeat) {
                error.displayErrorMessage('password', 'не совпадают пароль и повтор пароля')
                valid = false;
            }
            return valid;
        },
        login: () => {

        }
    };

    const submit = {
        login: document.body.querySelector('#btn-login'),
        registration: document.body.querySelector('#btn-register')
    }

    const login = {
        email: document.body.querySelector('#login-email'),
        password: document.body.querySelector('#login-password'),
    }

    const registration = {
        email: document.body.querySelector('#reg-email'),
        username: document.body.querySelector('#reg-username'),
        password: document.body.querySelector('#reg-password'),
        repeatPassword: document.body.querySelector('#reg-repeat-password'),
        regBotSum: document.body.querySelector('#reg-bot-sum')
    }

    const forgot = {
        password: document.body.querySelector('#forgot-password-email')
    }

    const registrationSubmit = (e) => {
        e.preventDefault()
        validation.password(registration.password, registration.repeatPassword)

        auth.registration({
            name: registration.username.value,
            email: registration.email.value,
            password: registration.password.value,
            regBotSum: registration.regBotSum.value
        })
        .then((data) => {
          console.log('auth', data)
        }).catch(e => {
            console.log('error', e)
        }).finally(() => {
            console.log('finally')
        })
    }

    const loginSubmit = (e) => {
        e.preventDefault()
        validation.login(login.username, login.password)
        auth.login({
            email: registration.email.value,
            password: registration.password.value
        })
        .then((data) => {
            console.log('login', data)
        }).catch(e => {
            console.log('error', e)
        }).finally(() => {
            console.log('finally')
        })
    }

    submit.registration.addEventListener('click', registrationSubmit)
    submit.login.addEventListener('click', loginSubmit)
}
