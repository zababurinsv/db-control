import action from '/static/html/components/component_modules/action/new/index.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'

let queue = {}
queue.components = {}

let handler = {
  set: function(obj, prop, value) {
    obj[prop] = value;
    switch (prop) {
      case 'length':
        if(obj.length === 1) {
          let timerId = setTimeout(async function tick() {
            if(obj.length === 0) {
              clearTimeout(timerId);
            } else {
              switch(obj[0].type) {
                case 'auction.admin.get.item':
                    action.auction.admin.get.item({
                      type: 'bid',
                      input: 'auction-card',
                      button: obj[0].button,
                      this: obj[0].this,
                      date: obj[0].date
                    }).catch(e => console.log('error', e))
                  break
                case 'auction.admin.update.lot':
                    action.auction.admin.update.lot(obj[0]).catch(e => console.log('error', e))
                  break
                default:
                  console.log('Неизвестный Action', obj[0])
                  break
              }
              // switch (obj[0]['task']['type']) {


              // switch (obj[0]['task']['type']) {
              //   case 'delete':
              //     if(!obj[0]['name']){
              //       obj[0]['name'] = 'default'
              //     }
              //     switch (obj[0]['name']) {
              //       case 'bid':
              //         await action({
              //           input:'static-property',
              //           date:obj[0]['task']['date'],
              //           remove:obj[0]['task']['remove'],
              //           type:'bid'
              //         }, 'delete', 'type')
              //         break
              //       default:
              //         await action({
              //           input:'static-property',
              //           date:obj[0]['task']['date'],
              //           remove:obj[0]['task']['remove'],
              //           type:'news'
              //         }, 'delete', 'type')
              //         break
              //     }
              //     break
              //   case 'create':
              //     let convert = new CustomEvent('convertAction', {
              //       detail: {
              //         data: obj[0]['task']['data']
              //       }
              //     })
              //     document.dispatchEvent(convert)
              //     break
              //   case 'update':
              //     if(!obj[0]['name']) {
              //       obj[0]['name'] = 'default'
              //     }
              //     switch (obj[0]['name']) {
              //       case 'bid':
              //         action({
              //           button: obj[0]['task']['button'],
              //           input:'varan-card-news',
              //           this: obj[0]['task']['this'],
              //           date:obj[0]['task']['date'],
              //           type:'bid'
              //         }, 'update', 'type')
              //         break
              //       default:
              //         action({
              //           button: obj[0]['task']['button'],
              //           input:'lacerta-news',
              //           this: obj[0]['task']['this'],
              //           date:obj[0]['task']['date'],
              //           type:'news'
              //         }, 'update', 'type')
              //         break
              //     }
              //     break
              //   case 'updateAction':
              // if(!obj[0]['name']){
              //   obj[0]['name'] = 'default'
              // }
              // let updateAction ={}
              // switch (obj[0]['name']) {
              //   case 'bid':
              // updateAction = new CustomEvent('updateAction', {
              //   detail: {
              //     date: obj[0]['task']['date'],
              //     data: obj[0]['task']['update'],
              //     name:'bid'
              //   }
              // })
              // document.dispatchEvent(updateAction)
              // break
              // default:
              //   console.log('default')
              // updateAction = new CustomEvent('updateAction', {
              //   detail: {
              //     date: obj[0]['task']['date'],
              //     data: obj[0]['task']['update'],
              //     name:'news'
              //   }
              // })
              // document.dispatchEvent(updateAction)
              // break
              // }
              // break
              // default:
              //   break
              // }
              obj.shift()
              timerId = setTimeout(tick, 10);
            }
          }, 0);
        }
        break
      default:
        break
    }
    return true
  }
}

export default {
  set: {
    component: (object) => {
      return new Promise((resolve) => {
        if(isEmpty(object.component)) {
          console.assert(false, 'Должно быть свойство components')
        } else {
          if (!Array.isArray(queue.components[object.component])) {
            queue.components[object.component] = []
          }
          resolve(queue.components[object.component].push(object))
        }
      })
    },
    editor: (object) => {
      return new Promise((resolve) => {
        if(isEmpty(queue.components['varan-editor'])) {
          queue.components['varan-editor'] = []
          queue.components['varan-editor'].push(object['editor'])
          resolve(object.components['editor'])
        } else {
          let verify = false
          let position = 0
          let count = 0

          for(let i = 0; i < queue.components['varan-editor'].length; i++) {
            if(isEmpty(object['slot'])) {
              console.assert(false, 'должен быть слот')
            } else {
              if(object['slot'] === queue.components['varan-editor'][i]['slot']) {
                verify = true
                position = i
                count++
              }
            }
          }
          if(verify) {
            if(count > 1) {
              console.assert(false , 'Должен быть один объект')
            } else {
              queue.components['varan-editor'][position]['editor'] = object['editor']
              resolve(object['editor'])
            }
          } else {
            queue.components['varan-editor'].push(object['editor'])
            resolve(object['editor'])
          }
        }
      })
    }
  },
  get: {
    all: () => queue.components,
    components: component => queue.components[component],
    editor: (obj) => {
      return new Promise((resolve, reject) => {
        let verify = false
        let position = 0
        let count = 0
        if(isEmpty(queue.components['varan-editor'])) {
          resolve(undefined)
        } else {
          for(let i = 0; i < queue.components['varan-editor'].length; i++) {
            if(obj['target'] === queue.components['varan-editor'][i]['slot']) {
              verify = true
              position = i
              count++
            }
          }
          if(verify){
            if(count > 1) {
              console.assert(false , 'должен быть один объект')
            } else {
              resolve(queue.components['varan-editor'][position]['editor'])
            }
          } else {
            resolve(undefined)
          }
        }
      })
    }
  },
  remove: {
    editor: (obj) => {
      return new Promise((resolve, reject) => {
        if(isEmpty(queue.components['varan-editor'])) {
          resolve(true)
        } else {
          for(let i = 0; i < queue.components['varan-editor'].length; i++) {
            if(obj === queue.components['varan-editor'][i]['slot']) {
              queue.components['varan-editor'].splice(i, 1);
            }
          }
        }
      })
    },
    auctionCard: (obj) => {
      return new Promise((resolve, reject) => {
        if(isEmpty(queue.components['auction-card'])) {
          resolve(true)
        } else {
          for(let i = 0; i < queue.components['auction-card'].length; i++) {
            if(queue.components['auction-card'][i].type === 'admin') {
              queue.components['auction-card'].splice(i, 1);
            }
          }
        }
      })
    }
  },
  dispatch: (object) => {
    return new Promise((resolve) => {
      if(!Array.isArray(queue.task)) {
        queue.task = []
        queue.task = new Proxy(queue.task, handler)
      }
      resolve(queue.task.push(object))
    })
  }
}