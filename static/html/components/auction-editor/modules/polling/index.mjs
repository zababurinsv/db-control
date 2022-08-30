import matcher from '/static/html/components/component_modules/matcher/matcher.mjs'

export default () => {
  let timerId = setTimeout(async function tick() {
    console.log('--- polling ---')
    // let list  = await matcher['server']({
    //   path:`/auction`,
    //   type:'auctions'
    // },'get', 'type')
    //
    // console.log('====== list ========', list)
    // let items = obj['this'].shadowRoot.querySelectorAll('.item')
    //
    // for(let i =0; i < items.length;i++){
    //   if(items[i].className.indexOf('timer') > -1){}else{
    //
    //     for(let m =0; m < list['mongo'].length; m++){
    //
    //       if(parseInt(list['mongo'][m]['object'], 10) === parseInt(items[i].className.split('_')[1], 10)){
    //
    //         items[i].querySelector('.outPrice').innerText =  `Waves: ${list['mongo'][m]['auction']['lotAmount']}`
    //         items[i].querySelector('.name').innerText = list['mongo'][m]['auction']['winer']
    //         items[i].querySelector('.sellButton').innerText = 'Аукцион'
    //         items[i].querySelector('.sellButton').disabled = true
    //         items[i].querySelector('.timer').innerText = msConversion(parseInt(list['mongo'][m]['auction']['endHeight'], 10) - Date.now())

            // items[i].classList.add("timer")
            // setTimer({
            //   id: list['mongo'][m]['object'],
            //   data: items[i].querySelector('.timer'),
            //   this: items[i],
            //   info:{
            //     name:  items[i].querySelector('.name'),
            //     price: items[i].querySelector('.price'),
            //     outPrice: items[i].querySelector('.outPrice')
            //
            //   }
            // }).then((data)=>{
            //   items[i].querySelector('.sellButton').innerText = 'Старт'
            // })
          // }
        // }
      // }
    // }
    timerId = setTimeout(tick, 1000); // (*)
  }, 1000);
}