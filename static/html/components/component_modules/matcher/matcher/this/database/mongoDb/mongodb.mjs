import conf from '/static/html/components/component_modules/matcher/matcher/this/database/config/index.mjs'

let server = 'now-0.6'
// let server = 'local-1.0'
server = server.split('-')

// console.assert(false, conf[server[0]][server[1]])
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


function blobToDataURL (blob, callback) {
  if (typeof (blob) === 'string') {
    callback(blob)
  } else {
    var a = new FileReader()
    a.onload = function (e) { callback(e.target.result) }
    a.readAsDataURL(blob)
  }
}
function setData( data) {
  return new Promise((resolve, reject) => {
    let formData  = new FormData();
    for(let name in data) {
      formData.append(name, data[name]);
    }
    resolve(formData)
  })
}
function request(obj, path,node, method) {
  return new Promise(async (resolve, reject) => {

    switch (method) {
      case 'GET':
        console.log('~~~~~~~~~~GET~~~~~~~~~~~~~~~~~~',`${node}${path}`)
        fetch(`${node}${path}`, {
          method: method,
        }).then(function (response) {
          if (!response.ok) {
            throw new Error('HTTP error, status = ' + response.status)
          } else {

            return response.json()
          }
        })
            .then(function (json) {
              let obj = {}
              obj['get_n'] = []
              obj['mongo'] = json
              obj['get_n'].push(json)
              resolve(obj)
            })
            .catch(function (error) {
              let obj = {}
              obj['get_n'] = []
              obj['mongo'] = []
              console.error('в запросе произошла ошибка',`${node}${path}`,  error)
              reject(obj)
            })
        break
      case 'POST':
        console.log('~~~~~~~~~~POST~~~~~~~~~~~~~~~~~~',`${node}${path}`)
        let post = await setData(obj)
        fetch(`${node}${path}`, {
          method: method,
          body: post
        }).then(function (response) {
          if (!response.ok) {
            throw new Error('HTTP error, status = ' + response.status)
          } else {
            return response.json()
          }
        })
            .then(function (json) {
              obj['get_n'] = []
              obj['mongo'] = json
              obj['get_n'].push(json)
              resolve(obj)
            })
            .catch(function (error) {
              console.assert(false, 'mongoDb', error, `${node}${path}`)
            })
        break
      case 'PUT':
        console.log('~~~~~~~~~~PUT~~~~~~~~~~~~~~~~~~',`${node}${path}`)
          // console.assert(false, obj)
        let update = await setData(obj)
        fetch(`${node}${path}`, {
          method: method,
          body: update
        }).then(function (response) {
          if (!response.ok) {
            throw new Error('HTTP error, status = ' + response.status)
          } else {
            return response.json()
          }
        })
            .then(function (json) {
              obj['get_n'] = []
              obj['mongo'] = json
              obj['get_n'].push(json)
              resolve(obj)
            })
            .catch(function (error) {
              console.assert(false, 'mongoDb', error)
            })
        break
      case 'DELETE':
        let del = await setData(obj)
        fetch(`${node}${path}`, {
          method: method,
          body: del
        }).then(function (response) {
          if (!response.ok) {
            throw new Error('HTTP error, status = ' + response.status)
          } else {
            return response.json()
          }
        })
            .then(function (json) {

              resolve({delete:'ok'})
            })
            .catch(function (error) {
              console.error('ошибка в запросе mongo', error)
              resolve({mongo:'null'})
            })
        break
      default:
        console.warn(`необрабатываемый тип запроса`, obj[props])
        break
    }
  })
}


