import isEmpty from './isEmpty/isEmpty.mjs'
import colors from './template-colors-web/index.mjs';
let stack = {}
let totalCount = -1
let props = {
  isAssert: true,
  isConsole: true,
  init: true,
  count: 0,
  maxCount: 0
}

var PrependZeros = function (str, len, seperator) {
  if (typeof str === 'number' || Number(str)) {
    str = str.toString();
    return (len - str.length > 0) ? new Array(len + 1 - str.length).join('0') + str : str;
  }
  else {
    var spl = str.split(seperator || ' ')
    for (var i = 0 ; i < spl.length; i++) {
      if (Number(spl[i]) && spl[i].length < len) {
        spl[i] = PrependZeros(spl[i], len)
      }
    }
    return spl.join(seperator || ' ');
  }
};

// let PrependZeros = function (str, len, seperator) {
//   if(typeof str === 'number' || Number(str)){
//     str = str.toString();
//     return (len - str.length > 0) ? new Array(len + 1 - str.length).join('0') + str: str;
//   }
//   else{
//     for(var i = 0,spl = str.split(seperator || ' '); i < spl.length; spl[i] = (Number(spl[i])&& spl[i].length < len)?PrependZeros(spl[i],len):spl[i],str = (i === spl.length -1)?spl.join(seperator || ' '):str,i++);
//     return str;
//   }
// };
let preset = (type, pathToFile,id) => {
  if(type < 0) {
    stack[`${pathToFile}`][`${id}`].maxCount = 1000
    stack[`${pathToFile}`][`${id}`].isAssert = false
  }
  // switch (type) {
  //   case -5:
  //     stack[`${pathToFile}`][`${id}`].maxCount = 100
  //     stack[`${pathToFile}`][`${id}`].isAssert = false
  //     break
  //   case -4:
  //     stack[`${pathToFile}`][`${id}`].maxCount = 100
  //     stack[`${pathToFile}`][`${id}`].isAssert = false
  //     break
  //   case -3:
  //     stack[`${pathToFile}`][`${id}`].maxCount = 100
  //     stack[`${pathToFile}`][`${id}`].isAssert = false
  //     break
  //   case -2:
  //     stack[`${pathToFile}`][`${id}`].maxCount = 100
  //     stack[`${pathToFile}`][`${id}`].isAssert = false
  //     break
  //   case -1:
  //     stack[`${pathToFile}`][`${id}`].maxCount = 100
  //     stack[`${pathToFile}`][`${id}`].isAssert = false
  //     break
  //   default:
  //     break
  // }
  return true
}

const print = (type, count, pathToFile, id, payload, data, args) => {
  totalCount = totalCount + 1
  let object1 = isEmpty(payload) ? '' :payload
  let object2 = isEmpty(data) ? '' :data
  let object3 = isEmpty(args) ? '' :args

  if(type <= -14 || isNaN(type)) {
    type = -14
  }

  switch (type) {
    case -14:
      console.log(colors`${PrependZeros(totalCount, 2)}-${PrependZeros(count, 2)} ${pathToFile}.pathColorA4 ${id}.idColorA4`,  object1, object2, object3)
      break
    case -13:
      console.log(colors`${PrependZeros(totalCount, 2)}-${PrependZeros(count, 2)} ${pathToFile}.pathColorA3 ${id}.idColorA3`, object1, object2, object3)
      break
    case -12:
      console.log(colors`${PrependZeros(totalCount, 2)}-${PrependZeros(count, 2)} ${pathToFile}.pathColorA2 ${id}.idColorA2`, object1, object2, object3)
      break
    case -11:
      console.log(colors`${PrependZeros(totalCount, 2)}-${PrependZeros(count, 2)} ${pathToFile}.pathColorA1 ${id}.idColorA1`, object1, object2, object3)
      break
    case -10:
      console.log(colors`${PrependZeros(totalCount, 2)}-${PrependZeros(count, 2)} ${pathToFile}.pathColorA0 ${id}.idColorA0`, object1, object2, object3)
      break
    case -9:
      console.log(colors`${PrependZeros(totalCount, 2)}=${PrependZeros(count, 2)} ${pathToFile}.pathColor9 ${id}.idColor9`,  object1, object2, object3)
      break
    case -8:
      console.log(colors`${PrependZeros(totalCount, 2)}-${PrependZeros(count, 2)} ${pathToFile}.pathColor8 ${id}.idColor8`,  object1, object2, object3)
      break
    case -7:
      console.log(colors`${PrependZeros(totalCount, 2)}=${PrependZeros(count, 2)} ${pathToFile}.pathColor7 ${id}.idColor7`,  object1, object2, object3)
      break
    case -6:
      console.log(colors`${PrependZeros(totalCount, 2)}-${PrependZeros(count, 2)} ${pathToFile}.pathColor6 ${id}.idColor6`,  object1, object2, object3)
      break
    case -5:
      console.log(colors`${PrependZeros(totalCount, 2)}-${PrependZeros(count, 2)} ${pathToFile}.pathColor5 ${id}.idColor5`, object1, object2, object3)
      break
    case -4:
      console.log(colors`${PrependZeros(totalCount, 2)}-${PrependZeros(count, 2)} ${pathToFile}.pathColor4 ${id}.idColor4`,  object1, object2, object3)
      break
    case -3:
      console.log(colors`${PrependZeros(totalCount, 2)}-${PrependZeros(count, 2)} ${pathToFile}.pathColor3 ${id}.idColor3`,  object1, object2, object3)
      break
    case -2:
      console.log(colors`${PrependZeros(totalCount, 2)}-${PrependZeros(count, 2)} ${pathToFile}.pathColor2 ${id}.idColor2`,  object1, object2, object3)
      break
    case -1:
      console.log(colors`${PrependZeros(totalCount, 2)}-${PrependZeros(count, 2)} ${pathToFile}.pathColor1 ${id}.idColor1`,  object1, object2, object3)
      break
    default:
      console.log(colors`${PrependZeros(totalCount, 2)}-${PrependZeros(count, 2)} ${pathToFile}.pathColor0 ${id}.idColor0`,  object1, object2, object3)
      break
  }
  return true
}
let proxyCount = 0
/**
 * @param path {string}
 * @param id {string}
 * @param {(number|Array.<number>)} count
 * @param object {object|null}
 * @param props {string|null}
 * @param value {any}
 * @param threshold {number}
 * @returns {boolean}
 */
