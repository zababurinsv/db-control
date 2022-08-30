'use strict'
import database from '/static/html/components/component_modules/matcher/matcher/database.mjs'
import draggable from '/static/html/components/component_modules/crop/this/varan-crop-tool/utils/draggable.mjs'
import movePos from '/static/html/components/component_modules/crop/this/varan-crop-tool/utils/cropMove.mjs'
import crop from '/static/html/components/component_modules/crop/crop.mjs'
import convert from '/static/html/components/component_modules/convert/convert.mjs'
const dragEle = ['.c-crop--drap_eline', '.c-crop--drap_sline', '.c-crop--drap_wline', '.c-crop--drap_nline', '.c-crop--drap_e', '.c-crop--drap_s', '.c-crop--drap_w', '.c-crop--drap_n', '.c-crop--drap_ne', '.c-crop--drap_se', '.c-crop--drap_sw', '.c-crop--drap_nw']
function dom () { }
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
let external = []
external['func'] = []
external['func']['crop'] = []
external['func']['afterCrop'] = function (obj) {
  /// /console.log(`{a[*'afterCrop'])t-${obj}`, obj)
}
let init = async function (obj) {
  dom['staticProperty'] = obj['this']
  obj['crop'] = {}
  for (let key in crop['crop']) {
    obj['crop'][`${key}`] = crop['crop'][`${key}`]
  }
  obj['crop']['func']['tool'] = {}
  for (let key in external['func']) {
    obj['crop']['func']['tool'][`${key}`] = external['func'][key]
  }
  obj['crop']['func']['convert'] = await convert['init']()
  obj['crop']['this']['height'] = 0
  obj['crop']['this']['top'] = 0
  obj['crop']['this']['left'] = 0
  obj['crop']['this']['width'] = 0
  obj['crop']['this']['marginTop'] = 0
  obj['crop']['this']['marginLeft'] = 0
  obj['crop']['this']['startPos'] = [0, 0]
  obj['crop']['this']['cropTimer'] = null
  obj['crop']['this']['startSize'] = null
  obj['crop']['this']['url'] = obj['upload']['url']
  obj['crop']['this']['previewJson'] = [{ width: 0, height: 0 }]
  obj['crop']['watch']['previewJson'] = [{ width: 0, height: 0 }]
  obj['crop']['watch']['convert'] = await convert['init'](obj)
  obj['crop']['watch'] = proxy(obj['crop']['watch'])
  obj['crop']['watch']['updateSize'] = obj['crop']['func']['updateSize']
  obj['crop']['watch']['c-preview'] = obj['crop']['func']['c-preview']
  obj['crop']['watch']['elWidth'] = 0
  obj['crop']['watch']['elHeight'] = 0
  obj['crop']['watch']['cursorTop'] = 0
  obj['crop']['watch']['cursorLeft'] = 0
  obj['crop']['watch']['left'] = 0
  obj['crop']['watch']['top'] = 0
  obj['crop']['watch']['end'] = false
  obj['crop']['watch']['startPos'] = 0
  obj['crop']['watch']['scale'] = obj['crop']['this']['scale']
  obj['crop']['watch']['originImgSize'] = 0
  obj['crop']['watch']['previewImgSize'] = 0
  obj['crop']['func']['tool']['style'](obj)
  return obj
}

const handler = {
  get: function (obj, prop) {
    return obj[prop]
  },
  set: function (obj, prop, value) {
    obj[prop] = value
    if ('c-crop--area' in obj === false ||
        'updateSize' in obj === false ||
        'previewImgSize' in obj === false ||
        'c-crop--cut' in obj === false ||
        'cursorLeft' in obj === false ||
        'cursorTop' in obj === false ||
        'cut' in obj === false ||
        'elHeight' in obj === false ||
        'elWidth' in obj === false ||
        'height' in obj === false ||
        'imgH' in obj === false ||
        'imgW' in obj === false ||
        'end' in obj === false ||
        'width' in obj === false) {
    } else {
      if (obj['end'] === true) {
        if (prop === 'end') {} else {
          obj['updateSize'](obj, dom['staticProperty'])
        }
      }
    }
    return obj
  }
}

