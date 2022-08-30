/**
 * @namespace Utils
 */
export default (obj, func, ...args) => {
  return new Promise(function (resolve, reject) {
    let out = (obj) => {
      // console.log('~~~ out utils ~~~')
      resolve(obj)
    }
    let err = (error) => {
      console.log('~~~ err utils ~~~', error)
      reject(error)
    }
    switch (func) {
      case 'download':
        (async (obj, props, data) => {
          try {
            // console.log(`${obj['input']}[(utils)${obj[props]}]`)
            let link = document.createElement('a')
            link.download = 'my-image-name.jpeg'
            link.href = data
            link.click()
            out(obj)
          } catch (e) { err(e) }
        })(obj, args[0], args[1], args[2], args[3])
        break
      case 'getType':
        (async (obj, props, render) => {
          try {
            out(obj['this'].getAttribute('type').split('-'))
          } catch (e) { err(e) }
        })(obj, args[0], args[1], args[2])
        break
      case 'createDocument':
        (async (obj) => {
          try {
            out(obj)
          } catch (e) { err(e) }
        })(obj, args[0], args[1], args[2])
        break
      case 'convert':
        (async (obj, props, data) => {
          try {
            // console.log(`${obj['input']}[(utils)${obj[props]}]`)
            switch (obj[props]) {
              case 'blobToFile':
                var reader = new FileReader();
                reader.readAsDataURL(obj['blob']);
                reader.onloadend =  function() {
                  return new Promise(function (resolve, reject) {

                    resolve(reader.result)

                  })
                }

                out(base64)
                break
              case 'date':


                for(let i = 0; i < obj['data'].length; i++){
                  let objectDate = {}
                  let date = new Date(`${obj['data'][i].isoDate}`);
                  objectDate['date'] =`${date.getFullYear()}.${date.getDate()}.${date.getMonth()+1}`
                  objectDate['min'] = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
                  objectDate['all'] = `${date.getFullYear()}.${date.getDate()}.${date.getMonth()+1 } ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
                  obj['data'][i].date = {}
                  obj['data'][i].date = objectDate

                }
                out(obj)
                break
              case 'jsonDate':
                // console.log(obj['data'])
                for(let i = 0; i < obj['data'].length; i++){

                  let objectDate = {}
                  let date = new Date(`${obj['data'][i].date_modified}`);
                  objectDate['date'] =`${date.getFullYear()}.${date.getDate()}.${date.getMonth()+1}`
                  objectDate['min'] = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
                  objectDate['all'] = `${date.getFullYear()}.${date.getDate()}.${date.getMonth()+1 } ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
                  obj['data'][i].date = {}
                  obj['data'][i].date = objectDate

                }
                out(obj)
                break
              case 'feedDate':

                  let tempDate = {}
                  let date = new Date(`${obj['data']}`);

                  let second = date.getSeconds()
                  if(second.toString().length === 1){
                    second = `0${second}`
                  }
                  let minutes = date.getMinutes()
                if(minutes.toString().length === 1){
                  minutes = `0${minutes}`
                }
                  let hours = date.getHours()
                  if(hours.toString().length === 1){
                    hours = `0${hours}`
                  }
                let dateTEst = {}
                dateTEst = date.getDate()
                dateTEst = dateTEst.toString()
                  if(dateTEst.length === 1){
                    dateTEst =`0${dateTEst}`
                  }
                  tempDate['date'] =`${date.getFullYear()}.${dateTEst}.${date.getMonth()+1}`
                  tempDate['min'] = `${hours}:${minutes}:${second}`
                  tempDate['all'] = `${date.getFullYear()}.${dateTEst}.${date.getMonth()+1 } ${hours}:${minutes}:${second}`

                out(tempDate)
                break
              case 'html2string':+
                out(encodeURI( obj['data']))
                break
              case 'string2html':
                out( decodeURI(obj['data']))
                break
              case 'timestamp':

                let temp = obj['data'].split(' ')
                  let monthTemp = {}
                  let objectDate ={}
                // console.assert(false, temp[4])
                var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                  for(let i = 0; i< months.length;i++){

                    if(temp[2] === months[i]){
                      monthTemp = i + 1

                    }
                  }


                  let time = temp[4].split(':')
                  let hour = +time[0] + 3
                  if(hour === 24){
                    temp[1] = +temp[1] + 1
                    hour = '00'
                  }else if(hour === 25){
                    hour = '01'
                    temp[1] = +temp[1] + 1
                  }else if(hour === 26){
                    hour = '02'
                    temp[1] = +temp[1] + 1
                  }
                  if(hour.toString().length === 1){
                    hour = `0${hour}`
                  }

                let minuts = +time[1]
                if(minuts.toString().length === 1){
                  minuts = `0${minuts}`
                }
                let seconds = +time[2]
                if(seconds.toString().length === 1){
                  seconds = `0${seconds}`
                }

                objectDate['date'] =`${temp[3]}.${temp[1]}.${monthTemp}`
                objectDate['min'] =  `${hour}:${minuts}:${seconds}`
                objectDate['all'] = `${temp[3]}.${temp[1]}.${monthTemp} ${hour}:${minuts}:${seconds}`

                out(objectDate);

              break
              default:
                err(`необрабатываемый тип запроса ${obj[props]}` )
                break
            }
          } catch (e) { err(e) }
        })(obj, args[0], args[1], args[2], args[3])
        break
      case 'get':
        (async (obj, props,data) => {
          try {
            // console.log(`app(${func}[(${obj['input']})${obj[props]}]property)`)
            switch (obj[props]) {
              case 'object':
                (async (obj, props,data) => {
                  try {
                    let verify = false
                    for(let i = 0; i < obj['source'].length; i++){

                      switch (obj['source'][i].slot) {
                        case obj['target']:
                          verify = true
                          if(obj['get']){
                            out( obj['source'][i]['this'].shadowRoot.querySelector(obj['get']))
                          }else{
                            out(obj['source'][i])
                          }
                          break
                        default:
                          break
                      }
                    }
                    if(!verify){
                      out(undefined)
                    }
                  } catch (e) { err(e) }
                })(obj, args[0], args[1], args[2], args[3])
                break
              default:
                err(`new type [(${func})${obj[props]}]`)
                break
            }
          } catch (e) { err(e) }
        })(obj, args[0], args[1], args[2], args[3])
        break
      default:
        err(`новая функция ${func}`)
        break
    }
  })
}
