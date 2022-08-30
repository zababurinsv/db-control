import iframe from '/static/html/components/component_modules/iframe/iframe.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import Waves from '/static/html/components/component_modules/waves/index.mjs'
import task from '/static/html/components/component_modules/heap/index.mjs'
import config from '/static/html/components/component_modules/account/com.waves-ide_config.mjs'
import Assets from '/static/html/components/crypto-dex/external/assets/index.mjs'
import events from '/static/html/components/crypto-dex/external/events.mjs'
import logs from '/static/html/components/component_modules/colorLog/colorLog.mjs'
// import ltd from '/static/html/components/component_modules/ltd/ltd.mjs'
const waves = new Waves()

function count (obj) {
    let countDownDate = Date.now();
    let x = setInterval(function() {
        let now = Date.now();
        let distance = now - countDownDate;

        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        obj.this.shadowRoot.querySelector('.count-main').innerHTML = days + "d " + hours + "h "
          + minutes + "m " + seconds + "s ";

        if (distance < 0) {
            clearInterval(x);
            obj.this.shadowRoot.querySelector('.count-main').innerHTML = "EXPIRED";
        }
    }, 1000);
}
function pairs(type = undefined) {
    return new Promise(async (resolve, reject) => {
        try {
            let assets =  (await Assets(type)).message
            let testnet = await task.set(true, 'T', 'green', '','/matcher/settings')
            let mainnet = await task.set(true, 'W', 'green', '','/matcher/settings')
            assets.head.matcher.W.matcherPublicKey = mainnet.message.matcherPublicKey
            assets.head.matcher.W.priceAssets = mainnet.message.priceAssets
            assets.head.matcher.T.matcherPublicKey = testnet.message.matcherPublicKey
            assets.head.matcher.T.priceAssets = testnet.message.priceAssets
            assets.head.matcher.S.matcherPublicKey = testnet.message.matcherPublicKey
            assets.head.matcher.S.priceAssets = testnet.message.priceAssets
            for(let type in assets) {
                if(type !== 'head' && type !== 'aside' && type !== 'footer' && type !== 'header' && type !== 'S' && type !== 'orders') {
                    for(let key in assets[type]) {
                        let details = {}
                        if(assets[type][key] !== 'WAVES') {
                            details = await task.set(true,type,'8',assets[type][key],'/assets/details/{assetId}')
                            let name = details.name.split(' ')
                            if(name.length !== 1) {
                                name = `${name[0].substr(0, 1)}-${name[name.length - (name.length -1)]}`
                            } else {
                                name = name[0]
                            }
                            assets.head.decimals[type][key] = details.decimals
                            assets.head.assets[type][key] = name
                            assets.head.assetId[type][`${details.assetId}`] = {}
                            assets.head.assetId[type][`${details.assetId}`]['name'] = name
                            assets.head.assetId[type][`${details.assetId}`]['decimals'] = details.decimals
                            assets.head.assetId[type][`${details.assetId}`]['key'] = key
                        } else {
                            assets.head.assetId[type][`WAVES`] = { }
                            assets.head.assetId[type][`WAVES`]['name'] = 'WAVES'
                            assets.head.assetId[type][`WAVES`]['decimals'] = 8
                            assets.head.assetId[type][`WAVES`]['key'] = key
                            assets.head.decimals[type][key] = 8
                        }
                        for(let assetPair in assets.head.matcher[type].priceAssets) {
                            if(assets[type][key] === assets.head.matcher[type].priceAssets[assetPair]) {
                                assets.head.assetPair[type][key] = parseInt(assetPair, 10)
                            }
                        }
                    }
                }
            }
            for(let type in assets.head.pairs) {
                if(type !== 'S') {
                    for(let pair in assets.head.pairs[type]) {
                        let item = pair.split('/')
                        if(assets.head.assetPair[type][`${item[0]}`] === assets.head.assetPair[type][`${item[1]}`]) {
                            //console.log('gggggggggg',waves.compareUint8Arrays(assets[type][`${item[0]}`], assets[type][`${item[1]}`]))
                        } else {
                            if(assets.head.assetPair[type][`${item[0]}`] > assets.head.assetPair[type][`${item[1]}`]) {
                                assets.head.pairs[type][pair]['amountAsset'] = assets[type][`${item[0]}`]
                                assets.head.pairs[type][pair]['priceAsset'] = assets[type][`${item[1]}`]
                            } else {
                                assets.head.pairs[type][pair]['amountAsset'] = assets[type][`${item[1]}`]
                                assets.head.pairs[type][pair]['priceAsset'] = assets[type][`${item[0]}`]
                            }
                        }
                    }
                }
            }
            assets.head.success = true
            resolve({
                status: 'ok',
                success: true,
                message: assets,
                _scriptDir: import.meta.url
            })
        }catch (e) {
            resolve({
                status: 'not',
                success: false,
                message: e,
                _scriptDir: import.meta.url
            })
        }
    })
}

