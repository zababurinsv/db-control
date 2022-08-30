function colorLog (message, color, ...args) {
  color = color || 'black'
  switch (color) {
    case 'success':
      color = 'firebrick'
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
    case 'events-out':
      color = 'blue'
      break
    case 'violet':
      color = 'violet'
      break
    default:
  }
  console.log('%c' + message, 'color:' + color, ...args)
}
Number.isNaN = Number.isNaN || function (value) {
  return typeof value === 'number' && isNaN(value)
}

function getDateTime () {
  var date = new Date()

  var options = {
    era: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    timezone: 'UTC',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  }

  // alert() // среда, 31 декабря 2014 г. н.э. 12:30:00
  // alert(date.toLocaleString('en-US', options)) // Wednesday, December 31, 2014 Anno Domini 12:30:00 PM
  return date.toLocaleString('ru', options)
}
var uniqueId = function () {
  return 'id-' + Math.random().toString(36).substr(2, 16)
}
function logerr (err) {
  // console.log(err)
}
function displayActionFailure (msg) {
  msg = typeof msg !== 'undefined' ? 'Failure: ' + msg : 'Failure'
}

function connectDB (obj, db) {
  return new Promise(function (resolve, reject) {
    // console.log('~~~~~~~~~connectDB~~~~~~~~~~~~~~')
    // console.log('openDb ...', obj)
    let request = indexedDB.open(obj['indexeddb']['DB_NAME'], obj['indexeddb']['DB_VERSION'])
    request.onerror = logerr
    request.onsuccess = function () {
      // console.log('openDb DONE')
      db(obj, request.result)
    }
    request.onupgradeneeded = function (event) {
      // console.log('~~~~~~~~~onupgradeneeded~~~~~~~~~~~~~~')
      let thisDB = event.target.result
      if (!thisDB.objectStoreNames.contains(obj['indexeddb']['DB_NAME'])) {
        obj['indexeddb']['store'] = thisDB.createObjectStore(
          obj['indexeddb']['DB_STORE_NAME'], { keyPath: 'id', autoIncrement: true })
        obj['indexeddb']['store'].createIndex('object', 'object', { unique: false })
        obj['indexeddb']['store'].createIndex('url', 'url', { unique: false })
        obj['indexeddb']['store'].createIndex('data', 'data', { unique: false })
      }
      connectDB(obj, db)
    }
  })
}
function getObjectStore (obj, mode) {
  return new Promise(function (resolve, reject) {
    let tx = obj['indexeddb']['db'].transaction(obj['indexeddb']['DB_STORE_NAME'], mode)
    obj['indexeddb']['store'] = tx.objectStore(obj['indexeddb']['DB_STORE_NAME'])
    resolve(obj)
  })
}

function getAll (obj) {
  return new Promise(function (resolve, reject) {
    // console.log('~~~~~~~~~getAll~~~~~~~~~~~~~~', obj)
    getObjectStore(obj, 'readonly')
      .then((obj) => {
        obj['get'] = []
        obj['indexeddb']['store'].openCursor().onsuccess = function (event) {
          let cursor = event.target.result
          if (cursor) {
            // console.log(cursor['value']['object'])
            // console.log(cursor['value']['id'])
            if (obj['get'][`${cursor['value']['object']}`] === undefined) {
              obj['get'][`${cursor['value']['object']}`] = {}
            }
            obj['get'][`${cursor['value']['object']}`][`${cursor['value']['id']}`] = cursor['value']
            // obj['get'][`${cursor['value']['object']}`][`${cursor['value']['id']}`] = cursor['value']
            // if (cursor['value']['object'] === 'varan-about-company') {
            //     obj['get'].push({ obj: cursor['value'] })
            // }
            cursor.continue()
          } else {
            resolve(obj)
          }
        }
      })
  })
}

