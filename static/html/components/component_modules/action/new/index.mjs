import store from '/static/html/components/component_modules/store/index.mjs'
import matcher from '/static/html/components/component_modules/matcher/matcher.mjs'
import utils from '/static/html/components/component_modules/utils/utils.mjs'
// import { menuSave, menuUpdate } from '/static/html/components/auction-card/modules/events/index.mjs'

export default {
    auction: {
        admin: {
            update: {
                lot: (object) => {
                    return new Promise(async (resolve, reject) => {
                      const feedItem = await matcher['mongo']({
                        input: 'action',
                        type:'feeds'
                      }, 'get', 'type')

                      console.log('-------------------', feedItem)
                        resolve()
                    })
                // /**
                // * получаем хранилище
                // */
                // store =  await staticProperty({
                //     input:'action',
                //     type: 'all'
                // }, 'get', 'type')
                //


                // let feedidItem = feedItem['mongo'][0]['_id']

                // let itemsItems = await feed({
                // input: 'action',
                // relation: obj['input'],
                // data: feedItem['mongo'][0]['feed']['rss'],
                // func: config['parseString']['parseString'],
                // type:'items'
                // }, 'get', 'type')


                // let itemItems = await feed({
                // input: 'action',
                // data: itemsItems,
                // target: obj['date']['utc'],
                // type:'item'
                // }, 'search', 'type')

                // itemItems['remove']['content:encoded'][0] = obj['data']['content']
                // itemItems['remove']['description'][0] = obj['data']['short_content']
                // itemItems['remove']['enclosure'][0]['$']['url'] = obj['data']['image']['data']
                // itemItems['remove']['title'][0] = obj['data']['title']

                // itemItems['feed'].unshift( itemItems['remove'])

                /**
                * create feed
                */
                // let newFeeds = await feed({
                //     input:'action',
                //     feed:feedItem['mongo'][0]['feed'],
                //     items: itemItems['feed'],
                //     type: 'feed'
                // }, 'create', 'type')
                /**
                * update mongo feed
                */
                // feedItem['mongo'][0]['feed']['rss'] = newFeeds


                /**
                * update feed it mongo
                */
                // let feedidItems = feedItem['mongo'][0]['_id']
                // let mongoFeed =  await  matcher['mongo']({
                //     input: 'action',
                //     id: feedidItems,
                //     data: JSON.stringify(feedItem['mongo'][0]['feed']),
                //     type:'feed'
                // }, 'update', 'type')
                /**
                * get old items
                */
                // let oldItem = await matcher['mongo']({
                //     input: 'action',
                //     type:'item',
                //     id:obj['date']['iso']
                // }, 'get', 'type')

                // if(oldItem['mongo'] === null) {
                // console.warn('нет id для обновления')
                // out(newFeeds)
                // } else {

                // oldItem['mongo']['item']['content_html'] = obj['data']['content']
                //
                // oldItem['mongo']['item']['summary'] = obj['data']['short_content']
                //
                // oldItem['mongo']['item']['image'] = obj['data']['image']['data']
                // oldItem['mongo']['item']['title'] = obj['data']['title']
                /**
                * update item to mongo
                */
                    // let mongoItem =  await  matcher['mongo']({
                    //     input: 'action',
                    //     id: obj['date']['iso'],
                    //     data: JSON.stringify(oldItem['mongo']['item']),
                    //     type:'item'
                    // }, 'update', 'type')
                // }



                // let contentSource =  await  utils({
                //     input:'varan-menu',
                //     data: obj['data']['content'],
                //     type:'string2html'
                // },'convert', 'type')

                // let description =  await  utils({
                //     input:'varan-menu',
                //     data: obj['data']['short_content'],
                //     type:'string2html'
                // },'convert', 'type')

                // for(let i = 0; i < store['lacerta-news'].length; i ++){
                // switch (store['lacerta-news'][i].slot) {
                // case 'lacerta-news':
                // let children =  store['lacerta-news'][i]['obj']['this'].shadowRoot.querySelector('#news').children

                // for(let i =0; i < children.length;i++){
                //   let time = children[i].querySelector('.timestamp').innerText
                //   time =+time
                //   if(obj['date']['timestamp'] === time){
                //       let target = children[i]
                //       target.querySelector('.gallery').src =  obj['data']['image']['data']
                //       target.querySelector('.title').innerText = obj['data']['title']
                //       target.querySelector('.contentOut').innerHTML = ''
                //       target.querySelector('.contentOut').insertAdjacentHTML('beforeend',contentSource )
                //       target.querySelector('.preview').innerHTML = ''
                //       target.querySelector('.preview').insertAdjacentHTML('beforeend',description )
                //   }
                // }

                // let out = {}
                // for(let i = 0; i < store['varan-editor'].length; i ++){
                //   switch (store['varan-editor'][i].slot) {
                //       case 'description':
                //           out = store['varan-editor'][i]['obj']['this'].querySelector('varan-menu')
                //           if(out.shadowRoot === null || out.shadowRoot === undefined){
                //
                //           }else{
                //               out = out.shadowRoot
                //           }
                //           out.querySelector('.menu-convert').disabled = false;
                //           out.querySelector('.menu-convert').style.backgroundColor = '#e1e1e1';
                //           out.querySelector('.menu-save').disabled = false;
                //           out.querySelector('.menu-save').style.backgroundColor = '#e1e1e1';
                //           out.querySelector('.update').remove()
                //           break
                //       case 'content':
                //           out = store['varan-editor'][i]['obj']['this'].querySelector('varan-menu')
                //           if(out.shadowRoot === null || out.shadowRoot === undefined){
                //
                //           }else{
                //               out = out.shadowRoot
                //           }
                //           out.querySelector('.menu-convert').disabled = false;
                //           out.querySelector('.menu-convert').style.backgroundColor = '#e1e1e1';
                //           out.querySelector('.menu-save').disabled = false;
                //           out.querySelector('.menu-save').style.backgroundColor = '#e1e1e1';
                //           out.querySelector('.update').remove()
                //           break
                //       default:
                          // console.warn('~~~~~~~~~', 'На этот объект нет действия ',store['lacerta-news'][i].slot )
                          // break
                  // }
                // }
              }
            },
            get: {
                item: (object) => {
                    return new Promise( async (resolve, reject) => {
                      /**
                       * get current feed
                       */
                    const feeds = await matcher['mongo']({
                        input: 'action',
                        type: 'bidItem',
                        date: object['date']['iso']
                    }, 'get', 'type')

                      const components = store.get.all()

                      console.log('-----------------', store)

                      /**
                       * собираю всю информацию
                       * @type {{}}
                       */
                      let content = {}
                      let img = feeds['mongo']['item']['image']
                      let title = feeds['mongo']['item']['title']
                      let time = feeds['mongo']['item']['details']['time']
                      let price = feeds['mongo']['item']['details']['price']

                      let content_html = await utils({
                          input:'varan-menu',
                          data: feeds['mongo']['item']['content_html'],
                          type:'string2html'
                      },'convert', 'type')

                      let summary = await utils({
                          input:'varan-menu',
                          data: feeds['mongo']['item']['summary'],
                          type:'string2html'
                      },'convert', 'type')

                      for(let i = 0; i < components['auction-card'].length; i ++) {
                          switch (components['auction-card'][i]['type']) {
                              case 'admin':
                                  let admin = components['auction-card'][i]['this']
                                  admin.querySelector('.name').value = title
                                  admin.querySelector('.imgBid').src = img
                                  admin.querySelector('.timer').value = time
                                  admin.querySelector('.price').value = price
                                  break
                              default:
                                  break
                          }
                      }

                      let menu = {}
                      for(let i = 0; i < components['varan-editor'].length; i ++) {
                          switch (components['varan-editor'][i].slot) {
                              case 'cardDescription':
                                  content['description'] = summary

                                  if(components['varan-editor'][i]['menu'].querySelector('.menu-convert') === null
                                    || components['varan-editor'][i]['menu'].querySelector('.menu-convert') === 'null') {
                                      menu = components['varan-editor'][i]['menu'].shadowRoot
                                  } else {
                                      menu = components['varan-editor'][i]['menu']
                                  }

                                  // console.log('menu', menu)
                                  // console.assert(false)
                                  if(menu.querySelector('.update') !== null) {
                                      menu.querySelector('.update').remove()
                                  }

                                  menu.querySelector('.menu-convert').insertAdjacentHTML('afterend', `<button class="update" type="button">update</button>`)
                                  // menu.querySelector('.update').addEventListener('click',menuUpdate)
                                  // menu.querySelector('.menu-save').addEventListener('click', menuSave)

                                  components['varan-editor'][i]['obj']['this'].querySelector('.wall').innerHTML =  content['description']
                                  components['varan-editor'][i]['editor']['quill'].root.innerHTML = content['description']
                                  break
                              case 'cardContent':
                                  content['content'] = content_html
                                  if(components['varan-editor'][i]['menu'].querySelector('.menu-convert') === null ||
                                    components['varan-editor'][i]['menu'].querySelector('.menu-convert') === 'null') {
                                      menu = components['varan-editor'][i]['menu'].shadowRoot
                                  } else {
                                      menu = components['varan-editor'][i]['menu']
                                  }

                                  if(menu.querySelector('.update') !== null) {
                                      menu.querySelector('.update').remove()
                                  }

                                  menu.querySelector('.menu-convert').insertAdjacentHTML('afterend', `<button class="update" type="button">update</button>`)
                                  // menu.querySelector('.update').addEventListener('click',menuUpdate)
                                  // menu.querySelector('.menu-save').addEventListener('click', menuSave)

                                  components['varan-editor'][i]['obj']['this'].querySelector('.wall').innerHTML =  content['content']
                                  components['varan-editor'][i]['editor']['quill'].root.innerHTML = content['content']
                                  break
                              default:
                                  console.warn('~~~~~~~~~', 'На этот объект нет действия ',components['varan-editor'][i].slot )
                                  break
                          }
                      }
                      /**
                       * Новый статус для кнопки
                       * @type {string}
                       */
                      object.button.textContent = 'данные в редакторe'
                      setTimeout(() => {
                          object.button.textContent = 'изменить'
                          object.button.disabled = false;
                      },2000);
                  })
              }
          }
        },
        get: {
            items: {
                bid: () => {
                    return new Promise(async (resolve, reject) => {
                        resolve(await  matcher['mongo']({
                            input: 'action',
                            type:'itemsBid'
                        }, 'get', 'type'))
                    })
                }
            }
        },
    }
}