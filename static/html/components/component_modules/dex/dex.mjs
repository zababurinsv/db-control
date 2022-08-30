// import Waves from '/static/html/components/component_modules/waves/index.mjs'
// let waves =  new Waves()
import config from '/static/html/components/component_modules/account/com.waves-ide_config.mjs'

export default {
    get:(obj, payload, ...rest)=>{
            return  new Promise((resolve, reject) => {
                switch (obj['type']) {
                    case 'wavesUsd':
                        ((obj, payload, rest)=>{
                            resolve(new Promise(async (resolve, reject) => {

                            }))
                        })(obj,payload,  rest)
                        break
                    case 'eurUsd':
                        (async (obj, payload, rest)=>{
                            resolve(new Promise(async (resolve, reject) => {
                                try {
                                    let url = `${config['matcher'][`${obj.net}`]}/matcher/orderbook/${obj['pair']['amountAsset']}/${obj['pair']['priceAsset']}?depth=10`
                                    let json = {}
                                    let response =  await fetch(url, {
                                        method: `GET`,
                                        headers: {
                                            'Content-Type': 'application/json'
                                        }
                                    })
                                    if (!response.ok) {
                                        resolve({
                                            _scriptDir: import.meta.url,
                                            status: 'not ok',
                                            success: false,
                                            message: response.status
                                        })
                                    } else {
                                        resolve(await response.json())
                                    }
                                } catch (e) {
                                    resolve({
                                        _scriptDir: import.meta.url,
                                        status: '',
                                        success: false,
                                        message: e
                                    })
                                }
                            }))
                        })(obj,payload,  rest)
                        break
                    case 'tidex':
                        (async (obj, payload, rest)=>{

                            let url = 'https://api.tidex.com/api/3/depth/waves_usdt'
                            await fetch(url, {
                                method: `GET`,
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }).then(function (response) {
                                if (!response.ok) {
                                    throw new Error('HTTP error, status = ' + response.status)
                                } else {
                                    try {
                                        console.log(response.text())
                                        let out = response.json()
                                        return out
                                    } catch (e) {
                                        return response.text()
                                    }
                                }
                            })
                                .then(function (json) {
                                    resolve(json)
                                })
                                .catch(function (error) {
                                    console.assert(false, 'auth', error)
                                })


                        })(obj,payload,  rest)
                        break
                    case 'wavesEuro':
                        (async (obj, payload, rest)=>{
                            resolve(new Promise(async (resolve, reject) => {
                                try {
                                    let url = `${config['matcher'][`${obj.net}`]}/matcher/orderbook/${obj['pair']['amountAsset']}/${obj['pair']['priceAsset']}?depth=10`
                                    let json = {}
                                    let response =  await fetch(url, {
                                        method: `GET`,
                                        headers: {
                                            'Content-Type': 'application/json'
                                        }
                                    })
                                    if (!response.ok) {
                                        reject({
                                            _scriptDir: import.meta.url,
                                            status: '',
                                            success: false,
                                            message: response.status
                                        })
                                    } else {
                                        console.log(await response.text())
                                        resolve(await response.json())
                                    }
                                } catch (e) {
                                    reject({
                                        _scriptDir: import.meta.url,
                                        status: '',
                                        success: false,
                                        message: e
                                    })
                                }
                            }))
                        })(obj,payload,  rest)
                        break
                    case 'tickSize':
                        (async (obj, payload, rest)=>{

                            try {
                                let url = `${config['matcher'][`${obj.net}`]}/orderbook/${obj['pair']['amountAsset']}/${obj['pair']['priceAsset']}/info`
                                let json = {}
                                let response =  await fetch(url, {
                                    method: `GET`,
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                })
                                if (!response.ok) {
                                    reject({
                                        _scriptDir: import.meta.url,
                                        status: '',
                                        success: false,
                                        message: response.status
                                    })
                                } else {
                                    resolve(await response.json())
                                }
                            } catch (e) {
                                reject({
                                    _scriptDir: import.meta.url,
                                    status: '',
                                    success: false,
                                    message: e
                                })
                            }
                        })(obj,payload,  rest)
                        break
                    default:
                        console.assert(false, `новая функция ${obj['type']}`)
                        break
                }
        })
    }
}
