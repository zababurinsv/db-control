import localStorage from '/static/html/components/component_modules/matcher/matcher/this/database/localStorage/localStorage.mjs'
import firebase from '/static/html/components/component_modules/matcher/matcher/this/database/firebase/firebase.mjs'
import IndexedDB from '/static/html/components/component_modules/matcher/matcher/this/database/IndexedDB/IndexedDB.mjs'
import mongodb from '/static/html/components/component_modules/matcher/matcher/this/database/mongoDb/mongodb.mjs'

let name = {}
let exception = []

exception.push('edit')
exception.push('varan-menu')

let status = true
let status_n = {}
status_n[0] = false
status_n[1] = true
function colorLog (message, color, ...args) {
  color = color || 'black'
  switch (color) {
    case 'success':
      color = 'Green'
      break
    case 'info':
      color = 'DodgerBlue'
      break
    case 'error':
      color = 'Red'
      break
    case 'warning':
      color = 'Orange'
      break
    default:
  }
  console.log('%c' + message, 'color:' + color, ...args)
}
let init = {}

init['indexeddb'] = function (obj) {
  let indexeddb = {}
  indexeddb['DB_NAME'] = 'varan'
  indexeddb['DB_VERSION'] = 1
  indexeddb['DB_STORE_NAME'] = 'images'
  indexeddb['db'] = {}
  indexeddb['pubKey'] = {}
  obj['indexeddb'] = indexeddb
  return (obj)
}

let request = {}
let database = {}
let property = {}
let func = {}
database['mongoDB'] = {}
database['firebase'] = {}
database['indexedDB'] = {}
database['localStorage'] = {}
request['database'] = database
property['name'] = {}
property['key'] = {}
property['url'] = {}
property['taskUrl'] = {}
property['fullPath'] = {}
property['file'] = {}
property['data'] = {}
request['property'] = property

func['fileLoader'] = function (obj) {
  return new Promise(function (resolve, reject) {
    if (!obj['upload']['file']) {
      resolve(obj)
    } else {
      if (typeof (obj['upload']['file']) === 'string') {

      } else {
        let reader = new FileReader()
        reader.readAsDataURL(obj['upload']['file'])
        reader.onload = function (e) {
          obj['upload']['url'] = e.target.result
          resolve(obj)
        }
      }
    }
  })
}

func['getAll'] = function (obj) {
  return new Promise(function (resolve, reject) {
    // console.log('~~~~~~~~~getAll~~~~~~~~~')
    if (obj['indexeddb'] === null || obj['indexeddb'] === undefined) {
      obj = init['indexeddb'](obj)
    }
    IndexedDB['getAll'](obj)
      .then((obj) => {
        resolve(obj)
      })
  })
}
func['getImageById'] = function (obj) {
  return new Promise(function (resolve, reject) {
    // console.log('~~~~~~~~~~~updImages~~~~~~~~~~~~')
    let c = 0
    if (obj['indexeddb'] === null || obj['indexeddb'] === undefined) {
      obj = init['indexeddb'](obj)
    }

    if (c === 0) {
      resolve(IndexedDB['getImageById'](obj))
      c++
    }
  })
}

func['verifyLocal'] = function (obj) {
  return new Promise(function (resolve, reject) {

  })
}

func['verifyMongo'] = function (obj) {
  return new Promise(function (resolve, reject) {
  })
}

