function setFile (obj) {
  return new Promise(function (resolve, reject) {

  })
}
function delFile (obj) {
  return new Promise(function (resolve, reject) {
  })
}
function getFile (obj) {
  return new Promise(function (resolve, reject) {
    resolve(asset['default']['asset']['$children'][0]['$children'][0]['get'](obj['firebase']['component']))
  })
}
function updFile (obj) {
  return new Promise(function (resolve, reject) {
    resolve(asset['default']['asset']['$children'][0]['$children'][0]['update'](obj['firebase']['component']))
  })
}

export default {
  delFile: (obj) => { return delFile(obj) },
  setFile: (obj) => { return setFile(obj) },
  getFile: (obj) => { return getFile(obj) },
  updFile: (obj) => { return updFile(obj) }

}
