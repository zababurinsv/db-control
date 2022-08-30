import staticProperty  from '/static/html/components/component_modules/staticProperty/staticProperty.mjs'
import setText from '/static/html/components/component_modules/setText/setText.mjs'
import addEventListener from '/static/html/components/component_modules/addEventListener/addEventListener.mjs'
import templateItem from '/static/html/components/component_modules/template/template.mjs'
import store from '/static/html/components/component_modules/staticProperty/staticProperty.mjs'
import action from '/static/html/components/component_modules/action/action.mjs'
import matcher from '/static/html/components/component_modules/matcher/matcher.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'

export default async (v,p,c,obj,r) => {

  function msConversion(millis) {
    let sec = Math.floor(millis / 1000);
    let hrs = Math.floor(sec / 3600);
    sec -= hrs * 3600;
    let min = Math.floor(sec / 60);
    sec -= min * 60;

    sec = '' + sec;
    sec = ('00' + sec).substring(sec.length);

    if (hrs > 0) {
      if(min < 10){
        min = '0' + min;
      }else{
        min = '' + min;
      }

      min = ('00' + min).substring(min.length);
      return hrs + ":" + min + ":" + sec;
    }
    else {
      if(min < 10){
        min = '0' + min;
      }else{
        min = '' + min;
      }
      return '00:'+min + ":" + sec;
    }
  }
  function setTimer (obj){
    return new Promise( async function (resolve, reject) {
      let timerId = setTimeout(async function tick() {
        let timer = await matcher['server']({
          path:`/timer/${obj['id']}`,
          type:'timer'
        },'get', 'type')

        if(timer['mongo']['time']  <= 0){
          obj['data'].innerText = `завершён`
          let bid = 0
          console.log(timer['mongo'])
          for(let i = 0; i < timer['mongo']['auction']['count'].length; i++){
            if(timer['mongo']['auction']['count'][i] ===timer['mongo']['auction']['winner']){
              bid++
            }
          }
          let winner = timer['mongo']['auction']['winner']
          let price = +timer['mongo']['auction']['lotAmount'] * 10
          let tx = await matcher['server']({
            path:`/winner`,
            type:'winner',
            data:{
              auctionId:timer['mongo']['auction']['auctionId'],
              winner:winner,
              endHeight: timer['mongo']['auction']['endHeight'],
              lotAmount: price,
              bid:bid
            }
          },'set', 'type')
          await window['wt']['nodeInteraction']['waitForTx'](tx['mongo']['id'],{
            apiBase:'https://nodes-testnet.wavesnodes.com'
          })

          let data = await  WavesKeeper.publicState()
          let lots =   await matcher['server']({
            input:'waves-auth',
            path:`/winner/${data['account']['address']}`,
            type:'winner'
          },'get','type')



          if(lots['mongo'].length > 0) {
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
            let allObject =  await store({
              input:'varan-card-news',
              type:'all'
            }, 'get', 'type')

            allObject['waves-auth'][0]['this'].shadowRoot.querySelector('#winner').style.display = 'flex'
            allObject['waves-auth'][0]['this'].shadowRoot.querySelector('#winner').innerHTML = ''
            allObject['waves-auth'][0]['this'].shadowRoot.querySelector('#winner').appendChild(object);
            let button = allObject['waves-auth'][0]['this'].shadowRoot.querySelectorAll('.pay')
            for(let j = 0; j < button.length;j++){
              await addEventListener({
                input:'waves-auth',
                data:button[j],
                type:'payLot'
              },'set', 'type')
            }

          }else{}


          clearTimeout(timerId);
          resolve(obj['data'].innerText)
        }else{
          let news = timer['mongo']
          let price = +news['lotAmount']
          price = price.toFixed(1)
          obj['info']['name'].innerText = `${news['winner']}`
          obj['info']['price'].innerText = `Waves: ${price}`
          let bid = 0
          for(let i =0; i < news['count'].length; i++){
            if(news['count'][i] === news['winner']){
              bid++
            }
          }
          let lotAmount = +news['lotAmount']
          let outPrice = lotAmount + 0.014
          outPrice = outPrice.toFixed(3)

          obj['info']['outPrice'].innerText = `Waves: ${outPrice }`

          obj['data'].innerText = msConversion(news['time'])
          timerId = setTimeout(tick, 900); // (*)
        }
      }, 900);

    })
  }
  async function polling() {
    let timerId = setTimeout(async function tick() {

      let list  = await matcher['server']({
        path:`/auction`,
        type:'auctions'
      },'get', 'type')
      console.log('====== list ========', list)
      let items =obj['this'].shadowRoot.querySelectorAll('.item')

      for(let i =0; i < items.length;i++){
        if(items[i].className.indexOf('timer') > -1){}else{

          // console.assert(false, items[i].className.split('_')[1])

          for(let m =0; m < list['mongo'].length; m++){

            if(parseInt(list['mongo'][m]['object'], 10) === parseInt(items[i].className.split('_')[1], 10)){

              // console.assert(false, list['mongo'][m]['auction'])

              items[i].querySelector('.outPrice').innerText =  `Waves: ${list['mongo'][m]['auction']['lotAmount']}`
              items[i].querySelector('.name').innerText = list['mongo'][m]['auction']['winer']
              items[i].querySelector('.sellButton').innerText = 'Аукцион'
              items[i].querySelector('.sellButton').disabled = true
              items[i].querySelector('.timer').innerText = msConversion(parseInt(list['mongo'][m]['auction']['endHeight'], 10) - Date.now())

              items[i].classList.add("timer")
              setTimer({
                id: list['mongo'][m]['object'],
                data: items[i].querySelector('.timer'),
                this: items[i],
                info:{
                  name:  items[i].querySelector('.name'),
                  price: items[i].querySelector('.price'),
                  outPrice: items[i].querySelector('.outPrice')

                }
              }).then((data)=>{
                items[i].querySelector('.sellButton').innerText = 'Старт'
              })
            }
          }
        }
      }
      timerId = setTimeout(tick, 1000); // (*)
    }, 1000);
  }

  let verify = false
  for(let i =0; i< obj['this'].slot.split('-').length; i++){
    if(obj['this'].slot.split('-')[i] === 'admin'){
      verify = true
    }
  }

  let itemHtml = {}
  if(verify) {
    await store({
      input:'varan-card-news',
      this:obj['this'],
      img: obj['this'].shadowRoot.querySelector('.imgBidAdmin'),
      slot:obj.slot,
      parent: obj['this'].getAttribute('parent'),
      type:'obj'
    }, 'set', 'type')

    let  itemsBid = await action({
      input:'lacerta-card-news',
      type:'itemsBid',
      name:'itemsBid'
    }, 'get', 'type')

    if(isEmpty(itemsBid['mongo'])){
      console.warn('нет объектов')
    }else{
      obj['this'].shadowRoot.querySelector('.section').innerHTML = ''
      for(let m =0; m < itemsBid['mongo'].length; m++) {

        let outAdmin =  await templateItem({
          input:'varan-cards-news-admin',
          data: itemsBid['mongo'][m]['item'],
          type:'cardAdmin'
        },'get', 'type')
        obj['this'].shadowRoot.querySelector('.section').insertAdjacentHTML('beforeend', outAdmin)
        let item = obj['this'].shadowRoot.querySelector(`.timestamp_${Date.parse(itemsBid['mongo'][m]['item']['date_modified'])}`)

        item.querySelector('.change').addEventListener('click', async (event) => {
          let target = event.target
          let verify = false
          while (!verify) {
            if(target.tagName === 'DIV' && target.className.indexOf('item') > -1){
              verify = true
            }else{
              target = target.parentNode
            }
          }
          let date = {}
          date['timestamp'] = +target.className.split('_')[1]
          date['iso'] =  (new Date(date['timestamp'])).toISOString()
          date['utc'] =  (new Date(date['timestamp'])).toUTCString()
          let time = await matcher['server']({
            path:`/timer/${date['timestamp']}`,
            type:'timer'
          },'get', 'type')
          if(time['mongo']['time'] === -2){

            target.querySelector('.change').innerText = `данные добавляются`
            target.querySelector('.change').disabled = true;
            staticProperty({
              type:'task',
              task: {
                button: target.querySelector('.change'),
                type:'update',
                date:date,
                this:obj['this']
              },
              name:'bid'
            },'task', 'type')
          }else{
            alert('Проходит аукцион, редактирование невозможно')
          }
        })


        item.querySelector('.delete').addEventListener('click', async (event) => {
          let target = event.target
          let verify = false
          while (!verify) {
            if(target.tagName === 'DIV' && target.className.indexOf('item') > -1){
              verify = true
            }else{
              target = target.parentNode
            }
          }
          let date = {}
          date['timestamp'] = +target.className.split('_')[1]
          date['iso'] =  (new Date(date['timestamp'])).toISOString()
          date['utc'] =  (new Date(date['timestamp'])).toUTCString()
          let time = await matcher['server']({
            path:`/timer/${date['timestamp']}`,
            type:'timer'
          },'get', 'type')
          if(time['mongo']['time'] === -2){

            let result = confirm('Вы точно хотите удалить новость ?');
            if(result){
              target.querySelector('.change').remove()
              target.querySelector('.delete').innerText = 'Идёт процесс удаления'
              target.querySelector('.delete').style.backgroundColor = 'red'
              target.querySelector('.delete').disabled = true
              staticProperty({
                type:'task',
                task: {
                  type:'delete',
                  date:date,
                  remove:target
                },
                name:'bid'
              },'task', 'type')
            }else{

            }
          }else{
            alert('Проходит аукцион, вы не можете удалить товар')
          }
        })
      }
    }

    obj['this'].shadowRoot.querySelector('#image').onchange = function (event) {
      // console.assert(false, obj)
      let crop = new CustomEvent('sideBarCrop', {
        detail: {
          id: obj['component'],
          slot: obj['slot'],
          file: event.target.files[0]
        }
      })
      document.dispatchEvent(crop)
      event.target.value = '';
    }
  } else {
    ///////////////////////////////////////////////////////////////////////////////////////////////
    console.log('DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD')
    await store({
      input:'varan-card-news',
      this:obj['this'],
      img: obj['this'].shadowRoot.querySelector('.imgBidAdmin'),
      slot:obj.slot,
      parent: obj['this'].getAttribute('parent'),
      type:'obj'
    }, 'set', 'type')

    let feeds = {}
    feeds = await action({
      input:'lacerta-card-news',
      type:'itemsBid',
      name:'itemsBid'
    }, 'get', 'type')
    // let eventSource;
    // if (!window.EventSource) {
    // Internet Explorer или устаревшие браузеры
    // alert("Ваш браузер не поддерживает EventSource.");
    // return;
    // }
    // eventSource = new window.EventSource(`${matcher['config']['account']['sse']}`);
    // eventSource.addEventListener('message', async function (event) {
    //
    //   let msg = JSON.parse(event['data'])
    //   let obj = JSON.parse(msg['msg'])
    //
    //  let card =  await store({
    //     input:'varan-card-news',
    //     type:'object'
    //   }, 'get', 'type')
    //   console.assert(false)
    //   for(let i =0; i < card.length; i++){
    //   switch (card[i]['slot']) {
    //     case 'varan-card-news':
    //       let outPrice = parseInt(obj['data']['auction']['lotAmount'], 10) + 0.05
    //       console.assert(false)
    //       let time = parseInt(obj['data']['auction']['endHeight'], 10) - Date.now()
    //
    //         let items = card[i]['this'].shadowRoot.querySelector('.section')
    //
    //         for(let j = 0; j < items.children.length; j++){
    //
    //           let name = items.children[j].className.split('_')[1]
    //           if(parseInt(name, 10) === parseInt(obj['data']['object'], 10)){
    //            let item = items.children[j]
    //
    //             item.querySelector('.outPrice').innerText = `Waves: ${outPrice}`
    //             item.querySelector('.name').innerText = obj['data']['auction']['winner']
    //             item.querySelector('.sellButton').innerText = 'Аукцион начался'
    //             item.querySelector('.timer').innerText = msConversion(time )
    //             setTimer({
    //               id:parseInt(name, 10),
    //               data:   item.querySelector('.timer'),
    //               this: item,
    //               info:{
    //                 name:  item.querySelector('.name'),
    //                 price: item.querySelector('.price'),
    //                 outPrice: item.querySelector('.outPrice')
    //               }
    //             }).then((data)=>{
    //               item.querySelector('.sellButton').innerText = 'Старт'
    //             })
    //           }
    //         }
    //       break
    //     default:
    //       break
    //     }
    //   }
    // });

    if(isEmpty(feeds)){
      console.warn('нет объектов')
    } else {

      obj['this'].shadowRoot.querySelector('.section').innerHTML = ''

      for(let m =0; m < feeds['mongo'].length; m++) {
        itemHtml =  await templateItem({
          input:'bid_card',
          data:feeds['mongo'][m]['item'],
          type:'card'
        },'get', 'type')

        obj['this'].shadowRoot.querySelector('.section').insertAdjacentHTML('beforeend', itemHtml)
        let nameAuction = Date.parse(feeds['mongo'][m]['item']['date_modified'])

        let item = obj['this'].shadowRoot.querySelector(`.timestamp_${nameAuction}`)

        let time = await matcher['server']({
          path:`/timer/${nameAuction}`,
          type:'timer'
        },'get', 'type')
        if(time['mongo']['time'] === -2){

        }else if(time['mongo']['time'] === -1 ){
          console.assert(false)
        } else {
          console.assert(false, feeds)
          item.querySelector('.outPrice').innerText =  `Waves: ${time['mongo']['lotAmount']}`
          item.querySelector('.name').innerText = time['mongo']['winer']
          item.querySelector('.sellButton').innerText = 'Аукцион'
          item.querySelector('.sellButton').disabled = true
          item.querySelector('.timer').innerText = msConversion(time['mongo']['time'])

          item.classList.add("timer")
          setTimer({
            id: nameAuction,
            data: item.querySelector('.timer'),
            this: item,
            info:{
              name:  item.querySelector('.name'),
              price: item.querySelector('.price'),
              outPrice: item.querySelector('.outPrice')

            }
          }).then((data)=>{
            item.querySelector('.sellButton').innerText = 'Старт'
          })
        }


        item.querySelector('.bidButton').addEventListener('click', async (event) => {
          let target = event.target
          let verify = false
          while (!verify) {
            if(target.tagName === 'DIV' && target.className.indexOf('item') > -1){
              verify = true
            }else{
              target = target.parentNode
            }
          }

          target.querySelector('.bidButton').innerText = 'делается ставка'
          target.querySelector('.bidButton').disabled = true
          let time = await matcher['server']({
            path:`/timer/${nameAuction}`,
            type:'timer'
          },'get', 'type')
          if(time['mongo']['time'] === -2){

            alert('Аукцион ещё не начался')
            target.querySelector('.bidButton').innerText = 'ставка'
            target.querySelector('.bidButton').disabled = false
          }else if(time['mongo']['time'] === -1 ){
            alert('Аукцион ещё не начался')
            target.querySelector('.bidButton').innerText = 'ставка'
            target.querySelector('.bidButton').disabled = false
          }else{
            try{
              let data = await  WavesKeeper.publicState()
              let bid = {}
              if(data['account']['balance']['available'] < 100000000){
                alert('У вас недостаточно средств, что бы сделать ставку')
                target.querySelector('.bidButton').innerText = 'ставка'
                target.querySelector('.bidButton').disabled = false
              }else{
                let id  = target.className.split('_')[1]
                id  = id.split(' ')[0]
                id = +id
                let cheked = await matcher['server']({
                  path:`/timer/${id}`,
                  type:'timer'
                },'get', 'type')

                let bid = 0
                for(let i =0; i < cheked['mongo']['count'].length; i++){

                  if(cheked['mongo']['count'][i] === data['account']['address']){

                    bid++
                  }
                }
                let checkedPrice =  0.014 + 1
                let Waves = +data['account']['balance']['available'] / 100000000
                if(Waves < checkedPrice){
                  alert('у вас не достаточно средств для ставки')
                  target.querySelector('.bidButton').innerText = 'ставка'
                  target.querySelector('.bidButton').disabled = false
                }else{

                  let checkedTimer = await matcher['server']({
                    path:`/checked/${id}`,
                    type:'account',
                    data:{
                      account:data['account']['address']
                    }
                  },'checked', 'type')
                  // console.assert(false, timer['mongo']['data']['auction']['startHeight'])
                  if(checkedTimer['mongo']['update'] === -3){
                    alert('Вы уже сделали последнюю ставку')
                    target.querySelector('.bidButton').innerText = 'ставка'
                    target.querySelector('.bidButton').disabled = false
                  }else{
                    let bid = 0

                    for(let i =0; i < checkedTimer['mongo']['auction']['count'].length; i++){

                      if(checkedTimer['mongo']['auction']['count'][i] === checkedTimer['mongo']['auction']['winner']){

                        bid++
                      }
                    }


                    let price = parseInt((+checkedTimer['mongo']['auction']['lotAmount']*10), 10)

                    let auctionId =  checkedTimer['mongo']['auction']['auctionId']
                    let endHeight = +checkedTimer['mongo']['auction']['endHeight']
                    try {
                      let request = {}
                      let fee = await fetch(`https://nodes-testnet.wavesnodes.com/addresses/scriptInfo/${data['account']['address']}`)
                      fee = await fee.json()
                      fee = fee['extraFee']/100000000 + 0.005
                      fee = parseFloat(fee.toFixed(4), 10)
                      request = {
                        type: 16,
                        data: {
                          fee: {
                            "tokens": `${fee}`,
                            "assetId": "WAVES"
                          },
                          dApp: window['wt']['dappaddress'],
                          call: {
                            function:"bid",
                            args: [
                              {type:"string", value:  auctionId},
                              {type:"integer", value:  bid},
                              {type:"integer", value: price},
                              {type:"integer", value: endHeight}]
                          },
                          payment: [
                            {amount: 100000000, assetId:null }
                          ]
                        }
                      }
                      target.querySelector('.bidButton').innerText = 'завершение процесса'
                      let tx = await   WavesKeeper.signAndPublishTransaction(request)
                      let timer = await matcher['server']({
                        path:`/timer/${id}`,
                        type:'account',
                        data:{
                          account:data['account']['address']
                        }
                      },'update', 'type')
                      tx = JSON.parse(tx)
                      await window['wt']['nodeInteraction']['waitForTx'](tx.id,{
                        apiBase:'https://nodes-testnet.wavesnodes.com'
                      })
                      target.querySelector('.name').innerText = `${timer['mongo']['data']['auction']['winner']}`
                      target.querySelector('.price').innerText = `Waves: ${timer['mongo']['data']['auction']['lotAmount'].toFixed(1)}`
                      let outPrice = timer['mongo']['data']['auction']['lotAmount'] + 0.05
                      outPrice = outPrice.toFixed(3)
                      target.querySelector('.outPrice').innerText = `Waves: ${outPrice }`
                      target.querySelector('.bidButton').innerText = 'ставка'
                      target.querySelector('.bidButton').disabled = false
                    }catch (e) {
                      console.warn('ошибка', e)
                    }
                  }
                }
              }
            }catch (e) {
              alert('У вас не установлен Waves Keepper, работа без него в процессе разработки')
              target.querySelector('.bidButton').innerText = 'ставка'
              target.querySelector('.bidButton').disabled = false
            }

          }
        })
        item.querySelector('.sellButton').addEventListener('click', async (event) => {
          let target = event.target
          let verify = false
          while (!verify) {
            if(target.tagName === 'DIV' && target.className.indexOf('item') > -1){
              verify = true
            }else{
              target = target.parentNode
            }
          }
          let timeFeedBid = +target.className.split('_')[1]
          try{
            let data = await  WavesKeeper.publicState()
            let timePlus = target.querySelector('.timer').innerText
            timePlus = timePlus.split(':')
            timePlus = parseInt(timePlus[0], 10) * 60 + parseInt(timePlus[1], 10)
            timePlus = timePlus.toString()
            let time = await matcher['server']({
              path:`/timer/${nameAuction}`,
              type:'timer'
            },'get', 'type')
            if(time['mongo']['time'] === -2){
              if(timePlus.toLowerCase() === 'завершён'){
                alert('Аукцион прошёл, войдите в панель администратора, что создать новый')
              }else{
                timePlus = +timePlus
                timePlus = timePlus * 60000
                let Waves = data['account']['balance']['available'] / 100000000
                if(Waves < 1.05){
                  alert('У вас недостаточно средств для создания аукциона')
                }else{
                  let tx = {}
                  target.querySelector('.sellButton').innerText = 'Создаётся аукцион'
                  target.querySelector('.sellButton').disabled = true
                  try {
                    let nft = await matcher['server']({
                      input:'caran-card-news',
                      type:'nft',
                      data:{
                        id:`${timeFeedBid}`,
                        dApp: window['wt']['dappaddress'],
                      },
                      path:'/nft'
                    },'get','type')
                    await window['wt']['nodeInteraction']['waitForTx'](nft['mongo']['id'],{
                      apiBase:'https://nodes-testnet.wavesnodes.com'
                    })
                    let price = target.querySelector('.price').innerText
                    price = parseInt(price.split(':')[1], 10)
                    let auction= {}
                    auction['organizer'] = data['account']['address']
                    auction['lotAssetId'] = "WAVES"
                    auction['lotAmount'] = price
                    auction['startPrice'] = price
                    auction['priceAssetId'] = "WAVES"
                    auction['winner'] = data['account']['address']
                    auction['winAmount'] = price
                    auction['startHeight'] = nft['mongo']['timestamp']
                    auction['startTime'] = timePlus
                    auction['endHeight'] = nft['mongo']['timestamp'] + timePlus
                    auction['count'] = []
                    auction['count'].push(data['account']['address'])
                    auction['count'] = JSON.stringify(auction['count'])
                    auction['name'] = timeFeedBid


                    let fee = await fetch(`https://nodes-testnet.wavesnodes.com/addresses/scriptInfo/${data['account']['address']}`)
                    fee = await fee.json()
                    fee = fee['extraFee']/100000000 + 0.005
                    fee = parseFloat(fee.toFixed(4), 10)
                    try {
                      let request = {
                        type: 16,
                        data: {
                          fee: {
                            "tokens": `${fee}`,
                            "assetId": "WAVES"
                          },
                          dApp: window['wt']['dappaddress'],
                          call: {
                            function:"startAuction",
                            args: [
                              {type:"integer", value:  auction['endHeight']},
                              {type:"integer", value: auction['startPrice']},
                              {type:"string", value: nft['mongo']['id']},
                              {type:"string", value: "WAVES"}]
                          },
                          payment: [
                            {amount: 100000000, assetId:null }
                          ]
                        }
                      }
                      try{
                        let tx = await   WavesKeeper.signAndPublishTransaction(request)
                        tx = JSON.parse(tx)
                        await window['wt']['nodeInteraction']['waitForTx'](tx.id,{
                          apiBase:'https://nodes-testnet.wavesnodes.com'
                        })
                        // auction['auctionId'] = {}
                        // auction['auctionId'] = nft['mongo']['id']


                        auction['auctionId'] = nft['mongo']['id']


                        let outTime =  await matcher['server']({
                          path:'/auction',
                          type:'auction',
                          data: auction
                        },'set', 'type')

                        let outPrice = parseInt(auction['lotAmount'],10) + 0.005
                        let time = parseInt(outTime['mongo']['data']['auction']['endHeight'], 10) - Date.now()

                        target.querySelector('.outPrice').innerText = `Waves: ${outPrice}`
                        target.querySelector('.name').innerText = data['account']['address']
                        target.querySelector('.sellButton').innerText = 'Аукцион'
                        target.querySelector('.timer').innerText = msConversion(time )

                        target.classList.add("timer")
                        setTimer({
                          id:   auction['name'],
                          data:  target.querySelector('.timer'),
                          this: target,
                          info:{
                            name:  target.querySelector('.name'),
                            price: target.querySelector('.price'),
                            outPrice: target.querySelector('.outPrice')
                          }
                        }).then((data)=>{
                          target.querySelector('.sellButton').innerText = 'Старт'
                        })
                      }catch (e) {
                        console.warn(e)
                        target.querySelector('.sellButton').innerText = 'Старт'
                        target.querySelector('.sellButton').disabled = false
                      }


                    }catch (e) {
                      console.warn(e)
                      target.querySelector('.sellButton').innerText = 'Старт'
                      target.querySelector('.sellButton').disabled = false
                    }


                  }catch (e) {
                    console.warn(e)
                    target.querySelector('.sellButton').innerText = 'Старт'
                    target.querySelector('.sellButton').disabled = false
                  }

                }
              }
            }else{
              alert('Аукцион уже проходит')
            }

          }catch (e) {
            alert('У вас не установлен Waves Keepper, работа без него в процессе разработки')
          }
        })

      }
      polling()
    }
  }
}