func['crud'] = async function (obj) {
  colorLog('~~~~~~~~~~~~~~<varan-crud>~~~~~~~~~~~~~~', '#808000', obj['crud'])
  name = {}
  if (!obj['slot']) {
    name = obj['parent']
  } else {
    if (obj['slot'] === 'edit') {
      name = obj['parent']
    } else {
      name = obj['slot']
    }
  }
  for (let type in obj['crud']['localDb']) {
    console.log('~~~~~~~~~~<crud>~~~~~~~~~~~~~', obj['crud']['localDb'][type], type)
    let out = []
    switch (type) {
      case 'delete':
        if (obj['crud']['localDb'][type].length === 0) {

        } else {
          let del = {}
          for (let object in obj['crud']['localDb'][type]) {
            console.log(object)
            console.assert(status, obj['crud']['localDb'][type][object])
            // obj = await mongodb['setFile'](obj)
            // console.log('---update-----', obj['crud']['localDb'][type][object])
          }
          // obj['delObj'] = {}
          // obj['delObj']['id']
          console.assert(status, obj['crud']['localDb'][type])
        }
        break
      case 'update':
        if (obj['crud']['localDb'][type].length === 0) {

        } else {
          for (let object in obj['crud']['localDb'][type]) {
            obj['get'] = null
            obj['get_n'] = null
            obj['upload'] = obj['crud']['localDb'][type][object]
            obj = await func['updateuId'](obj)
            obj['upload'] = null
            obj['update'] = obj['get_n'][0]
            obj = await mongodb['updateClientId'](obj)
          }
        }
        break
      case 'set':
        if (obj['crud']['localDb'][type].length === 0) {

        } else {
          for (let object in obj['crud']['localDb'][type]) {
            obj['upload'] = obj['crud']['localDb'][type][object]
            obj = await func['setImagesLocal'](obj)
            obj['upload'] = null
            obj['upload'] = obj['get_n'][0]
            obj['get'] = null
            obj['get_n'] = null
            obj = await func['updateLocal'](obj)
            obj['update'] = obj['get_n'][0]
            obj['get'] = null
            obj['get_n'] = null
            // console.assert(status, obj)
            obj = await mongodb['updateClientId'](obj)
            out.push(obj['get_n'][0])
            console.log('@@@@@@@@@@', out)
            obj['get'] = null
            obj['get_n'] = null
            obj['update'] = null
            obj['upload'] = null
          }
          name = {}
          if (!obj['slot']) {
            name = obj['parent']
          } else {
            if (obj['slot'] === 'edit') {
              name = obj['parent']
            } else {
              name = obj['slot']
            }
          }
          obj['get'] = {}
          obj['get_n'] = {}
          obj['get'][name] = {}
          for (let key = 0; key < out.length; key++) {
            obj['get'][name][`${out[key]['id']}`] = out[key][name]
          }
          obj['get_n'] = out
          out = []
          console.assert(status_n[1], obj)
        }
        break
      case 'setLocal':
        if (obj['crud']['localDb'][type].length === 0) {

        } else {
          for (let object in obj['crud']['localDb'][type]) {
            obj['set'] = obj['crud']['localDb'][type][object]
            obj = await func['setImagesLocalWithoutTimeStamp'](obj)
            obj['update'] = obj['get_n'][0]
            obj['get'] = null
            obj['get_n'] = null
            obj = await mongodb['updateClientId'](obj)
            out.push(obj['get_n'][0])
            obj['get'] = null
            obj['get_n'] = null
            obj['update'] = null
            obj['upload'] = null
          }
          name = {}
          if (!obj['slot']) {
            name = obj['parent']
          } else {
            if (obj['slot'] === 'edit') {
              name = obj['parent']
            } else {
              name = obj['slot']
            }
          }
          obj['get'] = {}
          obj['get_n'] = {}
          obj['get'][name] = {}
          for (let key = 0; key < out.length; key++) {
            obj['get'][name][`${out[key]['id']}`] = out[key][name]
          }
          obj['get_n'] = out
          out = []
          console.assert(status_n[1], obj)
        }
        break
      case 'set&update':
        out = []
        if (obj['crud']['localDb'][type].length === 0) {

        } else {
          for (let object in obj['crud']['localDb'][type]) {
            obj['set&update'] = obj['crud']['localDb'][type][object]
            obj['get'] = null
            obj['get_n'] = null
            obj['upload'] = obj['crud']['localDb'][type][object]
            obj['update'] = null

            obj = await func['setImagesLocal'](obj)
            obj['upload'] = obj['get_n'][0]
            obj['get'] = null
            obj['get_n'] = null
            console.assert(status, obj)
            obj = await func['updateLocal'](obj)
            obj['update'] = obj['get_n'][0]
            obj['get'] = null
            obj['get_n'] = null
            obj = await mongodb['updateClientId'](obj)
            obj['get'] = null
            obj['get_n'] = null
            obj['update'] = null
            obj['upload'] = null
          }
          // name = {}
          // if (!obj['slot']) {
          //   name = obj['parent']
          // } else {
          //   if (obj['slot'] === 'edit') {
          //     name = obj['parent']
          //   } else {
          //     name = obj['slot']
          //   }
          // }
          // obj['get'] = {}
          // obj['get_n'] = {}
          // obj['get'][name] = {}
          // for (let key = 0; key < out.length; key++) {
          // console.assert(status, out[key][name])
          // obj['get'][name][`${out[key]['id']}`] = out[key][name]
          // }
          // obj['get_n'] = out
          // console.assert(status, obj)
        }
        break
      case 'get':
        if (obj['crud']['localDb'][type].length === 0) {

        } else {
          console.log('----get----', obj['crud']['mongoDb'][type])
        }
        break
      default:
        console.assert(status, 'пришло что то неизвестное', type)
        break
    }
  }
  for (let type in obj['crud']['mongoDb']) {
    switch (type) {
      case 'delete':
        if (obj['crud']['mongoDb'][type].length === 0) {

        } else {
          console.log('mongo delete', obj['crud']['mongoDb'][type])
          for (let object in obj['crud']['mongoDb'][type]) {
            obj['delete'] = obj['crud']['mongoDb'][type][object]
            obj = await mongodb['delFile'](obj)
            console.log('----delete----', obj['crud']['mongoDb'][type][object])
          }
        }
        break
      case 'update':
        if (obj['crud']['mongoDb'][type].length === 0) {

        } else {

        }
        break
      case 'set':
        if (obj['crud']['mongoDb'][type].length === 0) {

        } else {
          for (let object in obj['crud']['mongoDb'][type]) {
            obj['set'] = obj['crud']['mongoDb'][type][object]
            obj = await mongodb['setFile'](obj)
            obj['upload'] = obj['mongo']
            obj['update'] = null
            console.assert(status, obj)
            obj = await func['updateLocal'](obj)
            obj['upload'] = obj['get_n'][0]
            console.assert(status, obj)
            obj = await mongodb['updFile'](obj)
            obj = await func['getImage'](obj)
          }
        }
        break
      case 'set&update':
        if (obj['crud']['mongoDb'][type].length === 0) {

        } else {
          for (let object in obj['crud']['mongoDb'][type]) {
            obj['set'] = obj['crud']['mongoDb'][type][object]
            obj = await mongodb['setFile'](obj)
            obj['upload'] = obj['mongo']
            obj['update'] = null
            console.assert(status, obj)
            obj = await func['updateLocal'](obj)
            obj['upload'] = obj['get_n'][0]
            console.assert(status, obj)
            obj = await mongodb['updFile'](obj)
            obj = await func['getImage'](obj)
          }
        }
        break
      case 'get':
        if (obj['crud']['mongoDb'][type].length === 0) {

        } else {

        }
        break
      default:
        console.assert(status, 'пришло что то неизвестное')
        break
    }
  }
  console.assert(status, obj)
  return obj
}

