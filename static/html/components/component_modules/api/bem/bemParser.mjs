import bem from '/static/html/components/component_modules/api/bem/bem.mjs'

function processor(input, element, obj) {
  let pattern = ['block','elem','elemMod','elemModVal', 'mod', 'modVal']
    if(input[pattern[0]] !== undefined) {
      for(let i = 0; i <  pattern.length; i++) {
        if(input[pattern[i]] === undefined) {
          if(i === 0) {
            break
          } else {
            if(input['mod'] === undefined) {
              switch (i) {
                case 1:
                  if(obj[input[pattern[i - 1]]]['0'] === undefined) {
                    obj[input[pattern[i - 1]]]['0'] = []
                  }
                  obj[input[pattern[i - 1]]]['0'].push(element)
                  break
                case 2:
                  if(Object.keys(input).length === 2) {
                    if(obj[input[pattern[i - 2]]][input[pattern[i - 1]]]['0'] === undefined) {
                      obj[input[pattern[i - 2]]][input[pattern[i - 1]]]['0'] = []
                    }
                    obj[input[pattern[i - 2]]][input[pattern[i - 1]]]['0'].push(element)
                  }
                  break
                case 3:
                  if(Object.keys(input).length === 3) {
                    if(obj[input[pattern[i - 3]]][input[pattern[i - 2]]][input[pattern[i - 1]]]['0'] === undefined) {
                      obj[input[pattern[i - 3]]][input[pattern[i - 2]]][input[pattern[i - 1]]]['0'] = []
                    }
                    obj[input[pattern[i - 3]]][input[pattern[i - 2]]][input[pattern[i - 1]]]['0'].push(element)
                  }
                  break
                default:
                  break
              }
            } else {
              if(pattern[i] === 'elem' || pattern[i] === 'elemMod' || pattern[i] ===  'elemModVal') {
                continue
              } else {
                if(obj[input[pattern[i - 5]]][input[pattern[i - 1]]]['0'] === undefined) {
                  obj[input[pattern[i - 5]]][input[pattern[i - 1]]]['0'] = []
                }
                obj[input[pattern[i - 5]]][input[pattern[i - 1]]]['0'].push(element)
              }
            }
          }
        } else {
          if(i === 0) {
            if(typeof obj[input[pattern[i]]] !== 'object') {
              obj[input[pattern[i]]] = {}
            }
          }
          switch (i) {
            case 1:
              if(typeof obj[input[pattern[i - 1]]][input[pattern[i]]] !== 'object') {
                obj[input[pattern[i - 1]]][input[pattern[i]]] = {}
              }
              break
            case 2:
              if(typeof obj[input[pattern[i - 2]]][input[pattern[i - 1]]][input[pattern[i]]] !== 'object') {
                obj[input[pattern[i - 2]]][input[pattern[i - 1]]][input[pattern[i]]] = {}
              }
              break
            case 3:
              if(typeof obj[`${input[pattern[i - 3]]}`][`${input[pattern[i - 2]]}`][`${input[pattern[i - 1]]}`][`${input[pattern[i]]}`] !== 'object') {
                obj[`${input[pattern[i - 3]]}`][`${input[pattern[i - 2]]}`][`${input[pattern[i - 1]]}`][`${input[pattern[i]]}`] = []
              }
              obj[`${input[pattern[i - 3]]}`][`${input[pattern[i - 2]]}`][`${input[pattern[i - 1]]}`][`${input[pattern[i]]}`].push(element)
              break
            case 4:
              if(typeof obj[`${input[pattern[i - 4]]}`][`${input[pattern[i]]}`] !== 'object') {
                obj[`${input[pattern[i - 4]]}`][`${input[pattern[i]]}`] = {}
              }
              break
            case 5:
              if(typeof obj[input[`${pattern[i - 5]}`]][input[`${pattern[i - 1]}`]][input[`${pattern[i]}`]] !== 'object') {
                obj[input[`${pattern[i - 5]}`]][input[`${pattern[i - 1]}`]][input[`${pattern[i]}`]] = []
              }
              obj[input[`${pattern[i - 5]}`]][input[`${pattern[i - 1]}`]][input[`${pattern[i]}`]].push(element)
              break
            default:
              break
          }
        }
      }
    }
    return obj
}

export default (dom) => {
  return new Promise(async (resolve, reject) => {
    let obj = {}
    obj.class = {}
    obj.id = {}
    for(let key in dom) {
      switch (key) {
        case 'id':
          for(let i = 0; i < dom[key].length; i++) {
            obj.id = await processor(bem(dom[key][i][key]), dom[key][i], obj.id)
          }
          break
        case 'classList':
          for(let i = 0; i < dom[key].length; i++) {
            for(let j = 0; j < dom[key][i][key].length; j++) {
              obj.class = await processor(bem(dom[key][i][key][j]), dom[key][i], obj.class)
            }
          }
          break
        default:
          break
      }
    }
    resolve(obj)
  })
}
