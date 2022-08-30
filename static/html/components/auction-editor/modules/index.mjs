import API from '/static/html/components/component_modules/api/bem/index.mjs'
import store from '/static/html/components/component_modules/store/index.mjs'
import actionCard from '/static/html/components/auction-card/template/html/default/auction-card.mjs'
import matcher from '/static/html/components/component_modules/matcher/matcher.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
// import { mouseenter, mouseleave, start, bid } from '/static/html/components/auction-card/modules/events/index.mjs'
import polling from '/static/html/components/auction-card/modules/polling/index.mjs'
import msConversion from './msConvert/index.mjs'
import setTimer from '/static/html/components/auction-card/modules/timer/index.mjs'

export default (self, admin) => {
  return new Promise(async (resolve, reject) => {
    const api = await API(self)
    if(admin) {
      await store.set.component({
        component: 'auction-card',
        type: 'admin',
        this: self.querySelector('.section')
      })
    } else {
      matcher['mongo']({
        input: 'action',
        type:'itemsBid'
      }, 'get', 'type')
        .then(async feeds => {
          if(isEmpty(feeds)) {
            console.log('Нет объектов')
            resolve()
          } else {
            api.class.section[0][0].innerHTML = ''

            //item list
            for(let m = 0; m < feeds['mongo'].length; m++) {
              const itemHtml =  await actionCard({
                input:'bid_card',
                data:feeds['mongo'][m]['item'],
                type:'card'
              },'get', 'type')

              api.class.section[0][0].insertAdjacentHTML('beforeend', itemHtml)

              const nameAuction = Date.parse(feeds['mongo'][m]['item']['date_modified'])

              const item = api.class.section[0][0].querySelector(`.timestamp_${nameAuction}`)

              const time = await matcher['server']({
                path:`/timer/${nameAuction}`,
                type:'timer'
              },'get', 'type')

              if(time['mongo']['time'] !== -1 && time['mongo']['time'] !== -2) {

              } else {
                console.log('---------')
              }

              // item.addEventListener('mouseenter', mouseenter)
              // item.addEventListener('mouseleave', mouseleave)
              // item.querySelector('.bidButton').addEventListener('click', start)
              // item.querySelector('.startButton').addEventListener('click', bid)
            }
            //end list
            // console.log('<============>', api)
            resolve()
          }
        })
        .catch(e => console.log('error items', e))
    }
  })
}