function webdav(obj, path,node, method) {
  return new Promise((resolve, reject) => {
    bundle['default'](obj,'export', async function (error, config) {
      switch (method) {
        case 'GET':
          console.log('~~~~~~~~~~~~GET~~~~~~~~~~~~~~~~',`${node}${path}`)
          config['axios'].get(`${node}${path}`)
              .then(function (response) {
                // handle success
                console.log(response);
                obj['get_n'] = []
                obj['mongo'] = response['data']
                obj['get_n'].push(response['data'])
                resolve(obj)
              })
              .catch(function (error) {
                // handle error
                console.log(error);
              })
              .finally(function () {
                // always executed
              });

          break
        case 'POST':
          console.log('~~~~~~~~~~~~POST~~~~~~~~~~~~~~~~',`${node}${path}`)
          fetch(`${node}${path}`, {
            method: method,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'mode': 'no-cors'
            },
            body: JSON.stringify(obj)
          }).then(function (response) {
            if (!response.ok) {
              throw new Error('HTTP error, status = ' + response.status)
            } else {
              return response.json()
            }
          })
              .then(function (json) {
                obj['get_n'] = []
                obj['mongo'] = json
                obj['get_n'].push(json)
                resolve(obj)
              })
              .catch(function (error) {
                console.assert(false, 'mongoDb', error, `${node}${path}`)
              })
          break
        case 'PUT':
          console.log('~~~~~~~~~~~~PUT~~~~~~~~~~~~~~~~',`${node}${path}`)
          fetch(`${node}${path}`, {
            method: method,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'mode': 'no-cors'
            },
            body: JSON.stringify(obj['data'])
          }).then(function (response) {
            if (!response.ok) {
              throw new Error('HTTP error, status = ' + response.status)
            } else {
              return response.json()
            }
          })
              .then(function (json) {
                obj['get_n'] = []
                obj['mongo'] = json
                obj['get_n'].push(json)
                resolve(obj)
              })
              .catch(function (error) {
                console.assert(false, 'mongoDb', error)
              })
          break
        case 'DELETE':
          console.log('~~~~~~~~~~~~DELETE~~~~~~~~~~~~~~~~',`${node}${path}`)
          fetch(`${node}${path}`, {
            method: method,
            headers: {
              'Content-Type': 'application/json',
              'mode': 'no-cors'
            },
            bodu: obj['id']
          }).then(function (response) {
            if (!response.ok) {
              throw new Error('HTTP error, status = ' + response.status)
            } else {
              return response.json()
            }
          })
              .then(function (json) {

                resolve({delete:'ok'})
              })
              .catch(function (error) {
                console.error('ошибка в запросе mongo', error)
                resolve({mongo:'null'})
              })
          break
        default:
          console.warn(`необрабатываемый тип запроса`, obj[props])
          break
      }

    })

  })
}
function setFile (obj) {
  return new Promise((resolve, reject) => {
    let object = {}
    let keys = {}
    let mongoObject = {}
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
    if (name === 'varan-rss') { name = 'varan-slider-news' }
    if (!obj['set'][name]['file']) {
      if (!obj['set']) {
        console.assert(false, 'должен быть obj[set], mongoDB matcher')
      } else {
        object = obj['set'][name]
        mongoObject = {
          [`${obj['set']['object']}`]: object,
          id: obj['set']['id'],
          object: obj['set']['object']
        }
      }

      colorLog(`~~~~~~~<mongo-setFile>~~~~~~~`, 'green', mongoObject)
      fetch(`${conf[server[0]][server[1]]}${mongoObject['object']}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'mode': 'no-cors'
        },
        body: JSON.stringify(mongoObject)
      }).then(function (response) {
        if (!response.ok) {
          return response
        } else {
          return response.json()
        }
      }).then(function (json) {
        if (json.status === 404) {
          colorLog(`~~~~~~~~~~~~~<404>~~~~~~~~~~~~~`, 'green', json)
          obj['mongo'] = []
          resolve(obj)
        } else {
          colorLog(`~~~~~~~~~~~~~<mongo-set-out>~~~~~~~~~~~~~`, 'green', json)
          obj['mongo'] = json
          obj['mongo'][name]['_id'] = json['_id']
          resolve(obj)
        }
      }).catch(function (error) {
        console.assert(false, 'mongoDb', error)
      })
    } else {
      blobToDataURL(obj['set'][name]['file'], function (file) {
        obj['set'][name]['file'] = file
        object = obj['set'][name]
        mongoObject = {
          [`${obj['set']['object']}`]: object,
          id: obj['set']['id'],
          object: obj['set']['object']
        }
        const rawResponse = fetch(`${conf[server[0]][server[1]]}${obj['set']['object']}`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'mode': 'no-cors'
          },
          body: JSON.stringify(mongoObject)
        }).then(function (response) {
          if (!response.ok) {
          } else {
            return response.json()
          }
        }).then(function (json) {
          colorLog(`~~~~~~~~~~~~~<mongo-out>~~~~~~~~~~~~~`, 'green', json)
          obj['mongo'] = json
          obj['mongo'][name]['_id'] = json['_id']
          resolve(obj)
        }).catch(function (error) {
          console.assert(false, 'mongoDb', error)
        })
      })
    }
  })
}
function delFile (obj) {
  return new Promise((resolve, reject) => {
    let path = {}

    if (!obj['delete']) {
      path = `${conf[server[0]][server[1]]}${obj['delObj']['component']}/${obj['delObj']['id']}`
    } else {
      path = `${conf[server[0]][server[1]]}${obj['delete']['object']}/${obj['delete']['id']}`
    }
    // console.assert(false, obj, path)

    const rawResponse = fetch(path, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'mode': 'no-cors'
      }
    }).then((del) => {
      resolve(obj)
    })
  })
}
function getFile (obj) {
  return new Promise((resolve, reject) => {
    let req = ''
    if (!obj['slot']) {
      req = obj['parent']
    } else {
      if (obj['slot'] === 'edit') {
        req = obj['parent']
      } else {
        req = obj['slot']
      }
    }
    if (req === undefined) { console.assert(false, 'нет слота и родителя') }
    if (req === 'varan-rss') { req = 'varan-slider-news' }

    // console.log('obj', obj)
    // console.assert(false , `${conf[server[0]][server[1]]}${req}`)

    console.log('dddddd', `${conf[server[0]][server[1]]}${req}`)
    const rawResponse = fetch(`${conf[server[0]][server[1]]}${req}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'mode': 'no-cors'
      }
    }).then(function (response) {
      if (!response.ok) {
        if (response.status === 404) {
          return response
        } else {
          throw new Error('HTTP error, status = ' + response.status)
        }
      } else {
        return response.json()
      }
    })
        .then(function (json) {
          if (json.status === 404) {
            obj['mongo'] = []
            resolve(obj)
          } else {
            colorLog(`~~~~~~~~~~~~<mongo-get-out>~~~~~~~~~~~~`, 'green', json)
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
            obj['mongo'] = json

            for (let key = 0; key < obj['mongo'].length; key++) {
              if (obj['mongo'][key]['object'] === 'varan-slider-news') {

              } else {
                obj['mongo'][key][name]['_id'] = obj['mongo'][key]['_id']
              }
            }
            resolve(obj)
          }
        })
        .catch(function (error) {
          console.assert(false, 'mongoDb', error)
        })
  })
}

