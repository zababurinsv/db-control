let waves = {}
waves['sign'] = {}
waves['issue'] = {}
waves['smart'] = {}
waves['smart']['account'] = {}
waves['smart']['assets'] = {}
waves['order'] = {}
waves['order']['buy'] = {}
waves['order']['sell'] = {}
waves['error'] = {}
waves['WavesKeeper'] = window['WavesKeeper']

function colorLog (message, color, ...args) {
    color = color || 'black'
    switch (color) {
        case 'success':
            color = 'Green'
            break
        case 'info':
            color = 'DodgerBlue'
            break
        case 'error':
            color = 'Red'
            break
        case 'warning':
            color = 'Orange'
            break
        case 'events-out':
            color = 'blue'
            break
        default:
    }
    console.log('%c' + message, 'color:' + color, ...args)
}

/**
 *  alias[4, 30] string - alias
 f  ee MoneyLike -fee
 *  senderPublicKey string - sender's public key in base58
 *  timestamp number/string – time in ms
 *
 * */
waves['createAlias'] = function(obj){
    return new Promise(function (resolve, reject) {
        if(!obj['waves']['alias']){
            let result = window.prompt('введите псевдоним(alias)', null);
            while(result === 'null'){
                result = prompt('введите псевдоним(alias)', null);
            }
            obj['waves']['alias'] = result
        }
        obj['waves']['WavesKeeper'].signAndPublishTransaction({
            type: 10,
            data: {
                alias: obj['waves']['alias'],
                fee: {
                    "tokens": "0.001",
                    "assetId": "WAVES"
                }
            }
        }).then((tx) => {
            obj['waves']['alias'] = JSON.parse(tx)
            obj['waves']['alias'] = obj['waves']['alias']['alias']
        }).catch((error) => {
            let message = {}

            if(!error['data']){
                message = JSON.parse(error['data'])
                message =  message[0]['message']
                let result = window.prompt(`${message} Введите ещё раз`, null);
                while(result === 'null'){
                    result = prompt('введите псевдоним(alias)', null);
                }
                obj['waves']['alias'] = result
                obj['waves']['createAlias'](obj)

            }else{
                message = error['data']
                let result = window.prompt(`${message} Введите ещё раз`, null);
                while(result === 'null'){
                    result = prompt('введите псевдоним(alias)', null);
                }
                obj['waves']['alias'] = result
                obj['waves']['createAlias'](obj)
            }
        });
    })
}

waves['auth'] = async (obj) => {
    return new Promise(function (resolve, reject) {
        const authData = {
            data: "Generated string from server",
            name: "SoundLane",
            icon: "/static/images/icons/apple-touch-icon-180x180.png",
            referrer: "http://127.0.0.1:8887",
            successPath: "/auth"
        };
        obj['waves']['WavesKeeper'].auth(authData).then((data) => {
            //data – data from Waves Keeper
            //verifying signature and saving the address...
            console.log(data);
            resolve(obj)
        }).catch((error) => {
            //processing the error
        });
    })
}
waves['on'] = (obj) => {
    return new Promise(function (resolve, reject) {
        obj['waves']['WavesKeeper'].on("update", state => {
            colorLog('~~~~~~state update~~~~~~','green', state)
            obj['waves']['state'] = state
            resolve(obj)
        });
    })
}

