import store from '/static/html/components/component_modules/staticProperty/staticProperty.mjs'
import mainConfig from '/static/html/components/component_modules/matcher/matcher/this/database/config/index.mjs'
import conf from '/static/html/components/component_modules/matcher/matcher/this/database/config/index.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import Waves from '/static/html/components/component_modules/bundle/waves/waves.mjs'
customElements.define('waves-balance',
    class extends HTMLElement {
        static get observedAttributes () {
            return ['feed']
        }
        constructor () {
            super()
            let white = []
            let property = []

            let typeSupported = []
            let words = []

            property.push('component-id')
            property.push('script')
            property.push('component-action')
            typeSupported.push('h1')
            typeSupported.push('innerText')
            words.push('shadowRoot')
            words.push('head')
            words.push('shadow')
            words.push('light')
            words.push('lightDom')
            words.push('editor')
            words.push('слайдер')
            words.push('swap')
            white['this'] = this
            white['type-supported'] = typeSupported

            function style (obj) {
                return new Promise(function (resolve, reject) {
                    let styleS = document.createElement('style')
                    let styleL = document.createElement('style')
                    let name = {}
                    if (!obj['slot']) {
                        name = obj['parent']
                    } else {
                        name = obj['slot']
                    }
                    if (!name) {
                        console.assert(false, 'не установленны ни слот ни парент')
                    }

                    for (let key = 0; key < obj['type'].length; key++) {
                        if (obj['type'][key] === 'swap') {
                            if (obj['type'][key] === 'scoped') {
                                styleS.setAttribute('scoped', '')
                            }
                        } else {
                            if (obj['type'][key] === 'scoped') {
                                styleL.setAttribute('scoped', '')
                            }
                        }
                    }
                    for (let state = 0; state < obj['state'].length; state++) {
                        obj[`path-style-${obj['state'][state]}`] = `@import '/static/html/components/${obj['component']}/${obj['state'][state]}/${obj['component']}.css'; @import '/static/html/components/${obj['component']}/${obj['state'][state]}/${obj['component']}-custom.css';`
                        switch (obj['state'][state]) {
                            case 'shadow':
                                if (obj['verify']['preset'] === true) {
                                    obj[`path-style-${obj['state'][state]}-preset`] = `@import '/static/html/components/${obj['component']}/template/${name}.css';`
                                }
                                styleS.innerText = obj[`path-style-${obj['state'][state]}`] + obj[`path-style-${obj['state'][state]}-preset`]
                                break
                            case 'light':
                                if (obj['verify']['preset'] === true) {
                                    obj[`path-style-${obj['state'][state]}-preset`] = `@import '/static/html/components/${obj['component']}/template/${name}.css';`
                                }
                                styleL.innerText = obj[`path-style-${obj['state'][state]}`] + obj[`path-style-${obj['state'][state]}-preset`]
                                break
                            default:
                                // //console.log(`новый тип`, obj['state'][state])
                                break
                        }
                        if (obj['state'][state] === 'swap') {
                            if (obj['shadowRoot'] === true) {
                                obj['this']['shadowRoot'].appendChild(styleL)
                                obj['this'].appendChild(styleS)
                                resolve(obj)
                            } else {
                                obj['this'].appendChild(styleS)
                            }
                        } else {
                            if (obj['shadowRoot'] === true) {
                                obj['this']['shadowRoot'].appendChild(styleS)
                                obj['this'].appendChild(styleL)
                                resolve(obj)
                            } else {
                                obj['this'].appendChild(styleL)
                            }
                        }
                    }
                    resolve(obj)
                })
            }
            function objectProperty (obj) {
                return new Promise(function (resolve, reject) {
                    let black = []
                    black['staticProperty'] = []
                    black['staticProperty']['c'] = 0
                    black['state'] = []
                    black['state'].push('shadow')
                    black['state'].push('light')
                    black['words'] = words
                    black['parent'] = false
                    black[`type-swap`] = false
                    black[`type-external`] = false
                    black[`document-offsetWidth`] = document['body'].offsetWidth
                    let verifyLight = false
                    black[`getAttribute`] = (obj, type, property) => {
                        if (property === 'template') {
                            if (!obj.getAttribute('type')) {
                                // //console.log('не установлен тип ставим default')
                                obj.setAttribute('type', 'default')
                                return false
                            } else {
                                for (let key = 0; key < obj.getAttribute('type').split('-').length; key++) {
                                    if (obj.getAttribute('type').split('-')[key] === type) {
                                        verifyLight = true
                                    }
                                }
                            }
                            return verifyLight
                        } else {
                            // //console.log(obj['this'].getAttribute('type'))
                            obj[`verify-${type}`] = false
                            if (obj['this'].getAttribute('type').split('-').length === 0) {
                                return false
                            } else {
                                for (let key = 0; key < obj['this'].getAttribute('type').split('-').length; key++) {
                                    if (obj['this'].getAttribute('type').split('-')[key] === type) {
                                        obj[`verify-${type}`] = true
                                    } else {
                                        obj[`verify-${type}`] = false
                                    }
                                }
                            }
                            console.assert(false, obj)
                            return obj[`verify-${type}`]
                        }
                    }
                    if (!obj.tagName.toLowerCase()) {
                        // //console.log('что то пошло не так middleware js objectProperty', '')
                    } else {
                        black[`component`] = obj.tagName.toLowerCase()
                    }
                    if (typeof (obj) !== 'object') {
                        // //console.log('objectProperty middleware.js пришёл не объект')
                    } else {
                        if (!obj.getAttribute('type')) {
                            black[`type`] = ['default']
                            // //console.log('нет типа ставим default')
                            obj.setAttribute('type', 'default')
                        } else {
                            black[`type`] = obj.getAttribute('type').split('-')
                            for (let type = 0; type < black[`type`].length; type++) {
                                black[`type`][type] = black[`type`][type].replace(/:/g, '-')
                            }
                            for (let key in black[`type`]) {
                                switch (black[`type`][key]) {
                                    case 'swap':
                                        black[`type-swap`] = true
                                        break
                                    case 'external':
                                        black[`type-external`] = true
                                        break
                                    default:
                                        // //console.log(`дополнительные типы`, black[`type`][key])
                                        break
                                }
                            }
                        }
                        if (!obj.slot) {
                            obj.slot = obj.tagName.toLowerCase()
                            black[`slot`] = obj.slot
                        } else {
                            black[`slot`] = obj.slot
                        }
                        if (!obj.getAttribute('type')) {
                        } else {
                            let veryfiStyle = false
                            for (let key in obj.getAttribute('type').split('-')) {
                                if (obj.getAttribute('type').split('-')[key].indexOf('style:') !== -1) {
                                    // //console.log('устанавливаются пути к стилям')
                                    veryfiStyle = true
                                }
                            }
                            if (veryfiStyle === true) {
                                black['style-custom'] = 'not-default'
                            } else {
                                black['style-custom'] = 'default'
                            }
                        }
                    }
                    black['shadowRoot'] = false
                    black['this'] = obj
                    resolve(black)
                })
            }

            function externalProperty (obj) {
                return new Promise(function (resolve, reject) {
                    obj['external-property'] = white['external-property']
                    let object = []
                    let component = []
                    let a = []
                    for (let key = 0; key < obj['external'].length; key++) {
                        for (let type = 0; type < obj['external'][key].children.length; type++) {
                            switch (obj['external'][key].children[type].tagName) {
                                case 'SCRIPT':
                                    if (!obj['external'][key].getAttribute('id')) {
                                        // //console.log('у компонента нет id нужно в external property script  получить id для загрузки скрипта')
                                    } else {
                                        component['script'] = obj['external'][key]['children'][type]
                                    }
                                    break
                                case 'COMPONENT-ID':
                                    component['id'] = obj['external'][key]['children'][type].innerText
                                    break
                                case 'COMPONENT-ACTION':
                                    for (let action = 0; action < obj['external'][key]['children'][type]['children'].length; action++) {
                                        a.push(obj['external'][key]['children'][type]['children'][action].innerText)
                                    }
                                    component['actions'] = a
                                    break
                                default:
                                    // //console.log(`Не отслеживается, по мере надобности добавляются [${obj['external'][key].children[type].tagName.toLowerCase()}]`)
                                    break
                            }
                        }
                        object.push(component)
                        component = []
                    }
                    obj['external-property'] = object
                    resolve(obj)
                })
                    .catch(error => {
                        // //console.log('здесь я перехватывал отсутствие страницы но это убрал', error)
                    })
            }


            function getTemplate (obj, swap, external) {
                return new Promise(function (resolve, reject) {
                    obj['template-shadow'] = []
                    obj['template-light'] = []
                    let verify = []
                    verify['swap'] = false
                    verify['blog'] = false
                    verify['external'] = false
                    verify['light'] = false
                    verify['slider'] = false
                    verify['one'] = false
                    verify['sliderText'] = false
                    verify['text'] = false
                    for (let type = 0; type < obj['type'].length; type++) {
                        if (obj['type'][type].indexOf('slider') !== -1) {
                            if (obj['type'][type].split('-').length > 1) {
                                verify['slider'] = true
                                for (let key in obj['type'][type].split('-')) {
                                    switch (obj['type'][type].split('-')[key]) {
                                        case 'one':
                                            verify['one'] = true
                                            break
                                        default:
                                            // //console.log(`~~~дополнительное свойство~~~`, obj['type'][type].split('-')[key])
                                            break
                                    }
                                }
                            }
                        }
                        if (obj['type'][type].length) {
                            if (obj['type'][type].split('-').length > 1) {
                                switch (obj['type'][type].split('-')[0]) {
                                    case 'blog':
                                        verify['blog'] = true
                                        break
                                    default:
                                        console.log(`типы не отслеживаются`, obj['type'][type])
                                        break
                                }
                            } else {
                                switch (obj['type'][type]) {
                                    case 'swap':
                                        verify['swap'] = true
                                        break
                                    case 'external':
                                        verify['external'] = true
                                        break
                                    case 'light':
                                        verify['light'] = true
                                        break
                                    case 'slider':
                                        verify['slider'] = true
                                        break
                                    case 'sliderText':
                                        verify['sliderText'] = true
                                        break
                                    case 'text':
                                        verify['text'] = true
                                        break
                                    default:
                                        // //console.log(`типы не отслеживаются`, obj['type'][type])
                                        break
                                }
                            }
                        }
                    }

                    /**
                     * цикл this
                     * цикл template
                     */
                    /**
                     * устанавливается свойство parent если его нет у родителя ставится по родителю
                     *
                     */
                    if(obj['this'].getAttribute('parent')){
                        obj['parent'] = obj['this'].getAttribute('parent')
                    }
                    if (verify['swap'] === true) {
                        for (let key = 0; key < obj['this'].children.length; key++) {
                            // //console.log('~~~~~~this~~~~~~~', obj['this'].children[key].tagName)
                            if (obj['this'].children[key].tagName.split('-').length === 1) {
                                if (obj['this'].children[key].slot === 'view') {
                                    obj['this'].children[key].className = 'wall'
                                }
                                obj['template-light'].push(obj['this'].children[key])
                            } else {
                                if (obj['getAttribute'](obj['this'].children[key], 'light', 'template') === true) {
                                    obj['this'].children[key].setAttribute('type', `${obj['this'].children[key].getAttribute('type')}-external`)
                                    if(obj['parent'] === false){
                                        if(!obj['slot']){
                                            obj['this'].children[key].setAttribute('parent', `${obj['component']}`)
                                        }else{
                                            obj['this'].children[key].setAttribute('parent', `${obj['slot']}`)
                                        }
                                    }else{
                                        obj['this'].children[key].setAttribute('parent', `${obj['parent']}`)
                                    }

                                    scriptTemplate(obj['this'].children[key], obj)
                                    obj['template-light'].push(obj['this'].children[key])
                                } else {
                                    obj['this'].children[key].setAttribute('type', `${obj['this'].children[key].getAttribute('type')}-external`)
                                    /**
                                     * устанавливается свойство parent если его нет у родителя ставится по родителю
                                     *
                                     */
                                    if(obj['parent'] === false){
                                        if(!obj['slot']){
                                            obj['this'].children[key].setAttribute('parent', `${obj['component']}`)
                                        }else{
                                            obj['this'].children[key].setAttribute('parent', `${obj['slot']}`)
                                        }
                                    }else{
                                        obj['this'].children[key].setAttribute('parent', `${obj['parent']}`)
                                    }
                                    scriptTemplate(obj['this'].children[key], obj)
                                    obj['template-shadow'].push(obj['this'].children[key])
                                }
                            }
                        }
                        for (let key = 0; key < obj['template'].children.length; key++) {
                            // //console.log('~~~~~~template~~~~~~~', obj['template'].children[key].tagName)
                            if (obj['template'].children[key].tagName.split('-').length === 1) {
                                if (obj['template'].children[key].slot === 'view') {
                                    obj['template'].children[key].className = 'wall'
                                }
                                obj['template-light'].push(obj['template'].children[key])
                            } else {
                                if (obj['getAttribute'](obj['template'].children[key], 'light', 'template') === true) {
                                    obj['template'].children[key].setAttribute('type', `${obj['template'].children[key].getAttribute('type')}-external`)
                                    if(obj['parent'] === false){
                                        if(!obj['slot']){
                                            obj['this'].children[key].setAttribute('parent', `${obj['component']}`)
                                        }else{
                                            obj['this'].children[key].setAttribute('parent', `${obj['slot']}`)
                                        }
                                    }else{
                                        obj['this'].children[key].setAttribute('parent', `${obj['parent']}`)
                                    }
                                    scriptTemplate(obj['template'].children[key], obj)
                                    obj['template-light'].push(obj['template'].children[key])
                                } else {
                                    obj['template'].children[key].setAttribute('type', `${obj['template'].children[key].getAttribute('type')}-external`)
                                    if(obj['parent'] === false){
                                        if(!obj['slot']){
                                            obj['this'].children[key].setAttribute('parent', `${obj['component']}`)
                                        }else{
                                            obj['this'].children[key].setAttribute('parent', `${obj['slot']}`)
                                        }
                                    }else{
                                        obj['this'].children[key].setAttribute('parent', `${obj['parent']}`)
                                    }
                                    scriptTemplate(obj['template'].children[key], obj)
                                    obj['template-shadow'].push(obj['template'].children[key])
                                }
                            }
                        }
                    } else {
                        for (let key = 0; key < obj['this'].children.length; key++) {
                            // //console.log('~~~~~~this~~~~~~~', obj['this'].children[key].tagName)
                            if (obj['this'].children[key].tagName.split('-').length === 1) {
                                if (obj['this'].children[key].slot === 'view') {
                                    obj['this'].children[key].className = 'wall'
                                }
                                obj['template-shadow'].push(obj['this'].children[key])
                            } else {
                                if (obj['getAttribute'](obj['this'].children[key], 'light', 'template') === true) {
                                    if(obj['parent'] === false){
                                        if(!obj['slot']){
                                            obj['this'].children[key].setAttribute('parent', `${obj['component']}`)
                                        }else{
                                            obj['this'].children[key].setAttribute('parent', `${obj['slot']}`)
                                        }
                                    }else{
                                        obj['this'].children[key].setAttribute('parent', `${obj['parent']}`)
                                    }
                                    scriptTemplate(obj['this'].children[key], obj)
                                    obj['template-shadow'].push(obj['this'].children[key])
                                } else {
                                    if(obj['parent'] === false){
                                        if(!obj['slot']){
                                            obj['this'].children[key].setAttribute('parent', `${obj['component']}`)
                                        }else{
                                            obj['this'].children[key].setAttribute('parent', `${obj['slot']}`)
                                        }
                                    }else{
                                        obj['this'].children[key].setAttribute('parent', `${obj['parent']}`)
                                    }
                                    scriptTemplate(obj['this'].children[key], obj)
                                    obj['template-light'].push(obj['this'].children[key])
                                }
                            }
                        }
                        for (let key = 0; key < obj['template'].children.length; key++) {
                            // //console.log('~~~~~~template~~~~~~~', obj['template'].children[key].tagName)
                            if (obj['template'].children[key].tagName.split('-').length === 1) {
                                if (obj['template'].children[key].slot === 'view') {
                                    obj['template'].children[key].className = 'wall'
                                }
                                obj['template-shadow'].push(obj['template'].children[key])
                            } else {
                                if (obj['getAttribute'](obj['template'].children[key], 'light', 'template') === true) {
                                    if(obj['parent'] === false){
                                        if(!obj['slot']){
                                            obj['this'].children[key].setAttribute('parent', `${obj['component']}`)
                                        }else{
                                            obj['this'].children[key].setAttribute('parent', `${obj['slot']}`)
                                        }
                                    }else{
                                        obj['this'].children[key].setAttribute('parent', `${obj['parent']}`)
                                    }
                                    scriptTemplate(obj['template'].children[key], obj)
                                    obj['template-shadow'].push(obj['template'].children[key])
                                } else {
                                    if(obj['parent'] === false){
                                        if(!obj['slot']){
                                            obj['this'].children[key].setAttribute('parent', `${obj['component']}`)
                                        }else{
                                            obj['this'].children[key].setAttribute('parent', `${obj['slot']}`)
                                        }
                                    }else{
                                        obj['this'].children[key].setAttribute('parent', `${obj['parent']}`)
                                    }
                                    scriptTemplate(obj['template'].children[key], obj)
                                    obj['template-light'].push(obj['template'].children[key])
                                }
                            }
                        }
                    }
                    for (let key in verify) {
                        obj['verify'][key] = verify[key]
                    }
                    resolve(obj)
                })
            }
            function template (obj, type) {
                return new Promise(function (resolve, reject) {
                    obj['verify'] = []

                    if (!obj['this'].getAttribute('preset')) {
                        obj['path-template'] = `/static/html/components/${obj['component']}/${obj['component']}.html`
                        obj['verify']['preset'] = false
                    } else {
                        switch(obj['this'].getAttribute('preset')){
                            case 'default':
                                obj['path-template'] = `/static/html/components/${obj['component']}/template/${obj['component']}.html`
                                obj['preset'] = `${obj['this'].getAttribute('preset')}`
                                obj['verify']['preset'] = true
                                break
                            default:
                                obj['path-template'] = `/static/html/components/${obj['component']}/template/${obj['this'].getAttribute('preset')}.html`
                                obj['preset'] = `${obj['this'].getAttribute('preset')}`
                                obj['verify']['preset'] = true
                                break
                        }
                    }
                    fetch(obj['path-template'])
                        .then(function (response) {
                            if (response.ok) {
                                return response.text()
                            }
                        }).then(function (body) {
                        let parser = new DOMParser()
                        let doc = parser.parseFromString(body, 'text/html')
                        obj['template'] = doc.getElementsByTagName('template')[0].content.cloneNode(true)
                        external(obj)
                            .then((obj) => {
                                getTemplate(obj, obj['type-swap'], obj['type-external'])
                                    .then((obj) => {
                                        if (obj['verify']['swap'] === true) {

                                            if (obj['template-light'].length !== 0) {
                                                for (let key = 0; key < obj['template-light'].length; key++) {
                                                    //console.log('2222222222111111111111222222222222', obj['template-light'][key])
                                                    obj['this']['prepend'](obj['template-light'][key])
                                                    // console.assert(false, obj['template-light'][key])
                                                }
                                            }
                                            if (obj['template-shadow'].length !== 0) {
                                                obj['this']['attachShadow']({mode: 'open'})
                                                obj['shadowRoot'] = true
                                                for (let key = 0; key < obj['template-shadow'].length; key++) {

                                                    obj['this']['shadowRoot']['appendChild'](obj['template-shadow'][key])
                                                }
                                            }

                                        } else {
                                            if (obj['template-light'].length !== 0) {
                                                for (let key in obj['template-light']) {
                                                    obj['this']['appendChild'](obj['template-light'][key])
                                                }
                                            }
                                            if (obj['template-shadow'].length !== 0) {
                                                obj['this']['attachShadow']({mode: 'open'})
                                                obj['shadowRoot'] = true
                                                for (let key in obj['template-shadow']) {
                                                    obj['this']['shadowRoot']['appendChild'](obj['template-shadow'][key])
                                                }
                                            }

                                        }
                                        resolve(obj)
                                    })
                            })
                    })
                        .catch(error => {
                            return error
                        })
                })
            }

            function renderExternal (obj) {
                return new Promise(function (resolve, reject) {
                    obj['words-action'] = []
                    let wordsAction = []
                    for (let key = 0; key < obj['external-property'].length; key++) {
                        for (let words = 0; words < obj['external-property'][key]['actions'].length; words++) {
                            for (let verify = 0; verify < obj['words'].length; verify++) {
                                if (obj['external-property'][key]['actions'][words].indexOf(obj['words'][verify]) !== -1) {
                                    if (obj['words'][verify] === 'shadowRoot' || obj['words'][words] === 'shadow') {
                                        wordsAction['shadow'] = true
                                    }
                                    if (obj['words'][verify] === 'light' || obj['words'][words] === 'лайт') {
                                        wordsAction['light'] = true
                                    }
                                    if (obj['words'][verify] === 'editor') {
                                        wordsAction['editor'] = true
                                    }
                                    if (obj['words'][verify] === 'слайдер') {
                                        wordsAction['editor-slider'] = true
                                    }
                                    if (obj['words'][verify] === 'swap') {
                                        wordsAction['swap'] = true
                                    }
                                }
                            }
                        }
                        obj['words-action'] = wordsAction

                        for (let key in obj['external-property']) {
                            for (let type in obj['external-property'][key]) {
                                switch (type) {
                                    case 'id':
                                        let doc = document.createElement(obj['external-property'][key][type])
                                        doc.setAttribute('type', 'external')
                                        obj['this'].appendChild(doc)
                                        break
                                    default:
                                        // //console.log(`какой то неизвестный тип`, type)
                                        break
                                }
                            }
                        }
                        resolve(obj)
                    }
                })
            }

            function external (obj) {
                return new Promise(function (resolve, reject) {
                    obj['path-external'] = `/static/html/components/${obj['component']}/external/${obj['component']}-external.html`
                    fetch(obj['path-external'])
                        .then(function (response) {
                            if (response.ok === false) {
                                return response.ok
                            } else {
                                return response.text()
                            }
                        })
                        .then(function (data) {
                            if (data === false) {
                            } else {
                                let parser = new DOMParser()
                                let doc = parser.parseFromString(data, 'text/html')
                                obj['external'] = doc.querySelectorAll('section')
                                externalProperty(obj)
                                    .then((obj) => {
                                        if (obj['external-property'].length === 0) {
                                            resolve(obj)
                                        } else {
                                            renderExternal(obj)
                                                .then((obj) => {
                                                    resolve(obj)
                                                })
                                        }
                                    })
                            }
                        })
                        .catch(error => {
                            throw error
                        })
                })
            }
            function getElementsByClassName (obj, type) {
                return new Promise(function (resolve, reject) {
                    for (let state = 0; state < obj['state'].length; state++) {
                        for (let key = 0; key < obj[`template-${obj['state'][state]}`].length; key++) {
                            if (obj[`template-${obj['state'][state]}`][key].getElementsByClassName(type).length === 0) {

                            } else {
                                obj['slider'] = obj[`template-${obj['state'][state]}`][key].getElementsByClassName(type)[0]
                                resolve(obj[`template-${obj['state'][state]}`][key].getElementsByClassName(type)[0])
                            }
                        }
                    }
                })
            }
            function scriptTemplate (obj, parent) {
                return new Promise(function (resolve, reject) {
                    let verify = false
                    for (let i = 0; i < document.querySelectorAll('script').length; i++) {
                        if (document.querySelectorAll('script')[i].src.indexOf(obj.tagName.toLowerCase()) !== -1) {
                            verify = true
                        }
                    }
                    if (verify === true) {
                        console.log('модуль загружен')
                    } else {
                        const script = document.createElement('script')
                        script.src = `/static/html/components/${obj.tagName.toLowerCase()}/${obj.tagName.toLowerCase()}.mjs`
                        script.type = 'module'
                        script.setAttribute('async', '')
                        script.onload = resolve
                        script.onerror = reject

                        parent['this'].appendChild(script)
                    }
                })
            }
            objectProperty(this)
                .then((obj) => {
                    template(obj)
                        .then((obj) => {
                            style(obj)
                                .then((obj) => {
                                    modules(obj)
                                })
                        })
                })
            async function modules (obj) {

                await store({
                    input:'waves-balance',
                    this:obj['this'],
                    parent: obj['this'].getAttribute('parent'),
                    slot:obj['slot'],
                    type:'obj'
                }, 'set', 'type')

                    // let dappaddress = conf['account']['dappaddress'];
                    // let baseUri = conf['account']['testnodes'];
                    // let accoutName = obj['this'].shadowRoot.querySelector('#multiDomainAccount')
                    // accoutName.innerText = `${conf['account']['dappaddress']}`
                    // let dAppData = await Waves['default']['transactions']['nodeInteraction'].accountData(dappaddress, baseUri)
                    // console.assert(false,dAppData)
                    // if (dAppData) {
                    //     window.dAppDataKeys = Object.keys(dAppData);
                    //     console.log("dApp Account data:");
                    //     console.log(dAppData);
                    // }
                    // let accountbalance = await  window['wt']['nodeInteraction']['balanceDetails'](dappaddress, baseUri)
                    // accountbalance = accountbalance['regular'] / 100000000
                    //
                    // let regularBalance =  obj['this'].shadowRoot.querySelector('.regularBalance')
                    // regularBalance.innerText = `waves: ${accountbalance}`



                obj['this'].shadowRoot.querySelector('.withdraw').addEventListener('click',async function(event) {
                    bundle['default'](obj,null, async function (error, config) {

                        let state = await store({
                            input:'state',
                            type:'object'
                        }, 'get', 'type')
                        if(state === null){
                            alert('Войдите под своим аккаунтом')
                        }else {

                            let accountbalance = await  window['wt']['nodeInteraction']['accountDataByKey'](`${state[0]['state']['address']}_balance`, window['wt']['dappaddress'],window['wt']['baseUri'])

                            let withdraw = 0
                            if(isEmpty(event.target.shadowRoot.querySelector('#withdraw').value)){



                                withdraw = +accountbalance['value']

                            }else{

                                withdraw =  event.target.shadowRoot.querySelector('#withdraw').value * 100000000

                            }
                            if(withdraw === 0){
                                alert('У вас нет средств для вывода')
                            }else{

                                try {
                                    let wavesBalance =  await store({
                                        input:'waves-balance',
                                        type:'all'
                                    }, 'get', 'type')
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.withdraw').style.disabled = 'disabled'
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#withdraw').disabled = true
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.deposit').style.disabled = 'disabled'
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#deposit').disabled = true
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.withdraw').innerText = 'идёт процесс вывода'
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#withdraw').value = 0

                                    let tx = await WavesKeeper.signAndPublishTransaction({
                                        type: 16,
                                        data: {
                                            fee: {
                                                "tokens": "0.05",
                                                "assetId": "WAVES"
                                            },
                                            dApp: mainConfig['account']['dappaddress'],
                                            call:{
                                                function: "withdraw",
                                                args: [{ type:"integer", value: withdraw}]},
                                            payment:[]
                                        }
                                    })
                                    tx = JSON.parse(tx)
                                    let oldBalance = wavesBalance['waves-auth'][0]['this'].shadowRoot.querySelector('.balance').innerText
                                    oldBalance = +oldBalance.split(':')[1]
                                    await window['wt']['nodeInteraction']['waitForTx'](tx.id,{
                                        apiBase:'https://nodes-testnet.wavesnodes.com'
                                    })
                                    let address = await WavesKeeper['publicState']()
                                    let Account = await  window['wt']['nodeInteraction']['balanceDetails']( window['wt']['dappaddress'],window['wt']['baseUri'])
                                    Account = Account['regular'] / 100000000
                                    let accountbalanceOut = await  window['wt']['nodeInteraction']['accountDataByKey'](`${address['account']['address']}_balance`, window['wt']['dappaddress'],window['wt']['baseUri'])
                                    accountbalanceOut = accountbalanceOut['value'] / 100000000
                                    let stateOut =  await  window['wt']['nodeInteraction']['balanceDetails']( address['account']['address'],window['wt']['baseUri'])
                                    let balance = +stateOut['regular'] / 100000000
                                    let verify = false
                                    while (verify) {
                                        if (oldBalance === balance) {
                                            stateOut =  await  window['wt']['nodeInteraction']['balanceDetails']( address['account']['address'],window['wt']['baseUri'])
                                            balance = +stateOut['regular'] / 100000000
                                            console.assert(false, balance)
                                            return verify = false;
                                        } else {
                                            console.assert(false, balance)
                                            return verify = true;
                                        }
                                    }

                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.regularBalance').innerText = `waves: ${Account}`
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.balanceAccount').innerText = accountbalanceOut
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#withdraw').value = 0
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#withdraw').placeholder = 'all'
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#withdraw').disabled = false
                                    wavesBalance['waves-auth'][0]['this'].shadowRoot.querySelector('.balance').innerText = ''
                                    wavesBalance['waves-auth'][0]['this'].shadowRoot.querySelector('.balance').innerText = `Waves: ${balance}`
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.withdraw').style.disabled = 'none'
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.withdraw').innerText = 'вывод средств с аккаунта'
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.deposit').style.disabled = 'none'
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#deposit').disabled = false
                                }catch (e) {
                                    let wavesBalance =  await store({
                                        input:'waves-balance',
                                        type:'all'
                                    }, 'get', 'type')
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#withdraw').value = 0
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#withdraw').placeholder = 'all'
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#withdraw').disabled = false
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.withdraw').disabled = false
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.withdraw').innerText = 'вывод средств с аккаунта'
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.deposit').disabled = false
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#deposit').disabled = false
                                    console.warn('error request', e)
                                }
                            }

                        }
                    })
                })


                obj['this'].shadowRoot.querySelector('.deposit').addEventListener('click',async function(event) {
                        let state = await store({
                            input:'state',
                            type:'object'
                        }, 'get', 'type')
                        if(state === null){
                            alert('Войдите под своим аккаунтом')
                        }else {
                            let accountbalance = await  window['wt']['nodeInteraction']['accountDataByKey'](`${state[0]['state']['address']}_balance`, window['wt']['dappaddress'],window['wt']['baseUri'])
                            let deposit = 0
                            if(isEmpty(event.target.shadowRoot.querySelector('#deposit').value)){
                                deposit = +accountbalance['value']
                            }else{
                                deposit =  event.target.shadowRoot.querySelector('#deposit').value * 100000000
                            }

                            if(deposit < 1){
                                alert(' Возможен ввод средств больше или ровно 1 Waves')
                            }else{
                                try {
                                    let wavesBalance =  await store({
                                        input:'waves-balance',
                                        type:'all'
                                    }, 'get', 'type')
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.deposit').style.disabled = 'disabled'
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.deposit').innerText = 'идёт процесс ввода'
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#deposit').value = 0
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#deposit').disabled = true
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.withdraw').style.disabled = 'disabled'
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#withdraw').disabled = true
                                    let tx = await WavesKeeper.signAndPublishTransaction({
                                        type: 16,
                                        data: {
                                            fee: {
                                                "tokens": "0.05",
                                                "assetId": "WAVES"
                                            },
                                            dApp: mainConfig['account']['dappaddress'],
                                            call: {
                                                function: 'deposit',
                                                args: []
                                            }, payment: [{amount:deposit, assetId:null}]
                                        }
                                    })
                                    tx = JSON.parse(tx)
                                    let oldBalance = wavesBalance['waves-auth'][0]['this'].shadowRoot.querySelector('.balance').innerText
                                    oldBalance = +oldBalance.split(':')[1]
                                    await window['wt']['nodeInteraction']['waitForTx'](tx.id,{
                                        apiBase:'https://nodes-testnet.wavesnodes.com'
                                    })
                                    let address = await WavesKeeper['publicState']()
                                    let Account = await  window['wt']['nodeInteraction']['balanceDetails']( window['wt']['dappaddress'],window['wt']['baseUri'])
                                    Account = Account['regular'] / 100000000
                                    let accountbalanceOut = await  window['wt']['nodeInteraction']['accountDataByKey'](`${address['account']['address']}_balance`, window['wt']['dappaddress'],window['wt']['baseUri'])
                                    accountbalanceOut = accountbalanceOut['value'] / 100000000
                                    let stateOut =  await  window['wt']['nodeInteraction']['balanceDetails']( address['account']['address'],window['wt']['baseUri'])
                                    let balance = +stateOut['regular'] / 100000000
                                    let verify = false
                                    while (verify) {
                                        if (oldBalance === balance) {
                                            stateOut =  await  window['wt']['nodeInteraction']['balanceDetails']( address['account']['address'],window['wt']['baseUri'])
                                            balance = +stateOut['regular'] / 100000000
                                            console.assert(false, balance)
                                            verify = false;
                                            return verify
                                        } else {
                                            console.assert(false, balance)
                                            verify = true;
                                            return verify
                                        }
                                    }
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.regularBalance').innerText = `waves: ${Account}`
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.balanceAccount').innerText = accountbalanceOut
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#deposit').value = 0
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#deposit').placeholder = '0'
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.deposit').innerText = 'Ввод средств на аккаунт'
                                    wavesBalance['waves-auth'][0]['this'].shadowRoot.querySelector('.balance').innerText = ''
                                    wavesBalance['waves-auth'][0]['this'].shadowRoot.querySelector('.balance').innerText = `Waves: ${balance}`
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#deposit').disabled = false
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.deposit').disabled = false
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.withdraw').disabled = false
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#withdraw').disabled = false
                                }catch (e) {
                                    let wavesBalance =  await store({
                                        input:'waves-balance',
                                        type:'all'
                                    }, 'get', 'type')
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#deposit').value = 0
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#deposit').placeholder = '0'
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#deposit').disabled = false
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.deposit').disabled = false
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.withdraw').disabled = false
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#withdraw').disabled = false
                                    wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.deposit').innerText = 'Ввод средств на аккаунт'
                                    console.log('error request', e)
                                }
                            }
                        }
                })
            }
        }
    })