function updFile (obj) {
  return new Promise(async (resolve, reject) => {
    let path = {}
    if (!obj['update']) {
      console.log('нет объекта update')
      // console.assert(false, obj)
      resolve(obj)
    } else {
      console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~', obj['update']['object'])
      console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~', conf[server[0]][server[1]])
      console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~', obj['update']['id'])
      path = `${conf[server[0]][server[1]]}${obj['update']['object']}/${obj['update']['id']}`

      let object = {}
      let name = {}
      if (!obj['slot']) {
        name = obj['parent']
      } else {
        name = obj['slot']
      }
      if (name === 'varan-rss') { name = 'varan-slider-news' }
      if (!obj['update']) {
        if (!obj['upload'][name]) {
          object = obj['upload']
        } else {
          object = obj['upload'][name]
        }
      } else {
        if (!obj['update'][name]) {
          object = obj['update']
        } else {
          object = obj['update'][name]
        }
      }

      let mongoObject = {
        [`${obj['update']['object']}`]: object,
        object: obj['update']['object']
      }
      if (object === undefined) {
        console.assert(false, obj)
      }

      fetch(path, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'mode': 'no-cors'
        },
        body: JSON.stringify(mongoObject)
      }).then(function (response) {
        if (!response.ok) {
          throw new Error('HTTP error, status = ' + response.status)
        } else {
          return response.json()
        }
      })
          .then(function (json) {
            colorLog(`~~~~~~~~~~~~~~~~~~<mongo-out-update>~~~~~~~~~~~~~~~~~~`, 'green', json)
            obj['mongo'] = json
            obj['update'] = null
            resolve(obj)
          })
          .catch(function (error) {
            console.assert(false, 'mongoDb', error)
          })
    }
  })
}

