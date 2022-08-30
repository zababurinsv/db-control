import mongodb from '/static/html/components/component_modules/matcher/matcher/this/database/mongoDb/mongodb.mjs'
export default  (obj, func, ...args)=>{
    return new Promise( function (resolve, reject) {
            let out = (obj) => {
                //console.log('~~~ out router ~~~')
                resolve(obj)
            }
            let err = (error) => {
                console.log('~~~ err router ~~~', error)
                reject(error)
            }
            switch (func) {
                case 'create':
                    (async (obj, props,data) => {
                        try {
                            // console.log(`${obj['input']}[(mongo)${obj[props]}]`)
                            switch (obj[props]) {
                                case 'channel':
                                    out(mongodb['create']({
                                        feed:obj['data'],
                                        id:'news',
                                        object:'feed'
                                    },'channel'))
                                    break
                                case 'bidChanel':
                                    out(mongodb['create']({
                                        feed:obj['data'],
                                        id:'news',
                                        object:'bid'
                                    },'bidChanel'))

                                    break
                                case 'item':
                                    out(mongodb['create']({
                                        item:obj['data'],
                                        id: obj['id'],
                                        object: 'item'
                                    },'item'))
                                    break
                                case 'bid':
                                    out(mongodb['create']({
                                        item:obj['data'],
                                        id: obj['id'],
                                        object: 'item'
                                    },'itemBid'))
                                    break
                                case 'auth':
                                    out(mongodb['create']({
                                        data: {
                                            id:'auth',
                                            auth:obj['data'],
                                            object:'waves'
                                        }
                                    },'auth'))
                                    break
                                default:
                                    console.warn(`необрабатываемый тип запроса`, obj[props])
                                    break
                            }
                        } catch (e) { err(e) }
                    })(obj, args[0], args[1], args[2], args[3])
                    break
                case 'get':
                    (async (obj, props,data) => {
                        try {
                            // console.log(`${func}[(${obj['input']}})${obj[props]}]`)
                            switch (obj[props]) {
                                case 'jsonPhoto':
                                    out(mongodb['get']({
                                        input:'mongodb',
                                        type:'jsonPhoto',
                                    },'type'))
                                    break
                                case 'feeds':
                                    out(mongodb['get']({
                                        input:'mongodb',
                                        type:'feeds',
                                    },'type'))
                                    break
                                case 'bids':
                                    out(mongodb['get']({
                                        input:'mongodb',
                                        type:'bids',
                                    },'type'))
                                    break
                                case 'itemsBid':
                                    out(mongodb['get']({
                                        input:'mongodb',
                                        type:'itemsBid',
                                    },'type'))
                                    break
                                case 'bidItem':
                                    out(mongodb['get']({
                                        input:'mongodb',
                                        type:'bidItem',
                                        id:obj['date']
                                    },'type'))
                                    break
                                case 'items':
                                    out(mongodb['get']({
                                        input:'mongodb',
                                        type:'items',
                                    },'type'))
                                    break
                                case 'item':
                                    out(mongodb['get']({
                                        input:'mongodb',
                                        type:'item',
                                        data: {
                                            id:obj['id']
                                        }
                                    },'type'))
                                    break
                                case 'img':
                                    out(mongodb['get']({
                                        input:'mongodb',
                                        type:'img',
                                        data:obj['data']
                                    },'type'))
                                    break
                                default:
                                    console.warn(`необрабатываемый тип запроса`, obj[props])
                                    break
                            }
                        } catch (e) { err(e) }
                    })(obj, args[0], args[1], args[2], args[3])
                    break
                case 'set':
                    (async (obj, props,data) => {
                        try {
                            // console.log(`${obj['input']}[(mongodb)${obj[props]}]`)
                            switch (obj[props]) {
                                case 'item':
                                    out(mongodb['set']({
                                        input:'mongodb',
                                        type:'item',
                                        data: {
                                            feed:obj['data'],
                                            id:'news',
                                            object:'feed'
                                        }
                                    },'type'))
                                    break
                                case 'auth':
                                    out(mongodb['set']({
                                        input:'mongodb',
                                        type:'auth',
                                        data: {
                                            auth:obj['data'],
                                            id:'waves',
                                            object:'auth'
                                        }
                                    },'type'))
                                    break
                                default:
                                    console.warn(`необрабатываемый тип запроса`, obj[props])
                                    break
                            }
                        } catch (e) { err(e) }
                    })(obj, args[0], args[1], args[2], args[3])
                    break
                case 'update':
                    (async (obj, props,data) => {
                        try {
                            // console.log(`${obj['input']}[(mongodb)${obj[props]}]`)
                            switch (obj[props]) {
                                case 'feed':
                                    // console.assert(false, obj['data'])
                                   let update = await mongodb['set']({
                                        input:'mongodb',
                                        type:'feed',
                                        id: obj['id'],
                                        data: {
                                            feed: obj['data'],
                                            id:'news',
                                            object:'feed'
                                        }
                                    },'type')

                                    out(update)
                                    break
                                case 'bid':
                                    let bid = await mongodb['set']({
                                        input:'mongodb',
                                        type:'bid',
                                        id: obj['id'],
                                        data: {
                                            feed: obj['data'],
                                            id:'bid',
                                            object:'feed'
                                        }
                                    },'type')

                                    out(bid)
                                    break
                                case 'item':

                                    let updateItem = await mongodb['update']({
                                        input:'mongodb',
                                        type:'item',
                                        data: {
                                            item:obj['data'],
                                            id:obj['id'],
                                            object:'item'
                                        }
                                    },'type')

                                    out(updateItem)
                                    break
                                case 'itemBid':
                                    let itemBid = await mongodb['update']({
                                        input:'mongodb',
                                        type:'itemBid',
                                        data: {
                                            item:obj['data'],
                                            id:obj['id'],
                                            object:'item'
                                        }
                                    },'type')

                                    out(itemBid)
                                    break
                                default:
                                    console.warn(`необрабатываемый тип запроса`, obj[props])
                                    break
                            }
                        } catch (e) { err(e) }
                    })(obj, args[0], args[1], args[2], args[3])
                    break
                case 'delete':
                    (async (obj, props,data) => {
                        try {
                            // console.log(`${obj['input']}[(mongodb)${obj[props]}]`)
                            switch (obj[props]) {
                                case 'item':
                                    await mongodb['delete']({
                                        input:'mongodb',
                                        type:'item',
                                        id: obj['id']
                                    },'type')
                                    out({delete:'ok'})
                                    break
                                case 'itemBid':
                                    await mongodb['delete']({
                                        input:'mongodb',
                                        type:'itemBid',
                                        id: obj['id']
                                    },'type')
                                    out({delete:'ok'})
                                    break
                                default:
                                    console.warn(`необрабатываемый тип запроса`, obj[props])
                                    break
                            }
                        } catch (e) { err(e) }
                    })(obj, args[0], args[1], args[2], args[3])
                    break
                case 'post':
                    (async (obj, props,data) => {
                        try {
                            // console.log(`${obj['input']}[(mongodb)${obj[props]}]`)
                            switch (obj[props]) {
                                case 'form':

                                  console.assert(false)
                                    // await mongodb['delete']({
                                    //     input:'mongodb',
                                    //     type:'item',
                                    //     id: obj['id']
                                    // },'type')
                                    // out({delete:'ok'})
                                    break
                                default:
                                    console.warn(`необрабатываемый тип запроса`, obj[props])
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