let proxy = (path, id, count = [], object = null, props = null, value = null, threshold= 5) => {
  if(assert.current.trim() === `${path} ${id}`) {
    if(!isEmpty(stack[path]) && !isEmpty(stack[path][id])) {
      if(typeof count !== "number") {
        for(let i = 0; i< count.length; i++) {
          if(count[i] < 0) {
            if(stack[path][id].count >= Math.abs(count[i]) && stack[path][id].count < (Math.abs(count[i]) + threshold)) {
              proxyCount = (proxyCount >= 1000)? 0: proxyCount + 1
              if(isEmpty(value)) {
                console.log(`${proxyCount} ⛸ [(get)`,props,`]`, typeof object === 'function' ? 'function': object)
              } else {
                console.log(`${proxyCount} ⛸ [(set)`,props,`]`, value)
              }
            }
          } else {
            if(stack[path][id].count === count[i]) {
              proxyCount = (proxyCount >= 1000)? 0: proxyCount + 1
              if(isEmpty(value)) {
                console.log(`${proxyCount} ⛸ [(get)`,props,`]`, typeof object === 'function' ? 'function': object)
              } else {
                console.log(`${proxyCount} ⛸ [(set)`,props,`]`, value)
              }
            }
          }
        }
      } else {
        return false
      }
    } else {
      return false
    }
  }else {
    return false
  }

  return true
}

/**
 *
 * @param stop
 * @returns {{}}
 */
let list = (stop = false) => {
  if(stop) {
    console.assert(false, stack)
  }
  return stack
}

let assert = {
  current: '',
  list: list,
  proxy: proxy,
  assert: (maxCount,  pathToFile = "", id = "default", payload, data, ...args) => {
    if(isEmpty(stack[`${pathToFile}`])) {
      stack[`${pathToFile}`] = {}
      if(isEmpty(stack[pathToFile][id])) {
        stack[pathToFile][id] = Object.assign({}, props)
      }
    } else {
      if(isEmpty(stack[pathToFile][id])) {
        stack[pathToFile][id] = Object.assign({}, props)
      }
    }
    assert.current = `${pathToFile} ${id}`;
    if(stack[pathToFile][id].init) {
      stack[pathToFile][id].maxCount = maxCount
      stack[pathToFile][id].count = 1
      stack[pathToFile][id].init = false
      preset(maxCount, pathToFile, id)
      if(stack[pathToFile][id].maxCount === 0 || stack[pathToFile][id].maxCount === 1) {
        if(stack[pathToFile][id].isConsole) {
          print(maxCount, stack[pathToFile][id].count, pathToFile, id, payload, data, args)
        }
        if(stack[pathToFile][id].isAssert) {
          console.assert(false, pathToFile, id, stack)
        }
        stack[pathToFile][id].init = true
      } else {
        if(stack[pathToFile][id].isConsole) {
          print(maxCount, stack[pathToFile][id].count, pathToFile, id, payload, data, args)
        }
        stack[pathToFile][id].init = false
      }
    } else {
      stack[pathToFile][id].count = stack[pathToFile][id].count + 1
      if(stack[pathToFile][id].count === stack[pathToFile][id].maxCount) {
        if(stack[pathToFile][id].isConsole) {
          print(maxCount, stack[pathToFile][id].count, pathToFile, id, payload, data, args)
        }
        if(stack[pathToFile][id].isAssert && stack[pathToFile][id].maxCount > 0) {
          console.assert(false, pathToFile, id, stack)
        }
        // stack[pathToFile][id].init = true
      } else {
        if(stack[pathToFile][id].isConsole) {
          print(maxCount, stack[pathToFile][id].count, pathToFile, id, payload, data, args)
        }
      }
    }
    return true
  }
}
export default assert

{

}