func['verify'] = async function (obj) {
  if (obj['indexeddb'] === null || obj['indexeddb'] === undefined) {
    obj = init['indexeddb'](obj)
  }
  obj = await IndexedDB['getObject'](obj)
  if (!obj['get']) {
    obj = await mongodb['getFile'](obj)
    if (obj['mongo'].length === 0) {
      obj['get'] = null
      return obj
    } else {
      let name = {}
      if (!obj['slot']) {
        name = obj['parent']
      } else {
        if (obj['slot'] === 'edit') {
          name = obj['parent']
        } else {
          name = obj['slot']
        }
      }
      obj['get'] = {}
      obj['get'][name] = {}
      for (let key = 0; key < obj['mongo'].length; key++) {
        console.log(obj['mongo'][key])
        obj['get'][name][`${obj['mongo'][key]['id']}`] = obj['mongo'][key][name]
      }
      obj['get_n'] = obj['mongo']
    }
  }
  return obj
}

func['addMongo'] = function (obj) {
  return new Promise(function (resolve, reject) {
    console.assert(status, obj)
  })
}

func['getObjectLocal'] = function (obj) {
  return new Promise(function (resolve, reject) {
    if (obj['indexeddb'] === null || obj['indexeddb'] === undefined) {
      obj = init['indexeddb'](obj)
    }
    IndexedDB['getObject'](obj)
      .then((obj) => {
        if (!obj['get']) {
          obj['get'] = null
        }
        resolve(obj)
      })
  })
}
function pause (obj) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(obj)
    }, 900)
  })
}
func['getObject'] = async function (obj) {
  if (obj['indexeddb'] === null || obj['indexeddb'] === undefined) {
    obj = init['indexeddb'](obj)
  }
  colorLog('======================================================================================================', '#8B008B')
  let name = {}
  if (!obj['slot']) {
    name = obj['parent']
  } else {
    if (obj['slot'] === 'edit') {
      name = obj['parent']
    } else {
      name = obj['slot']
    }
  }
  /**
   *  news
   */
  if (name === 'varan-rss' || name === 'varan-slider-news') {
    obj['crud'] = {}
    obj['crud']['localDb'] = {}
    obj['crud']['mongoDb'] = {}
    obj['crud']['localDb']['set'] = []
    obj['crud']['localDb']['delete'] = []
    obj['crud']['mongoDb']['set'] = []
    obj['crud']['mongoDb']['delete'] = []
    if (name === 'varan-rss') { name = 'varan-slider-news' }
    obj = await IndexedDB['getObject'](obj)
    if (!obj['get']) {
      obj = await mongodb['getFile'](obj)
      if (obj['mongo'].length === 0) {
        obj['get'] = null
        return obj
      } else {
        if (obj['mongo'].length === 1) {
          if (!obj['slot']) {
            name = obj['parent']
          } else {
            if (obj['slot'] === 'edit') {
              name = obj['parent']
            } else {
              name = obj['slot']
            }
          }
          obj['set'] = {}
          obj['set']['id'] = obj['mongo'][0]['id']
          obj['set']['object'] = name
          obj['set'][name] = {}
          obj['set'][name]['feed'] = obj['mongo'][0][name]
          obj = await func['setImagesLocal'](obj)
          colorLog(`~~~~~~~~~~~<database>~!obj['get']~~~~~~~~~~`, '#808000', obj)
          return obj
        } else {
          colorLog(`~~~~~~~~~~~~~~~<database>~obj['get']~~~~~~~~~~~~~~`, '#808000', obj)
          // obj = await mongodb['updateClientId'](obj)
          // console.assert(status, 'пришло больше одного объекта новостей, один объект это основная лента остальное ещё не делал')
        }
      }
    } else {
      obj = await mongodb['getFile'](obj)
      if (!obj['slot']) {
        name = obj['parent']
      } else {
        if (obj['slot'] === 'edit') {
          name = obj['parent']
        } else {
          name = obj['slot']
        }
      }
      if (obj['mongo'].length === 0) {
        if (obj['get_n'].length === 1) {
          obj['set'] = obj['get_n'][0]
          obj['crud']['mongoDb']['set'].push(obj['set'])
          obj = await func['crud'](obj)
          return obj
        } else {
          console.assert(status, obj['get_n'])
        }
      } else {
        obj['update'] = obj['get_n'][0]
        if (!obj['update']) { obj['update'] = {} }
        if (!obj['update']['varan-slider-news']) { obj['update']['varan-slider-news'] = {} }
        obj['update']['varan-slider-news']['feed'] = obj['mongo'][0]['varan-slider-news']
        obj = await func['updateFeed'](obj)
        return obj
      }
    }
  } else {
    /**
     * все остальные объекты !obj['get']
     */
    obj['crud'] = {}
    obj['crud']['localDb'] = {}
    obj['crud']['mongoDb'] = {}
    obj['crud']['localDb']['set'] = []
    obj['crud']['localDb']['delete'] = []
    obj['crud']['mongoDb']['set'] = []
    obj['crud']['mongoDb']['delete'] = []

    obj['get'] = null
    obj['get_n'] = null
    obj['mongo'] = null
    obj = await IndexedDB['getObject'](obj)
    if (!obj['get']) {
      obj = await mongodb['getFile'](obj)
      if (obj['mongo'].length === 0) {
        obj['get'] = null
        // console.assert(false, obj)
        return obj
      } else {
        obj['crud']['localDb']['setLocal'] = obj['mongo']
        console.assert(status_n[1], obj)
        obj = await func['crud'](obj)
        console.assert(status_n[1], obj)
        return obj
      }
    } else {
      /**
       * есть объект get (get_n)
       */
      obj = await mongodb['getFile'](obj)
      if (!obj['mongo'] || obj['mongo'].length === 0) {
        if (!obj['slot']) {
          name = obj['parent']
        } else {
          if (obj['slot'] === 'edit') {
            name = obj['parent']
          } else {
            name = obj['slot']
          }
        }
        obj['set'] = {}
        obj['set'][name] = {}
        let out = {}
        out['set'] = {}
        out['set']['id'] = {}
        out['set']['id'] = {}
        for (let keys in obj['get_n']) {
          if (!obj['get_n'][keys][name]['file']) {

          } else {
            obj['get_n'][keys][name]['_id'] = null
            if (typeof (obj['get_n'][keys][name]['file']) === 'string') {} else {
              obj = await func['fileLoader'](obj, keys, name)
            }
            let length = obj['get_n'][keys][name]['file'].length
            obj['get_n'][keys][name]['length'] = length
          }
          obj['crud']['mongoDb']['set'].push(obj['get_n'][keys])
        }
        obj = await func['crud'](obj)
        return obj
      } else {
        /***
         * есть объект get(get_n) и mongo
         */
        if (!obj['slot']) {
          name = obj['parent']
        } else {
          if (obj['slot'] === 'edit') {
            name = obj['parent']
          } else {
            name = obj['slot']
          }
        }
        let local = obj['get_n']
        let mongo = obj['mongo']
        let count = 0
        // while (!local) {
        //     console.warn('Ждём локальный объект')
        // if (local) {
        // local = null
        // mongo = null
        // local = obj['get_n']
        // mongo = obj['mongo']
        // break
        // }
        // obj = await pause(obj)
        // if (count === 10) {
        //   obj = await IndexedDB['getObject'](obj)
        //   if (!obj['get']) {
        //     obj = await mongodb['getFile'](obj)
        //     if (obj['mongo'].length === 0) {
        //       obj['get'] = null
        //       return obj
        //     } else {
        //       obj['crud']['localDb']['set'] = obj['mongo']
        //       obj = await func['crud'](obj)
        //       return obj
        //     }
        //   } else {
        //     local = null
        //     mongo = null
        //     obj = await mongodb['getFile'](obj)
        //     local = obj['get_n']
        //     mongo = obj['mongo']
        //     break
        //   }
        // }
        // count++
        // }
        while (!local) {
          console.warn('Ждём локальный объект')
          local = null
          mongo = null
          local = obj['get_n']
          mongo = obj['mongo']
          obj = await pause(obj)
        }
        let keyVerify = {}
        let keyVerifyMongo = null
        let keyVerifylocal = null
        let NewObjectMongo = []
        let NewObjectLocal = []
        let keyMongo = []
        let keyLocal = []
        let cycle = 0
        colorLog('~~~~~~~~~~~~~<сравнение-объектов>~~~~~~~~~~~~~', 'MediumSlateBlue')
        console.log('local', Object.keys(local), local)
        console.log('mongo', Object.keys(mongo), mongo)
        colorLog('~~~~~~~~~~~~~<сравнение-объектов>~~~~~~~~~~~~~', 'MediumSlateBlue')
        // первый цикл
        for (let keysMongo in mongo) {
          colorLog(`~~~~~~~~~~~~~<проверяем-объект-mongo>~~~~~~~~~~~~~`, 'red', mongo[keysMongo])
          let verifyId = false
          let verifyIdm = false
          let verifyTimeStamp = false
          let keyVerifyuId = false
          for (let keysLocal in local) {
            // второй цикл
            let keyVerifyLocaluId = false
            if (cycle > 0) {
              colorLog('~~~~~~~~~~~~~~~~~~~~~~объект уже проверен~~~~~~~~~~~~~~~~~~~~~~', 'red')
            } else {
              for (let keysMongoLocal in mongo) {
                // третий цикл
                if (!local[keysLocal][name]['uId']) { console.assert(status, 'должен быть uId', local[keysLocal][name]) }
                if (!mongo[keysMongoLocal][name]['uId']) { console.assert(status, 'должен быть uId', mongo[keysMongoLocal][name]) }

                if (local[keysLocal][name]['uId'] === mongo[keysMongoLocal][name]['uId']) {
                  keyVerifyLocaluId = true
                  keyVerifylocal = keysLocal
                }
              }
              colorLog('[<->]~~~~~~~~~~~verify~~~(keyVerifyLocaluId)~~~~~~~', '#fe3d00', keyVerifyLocaluId)
              if (keyVerifyLocaluId === false) {
                keyLocal.push(keysLocal)
                let object = local[keysLocal]
                object['type'] = obj['type']
                NewObjectLocal.push(object)
                colorLog('[<-0->]~~~~~~~~~~~Новый~Объект~~~~~~~~~~', '#fe9d00', NewObjectLocal)
              }
            }
            /// ////////////////////////////////////////////////////
            if (mongo[keysMongo]['id'] === local[keysLocal]['id']) {
              verifyId = true
              keyVerify = keysLocal
            }
            if (!local[keysLocal][name]['timeStamp']) { console.assert(status, `local - должен быть timeStamp`, obj) }
            if (!mongo[keysMongo][name]['timeStamp']) { console.assert(status, `obj['mongo'] - должен быть timeStamp`, mongo[keysMongo]) }

            if (local[keysLocal][name]['timeStamp'] === mongo[keysMongo][name]['timeStamp']) {
              verifyTimeStamp = true
              keyVerify = keysLocal
            }
            if (!local[keysLocal][name]['_id']) {
              colorLog('[<->]~~~~~~~~~~~~~~~~~_id~local~не~установлен', '#fe3d00', local[keysLocal])
              console.assert(status, 'не установлен но по идее должен быть')
            } else {
              if (!mongo[keysMongo]['_id']) { console.assert(status, `obj['mongo'] - должен быть _id`, obj) }
              if (mongo[keysMongo]['_id'] === local[keysLocal][name]['_id']) {
                verifyIdm = true
                keyVerify = keysLocal
              }
            }
            if (!local[keysLocal][name]['uId']) { console.assert(status, 'должен быть uId', local[keysLocal][name]) }
            if (!mongo[keysMongo][name]['uId']) { console.assert(status, 'должен быть uId', mongo[keysMongo][name]) }
            if (local[keysLocal][name]['uId'] === mongo[keysMongo][name]['uId']) {
              keyVerifyuId = true
              keyVerify = keysLocal
            }
          }
          cycle++
          if (keyVerifyuId === false) {
            let object = mongo[keysMongo]
            object['type'] = obj['type']
            NewObjectMongo.push(object)
          }
          colorLog('[<->]~~~~~~~~~~~verify~~~( id)~~~~~~~', '#fe3d00', verifyId)
          colorLog('[<->]~~~~~~~~~~~verify~~~(_id)~~~~~~~', '#fe3d00', verifyIdm)
          colorLog('[<->]~~~~~~~~~~~verify~~~timeStamp~~~', '#fe3d00', verifyTimeStamp)
          colorLog('[<->]~~~~~~~~~~~verify~~~(uId)~~~~~~~', '#fe3d00', keyVerifyuId)
          colorLog('[-()-]~~~~~~~~~~~NewObjectMongo~~~~~~~', '#8904B1', NewObjectMongo)
          colorLog('[-()-]~~~~~~~~~~~NewObjectLocal~~~~~~~~~~', '#8904B1', NewObjectLocal)
          obj['crud'] = {}
          obj['crud']['localDb'] = {}
          obj['crud']['mongoDb'] = {}
          obj['crud']['localDb']['set'] = []
          obj['crud']['localDb']['set&update'] = []
          obj['crud']['localDb']['delete'] = []
          obj['crud']['localDb']['update'] = []
          obj['crud']['mongoDb']['set'] = []
          obj['crud']['mongoDb']['set&update'] = []
          obj['crud']['mongoDb']['delete'] = []
          let localText = {}
          if (NewObjectLocal.length > 0) {
            for (let key = 0; key < NewObjectLocal.length; key++) {
              for (let id in NewObjectLocal[key]['type']) {
                switch (NewObjectLocal[key]['type'][id]) {
                  case 'text':
                    localText = NewObjectLocal[key][name]
                    break
                  case 'slider-one-text':
                    obj['crud']['mongoDb']['set&update'].push(NewObjectLocal[key])
                    break
                  case 'slider-one-gallery':
                    obj['crud']['mongoDb']['set&update'].push(NewObjectLocal[key])
                    break
                  case 'gallery':
                    obj['crud']['mongoDb']['set&update'].push(NewObjectLocal[key])
                    break
                  default:
                    colorLog('неотслеживаемый тип', NewObjectLocal[key]['type'][id])
                    break
                }
              }
            }
            obj = await func['crud'](obj)
            NewObjectLocal = []
          }

          if (NewObjectMongo.length > 0) {
            for (let key = 0; key < NewObjectMongo.length; key++) {
              for (let id in NewObjectMongo[key]['type']) {
                switch (NewObjectMongo[key]['type'][id]) {
                  case 'text':
                    let updateLocal = NewObjectMongo[key][name]
                    updateLocal['id'] = localText['id']
                    obj['crud']['localDb']['update'].push(updateLocal)
                    break
                  case 'slider-one-text':
                    obj['crud']['localDb']['set&update'].push(NewObjectMongo[key])
                    break
                  case 'slider-one-gallery':
                    obj['crud']['localDb']['set&update'].push(NewObjectMongo[key])
                    break
                  case 'gallery':
                    obj['crud']['localDb']['set&update'].push(NewObjectMongo[key])
                    break
                  default:
                    colorLog('неотслеживаемый тип', NewObjectMongo[key]['type'][id])
                    break
                }
              }
            }
            obj = await func['crud'](obj)
            NewObjectMongo = []
          }
          if (keyVerifyuId === true) {
            if (verifyIdm === true) {
              if (verifyId && verifyTimeStamp) {
                local[keyVerify][name]['edit-delta'] = mongo[keysMongo][name]['edit-delta']
                local[keyVerify][name]['content'] = mongo[keysMongo][name]['content']
                local[keyVerify][name]['file'] = mongo[keysMongo][name]['file']
                local[keyVerify][name]['file-url'] = mongo[keysMongo][name]['file-url']
                local[keyVerify][name]['length'] = mongo[keysMongo][name]['length']
                obj['get'] = null
                obj['get_n'] = null
                obj['update'] = local[keyVerify]
                obj = await func['updateLocalTimeStamp'](obj)
                obj['upload'] = null
              } else {
                let tMongo = mongo[keysMongo][name]['timeStamp']
                let tLocal = local[keyVerify][name]['timeStamp']
                let time = mongo[keysMongo][name]['timeStamp'] - local[keyVerify][name]['timeStamp']
                if (!obj['slot']) {
                  name = obj['parent']
                } else {
                  if (obj['slot'] === 'edit') {
                    name = obj['parent']
                  } else {
                    name = obj['slot']
                  }
                }
                colorLog('~~~~~~~~~~~~~<update-timeStamp>~~~~~~ mongo - local ~~~~~~~', 'MediumSlateBlue', tMongo, ' -', tLocal, '=', time)
                if (time < 0) {
                  if (verifyId) {
                    local[keyVerify][name]['edit-delta'] = mongo[keysMongo][name]['edit-delta']
                    local[keyVerify][name]['content'] = mongo[keysMongo][name]['content']
                    obj['update'] = local[keyVerify]
                    obj = await func['updateLocalTimeStamp'](obj)
                    obj['upload'] = null
                    obj['update'] = {}
                    obj['update']['id'] = local[keyVerify]['id']
                    obj['update']['object'] = name
                    obj['update']['_id'] = local[keyVerify]['_id']
                    obj['update'] = local[keyVerify][name]
                    console.assert(status, obj)
                    obj = await mongodb['updFile'](obj)
                    obj['update'] = null
                    obj['upload'] = null
                  } else {
                    obj['upload'] = null
                    obj['get'] = null
                    obj['get_n'] = null
                    obj['update'] = {}
                    local[keyVerify][name]['edit-delta'] = mongo[keysMongo][name]['edit-delta']
                    local[keyVerify][name]['content'] = mongo[keysMongo][name]['content']
                    obj['update'] = local[keyVerify]
                    obj['update']['id'] = local[keyVerify]['id']
                    obj['update'][name]['id'] = local[keyVerify][name]['id']
                    obj = await func['updateLocalTimeStamp'](obj)
                    obj['upload'] = null
                    obj['update'] = obj['get_n'][0]
                    obj['update']['_id'] = mongo[keysMongo]['_id']
                    obj['update']['object'] = name
                    obj['update'][name]['_id'] = mongo[keysMongo]['_id']
                    obj['get'] = null
                    obj['get_n'] = null
                    obj = await mongodb['updateClientId'](obj)
                    obj['update'] = null
                    obj['upload'] = null
                  }
                } else if (time > 0) {
                  if (verifyId) {
                    colorLog('~~~~~~local~~~~~~~<update-timeStamp>~~~~~~local~~~~~~~', 'MediumSlateBlue')
                    obj['upload'] = null
                    obj['update'] = {}
                    obj['update']['id'] = mongo[keysMongo]['id']
                    obj['update']['object'] = name
                    obj['update']['_id'] = mongo[keysMongo]['_id']
                    obj['update'][name] = mongo[keysMongo][name]
                    obj['get'] = null
                    obj['get_n'] = null
                    obj = await func['updateLocalTimeStamp'](obj)
                    obj['update'] = null
                    obj['upload'] = null
                  } else {
                    obj['upload'] = null
                    obj['get'] = null
                    obj['get_n'] = null
                    obj['update'] = {}
                    obj['update'] = mongo[keysMongo]
                    obj['update']['id'] = local[keyVerify]['id']
                    obj['update'][name]['id'] = local[keyVerify][name]['id']
                    obj = await func['updateLocalTimeStamp'](obj)
                    obj['upload'] = null
                    obj['update'] = obj['get_n'][0]
                    obj['update']['_id'] = mongo[keysMongo]['_id']
                    obj['update'][name]['_id'] = mongo[keysMongo]['_id']
                    obj['get'] = null
                    obj['get_n'] = null
                    obj = await mongodb['updateClientId'](obj)
                    obj['update'] = null
                    obj['upload'] = null
                  }
                } else {
                  for (let i = 0; i < obj['type'].length; i++) {
                    switch (obj['type'][i]) {
                      case 'text':
                        local[keyVerify][name]['edit-delta'] = mongo[keysMongo][name]['edit-delta']
                        local[keyVerify][name]['content'] = mongo[keysMongo][name]['content']
                        obj['get'] = null
                        obj['get_n'] = null
                        obj['upload'] = local[keyVerify]
                        console.assert(status, obj)
                        obj = await func['updateLocal'](obj)
                        obj['upload'] = null
                        break
                      default:
                        colorLog('default')
                        obj['upload'] = null
                        obj['update'] = local[keyVerify]
                        obj['update']['_id'] = mongo[keysMongo]['_id']
                        obj = await mongodb['updateClientId'](obj)
                        break
                    }
                  }
                }
              }
            } else {
              if (verifyId === true) {
                obj['update'] = null
                obj['upload'] = mongo[keysMongo]
                colorLog('~~~~~~local~~~~~~~<update-id>~~~~~~local~~~~~~~', 'MediumSlateBlue')
                console.assert(status, obj)
                obj = await func['updateLocal'](obj)
              } else {
                let name = {}
                if (!obj['slot']) {
                  name = obj['parent']
                } else {
                  if (obj['slot'] === 'edit') {
                    name = obj['parent']
                  } else {
                    name = obj['slot']
                  }
                }
                obj['update'] = null
                obj['upload'] = mongo[keysMongo]
                obj['upload']['id'] = local[keyVerify]['id']
                obj['upload'][name]['id'] = local[keyVerify][name]['id']
                obj['upload']['_id'] = mongo[keysMongo]['_id']
                obj['get_n'] = null
                obj['get'] = null
                console.assert(status, obj)
                obj = await func['updateLocal'](obj)
                obj['update'] = obj['get_n'][0]
                obj['get_n'] = null
                obj['get'] = null
                obj = await mongodb['updateClientId'](obj)
              }
            }
          } else {
          }
        }
        obj['get'] = null
        obj['get_n'] = null
        obj['upload'] = null
        obj['update'] = null
        obj = await IndexedDB['getObject'](obj)
        obj['upload'] = null
        obj['update'] = null
        // console.assert(status, obj)
        return obj
      }
    }
  }
}
func['getImages'] = function (obj) {
  return new Promise(function (resolve, reject) {
    // console.log('~~~~~~~~~getImages~~~~~~~~~')
    if (obj['indexeddb'] === null || obj['indexeddb'] === undefined) {
      obj = init['indexeddb'](obj)
    }
    IndexedDB['getFiles'](obj)
      .then((obj) => {
        resolve(obj)
      })
  })
}