waves['sign']['setTx']= async (obj, params) => {
    return new Promise(function (resolve, reject) {
        if(!params){
            console.warn('устанавливается только для разработки default')
            obj['waves']['sign']['tx'] ={
                type: 4,
                data: {
                    amount: {
                        assetId: "WAVES",
                        tokens: "1.567"
                    },
                    fee: {
                        assetId: "WAVES",
                        tokens: "0.001"
                    },
                    recipient: "test"
                }
            };
        }else{
            obj['waves']['sign']['tx'] ={
                type: 4,
                data: {
                    amount: {
                        assetId: "WAVES",
                        tokens: "1.567"
                    },
                    fee: {
                        assetId: "WAVES",
                        tokens: "0.001"
                    },
                    recipient: "test"
                }
            };
        }
        resolve(obj)
    })
}
waves['sign']['setTxPackage']= async (obj, params) => {
    return new Promise(function (resolve, reject) {
        if(!params){
            console.warn('устанавливается только для разработки default')
            obj['waves']['sign']['namePackage'] = "For Test"
            obj['waves']['sign']['txPackage'] =[{
                type: 4,
                data: {
                    amount: {
                        assetId: "WAVES",
                        tokens: "1.567"
                    },
                    fee: {
                        assetId: "WAVES",
                        tokens: "0.001"
                    },
                    recipient: "test"
                }},{
                type: 4,
                data: {
                    amount: {
                        assetId: "WAVES",
                        tokens: "0.51"
                    },
                    fee: {
                        assetId: "WAVES",
                        tokens: "0.001"
                    },
                    recipient: "merry"
                }
            }];
        }else{
            obj['waves']['sign']['txPackage'] =[{
                type: 4,
                data: {
                    amount: {
                        assetId: "WAVES",
                        tokens: "1.567"
                    },
                    fee: {
                        assetId: "WAVES",
                        tokens: "0.001"
                    },
                    recipient: "test"
                }},{
                type: 4,
                data: {
                    amount: {
                        assetId: "WAVES",
                        tokens: "0.51"
                    },
                    fee: {
                        assetId: "WAVES",
                        tokens: "0.001"
                    },
                    recipient: "merry"
                }
            }];
        }
        resolve(obj)
    })
}

waves['sign']['signTransaction'] =  (obj) => {
    return new Promise(function (resolve, reject) {
        if(!obj){
            alert('нужно послать объект в метод, waves[\'signTransaction\']')
            console.assert(false, 'нужно послать объект в метод')
        }
        if(!obj['waves']['sign']['txData']){
            alert('Должна быть txData')
            console.assert(false, 'Должна быть txData')
        }
        obj['waves']['WavesKeeper'].signTransaction(obj['waves']['sign']['txData'])
            .then((data) => {
                obj['waves']['sign']['signData'] = {}
                obj['waves']['sign']['signData']['json'] = data
                obj['waves']['sign']['signData']['object'] = JSON.parse(data)
                obj['waves']['sign']['error'] = null
                resolve(obj)
            }).catch((error) => {
            obj['waves']['error'] = error
            resolve(obj)
        });
    })
}

waves['sign']['signAndPublishTransaction'] =  (obj) => {
    return new Promise(function (resolve, reject) {
        if(!obj){
            alert('нужно послать объект в метод, waves[\'signTransaction\']')
            console.assert(false, 'нужно послать объект в метод')
        }
        if(!obj['waves']['sign']['txData']){
            alert('Должна быть txData')
            console.assert(false, 'Должна быть txData')
        }
        obj['waves']['WavesKeeper'].signAndPublishTransaction(obj['waves']['sign']['txData'])
            .then((data) => {
                obj['waves']['sign']['signData'] = {}
                obj['waves']['sign']['signData']['json'] = data
                obj['waves']['sign']['signData']['object'] = JSON.parse(data)
                obj['waves']['sign']['error'] = null
                resolve(obj)
            }).catch((error) => {
            obj['waves']['error'] = error
            resolve(obj)
        });
    })
}

waves['sign']['signTransactionPackage'] =  (obj) => {
    return new Promise(function (resolve, reject) {
        if(!obj){
            alert('нужно послать объект в метод, waves[signTransactionPackage](obj)')
            console.assert(false, 'нужно послать объект в метод, waves[signTransactionPackage](obj)')
        }
        if(!obj['waves']['sign']['txPackage']){
            alert('Должна быть txPackage')
            console.assert(false, 'Должна быть txPackage')
        }
        if(!obj['waves']['sign']['namePackage']){
            alert('нужно установить название пакета obj[\'waves\'][\'sign\'][\'namePackage\']')
            console.assert(false, 'нужно установить название пакета obj[\'waves\'][\'sign\'][\'namePackage\']')
        }
        obj['waves']['WavesKeeper'].signTransactionPackage(obj['waves']['sign']['txPackage'], obj['waves']['sign']['namePackage'])
            .then((data) => {
                obj['waves']['sign']['txDataPackage'] = {}
                obj['waves']['sign']['txDataPackage']['object'] = []
                for(let i=0; i < data.length; i++){
                    obj['waves']['sign']['txDataPackage']['object'].push(JSON.parse(data[i]))
                }
                obj['waves']['sign']['txDataPackage']['json'] = data
                obj['waves']['sign']['error'] = null
                resolve(obj)
            }).catch((error) => {
            obj['waves']['error'] = error
            resolve(obj)
        });
    })
}


