import google from '/static/html/components/component_modules/google/google.mjs'
import github from '/static/html/components/component_modules/github/github.mjs'
customElements.define('web3-google',
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
          document.addEventListener('connectGitHub',async (event)=>{
            let state = obj['this']['shadowRoot'].querySelector('#authGithub').innerText
            state = state.trim().toLowerCase()
            if(state === 'sing in github'){
              document.dispatchEvent( new CustomEvent('github', {
                detail: {
                  _:'button',
                  key: obj['this']['shadowRoot'].querySelector('input#password').value
                }
              }))
            }else{
              document.dispatchEvent( new CustomEvent('githubAuthEnd', {
                detail: {
                  obj: obj
                }
              }))
            }
          })
          let target = obj['this']['shadowRoot'].querySelector('label[for="file"]');
          // console.assert(false, target)
          const config = {
            attributes: true,
            attributeFilter: ["style"]
          };
          const callback = function(mutationsList, observer) {
            for (let mutation of mutationsList) {
              console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',mutation.type, mutation )
           if (mutation.type === 'attributes') {
              obj['this']['shadowRoot'].querySelector('button.file').click()

             document.dispatchEvent(new CustomEvent('textToGitHub', {
               detail: {
                 content: JSON.stringify({key:'11111111111', value:'22222222222'}),
                 html:''
               }
             }))
              }
            }
          };
          const observer = new MutationObserver(callback);
          observer.observe(target, config);

          document.addEventListener('connectRepo',async ()=>{

            obj['this']['shadowRoot'].querySelector('button#repository').click()

          })
          let githubRepository = {}
          githubRepository['repository'] = async (repo)=>{
            obj.this.shadowRoot.querySelector('div.data').insertAdjacentHTML('afterbegin',`
                ${repo['data']['repository']['descriptionHTML']}
                 <div>isPrivate: ${repo['data']['repository']['isPrivate']}</div>
               `)
            obj.this.shadowRoot.querySelector('[for=file]').style.display = 'flex'
          }
          githubRepository['file'] = async (file)=>{
            obj.this.shadowRoot.querySelector('div.file').insertAdjacentHTML('afterbegin',`
             <p>files</p>
             <ol>
                <li>name:${file['name']}</li>
                <li>download_url:${file['download_url']}</li>
                <li>encoding:${file['encoding']}</li>
             </ol>`)

            obj.this.shadowRoot.querySelector('div.save').insertAdjacentHTML('afterbegin',
                `<p>Content</p><div>${file['content']}</div>`)
            obj.this.shadowRoot.querySelector('#save').style.display = 'flex'


            obj.this.shadowRoot.querySelector('#sendToGitHub').style.display = 'flex'

          }
          obj.this.shadowRoot.querySelector('button.sendToGitHub').addEventListener('click',async (event)=>{


            let dirElement = obj.this.querySelector('directory-list')

            let folder = dirElement.shadowRoot.querySelector('ul.directory-list').id

            await google({_:'sendToGitHub', sendToGitHub: folder})

          })
          document.addEventListener('textToGitHub',async (event)=>{
            obj.this.shadowRoot.querySelector('div.save').innerHTML = ''
            let saveValue = event.detail.content
            let file = await github({_:'getfile', getfile: `${localStorage.getItem('file')}`, repo: `${localStorage.getItem('repository')}`})
            saveValue =  await github({_:'encoder',encoder:`${saveValue}`})
            await github({_:'save',save:`${saveValue}`, repo: `${localStorage.getItem('repository')}`, file:`${localStorage.getItem('file')}`,sha:`${file['sha']}`})
            file = await github({_:'getfile', getfile: `${localStorage.getItem('file')}`, repo: `${localStorage.getItem('repository')}`})
            file['content'] =  await github({_:'decoder',decoder:`${file['content']}`})
            obj.this.shadowRoot.querySelector('div.save').innerHTML = ''
            obj.this.shadowRoot.querySelector('div.save').insertAdjacentHTML('afterbegin',
                 `<p>Content</p><div>${file['content']}</div>`)

            document.dispatchEvent(new CustomEvent('saveGitHubEnd', {
              detail: {
                content:'',
                html:''
              }
            }))
          })

          obj.this.shadowRoot.querySelector('#repository').addEventListener('click',async (event)=>{
            obj.this.shadowRoot.querySelector('div.data').innerHTML = ''
            let repository = event.target.parentNode.querySelector('input#repos').value
            let repo = await github({_:'get', repo: `${repository}`})
            if(repo.errors !== 'undefined' && repo.errors !== undefined){
              if( repo.errors[0].type === 'NOT_FOUND'){
                if(window.confirm('Repository not found. Do you create repository ?')){
                  let create = await github({_:'create', create:`${repository}`})
                  repo = await github({_:'get', repo: `${repository}`})
                  localStorage.setItem('repository', repository);
                  await githubRepository['repository'](repo)
                }
              }
            }else{
              localStorage.setItem('repository', repository);
              await githubRepository['repository'](repo)
            }
          })

          obj.this.shadowRoot.querySelector('button.file').addEventListener('click',async (event)=>{
            obj.this.shadowRoot.querySelector('div.file').innerHTML = ''
            obj.this.shadowRoot.querySelector('div.save').innerHTML = ''
            let fileName = event.target.parentNode.querySelector('input#file').value
            let file = await github({_:'getfile', getfile: `${fileName}`, repo: `${localStorage.getItem('repository')}`})
            if(file.message === 'Not Found'){
                if(window.confirm('File not found. Do you want create file ?')){
                  await github({_:'file', file: `${fileName}`, repo: `${localStorage.getItem('repository')}`})
                  let file = await github({_:'getfile', getfile: `${fileName}`, repo: `${localStorage.getItem('repository')}`})
                  file['content'] = await github({_:'decoder',decoder:`${file['content']}`})
                  await githubRepository['file'](file)
                  localStorage.setItem('file', fileName);
                }
            }else{
              file['content'] = await github({_:'decoder',decoder:`${file['content']}`})
              await githubRepository['file'](file)
              localStorage.setItem('file', fileName);
            }
          })
          document.addEventListener('signOut', async (event)=>{
            if(obj['this']['shadowRoot'].querySelector('div.folder')){
              obj['this']['shadowRoot'].querySelector('div.folder').innerHTML = ''
            }
          })
          obj['this']['shadowRoot'].querySelector('#singOutGitHub').addEventListener('click',async (event)=>{
            localStorage.removeItem('github');
            localStorage.removeItem('login');
            localStorage.removeItem('avatar_url');
            localStorage.removeItem('name');
            localStorage.removeItem('html_url');
            obj.this.shadowRoot.querySelector('#authGithub').style.display = 'flex'
            obj['this']['shadowRoot'].querySelector('#singOutGitHub').style.display = 'none'
            obj.this.shadowRoot.querySelector('img.avatar').src = `#`
            obj.this.shadowRoot.querySelector('div.data').innerHTML = ''
            obj.this.shadowRoot.querySelector('div.info').innerHTML = ''
            obj.this.shadowRoot.querySelector('div#user').style.display = 'none'
            obj.this.shadowRoot.querySelector('[for=repos]').style.display = 'none'
          })

          document.addEventListener('github',async (events)=>{
            let user = await github({_:'init', init: events.detail.key})
             obj.this.shadowRoot.querySelector('img.avatar').src = `${user.avatar_url}`
            if(user.error){
              if(user.status === undefined){
                console.log('~~~~~~~~~~~',user.error)
              }else{
                console.assert(false, user)
              }
            }else{
              obj.this.shadowRoot.querySelector('div#user').style.display = 'flex'
              obj.this.shadowRoot.querySelector('[for=repos]').style.display = 'flex'
              obj.this.shadowRoot.querySelector('#authGithub').style.display = 'none'
              obj.this.shadowRoot.querySelector('#singOutGitHub').style.display = 'flex'

              document.dispatchEvent( new CustomEvent('githubAuthEnd', {
                detail: {
                  obj: obj
                }
              }))
              // let repo = await github({_:'get', repo: 'images33'})
              //
              // if(repo.errors !== 'undefined' && repo.errors !== undefined){
              //   if( repo.errors[0].type === 'NOT_FOUND'){
              //     let create = await github({_:'create', create: 'images33'})
              //     repo = await github({_:'get', repo: 'images33'})
              //   }
              // }
              //
              // obj.this.shadowRoot.querySelector('div.data').insertAdjacentHTML('afterbegin',`
              //  ${repo['data']['repository']['descriptionHTML']}
              // <div>isPrivate: ${repo['data']['repository']['isPrivate']}</div>
              // `)


              // let file = await github({_:'getfile', getfile: 'images33', repo: 'images33'})
              // let file = await github({_:'file', file: 'images33', repo: 'images33'})
              // obj.this.shadowRoot.querySelector('div.data').insertAdjacentHTML('afterbegin',`
              // <p>files</p>
              // <ol>
              //    <li>name:${file['name']}</li>
              //    <li>content:${file['content']}</li>
              //    <li>download_url:${file['download_url']}</li>
              //    <li>encoding:${file['encoding']}</li>
              // </ol>
             //  `)
              // console.log('~~~~~~~~~~~~~~~file',file)
            }
          })
          let githubKey = localStorage.getItem('github');
          if(githubKey){
            obj.this.shadowRoot.querySelector('#authGithub').style.display = 'none'
            obj.this.shadowRoot.querySelector('#singOutGitHub').style.display = 'flex'
            document.dispatchEvent( new CustomEvent('github', {
              detail: {
                _:'button',
                key: githubKey
              }
            }))
          }else{
            obj.this.shadowRoot.querySelector('#authGithub').style.display = 'flex'
            obj.this.shadowRoot.querySelector('#singOutGitHub').style.display = 'none'
          }
            obj.this.shadowRoot.querySelector('#authGithub').addEventListener('click',async (event)=>{
              document.dispatchEvent( new CustomEvent('github', {
                detail: {
                  _:'button',
                  key: event.target.parentNode.querySelector('input#password').value
                }
              }))
            })
          document.addEventListener('directory-list',async ()=>{
            await google({_:'init',parent:'root', obj:obj})
          })
            obj['this']['shadowRoot'].querySelector('button.GoogleFolder').addEventListener('click',async (event)=>{
              let folder = event.target.parentNode.querySelector('#GoogleFolder')

              if(folder.length === 0){
                console.warn('введите название')
              }else{
                let object = await google({_:'folder', parent:folder.value,previous:folder.value, folder:folder.value})
                // console.assert(false, object)
                if(object === undefined){
                  let dir =  obj.this.querySelector('directory-list')
                  dir.shadowRoot.querySelector('li.rootFolder').innerHTML = ''
                  dir.shadowRoot.querySelector('ul.directory-list').id = undefined
                  dir.shadowRoot.querySelector('li.rootFolder').insertAdjacentHTML('beforeend',`
            folder not found<ul class="rootFolder"></ul>`)
                }else{
                  document.dispatchEvent( new CustomEvent('signInGoogle', {
                    detail: {
                      _:object._,
                      parent:object.parent,
                      id:object.id,
                      previous:object.previous,
                      files:object.files
                    }
                  }))
                }
              }
            })
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
