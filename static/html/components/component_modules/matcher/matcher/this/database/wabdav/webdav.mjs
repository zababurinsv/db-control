import conf from '/static/html/components/component_modules/matcher/matcher/this/database/config/index.mjs'
import template from '/static/html/components/component_modules/template/template.mjs'
import utils from '/static/html/components/component_modules/utils/utils.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import Axios from '/static/html/components/component_modules/axios/axios.mjs'
let axios = Axios['default']

function webdav(obj, path,node, method) {
    return new Promise(async (resolve, reject) => {
        function setData( data) {
            return new Promise((resolve, reject) => {
                let formData  = new FormData();
                for(let name in data) {
                    formData.append(name, data[name]);
                }
                resolve(formData)
            })
        }
        switch (method) {
            case 'GET':
                console.log('~~~~~~~~~~~~GET~~~~~~~~~~~~~~~~',`${node}${path}`)
                axios.get(`${node}${path}`)
                    .then(function (response) {
                        obj = {}
                        obj['get_n'] = []
                        obj['mongo'] = response['data']
                        obj['get_n'].push(response['data'])
                        resolve(obj)
                    })
                    .catch(function (error) {
                        // handle error
                        console.log(error);

                    })
                    .finally(function () {
                        resolve({mongo:'null'})
                    });

                break
            case 'POST':
                console.log('~~~~~~~~~~~~POST~~~~~~~~~~~~~~~~',`${node}${path}`)
              let formData = await setData(obj)
                fetch(`${node}${path}`, {
                    method: method,
                    headers: {
                        'mode': 'no-cors'
                    },
                    body: formData
                }).then(function (response) {
                    if (!response.ok) {
                        throw new Error('HTTP error, status = ' + response.status)
                    } else {
                        return response.json()
                    }
                })
                    .then(function (json) {
                        obj = []
                        obj['get_n'] = []
                        obj['mongo'] = json
                        obj['get_n'].push(json)
                        resolve(obj)
                    })
                    .catch(function (error) {
                        console.warn( 'webDav', error, `${node}${path}`)
                        resolve({mongo:'null'})
                    })
                break
            case 'PUT':
                console.log('~~~~~~~~~~~~PUT~~~~~~~~~~~~~~~~',`${node}${path}`)
                let update = await setData(obj)
                // console.assert(false, obj, `${node}${path}`)
                fetch(`${node}${path}`, {
                    method: method,
                    headers: {
                        'mode': 'no-cors'
                    },
                    body: update
                }).then(function (response) {
                    if (!response.ok) {
                        throw new Error('HTTP error, status = ' + response.status)
                    } else {
                        return response.json()
                    }
                })
                    .then(function (json) {
                        obj['get_n'] = []
                        obj['mongo'] = json
                        obj['get_n'].push(json)
                        resolve(obj)
                    })
                    .catch(function (error) {
                        console.warn( 'webDav', error, `${node}${path}`)
                        resolve({mongo:'null'})
                    })
                break
            case 'DELETE':
                console.log('~~~~~~~~~~~~DELETE~~~~~~~~~~~~~~~~',`${node}${path}`)
                fetch(`${node}${path}`, {
                    method: method,
                    headers: {
                        'mode': 'no-cors'
                    },
                }).then(function (response) {
                    if (!response.ok) {
                        throw new Error('HTTP error, status = ' + response.status)
                    } else {
                        return response.json()
                    }
                })
                    .then(function (json) {

                        resolve({delete:'ok'})
                    })
                    .catch(function (error) {
                        console.warn( 'webDav', error, `${node}${path}`)
                        resolve({mongo:'null'})
                    })
                break
            default:
                console.warn(`необрабатываемый тип запроса`, obj[props])
                break
        }
    })
}

