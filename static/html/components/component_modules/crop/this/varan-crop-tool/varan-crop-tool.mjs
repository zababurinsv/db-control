import draggable from '/static/html/components/component_modules/crop/this/varan-crop-tool/utils/draggable.mjs'
import movePos from '/static/html/components/component_modules/crop/this/varan-crop-tool/utils/cropMove.mjs'
const dragEle = ['.c-crop--drap_eline', '.c-crop--drap_sline', '.c-crop--drap_wline', '.c-crop--drap_nline', '.c-crop--drap_e', '.c-crop--drap_s', '.c-crop--drap_w', '.c-crop--drap_n', '.c-crop--drap_ne', '.c-crop--drap_se', '.c-crop--drap_sw', '.c-crop--drap_nw']

let tool = {}

tool = {}
tool['props'] = {}
tool['width'] = ''
tool['height'] = ''
tool['top'] = ''
tool['left'] = ''
tool['startPos'] = [0, 0]
tool['crop'] = []
tool['cropTimer'] = null
tool['startSize'] = null

tool['func'] = {}

tool['props']['elWidth'] = ''
tool['props']['elHeight'] = ''
tool['props']['cursorTop'] = ''
tool['props']['cursorLeft'] = ''
tool['props']['cropJson'] = ''

tool['func']['range2'] = function (pos, val, mainW) {
  return pos <= 0 ? 0 : pos > mainW - val ? mainW - val : pos
}

tool['func']['handleDragLocation'] = function () {
  return new Promise(function (resolve, reject) {
    let x = event.clientX
    let y = event.clientY
    this.left = x - this.startPos[0] + this.left
    this.top = y - this.startPos[1] + this.top
    this.startPos = [x, y]
    this.handleSize()
    // 更新尺寸
    this.$emit('updateSize', this.width, this.height, this.top, this.left)
    clearTimeout(this.cropTimer)
    this.cropTimer = setTimeout(() => {
      // 调用回调
      this.$emit('afterCrop')
    }, 200)
  })
}
tool['func']['dragCallLocation'] = function () {
  return new Promise(function (resolve, reject) {
    draggable(this.$el.querySelector('.c-crop--drap_screen'), {
      start: (event) => {
        this.startPos = [event.x, event.y]
      },
      drag: (event) => {
        this.handleDragLocation(event)
      },
      end: (event) => {
        this.handleDragLocation(event)
      }
    })
  })
}
tool['func']['getParentElement'] = function (p, className) {
  return new Promise(function (resolve, reject) {
    const classNames = p.className
    if (classNames.indexOf(className) === -1) {
      p = p.parentNode
      return this.getParentElement(p, className)
    } else {
      return p
    }
  })
}
tool['func']['getDragSize'] = function (event) {
  return new Promise(function (resolve, reject) {
    const el = this.$el
    const screen = this.$cropArea.getBoundingClientRect()
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
  })
}
tool['func']['handleDrag'] = function (event, i) {
  return new Promise(function (resolve, reject) {
    const json = this.getDragSize(event)
    movePos[i](this, json, this.startSize)
    this.handleSize(true)
    this.$emit('updateSize', this.width, this.height, this.top, this.left)
    clearTimeout(this.cropTimer)
    this.cropTimer = setTimeout(() => {
      // 调用回调
      this.$emit('afterCrop')
    }, 200)
  })
}

tool['func']['dragCall'] = function (i) {
  return new Promise(function (resolve, reject) {
    let target = this.$el.querySelector(dragEle[i])
    draggable(target, {
      start: (event) => {
        this.startSize = this.getDragSize(event)
      },
      drag: (event) => {
        this.handleDrag(event, i)
      },
      end: (event) => {
        this.handleDrag(event, i)
      }
    })
  })
}
tool['func']['handleSize'] = function (isSize) {
  return new Promise(function (resolve, reject) {
    this.left = tool['func']['range2'](this.left, this.width, this.cropJson.w)
    this.top = tool['func']['range2'](this.top, this.height, this.cropJson.h)
    if (isSize) {
      let d1 = this.cropJson.w - this.left
      let d2 = this.cropJson.h - this.top
      // 按比例裁切
      if (this.cropJson.r) {
        if (d1 < this.width) {
          this.width = d1
          this.height = this.width / this.cropJson.r
        } else if (d2 < this.height) {
          this.height = d2
          this.width = this.height * this.cropJson.r
        }
      } else {
        // 不按比例裁切
        if (d1 < this.width) {
          this.width = d1
        }
        if (d2 < this.height) {
          this.height = d2
        }
      }
    }
  })
}

export default {
  tool
}