waves['issue']['issueToken'] =  (obj) => {
    return new Promise(function (resolve, reject) {
        if(!obj){
            alert('нужно послать объект в метод, waves[signTransactionPackage](obj)')
            console.assert(false, 'нужно послать объект в метод, waves[signTransactionPackage](obj)')
        }
        if(!obj['waves']['issue']['newToken']){
            alert('Должна быть obj[\'waves\'][\'issue\'][\'newToken\']')
            console.assert(false, 'Должна быть obj[\'waves\'][\'issue\'][\'newToken\']')
        }else{
            obj['waves']['WavesKeeper'].signAndPublishTransaction(obj['waves']['issue']['newToken'])
                .then((tx) => {
                    let asset = {}
                    obj['waves']['issue']['asset'] = []
                    asset['json'] = tx
                    asset['object'] = JSON.parse(tx)
                    obj['waves']['issue']['asset'].push(asset)
                    resolve(obj)
                }).catch((error) => {
                obj['waves']['error'] = error
                resolve(obj)
            });
        }
    })
}

waves['issue']['setBurnToken'] =  (obj, params = null) => {
    return new Promise(function (resolve, reject) {
        if(params === null){
            console.warn('устанавливается только для разработки default')
            obj['waves']['issue']['burnAsset'] ={
                type: 6,
                data: {
                    amount: 1000000,
                    assetId: "4adufspbKs4BNoDDFAg6N3VfcXpQqorSrUgq99BZtnXk",
                    fee: {
                        "tokens": "0.001",
                        "assetId": "WAVES"
                    }
                }
            };
        }else{
            obj['waves']['sign']['burnAsset'] ={
                type: 6,
                data: {
                    amount: 9595.38,
                    assetId: "DfsMHLMaigppztSTEwnCHdW2km5aSFXQAXBiXNGsDyWQ",
                    fee: {
                        "tokens": "0.001",
                        "assetId": "WAVES"
                    }
                }
            };
        }

        resolve(obj)
    })
}
waves['issue']['burnToken'] =  (obj) => {
    return new Promise(function (resolve, reject) {
        if(!obj){
            alert('нужно послать объект в метод, waves[signTransactionPackage](obj)')
            console.assert(false, 'нужно послать объект в метод, waves[signTransactionPackage](obj)')
        }
        if(!obj['waves']['issue']['burnAsset']){
            alert('Должна быть obj[\'waves\'][\'issue\'][\'burnAsset\']')
            console.assert(false, 'Должна быть obj[\'waves\'][\'issue\'][\'newToken\']')
        }else{
            obj['waves']['WavesKeeper'].signAndPublishTransaction(obj['waves']['issue']['burnAsset'])
                .then((tx) => {
                    let asset = {}
                    obj['waves']['issue']['burnAssetData'] = []
                    asset['json'] = tx
                    asset['object'] = JSON.parse(tx)
                    obj['waves']['issue']['burnAssetData'].push(asset)
                    resolve(obj)
                }).catch((error) => {
                obj['waves']['error'] = error
                resolve(obj)
            });
        }
    })
}
waves['issue']['setToken'] =  (obj, params) => {
    return new Promise(function (resolve, reject) {
        if(!params){
            console.warn('устанавливается только для разработки default')
            obj['waves']['issue']['newToken'] =      {
                type: 3,
                data: {
                    "name": "zArt",
                    "description": "Greate token",
                    "quantity": 1000000,
                    "precision": 2,
                    "reissuable": true,
                    "script": "base64:AQa3b8tH",
                    fee: {
                        "tokens": "1",
                        "assetId": "WAVES"
                    }
                }
            }
        }else{
            obj['waves']['issue']['newToken'] ={
                type: 3,
                data: {
                    "name": "Best Token",
                    "description": "Greate token",
                    "quantity": 1000000,
                    "precision": 2,
                    "reissuable": true,
                    fee: {
                        "tokens": "1",
                        "assetId": "WAVES"
                    }
                }
            }
        }
        resolve(obj)
    })
}