export default  (obj, func, ...args)=>{
    return new Promise( function (resolve, reject) {
        let out = (obj) => {
            // console.log('~~~ out  ~~~')
            resolve(obj)
        }
        let err = (error) => {
            console.log('~~~ err  ~~~', error)
            reject(error)
        }
        switch (func) {
            case 'set':
                (async (obj, props,data) => {
                    try {
                        // console.log(`app(${func}[(${obj['input']})${obj[props]}]property)`)
                        switch (obj[props]) {
                            case 'request':
                              await  (async (obj, props,data) => {
                                    try {

                                        out(await webdav(obj['data'], '/setMail', conf['store']['web'], 'POST'))

                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])
                                break
                            case 'components':
                                (async (obj, props,data) => {
                                    try {

                                        if(!obj['path']){
                                            console.assert(false, 'Должно бытьсвойтсво obj["path""]')
                                        }
                                       let object = await webdav(obj['data'], obj['path'], conf['store']['web'], 'POST')

                                        let objectItem = []
                                        objectItem.push(object['mongo']['data'])

                                       let temp =  await template({
                                            input:'wabdav',
                                            data:objectItem,
                                            type:'moderator'
                                        },'create', 'type', data)
                                        out(temp)

                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])
                                break
                            case 'about':

                                        if(!obj['path']){
                                            console.assert(false, 'Должно бытьсвойтсво obj["path""]')
                                        }
                                        // console.assert(false, obj['data'])
                                        let object = await webdav(obj['data'], obj['path'], conf['store']['web'], 'POST')
                                        let objectItem = []



                                        let temp =  await template({
                                            input:'wabdav',
                                            data:object['mongo'],
                                            type:'about'
                                        },'create', 'type')
                                        out(temp)

                                break
                            default:
                                err(`new type [(${func})${obj[props]}]`)
                                break
                        }
                    } catch (e) { err(e) }
                })(obj, args[0], args[1], args[2], args[3])
                break
            case 'post':
                    (async (obj, props,data) => {
                        try {
                            // console.log(`app(${func}[(${obj['input']})${obj[props]}]property)`)
                            switch (obj[props]) {
                                case 'list':
                                   await (async (obj, props,data) => {
                                        try {

                                            if(!obj['path']){
                                                console.assert(false, 'Должно бытьсвойтсво obj["path""]')
                                            }

                                            let object = await webdav(obj['data'], obj['path'], conf['store']['web'], 'POST')
                                            let moderatorArray = []
                                            if(isEmpty(object['mongo'])){


                                            }else{
                                                for(let i = 0 ; i < object['mongo'].length; i++){
                                                    let item = await webdav({
                                                        type:'moderator',
                                                        basename:object['mongo'][i]['basename'],
                                                        filename:object['mongo'][i]['filename']
                                                    }, '/file', conf['store']['web'], 'POST')

                                                    // console.assert(false, )
                                                    moderatorArray.push(item['mongo'])
                                                }

                                            }
                                            let temp =  await template({
                                                input:'wabdav',
                                                data:moderatorArray,
                                                type:'moderator'
                                            },'create', 'type')
                                            out(temp)
                                        } catch (e) { err(e) }
                                    })(obj, args[0], args[1], args[2], args[3])
                                    break
                                default:
                                    err(`new type [(${func})${obj[props]}]`)
                                    break
                            }

                        } catch (e) { err(e) }
                    })(obj, args[0], args[1], args[2], args[3])
                break
            case 'get':
                (async (obj, props,data) => {
                    try {
                        // console.log(`app(${func}[(${obj['input']})${obj[props]}]property)`)
                        switch (obj[props]) {
                            case 'components':
                              await  (async (obj, props,data) => {
                                    try {

                                        if(!obj['path']){
                                            console.assert(false, 'Должно бытьсвойтсво obj["path""]')
                                        }

                                        let object = await webdav(obj['data'], obj['path'], conf['store']['web'], 'GET')

                                        let temp =  await template({
                                            input:'wabdav',
                                            data:object['mongo'],
                                            type:'moderator'
                                        },'create', 'type')
                                        // console.assert(false,temp )
                                        out(temp)
                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])
                                break
                            case 'about':
                               await (async (obj, props,data) => {
                                    try {

                                        if(!obj['path']){
                                            console.assert(false, 'Должно бытьсвойтсво obj["path""]')
                                        }

                                        let object = await webdav(obj['data'], obj['path'], conf['store']['web'], 'GET')
                                        let temp =  await template({
                                            input:'wabdav',
                                            data:object['mongo'],
                                            type:'about'
                                        },'create', 'type')
                                        out(temp)
                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])
                                break
                            case 'aboutString':
                               await (async (obj, props,data) => {
                                    try {

                                        if(!obj['path']){
                                            console.assert(false, 'Должно бытьсвойтсво obj["path""]')
                                        }

                                        let object = await webdav(obj['data'], obj['path'], conf['store']['web'], 'GET')
                                        let description  = await   utils({
                                            input:'template',
                                            data:  object['mongo'],
                                            type:'string2html'
                                        },'convert', 'type')
                                        out(description)
                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])
                                break
                            default:
                                err(`new type [(${func})${obj[props]}]`)
                                break
                        }
                    } catch (e) { err(e) }
                })(obj, args[0], args[1], args[2], args[3])
                break
            case 'delete':
                (async (obj, props,data) => {
                    try {
                        // console.log(`app(${func}[(${obj['input']})${obj[props]}]property)`)
                        switch (obj[props]) {
                            case 'moderator':
                                        if(!obj['path']){
                                            console.assert(false, 'Должно бытьсвойтсво obj["path""]')
                                        }

                                        let object = await webdav(obj['data'], obj['path'], conf['store']['web'], 'DELETE')

                                        out(object)

                                break
                            default:
                                err(`new type [(${func})${obj[props]}]`)
                                break
                        }
                    } catch (e) { err(e) }
                })(obj, args[0], args[1], args[2], args[3])
                break
            case 'update':
                (async (obj, props,data) => {
                    try {
                        // console.log(`app(${func}[(${obj['input']})${obj[props]}]property)`)
                        switch (obj[props]) {
                            case 'components':
                                if(!obj['path']){
                                    console.assert(false, 'Должно бытьсвойтсво obj["path""]')
                                }


                                let object = await webdav(obj['data'], obj['path'], conf['store']['web'], 'PUT')

                                out(object)

                                break
                            default:
                                err(`new type [(${func})${obj[props]}]`)
                                break
                        }
                    } catch (e) { err(e) }
                })(obj, args[0], args[1], args[2], args[3])
                break
            default:
                err(`new function ${func}`)
                break
        }
    })
}
