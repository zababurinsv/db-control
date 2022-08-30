import action from '/static/html/components/component_modules/action/action.mjs'
import api from '/static/html/components/component_modules/api/api-game.mjs'
import cookie from '/static/html/components/component_modules/cookie/js.cookie.min.mjs'
import templateItem from '/static/html/components/telegram-table/template/template.mjs'
import form from '/static/html/components/telegram-table/template/template-form.mjs'
import indexedDB from '/static/html/components/component_modules/tableIndexedDB/indexedDB.mjs'
// import update from '/static/html/components/component_modules/tableUpdate/update.mjs'
// import addEventListener from '/static/html/components/component_modules/tableAddEventListener/addEventListener.mjs'
import tablePagination from '/static/html/components/component_modules/tablePagination/tablePagination.mjs'
customElements.define('telegram-table',
    class extends HTMLElement {
      static get observedAttributes () {
        return ['feed']
      }
      constructor () {
        super()
        let white = []
        let property = []

        let typeSupported = []
        let words = []

        property.push('component-id')
        property.push('script')
        property.push('component-action')
        typeSupported.push('h1')
        typeSupported.push('innerText')
        words.push('shadowRoot')
        words.push('head')
        words.push('shadow')
        words.push('light')
        words.push('lightDom')
        words.push('editor')
        words.push('слайдер')
        words.push('swap')
        white['this'] = this
        white['type-supported'] = typeSupported

        function style (obj) {
          return new Promise(function (resolve, reject) {
            let styleS = document.createElement('style')
            let styleL = document.createElement('style')
            let name = {}
            if (!obj['slot']) {
              name = obj['parent']
            } else {
              name = obj['slot']
            }
            if (!name) {
              console.assert(false, 'не установленны ни слот ни парент')
            }
            for (let key = 0; key < obj['type'].length; key++) {
              if (obj['type'][key] === 'swap') {
                if (obj['type'][key] === 'scoped') {
                  styleS.setAttribute('scoped', '')
                }
              } else {
                if (obj['type'][key] === 'scoped') {
                  styleL.setAttribute('scoped', '')
                }
              }
            }
            for (let state = 0; state < obj['state'].length; state++) {
              obj[`path-style-${obj['state'][state]}`] = `@import '/static/html/components/${obj['component']}/${obj['state'][state]}/${obj['component']}.css'; @import '/static/html/components/${obj['component']}/${obj['state'][state]}/${obj['component']}-custom.css';`
              switch (obj['state'][state]) {
                case 'shadow':
                  if (obj['verify']['preset'] === true) {
                    obj[`path-style-${obj['state'][state]}-preset`] = `@import '/static/html/components/${obj['component']}/template/${name}.css';`
                  }
                  styleS.innerText = obj[`path-style-${obj['state'][state]}`] + obj[`path-style-${obj['state'][state]}-preset`]
                  break
                case 'light':
                  if (obj['verify']['preset'] === true) {
                    obj[`path-style-${obj['state'][state]}-preset`] = `@import '/static/html/components/${obj['component']}/template/${name}.css';`
                  }
                  styleL.innerText = obj[`path-style-${obj['state'][state]}`] + obj[`path-style-${obj['state'][state]}-preset`]
                  break
                default:
                  // //console.log(`новый тип`, obj['state'][state])
                  break
              }
              if (obj['state'][state] === 'swap') {
                if (obj['shadowRoot'] === true) {
                  obj['this']['shadowRoot'].appendChild(styleL)
                  obj['this'].appendChild(styleS)
                  resolve(obj)
                } else {
                  obj['this'].appendChild(styleS)
                }
              } else {
                if (obj['shadowRoot'] === true) {
                  obj['this']['shadowRoot'].appendChild(styleS)
                  obj['this'].appendChild(styleL)
                  resolve(obj)
                } else {
                  obj['this'].appendChild(styleL)
                }
              }
            }
            resolve(obj)
          })
        }
        function objectProperty (obj) {
          return new Promise(function (resolve, reject) {
            let black = []
            black['staticProperty'] = []
            black['staticProperty']['c'] = 0
            black['state'] = []
            black['state'].push('shadow')
            black['state'].push('light')
            black['words'] = words
            black[`type-swap`] = false
            black[`type-external`] = false
            black[`document-offsetWidth`] = document['body'].offsetWidth
            let verifyLight = false
            black[`getAttribute`] = (obj, type, property) => {
              if (property === 'template') {
                if (!obj.getAttribute('type')) {
                  // //console.log('не установлен тип ставим default')
                  obj.setAttribute('type', 'default')
                  return false
                } else {
                  for (let key = 0; key < obj.getAttribute('type').split('-').length; key++) {
                    if (obj.getAttribute('type').split('-')[key] === type) {
                      verifyLight = true
                    }
                  }
                }
                return verifyLight
              } else {
                // //console.log(obj['this'].getAttribute('type'))
                obj[`verify-${type}`] = false
                if (obj['this'].getAttribute('type').split('-').length === 0) {
                  return false
                } else {
                  for (let key = 0; key < obj['this'].getAttribute('type').split('-').length; key++) {
                    if (obj['this'].getAttribute('type').split('-')[key] === type) {
                      obj[`verify-${type}`] = true
                    } else {
                      obj[`verify-${type}`] = false
                    }
                  }
                }
                console.assert(false, obj)
                return obj[`verify-${type}`]
              }
            }
            if (!obj.tagName.toLowerCase()) {
              // //console.log('что то пошло не так middleware js objectProperty', '')
            } else {
              black[`component`] = obj.tagName.toLowerCase()
            }
            if (typeof (obj) !== 'object') {
              // //console.log('objectProperty middleware.js пришёл не объект')
            } else {
              if (!obj.getAttribute('type')) {
                black[`type`] = ['default']
                // //console.log('нет типа ставим default')
                obj.setAttribute('type', 'default')
              } else {
                black[`type`] = obj.getAttribute('type').split('-')
                for (let type = 0; type < black[`type`].length; type++) {
                  black[`type`][type] = black[`type`][type].replace(/:/g, '-')
                }
                for (let key in black[`type`]) {
                  switch (black[`type`][key]) {
                    case 'swap':
                      black[`type-swap`] = true
                      break
                    case 'external':
                      black[`type-external`] = true
                      break
                    default:
                      // //console.log(`дополнительные типы`, black[`type`][key])
                      break
                  }
                }
              }
              if (!obj.slot) {
                // //console.log('отсутствует слот, ставится- по тегу ', obj.tagName.toLowerCase())
                obj.slot = obj.tagName.toLowerCase()
                black[`slot`] = obj.slot
              } else {
                black[`slot`] = obj.slot
              }
              if (!obj.getAttribute('type')) {
                // //console.log(' почему то нет атрибутов')
              } else {
                let veryfiStyle = false
                for (let key in obj.getAttribute('type').split('-')) {
                  if (obj.getAttribute('type').split('-')[key].indexOf('style:') !== -1) {
                    // //console.log('устанавливаются пути к стилям')
                    veryfiStyle = true
                  }
                }
                if (veryfiStyle === true) {
                  black['style-custom'] = 'not-default'
                } else {
                  // //console.log('устанавливается стиль по default')
                  black['style-custom'] = 'default'
                }
              }
            }
            black['shadowRoot'] = false
            black['this'] = obj

            // //console.log(black['this'])
            resolve(black)
          })
        }

        function externalProperty (obj) {
          return new Promise(function (resolve, reject) {
            obj['external-property'] = white['external-property']
            let object = []
            let component = []
            let a = []
            for (let key = 0; key < obj['external'].length; key++) {
              for (let type = 0; type < obj['external'][key].children.length; type++) {
                switch (obj['external'][key].children[type].tagName) {
                  case 'SCRIPT':
                    if (!obj['external'][key].getAttribute('id')) {
                      // //console.log('у компонента нет id нужно в external property script  получить id для загрузки скрипта')
                    } else {
                      component['script'] = obj['external'][key]['children'][type]
                    }
                    break
                  case 'COMPONENT-ID':
                    component['id'] = obj['external'][key]['children'][type].innerText
                    break
                  case 'COMPONENT-ACTION':
                    for (let action = 0; action < obj['external'][key]['children'][type]['children'].length; action++) {
                      a.push(obj['external'][key]['children'][type]['children'][action].innerText)
                    }
                    component['actions'] = a
                    break
                  default:
                    // //console.log(`Не отслеживается, по мере надобности добавляются [${obj['external'][key].children[type].tagName.toLowerCase()}]`)
                    break
                }
              }
              object.push(component)
              component = []
            }
            obj['external-property'] = object
            resolve(obj)
          })
              .catch(error => {
                // //console.log('здесь я перехватывал отсутствие страницы но это убрал', error)
              })
        }

        function getTemplate (obj, swap, external) {
          return new Promise(function (resolve, reject) {
            obj['template-shadow'] = []
            obj['template-light'] = []
            let verify = []
            verify['swap'] = false
            verify['blog'] = false
            verify['external'] = false
            verify['light'] = false
            verify['slider'] = false
            verify['one'] = false
            verify['sliderText'] = false
            verify['text'] = false
            for (let type = 0; type < obj['type'].length; type++) {
              if (obj['type'][type].indexOf('slider') !== -1) {
                if (obj['type'][type].split('-').length > 1) {
                  verify['slider'] = true
                  for (let key in obj['type'][type].split('-')) {
                    switch (obj['type'][type].split('-')[key]) {
                      case 'one':
                        verify['one'] = true
                        break
                      default:
                        // //console.log(`~~~дополнительное свойство~~~`, obj['type'][type].split('-')[key])
                        break
                    }
                  }
                }
              }
              if (obj['type'][type].length) {
                if (obj['type'][type].split('-').length > 1) {
                  switch (obj['type'][type].split('-')[0]) {
                    case 'blog':
                      verify['blog'] = true
                      break
                    default:
                      console.log(`типы не отслеживаются`, obj['type'][type])
                      break
                  }
                } else {
                  switch (obj['type'][type]) {
                    case 'swap':
                      verify['swap'] = true
                      break
                    case 'external':
                      verify['external'] = true
                      break
                    case 'light':
                      verify['light'] = true
                      break
                    case 'slider':
                      verify['slider'] = true
                      break
                    case 'sliderText':
                      verify['sliderText'] = true
                      break
                    case 'text':
                      verify['text'] = true
                      break
                    default:
                      // //console.log(`типы не отслеживаются`, obj['type'][type])
                      break
                  }
                }
              }
            }
            /**
             * цикл this
             * цикл template
             */
            if (verify['swap'] === true) {
              for (let key = 0; key < obj['this'].children.length; key++) {
                // //console.log('~~~~~~this~~~~~~~', obj['this'].children[key].tagName)
                if (obj['this'].children[key].tagName.split('-').length === 1) {
                  if (obj['this'].children[key].slot === 'view') {
                    obj['this'].children[key].className = 'wall'
                  }
                  obj['template-light'].push(obj['this'].children[key])
                } else {
                  if (obj['getAttribute'](obj['this'].children[key], 'light', 'template') === true) {
                    obj['this'].children[key].setAttribute('type', `${obj['this'].children[key].getAttribute('type')}-external`)
                    scriptTemplate(obj['this'].children[key], obj)
                    obj['template-light'].push(obj['this'].children[key])
                  } else {
                    obj['this'].children[key].setAttribute('type', `${obj['this'].children[key].getAttribute('type')}-external`)
                    scriptTemplate(obj['this'].children[key], obj)
                    obj['template-shadow'].push(obj['this'].children[key])
                  }
                }
              }
              for (let key = 0; key < obj['template'].children.length; key++) {
                // //console.log('~~~~~~template~~~~~~~', obj['template'].children[key].tagName)
                if (obj['template'].children[key].tagName.split('-').length === 1) {
                  if (obj['template'].children[key].slot === 'view') {
                    obj['template'].children[key].className = 'wall'
                  }
                  obj['template-light'].push(obj['template'].children[key])
                } else {
                  if (obj['getAttribute'](obj['template'].children[key], 'light', 'template') === true) {
                    obj['template'].children[key].setAttribute('type', `${obj['template'].children[key].getAttribute('type')}-external`)
                    scriptTemplate(obj['template'].children[key], obj)
                    obj['template-light'].push(obj['template'].children[key])
                  } else {
                    obj['template'].children[key].setAttribute('type', `${obj['template'].children[key].getAttribute('type')}-external`)
                    scriptTemplate(obj['template'].children[key], obj)
                    obj['template-shadow'].push(obj['template'].children[key])
                  }
                }
              }
            } else {
              for (let key = 0; key < obj['this'].children.length; key++) {
                // //console.log('~~~~~~this~~~~~~~', obj['this'].children[key].tagName)
                if (obj['this'].children[key].tagName.split('-').length === 1) {
                  if (obj['this'].children[key].slot === 'view') {
                    obj['this'].children[key].className = 'wall'
                  }
                  obj['template-shadow'].push(obj['this'].children[key])
                } else {
                  if (obj['getAttribute'](obj['this'].children[key], 'light', 'template') === true) {
                    scriptTemplate(obj['this'].children[key], obj)
                    obj['template-shadow'].push(obj['this'].children[key])
                  } else {
                    scriptTemplate(obj['this'].children[key], obj)
                    obj['template-light'].push(obj['this'].children[key])
                  }
                }
              }
              for (let key = 0; key < obj['template'].children.length; key++) {
                // //console.log('~~~~~~template~~~~~~~', obj['template'].children[key].tagName)
                if (obj['template'].children[key].tagName.split('-').length === 1) {
                  if (obj['template'].children[key].slot === 'view') {
                    obj['template'].children[key].className = 'wall'
                  }
                  obj['template-shadow'].push(obj['template'].children[key])
                } else {
                  if (obj['getAttribute'](obj['template'].children[key], 'light', 'template') === true) {
                    scriptTemplate(obj['template'].children[key], obj)
                    obj['template-shadow'].push(obj['template'].children[key])
                  } else {
                    scriptTemplate(obj['template'].children[key], obj)
                    obj['template-light'].push(obj['template'].children[key])
                  }
                }
              }
            }
            for (let key in verify) {
              obj['verify'][key] = verify[key]
            }
            if (obj['verify']['slider'] === true) {
              getSliderTemplate(obj)
                  .then((obj) => {
                    obj['template-light'].push(obj['slider'])
                    obj['this']['appendChild'](obj['slider'])
                    setExternalComponent(obj, 'slider')
                        .then((obj) => {
                          if (obj['verify']['one'] === true) {
                            for (let state = 0; state < obj['state'].length; state++) {
                              for (let key = 0; key < obj[`template-${obj['state'][state]}`].length; key++) {
                                if (obj[`template-${obj['state'][state]}`][key]['className'] === 'wall') {
                                  obj[`template-${obj['state'][state]}`].splice(key, 1)
                                  resolve(obj)
                                }
                              }
                            }
                          } else {
                            resolve(obj)
                          }
                        })
                  })
            } else {
              resolve(obj)
            }
          })
        }
        function template (obj, type) {
          return new Promise(function (resolve, reject) {
            obj['verify'] = []
            // изменил
            let name = {}
            if (!obj['slot']) {
              name = obj['parent']
            } else {
              name = obj['slot']
            }
            if (!obj['this'].hasAttribute('preset')) {
              obj['path-template'] = `/static/html/components/${obj['component']}/${obj['component']}.html`
              obj['verify']['preset'] = false
            } else {
              if (obj['this'].getAttribute('preset').length === 0) {
                obj['path-template'] = `/static/html/components/${obj['component']}/template/${name}.html`
                obj['preset'] = `default`
                obj['verify']['preset'] = true
              } else {
                obj['path-template'] = `/static/html/components/${obj['component']}/template/${obj['this'].getAttribute('preset')}/${obj['component']}-${obj['this'].getAttribute('preset')}.html`
                obj['preset'] = `${obj['this'].getAttribute('preset')}`
                obj['verify']['preset'] = true
              }
            }
            fetch(obj['path-template'])
                .then(function (response) {
                  if (response.ok) {
                    return response.text()
                  }
                }).then(function (body) {
              let parser = new DOMParser()
              let doc = parser.parseFromString(body, 'text/html')
              obj['template'] = doc.getElementsByTagName('template')[0].content.cloneNode(true)
              external(obj)
                  .then((obj) => {
                    getTemplate(obj, obj['type-swap'], obj['type-external'])
                        .then((obj) => {
                          let menu = {}
                          for (let key = 0; key < obj['template-light'].length; key++) {
                            if (obj['template-light'][key].tagName === 'VARAN-MENU') {
                              menu = obj['template-light'].splice(key, 1)
                              obj['template-light'].push(menu[0])
                            }
                          }
                          if (obj['verify']['swap'] === true) {
                            if (obj['template-shadow'].length !== 0) {
                              obj['this']['attachShadow']({mode: 'open'})
                              obj['shadowRoot'] = true
                              for (let key = 0; key < obj['template-shadow'].length; key++) {
                                obj['this']['shadowRoot']['appendChild'](obj['template-shadow'][key])
                              }
                            }
                            if (obj['template-light'].length !== 0) {
                              for (let key = 0; key < obj['template-light'].length; key++) {
                                // if (obj['template-light'][key].tagName === 'SECTION') {
                                //   for (let i = 0; i < obj['template-light'][key].children.length; i++) {
                                //     if (obj['template-light'][key].children[i].tagName.split('-').length > 1) {
                                //       scriptTemplate(obj['template-light'][key].children[i], obj)
                                //     }
                                //   }
                                // }
                                obj['this']['appendChild'](obj['template-light'][key])
                              }
                            }
                          } else {
                            if (obj['template-shadow'].length !== 0) {
                              obj['this']['attachShadow']({mode: 'open'})
                              obj['shadowRoot'] = true
                              for (let key in obj['template-shadow']) {
                                obj['this']['shadowRoot']['appendChild'](obj['template-shadow'][key])
                              }
                            }
                            if (obj['template-light'].length !== 0) {
                              for (let key in obj['template-light']) {
                                obj['this']['appendChild'](obj['template-light'][key])
                              }
                            }
                          }
                          resolve(obj)
                        })
                  })
            })
                .catch(error => {
                  return error
                })
          })
        }
        function getSliderTemplate (obj) {
          return new Promise(function (resolve, reject) {
            fetch(`/static/html/components/varan-slider/template/${obj['slot']}.html`)
                .then(function (response) {
                  if (response.ok) {
                    return response.text()
                  }
                }).then(function (body) {
              let parser = new DOMParser()
              let doc = parser.parseFromString(body, 'text/html')
              obj['slider'] = doc.getElementsByTagName('template')[0].content.cloneNode(true)
              let slider = document.createElement('section')
              slider.className = 'slider'
              slider.slot = 'view'
              slider.appendChild(obj['slider'])
              obj['slider'] = slider
              obj['slider-template'] = slider
              for (let key = 0; key < obj['type'].length; key++) {
                if (obj['type'][key] === 'slider-one-text') {
                  obj['verify']['sliderText'] = true
                }
              }
              matcher['database']['request']['functions']['getObject'](obj)
                  .then((obj) => {
                    if (!obj['get']) {
                      resolve(obj)
                    } else {
                      pagination['init'](obj)
                      pagination['action'](obj)
                          .then(obj => {
                            resolve(obj)
                          })
                    }
                  })
            })
                .catch(error => {
                  return error
                })
          })
        }
        function renderExternal (obj) {
          return new Promise(function (resolve, reject) {
            obj['words-action'] = []
            let wordsAction = []
            for (let key = 0; key < obj['external-property'].length; key++) {
              for (let words = 0; words < obj['external-property'][key]['actions'].length; words++) {
                for (let verify = 0; verify < obj['words'].length; verify++) {
                  if (obj['external-property'][key]['actions'][words].indexOf(obj['words'][verify]) !== -1) {
                    if (obj['words'][verify] === 'shadowRoot' || obj['words'][words] === 'shadow') {
                      wordsAction['shadow'] = true
                    }
                    if (obj['words'][verify] === 'light' || obj['words'][words] === 'лайт') {
                      wordsAction['light'] = true
                    }
                    if (obj['words'][verify] === 'editor') {
                      wordsAction['editor'] = true
                    }
                    if (obj['words'][verify] === 'слайдер') {
                      wordsAction['editor-slider'] = true
                    }
                    if (obj['words'][verify] === 'swap') {
                      wordsAction['swap'] = true
                    }
                  }
                }
              }
              obj['words-action'] = wordsAction

              for (let key in obj['external-property']) {
                for (let type in obj['external-property'][key]) {
                  switch (type) {
                    case 'id':
                      let doc = document.createElement(obj['external-property'][key][type])
                      doc.setAttribute('type', 'external')
                      obj['this'].appendChild(doc)
                      break
                    default:
                      // //console.log(`какой то неизвестный тип`, type)
                      break
                  }
                }
              }
              resolve(obj)
            }
          })
        }

        function external (obj) {
          return new Promise(function (resolve, reject) {
            obj['path-external'] = `/static/html/components/${obj['component']}/external/${obj['component']}-external.html`
            fetch(obj['path-external'])
                .then(function (response) {
                  if (response.ok === false) {
                    return response.ok
                  } else {
                    return response.text()
                  }
                })
                .then(function (data) {
                  if (data === false) {
                  } else {
                    let parser = new DOMParser()
                    let doc = parser.parseFromString(data, 'text/html')
                    obj['external'] = doc.querySelectorAll('section')
                    externalProperty(obj)
                        .then((obj) => {
                          if (obj['external-property'].length === 0) {
                            resolve(obj)
                          } else {
                            renderExternal(obj)
                                .then((obj) => {
                                  resolve(obj)
                                })
                          }
                        })
                  }
                })
                .catch(error => {
                  throw error
                })
          })
        }
        function getElementsByClassName (obj, type) {
          return new Promise(function (resolve, reject) {
            for (let state = 0; state < obj['state'].length; state++) {
              for (let key = 0; key < obj[`template-${obj['state'][state]}`].length; key++) {
                if (obj[`template-${obj['state'][state]}`][key].getElementsByClassName(type).length === 0) {

                } else {
                  obj['slider'] = obj[`template-${obj['state'][state]}`][key].getElementsByClassName(type)[0]
                  resolve(obj[`template-${obj['state'][state]}`][key].getElementsByClassName(type)[0])
                }
              }
            }
          })
        }
        function setSlider (obj) {
          return new Promise(function (resolve, reject) {
            resolve(Peppermint(obj, {
              dots: false,
              slideshow: false,
              speed: 500,
              slideshowInterval: 5000,
              stopSlideshowAfterInteraction: true,
              onSetup: function (n) {
                // //console.log('Peppermint setup done. Slides found: ' + n)
              }
            }))
          })
        }
        function scriptTemplate (obj, parent) {
          return new Promise(function (resolve, reject) {
            let verify = false
            for (let i = 0; i < document.querySelectorAll('script').length; i++) {
              if (document.querySelectorAll('script')[i].src.indexOf(obj.tagName.toLowerCase()) !== -1) {
                verify = true
              }
            }
            if (verify === true) {
              console.log('модуль загружен')
            } else {
              const script = document.createElement('script')
              script.type = 'module'
              script.src = `/static/html/components/${obj.tagName.toLowerCase()}/${obj.tagName.toLowerCase()}.mjs`
              script.setAttribute('async', '')
              script.onload = resolve
              script.onerror = reject
              parent['this'].appendChild(script)
            }
          })
        }
        function setExternalComponent (obj, type) {
          return new Promise(function (resolve, reject) {
            if (!type) {
              resolve(obj)
            } else {
              switch (type) {
                case 'slider': {
                  getElementsByClassName(obj, 'peppermint')
                      .then((slider) => {
                        setSlider(slider)
                            .then((slider) => {
                              obj['slider'] = slider
                              resolve(obj)
                            })
                      })
                }
                  break
                default:
                  // //console.log(`какой то неизвестный тип`, type)
                  break
              }
              resolve(obj)
            }
          })
        }
        objectProperty(this)
            .then((obj) => {
              template(obj)
                  .then((obj) => {
                    style(obj)
                        .then((obj) => {
                          modules(obj)
                        })
                  })
            })
        async function modules (obj) {
          let  itemsObject = {}
          try {
            itemsObject =    await indexedDB['get']({type:'getAll'})
          }catch (e) {
            console.warn({
              type:'indexedDB',
              error:e
            })
          }
          if(!itemsObject || itemsObject.length === 0) {
            itemsObject = await api.get.tokens('3N8n4Lc8BMsPPyVHJXTivQWs7ER61bB7wQn', 12)
          }
          for(let i =0; i < itemsObject.length;i++){

            // console.assert(false)
            await indexedDB['put']({type:'item', value:itemsObject[i]})
          }

          // }
          // self.querySelector('.speech').addEventListener('click',async ()=>{
          //     await speech['get']({type:'speech', this: self, language: self.querySelector('#select_language'), dialect: self.querySelector('#select_dialect'), self: self.querySelector('#webSpeech')})
          // })
          // await  indexedDB['get']({type:'open', self: indexedDB})
          // await  indexedDB['get']({type:'cursor', self: indexedDB})
          // await  indexedDB['put']({type:'data', self: indexedDB})
          // await  indexedDB['get']({type:'cursor', self: indexedDB})
          // await  indexedDB['get']({type:'index', self: indexedDB})


          for(let i =0; i < itemsObject.length;i++){
            let itemObject =  await templateItem(itemsObject[i],i)
            obj['this']['shadowRoot'].querySelector('section.tbody').insertAdjacentHTML('beforeend', itemObject);
          }

          // let del = self.querySelectorAll('.delete')
          // let edit = self.querySelectorAll('.edit')
          // let plan = self.querySelectorAll('.search_input_plan')
          // console.assert(false)
          // for(let i =0; i < del.length;i++){ await addEventListener(del[i], self) }
/*
          for(let i =0; i < edit.length;i++){
            edit[i].addEventListener('click', async (e)=>{

              let verify = true
              let item =  e.target.parentNode
              while(verify){
                if(item.tagName === 'TR'){
                  verify = false
                }else{
                  item =  item.parentNode
                }
              }

              verify = true
              let mainTable = item
              while(verify){
                if(mainTable.tagName === 'MAIN-TABLE'){
                  verify = false
                }else{
                  mainTable =  mainTable.parentNode
                }
              }

              // console.assert(false, mainTable.querySelector('.close'))
              mainTable.querySelector('.close').addEventListener('click', async (e)=>{
                e.target.parentNode.parentNode.querySelector('.btn-primary').style.display = 'flex'
                e.target.parentNode.parentNode.querySelector('#formConteiner').innerHTML = ''
                sessionStorage.clear()
              })


              mainTable.querySelector('.btn-primary').style.display="none"
              item = item.querySelectorAll('td')
              let editObject = {}
              let selectedIndex = 0
              let tempPrice = {}
              for(let i =0; i < item.length -1; i++){
                if(i === 0){
                  editObject['id'] = item[i].innerText
                  sessionStorage.setItem('id',item[i].innerText);
                }else{
                  switch (i) {
                    case 1:
                      switch (item[i].innerText) {
                        case 'Санкт-Петербург':
                          sessionStorage.setItem('city',2);
                          editObject['city'] = 2
                          break
                        case 'Москва':
                          sessionStorage.setItem('city', 1);
                          editObject['city'] = 1
                          break
                        default:
                          sessionStorage.setItem('city', 0);
                          editObject['city'] = 0
                          break
                      }
                      break
                    case 2:
                      sessionStorage.setItem('name',item[i].innerText);
                      editObject['name'] = item[i].innerText
                      break
                    case 3:
                      sessionStorage.setItem('object',item[i].innerText);
                      editObject['object'] = item[i].innerText
                      break
                    case 4:
                      sessionStorage.setItem('dateExperiences',item[i].innerText);
                      editObject['dateExperiences'] = item[i].innerText
                      break
                    case 5:
                      sessionStorage.setItem('class',item[i].innerText);
                      editObject['class'] = item[i].innerText
                      break
                    case 6:
                      sessionStorage.setItem('type',item[i].innerText);
                      editObject['type'] = item[i].innerText
                      break
                    case 7:
                      sessionStorage.setItem('metro',item[i].innerText);
                      editObject['metro'] = item[i].innerText
                      break
                    case 8:
                      sessionStorage.setItem('geo',item[i].innerText);
                      editObject['geo'] = item[i].innerText
                      break
                    case 9:
                      let plan = ''
                      let tempPlan = item[i].querySelectorAll('option')
                      for(let i =0; i < tempPlan.length; i++){
                        if(i === 0){
                          plan = `${tempPlan[i].value}`
                        }else{
                          plan = `${plan},${tempPlan[i].value}`
                        }

                      }
                      selectedIndex = parseInt(item[i].querySelector('select').selectedIndex, 10)
                      sessionStorage.setItem('plans',plan);
                      editObject['plans'] = plan
                      break
                    case 10:
                      let price = ''
                      let tempPrice = item[i].querySelectorAll('option')

                      for(let i =0; i < tempPrice.length; i++){
                        if(i === 0){
                          price = `${tempPrice[i].value}`
                        }else{
                          price = `${price},${tempPrice[i].value}`
                        }

                      }
                      sessionStorage.setItem('price',price);
                      editObject['price'] = price
                      break
                    case 11:
                      sessionStorage.setItem('finish',item[i].innerText);
                      editObject['finish'] = item[i].innerText
                      break
                    case 12:
                      sessionStorage.setItem('description',item[i].innerText);
                      editObject['description'] = item[i].innerText
                      break
                    default:
                      console.assert(false, `новое свойство ${i}`, item[i])
                      break

                  }
                }
              }
              let updateObject = await form(editObject, tempPrice[selectedIndex])
              // console.assert(false, updateObject)
              document.querySelector('#formConteiner').innerHTML = ''
              document.querySelector('#formConteiner').insertAdjacentHTML('beforeend', updateObject)
              document.querySelector('#city').selectedIndex =  sessionStorage.getItem('city');
              // console.assert(false, document.querySelector('#city'))
              document.querySelector('#city').addEventListener("change",  async (event)=>{
                sessionStorage.setItem('city',event.target.selectedIndex);
              })
              let itemObject = document.querySelector('#object-form')
              for(let i = 0; i < itemObject.querySelectorAll('input').length; i++){
                itemObject.querySelectorAll('input')[i].oninput = function(event) {
                  sessionStorage.setItem(`${event.target.name}`,event.target.value)
                };
              }
              for(let i = 0; i < itemObject.querySelectorAll('textarea').length; i++){
                itemObject.querySelectorAll('textarea')[i].addEventListener('input', (event) => {
                  sessionStorage.setItem(`${event.target.name}`,event.target.value);
                });
              }
              document.querySelector('.btn-success').addEventListener('click', async (e)=>{
                // e.target.parentNode.querySelector('#file-upload').files[0])
                let verify = true
                let item =  e.target.parentNode
                while(verify){
                  if(item.tagName === 'MAIN-TABLE'){
                    verify = false
                  }else{
                    item =  item.parentNode
                  }
                }
                item.querySelector('.btn-primary').style.display = 'flex'
                // console.assert(false,  )
                if(e.target.parentNode.querySelector('#file-upload').files[0] === 'undefined' ||e.target.parentNode.querySelector('#file-upload').files[0] === undefined ){

                  let putItem = JSON.stringify({
                    "city":  sessionStorage.getItem('city'),
                    "name":  sessionStorage.getItem('name'),
                    "object":  sessionStorage.getItem('object'),
                    "dateExperiences":  sessionStorage.getItem('dateExperiences'),
                    "class": sessionStorage.getItem('class'),
                    "type": sessionStorage.getItem('type'),
                    "metro": sessionStorage.getItem('metro'),
                    "geo":sessionStorage.getItem('geo'),
                    "plans": sessionStorage.getItem('plans'),
                    "price": sessionStorage.getItem('price'),
                    "finish": sessionStorage.getItem('finish'),
                    "image":sessionStorage.getItem('fileUpload'),
                    "description":sessionStorage.getItem('description'),
                    "timestampUpdate":(Date.now()).toString()
                  });

                  let xhr = new XMLHttpRequest();
                  xhr.withCredentials = true;
                  xhr.addEventListener("readystatechange", async function () {
                    if (this.readyState === 4) {
                      self.querySelector('tbody').innerHTML = ''
                      self.querySelector('#formConteiner').innerHTML = ''
                      sessionStorage.clear()
                      await update(self)

                    }
                  });
                  xhr.open("PUT", `http://dev.work/api/item/${sessionStorage.getItem('id')}`);
                  xhr.setRequestHeader("Content-Type", "application/json");
                  xhr.setRequestHeader("cache-control", "no-cache");
                  xhr.send(putItem);

                }else{
                  let putItem = JSON.stringify({
                    "city":  sessionStorage.getItem('city'),
                    "name":  sessionStorage.getItem('name'),
                    "object":  sessionStorage.getItem('object'),
                    "dateExperiences":  sessionStorage.getItem('dateExperiences'),
                    "class": sessionStorage.getItem('class'),
                    "type": sessionStorage.getItem('type'),
                    "metro": sessionStorage.getItem('metro'),
                    "geo":sessionStorage.getItem('geo'),
                    "plans": sessionStorage.getItem('plans'),
                    "price": sessionStorage.getItem('price'),
                    "finish": sessionStorage.getItem('finish'),
                    "description":sessionStorage.getItem('description'),
                    "image":await toBase64(e.target.parentNode.querySelector('#file-upload').files[0]),
                    "timestampUpdate":(Date.now()).toString()
                  });


                  let xhr = new XMLHttpRequest();
                  xhr.withCredentials = true;
                  xhr.addEventListener("readystatechange", async function () {
                    if (this.readyState === 4) {
                      self.querySelector('tbody').innerHTML = ''
                      self.querySelector('#formConteiner').innerHTML = ''
                      sessionStorage.clear()
                      await update(self)

                    }
                  });
                  xhr.open("PUT", `http://dev.work/api/item/${sessionStorage.getItem('id')}`);
                  xhr.setRequestHeader("Content-Type", "application/json");
                  xhr.setRequestHeader("cache-control", "no-cache");
                  xhr.send(putItem);
                }


              })
            })
          }
          */
/*
          for(let i =0; i < plan.length; i++){
            plan[i].addEventListener('click', async (e)=>{
              let verify = true
              let item =  e.target.parentNode
              while(verify){
                if(item.tagName === 'TR'){
                  verify = false
                }else{
                  item =  item.parentNode
                }
              }
              switch (e.target.name) {
                case 'plan':
                  let price = item.querySelector('.price')
                  price = price.querySelector('select')
                  price.selectedIndex = e.target.selectedIndex
                  break
                case 'price':
                  let plan = item.querySelector('.plan')
                  plan = plan.querySelector('select')
                  plan.selectedIndex = e.target.selectedIndex
                  break
                default:
                  break
              }
            })
          }
          */
/*
          self.querySelector('.close').addEventListener('click', async (e)=>{
            e.target.parentNode.parentNode.querySelector('.btn-primary').style.display = 'flex'
            e.target.parentNode.parentNode.querySelector('#formConteiner').innerHTML = ''
            sessionStorage.clear()
          })
          */
/*
          self.querySelector('.btn-primary').addEventListener('click', async (e)=>{
            let verify = true
            let button =  e.target.parentNode
            while(verify){
              if(button.tagName === 'MAIN-TABLE'){
                verify = false
              }else{
                button =  button.parentNode
              }
            }
            button.querySelector('.btn-primary').style.display = 'none'

            let object = e.target.parentNode.parentNode
            verify = true
            let item =  e.target.parentNode

            let itemObject = await form()
            object.querySelector('#formConteiner').innerHTML = ''
            object.querySelector('#formConteiner').insertAdjacentHTML('beforeend', itemObject)

            sessionStorage.setItem('city',0);
            self.querySelector('#city').addEventListener("change",  async (event)=>{
              sessionStorage.setItem('city',event.target.selectedIndex);
            })
            itemObject = object.querySelector('#object-form')
            for(let i = 0; i < itemObject.querySelectorAll('input').length; i++){
              itemObject.querySelectorAll('input')[i].addEventListener('input', (event) => {
                sessionStorage.setItem(`${event.target.name}`,event.target.value);
              });
            }
            for(let i = 0; i < itemObject.querySelectorAll('textarea').length; i++){
              itemObject.querySelectorAll('textarea')[i].addEventListener('input', (event) => {
                sessionStorage.setItem(`${event.target.name}`,event.target.value);
              });
            }
            object.querySelector('.btn-success').addEventListener('click', async (e)=>{

              // console.assert(false, e.target.parentNode.querySelector('#file-upload').files[0]['name'])
              let data = new FormData();
              let outItem = {}
              for(let i=0; i < object.querySelectorAll('input').length; i++){
                data.append(`${object.querySelectorAll('input')[i].name}`, sessionStorage.getItem(`${object.querySelectorAll('input')[i].name}`));
                sessionStorage.removeItem(`${object.querySelectorAll('input')[i].name}`)
              }

              for(let i=0; i < object.querySelectorAll('textarea').length; i++){
                data.append(`${object.querySelectorAll('textarea')[i].name}`, sessionStorage.getItem(`${object.querySelectorAll('textarea')[i].name}`));
                sessionStorage.removeItem(`${object.querySelectorAll('textarea')[i].name}`)
              }

              data.append('city', sessionStorage.getItem('city'))
              data.append('timestampUpdate', [])


              if (object.querySelector('#file-upload').files[0] === undefined){
                data.append('image', [])
              }else{
                let file = await  toBase64(object.querySelector('#file-upload').files[0])
                if( object.querySelector('#file-upload').files[0]){
                  data.append('image', file)
                }
              }




              // console.assert(false,e.target.parentNode.querySelector('#file-upload').files[0]['name'].split('.')[0] )

              let timestamp = Date.now()
              data.append('timestamp', timestamp)
              fetch(`http://dev.work/api/item/`,{
                method: 'POST',
                body:data
              })
                  .then(function(response) {
                    return response.text();
                  })
                  .then(async function(myJson) {
                    console.log(myJson);
                    self.querySelector('tbody').innerHTML = ''
                    self.querySelector('#formConteiner').innerHTML = ''
                    sessionStorage.clear()
                    await update(self)
                  });
            })
          })
          */
          tablePagination(obj['this']['shadowRoot'], {pagination: tablePagination});
        }
      }
      connectedCallback() {
        console.log('connected callback');
      }
      disconnectedCallback() {
        console.log('disconnected callback');
      }
      componentWillMount() {
        console.log('component will mount');
      }
      componentDidMount() {
        console.log('component did mount');
      }
      componentWillUnmount() {
        console.log('component will unmount');
      }
      componentDidUnmount() {
        console.log('component did unmount');
      }
    })
