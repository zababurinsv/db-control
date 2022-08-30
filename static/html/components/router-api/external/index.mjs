import matcher from '/static/html/components/router-api/external/matcher.mjs'
import config from '/static/html/components/component_modules/account/com.waves-ide_config.mjs'
import Waves from '/static/html/components/component_modules/waves/index.mjs'
import task from '/static/html/components/component_modules/heap/index.mjs'
let waves = new Waves
export default (()=> {
  console.log('# node')

  task.get(true, 'await', '5', '','/addresses/balance/{address}', async (event)=>{
    let object = event;
    let balance = await waves.balance(true, 'test', '3', object.substrate.substrate, object.substrate.relation)
    object.callback(balance)
  })

  task.get(true, 'await', '5', '','/assets/details/{assetId}', async (object)=>{
    let orders = await waves.details(object.view,object.property, object.color, object.substrate, object.relation)
    object.callback(orders)
  })

  task.get(true, 'await', '5', '','/assets/signature/{assetId}', async (object)=> {
    let bigNum = new waves.self.bigNumber(object.substrate.timestamp);
    let result = bigNum.toBytes();
    let concat = waves.self.concat(object.substrate.publicKey, result)
    let signature = waves.self.signBytes(object.substrate.seed, concat , 0)
    object.callback(signature)
  })
})()