function getObjects (obj) {
  return new Promise(function (resolve, reject) {
    getObjectStore(obj, 'readonly')
      .then((obj) => {
        obj['get'] = null
        obj['get_n'] = null
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
        obj['indexeddb']['store'].openCursor().onsuccess = function (event) {
          let cursor = event.target.result
          if (cursor) {
            if (obj.hasOwnProperty('parent')) {
              if (cursor['value']['object'] === name) {
                if (!obj['get']) {
                  obj['get'] = {}
                }
                if (obj['get'][`${cursor['value']['object']}`] === undefined) {
                  obj['get'][`${cursor['value']['object']}`] = {}
                }
                obj['get'][`${cursor['value']['object']}`][`${cursor['value']['id']}`] = cursor['value']
              }
            } else {
              if (cursor['value']['object'] === obj['slot']) {
                if (!obj['get']) {
                  obj['get'] = {}
                }
                if (obj['get'][`${cursor['value']['object']}`] === undefined) {
                  obj['get'][`${cursor['value']['object']}`] = {}
                }
                obj['get']['id'] = cursor['value']['id']
                obj['get']['object'] = cursor['value']['object']
                obj['get'][`${cursor['value']['object']}`][`${cursor['value']['id']}`] = cursor['value']
              }
            }
            cursor.continue()
          } else {
            if (!obj['get']) {
              resolve(obj)
            } else {
              if (!obj['get_n']) { obj['get_n'] = [] }
              for (let keys in obj['get'][name]) {
                let schema = {}
                schema['object'] = name
                schema['id'] = obj['get'][name][keys]['id']
                schema[name] = obj['get'][name][keys]
                obj['get_n'].push(schema)
              }
              colorLog(`~~~~~~~~~~<getObjects-out>~~~~~~~~~~`, 'Chocolate')
              resolve(obj)
            }
          }
        }
      })
  })
}

function clearObjectStore (obj) {
  // console.log('~~~~~~~~~clearObjectStore~~~~~~~~~~~~~~')
  getObjectStore(obj['indexeddb']['DB_STORE_NAME'], 'readwrite')
    .then((obj) => {
      var req = obj['indexeddb']['store'].clear()
      req.onsuccess = function (evt) {
        // console.log('Store cleared')
      }
      req.onerror = function (evt) {
        console.error('clearObjectStore:', evt.target.errorCode)
        displayActionFailure(this.error)
      }
    })
}
function addFile (obj) {
  return new Promise(function (resolve, reject) {
    getObjectStore(obj, 'readwrite')
      .then((obj) => {
        if (!obj['type']) {

        } else {
          if (!obj['slider']) {

          } else {
            if (obj['slider'].getSlidesNumber === undefined) {

            } else {
            }
          }
        }
        let objData = {}
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
        if (!obj['upload']) {
          obj['upload'] = {}
          if (!obj['set']) {
            obj['upload'] = {}
          } else {
            if (!name) { console.assert(false, 'нет слота и нет parent') }
            if (name === 'varan-slider-news') {
              obj['upload']['feed'] = obj['set'][name]['feed']
            } else {
              if (!obj['set'][name]) {
                let key = Object.keys(obj['set'])
                obj['upload'] = obj['set'][key][name]
              } else {
                obj['upload'] = obj['set'][name]
              }
            }
          }
        } else {
          if (Object.keys(obj['upload']).length === 0) {
            if (name === 'varan-slider-news') {
              obj['upload'] = {}
              obj['upload']['feed'] = obj['set'][name]['feed']
            } else {
              if (!obj['set']) {

              } else {
                if (!obj['set'][name]) {
                  let key = Object.keys(obj['set'])
                  obj['upload'] = obj['set'][key][name]
                } else {
                  obj['upload'] = obj['set'][name]
                }
              }
            }
          } else {
            if (!obj['slot']) {
              name = obj['parent']
            } else {
              if (obj['slot'] === 'edit') {
                name = obj['parent']
              } else {
                name = obj['slot']
              }
            }
            if (!obj['upload'][name]) {
            } else {
              obj['upload'] = obj['upload'][name]
            }
          }
        }
        if (!obj['set&update']) {

        } else {
          if (obj['set&update']['id'] === obj['upload']['id']) {

          } else {
            console.warn('перезаписался объект')
            obj['upload'] = obj['set&update'][name]
          }
        }
        if (!obj['upload']) { obj['upload'] = {} }
        if (!obj['upload']['feed']) { obj['upload']['feed'] = null }
        if (!obj['upload']['url']) {
          obj['upload']['url'] = window.location.href
        } else {
          obj['upload']['url'] = window.location.href
        }
        if (!obj['upload']['file']) {
          obj['upload']['file'] = null
        }
        if (!obj['upload']['content']) {
          obj['upload']['content'] = null
        }
        if (!obj['upload']['captcha']) {
          obj['upload']['captcha'] = null
        }
        if (!obj['upload']['count']) {
          obj['upload']['count'] = null
        }
        if (!obj['upload']['online']) {
          obj['upload']['online'] = null
        }
        if (!obj['upload']['status']) {
          obj['upload']['status'] = null
        }
        if (!obj['upload']['user']) {
          obj['upload']['user'] = null
        }
        if (!obj['upload']['view-slider-pos']) {
          if (!obj['slider']) {
            obj['upload']['view-slider-pos'] = 0
          } else {
            if (typeof (obj['slider'].getSlidesNumber) === 'undefined') {
              obj['upload']['view-slider-pos'] = 0
            } else {
              obj['upload']['view-slider-pos'] = obj['slider'].getSlidesNumber() - 1
              if (Number.isNaN(obj['upload']['view-slider-pos']) === true) {
                obj['upload']['view-slider-pos'] = 0
              }
            }
          }
        } else {
        }
        if (!obj['upload']['edit-delta']) {
          obj['upload']['edit-delta'] = null
        }
        if (!obj['upload']['_id']) {
          obj['upload']['_id'] = null
        }
        if (!obj['upload']['length']) {
          obj['upload']['length'] = null
        }
        if (!obj['upload']['uId']) {
          obj['upload']['uId'] = uniqueId()
        }
        if (!obj['upload']['timeStamp']) {
          obj['upload']['timeStamp'] = event.timeStamp
        }
        if (!obj['upload']['data']) {
          obj['upload']['data'] = getDateTime()
        }
        objData['object'] = name
        objData['timeStamp'] = event.timeStamp
        objData['url'] = window.location.href
        objData['data'] = obj['upload']['data']
        objData['file'] = obj['upload']['file']
        if (!obj['upload']['file']) {

        } else {
          objData['file-url'] = obj['upload']['file']
        }
        objData['length'] = obj['upload']['length']
        objData['feed'] = obj['upload']['feed']
        objData['content'] = obj['upload']['content']
        objData['captcha'] = obj['upload']['captcha']
        objData['count'] = obj['upload']['count']
        objData['online'] = obj['upload']['online']
        objData['status'] = obj['upload']['status']
        objData['user'] = obj['upload']['user']
        objData['_id'] = obj['upload']['_id']
        objData['view-slider-pos'] = obj['upload']['view-slider-pos']
        objData['edit-delta'] = obj['upload']['edit-delta']
        objData['uId'] = obj['upload']['uId']

        try {
          // console.assert(false, objData)
          obj['indexeddb']['req'] = obj['indexeddb']['store'].add(objData)
        } catch (e) {
          if (e.name === 'DataCloneError') {
            displayActionFailure("This engine doesn't know how to clone a Blob, " +
                            'use Firefox')
          }
          throw e
        }
        obj['indexeddb']['req'].onsuccess = function (evt) {
          console.log('~~~~~~~~~evt.target.result~~~~~~~~~~~~~', evt.target.result)
          obj['set'] = {}
          obj['get'] = {}
          let schema = {}
          schema[name] = {}
          obj['get_n'] = []
          schema['id'] = evt.target.result
          schema['_id'] = objData['_id']
          schema['object'] = name
          schema[name]['_id'] = obj['upload']['_id']
          schema[name] = objData
          schema[name]['id'] = evt.target.result
          obj['get_n'].push(schema)
          obj['get'][name] = {}
          obj['get'][name][`${evt.target.result}`] = objData
          obj['get']['id'] = evt.target.result
          obj['get']['object'] = objData['object']
          schema[name]['_id'] = obj['upload']['_id']
          obj['upload'] = null
          obj['update'] = null
          obj['set&update'] = null
          resolve(obj)
        }
        obj['indexeddb']['req'].onerror = function () {
          console.error('addPublication error', this.error)
          displayActionFailure(this.error)
        }
      })
  })
}