function proxy (obj) {
  obj = new Proxy(obj, handler)
  return obj
}
external['func']['style'] = function (obj) {
  console.log(`{a[*'style'])t-${obj}`, obj)
  dom['staticProperty'].querySelector('.c-crop--area').style.display = 'block'
  let styles = getComputedStyle(dom['staticProperty'].querySelector('.c-crop--preview'), 'width').width
  styles = styles.substr(0, styles.length - 2)
  obj['crop']['this']['previewJson'][0]['height'] = styles
  obj['crop']['this']['previewJson'][0]['width'] = styles
  obj['crop']['watch']['previewJson'][0]['height'] = styles
  obj['crop']['watch']['previewJson'][0]['width'] = styles
  return obj
}

external['func']['crop']['cropUrl'] = function (obj) {
  return new Promise(function (resolve, reject) {
    console.log('~~~~~~~~cropUrl~~~~~~~~~~', obj)
    init(obj).then(obj => {
      obj['crop']['func']['setImage'](obj)
      obj['crop']['func']['tool']['mounted'](obj)
      obj['crop']['func']['setSize'](obj)
      let t = 0
      obj['this'].querySelector('.saveImg').addEventListener('click', (event) => {
        colorLog(`~~~~~~~~<matcher-save-imgages>~~~~~~~~~~`, '#FF4500', event)
        t = event.timeStamp
        let image = dom['staticProperty'].querySelector('.org')
        let sy = obj['crop']['func']['convert']['clearnPx'](dom['staticProperty'].querySelector('.preview').style.top)
        let sx = obj['crop']['func']['convert']['clearnPx'](dom['staticProperty'].querySelector('.preview').style.left)
        let dWidth = obj['crop']['func']['convert']['clearnPx'](dom['staticProperty'].querySelector('.preview').style.width)
        let dHeight = obj['crop']['func']['convert']['clearnPx'](dom['staticProperty'].querySelector('.preview').style.height)
        let cWidth = obj['crop']['func']['convert']['vwToPixel'](36)
        let cHeight = obj['crop']['func']['convert']['vwToPixel'](36)

        let naturalWidth = dom['staticProperty'].querySelector('.preview').naturalWidth
        let naturalHeight = dom['staticProperty'].querySelector('.preview').naturalHeight
        sx = parseInt(sx, 10)
        sy = parseInt(sy, 10)
        dWidth = parseInt(dWidth, 10)
        dHeight = parseInt(dHeight, 10)
        cWidth = parseInt(cWidth, 10)
        cHeight = parseInt(cHeight, 10)
        var canvas = document.createElement('canvas')
        canvas.width = cWidth
        canvas.height = cHeight
        var ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0, 0, naturalWidth, naturalHeight, sx, sy, dWidth, dHeight)

        obj['upload']['url'] = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
        canvas.toBlob(function (blob) {
          var url = URL.createObjectURL(blob)
          if (!obj['slot']) {
            obj['upload']['object'] = obj['parent']
          } else {
            obj['upload']['object'] = obj['slot']
          }
          obj['upload']['file'] = blob
          obj['upload']['content'] = obj['this'].querySelector('.content').value
          obj['this'].querySelector('.modal').style.display = 'none'
          resolve(obj)
          URL.revokeObjectURL(url)
        }, 'image/jpeg', 0.95)
      }, true)
    })
  })
}

