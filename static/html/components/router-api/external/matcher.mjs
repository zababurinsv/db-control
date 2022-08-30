import Waves from '/static/html/components/component_modules/waves/index.mjs'
import task from '/static/html/components/component_modules/heap/index.mjs'
import config from '/static/html/components/component_modules/account/com.waves-ide_config.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
let waves = new Waves

export default (()=> {
  console.log('# matcher')
  task.get(true, 'await', '5', '','/matcher/orderbook/{publicKey}',async (event)=>{
      let object = event;
      let orders = await waves.getOrders(true, {
        timestamp:object.property.timestamp,
        signature:object.property.signature,
        type:object.property.type
      }, '3', object.substrate.publicKey,`${object.substrate.relation}`)
      object.callback({
        status: orders.status,
        success: orders.success,
        message: orders.message,
        _scriptDir: import.meta.url
      })
    })

  task.get(true, 'await', '5', '','/matcher',async (object)=>{
    let publickKey = await waves.matcher(true, object.property, '3', object.substrate.substrate, object.substrate.relation)
    object.callback(publickKey)
  })

  task.get(true, 'await', '5', '','/matcher/settings',async (object)=>{
    let settings = await waves.settings(true, object.property, '3', object.substrate.substrate, object.substrate.relation)
    object.callback(settings)
  })

  task.get(true, 'await', '5', '','/matcher/orderbook/cancel', async (object) => {
    let orders = await waves.cancelAllOrders(true, object.property, '3', object.substrate, object.property)
    object.callback(orders)
  })

  task.get(true, 'await', '5', '','/matcher/orders/cancel/{orderId}', async (object) => {
    let orders = await waves.cancelAllOrders(true, object.property, '3', object.substrate, object.property)
    object.callback(orders)
  })

  task.get(true, 'await', '5', '','/matcher/get/order',async (object)=>{
    let seed = 'tone leg hidden system tenant aware desk clap body robust debris puppy ecology scan runway thing second metal cousin ocean liberty banner garment rice feel'
    let response = await waves.order(true,object.property,'red', object.substrate, seed)
    // console.assert(false, response)
    response = JSON.stringify(response)
    object.callback(response)
  })

  function matcher_orderbook(object, item, assets, orderType, relation) {
   let amount = waves.amountNormalize(object.substrate.description[item].amount_reverse, object.substrate.decimals[`${assets[1]}`])
    let price = waves.normalize(object.substrate.description[item].price,object.substrate.decimals[`${assets[0]}`],object.substrate.decimals[`${assets[1]}`])
    return {
      assets: {
        amountAsset: object.substrate.assets[object.property][`${assets[0]}`],
        priceAsset:  object.substrate.assets[object.property][`${assets[1]}`]
      },
      matcherPublicKey: object.substrate.head.matcherPublicKey,
      amount: amount,
      price: price,
      orderType:orderType
    }
  }
  task.get(true, 'await', '5', '','/matcher/orderbook',async (object) => {
    try {
      let keys = Object.keys(object.substrate.description)
      let set = {
        accept: [],
        abort: []
      }
      switch (object.substrate.head.name) {
        case 'wuw':
          let buy__euroWaves = {}
          let sell__euroUsd = {}
          let buy__wavesUsd = {}
          for( let item of keys) {
            if(item === 'buy(euroWaves)') {
              buy__euroWaves = await waves.order(true, object['property'] , '3',matcher_orderbook(object, item, ['eth', 'waves'], 'buy', true), object['relation'])
            } else if( item === 'sell(euroUsd)' ) {
              sell__euroUsd = await waves.order(true, object['property'] , '3',matcher_orderbook(object, item, ['usdt', 'eth'], 'sell'), object['relation'])
            } else if( item === 'buy(wavesUsd)' ) {
              buy__wavesUsd =  await waves.order(true, object['property'] , '3',matcher_orderbook(object, item, ['usdt', 'waves'], 'buy'), object['relation'])
            } else {
            console.assert(false, {
              _scriptDir: import.meta.url,
              message: `неизвестный тип ${item}`
            })
            object.callback({
                status: `неизвестный тип ${item}`,
                success: false,
                message: {
                  buy__euroWaves: buy__euroWaves,
                  sell__euroUsd: sell__euroUsd,
                  buy__wavesUsd: buy__wavesUsd
                },
                _scriptDir: import.meta.url
            })
            }
          };
          (buy__euroWaves.success)
          ? set.accept.push(buy__euroWaves)
          : (buy__euroWaves.message = buy__euroWaves.message.response.data,
             buy__euroWaves.status = buy__euroWaves.message.status,
             set.abort.push(buy__euroWaves));
          (sell__euroUsd.success)
          ? set.accept.push(sell__euroUsd)
          : (sell__euroUsd.message = sell__euroUsd.message.response.data,
             sell__euroUsd.status = sell__euroUsd.message.status,
             set.abort.push(sell__euroUsd));
          (buy__wavesUsd.success)
          ? set.accept.push(buy__wavesUsd)
          : (buy__wavesUsd.message = buy__wavesUsd.message.response.data,
             buy__wavesUsd.status = buy__wavesUsd.message.status,
             set.abort.push(buy__wavesUsd));
          break
        default:
          console.warn({
            status: 'no true',
            success: false,
            message: `неизвестный тип ${object.substrate.description}`,
            _scriptDir: import.meta.url
          })
          break
      }
      if(isEmpty(set.abort)) {
        object.callback({
          status: 'ok',
          success: true,
          message: {
            id: '',
            case: set.accept
          },
          _scriptDir: import.meta.url
        })
      } else {
        object.callback({
          status: 'set_false',
          success: false,
          message: {
            id: '',
            true: set.accept,
            false: set.abort
          },
          _scriptDir: import.meta.url
        })
      }
    } catch (e) {
      object.callback({
        status: 'no ok',
        success: false,
        message: e,
        _scriptDir: import.meta.url
      })
    }
  })
})()