function delFilesFrom (obj) {
  return new Promise(function (resolve, reject) {
    getObjectStore(obj, 'readwrite')
      .then((obj) => {
        let req = obj['indexeddb']['store'].index('object')
        req.get('1').onsuccess = function (evt) {
          if (typeof evt.target.result === 'undefined') {
            alert('No matching record found')
            // displayActionFailure('No matching record found')
          }
          // let delObj = {}
          // delObj['indexeddb'] = {}
          // obj['indexeddb']['store'] = obj['indexeddb']['store']
          // delObj['store'] =
          //   delFiles(evt.target.result.id, obj['indexeddb']['store'])
        }
        req.onerror = function (evt) {
          console.error('deletePublicationFromBib:', evt.target.errorCode)
        }
      })
  })
}

function getOneFile (obj) {
  return new Promise(function (resolve, reject) {
    getObjectStore(obj, 'readwrite')
      .then((obj) => {
        let req = obj['indexeddb']['store'].get(+obj['updObj']['id'])
        req.onsuccess = function (evt) {
          var record = evt.target.result
          obj['updObj'] = record
          resolve(obj)
          if (typeof record === 'undefined') {
            alert(record)
            displayActionFailure('No matching record found')
          }
        }
        req.onerror = function (evt) {
          console.error('deletePublication:', evt.target.errorCode)
        }
      })
  })
}