external['func']['crop']['mounted'] = async function (obj) {
  /// /console.log('~~~~~~~~~~~~~~~mounted~~Crop~~~~~~~~~~~~~~~~~')
  obj = await crop['crop']['func']['setSize'](obj)
  return obj
}
external['func']['mounted'] = function (obj) {
  return new Promise(function (resolve, reject) {
    /// /console.log(`{a[*'mounted'])t-${obj['this'].querySelector('.c-crop--area')}`, obj['this'].querySelector('.c-crop--area'))

    obj['crop']['this']['$cropArea'] = obj['this'].querySelector('.c-crop--area')
    /// /console.log('~~~~~!!!!~~~~~~~~~~mounted~~Tool~~~~~~~~~~~~~', obj)
    for (let i = 0; i < dragEle.length; i++) {
      obj['crop']['func']['tool']['dragCall'](obj, i)
    }
    obj['crop']['func']['tool']['dragCallLocation'](obj)
  })
}
external['func']['dragCall'] = function (obj, i) {
  /// /console.log('~~~~~~!!!!~~~~~~~~~dragCall~~~~~~!!!!~~~~~~~~~~~~~')
  let target = obj['this'].querySelector(dragEle[i])
  draggable(target, {
    start: (event) => {
      /// /console.log('~~~~~~!!!!~~~~~~~~~dragCall~~~start~~~~~!!!!~~~~~~~~', event)
      obj['crop']['this']['startSize'] = obj['crop']['func']['tool']['getDragSize'](event, obj)
    },
    drag: (event) => {
      /// /console.log('~~~~~~!!!!~~~~~~~~~dragCall~~~drag~~~~~!!!!~~~~~~~~', event)
      obj['crop']['func']['tool']['handleDrag'](event, i, obj)
    },
    end: (event) => {
      /// /console.log('~~~~~~!!!!~~~~~~~~~dragCall~~~end~~~~~!!!!~~~~~~~~', event)
      obj['crop']['func']['tool']['handleDrag'](event, i, obj)
    }
  })
}
external['func']['dragCallLocation'] = function (obj) {
  return new Promise(function (resolve, reject) {
    /// /console.log('~~~~~~~!!!!~~~~~~~~dragCallLocation~~~~~~!!!~~~~~~~', obj)
    draggable(obj['this'].querySelector('.c-crop--drap_screen'), {
      start: (event) => {
        /// /console.log('~~~~~~~!!!!~~~~~~~~dragCallLocation~~~~~~start~~~~~~!!!~~~~~~~', event.x, event.y)
        obj['crop']['this']['startPos'] = [event.x, event.y]
      },
      drag: (event) => {
        /// /console.log('~~~~~~~~!!!!~~~~~~~dragCallLocation~~~drag~~~~~~!!!!~~~~~~~~~~', event)
        obj['crop']['func']['tool']['handleDragLocation'](event, obj)
      },
      end: (event) => {
        /// /console.log('~~~~~~~~!!!!~~~~~~~dragCallLocation~~~~~end~~~~!!!!~~~~~~~~~~', event)
        obj['crop']['func']['tool']['handleDragLocation'](event, obj)
      }
    })
  })
}
external['func']['handleDrag'] = function (event, i, obj) {
  return new Promise(function (resolve, reject) {
    obj['crop']['this']['json'] = obj['crop']['func']['tool']['getDragSize'](event, obj)
    movePos[i](obj['crop']['this'], obj['crop']['this']['json'], obj['crop']['this']['startSize'])
    obj['crop']['func']['tool']['handleSize'](true, obj)
    obj['crop']['func']['tool']['drapSizeUpdate'](obj['crop']['this']['width'], obj['crop']['this']['height'], obj['crop']['this']['top'], obj['crop']['this']['left'], obj)
    clearTimeout(obj['crop']['this']['cropTimer'])
    obj['crop']['this']['cropTimer'] = setTimeout(() => {
      obj['crop']['func']['tool']['afterCrop'](obj)
    }, 200)
  })
}

external['func']['getDragSize'] = function (event, obj) {
  /// /console.log('~~~~~~~~~~~~~getDragSize~~~~~~~~~~~1~~~~~~~')
  const el = obj['crop']['this']['$cropArea'].querySelector('.c-crop--drap')
  const screen = obj['crop']['this']['$cropArea'].getBoundingClientRect()
  const rect = el.getBoundingClientRect()
  let json = {
    x: event.clientX,
    y: event.clientY,
    t: rect.top,
    b: rect.bottom,
    l: rect.left,
    r: rect.right,
    w: rect.width,
    h: rect.height,
    screen: screen
  }
  json.ratio = json.w / json.h
  return json
}

external['func']['getCoord'] = function (l, t, w, h, obj) {
  l = obj['crop']['this'].scale * l
  t = obj['crop']['this'].scale * t
  w = obj['crop']['this'].scale * w
  h = obj['crop']['this'].scale * h
  return {
    p0: [l, t],
    p1: [l + w, t],
    p2: [l + w, t + h],
    p3: [l, t + h],
    w: w,
    h: h,
    l: l,
    t: t
  }
}
external['func']['drapSizeUpdate'] = function (w, h, t, l, obj) {
  return new Promise(function (resolve, reject) {
    /// /console.log('~~~~~~~~~~~~~~drapSizeUpdate~~~~~~~~~~~~~~~~~~~', w, h, t, l)
    obj['crop']['this'].elWidth = w
    obj['crop']['this'].elHeight = h
    obj['crop']['this'].cursorTop = t
    obj['crop']['this'].cursorLeft = l
    obj['crop']['watch'].elWidth = w
    obj['crop']['watch'].elHeight = h
    obj['crop']['watch'].cursorTop = t
    obj['crop']['watch'].cursorLeft = l
    obj['crop']['this'].coord = obj['crop']['func']['tool']['getCoord'](l, t, w, h, obj)

    /// /console.log('~~~~~~~~~~~~~~~getCoord~~~~~~~~~~~~~~~~~', obj['crop']['this']['coord'])
    obj['crop']['func']['setPreviewSize'](obj)
  })
}
external['func']['range2'] = function (pos, val, mainW) {
  /// /console.log('~~~~~~~!!!!!~~~~~~~~range2~~~~~~~~~~!!!!!~~~~~~~~~')
  return pos <= 0 ? 0 : pos > mainW - val ? mainW - val : pos
}

