export default (object) => {
    return new Promise( async function (resolve, reject) {
      console.log('--- timer ---')
      // let timerId = setTimeout(async function tick() {
      //   let timer = await matcher['server']({
      //     path:`/timer/${obj['id']}`,
      //     type:'timer'
      //   },'get', 'type')
      //
      //   if(timer['mongo']['time']  <= 0){
      //     obj['data'].innerText = `завершён`
      //     let bid = 0
      //     console.log(timer['mongo'])
      //     for(let i = 0; i < timer['mongo']['auction']['count'].length; i++){
      //       if(timer['mongo']['auction']['count'][i] ===timer['mongo']['auction']['winner']){
      //         bid++
      //       }
      //     }
      //     let winner = timer['mongo']['auction']['winner']
      //     let price = +timer['mongo']['auction']['lotAmount'] * 10
      //     let tx = await matcher['server']({
      //       path:`/winner`,
      //       type:'winner',
      //       data:{
      //         auctionId:timer['mongo']['auction']['auctionId'],
      //         winner:winner,
      //         endHeight: timer['mongo']['auction']['endHeight'],
      //         lotAmount: price,
      //         bid:bid
      //       }
      //     },'set', 'type')
      //     await window['wt']['nodeInteraction']['waitForTx'](tx['mongo']['id'],{
      //       apiBase:'https://nodes-testnet.wavesnodes.com'
      //     })
      //
      //     let data = await  WavesKeeper.publicState()
      //     let lots =   await matcher['server']({
      //       input:'waves-auth',
      //       path:`/winner/${data['account']['address']}`,
      //       type:'winner'
      //     },'get','type')
      //
      //
      //
      //     if(lots['mongo'].length > 0){
      //       let object = document.createElement('div')
      //       object.className = 'winner'
      //       for(let i = 0; i < lots['mongo'].length;i++){
      //         let price =  (+lots['mongo'][i]['winner']['payment'][0]['amount']/100000000) + 0.014
      //         price = price.toFixed(3)
      //         let temp = `<div class="info">
      //                               <div> Лот: ${lots['mongo'][i]['object']}</div>
      //                               <div class="priceLot"> Стоимость лота: ${price} Waves</div>
      //                               <button class="pay ${lots['mongo'][i]['object']}">Оплатить</button>
      //                         </div>`
      //         object.insertAdjacentHTML('beforeend', temp);
      //       }
      //       let allObject =  await store({
      //         input:'varan-card-news',
      //         type:'all'
      //       }, 'get', 'type')
      //
      //       allObject['waves-auth'][0]['this'].shadowRoot.querySelector('#winner').style.display = 'flex'
      //       allObject['waves-auth'][0]['this'].shadowRoot.querySelector('#winner').innerHTML = ''
      //       allObject['waves-auth'][0]['this'].shadowRoot.querySelector('#winner').appendChild(object);
      //       let button = allObject['waves-auth'][0]['this'].shadowRoot.querySelectorAll('.pay')
      //       for(let j = 0; j < button.length;j++){
      //         await addEventListener({
      //           input:'waves-auth',
      //           data:button[j],
      //           type:'payLot'
      //         },'set', 'type')
      //       }
      //
      //     }else{}
      //
      //
      //     clearTimeout(timerId);
      //     resolve(obj['data'].innerText)
      //   }else{
      //     let news = timer['mongo']
      //     let price = +news['lotAmount']
      //     price = price.toFixed(1)
      //     obj['info']['name'].innerText = `${news['winner']}`
      //     obj['info']['price'].innerText = `Waves: ${price}`
      //     let bid = 0
      //     for(let i =0; i < news['count'].length; i++){
      //       if(news['count'][i] === news['winner']){
      //         bid++
      //       }
      //     }
      //     let lotAmount = +news['lotAmount']
      //     let outPrice = lotAmount + 0.014
      //     outPrice = outPrice.toFixed(3)
      //
      //     obj['info']['outPrice'].innerText = `Waves: ${outPrice }`
      //
      //     obj['data'].innerText = msConversion(news['time'])
      //     timerId = setTimeout(tick, 900); // (*)
      //   }
      // }, 900);
    //
    })
}