function updateClientId (obj) {
  return new Promise(async (resolve, reject) => {
    colorLog(`~~~~~~~~~~<mongo-update>~~~~~~~~~~`, 'green', obj['update'])
    let path = {}
    path = `${conf[server[0]][server[1]]}${obj['update']['object']}/local/${obj['update']['_id']}`
    // console.assert(false, path)
    let object = {}
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
    if (!obj['update']) { console.assert(false, obj) }
    if (!obj['update']['_id']) { console.assert(false, 'должен быть _id mongo', obj) }

    let mongoObject = {
      [`${obj['update']['object']}`]: obj['update'][name],
      object: obj['update']['object'],
      id: obj['update'][name]['id']
    }
    // console.assert(false, mongoObject)
    colorLog(`~~~~~~~~~~<mongo-update>~~~~~~~~~~`, 'green', mongoObject)
    fetch(path, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'mode': 'no-cors'
      },
      body: JSON.stringify(mongoObject)
    }).then(function (response) {
      if (!response.ok) {
        throw new Error('HTTP error, status = ' + response.status)
      } else {
        return response.json()
      }
    })
        .then(function (json) {
          colorLog(`~~~~~~~<mongo-update-out-json>~~~~~~~`, 'green', json)
          obj['get_n'] = []
          obj['mongo'] = json
          obj['get_n'].push(json)
          colorLog(`~~~~~~~<mongo-update-out>~~~~~~~`, 'green', obj['get_n'])
          resolve(obj)
        })
        .catch(function (error) {
          console.assert(false, 'mongoDb', error)
        })
  })
}