waves['smart']['account']['setScript'] =  (obj, params) => {
    return new Promise(function (resolve, reject) {
        obj['waves']['WavesKeeper'].signAndPublishTransaction(obj['waves']['smart']['account']['script'])
            .then((tx) => {
                let asset = {}
                obj['waves']['smart']['account']['scriptAsset'] = []
                asset['json'] = tx
                asset['object'] = JSON.parse(tx)
                obj['waves']['smart']['account']['scriptAsset'].push(asset)
                resolve(obj)
            }).catch((error) => {
            obj['waves']['error'] = error
            resolve(obj)
        });
        resolve(obj)
    })
}

waves['smart']['account']['createScript'] =  (obj, params) => {
    return new Promise(function (resolve, reject) {
        if(!params){
            console.warn('устанавливается только для разработки default')
            obj['waves']['smart']['account']['script'] ={
                type: 13,
                data: {
                    script: "",
                    fee: {
                        "tokens": "0.01",
                        "assetId": "WAVES"
                    }
                }
            }
        }else{
            obj['waves']['smart']['account']['script'] ={
                type: 13,
                data: {
                    script: "base64:AQa3b8tH",
                    fee: {
                        "tokens": "0.01",
                        "assetId": "WAVES"
                    }
                }
            }
        }
        resolve(obj)
    })
}


waves['smart']['account']['removeScript'] =  (obj, params) => {
    return new Promise(function (resolve, reject) {
        if(!params){
            console.warn('устанавливается только для разработки default')
            obj['waves']['smart']['account']['script'] ={
                type: 13,
                data: {
                    script: "",
                    fee: {
                        "tokens": "0.04",
                        "assetId": "WAVES"
                    }
                }
            }
        }else{
            obj['waves']['smart']['account']['script'] ={
                type: 13,
                data: {
                    script: "base64:AQa3b8tH",
                    fee: {
                        "tokens": "0.01",
                        "assetId": "WAVES"
                    }
                }
            }
        }
        resolve(obj)
    })
}


waves['smart']['assets']['setScript'] =  (obj, params) => {
    return new Promise(function (resolve, reject) {
        obj['waves']['WavesKeeper'].signAndPublishTransaction(obj['waves']['smart']['assets']['script'])
            .then((tx) => {
                let asset = {}
                obj['waves']['smart']['assets']['scriptAsset'] = []
                asset['json'] = tx
                asset['object'] = JSON.parse(tx)
                obj['waves']['smart']['assets']['scriptAsset'].push(asset)
                resolve(obj)
            }).catch((error) => {
            obj['waves']['error'] = error
            resolve(obj)
        });
        resolve(obj)
    })
}

waves['smart']['assets']['createScript'] =  (obj, params) => {
    return new Promise(function (resolve, reject) {
        if(!params){
            console.warn('устанавливается только для разработки default')
            obj['waves']['smart']['assets']['script'] ={
                type: 15,
                data: {
                    assetId: "EHzkEChnHzU4d9xF5uPzpiQqerXjU9ZTYAdQeHRXb8Kb",
                    script: "base64:AQa3b8tH",
                    fee: {
                        "tokens": "1",
                        "assetId": "WAVES"
                    }
                }
            }
        }else{
            obj['waves']['smart']['assets']['script'] ={
                type: 15,
                data: {
                    assetId: "EHzkEChnHzU4d9xF5uPzpiQqerXjU9ZTYAdQeHRXb8Kb",
                    script: "base64:AQa3b8tH",
                    fee: {
                        "tokens": "0.05",
                        "assetId": "WAVES"
                    }
                }
            }
        }
        resolve(obj)
    })
}


