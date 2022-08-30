import API from '/static/html/components/component_modules/api/bem/index.mjs'

export default (self) => {
  return new Promise(async (resolve, reject) => {
    const api = await API(self)
        try {
          WavesKeeper.on("update",async (data) => {
            if(isEmpty(data)){
              let data = await  WavesKeeper.auth({ data: "Auth on my  site" })
            }
            let auth = await config['waves']['auth']({
              input:'auth',
              data: data,
              type:'checked',
              password: []
            },'auth','type')

            if(auth){

              let object =  await store({
                input:'waves-auth',
                type:'all'
              }, 'get', 'type')
              let state = await wavesKeeper['getPublicState']()
              let balance = state['account']['balance']['available'] / 100000000
              let network = {}
              switch (state['network']['code']) {
                case 'T':
                  network = 'Testnet'
                  break
                case 'W':
                  network = 'Mainnet'
                  break
                default:
                  network = 'Custome'
                  break
              }
              let wavesBalance =  await store({
                input:'waves-balance',
                type:'all'
              }, 'get', 'type')

              let dappaddress = conf['account']['dappaddress'];
              let baseUri = conf['account']['testnodes'];


              let clientAccount = await  window['wt']['nodeInteraction']['accountDataByKey'](`${state['account']['address']}_balance`, window['wt']['dappaddress'],window['wt']['baseUri'])
              let accountbalance = await  window['wt']['nodeInteraction']['balanceDetails'](dappaddress, baseUri)

              if(isEmpty(clientAccount)){
                clientAccount = {}
                clientAccount['value'] = 0
              }
              accountbalance = accountbalance['regular'] / 100000000
              let wavesAccount = clientAccount['value']/100000000
              await store({
                input:'state',
                type:'obj',
                state: {
                  address:state['account']['address'],
                  waves: balance,
                  network: network
                }
              }, 'set', 'type')

              let accoutName = wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#multiDomainAccount')
              accoutName.innerText = `${conf['account']['dappaddress']}`

              let regularBalance =  wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.regularBalance')
              regularBalance.innerText = `waves: ${accountbalance}`
              let balanceClient =   wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.balanceAccount')
              balanceClient.innerText = `${wavesAccount}`

              let data = await  WavesKeeper.publicState()
              let lots =   await matcher['server']({
                input:'waves-auth',
                path:`/winner/${data['account']['address']}`,
                type:'winner'
              },'get','type')
              if(lots['mongo'].length > 0){
                let html =
                  `<div class="input">Выполнен вход под аккаунтом</div>
                             <div class="account">
                             <div class="network">${network}</div>
                             <div class="address">${state['account']['address']}</div>
                             <div class="balance">Waves: ${balance}</div>
                             </div>`

                let object = document.createElement('div')
                object.className = 'winner'
                for(let i = 0; i < lots['mongo'].length;i++){
                  let price =  (+lots['mongo'][i]['winner']['payment'][0]['amount']/100000000) + 0.014
                  price = price.toFixed(3)
                  let temp = `<div class="info">
                                    <div> Лот: ${lots['mongo'][i]['object']}</div>
                                    <div class="priceLot"> Стоимость лота: ${price} Waves</div>
                                    <button class="pay ${lots['mongo'][i]['object']}">Оплатить</button>
                              </div>`
                  object.insertAdjacentHTML('beforeend', temp);
                }
                obj['this'].shadowRoot.querySelector('.register').innerHTML = ''
                obj['this'].shadowRoot.querySelector('.register').insertAdjacentHTML("afterbegin", html);
                obj['this'].shadowRoot.querySelector('#winner').style.display = 'flex'
                obj['this'].shadowRoot.querySelector('#winner').innerHTML = ''
                obj['this'].shadowRoot.querySelector('#winner').appendChild(object);

                let button = obj['this'].shadowRoot.querySelectorAll('.pay')
                for(let j = 0; j < button.length;j++){
                  await addEventListener({
                    input:'waves-auth',
                    data:button[j],
                    type:'payLot'
                  },'set', 'type')
                }

              }else{

                let html =
                  `<div class="input">Выполнен вход под аккаунтом</div>
                             <div class="account">
                             <div class="network">${network}</div>
                             <div class="address">${state['account']['address']}</div>
                             <div class="balance">Waves: ${balance}</div>
                             </div>`
                obj['this'].shadowRoot.querySelector('#winner').innerHTML = ''
                obj['this'].shadowRoot.querySelector('#winner').style.display = 'none'
                obj['this'].shadowRoot.querySelector('.register').innerHTML = ''
                obj['this'].shadowRoot.querySelector('.register').insertAdjacentHTML("afterbegin", html);


              }


            }else{

            }

          });
        }catch (e) {
          let html =
            `<div class="input"> У вас не установлен Waves Keepper</div>
                     <div id="account">
                     <div class="account reg">Зарегистрироваться</div>
                     <div class="account auth">Войти</div>
                     </div>`
          obj['this'].shadowRoot.querySelector('#winner').innerHTML = ''
          obj['this'].shadowRoot.querySelector('#winner').style.display = 'none'
          obj['this'].shadowRoot.querySelector('.register').innerHTML = ''
          obj['this'].shadowRoot.querySelector('.register').insertAdjacentHTML("afterbegin", html);

          let account =  obj['this'].shadowRoot.querySelectorAll('.account')
          for(let m =0; m < account.length; m++){
            await addEventListener({
              input:'waves-auth',
              data:account[m],
              type:`${account[m].className.split(' ')[1]}`
            },'set', 'type')
          }
          console.warn('нет waves keepper', e)
          // let stat =  await account({
          //   input:'waves-auth',
          //   type:'stat'
          // },'get', 'type')

          let dappaddress = conf['account']['dappaddress'];
          let baseUri = conf['account']['testnodes'];
          let accountbalance = await  window['wt']['nodeInteraction']['balanceDetails'](dappaddress, baseUri)
          accountbalance = accountbalance['regular'] / 100000000


          let wavesBalance =  await store({
            input:'waves-balance',
            type:'all'
          }, 'get', 'type')
          let accoutName = wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#multiDomainAccount')
          accoutName.innerText = `${conf['account']['dappaddress']}`
          let regularBalance =  wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.regularBalance')
          regularBalance.innerText = `waves: ${accountbalance}`

        }

        obj['this'].shadowRoot.querySelector('.register').addEventListener('click',async function(event) {
          try{
            event.target.innerText = 'выполняется вход'
            let data = await  WavesKeeper.publicState()
            let auth = await config['waves']['auth']({
              input:'auth',
              data: data,
              type:'checked',
              password: []
            },'auth','type')
            if(auth){
              let tx =   await matcher['server']({
                input:'waves-auth',
                path:`/winner/${data['account']['address']}`,
                type:'winner'
              },'get','type')
              let object =  await store({
                input:'waves-auth',
                type:'all'
              }, 'get', 'type')
              let state = await wavesKeeper['getPublicState']()

              let balance = state['account']['balance']['available'] / 100000000
              let network = {}
              switch (state['network']['code']) {
                case 'T':
                  network = 'Testnet'
                  break
                case 'W':
                  network = 'Mainnet'
                  break
                default:
                  network = 'Custome'
                  break
              }
              let wavesBalance =  await store({
                input:'waves-balance',
                type:'all'
              }, 'get', 'type')

              let dappaddress = conf['account']['dappaddress'];
              let baseUri = conf['account']['testnodes'];
              let accountbalance = await  window['wt']['nodeInteraction']['balanceDetails'](dappaddress, baseUri)
              let clientAccount = await  window['wt']['nodeInteraction']['accountDataByKey'](`${state['account']['address']}_balance`, window['wt']['dappaddress'],window['wt']['baseUri'])

              if(isEmpty(clientAccount)){
                clientAccount = {}
                clientAccount['value'] = 0
              }
              accountbalance = accountbalance['regular'] / 100000000
              let wavesAccount = clientAccount['value']/100000000
              await store({
                input:'state',
                type:'obj',
                state: {
                  address:state['account']['address'],
                  waves: balance,
                  network: network
                }
              }, 'set', 'type')

              let accoutName = wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('#multiDomainAccount')
              accoutName.innerText = `${conf['account']['dappaddress']}`
              let regularBalance =  wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.regularBalance')
              regularBalance.innerText = `waves: ${accountbalance}`
              let balanceClient =   wavesBalance['waves-balance'][0]['this'].shadowRoot.querySelector('.balanceAccount')
              balanceClient.innerText = `${wavesAccount}`
              let html = {}
              if(tx['mongo'].length > 0){
                let object = document.createElement('div')
                object.className = 'winner'
                for(let i = 0; i < tx['mongo'].length;i++){
                  let price =  (+tx['mongo'][i]['winner']['payment'][0]['amount']/100000000) + 0.014
                  price = price.toFixed(3)
                  let temp = `<div class="info">
                                    <div> Лот: ${tx['mongo'][i]['object']}</div>
                                    <div class="priceLot"> Стоимость лота: ${price} Waves</div>
                                    <button class="pay ${tx['mongo'][i]['object']}">Оплатить</button>
                              </div>`
                  object.insertAdjacentHTML('beforeend', temp);
                }
                html =
                  `<div class="input">Выполнен вход под аккаунтом</div>
                             <div class="account">
                             <div class="network">${network}</div>
                             <div class="address">${state['account']['address']}</div>
                             <div class="balance">Waves: ${balance}</div>
                              <div class="fiat"><slot name="fiat-form"></slot></div>
                             </div>`
                obj['this'].shadowRoot.querySelector('.register').innerHTML = ''
                obj['this'].shadowRoot.querySelector('.register').insertAdjacentHTML("afterbegin", html);
                obj['this'].shadowRoot.querySelector('#winner').style.display = 'flex'
                obj['this'].shadowRoot.querySelector('#winner').innerHTML = ''
                obj['this'].shadowRoot.querySelector('#winner').appendChild(object);

                let button = obj['this'].shadowRoot.querySelectorAll('.pay')
                for(let j = 0; j < button.length;j++){
                  await addEventListener({
                    input:'waves-auth',
                    data:button[j],
                    type:'payLot'
                  },'set', 'type')
                }

              }else{
                html =
                  `<div class="input">Выполнен вход под аккаунтом</div>
                             <div class="account">
                             <div class="network">${network}</div>
                             <div class="address">${state['account']['address']}</div>
                             <div class="balance">Waves: ${balance}</div>
                             <div class="fiat"><slot name="fiat-form"></slot></div>
                             </div>`

                obj['this'].shadowRoot.querySelector('.register').innerHTML = ''
                obj['this'].shadowRoot.querySelector('.register').insertAdjacentHTML("afterbegin", html);
              }



            }else{

            }

          }catch (e) {

            console.warn('нет waves keepper', e)
          }
        });

        // console.assert(false, obj['this'].shadowRoot.querySelector('.register'))
        // bundle['default'](obj,null, async function (error, config) {
        //   obj['this'].shadowRoot.querySelector('.register').addEventListener('click', async () => {
        //     let keeperApi =   await  WavesKeeper.initialPromise
        //     let auth = await config['waves']['auth']({
        //       input:'waves-auth',
        //       type:'this',
        //       WavesKeeper:keeperApi
        //     },'auth','type')
        //   });
        // })


        // console.log('@@@@@@@@@@@@@@@@@@@@@@@#########',index)
        // let doc = await index()
        // obj['this'].shadowRoot.appendChild(doc)
        // console.assert(false, doc)
        // doc.children[0].slot = 'header'
        // console.assert(false, await test())
        // console.assert(false, object.code)

        // console.log('~~~~~~1~~~~~~~~', obj['this']['shadowRoot'].querySelector('.name').innerHTML = await Navbar())

        // console.assert(false)
        // obj['this'].appendChild()
        // console.log(obj['this'])
        // console.assert(false,await Navbar())
        // console.dir(obj['this'])
        // console.assert(false, obj['this'])
        // obj['this'].prototype.obj = obj
        // console.log(this)
        // console.assert(false, obj)
  })
}