function delFiles (obj) {
  return new Promise(function (resolve, reject) {
    getObjectStore(obj, 'readwrite')
      .then((obj) => {
        let req = {}
        if (!obj['delObj']) {
          req = obj['indexeddb']['store'].get(+obj['delete']['id'])
        } else {
          req = obj['indexeddb']['store'].get(+obj['delObj']['id'])
        }

        req.onsuccess = function (evt) {
          var record = evt.target.result
          if (typeof record === 'undefined') {
            alert(record)
            displayActionFailure('No matching record found')
            return
          }
          if (!obj['delObj']) {
            req = obj['indexeddb']['store'].delete(+obj['delete']['id'])
          } else {
            req = obj['indexeddb']['store'].delete(+obj['delObj']['id'])
          }
          req.onsuccess = function (evt) {
            getObjects(obj).then((obj) => {
              resolve(obj)
            })

            // console.log('delete successful')
          }
          req.onerror = function (evt) {
            console.error('deletePublication:', evt.target.errorCode)
          }
        }
        req.onerror = function (evt) {
          console.error('deletePublication:', evt.target.errorCode)
        }
      })
  })
}

function getFile (obj) {
  return new Promise(function (resolve, reject) {
    getObjectStore(obj, 'readonly')
      .then((obj) => {
        obj['get'] = []
        obj['indexeddb']['store'].openCursor().onsuccess = function (event) {
          let cursor = event.target.result

          if (cursor) {
            if (cursor['value']['object'] === 'varan-about-company') {
              obj['get'].push({ obj: cursor['value'] })
            }
            cursor.continue()
          } else {
            resolve(obj)
          }
        }
      })
  })
}

function setFiles (obj) {
  return new Promise(function (resolve, reject) {
    let c = 0
    connectDB(obj, function (obj, db) {
      obj['indexeddb']['db'] = db
      if (c === 1) {} else {
        c++
        addFile(obj)
          .then((obj) => {
            resolve(obj)
          })
      }
    })
  })
}
function getFiles (obj) {
  return new Promise(function (resolve, reject) {
    let c = 0
    connectDB(obj, function (obj, db) {
      obj['indexeddb']['db'] = db
      if (c === 1) {} else {
        c++
        getFile(obj).then((obj) => {
          resolve(obj)
        })
      }
    })
  })
}

function setWithoutTimeStamp (obj, name) {
  return new Promise(function (resolve, reject) {

  })
}