export default {

  delFile: (obj) => {
    console.log('------> deleteImages mongo')
    return delFile(obj)
  },
  setFile: (obj) => {
    console.log('------> setImages mongo')
    return setFile(obj)
  },
  getFile: (obj) => {
    console.log('------> getImages mongo')
    return getFile(obj)
  },
  updFile: (obj) => {
    console.log('------> updateImages mongo')
    return updFile(obj)
  },
  updateClientId: (obj) => {
    console.log('------> updateClientId mongo')
    return updateClientId(obj)
  },
  create: (obj, props, data, ...args) => {
    return new Promise( async function (resolve, reject) {
      console.log(`[(mongo)${obj[props]}]`)
      switch (props) {
        case 'channel':
          resolve(await request(obj, '/create-channel', conf['mongo']['web'], 'POST'))
          break
        case 'bidChanel':
          resolve(await request(obj, '/create-channelBid', conf['mongo']['web'], 'POST'))
          break
        case 'item':
          resolve(await request(obj, '/create-item', conf['mongo']['web'], 'POST'))
          break
        case 'itemBid':
          resolve(await request(obj, '/create-itemBid', conf['mongo']['web'], 'POST'))
          break
        case 'auth':

          resolve(await request(obj['data'], '/auth', conf['waves']['web'], 'POST'))
          break
        default:
          console.warn(`необрабатываемый тип запроса`, obj[props])
          break
      }
    })
  },
  get: (obj, props, data, ...args) => {
    return new Promise( async function (resolve, reject) {
      // console.log(`get[(${obj['input']})${obj[props]}]`)
      switch (obj[props]) {
        case 'jsonPhoto':
          resolve(await webdav(obj, '/getList', conf['store']['web'], 'GET'))
          break
        case 'feeds':
          let feeds = await request(obj, '/feeds', conf['mongo']['web'], 'GET')
          resolve(feeds)
          break
        case 'bids':
          let bid = await request(obj, '/bids', conf['mongo']['web'], 'GET')
          resolve(bid)
          break
        case 'itemsBid':
          let itemsBid = await request(obj, '/itemsBid', conf['mongo']['web'], 'GET')
          resolve(itemsBid)
          break
        case 'bidItem':
          let bidItem = await request(obj, `/bidItem/${obj['id']}`, conf['mongo']['web'], 'GET')
          resolve(bidItem)
          break
        case 'items':
          resolve(await request(obj, '/items', conf['mongo']['web'], 'GET'))
          break
        case 'item':
          resolve(await request(obj['data'], `/item`, conf['mongo']['web'], 'POST'))
          break
        case 'img':
          resolve(await webdav(obj, `/img/${obj['data']}`, conf['store']['web'], 'GET'))
          break
        default:
          console.warn(`необрабатываемый тип запроса`, obj[props])
          break
      }
    })
  },
  set: (obj, props, data, ...args) => {
    return new Promise( async function (resolve, reject) {
      console.log(`${obj['input']}[(table)${obj[props]}]`)
      switch (obj[props]) {
        case 'feed':
          resolve(await request(obj['data'], `/update-feed/${obj['id']}`, conf['mongo']['web'], 'PUT'))
          break
        case 'bid':
          resolve(await request(obj['data'], `/update-bid/${obj['id']}`, conf['mongo']['web'], 'PUT'))
          break
        case 'item':
          resolve(await request(obj['data'], `/add-item/${obj['id']}`, conf['mongo']['web'], 'PUT'))
          break
        case 'auth':
          resolve(await request(obj['data'], '/verify', conf['waves']['web'], 'POST'))
          break
        default:
          console.error(`необрабатываемый тип запроса`, obj[props])
          break
      }

    })
  },
  update: (obj, props, data, ...args) => {
    return new Promise( async function (resolve, reject) {
      console.log(`${obj['input']}[(table)${obj[props]}]`)
      switch (obj[props]) {
        case 'item':
          resolve(await request(obj['data'], `/update-item`,conf['mongo']['web'], 'PUT'))
          break
        case 'itemBid':
          resolve(await request(obj['data'], `/update-itemBid`,conf['mongo']['web'], 'PUT'))
          break
        case 'feed':
          console.assert(false,obj )
          resolve(await request(obj, `/update-item/${obj['id']}`,conf['mongo']['web'], 'PUT'))
          break
        default:
          console.error(`необрабатываемый тип запроса`, obj[props])
            break
      }

    })
  },
  delete: (obj, props, data, ...args) => {
    return new Promise( async function (resolve, reject) {
      console.log(`${obj['input']}[(table)${obj[props]}]`)
      switch (obj[props]) {
        case 'item':
          // console.assert(false, obj['id'])
          resolve(await request(obj['id'], `/delete-item`, conf['mongo']['web'], 'DELETE'))
          break
        case 'itemBid':
          resolve(await request(obj['id'], `/delete-itemBid`, conf['mongo']['web'], 'DELETE'))
          break
        default:
          console.error(`необрабатываемый тип запроса`, obj[props])
          break
      }

    })
  },
}