export default async (v,p,c,obj,r) => {
    events(v,p,c,obj,r)

    // console.assert(false,  (await ltd()).core)
    let dex = (await import('/static/html/components/component_modules/dex/index.mjs'))['default']
    let assets = (await pairs()).message
    let sys = {
        _scriptDir: import.meta.url,
        validation: {
            "onhashchange": (...args) => { return ("onhashchange" in window)  },
            "disabled": {
                "views": {
                    "0": true,
                    "1": true,
                    "2": true,
                    "3": true,
                },
                "trade": {
                    "0": true,
                    "1": true,
                    "2": true,
                    "3": true,
                }
            },
            "input":{
                "amount": true
            },
            "output": {
                "prod": false,
                "amount": true
            },
            "delete": {
                "order": true
            },
            "set": {
                "order": true
            }
        },
        counts: {
            "main": -1
        },
        threshold: {
            "main": 0,
            "amount": 0.01
        },
        navigation: {
            "assets": {
                "success": true,
                "f": 5,
                "s": 5,
                "t": 5
            }
        },
        info: (v = true, item = undefined) => {
            if(typeof v === 'boolean') {
                if (item === undefined) {
                    (!v)
                      ? console.log('system', sys)
                      : console.assert(false, sys)
                } else {
                    sys.console = item;
                    (!v)
                      ? console.log('system', sys)
                      : console.assert(false, sys)
                }
            } else {
                console.assert(false, 'ведите правильное значение м должно быть boolean')
            }
        },
        warn: {
            "s/b": 'нет доступных пар',
            "disable": 'пара отключенна'
        },
        matcher: {
            key: {
              "T":  (await task.set(true,'T','8',{},'/matcher')).message.data,
              "W":  (await task.set(true,'W','8',{},'/matcher')).message.data,
            }
        },
        active: []
    }

    function setTask(v,p,c,s,r) {
        return new Promise(async function (resolve, reject) {
            let req = await task.set(v,p,c,s,r);
            (req.success)
              ? (sys.active.push(s),
                resolve({
                    status: req.status,
                    success: req.success,
                    message: req.message,
                    _scriptDir: req._scriptDir
                }))
              : (resolve({
                  status: req.status,
                  success: req.success,
                  message: req.message,
                  _scriptDir: req._scriptDir
              }))
        })
    }
    function empty(obj,type, disable = false) {
        switch (type) {
            case 'fft':
                obj['this'].shadowRoot.querySelector('div.fb_ft').style.background ='#7694f473'
                obj['this'].shadowRoot.querySelector('div.fs_fs').style.background ='#7694f473'
                obj['this'].shadowRoot.querySelector('div.fb_ts').style.background ='#7694f473'
                obj['this'].shadowRoot.querySelector('#fb_ft').innerHTML = ``
                obj['this'].shadowRoot.querySelector('#fs_fs').innerHTML = ``
                obj['this'].shadowRoot.querySelector('#fb_ts').innerHTML = ``
                obj['this'].shadowRoot.querySelector('#fb_ft').innerHTML = (disable)?`${sys['warn']['disable']}` :`${sys['warn']['s/b']}`
                obj['this'].shadowRoot.querySelector('#fs_fs').innerHTML = (disable)?`${sys['warn']['disable']}` :`${sys['warn']['s/b']}`
                obj['this'].shadowRoot.querySelector('#fb_ts').innerHTML = (disable)?`${sys['warn']['disable']}` :`${sys['warn']['s/b']}`
                break
            case 'ffs':
                obj['this'].shadowRoot.querySelector('div.fb_fs').style.background ='#7694f473'
                obj['this'].shadowRoot.querySelector('div.fs_ft').style.background ='#7694f473'
                obj['this'].shadowRoot.querySelector('div.fb_st').style.background ='#7694f473'
                obj['this'].shadowRoot.querySelector('#fs_ft').innerHTML = ``
                obj['this'].shadowRoot.querySelector('#fb_fs').innerHTML = ``
                obj['this'].shadowRoot.querySelector('#fb_st').innerHTML = ``
                obj['this'].shadowRoot.querySelector('#fs_ft').innerHTML = (disable)?`${sys['warn']['disable']}` :`${sys['warn']['s/b']}`
                obj['this'].shadowRoot.querySelector('#fb_fs').innerHTML = (disable)?`${sys['warn']['disable']}` :`${sys['warn']['s/b']}`
                obj['this'].shadowRoot.querySelector('#fb_st').innerHTML = (disable)?`${sys['warn']['disable']}` :`${sys['warn']['s/b']}`
                break
            case 'ssf':
                obj['this'].shadowRoot.querySelector('div.sb_sf').style.background ='#7694f473'
                obj['this'].shadowRoot.querySelector('div.ss_st').style.background ='#7694f473'
                obj['this'].shadowRoot.querySelector('div.sb_ft').style.background ='#7694f473'
                obj['this'].shadowRoot.querySelector('#sb_sf').innerHTML = ``
                obj['this'].shadowRoot.querySelector('#ss_st').innerHTML = ``
                obj['this'].shadowRoot.querySelector('#sb_ft').innerHTML = ``
                obj['this'].shadowRoot.querySelector('#sb_sf').innerHTML = (disable)?`${sys['warn']['disable']}` :`${sys['warn']['s/b']}`
                obj['this'].shadowRoot.querySelector('#ss_st').innerHTML = (disable)?`${sys['warn']['disable']}` :`${sys['warn']['s/b']}`
                obj['this'].shadowRoot.querySelector('#sb_ft').innerHTML = (disable)?`${sys['warn']['disable']}` :`${sys['warn']['s/b']}`
                break
            case 'ttf':
                obj['this'].shadowRoot.querySelector('div.sb_tf').style.background ='#7694f473'
                obj['this'].shadowRoot.querySelector('div.ss_ts').style.background ='#7694f473'
                obj['this'].shadowRoot.querySelector('div.sb_fs').style.background ='#7694f473'
                obj['this'].shadowRoot.querySelector('#sb_tf').innerHTML = ``
                obj['this'].shadowRoot.querySelector('#ss_ts').innerHTML = ``
                obj['this'].shadowRoot.querySelector('#sb_fs').innerHTML = ``
                obj['this'].shadowRoot.querySelector('#sb_tf').innerHTML = (disable)?`${sys['warn']['disable']}` :`${sys['warn']['s/b']}`
                obj['this'].shadowRoot.querySelector('#ss_ts').innerHTML = (disable)?`${sys['warn']['disable']}` :`${sys['warn']['s/b']}`
                obj['this'].shadowRoot.querySelector('#sb_fs').innerHTML = (disable)?`${sys['warn']['disable']}` :`${sys['warn']['s/b']}`
                break
            default:
                console.assert(false, 'неизвестный тип', type, obj)
                break
        }
    }
    let relation = {
        fee: {
            f: [],
            s: [],
            t: [],
        },
        amount: {
            f: [],
            s: [],
            t: [],
        },
        orderbook: {
            fs: [],
            ft: [],
            st: [],
        },
        orders: {
            "S": JSON.parse(JSON.stringify(assets.orders)),
            "T": JSON.parse(JSON.stringify(assets.orders)),
            "W": JSON.parse(JSON.stringify(assets.orders))
        }
    }
    obj['this'].shadowRoot.querySelector('#left').addEventListener('input',async (e)=>{
        relation.amount['f'][0] =  e.target.value
    },{passive:true})
    obj['this'].shadowRoot.querySelector('#center').addEventListener('input',async (e)=>{
        relation.amount['s'][0] =  e.target.value
    },{passive:true})
    obj['this'].shadowRoot.querySelector('#right').addEventListener('input',async (e)=>{
        relation.amount['t'][0] =  e.target.value
    },{passive:true})
    count(obj)
    //wavesEuro
    //euroUsd
    //wavesUsd
    for(let key in assets.head.pairs.W) {
        let priceAsset = {}
        let amountAsset = {}
        switch (key) {
            case 'f/s':
                priceAsset = assets.head.assetId.W[`${assets.head.pairs.W[key].priceAsset}`].name
                amountAsset = assets.head.assetId.W[`${assets.head.pairs.W[key].amountAsset}`].name
                obj['this'].shadowRoot.querySelector('[for="left"]').insertAdjacentHTML('beforeend', `${assets.head.assetId.W[`${assets.W.f}`].name}`)
                obj['this'].shadowRoot.querySelector('#preview-left').innerText =`${amountAsset}/${priceAsset}`
                break
            case 's/t':
                priceAsset = assets.head.assetId.W[`${assets.head.pairs.W[key].priceAsset}`].name
                amountAsset = assets.head.assetId.W[`${assets.head.pairs.W[key].amountAsset}`].name
                obj['this'].shadowRoot.querySelector('[for="center"]').insertAdjacentHTML('beforeend', `${assets.head.assetId.W[`${assets.W.s}`].name}`)
                obj['this'].shadowRoot.querySelector('#preview-center').innerText =`${amountAsset}/${priceAsset}`
                break
            case 'f/t':
                priceAsset = assets.head.assetId.W[`${assets.head.pairs.W[key].priceAsset}`].name
                amountAsset = assets.head.assetId.W[`${assets.head.pairs.W[key].amountAsset}`].name
                obj['this'].shadowRoot.querySelector('[for="right"]').insertAdjacentHTML('beforeend', `${assets.head.assetId.W[`${assets.W.t}`].name}`)
                obj['this'].shadowRoot.querySelector('#preview-right').innerText =`${amountAsset}/${priceAsset}`
                break
            default:
                break
        }
    }
    let input_id_left = obj['this'].shadowRoot.querySelector('#left').value
    let input_id_center = obj['this'].shadowRoot.querySelector('#center').value
    let input_id_right = obj['this'].shadowRoot.querySelector('#right').value
    function setAssetsAmount(state) {
        if(state) {
            relation.amount['f'][0] = parseFloat((input_id_left))
            relation.amount['s'][0] = parseFloat(input_id_center)
            relation.amount['t'][0] = parseFloat(input_id_right)
        } else {
            relation.amount['f'][0] = sys.navigation.assets.f
            relation.amount['s'][0] = sys.navigation.assets.s
            relation.amount['t'][0] = sys.navigation.assets.t
        }
    };
    (sys.navigation.assets.status)
      ? setAssetsAmount(true)
      : setAssetsAmount(false)
    let timerId = setTimeout(async  function tick() {
        logs(true,'начало цикла','1',assets,'dex')
        // w = first
        // e = second
        // u = third
        relation.orders = {
            "S": JSON.parse(JSON.stringify(assets.orders)),
            "T": JSON.parse(JSON.stringify(assets.orders)),
            "W": JSON.parse(JSON.stringify(assets.orders))
        }
        sys['counts']['main'] ++
        let orderbook_fs = await dex.orderbook(assets.head.pairs.W['f/s'].amountAsset, assets.head.pairs.W['f/s'].priceAsset)
        let orderbook_ft = await dex.orderbook(assets.head.pairs.W['f/t'].amountAsset, assets.head.pairs.W['f/t'].priceAsset)
        let orderbook_st = await dex.orderbook(assets.head.pairs.W['s/t'].amountAsset, assets.head.pairs.W['s/t'].priceAsset)
        while (!orderbook_fs.success) {
            console.warn('запрос fs не сработал')
            orderbook_fs = await dex.orderbook(assets.head.pairs.W['f/s'].amountAsset, assets.head.pairs.W['f/s'].priceAsset)
        }
        while (!orderbook_ft.success) {
            console.warn('запрос ft не сработал')
            orderbook_ft = await  await dex.orderbook(assets.head.pairs.W['f/t'].amountAsset, assets.head.pairs.W['f/t'].priceAsset)
        }
        while (!orderbook_st.success) {
            console.warn('запрос st не сработал')
            orderbook_st =  await dex.orderbook(assets.head.pairs.W['s/t'].amountAsset, assets.head.pairs.W['s/t'].priceAsset)
        }
        orderbook_fs = orderbook_fs.message
        orderbook_ft = orderbook_ft.message
        orderbook_st = orderbook_st.message
        relation.orderbook.fs[0] =  orderbook_fs
        relation.orderbook.ft[0] = orderbook_ft
        relation.orderbook.st[0] =  orderbook_st
        for(let type in relation['fee']) {
            if(assets.W[type] !== 'WAVES') {
                let order_key = (type === 'f')
                  ?'fs'
                  :(type === 's')
                    ?'st'
                    :'ft'
                let amountAsset = relation.orderbook[order_key][0].pair.amountAsset
                let priceAsset = relation.orderbook[order_key][0].pair.priceAsset
                let amountDecimals = assets.head.assetId.W[`${amountAsset}`].decimals
                let priceDecimals = assets.head.assetId.W[`${priceAsset}`].decimals
                relation['fee'][type][0] = (1/dex.denormalize(relation.orderbook[order_key][0].asks[0]['price'],amountDecimals,priceDecimals))*0.003
            } else {
                relation['fee'][type][0] = 0.003
            }
        };
        sys.validation.disabled.trade[0] = false;
        sys.validation.disabled.trade[1] = false;
        sys.validation.disabled.trade[2] = false;
        sys.validation.disabled.trade[3] = false;
        (!sys.validation.disabled.trade[0])
        ? (relation.orders.W.fft = undefined)
        : '';
        (!sys.validation.disabled.trade[1])
        ? (relation.orders.W.ffs = undefined)
        : '';
        (!sys.validation.disabled.trade[2])
        ? (relation.orders.W.ssf = undefined)
        : '';
        (!sys.validation.disabled.trade[3])
        ? (relation.orders.W.ttf = undefined)
        : '';
// new item 1
        if(relation.orders.W.ffs !== undefined) {
            assets = await dex.fb_fs(true, {
                self: relation,
                orderbook: orderbook_fs,
                amount: {
                    f:undefined,
                    s:relation.amount.f[0]
                },
                fee: {
                    f:relation.fee.f[0],
                    s:relation.fee.s[0]
                },
                amountAsset: assets.head.pairs.W['f/s']['amountAsset'],
                priceAsset: assets.head.pairs.W['f/s']['priceAsset'],
                view: obj['this'].shadowRoot.querySelector('#fb_fs')
            },'green',assets , 'fs');
            if(relation.orders.W.ffs !== undefined) {
                assets = await dex.fs_ft(false, {
                    self: relation,
                    orderbook: orderbook_ft,
                    amount: {
                        f: relation.orders.W.ffs[0]['buy(fs)']['amount']['_'],
                        t: undefined
                    },
                    fee: {
                        f:undefined,
                        t:relation.fee.t[0]
                    },
                    amountAsset: assets.head.pairs.W['f/t']['amountAsset'],
                    priceAsset: assets.head.pairs.W['f/t']['priceAsset'],
                    view: obj['this'].shadowRoot.querySelector('#fs_ft')
                },'green',assets , 'ft');

                if(relation.orders.W.ffs !== undefined) {
                    assets = await dex.fb_st(false, {
                        self: relation,
                        orderbook: orderbook_st,
                        amount: {
                            t: relation.orders.W.ffs[1]['sell(ft)']['amount']['_'],
                            s: undefined,
                        },
                        fee: {
                            t: undefined,
                            s: relation.fee.s[0]
                        },
                        amountAsset: assets.head.pairs.W['s/t']['amountAsset'],
                        priceAsset: assets.head.pairs.W['s/t']['priceAsset'],
                        view: obj['this'].shadowRoot.querySelector('#fb_st')
                    },'green',assets , 'st');
                    if(relation.orders.W.ffs === undefined) {
                        empty(obj, 'ffs')
                    }
                } else {
                    empty(obj, 'ffs')
                }
            }  else {
                empty(obj, 'ffs')
            }
        } else {
            empty(obj, 'ffs', true)
        }
// new item 2
        if(relation.orders.W.fft !== undefined) {
        assets = await dex.fb_ft(false, {
            self: relation,
            orderbook: orderbook_ft,
            amount: {
                f:undefined,
                t:relation.amount.t[0]
            },
            fee: {
                f:relation.fee.f[0],
                t:relation.fee.t[0]
            },
            amountAsset: assets.head.pairs.W['f/t']['amountAsset'],
            priceAsset: assets.head.pairs.W['f/t']['priceAsset'],
            view: obj['this'].shadowRoot.querySelector('#fb_ft')
        },'green',assets , 'ft');
            if(relation.orders.W.fft !== undefined) {
                assets = await dex.fs_fs(false, {
                    self: relation,
                    orderbook: orderbook_fs,
                    amount: {
                        f: relation.orders.W.fft[0]['buy(ft)']['amount']['_'],
                        s: undefined
                    },
                    fee: {
                        f:undefined,
                        s:relation.fee.s[0]
                    },
                    amountAsset: assets.head.pairs.W['f/s']['amountAsset'],
                    priceAsset: assets.head.pairs.W['f/s']['priceAsset'],
                    view: obj['this'].shadowRoot.querySelector('#fs_fs')
                },'green',assets , 'fs');

                if(relation.orders.W.fft !== undefined) {
                    assets = await dex.fb_ts(false, {
                        self: relation,
                        orderbook: orderbook_st,
                        amount: {
                            t: undefined,
                            s: relation.orders.W.fft[1]['sell(fs)']['amount']['s'],
                        },
                        fee: {
                            t:relation.fee.t[0],
                            s:undefined
                        },
                        amountAsset: assets.head.pairs.W['s/t']['amountAsset'],
                        priceAsset: assets.head.pairs.W['s/t']['priceAsset'],
                        view: obj['this'].shadowRoot.querySelector('#fb_ts')
                    },'green',assets , 'ts');

                    if(relation.orders.fft === undefined) {
                        empty(obj, 'fft')
                    }
                } else {
                    empty(obj, 'fft')
                }
            } else {
                empty(obj, 'fft')
            }

        } else {
            empty(obj, 'fft', true)
        }
// new item 3
        if(relation.orders.W.ssf !== undefined) {
                assets = await dex.sb_sf(false, {
            self: relation,
            orderbook: orderbook_fs,
            amount: {
                s:undefined,
                f:relation.amount.f[0]
            },
            fee: {
                s:relation.fee.s[0],
                f:relation.fee.f[0]
            },
            amountAsset: assets.head.pairs.W['f/s']['amountAsset'],
            priceAsset: assets.head.pairs.W['f/s']['priceAsset'],
            view: obj['this'].shadowRoot.querySelector('#sb_sf')
        },'green',assets , 'sf');

            if(relation.orders.W.ssf !== undefined) {
                if(relation.orders.ssf !== undefined) {

                    if(relation.orders.W.ssf === undefined) {
                        empty(obj, 'ssf')
                    }
                } else {
                    empty(obj, 'ssf')
                }
            } else {
                empty(obj, 'ssf')
            }
        } else {
            empty(obj, 'ssf', true)
        }
// new item 4
        if(relation.orders.W.ttf !== undefined) {
            assets = await dex.sb_tf(false, {
            self: relation,
            orderbook: orderbook_ft,
            amount: {
                t:undefined,
                f:relation.amount.f[0]
            },
            fee: {
                t:relation.fee.t[0],
                f:relation.fee.f[0]
            },
            amountAsset: assets.head.pairs.W['f/t']['amountAsset'],
            priceAsset: assets.head.pairs.W['f/t']['priceAsset'],
            view: obj['this'].shadowRoot.querySelector('#sb_tf')
        },'green',assets , 'tf');
            if(relation.orders.W.ttf !== undefined) {
                assets = await dex.ss_ts(false, {
                    self: relation,
                    orderbook: orderbook_st,
                    amount: {
                        t: relation.orders.W.ttf[0]['buy(tf)']['amount']['_'],
                        s: undefined
                    },
                    fee: {
                        t:relation.fee.t[0],
                        s:relation.fee.s[0]
                    },
                    amountAsset: assets.head.pairs.W['s/t']['amountAsset'],
                    priceAsset: assets.head.pairs.W['s/t']['priceAsset'],
                    view: obj['this'].shadowRoot.querySelector('#ss_ts')
                },'green',assets , 'ts');
                    if(relation.orders.ttf !== undefined) {
                        assets = await dex.sb_fs(false, {
                            self: relation,
                            orderbook: orderbook_fs,
                            amount: {
                                f: undefined,
                                s: relation.orders.W.ttf[1]['sell(ts)']['amount']['_']
                            },
                            fee: {
                                f:relation.fee.f[0],
                                s:relation.fee.s[0]
                            },
                            amountAsset: assets.head.pairs.W['f/s']['amountAsset'],
                            priceAsset: assets.head.pairs.W['f/s']['priceAsset'],
                            view: obj['this'].shadowRoot.querySelector('#sb_fs')
                        },'green',assets , 'fs');
                        if(relation.orders.ttf === undefined) {
                            empty(obj, 'ttf')
                        }
                    } else {
                        empty(obj, 'ttf')
                    }
                } else {
                empty(obj, 'ttf')
            }
        } else {
            empty(obj, 'ttf', true)
        }
//## get order
//         let timestamp = config['timestamp']()
//         let signature = await task.set(true,'T','8',{
//             seed: config['accountsStore']['accountGroups']['T']['clients'][3]['seed'],
//             publicKey: config['accountsStore']['accountGroups']['T']['clients'][3]['publicKey'],
//             timestamp: timestamp.now
//         },'/assets/signature/{assetId}');
//         let orders = await  task.set(true, {
//             timestamp:timestamp.now,
//             signature:signature,
//             type:'T'
//         },'7',{
//             property:'получаем ордера',
//             publicKey:config['accountsStore']['accountGroups']['T']['clients'][3]['publicKey'],
//             relation:'T'
//         },'/matcher/orderbook/{publicKey}');
//         sys.orders = orders
//         if(orders.success) {
//             for(let i =0; i < orders.message.length; i++) {
//             }
//             console.log('active orders:', orders.message)
//         } else {
//             console.warn(orders.message)
//         }
//         sys.validation.set.order = true
//         sys.validation.delete.order = false
//         if(sys.validation.set.order) {
//             let timestamp = config['timestamp']();
//             let signature = await task.set(true,'T','8',{
//                 seed: config['accountsStore']['accountGroups']['T']['clients'][3]['seed'],
//                 publicKey: config['accountsStore']['accountGroups']['T']['clients'][3]['publicKey'],
//                 timestamp:  timestamp.now
//             },'/assets/signature/{assetId}');
            // console.assert(false, sys.relation.transactions)
          // let order = await setTask(true, 'T', 'red', sys.relation.transactions.wuw, '/matcher/orderbook');
        // }

        // if(sys.validation.delete.order) {
        //     if(!isEmpty(orders.message)) {
        //         let timestamp = config['timestamp']()
        //         let signature = await task.set(true,'T','8',{
        //             seed: config['accountsStore']['accountGroups']['T']['clients'][3]['seed'],
        //             publicKey: config['accountsStore']['accountGroups']['T']['clients'][3]['publicKey'],
        //             timestamp: timestamp.now
        //         },'/assets/signature/{assetId}');
        //         let object = JSON.stringify({
        //             sender: config['accountsStore']['accountGroups']['T']['clients'][3]['publicKey'],
        //             timestamp: timestamp.now,
        //             signature: signature,
        //             orderId: null
        //         })
        //        let cancelOrder = await setTask(true, 'T','7',object,'/matcher/orderbook/cancel')
        //     }
        // }
    let views = {
            "0": () => {
                if(relation['description']['ueu'][0] - relation['description']['ueu'][3] < 0){
                    setTask(true, 'T', 'red', sys.relation.transactions.ueu, '/matcher/orderbook')
                    obj['this'].shadowRoot.querySelector('#total').insertAdjacentHTML('beforeend',`<p>${JSON.stringify(relation['description']['ueu'], null, 2)}</p>`)
                    obj['this'].shadowRoot.querySelector('div.fb_ft').style.background ='#f476b673'
                    obj['this'].shadowRoot.querySelector('div.fs_fs').style.background ='#f476b673'
                    obj['this'].shadowRoot.querySelector('div.fb_ts').style.background ='#f476b673'
                }else{
                    obj['this'].shadowRoot.querySelector('div.fb_ft').style.background ='#7694f473'
                    obj['this'].shadowRoot.querySelector('div.fs_fs').style.background ='#7694f473'
                    obj['this'].shadowRoot.querySelector('div.fb_ts').style.background ='#7694f473'
                }
            },
            "1": () => {
                if(relation['description']['eue'][0] - relation['description']['eue'][3] < 0){
                    setTask(true, 'T', 'red', sys.relation.transactions.eue, '/matcher/orderbook')
                    obj['this'].shadowRoot.querySelector('#total').insertAdjacentHTML('beforeend',`<p>${JSON.stringify(relation['description']['eue'], null, 2)}</p>`)
                    obj['this'].shadowRoot.querySelector('div.fb_fs').style.background ='#f476b673'
                    obj['this'].shadowRoot.querySelector('div.fs_ft').style.background ='#f476b673'
                    obj['this'].shadowRoot.querySelector('div.fb_st').style.background ='#f476b673'
                }else{
                    obj['this'].shadowRoot.querySelector('div.fb_fs').style.background ='#7694f473'
                    obj['this'].shadowRoot.querySelector('div.fs_ft').style.background ='#7694f473'
                    obj['this'].shadowRoot.querySelector('div.fb_st').style.background ='#7694f473'
                }
            },
        "2": () => {
            if(relation['description']['wuw'][0] - relation['description']['wuw'][3] < 0){
                setTask(true, 'T', 'red', sys.relation.transactions.wuw, '/matcher/orderbook')
                obj['this'].shadowRoot.querySelector('#total').insertAdjacentHTML('beforeend',`<p>${JSON.stringify(relation['description']['wuw'], null, 2)}</p>`)
                obj['this'].shadowRoot.querySelector('div.sb_sf').style.background ='#f476b673'
                obj['this'].shadowRoot.querySelector('div.ss_st').style.background ='#f476b673'
                obj['this'].shadowRoot.querySelector('div.sb_ft').style.background ='#f476b673'
            }else{
                obj['this'].shadowRoot.querySelector('div.sb_sf').style.background ='#7694f473'
                obj['this'].shadowRoot.querySelector('div.ss_st').style.background ='#7694f473'
                obj['this'].shadowRoot.querySelector('div.sb_ft').style.background ='#7694f473'
            }
        },
        "3": () => {
            if(relation['description']['wew'][0] - relation['description']['wew'][3] < 0){
                setTask(true, 'T', 'red', sys.relation.transactions.wew, '/matcher/orderbook')
                obj['this'].shadowRoot.querySelector('#total').insertAdjacentHTML('beforeend',`<p>${JSON.stringify(relation['description']['wew'], null, 2)}</p>`)
                obj['this'].shadowRoot.querySelector('div.sb_tf').style.background ='#f476b673'
                obj['this'].shadowRoot.querySelector('div.ss_ts').style.background ='#f476b673'
                obj['this'].shadowRoot.querySelector('div.sb_fs').style.background ='#f476b673'
            }else{
                obj['this'].shadowRoot.querySelector('div.sb_tf').style.background ='#7694f473'
                obj['this'].shadowRoot.querySelector('div.ss_ts').style.background ='#7694f473'
                obj['this'].shadowRoot.querySelector('div.sb_fs').style.background ='#7694f473'
            }
        }
    };
    // (sys['validation']['disabled']['views'][0])
    //   ? (views[0]())
    //   : '';
    // (sys['validation']['disabled']['views'][1])
    //   ? (views[1]())
    //   : '';
    // (sys['validation']['disabled']['views'][2])
    //   ? (views[2]())
    //   : '';
    // (sys['validation']['disabled']['views'][3])
    //   ? (views[3]())
    //   : '';
        // sys.info(false)
        let update = async (v,p,c,s,r) => {
            for(let i=0; i < 10;i++) {
                // console.assert(false, s.relation.orderbook.fs[0])
                let priceAsset = s.relation.orderbook.fs[0]['pair'].priceAsset
                let amountAsset = s.relation.orderbook.fs[0]['pair'].amountAsset
                let amountDecimals = assets.head.assetId.W[`${amountAsset}`].decimals
                let priceDecimals = assets.head.assetId.W[`${priceAsset}`].decimals
                if(s.relation.orderbook.fs[0]['asks'][i] !== undefined) {
                    obj['this'].shadowRoot.querySelector('#ask_fs').children[i].innerText = `${ dex.denormalize(s.relation.orderbook.fs[0]['asks'][i].price,amountDecimals,priceDecimals) }`
                }
                if(s.relation.orderbook.fs[0]['bids'][i] !== undefined) {
                    obj['this'].shadowRoot.querySelector('#bid_fs').children[i].innerText =`${ dex.denormalize(s.relation.orderbook.fs[0]['bids'][i].price,amountDecimals,priceDecimals) }`
                }
                priceAsset = s.relation.orderbook.ft[0]['pair'].priceAsset
                amountAsset = s.relation.orderbook.ft[0]['pair'].amountAsset
                amountDecimals = assets.head.assetId.W[`${amountAsset}`].decimals
                priceDecimals = assets.head.assetId.W[`${priceAsset}`].decimals
                if(s.relation.orderbook.ft[0]['asks'][i] !== undefined) {
                    obj['this'].shadowRoot.querySelector('#ask_ft').children[i].innerText =`${ dex.denormalize(s.relation.orderbook.ft[0]['asks'][i].price,amountDecimals,priceDecimals) }`
                }
                if(s.relation.orderbook.ft[0]['bids'][i] !== undefined) {
                    obj['this'].shadowRoot.querySelector('#bid_ft').children[i].innerText = `${ dex.denormalize(s.relation.orderbook.ft[0]['bids'][i].price,amountDecimals,priceDecimals) }`
                }

                priceAsset = s.relation.orderbook.st[0]['pair'].priceAsset
                amountAsset = s.relation.orderbook.st[0]['pair'].amountAsset
                amountDecimals = assets.head.assetId.W[`${amountAsset}`].decimals
                priceDecimals = assets.head.assetId.W[`${priceAsset}`].decimals
                if(s.relation.orderbook.st[0]['asks'][i] !== undefined) {
                    obj['this'].shadowRoot.querySelector('#ask_st').children[i].innerText =`${ dex.denormalize(s.relation.orderbook.st[0]['asks'][i].price,amountDecimals,priceDecimals) }`
                }
                if(s.relation.orderbook.st[0]['bids'][i] !== undefined) {
                    obj['this'].shadowRoot.querySelector('#bid_st').children[i].innerText = `${ dex.denormalize(s.relation.orderbook.st[0]['bids'][i].price,amountDecimals,priceDecimals) }`
                }
                obj['this'].shadowRoot.querySelector('#timestamp_fs').innerText = s.relation.orderbook.fs[0].timestamp
                obj['this'].shadowRoot.querySelector('#delta_fs').innerText = Date.now() - s.relation.orderbook.fs[0].timestamp
                obj['this'].shadowRoot.querySelector('#timestamp_ft').innerText = s.relation.orderbook.ft[0].timestamp
                obj['this'].shadowRoot.querySelector('#delta_ft').innerText = Date.now() - s.relation.orderbook.ft[0].timestamp
                obj['this'].shadowRoot.querySelector('#timestamp_st').innerText = s.relation.orderbook.st[0].timestamp
                obj['this'].shadowRoot.querySelector('#delta_st').innerText = Date.now() - s.relation.orderbook.st[0].timestamp
            }
            return true
        }
        logs(true,'end', '1',{
            assets:assets,
            relation: relation
        },'dex')
        update(true, obj,'red',{
            assets:assets,
            relation: relation
        }, 'update')
        timerId = setTimeout(tick, 3000);
    }, 3000);
}
