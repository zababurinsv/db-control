import Axios from '/static/html/components/component_modules/axios/axios.mjs'
let axios = Axios['default']
import xml  from '/static/html/components/component_modules/bundle/xml/xml.index.mjs'
export default ((v,p,c,s,r) => {
  return new Promise(function (resolve, reject) {
    axios.get('/static/html/components/crypto-dex/external/crypto-dex-external.xml')
      .then(async (concept) => {
        let id = Symbol(concept.data)
        let object = {
          status:true,
          success:true,
          message: {
            [id]: {
              json: await xml['default'].convertToJson(concept.data),
              func: await xml['default'].getTraversalObj(concept.data)
            },
            type:id
          },
          _scriptDir: import.meta.url
        }
        resolve(object)
      })
      .catch(function (e) {
        resolve({
          status:false,
          success:false,
          message: e,
          _scriptDir: import.meta.url
        })
        return e
      })
      .then(function (data) {
        // always executed
      });
  })
})()