function BlobToStringSet (obj) {
  return new Promise(function (resolve, reject) {
    let name = {}
    if (!obj['slot']) {
      name = obj['parent']
    } else {
      if (obj['slot'] === 'edit') {
        name = obj['parent']
      } else {
        name = obj['slot']
      }
    }
    if (!obj['set'] || !obj['set'][name]['file']) {
      resolve(obj)
    } else {
      if (typeof (obj['set'][name]['file']) === 'string') {
        resolve(obj)
      } else {
        if (!obj['set'] || !obj['set'][name]['file']) {
          resolve(obj)
        } else {
          let reader = new FileReader()
          reader.readAsDataURL(obj['set'][name]['file'])
          reader.onload = function (e) {
            obj['set'][name]['file'] = e.target.result
            obj['set'][name]['length'] = e.target.result.length
            obj['set'][name]['url'] = e.target.result
            resolve(obj)
          }
        }
      }
    }
  })
}
func['setImages'] = function (obj) {
  return new Promise(function (resolve, reject) {
    let c = 0
    if (obj['indexeddb'] === null || obj['indexeddb'] === undefined) {
      obj = init['indexeddb'](obj)
    }
    if (c === 0) {
      BlobToString(obj)
        .then((obj) => {
          colorLog('~~~~~~~~~~~~<set-images-local>~~~~~~~~~', '#95b8da', obj)
          IndexedDB['setFiles'](obj)
            .then((local) => {
              obj['set'] = local['get_n'][0]
              colorLog('~~~~~~~~~~~~<set-images-mongo>~~~~~~~~~', '#95b8da', obj['set'])
              mongodb['setFile'](obj)
                .then((obj) => {
                  obj['get'] = null
                  obj['get_n'] = null
                  obj['upload'] = obj['mongo']
                  colorLog('~~~~~~~~~~~~<update-images-local>~~~~~~~~~', '#95b8da', obj['upload'])
                  IndexedDB['updFile'](obj)
                    .then((obj) => {
                      if (!obj['get_n']) {
                        console.log('нет get объекта, возможно нужно создать для отображения')
                        resolve(obj)
                      } else {
                        obj['update'] = obj['get_n'][0][`${obj['get_n'][0]['object']}`]
                        obj['set'] = null
                        console.log('@@@@@@@@@@@@@@11@@@@@@@@@@@@@@@@@@@@@@', obj['update'])
                        mongodb['updFile'](obj).then((obj) => {
                        })
                        resolve(obj)
                      }
                    })
                })
            })
        })
      c++
    }
  })
}
func['updateLocal'] = function (obj) {
  return new Promise(function (resolve, reject) {
    let c = 0
    if (obj['indexeddb'] === null || obj['indexeddb'] === undefined) {
      obj = init['indexeddb'](obj)
    }
    if (c === 0) {
      // console.assert(status_n[0], obj)
      IndexedDB['updFile'](obj)
        .then((obj) => {
          resolve(obj)
        })

      c++
    }
  })
}
func['updateLocalTimeStamp'] = function (obj) {
  return new Promise(function (resolve, reject) {
    let c = 0
    if (obj['indexeddb'] === null || obj['indexeddb'] === undefined) {
      obj = init['indexeddb'](obj)
    }
    if (c === 0) {
      IndexedDB['updateLocalTimeStamp'](obj).then((obj) => {
        resolve(obj)
      })

      c++
    }
  })
}
func['updateuId'] = function (obj) {
  return new Promise(function (resolve, reject) {
    let c = 0
    if (obj['indexeddb'] === null || obj['indexeddb'] === undefined) {
      obj = init['indexeddb'](obj)
    }
    if (c === 0) {
      resolve(IndexedDB['updateuId'](obj))
      c++
    }
  })
}

