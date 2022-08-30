import pagination from '/static/html/components/component_modules/varan-pagination/varan-pagination.js'
import matcher from '/static/html/components/component_modules/matcher/module.js'
import Slider from '/static/html/components/component_modules/varan-slider/varan-slider.js'

let style = {}
style['staticProperty'] = 0

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
        matcher['database']['request']['functions']['getObject'](obj)
          .then((obj) => {
            if (!obj['get'][`${obj['slot']}`]) {
              console.log('отсутствуют записи для данного объекта')
            } else {
              pagination['init'](obj)
              pagination['action'](obj)
                .then(obj => {
                  console.log('2222222222222dfgdf2222222222222222222111111111111111111111', obj['get'])
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
        console.log('Peppermint22222 setup done. Slides found: ' + n)
      }
    }))
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
          console.log(`какой то неизвестный тип`, type)
          break
      }
      resolve(obj)
    }
  })
}
const varanEditor = (obj) => {
  return new Promise(function (resolve, reject) {
    console.log('varanEditor', obj['this'])
    switch (obj['events']['detail']['task']['newValue']) {
      case 'editor':
        console.log('varanEditor-editor', obj['this'])
        matcher['database']['request']['functions']['getObject'](obj)
          .then((obj) => {
            if (!obj['get'][`${obj['slot']}`]) {
              console.log('отсутствуют записи для данного объекта')
            } else {
              for (let key = 0; key < obj['this'].children.length; key++) {
                if (obj['this'].children[key].hasAttribute('class')) {
                  if (obj['this'].children[key].className === 'wall') {

                  } else if (obj['this'].children[key].className === 'slider') {
                    getSliderTemplate(obj)
                      .then((obj) => {
                        setExternalComponent(obj, 'slider').then((obj) => {
                          obj['this'].querySelector('.slider').slot = 'view'
                          obj['this'].querySelector('.varan-editor').slot = 'edit'
                          for (let key = 0; key < obj['this'].children.length; key++) {
                            if (obj['this'].children[key].tagName === 'STYLE') {
                              obj['this'].children[key].innerText = style.staticProperty
                            }
                          }
                          resolve(obj)
                        })
                      })
                  }
                }
              }
            }
          })
        break
      case 'gallery':
        console.log('varanEditor-gallery', obj['this'])
        for (let key = 0; key < obj['this'].children.length; key++) {
          if (obj['this'].children[key].hasAttribute('class')) {
            if (obj['this'].children[key].className === 'wall') {
              obj['this'].querySelector('.wall').slot = 'null'
              obj['this'].querySelector('.varan-editor').slot = 'null'

              for (let key = 0; key < obj['this'].children.length; key++) {
                if (obj['this'].children[key].tagName === 'STYLE') {
                  console.log('varanEditor-style-editor', obj['this'].children[key].innerText)
                  style.staticProperty = obj['this'].children[key].innerText
                  obj['this'].children[key].innerText = ''
                }
              }
              resolve(obj)
            } else if (obj['this'].children[key].className === 'slider') {
              obj['this'].querySelector('.slider').slot = 'null'
              obj['this'].querySelector('.varan-editor').slot = 'null'

              for (let key = 0; key < obj['this'].children.length; key++) {
                if (obj['this'].children[key].tagName === 'STYLE') {
                  console.log('varanEditor-style-editor', obj['this'].children[key].innerText)
                  style.staticProperty = obj['this'].children[key].innerText
                  obj['this'].children[key].innerText = ''
                }
              }
              resolve(obj)
            }
          }
        }
        break
      default:
        console.log(`~~~новый~~~тип~~~:`, obj['events']['detail']['task']['newValue'])
        resolve(obj)
        break
    }
  })
}

const varanCrop = (obj) => {
  return new Promise(function (resolve, reject) {
    console.log('varanCrop', obj['events'])
    if (JSON.stringify(obj['events']['detail']['obj']) in localStorage) {
      switch (obj['events']['detail']['task']['newValue']) {
        case 'editor':
          console.log('varanCrop-editor', obj['events'])
          obj['this'].querySelector('#gallery').style.display = 'none'
          obj['this'].slot = 'null'
          resolve(obj)
          break
        case 'gallery':
          console.log('varanCrop-gallery', obj['events'])
          obj = pagination['init'](obj)
          matcher['database']['request']['functions']['getObject'](obj)
            .then((obj) => {
              console.log('varanCrop-gallery-getObject', obj)
              if (!obj['get'][`${obj['slot']}`]) {
                console.log('отсутствуют записи для данного объекта')
              } else {
                pagination['action'](obj)
                  .then(obj => {
                    obj['this'].querySelector('#gallery').style.display = 'flex'
                    obj['this'].querySelector('.menu').style.display = 'flex'
                    obj['this'].slot = 'view'
                    resolve(obj)
                  })
              }
            })
          break
        default:
          console.log(`~~~новый~~~тип~~~:`, obj['events']['detail']['task']['newValue'])
          resolve(obj)
          break
      }
    }
  })
}

const router = (obj) => {
  return new Promise(function (resolve, reject) {
    console.log('~~~~~~actions~~~~~~~~', obj['component'])
    switch (obj['component']) {
      case 'varan-editor':
        varanEditor(obj)
          .then((obj) => {
            resolve(obj)
          })
        break
      case 'varan-crop':
        varanCrop(obj)
          .then((obj) => {
            resolve(obj)
          })
        break
      default:
        console.log(`~~~новый~~~тип~~~actions:`, obj['component'])
        resolve(obj)
        break
    }
  })
}

export default {
  router
}