waves['smart']['assets']['removeScript'] =  (obj, params) => {
    return new Promise(function (resolve, reject) {
        if(!params){
            console.warn('устанавливается только для разработки default')
            obj['waves']['smart']['assets']['script'] ={
                type: 15,
                data:  {
                    assetId: "EHzkEChnHzU4d9xF5uPzpiQqerXjU9ZTYAdQeHRXb8Kb",
                    script: "",
                    fee: {
                        "tokens": "0.01",
                        "assetId": "WAVES"
                    }
                }
            }
        }else{
            obj['waves']['smart']['assets']['script'] ={
                type: 15,
                data: {
                    script: "base64:AQa3b8tH",
                    fee: {
                        "tokens": "0.01",
                        "assetId": "WAVES"
                    }
                }
            }
        }
        resolve(obj)
    })
}
waves['order']['sell']['sign'] =  (obj, params) => {
    return new Promise(function (resolve, reject) {
        if(!params){
            console.warn('устанавливается только для разработки default')
            obj['waves']['order']['sell']['sign'] ={
                type: 1002,
                data: {
                    matcherPublicKey: "3N5net4nzSeeqxPfGZrvVvnGavsinipQHbE",
                    orderType: "sell",
                    expiration: Date.now() + 100000,
                    amount: {
                        tokens: "100",
                        assetId: "WAVES"
                    },
                    price: {
                        tokens: "0.01",
                        assetId: "8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS"
                    },
                    matcherFee: {
                        tokens: "0.1",
                        assetId: "WAVES"
                    }
                }
            }
        }else{
            obj['waves']['order']['sell']['sign'] ={
                type: 1002,
                data: {
                    matcherPublicKey: params['matcherPublicKey'],
                    orderType: params['orderType'],
                    expiration: params['expiration'],
                    amount: {
                        tokens: params['amount']['tokens'],
                        assetId: params['amount']['assetId']
                    },
                    price: {
                        tokens: params['price']['tokens'],
                        assetId: params['price']['assetId']
                    },
                    matcherFee: {
                        tokens: params['matcherFee']['tokens'],
                        assetId: params['matcherFee']['assetId']
                    }
                }
            }
        }
        resolve(obj)
    })
}

waves['order']['buy']['sign'] =  (obj, params) => {
    return new Promise(function (resolve, reject) {
        if(!params){
            console.warn('устанавливается только для разработки default')
            obj['waves']['order']['buy']['signOrder'] ={
                type: 1002,
                data: {
                    matcherPublicKey: "7kPFrHDiGw1rCm7LPszuECwWYL3dMf6iMifLRDJQZMzy",
                    orderType: "buy",
                    expiration: Date.now() + 100000,
                    amount: {
                        tokens: "100",
                        assetId: "WAVES"
                    },
                    price: {
                        tokens: "0.01",
                        assetId: "8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS"
                    },
                    matcherFee: {
                        tokens: "0.03",
                        assetId: "WAVES"
                    }
                }
            }
        }else{
            obj['waves']['order']['buy']['signOrder'] ={
                type: 1002,
                data: {
                    matcherPublicKey: params['matcherPublicKey'],
                    orderType: params['orderType'],
                    expiration: params['expiration'],
                    amount: {
                        tokens: params['amount']['tokens'],
                        assetId: params['amount']['assetId']
                    },
                    price: {
                        tokens: params['price']['tokens'],
                        assetId: params['price']['assetId']
                    },
                    matcherFee: {
                        tokens: params['matcherFee']['tokens'],
                        assetId: params['matcherFee']['assetId']
                    }
                }
            }
        }
        resolve(obj)
    })
}


