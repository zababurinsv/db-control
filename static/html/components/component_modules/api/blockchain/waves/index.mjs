// import Waves from '/static/html/components/component_modules/waves/index.mjs'
import waves from '/static/html/components/component_modules/waves/new/index.mjs'
// import actions from '/static/html/components/component_modules/relation/waves.mjs'
// import emoji from '/static/html/components/component_modules/emoji/emoji.mjs';
// import events from '/static/html/components/component_modules/CustomEvent/index.mjs'
// let waves = new Waves()
// console.log('dddddddddddddddddd',  waves.getNft('3N8n4Lc8BMsPPyVHJXTivQWs7ER61bB7wQn', 12))
// console.assert(false)
export default {
  get:{
    tokens: (address='', limit=12, after= undefined) => {
      return new Promise(async (resolve, reject) => {
        let nft = (await waves.get.nft(address, limit, after)).message
        let items = []
        for(let item of nft){
          items.push({
            assetId: item.assetId,
            name: item.name,
            description: item.description,
            timestamp: item.timestamp,
            sender: item.sender,
            proofs: JSON.stringify(item.proofs)
          })
        }
        resolve(items)
      })
    },

    token: (address='', limit=12, after='', search='') => {
      return new Promise(async (resolve, reject) => {
        let nft = await waves.get.nft('3N8n4Lc8BMsPPyVHJXTivQWs7ER61bB7wQn', 12)
        let object = {}
        for(let key in nft.message) {
          try {
            if(nft.message[key].description.indexOf('Olga Gavrilova') !== -1) {
              object = nft.message[key]
              break
            }
          } catch (e) {
            console.log('waves error', e)
          }
        }
        console.log('использовались customEvents  отобразить данные на странице')
        // await customEvents(true, 'отобразить данные на странице','3',object,'objectPlayer')
        resolve(object)
      })
    }
  }
}