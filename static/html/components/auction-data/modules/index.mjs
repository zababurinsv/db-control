import module from '/static/html/components/component_modules/fs/idbfs.client.mjs'
import blockchain from '/static/html/components/component_modules/api/blockchain/index.mjs'

export default ( self ) => {
  return new Promise( (resolve, reject) => {
    module(async (idbfs) => {
      const body = self.shadowRoot.querySelector('.auction-data__table_body')
      body.innerHTML = ''
      const items = await blockchain.waves.get.tokens('3N8n4Lc8BMsPPyVHJXTivQWs7ER61bB7wQn', 12)
      for(let key in items) {
        await idbfs.set.file(items[key].assetId, items[key]);
      }
      await idbfs.save()
      self.idbfs = idbfs
      resolve(self.isIdbfs = true)
    })
  })
}