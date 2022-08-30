// import colorlog from '/static/html/components/component_modules/colorLog/colorLog.mjs'
import waves from '/static/html/components/component_modules/bundle/waves/waves.index.mjs'
import config from '/static/html/components/component_modules/account/com.waves-ide_config.mjs'
// import task from '/static/html/components/component_modules/heap/index.mjs'
import Axios from '/static/html/components/component_modules/axios/axios.mjs'
let axios = Axios['default']

let system = {
    net: 'W',
    wvs: 10 ** 8
}

export default class Waves {
    constructor() {
        this.bank = this.bank.bind(this)
        this.matcher = this.matcher.bind(this)
        this.settings = this.settings.bind(this)
        this.balance = this.balance.bind(this)
        this.wallet = this.wallet.bind(this)
        this.faucet = this.faucet.bind(this)
        this.transfer = this.transfer.bind(this)
        this.createNFT = this.createNFT.bind(this)
        this.getNFT = this.getNFT.bind(this)
        this.denormalize = this.denormalize.bind(this)
        this.details = this.details.bind(this)
        this.waitForTx = this.waitForTx.bind(this)
        this.end = this.end.bind(this)
        this.order = this.order.bind(this)
        this.cancelAllOrders = this.cancelAllOrders.bind(this)
        this.getOrders = this.getOrders.bind(this)
        this.UserException = this.UserException.bind(this)
        this.amountNormalize = this.amountNormalize.bind(this)
        this.compareUint8Arrays = this.compareUint8Arrays.bind(this)
    }

    compareUint8Arrays(arr1, arr2) {
        //  true    - arr1 bigger
        //  false    - arr2 bigger
        let item1 = waves.base58.decode(arr1)
        let item2 = waves.base58.decode(arr2)
        return item1.toString('hex') > item2.toString('hex');
    }

    matcher(view = true,property='T',color = 'black', substrate={ },relation='matcher'  ) {
        return new Promise(async (resolve, reject) => {
            try {
                let request = {
                    method: 'get',
                    url: `${config['matcher'][`${property}`][0]}/matcher`,
                }
                let  key = await axios(request)
                resolve({
                    status: 'ok',
                    success: true,
                    message: key,
                    _scriptDir: import.meta.url
                })
            } catch (e) {
                resolve({
                    status:false,
                    message: e,
                    success: false,
                    _scriptDir: import.meta.url
                })
            }
        })
    }

    settings(view = true,property='T',color = 'black', substrate={ },relation='matcher'  ) {
        return new Promise(async (resolve, reject) => {
            await axios({
                method: 'get',
                url: `${config['matcher'][`${property}`][0]}/matcher/settings`,
            })
            .then(function (res) {
                resolve({
                    status: true,
                    success: true,
                    message: res.data,
                    _scriptDir: import.meta.url
                })
            })
            .catch(function (e) {
                resolve({
                    status:false,
                    message: e,
                    success: false,
                    _scriptDir: import.meta.url
                })
            });
        })
    }

    UserException(message) {
        this.message = message;
        this._scriptDir = import.meta.url;
    }

    createNFT(view = true,property='a',color = 'black', substrate={_:'button'},relation='transfer'  ) {
        return new Promise(async (resolve, reject) => {
            try {
                let message = false
                let tokenParamsCustomIndivisible = {
                    name: substrate.name,
                    quantity: 1,
                    decimals: 0,
                    reisuable: false,
                    chainId: config[`${system.net}`],
                    description: substrate.description,
                }

                const signedIssueTx = waves.transactions.issue(
                  tokenParamsCustomIndivisible,
                  config['accountsStore']['accountGroups'][`${system.net}`]['seed'])

                const txObjectSignedTwo = waves.transactions.issue(
                  signedIssueTx,
                  config['accountsStore']['accountGroups'][`${system.net}`]['clients'][0]['seed'])

                const txObjectSignedThre = waves.transactions.issue(
                  txObjectSignedTwo,
                  config['accountsStore']['accountGroups'][`${system.net}`]['clients'][1]['seed'])

                message = await waves.transactions.broadcast(txObjectSignedThre, config[`${system.net}`][0])

                await waves.transactions.waitForTx(message.id,{
                    apiBase: config[`${system.net}`][0]
                })
                resolve({
                    status: true,
                    success: true,
                    message: message,
                    _scriptDir: import.meta.url
                })
            }catch (e) {
                resolve({
                    status:false,
                    message: e,
                    success: false,
                    _scriptDir: import.meta.url
                })
            }
        })
    }

    getNFT(address='', limit = 1, after = undefined, type){
        return new Promise(async (resolve, reject)=>{
           try {
               console.assert(false)
            let balance = {}
            if(after === undefined){
                balance = await fetch(`${config[`${type}`][0]}/assets/nft/${address}/limit/${limit}`)
            }else{
                balance = await fetch(`${config[`${type}`][0]}/assets/nft/${address}/limit/${limit}?after=${after}`)
            }
            resolve({
                _scriptDir: import.meta.url,
                status: 'ok',
                success: true,
                message:await balance.json()
            })
            }catch(e) {
                resolve({
                    _scriptDir: import.meta.url,
                    status: false,
                    success: false,
                    message: e
                })
           }
        })
    }