func['setImagesLocalWithoutTimeStamp'] = function (obj) {
  return new Promise(function (resolve, reject) {
    let c = 0
    if (obj['indexeddb'] === null || obj['indexeddb'] === undefined) {
      obj = init['indexeddb'](obj)
    }
    if (c === 0) {
      BlobToStringSet(obj)
        .then((obj) => {
          IndexedDB['setImagesWithoutTimeStamp'](obj)
            .then((obj) => {
              obj['update'] = obj['get_n'][0]
              obj['set'] = null
              obj['get'] = null
              obj['get_n'] = null
              // console.assert(false, obj)
              IndexedDB['updateLocalTimeStamp'](obj)
                .then((obj) => {
                  resolve(obj)
                })
            })
        })
      c++
    }
  })
}

func['setImagesLocal'] = function (obj) {
  return new Promise(function (resolve, reject) {
    let c = 0
    if (obj['indexeddb'] === null || obj['indexeddb'] === undefined) {
      obj = init['indexeddb'](obj)
    }
    if (c === 0) {
      IndexedDB['setFiles'](obj)
        .then((obj) => {
          resolve(obj)
        })
      // console.assert(status, obj)
      c++
    }
  })
}

function BlobToString (obj) {
  return new Promise(function (resolve, reject) {
    if (!obj['upload'] || !obj['upload']['file']) {
      resolve(obj)
    } else {
      if (typeof (obj['upload']['file']) === 'string') {
        resolve(obj)
      } else {
        if (!obj['upload'] || !obj['upload']['file']) {
          resolve(obj)
        } else {
          let reader = new FileReader()
          reader.readAsDataURL(obj['upload']['file'])
          reader.onload = function (e) {
            obj['upload']['file'] = e.target.result
            obj['upload']['length'] = e.target.result.length
            obj['upload']['url'] = e.target.result
            resolve(obj)
          }
        }
      }
    }
  })
}
func['updImage'] = function (obj) {
  return new Promise(function (resolve, reject) {
    let c = 0
    if (obj['indexeddb'] === null || obj['indexeddb'] === undefined) {
      obj = init['indexeddb'](obj)
    }
    if (c === 0) {
      colorLog('~~~~~~~~~~~~<update-images-local>~~~~~~~~~', '#95b8da', obj)
      BlobToString(obj)
        .then((obj) => {
          colorLog('~~~~~~localHost~~~~~~~<update-local>~~~~~~localHost~~~~~~~', 'MediumSlateBlue', obj)
          obj['get'] = null
          obj['get_n'] = null
          // console.assert(status, obj)
          IndexedDB['updFile'](obj)
            .then((obj) => {
              colorLog('~~~~~~localHost~~~~~~~<update-local>~~~~~~localHost~~~out~~~~', 'MediumSlateBlue', obj)
              obj['update'] = obj['get_n'][0]
              if (!obj['slot']) {
                name = obj['parent']
              } else {
                if (obj['slot'] === 'edit') {
                  name = obj['parent']
                } else {
                  name = obj['slot']
                }
              }
              if (name === 'varan-rss') { name = 'varan-slider-news' }
              // console.assert(false, obj)
              colorLog('~~~~~~~~~~<update-mongo>~~~~~~~~~~', 'MediumSlateBlue', obj)
              mongodb['updFile'](obj)
              resolve(obj)
            })
        })
      c++
    }
  })
}
func['updateFeed'] = function (obj) {
  return new Promise(function (resolve, reject) {
    let c = 0
    if (obj['indexeddb'] === null || obj['indexeddb'] === undefined) {
      obj = init['indexeddb'](obj)
    }
    if (c === 0) {
      IndexedDB['updateFeed'](obj).then((obj) => {
        resolve(obj)
      })

      c++
    }
  })
}

