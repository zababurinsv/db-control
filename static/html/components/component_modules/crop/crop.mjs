'use strict'
let crop = {}
crop['this'] = {}
crop['this']['cropUrl'] = ''
crop['this']['width'] = ''
crop['this']['height'] = ''
crop['func'] = {}
crop['watch'] = {}
crop['this']['originImgSize'] = ''

crop['func']['getCoord'] = function (l, t, w, h, obj) {
  l = obj.scale * l
  t = obj.scale * t
  w = obj.scale * w
  h = obj.scale * h
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

crop['func']['c-crop--area'] = function (obj, dom) {
  dom.querySelector('.c-crop--area').style.width = obj.imgW + 'px'
  dom.querySelector('.c-crop--area').style.height = obj.imgH + 'px'
  dom.querySelector('.c-crop--area').style.marginTop = (obj.height - obj.imgH) / 2 + 'px'
  dom.querySelector('.c-crop--area').style.marginLeft = (obj.width - obj.imgW) / 2 + 'px'
  return obj
}
crop['func']['c-crop--cut'] = function (obj, dom) {
  dom.querySelector('.c-crop--cut').style.width = obj.elWidth + 'px'
  dom.querySelector('.c-crop--cut').style.height = obj.elHeight + 'px'
  dom.querySelector('.c-crop--cut').style.left = obj.cursorLeft + 'px'
  dom.querySelector('.c-crop--cut').style.top = obj.cursorTop + 'px'

  obj.left = obj.cursorLeft
  obj.top = obj.cursorTop

  return obj
}
crop['func']['c-preview'] = function (obj, dom) {
  dom.querySelector('.preview').style.width = obj['previewImgSize'][0]['w'] + 'px'
  dom.querySelector('.preview').style.height = obj['previewImgSize'][0]['h'] + 'px'
  dom.querySelector('.preview').style.left = obj['previewImgSize'][0]['l'] + 'px'
  dom.querySelector('.preview').style.top = obj['previewImgSize'][0]['t'] + 'px'

  return obj
}

crop['func']['updateSize'] = function (obj, dom) {
  if ((obj['imgW'] - (obj['left'] + obj['elWidth'])) < 0) {
    obj.left = obj.left + (obj['imgW'] - (obj['left'] + obj['elWidth']))
  }
  if ((obj['imgH'] - (obj['top'] + obj['elHeight'])) < 0) {
    obj.top = obj.top + (obj['imgH'] - (obj['top'] + obj['elHeight']))
  }
  let coord = {}
  coord = crop['func']['getCoord'](obj.left, obj.top, obj.elWidth, obj.elHeight, obj)

  obj['previewImgSize'] = crop['func']['setPreview'](coord, obj)

  dom.querySelector('.c-crop--cut').style.width = obj.elWidth + 'px'
  dom.querySelector('.c-crop--cut').style.height = obj.elHeight + 'px'
  dom.querySelector('.c-crop--cut').style.left = obj.left + 'px'
  dom.querySelector('.c-crop--cut').style.top = obj.top + 'px'

  dom.querySelector('.cut').style.marginTop = -obj.top + 'px'
  dom.querySelector('.cut').style.marginLeft = -obj.left + 'px'

  dom.querySelector('.preview').style.width = obj['previewImgSize'][0]['w'] + 'px'
  dom.querySelector('.preview').style.height = obj['previewImgSize'][0]['h'] + 'px'
  dom.querySelector('.preview').style.left = obj['previewImgSize'][0]['l'] + 'px'
  dom.querySelector('.preview').style.top = obj['previewImgSize'][0]['t'] + 'px'

  return obj
}
crop['func']['cut'] = function (obj, dom) {
  dom.querySelector('.cut').style.width = obj.imgW + 'px'
  dom.querySelector('.cut').style.height = obj.imgH + 'px'
  dom.querySelector('.cut').style.marginTop = -obj.cursorLeft + 'px'
  dom.querySelector('.cut').style.marginLeft = -obj.cursorTop + 'px'
  return obj
}
crop['func']['setPreview'] = function (coord, obj) {
  if (!obj.previewJson.length) {
    return false
  }
  let result = obj.previewJson.map(data => {
    let scale = data.width / coord.w
    return {
      scale,
      l: -scale * coord.l,
      t: -scale * coord.t,
      w: scale * obj.originImgSize.w,
      h: scale * obj.originImgSize.h
    }
  })
  return result
}
crop['func']['setImage'] = function (obj, img) {
  return new Promise(resolve => {
    let img = obj['this'].querySelector('.org')
    img.src = obj['crop']['this']['url']
    img.setAttribute('alt', 'image')

    img = obj['this'].querySelector('.cut')
    img.src = obj['crop']['this']['url']
    img.setAttribute('alt', 'image')

    img = obj['this'].querySelector('.preview')
    img.src = obj['crop']['this']['url']
    img.setAttribute('alt', 'image')
  })
}
crop['func']['getSize'] = function (obj) {
  return new Promise(resolve => {
    let img = obj['this'].querySelector('#c-crop--hide_img')

    obj['crop']['this']['cropUrl'] = obj['upload']['url']
    if (obj['crop']['this']['cropUrl'] && img) {
      img.onload = function () {
        const size = crop['func']['getSizeImg'](img)

        resolve(size)
      }
      img.src = obj['crop']['this']['cropUrl']
    } else {
      resolve({
        w: 0,
        h: 0,
        r: 0
      })
    }
  })
}

crop['func']['setSize'] = async function (obj) {
  if (!obj['upload']['url']) {
    return false
  }
  let imgSize = await crop['func']['getSize'](obj)
  obj['crop']['this']['originImgSize'] = imgSize
  obj['crop']['watch']['originImgSize'] = imgSize
  obj = await crop['func']['setCoordRange'](obj)

  obj['crop']['this']['scale'] = imgSize.w / obj['crop']['this']['imgW']
  obj['crop']['watch']['scale'] = imgSize.w / obj['crop']['this']['imgW']
  obj['crop']['this']['cursorTop'] = 0
  obj['crop']['this']['cursorLeft'] = 0
  obj['crop']['this']['ratio'] = 1

  let json = {...obj['crop']['this']['cropJson']}
  json.w = obj['crop']['this']['imgW']
  json.h = obj['crop']['this']['imgH']

  if (obj['crop']['this']['ratio']) {
    json.r = obj['crop']['this']['ratio']
    if (json.w > json.h) {
      let r = json.h * obj['crop']['this']['ratio'] / json.w
      if (r > 1) {
        json.ch = json.h / r
        json.cw = json.ch * obj['crop']['this']['ratio']
      } else {
        json.ch = json.h
        json.cw = json.ch * obj['crop']['this']['ratio']
      }
    } else {
      let r = json.w / obj['crop']['this']['ratio'] / json.h
      if (r > 1) {
        json.cw = json.w / r
        json.ch = json.cw / obj['crop']['this']['ratio']
      } else {
        json.cw = json.w
        json.ch = json.cw / obj['crop']['this']['ratio']
      }
    }
  } else {
    json.cw = json.w
    json.ch = json.h
  }
  obj['crop']['this']['elWidth'] = json.cw / 2
  obj['crop']['this']['elHeight'] = json.ch / 2
  obj['crop']['this']['cursorTop'] = json.ch / 4
  obj['crop']['this']['cursorLeft'] = json.cw / 4
  obj['crop']['watch']['elWidth'] = json.cw / 2
  obj['crop']['watch']['elHeight'] = json.ch / 2
  obj['crop']['watch']['cursorTop'] = json.ch / 4
  obj['crop']['watch']['cursorLeft'] = json.cw / 4
  obj['crop']['this']['cropJson'] = {...json}
  obj['crop']['watch']['c-crop--cut'](obj['crop']['this'], obj['this'])
  obj['crop']['watch']['cut'](obj['crop']['this'], obj['this'])
  obj['crop']['func']['tool']['drapSizeUpdate'](obj['crop']['this']['elWidth'], obj['crop']['this']['elHeight'], obj['crop']['this']['cursorTop'], obj['crop']['this']['cursorLeft'], obj)
  return obj
}

crop['func']['getSizeImg'] = function (img) {

  let w = img.naturalWidth
  let h = img.naturalHeight
  let r = w === 0 && h === 0 ? 0 : w / h
  return {
    w: w,
    h: h,
    r: r
  }
}
crop['func']['getHW'] = function (obj) {
  obj['crop']['this']['width'] = obj['this'].querySelector('.c-crop--main').style.width
  obj['crop']['this']['height'] = obj['this'].querySelector('.c-crop--main').style.height
  obj['crop']['this']['width'] = obj['crop']['func']['convert']['vwToPixel'](obj['crop']['this']['width'].substr(0, obj['crop']['this']['width'].length - 2))
  obj['crop']['this']['height'] = obj['crop']['func']['convert']['vwToPixel'](obj['crop']['this']['height'].substr(0, obj['crop']['this']['height'].length - 2))
  return obj
}

crop['func']['setCoordRange'] = function (obj) {
  return new Promise(function (resolve, reject) {
    let size = {...obj['crop']['this']['originImgSize']}
    obj['crop']['func'].getHW(obj)

    obj['crop']['watch'].height = obj['crop']['this']['height']
    obj['crop']['watch'].width = obj['crop']['this']['width']
    obj['crop']['watch'].imgW = obj['crop']['this']['imgW']
    obj['crop']['watch'].imgH = obj['crop']['this']['imgH']
    obj['crop']['watch']['c-crop--area'] = obj['crop']['func']['c-crop--area']
    obj['crop']['watch']['c-crop--cut'] = obj['crop']['func']['c-crop--cut']
    obj['crop']['watch']['cut'] = obj['crop']['func']['cut']

    let ratio1 = obj['crop']['this']['width'] / obj['crop']['this']['height']
    let ratio2 = size.r
    if (ratio2 > ratio1) {
      obj['crop']['this']['imgW'] = obj['crop']['this']['width']
      obj['crop']['this']['imgH'] = obj['crop']['this']['width'] / size.r
      obj['crop']['watch']['imgW'] = obj['crop']['this']['width']
      obj['crop']['watch']['imgH'] = obj['crop']['this']['width'] / size.r
    } else {
      obj['crop']['this']['imgH'] = obj['crop']['this']['height']
      obj['crop']['this']['imgW'] = obj['crop']['this']['height'] * size.r
      obj['crop']['watch']['imgH'] = obj['crop']['this']['height']
      obj['crop']['watch']['imgW'] = obj['crop']['this']['height'] * size.r
    }
    obj['crop']['watch']['c-crop--area'](obj['crop']['this'], obj['this'])
    resolve(obj)
  })
}
crop['func']['getCropJson'] = function (obj) {
  return new Promise(function (resolve, reject) {
    obj['crop']['this']['cropJson'] = []
    obj['crop']['this']['cropJson']['cw'] = null
    obj['crop']['this']['cropJson']['ch'] = null
    obj['crop']['this']['cropJson']['w'] = null
    obj['crop']['this']['cropJson']['h'] = null
    obj['crop']['this']['cropJson']['r'] = null
    obj['crop']['watch']['cropJson'] = obj['crop']['this']['cropJson']
    resolve(obj)
  })
}
crop['func']['openCrop'] = function (event) {
  return new Promise(function (resolve, reject) {
    let _this = this
    this.fileLoader(event, src => {
      _this.cropUrl1 = src
    })
  })
}
crop['func']['dragFn'] = function (event) {
  return new Promise(function (resolve, reject) {
    const imgFile = event.dataTransfer.files.item(0)
    if (!(/^image.*$/.test(imgFile.type))) {
      return false
    }

    var fReader = new FileReader()
    fReader.readAsDataURL(imgFile)
    fReader.onload = function (event) {
      this.cropUrl = event.target.result
    }
  })
}

crop['func']['showImage'] = function (event, cb) {
  return new Promise(function (resolve, reject) {
    let reader = new FileReader()
    var file = event['crop']['file']
    reader.readAsDataURL(file)
    reader.onload = function (e) {
      cb(e.target.result)
    }
  })
}
crop['func']['setPreviewSize'] = function (obj) {
  return new Promise(function (resolve, reject) {
    if (!obj['crop']['this']['previewJson'].length) {
      return false
    }
    let result = obj['crop']['this']['previewJson']
      .map(data => {
        let scale = data.width / obj['crop']['this']['coord'].w
        return {
          scale,
          l: -scale * obj['crop']['this']['coord'].l,
          t: -scale * obj['crop']['this']['coord'].t,
          w: scale * obj['crop']['this']['originImgSize'].w,
          h: scale * obj['crop']['this']['originImgSize'].h
        }
      })

    obj['crop']['this']['previewImgSize'] = result
    obj['crop']['watch']['previewImgSize'] = result
    crop['watch']['c-preview'](obj['crop']['this'], obj['this'])

    obj['crop']['watch']['end'] = true
    resolve(obj)
  })
}
export default {
  crop
}