function setImagesWithoutTimeStamp (obj) {
  return new Promise(function (resolve, reject) {
    getObjectStore(obj, 'readwrite')
      .then((obj) => {
        let name = {}
        let objData = {}
        if (!obj['slot']) {
          name = obj['parent']
        } else {
          if (obj['slot'] === 'edit') {
            name = obj['parent']
          } else {
            name = obj['slot']
          }
        }
        if (!obj['set']) { console.assert(false, 'Должен быть [`eet`]', obj) }
        if (!obj['set'][name]) { console.assert(false, 'Должен быть [`name`]', obj) }
        if (!obj['set'][name]['timeStamp']) { console.assert(false, 'Должен быть [`timeStamp`]', obj) }
        if (!obj['set']['object']) { console.assert(false, 'Должен быть [`object`]', obj) }
        if (!obj['set']['id']) { console.assert(false, 'Должен быть [`object`]', obj) }

        if (!obj['set']['feed']) { obj['set'][name]['feed'] = null }
        if (!obj['set'][name]['url']) {
          obj['set'][name]['url'] = window.location.href
        } else {
          obj['set'][name]['url'] = window.location.href
        }
        if (!obj['set'][name]['file']) {
          obj['set'][name]['file'] = null
        }
        if (!obj['set'][name]['content']) {
          obj['set'][name]['content'] = null
        }
        if (!obj['set'][name]['captcha']) {
          obj['set'][name]['captcha'] = null
        }
        if (!obj['set'][name]['count']) {
          obj['set'][name]['count'] = null
        }
        if (!obj['set'][name]['online']) {
          obj['set'][name]['online'] = null
        }
        if (!obj['set'][name]['status']) {
          obj['set'][name]['status'] = null
        }
        if (!obj['set'][name]['user']) {
          obj['set'][name]['user'] = null
        }
        if (!obj['set'][name]['view-slider-pos']) {
          obj['set'][name]['view-slider-pos'] = 0
        }
        if (!obj['set'][name]['edit-delta']) {
          obj['set'][name]['edit-delta'] = null
        }
        if (!obj['set'][name]['_id']) {
          obj['set'][name]['_id'] = null
        }
        if (!obj['set'][name]['length']) {
          obj['set'][name]['length'] = null
        }
        if (!obj['set'][name]['uId']) {
          obj['set'][name]['uId'] = uniqueId()
        }
        if (!obj['set'][name]['data']) {
          obj['set'][name]['data'] = getDateTime()
        }
        objData['object'] = name
        objData['timeStamp'] = obj['set'][name]['timeStamp']
        objData['url'] = obj['set'][name]['url']
        objData['data'] = obj['set'][name]['data']
        objData['file'] = obj['set'][name]['file']
        if (!obj['set'][name]['file']) {

        } else {
          objData['file-url'] = obj['set'][name]['file']
        }
        objData['length'] = obj['set'][name]['length']
        objData['feed'] = obj['set'][name]['feed']
        objData['content'] = obj['set'][name]['content']
        objData['captcha'] = obj['set'][name]['captcha']
        objData['count'] = obj['set'][name]['count']
        objData['online'] = obj['set'][name]['online']
        objData['status'] = obj['set'][name]['status']
        objData['user'] = obj['set'][name]['user']
        objData['_id'] = obj['set'][name]['_id']
        objData['view-slider-pos'] = obj['set'][name]['view-slider-pos']
        objData['edit-delta'] = obj['set'][name]['edit-delta']
        objData['uId'] = obj['set'][name]['uId']

        try {
          obj['indexeddb']['req'] = obj['indexeddb']['store'].add(objData)
          objData = null
        } catch (e) {
          if (e.name === 'DataCloneError') {
            displayActionFailure("This engine doesn't know how to clone a Blob, " +
                            'use Firefox')
          }
          throw e
        }
        obj['indexeddb']['req'].onsuccess = function (evt) {
          console.log('~~~~~~~~~evt.target.result~~~~~~~~~~~~~', evt.target.result)
          obj['get'] = {}
          obj['get'][name] = {}
          let schema = {}
          obj['get_n'] = []
          schema = obj['set']
          schema['id'] = evt.target.result
          schema[name]['id'] = evt.target.result
          obj['get_n'].push(schema)
          obj['get'][name][`${evt.target.result}`] = obj['set'][name]
          obj['get']['id'] = evt.target.result
          obj['get']['object'] = name
          obj['set'] = null
          resolve(obj)
        }
        obj['indexeddb']['req'].onerror = function () {
          console.error('addPublication error', this.error)
          displayActionFailure(this.error)
        }
      })
  })
}
function updateWithoutTimeStamp (obj, name) {
  return new Promise(function (resolve, reject) {
    let req = obj['indexeddb']['store'].openCursor()
    req.onerror = function (event) {
      console.log('case if have an error')
    }
    req.onsuccess = function (event) {
      let cursor = event.target.result
      if (cursor) {
        if (!obj['upload']) {

        } else {
          if (+obj['upload'][name]['id'] === cursor['value']['id']) {
            let object = cursor['value']
            object['feed'] = obj['upload'][name]['feed']
            object['file'] = obj['upload'][name]['file']
            object['url'] = window.location.href
            object['data'] = obj['upload'][name]['data']
            object['content'] = obj['upload'][name]['content']
            object['_id'] = obj['upload'][name]['_id']
            object['timeStamp'] = event.timeStamp
            object['edit-delta'] = obj['upload'][name]['edit-delta']
            object['view-slider-pos'] = +obj['upload'][name]['id']
            obj['upload'][name]['view-slider-pos'] = +obj['upload'][name]['id']
            obj['upload'][name]['url'] = object['url']
            obj['upload'][name]['timeStamp'] = object['timeStamp']
            let res = cursor.update(object)
            res.onsuccess = function (e) {
              resolve(obj)
            }
            res.onerror = function (e) {
              console.log('update failed!!')
            }
          }
        }
        cursor.continue()
      } else {
        console.log('проверка закончена')
      }
    }
  })
}

function updFile (obj) {
  return new Promise(function (resolve, reject) {
    getObjectStore(obj, 'readwrite')
      .then((obj) => {
        if (obj['upload'].length === 0) {
          console.log('~~~~~~~~~~~ пустой объект ~~~~~~~~~~~~')
          resolve(obj)
        } else {
          obj['get'] = []
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
          if (!obj['upload']) { console.assert(false, `должен быть upload`, obj) }
          if (!obj['upload'][name]) { console.assert(false, `должен быть upload`, obj) }
          if (!obj['upload'][name]['timeStamp']) { console.assert(false, `должен быть timeStamp`, obj) }
          if (!obj['upload'][name]['id']) { console.assert(false, 'должен быть obj[\'upload\'][\'id\']', obj) }
          if (!obj['upload'][name]['_id']) { console.assert(false, 'должен быть obj[\'upload\'][\'_id\']', obj) }
          updateWithoutTimeStamp(obj, name)
            .then((obj) => {
              if (!obj['get']) { obj['get'] = {} }
              if (!obj['get_n']) { obj['get_n'] = [] }
              let schema = {}
              schema = obj['upload']
              obj['get_n'].push(schema)
              obj['get'][name] = {}
              obj['get'][name][`${obj['upload']['id']}`] = obj['upload'][name]
              obj['get']['object'] = name
              colorLog(`~~~~~~~~~<update-local-out>~~~~~~~~~`, 'Chocolate', obj)
              obj['upload'] = null
              resolve(obj)
            })
        }
      })
  })
}

