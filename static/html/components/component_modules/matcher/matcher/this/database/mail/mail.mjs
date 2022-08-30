import conf from '/static/html/components/component_modules/matcher/matcher/this/database/config/index.mjs'

function email(obj, path,node, method) {
    return new Promise((resolve, reject) => {
        bundle['default'](obj,'export', async function (error, config) {

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
                    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~',``)
                    config['axios'].get(`https://${node}${path}`)
                        .then(function (response) {
                            // handle success
                            console.log(response);
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
                            // always executed
                        });

                    break
                case 'POST':

                    let formData = await setData(obj)

                    console.log(`${node}${path}`)
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
                            obj['get_n'] = []
                            obj['mongo'] = json
                            obj['get_n'].push(json)
                            resolve(obj)
                        })
                        .catch(function (error) {
                            console.assert(false, 'mongoDb', error, `${node}${path}`)
                        })
                    break
                case 'PUT':
                    fetch(`${node}${path}`, {
                        method: method,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'mode': 'no-cors'
                        },
                        body: JSON.stringify(obj['data'])
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
                            console.assert(false, 'mongoDb', error)
                        })
                    break
                case 'DELETE':
                    fetch(`${node}${path}`, {
                        method: method,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
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
                            console.error('ошибка в запросе mongo', error)
                            resolve({mongo:'null'})
                        })
                    break
                default:
                    console.warn(`необрабатываемый тип запроса`, obj[props])
                    break
            }

        })

    })
}

export default  (obj, func, ...args)=>{
    return new Promise( function (resolve, reject) {
        let out = (obj) => {
            console.log('~~~ out  ~~~')
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
                                (async (obj, props,data) => {
                                    try {

                                        out(await email(obj['data'], '/setMail', conf['email']['web'], 'POST'))

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
            default:
                err(`new function ${func}`)
                break
        }
    })
}