waves['order']['signOrder'] =  (obj, params) => {
    return new Promise(function (resolve, reject) {
        if(!obj){
            alert('нужно послать объект в метод, waves[signTransactionPackage](obj)')
            console.assert(false, 'нужно послать объект в метод, waves[signTransactionPackage](obj)')
        }
        if(!obj['waves']['order']['buy']['signOrder'] || obj['waves']['order']['sell']['signOrder']){
            alert('Должна быть obj[\'waves\'][\'order\'][\'sell\'][\'signOrder\']')
            console.assert(false, 'Должна быть obj[\'waves\'][\'order\'][\'sell\'][\'signOrder\']')
        }else{
            let sign = {}
            if(!obj['waves']['order']['buy']['sign']){
                sign = obj['waves']['order']['sell']['signOrder']
            }else{
                sign = obj['waves']['order']['buy']['signOrder']
            }
            if(obj['waves']['order']['sell']['signOrder'] && obj['waves']['order']['buy']['signOrder']){
                console.log('sell', obj['waves']['order']['buy']['signOrder'])
                console.log('buy', obj['waves']['order']['sell']['signOrder'])
                console.assert(false, 'существуют обе записи, такого не должно быть')
            }
            console.assert(false,sign)
            obj['waves']['WavesKeeper'].signOrder(sign)
                .then((tx) => {
                    console.assert(false)
                    let asset = {}
                    obj['waves']['order']['signOrderData'] = []
                    asset['json'] = tx
                    asset['object'] = JSON.parse(tx)
                    obj['waves']['order']['signOrderData'].push(asset)
                    console.assert(false)
                    resolve(obj)
                }).catch((error) => {
                console.assert(false)
                obj['waves']['error'] = error
                resolve(obj)
            });
        }
    })
}

waves['order']['signAndPublishOrder'] =  (obj, params) => {
    return new Promise(function (resolve, reject) {
        if(!obj){
            alert('нужно послать объект в метод, waves[signTransactionPackage](obj)')
            console.assert(false, 'нужно послать объект в метод, waves[signTransactionPackage](obj)')
        }
        if(!obj['waves']['order']['buy']['signOrder'] || obj['waves']['order']['sell']['signOrder']){
            alert('Должна быть obj[\'waves\'][\'issue\'][\'burnAsset\']')
            console.assert(false, 'Должен быть obj[\'waves\'][\'order\'][\'sell\'][\'signOrder\']', obj['waves']['order'])
        }else{
            let sign = {}
            if(!obj['waves']['order']['buy']['signOrder']){
                sign =obj['waves']['order']['sell']['signOrder']
            }else{
                sign =obj['waves']['order']['buy']['signOrder']
            }
            if(obj['waves']['order']['buy']['signOrder'] && obj['waves']['order']['sell']['signOrder']){
                console.log('sell',obj['waves']['order']['buy']['signOrder'])
                console.log('buy', obj['waves']['order']['sell']['signOrder'])
                console.assert(false, 'существуют обе записи, такого не должно быть')
            }
            console.assert(false, sign)
            obj['waves']['WavesKeeper'].signAndPublishOrder(sign)
                .then((tx) => {
                    let asset = {}
                    obj['waves']['order']['signOrderData'] = []
                    asset['json'] = tx
                    asset['object'] = JSON.parse(tx)
                    obj['waves']['order']['signOrderData'].push(asset)
                    resolve(obj)
                }).catch((error) => {
                obj['waves']['error'] = error
                resolve(obj)
            });
        }
    })
}

waves['order']['buy']['signCancel'] =  (obj, params) => {
    return new Promise(function (resolve, reject) {
        if(!params){
            console.warn('устанавливается только для разработки default')
            obj['waves']['order']['buy']['Cancel'] ={
                type: 1003,
                data: {
                    id: '31EeVpTAronk95TjCHdyaveDukde4nDr9BfFpvhZ3Sap'
                }
            }
        }else{
            obj['waves']['order']['buy']['Cancel'] = {
                type: 1003,
                data: {
                    id: '31EeVpTAronk95TjCHdyaveDukde4nDr9BfFpvhZ3Sap'
                }
            }
        }
        resolve(obj)
    })
}

waves['order']['sell']['signCancel'] =  (obj, params) => {
    return new Promise(function (resolve, reject) {
        if(!params){
            console.warn('устанавливается только для разработки default')
            obj['waves']['order']['sell']['Cancel'] ={
                type: 1003,
                data: {
                    id: '31EeVpTAronk95TjCHdyaveDukde4nDr9BfFpvhZ3Sap'
                }
            }
        }else{
            obj['waves']['order']['sell']['Cancel'] = {
                type: 1003,
                data: {
                    id: '31EeVpTAronk95TjCHdyaveDukde4nDr9BfFpvhZ3Sap'
                }
            }
        }
        resolve(obj)
    })
}