function updateWithTimeStamp (obj) {
  return new Promise(function (resolve, reject) {
    let req = obj['indexeddb']['store'].openCursor()
    req.onerror = function (event) {
      console.log('case if have an error')
    }
    req.onsuccess = function (event) {
      let cursor = event.target.result
      if (cursor) {
        if (!obj['update']) {

        } else {
          if (obj['update'][obj['update']['object']]['id'] === cursor['value']['id']) {
            let object = cursor['value']
            obj['update'][`${obj['update']['object']}`]['view-slider-pos'] = +obj['update'][`${obj['update']['object']}`]['id']
            object['feed'] = obj['update'][`${obj['update']['object']}`]['feed']
            object['file'] = obj['update'][`${obj['update']['object']}`]['file']
            object['url'] = window.location.href
            object['data'] = obj['update'][`${obj['update']['object']}`]['data']
            object['content'] = obj['update'][`${obj['update']['object']}`]['content']
            object['_id'] = obj['update'][`${obj['update']['object']}`]['_id']
            object['edit-delta'] = obj['update'][`${obj['update']['object']}`]['edit-delta']
            object['view-slider-pos'] = +obj['update'][`${obj['update']['object']}`]['id']
            object['timeStamp'] = obj['update'][`${obj['update']['object']}`]['timeStamp']
            let res = cursor.update(object)
            res.onsuccess = function (e) {
              resolve(obj)
            }
            res.onerror = function (e) {
              console.log('update failed!!')
            }
          }
        }
        cursor.continue()
      } else {
        console.log('проверка закончена')
      }
    }
  })
}
function updateLocalTimeStamp (obj) {
  return new Promise(function (resolve, reject) {
    getObjectStore(obj, 'readwrite')
      .then((obj) => {
        if (!obj['update']['object']) { console.assert(false, 'должен быть obj[\'update\'][\'object\']', obj['update']) }
        if (!obj['update'][obj['update']['object']]) { console.assert(false, 'должен быть update[name]') }
        if (!obj['update'][obj['update']['object']]['timeStamp']) { console.assert(false, `должен быть timeStamp`, obj['update']) }
        if (!obj['update'][obj['update']['object']]['id']) { console.assert(false, 'должен быть obj[\'upload\'][\'id\']', obj['update']) }
        if (!obj['update'][obj['update']['object']]['_id']) { console.assert(false, 'должен быть obj[\'upload\'][\'_id\']', obj['update']) }
        updateWithTimeStamp(obj)
          .then((obj) => {
            if (!obj['get']) { obj['get'] = {} }
            if (!obj['get_n']) { obj['get_n'] = [] }
            let schema = {}
            schema['object'] = obj['update']['object']
            schema['id'] = +obj['update'][`${obj['update']['object']}`]['id']
            schema[obj['update']['object']] = obj['update'][`${obj['update']['object']}`]
            schema[obj['update']['object']]['url'] = window.location.href
            schema['_id'] = obj['update'][`${obj['update']['object']}`]['_id']
            obj['get_n'].push(schema)
            obj['get'][obj['update']['object']] = {}
            obj['get'][obj['update']['object']][`${obj['update'][obj['update']['object']]['id']}`] = obj['update'][`${obj['update']['object']}`]
            obj['get'][obj['update']['object']][`${obj['update'][obj['update']['object']]['id']}`]['url'] = window.location.href
            colorLog(`~~~~~~~~~<update-local-out>~~~~~~~~~`, 'Chocolate', obj)
            obj['update'] = null
            resolve(obj)
          })
      })
  })
}

function get (obj, name) {
  return new Promise(function (resolve, reject) {
    obj['get'] = {}
    obj['get'][name] = {}
    obj['get'][name][`${obj['upload']['id']}`] = obj['upload']
    let get = {}
    obj['get_n'] = []
    get['id'] = obj['upload']['id']
    get['object'] = obj['upload']['object']
    get['_id'] = obj['upload']['_id']
    get[name] = obj['upload']
    obj['get_n'].push(get)
    resolve(obj)
  })
}