func['updImageMongo'] = function (obj) {
  return new Promise(function (resolve, reject) {
    let c = 0
    if (obj['indexeddb'] === null || obj['indexeddb'] === undefined) {
      obj = init['indexeddb'](obj)
    }

    if (c === 0) {
      console.assert(status, obj)
      IndexedDB['updFile'](obj)
        .then((obj) => {
          resolve(obj)
        })
      c++
    }
  })
}
func['getImage'] = function (obj) {
  return new Promise(function (resolve, reject) {
    let c = 0
    if (obj['indexeddb'] === null || obj['indexeddb'] === undefined) {
      obj = init['indexeddb'](obj)
    }

    if (c === 0) {
      IndexedDB['getObject'](obj)
        .then((obj) => { resolve(obj) })
      c++
    }
  })
}
func['delImages'] = function (obj) {
  return new Promise(function (resolve, reject) {
    // console.log('~~~~~~~~~delImages~~~~~~~~~')
    if (obj['indexeddb'] === null || obj['indexeddb'] === undefined) {
      obj = init['indexeddb'](obj)
    }
    colorLog('~~~~~~~~~~<delete-local>~~~~~~~~~~', 'MediumSlateBlue', obj)
    IndexedDB['delFiles'](obj)
      .then((obj) => {
        mongodb['delFile'](obj)
          .then((mongo) => { })
        resolve(obj)
      })
  })
}

