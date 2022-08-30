import store from '/static/html/components/component_modules/staticProperty/staticProperty.mjs'
import mainConfig from '/static/html/components/component_modules/matcher/matcher/this/database/config/index.mjs'
import conf from '/static/html/components/component_modules/matcher/matcher/this/database/config/index.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import Waves from '/static/html/components/component_modules/bundle/waves/waves.mjs'

export default async (v,p,c,obj,r) => {

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



    // obj['this'].shadowRoot.querySelector('.withdraw').addEventListener('click',async function(event) {
    //         let state = await store({
    //             input:'state',
    //             type:'object'
    //         }, 'get', 'type')
    //         if(state === null){
    //             alert('Войдите под своим аккаунтом')
    //         }else {
    //
    //             let accountbalance = await  window['wt']['nodeInteraction']['accountDataByKey'](`${state[0]['state']['address']}_balance`, window['wt']['dappaddress'],window['wt']['baseUri'])
    //
    //             let withdraw = 0
    //             if(isEmpty(event.target.shadowRoot.querySelector('#withdraw').value)){
    //
    //
    //
    //                 withdraw = +accountbalance['value']
    //
    //             }else{
    //
    //                 withdraw =  event.target.shadowRoot.querySelector('#withdraw').value * 100000000
    //
    //             }
    //             if(withdraw === 0){
    //                 alert('У вас нет средств для вывода')
    //             }else{
    //
    //                 try {
    //                     let wavesBalance =  await store({
    //                         input:'waves-balance',
    //                         type:'all'
    //                     }, 'get', 'type')
    //                     wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.withdraw').style.disabled = 'disabled'
    //                     wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#withdraw').disabled = true
    //                     wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.deposit').style.disabled = 'disabled'
    //                     wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#deposit').disabled = true
    //                     wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.withdraw').innerText = 'идёт процесс вывода'
    //                     wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#withdraw').value = 0
    //
    //                     let tx = await WavesKeeper.signAndPublishTransaction({
    //                         type: 16,
    //                         data: {
    //                             fee: {
    //                                 "tokens": "0.05",
    //                                 "assetId": "WAVES"
    //                             },
    //                             dApp: mainConfig['account']['dappaddress'],
    //                             call:{
    //                                 function: "withdraw",
    //                                 args: [{ type:"integer", value: withdraw}]},
    //                             payment:[]
    //                         }
    //                     })
    //                     tx = JSON.parse(tx)
    //                     let oldBalance = wavesBalance['waves-auth'][0]['this'].shadowRoot.querySelector('.balance').innerText
    //                     oldBalance = +oldBalance.split(':')[1]
    //                     await window['wt']['nodeInteraction']['waitForTx'](tx.id,{
    //                         apiBase:'https://nodes-testnet.wavesnodes.com'
    //                     })
    //                     let address = await WavesKeeper['publicState']()
    //                     let Account = await  window['wt']['nodeInteraction']['balanceDetails']( window['wt']['dappaddress'],window['wt']['baseUri'])
    //                     Account = Account['regular'] / 100000000
    //                     let accountbalanceOut = await  window['wt']['nodeInteraction']['accountDataByKey'](`${address['account']['address']}_balance`, window['wt']['dappaddress'],window['wt']['baseUri'])
    //                     accountbalanceOut = accountbalanceOut['value'] / 100000000
    //                     let stateOut =  await  window['wt']['nodeInteraction']['balanceDetails']( address['account']['address'],window['wt']['baseUri'])
    //                     let balance = +stateOut['regular'] / 100000000
    //                     let verify = false
    //                     while (verify) {
    //                         if (oldBalance === balance) {
    //                             stateOut =  await  window['wt']['nodeInteraction']['balanceDetails']( address['account']['address'],window['wt']['baseUri'])
    //                             balance = +stateOut['regular'] / 100000000
    //                             console.assert(false, balance)
    //                             return verify = false;
    //                         } else {
    //                             console.assert(false, balance)
    //                             return verify = true;
    //                         }
    //                     }
    //
    //                     wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.regularBalance').innerText = `waves: ${Account}`
    //                     wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.balanceAccount').innerText = accountbalanceOut
    //                     wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#withdraw').value = 0
    //                     wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#withdraw').placeholder = 'all'
    //                     wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#withdraw').disabled = false
    //                     wavesBalance['waves-auth'][0]['this'].shadowRoot.querySelector('.balance').innerText = ''
    //                     wavesBalance['waves-auth'][0]['this'].shadowRoot.querySelector('.balance').innerText = `Waves: ${balance}`
    //                     wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.withdraw').style.disabled = 'none'
    //                     wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.withdraw').innerText = 'вывод средств с аккаунта'
    //                     wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.deposit').style.disabled = 'none'
    //                     wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#deposit').disabled = false
    //                 }catch (e) {
    //                     let wavesBalance =  await store({
    //                         input:'waves-balance',
    //                         type:'all'
    //                     }, 'get', 'type')
    //                     wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#withdraw').value = 0
    //                     wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#withdraw').placeholder = 'all'
    //                     wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#withdraw').disabled = false
    //                     wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.withdraw').disabled = false
    //                     wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.withdraw').innerText = 'вывод средств с аккаунта'
    //                     wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.deposit').disabled = false
    //                     wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#deposit').disabled = false
    //                     console.warn('error request', e)
    //                 }
    //             }
    //
    //         }
    // })
    //
    //
    // obj['this'].shadowRoot.querySelector('.deposit').addEventListener('click',async function(event) {
    //     let state = await store({
    //         input:'state',
    //         type:'object'
    //     }, 'get', 'type')
    //     if(state === null){
    //         alert('Войдите под своим аккаунтом')
    //     }else {
    //         let accountbalance = await  window['wt']['nodeInteraction']['accountDataByKey'](`${state[0]['state']['address']}_balance`, window['wt']['dappaddress'],window['wt']['baseUri'])
    //         let deposit = 0
    //         if(isEmpty(event.target.shadowRoot.querySelector('#deposit').value)){
    //             deposit = +accountbalance['value']
    //         }else{
    //             deposit =  event.target.shadowRoot.querySelector('#deposit').value * 100000000
    //         }
    //
    //         if(deposit < 1){
    //             alert(' Возможен ввод средств больше или ровно 1 Waves')
    //         }else{
    //             try {
    //                 let wavesBalance =  await store({
    //                     input:'waves-balance',
    //                     type:'all'
    //                 }, 'get', 'type')
    //                 wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.deposit').style.disabled = 'disabled'
    //                 wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.deposit').innerText = 'идёт процесс ввода'
    //                 wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#deposit').value = 0
    //                 wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#deposit').disabled = true
    //                 wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.withdraw').style.disabled = 'disabled'
    //                 wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#withdraw').disabled = true
    //                 let tx = await WavesKeeper.signAndPublishTransaction({
    //                     type: 16,
    //                     data: {
    //                         fee: {
    //                             "tokens": "0.05",
    //                             "assetId": "WAVES"
    //                         },
    //                         dApp: mainConfig['account']['dappaddress'],
    //                         call: {
    //                             function: 'deposit',
    //                             args: []
    //                         }, payment: [{amount:deposit, assetId:null}]
    //                     }
    //                 })
    //                 tx = JSON.parse(tx)
    //                 let oldBalance = wavesBalance['waves-auth'][0]['this'].shadowRoot.querySelector('.balance').innerText
    //                 oldBalance = +oldBalance.split(':')[1]
    //                 await window['wt']['nodeInteraction']['waitForTx'](tx.id,{
    //                     apiBase:'https://nodes-testnet.wavesnodes.com'
    //                 })
    //                 let address = await WavesKeeper['publicState']()
    //                 let Account = await  window['wt']['nodeInteraction']['balanceDetails']( window['wt']['dappaddress'],window['wt']['baseUri'])
    //                 Account = Account['regular'] / 100000000
    //                 let accountbalanceOut = await  window['wt']['nodeInteraction']['accountDataByKey'](`${address['account']['address']}_balance`, window['wt']['dappaddress'],window['wt']['baseUri'])
    //                 accountbalanceOut = accountbalanceOut['value'] / 100000000
    //                 let stateOut =  await  window['wt']['nodeInteraction']['balanceDetails']( address['account']['address'],window['wt']['baseUri'])
    //                 let balance = +stateOut['regular'] / 100000000
    //                 let verify = false
    //                 while (verify) {
    //                     if (oldBalance === balance) {
    //                         stateOut =  await  window['wt']['nodeInteraction']['balanceDetails']( address['account']['address'],window['wt']['baseUri'])
    //                         balance = +stateOut['regular'] / 100000000
    //                         console.assert(false, balance)
    //                         verify = false;
    //                         return verify
    //                     } else {
    //                         console.assert(false, balance)
    //                         verify = true;
    //                         return verify
    //                     }
    //                 }
    //                 wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.regularBalance').innerText = `waves: ${Account}`
    //                 wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.balanceAccount').innerText = accountbalanceOut
    //                 wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#deposit').value = 0
    //                 wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#deposit').placeholder = '0'
    //                 wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.deposit').innerText = 'Ввод средств на аккаунт'
    //                 wavesBalance['waves-auth'][0]['this'].shadowRoot.querySelector('.balance').innerText = ''
    //                 wavesBalance['waves-auth'][0]['this'].shadowRoot.querySelector('.balance').innerText = `Waves: ${balance}`
    //                 wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#deposit').disabled = false
    //                 wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.deposit').disabled = false
    //                 wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.withdraw').disabled = false
    //                 wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#withdraw').disabled = false
    //             }catch (e) {
    //                 let wavesBalance =  await store({
    //                     input:'waves-balance',
    //                     type:'all'
    //                 }, 'get', 'type')
    //                 wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#deposit').value = 0
    //                 wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#deposit').placeholder = '0'
    //                 wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#deposit').disabled = false
    //                 wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.deposit').disabled = false
    //                 wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.withdraw').disabled = false
    //                 wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#withdraw').disabled = false
    //                 wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.deposit').innerText = 'Ввод средств на аккаунт'
    //                 console.log('error request', e)
    //             }
    //         }
    //     }
    // })
}