function updateuId (obj) {
  return new Promise(function (resolve, reject) {
    getObjectStore(obj, 'readwrite')
      .then((obj) => {
        if (!obj['type']) {
        } else {
          if (obj['slider'] === undefined) {
          } else {
            if (obj['slider'].getSlidesNumber === undefined) {
            } else {
              for (let keys = 0; keys < obj['type'].length; keys++) {
                console.log('slider-one-text', obj['type'][keys])
                switch (obj['type'][keys]) {
                  case 'slider-one-text':
                    console.log('')
                    obj['upload']['view-slider-pos'] = obj['slider'].getCurrentPos()
                    break
                  case 'external':
                    break
                  case 'light':
                    break
                  case 'slider':
                    break
                  default:
                    console.log(`типы не отслеживаются`, obj['type'][keys])
                    break
                }
              }
            }
          }
        }
        if (!obj['upload']['timeStamp']) { console.assert(false, `должен быть timeStamp`, obj['upload']) }
        if (!obj['upload']['id']) { console.assert(false, 'должен быть obj[\'upload\'][\'id\']') }
        if (!obj['upload']['_id']) { console.assert(false, 'должен быть obj[\'upload\'][\'_id\']') }

        let upload = obj
        let req = obj['indexeddb']['store'].openCursor()
        req.onerror = function (event) {
          console.log('case if have an error')
        }
        req.onsuccess = function (event) {
          let cursor = event.target.result
          if (cursor) {
            if (!upload['upload']) {
              upload['upload'] = upload['update']
            }
            if (+upload['upload']['id'] === cursor['value']['id']) {
              let object = cursor['value']
              object['feed'] = upload['upload']['feed']
              object['file'] = upload['upload']['file']
              object['url'] = window.location.href
              object['uId'] = upload['upload']['uId']
              object['data'] = upload['upload']['data']
              object['content'] = upload['upload']['content']
              object['_id'] = upload['upload']['_id']
              object['timeStamp'] = upload['upload']['timeStamp']
              object['edit-delta'] = upload['upload']['edit-delta']
              object['view-slider-pos'] = +upload['upload']['id']
              let res = cursor.update(object)
              res.onsuccess = function (e) {
                get(upload, upload['upload']['object'])
                  .then((obj) => {
                    resolve(obj)
                  })
              }
              res.onerror = function (e) {
                console.log('update failed!!')
              }
            }
            cursor.continue()
          } else {
            // console.log('fin mise a jour')
          }
        }
      })
  })
}

function updateFeed (obj) {
  return new Promise(function (resolve, reject) {
    colorLog('~~~~~~~~~~~update~~~~feed~~~~~', 'Chocolate')
    getObjectStore(obj, 'readwrite')
      .then((obj) => {
        obj['get'] = []
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
        if (!obj['upload']) {
          if (!obj['update']) {
            console.assert(false, 'должен быть объект для обновления')
          } else {
            if (!name) { console.assert(false, 'нет слота и нет parent') }
            obj['upload'] = obj['update'][name]
          }
        } else {
          if (Object.keys(obj['upload']).length === 0) {
            obj['upload'] = {}
            obj['upload'] = obj['update'][name]
          }
        }
        // console.assert(false, obj)
        let req = obj['indexeddb']['store'].openCursor()
        req.onerror = function (event) {
          console.log('case if have an error')
        }
        req.onsuccess = function (event) {
          let cursor = event.target.result
          if (cursor) {
            if (+obj['upload']['id'] === cursor['value']['id']) {
              let object = cursor['value']
              object['feed'] = obj['upload']['feed']
              object['file'] = obj['upload']['file']
              object['url'] = window.location.href
              object['data'] = obj['upload']['data']
              object['content'] = obj['upload']['content']
              if (!obj['upload']['timeStamp']) {
                object['timeStamp'] = event.timeStamp
              } else {
                object['timeStamp'] = obj['upload']['timeStamp']
              }
              object['edit-delta'] = obj['upload']['edit-delta']
              colorLog('~~~~~~<indexedDB>~update~object~~~~~', 'Chocolate', object)
              var res = cursor.update(object)
              res.onsuccess = function (e) {
                obj['get'][name] = {}
                obj['get'][name][`${object['id']}`] = object
                obj['get']['id'] = object['id']
                obj['get']['object'] = name
                resolve(obj)
              }
              res.onerror = function (e) {
                console.log('update failed!!')
              }
            }
            cursor.continue()
          } else {
            // console.log('fin mise a jour')
          }
        }
      })
  })
}
function getObject (obj) {
  return new Promise(function (resolve, reject) {
    let c = 0
    connectDB(obj, function (obj, db) {
      obj['indexeddb']['db'] = db
      if (c === 1) {} else {
        c++
        getObjects(obj)
          .then((obj) => {
            resolve(obj)
          })
      }
    })
  })
}