external['func']['handleSize'] = function (isSize, obj) {
  return new Promise(function (resolve, reject) {
    /// /console.log('~~~~~~~~!!!!!~~~~~~~handleSize~~~~~~!!!!!~~~~~~~~~~~~~', obj)
    obj['crop']['this'].left = obj['crop']['func']['tool']['range2'](obj['crop']['this'].left, obj['crop']['this'].width, obj['crop']['this'].cropJson.w)
    obj['crop']['this'].top = obj['crop']['func']['tool']['range2'](obj['crop']['this'].top, obj['crop']['this'].height, obj['crop']['this'].cropJson.h)
    if (isSize) {
      let d1 = obj['crop']['this'].cropJson.w - obj['crop']['this'].left
      let d2 = obj['crop']['this'].cropJson.h - obj['crop']['this'].top
      if (obj['crop']['this'].cropJson.r) {
        if (d1 < obj['crop']['this'].width) {
          obj['crop']['this'].width = d1
          obj['crop']['this'].height = obj['crop']['this'].width / obj['crop']['this'].cropJson.r
        } else if (d2 < obj['crop']['this'].height) {
          obj['crop']['this'].height = d2
          obj['crop']['this'].width = obj['crop']['this'].height * obj['crop']['this'].cropJson.r
        }
      } else {
        if (d1 < obj['crop']['this'].width) {
          obj['crop']['this'].width = d1
        }
        if (d2 < obj['crop']['this'].height) {
          obj['crop']['this'].height = d2
        }
      }
    }
  })
}

external['func']['verify'] = function (obj) {
  if (obj < 0) {
    obj = 0
  }
  return obj
}
external['func']['verifyRB'] = function (obj) {
  if (obj < 0) {
    return true
  } else {
    return false
  }
}
external['func']['handleDragLocation'] = function (event, obj) {
  return new Promise(function (resolve, reject) {
    /// /console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', event)
    let x = event.clientX
    let y = event.clientY

    obj['crop']['this']['top'] = obj['crop']['func']['tool']['verify']((y - obj['crop']['this']['startPos'][1] + obj['crop']['this']['top']))
    obj['crop']['this']['left'] = obj['crop']['func']['tool']['verify']((x - obj['crop']['this']['startPos'][0] + obj['crop']['this']['left']))
    obj['crop']['this']['startPos'] = [x, y]

    obj['crop']['watch']['top'] = obj['crop']['func']['tool']['verify']((y - obj['crop']['this']['startPos'][1] + obj['crop']['this']['top']))
    obj['crop']['watch']['left'] = obj['crop']['func']['tool']['verify']((x - obj['crop']['this']['startPos'][0] + obj['crop']['this']['left']))
    obj['crop']['watch']['startPos'] = [x, y]

    /// /console.log('~~~~~~~!!!!~~~~~~~~handleDragLocation~~~~~!!!!~~~~~~~~~~~~~~', obj['crop']['watch'].imgW, obj['crop']['watch'].imgH, obj['crop']['this'].top, obj['crop']['this'].left)
    clearTimeout(obj['crop']['this']['cropTimer'])
    obj['crop']['this']['cropTimer'] = setTimeout(() => {
      obj['crop']['func']['tool']['afterCrop'](obj)
    }, 200)
  })
}

external['func']['getParentElement'] = function (p, className) {
  return new Promise(function (resolve, reject) {
    /// /console.log('~~~~~~!!!!!~~~~~~~~~getParentElement~~~~~~!!!!~~~~~~~~~~~~~')
    const classNames = p.className
    if (classNames.indexOf(className) === -1) {
      p = p.parentNode
      return this.getParentElement(p, className)
    } else {
      return p
    }
  })
}

export default {
  database,
  external
}