    getOrders(view = true,property='',color = 'black', substrate={_:'order'},relation='order'  ){
        return new Promise(async (resolve, reject)=>{
            try {
                let orders = {}
                orders  = await fetch(`${config['matcher'][`${property.type}`][0]}/matcher/orderbook/${substrate}?activeOnly=true`,{
                    method: 'GET',
                    headers:{
                        Timestamp:property['timestamp'],
                        Signature:property['signature'],
                    }

                })
                orders = await orders.json()
                resolve({
                    _scriptDir: import.meta.url,
                    status: 'ok',
                    success: true,
                    message: orders
                })
            } catch (e) {
                resolve({
                    _scriptDir: import.meta.url,
                    status: 'error',
                    success: false,
                    message: e
                })
            }
        })
    }

    cancelAllOrders(view = true,property='',color = 'black', substrate={_:'order'},relation='order'  ){
        return new Promise(async (resolve, reject)=>{
         try {
             let request = {
                 method: 'post',
                 url: `${config['matcher'][`${property}`][0]}/matcher/orderbook/cancel`,
                 data:substrate,
                 headers: {
                     'Content-Type': 'application/json;charset=utf-8'
                 },
             }
             let  order = await axios(request)
             resolve({
                _scriptDir: import.meta.url,
                status: 'ok',
                message: order.data,
                success: true,
             })
             } catch (e) {
                resolve({
                    _scriptDir: import.meta.url,
                    status: 'not ok',
                    success: false,
                    message: e
                })
             }
        })
    }

    order(view = true,property='',color = 'black', substrate={_:'order'},relation='order'  ){
        return new Promise(async (resolve, reject)=>{
            let order = {
                amount: substrate.amount,
                price: substrate.price,
                priceAsset: substrate.assets.priceAsset,
                amountAsset: substrate.assets.amountAsset,
                matcherPublicKey: substrate.matcherPublicKey,
                orderType: substrate.orderType
            }
            order = waves.order(order, config['accountsStore']['accountGroups']['T']['clients'][3]['seed'])
          console.assert(false, JSON.stringify(order))
            axios({
                method: 'post',
                url: `${config['matcher'][`${property}`][0]}/matcher/orderbook`,
                data: order,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
            }).then(function (res) {
                  resolve({
                      _scriptDir: import.meta.url,
                      status: res.data.status,
                      success: res.data.success,
                      message: res.data.message
                  })
              })
              .catch(function (e) {
                  resolve({
                      _scriptDir: import.meta.url,
                      status: 'not ok',
                      success: false,
                      message: e
                  })
              });
        })
    }

    denormalize(price, priceAssetDecimals, amountAssetDecimals){
        let wvsPrice = 10 ** (priceAssetDecimals - amountAssetDecimals + 8)
        return price/wvsPrice
    }

    normalize(price, amountAssetDecimals, priceAssetDecimals){
        let wvsPrice = 10 ** (8 + priceAssetDecimals - amountAssetDecimals)
        return price * wvsPrice
    }

    amountNormalize(amount, decimals) {
        return amount * 10 ** decimals
    }

    details(v,p,c,s,r){
        return new Promise(async (resolve, reject)=>{
            try {
                let balance = await fetch(`${config[`${p}`][0]}/assets/details/${s}`)
                balance = await balance.json()
                resolve(Object.assign(balance, {
                    _scriptDir: import.meta.url,
                    status: 'ok',
                    success: true,
                    message: 'waves.mjs'
                }))
            } catch (e) {
                resolve({
                    _scriptDir: import.meta.url,
                    status: false,
                    success: false,
                    message: e
                })
            }
        })
    }

    balance(id){
        return new Promise(async (resolve, reject)=>{
            try {
                let balance = await fetch(`${config[`${system.net}`][0]}/addresses/balance/${id}`)
                balance = await balance.json()
                resolve({
                    status: 'ok',
                    success: true,
                    message: balance,
                    _scriptDir: import.meta.url
                })
            } catch (e) {
                resolve({
                    status: 'not ok',
                    success: false,
                    message: e,
                    _scriptDir: import.meta.url
                })
            }
        })
    }

    transfer(console = true,property='a',color = 'black', substrate={_:'button'},relation='transfer'  ){
        // return queue(console, property,color,substrate,relation)
    }

    faucet(console = true,property='a',color = 'black', substrate={_:'button'},relation='faucet'  ){
        // return queue(console, property,color,substrate,relation)
    }

    bank(console = true,property='a',color = 'black', substrate={_:'button'},relation='bank'  ){
        // return queue(console, property,color,substrate,relation)
    }

    wallet(console = true,property='a',color = 'black', substrate={_:'player'},relation='wallet'  ){
        // return queue(console, property,color,substrate,relation)
    }

    waitForTx(id, node){
        return  new Promise(async (resolve, reject) => {
            resolve(waves.transactions['waitForTx'](id, node))
        })
    }

    end(event){
        console.log('waves закоментированно действие', event)
        // queue(event['detail']['console'], '~end',event['detail']['color'],event['detail']['substrate'],event['detail']['relation']).then((data)=>{
        //
        //     colorlog(true, 'stat','stat',data, 'статистика')
        //
        // })
    }
    get self() {
        return waves
    }
}