waves['order']['signCancelOrder'] =  (obj, params) => {
    return new Promise(function (resolve, reject) {
        if(!obj){
            alert('нужно послать объект в метод, waves[signTransactionPackage](obj)')
            console.assert(false, 'нужно послать объект в метод, waves[signTransactionPackage](obj)')
        }
        if(!obj['waves']['issue']['burnAsset']){
            alert('Должна быть obj[\'waves\'][\'issue\'][\'burnAsset\']')
            console.assert(false, 'Должна быть obj[\'waves\'][\'issue\'][\'newToken\']')
        }else{
            let type = null
            let sign = {}
            if(!obj['waves']['order']['buy']['sign']){
                type = 0
                sign = obj['waves']['order']['buy']['Cancel']
            }else{
                type = 1
                sign = obj['waves']['order']['sell']['Cancel']
            }
            if(obj['waves']['order']['buy']['Cancel'] && obj['waves']['order']['sell']['Cancel']){
                console.log('sell', obj['waves']['order']['sell']['Cancel'])
                console.log('buy', obj['waves']['order']['buy']['Cancel'])
                console.assert(false, 'существуют обе записи, такого не должно быть')
            }
            obj['waves']['WavesKeeper'].signCancelOrder(sign)
                .then((tx) => {
                    switch (type) {
                        case '0':
                            obj['waves']['order']['buy']['signCancelOrderData'] = []
                            asset['json'] = tx
                            asset['object'] = JSON.parse(tx)
                            obj['waves']['order']['buy']['signCancelOrderData'].push(asset)
                            resolve(obj)
                            break
                        case '1':
                            obj['waves']['order']['sell']['signCancelOrderData'] = []
                            asset['json'] = tx
                            asset['object'] = JSON.parse(tx)
                            obj['waves']['order']['sell']['signCancelOrderData'].push(asset)
                            resolve(obj)
                            break
                        default:
                            break
                    }
                }).catch((error) => {
                obj['waves']['error'] = error
                resolve(obj)
            });
        }
        resolve(obj)
    })
}

// waves['order']['signAndPublishOrder'] =  (obj, params) => {
//     return new Promise(function (resolve, reject) {
//         if(!obj){
//             alert('нужно послать объект в метод, waves[signTransactionPackage](obj)')
//             console.assert(false, 'нужно послать объект в метод, waves[signTransactionPackage](obj)')
//         }
//         if(!obj['waves']['issue']['burnAsset']){
//             alert('Должна быть obj[\'waves\'][\'issue\'][\'burnAsset\']')
//             console.assert(false, 'Должна быть obj[\'waves\'][\'issue\'][\'newToken\']')
//         }else{
//             let sign = {}
//             if(!obj['waves']['order']['buy']['signCancel']){
//                 sign = obj['waves']['order']['buy']['signCancel']
//             }else{
//                 sign = obj['waves']['order']['sell']['signCancel']
//             }
//             if(obj['waves']['order']['buy']['signCancel'] && obj['waves']['order']['sell']['signCancel']){
//                 console.log('sell', obj['waves']['order']['sell']['signCancel'])
//                 console.log('buy', obj['waves']['order']['buy']['signCancel'])
//                 console.assert(false, 'существуют обе записи, такого не должно быть')
//             }
//             obj['waves']['WavesKeeper'].signAndPublishOrder(sign)
//                 .then((tx) => {
//                     let asset = {}
//                     obj['waves']['order']['signCancelOrderData'] = []
//                     asset['json'] = tx
//                     asset['object'] = JSON.parse(tx)
//                     obj['waves']['order']['signCancelOrderData'].push(asset)
//                     resolve(obj)
//                 }).catch((error) => {
//                 obj['waves']['error'] = error
//                 resolve(obj)
//             });
//         }
//         resolve(obj)
//     })
// }

waves['getPublicState'] = (obj) => {
    return new Promise(function (resolve, reject) {
        try {
           WavesKeeper.publicState()
                .then((state)=>{
                    colorLog('~~~~~~state~~~~~~','green', state)
                    resolve(state)
                })
        } catch(error) {
            resolve(error)
        }
    })
}

async function init (obj){
    obj['waves'] = {}
    obj['waves']= waves
    await waves['getPublicState'](obj)
    return obj
}

export default waves