func['updateStatusItem'] = function (obj) {
  return new Promise(function (resolve, reject) {
    let c = 0
    if (obj['indexeddb'] === null || obj['indexeddb'] === undefined) {
      obj = init['indexeddb'](obj)
    }
    if (c === 0) {
      colorLog('~~~~~~localHost~~~~~~~<update-local>~~~~~~localHost~~~~~~~', 'MediumSlateBlue', obj)
      obj['get'] = null
      obj['get_n'] = null
      IndexedDB['updateStatus'](obj)
        .then((obj) => {
          colorLog('~~~~~~localHost~~~~~~~<update-local>~~~~~~localHost~~~out~~~~', 'MediumSlateBlue', obj)
          obj['update'] = obj['get_n'][0]
          if (!obj['slot']) {
            name = obj['parent']
          } else {
            if (obj['slot'] === 'edit') {
              name = obj['parent']
            } else {
              name = obj['slot']
            }
          }
          if (name === 'varan-rss') { name = 'varan-slider-news' }
          // console.assert(false, obj)
          colorLog('~~~~~~~~~~<update-mongo>~~~~~~~~~~', 'MediumSlateBlue', obj)
          mongodb['updFile'](obj)
          resolve(obj)
        })
      c++
    }
  })
}
request['functions'] = func
export default{
  request
}