function getImageById (obj) {
  return new Promise(function (resolve, reject) {
    getObjectStore(obj, 'readwrite')
      .then((obj) => {
        obj['get'] = null

        let req = obj['indexeddb']['store'].openCursor()
        req.onerror = function (event) {
          // console.log('case if have an error')
        }
        req.onsuccess = function (event) {
          let cursor = event.target.result
          if (cursor) {
            console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~', obj['upload']['id'])
            console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~', cursor['value']['id'])
            if (+obj['upload']['id'] === +cursor['value']['id']) {
              obj['upload'] = cursor['value']
            }
            cursor.continue()
          } else {
            resolve(obj)
            // console.log('fin mise a jour')
          }
        }
      })
  })
}

function updateStatusObject (obj) {
  return new Promise(function (resolve, reject) {
    let req = obj['indexeddb']['store'].openCursor()
    req.onerror = function (event) {
      console.log('case if have an error')
    }
    req.onsuccess = function (event) {
      let cursor = event.target.result
      if (cursor) {
        if (!obj['update']) {

        } else {
          if (+obj['update'][obj['update']['object']]['id'] === cursor['value']['id']) {
            let object = cursor['value']
            let status = obj['update'][`${obj['update']['object']}`]['status']
            obj['update'][`${obj['update']['object']}`] = cursor['value']
            obj['update'][`${obj['update']['object']}`]['status'] = status
            object['feed'] = obj['update'][`${obj['update']['object']}`]['feed']
            object['file'] = obj['update'][`${obj['update']['object']}`]['file']
            object['status'] = status
            object['url'] = window.location.href
            object['data'] = obj['update'][`${obj['update']['object']}`]['data']
            object['content'] = obj['update'][`${obj['update']['object']}`]['content']
            object['_id'] = obj['update'][`${obj['update']['object']}`]['_id']
            object['edit-delta'] = obj['update'][`${obj['update']['object']}`]['edit-delta']
            object['view-slider-pos'] = +obj['update'][`${obj['update']['object']}`]['id']
            object['timeStamp'] = obj['update'][`${obj['update']['object']}`]['timeStamp']
            let res = cursor.update(object)
            res.onsuccess = function (e) {
              resolve(obj)
            }
            res.onerror = function (e) {
              console.log('update failed!!')
            }
          }
        }
        cursor.continue()
      } else {
        console.log('проверка закончена')
      }
    }
  })
}

function updateStatus (obj) {
  return new Promise(function (resolve, reject) {
    getObjectStore(obj, 'readwrite')
      .then((obj) => {
        obj['get'] = []
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
        if (!obj['update']) { console.assert(false, `должен быть upload`, obj) }
        if (!obj['update'][name]) { console.assert(false, `должен быть upload`, obj) }
        // if (!obj['update'][name]['timeStamp']) { console.assert(false, `должен быть timeStamp`, obj) }
        // if (!obj['update'][name]['id']) { console.assert(false, 'должен быть obj[\'upload\'][\'id\']', obj) }
        // if (!obj['update'][name]['_id']) { console.assert(false, 'должен быть obj[\'upload\'][\'_id\']', obj) }
        updateStatusObject(obj, name)
          .then((obj) => {
            if (!obj['get']) { obj['get'] = {} }
            if (!obj['get_n']) { obj['get_n'] = [] }
            let schema = {}
            schema = obj['update']
            obj['get_n'].push(schema)
            obj['get'][name] = {}
            obj['get'][name][`${obj['update']['id']}`] = obj['update'][name]
            obj['get']['object'] = name
            colorLog(`~~~~~~~~~<update-local-out>~~~~~~~~~`, 'Chocolate', obj)
            obj['update'] = null
            resolve(obj)
          })
      })
  })
}

export default {
  delFiles: (obj) => { return delFiles(obj) },
  setFiles: (obj) => { return setFiles(obj) },
  getFiles: (obj) => { return getFiles(obj) },
  getFile: (obj) => { return getOneFile(obj) },
  updFile: (obj) => { return updFile(obj) },
  updateStatus: (obj) => { return updateStatus(obj) },
  getAll: (obj) => { return getAll(obj) },
  getObject: (obj) => { return getObject(obj) },
  getImageById: obj => { return getImageById(obj) },
  setImagesLocal: obj => { return setFiles(obj) },
  updateFeed: obj => { return updateFeed(obj) },
  updateuId: obj => { return updateuId(obj) },
  updateLocalTimeStamp: obj => { return updateLocalTimeStamp(obj) },
  setImagesWithoutTimeStamp: obj => { return setImagesWithoutTimeStamp(obj) }
}
