import waves from '/static/html/components/component_modules/bundle/waves/waves.index.mjs'
import config from '/static/html/components/component_modules/account/com.waves-ide_config.mjs'
import Axios from '/static/html/components/component_modules/axios/axios.mjs'
let axios = Axios['default']

let system = {
  net: 'W',
  wvs: 10 ** 8
}

const getNFT = (address='', limit = 1, after = undefined, type = 'T') => {
  return new Promise(async (resolve, reject)=>{
    try {
      let balance = {}
      if(after === undefined){
        balance = await fetch(`${config[`${type}`][0]}/assets/nft/${address}/limit/${limit}`)
      }else{
        balance = await fetch(`${config[`${type}`][0]}/assets/nft/${address}/limit/${limit}?after=${after}`)
      }

      resolve({
        _scriptDir: import.meta.url,
        status: 'ok',
        success: true,
        message: await balance.json()
      })
    } catch(e) {
      resolve({
        _scriptDir: import.meta.url,
        status: false,
        success: false,
        message: e
      })
    }
  })
}

export default {
  get: {
    nft: getNFT
  },

  set: {

  },

  create: {

  },

  update: {

  },

  transfer: {

  }
}