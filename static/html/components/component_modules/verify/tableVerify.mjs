import  session from '/static/html/components/component_modules/tableSession/session.mjs'
import indexedDB from '/static/html/components/component_modules/tableIndexedDB/indexedDB.mjs'

export default {
    set:async (obj, type, ...rest)=>{
        return new Promise(async (resolve, reject) => {
            let out = (obj)=>{
                resolve(obj)
            }
            let err = (obj)=>{
                reject(obj)
            }
            switch(obj['type']){
                case 'sessionStorage':
                    (async (obj, type, rest)=>{
                        await session['set']({type:'item', key:`item_${obj['key']}`, value:obj['value']})
                    })(obj, type, rest)
                    out(true)
                    break
                default:
                    err(`новая функция ${obj['type']} `)
                    break
            }
        })
    },
    get:async (obj, type, ...rest)=>{
        return new Promise(async (resolve, reject) => {
            let out = (obj)=>{
                resolve(obj)
            }
            let err = (obj)=>{
                reject(obj)
            }
            switch(obj['type']){
                case 'sessionStorage':
                    (async (obj, type, rest)=>{
                        let storage = Object.keys(sessionStorage)
                        let items = []
                        items['city'] = false
                        items['class'] = false
                        items['dateExperiences'] = false
                        items['description'] = false
                        items['finish'] = false
                        items['geo'] = false
                        items['id'] = false
                        items['metro'] = false
                        items['name'] = false
                        items['object'] = false
                        items['plans'] = false
                        items['price'] = false
                        items['tags'] = false
                        items['type'] = false
                        if(storage.length === 0){
                            for(let key in items){
                                if(key === obj['item']){
                                    session['set']({type:'item', key:`item_${key}`, value: -10})
                                }else{
                                    session['set']({type:'item', key:`item_${key}`, value: -9})
                                }
                            }
                            out(false)
                        }else{
                            let v = false
                            let first = true
                            let itemsObject = {}
                            for(let key in items){
                                if(key === obj['item']){
                                    if(obj['length'] === 0){
                                        session['set']({type:'item', key:`item_${key}`, value: -9})
                                    }else{
                                        session['set']({type:'item', key:`item_${key}`, value: -10})
                                    }
                                }else{
                                    let index = await session['get']({type:'item', key:`item_${key}`})
                                    if(parseInt(index, 10) === -10){
                                        if(first){
                                            switch (key) {
                                                case 'city':
                                                    itemsObject = await indexedDB['get']({type:'index', index: `city`,filter:document.getElementById("search_input_City").value.toLowerCase()})
                                                    break
                                                case 'class':
                                                    itemsObject = await indexedDB['get']({type:'index', index: `class`,filter:document.getElementById("search_input_houseClass").value.toLowerCase()})
                                                    break
                                                case 'dateExperiences':
                                                    itemsObject = await indexedDB['get']({type:'index', index: `dateExperiences`,filter:document.getElementById("search_input_Deadline").value.toLowerCase()})
                                                    break
                                                case 'description':
                                                    itemsObject = await indexedDB['get']({type:'index', index: `description`,filter:document.getElementById("search_input_AdditionalInfo").value.toLowerCase()})
                                                    break
                                                case 'finish':
                                                    itemsObject = await indexedDB['get']({type:'index', index: `finish`,filter:document.getElementById("search_input_Finish").value.toLowerCase()})
                                                    break
                                                case 'geo':
                                                    itemsObject = await indexedDB['get']({type:'index', index: `geo`,filter:document.getElementById("search_input_geo").value.toLowerCase()})
                                                    break
                                                case 'id':
                                                    itemsObject = await indexedDB['get']({type:'id', id:document.getElementById("search_input_id").value.toLowerCase()})
                                                    break
                                                case 'metro':
                                                    itemsObject = await indexedDB['get']({type:'index', index: `metro`,filter:document.getElementById("search_input_Metro").value.toLowerCase()})
                                                    break
                                                case 'name':
                                                    itemsObject = await indexedDB['get']({type:'index', index: `name`,filter:document.getElementById("search_input_Developer").value.toLowerCase()})
                                                    break
                                                case 'object':
                                                    itemsObject = await indexedDB['get']({type:'index', index: `object`,filter:document.getElementById("search_input_Object").value.toLowerCase()})
                                                    break
                                                case 'plans':
                                                    itemsObject = await indexedDB['get']({type:'index', index: `plans`,filter:document.getElementById("search_input_plan").value.toLowerCase()})
                                                    break
                                                case 'price':
                                                    itemsObject = await indexedDB['get']({type:'index', index: `price`,filter:document.getElementById("search_input_price").value.toLowerCase()})
                                                    break
                                                case 'tags':
                                                    break
                                                case 'type':
                                                    itemsObject = await indexedDB['get']({type:'index', index: `type`,filter:document.getElementById("search_input_houseType").value.toLowerCase()})
                                                    break
                                                default:
                                                    console.assert(false, `необрабатываемый запрос ${key}`)
                                                    break
                                            }
                                        }else{
                                            switch (key) {
                                                case 'city':
                                                    itemsObject = await indexedDB['get']({type:'index', index: `city`,filter:document.getElementById("search_input_City").value.toLowerCase()})
                                                    break
                                                case 'class':
                                                    itemsObject = await indexedDB['get']({type:'index', index: `class`,filter:document.getElementById("search_input_houseClass").value.toLowerCase()})
                                                    break
                                                case 'dateExperiences':
                                                    itemsObject = await indexedDB['get']({type:'index', index: `dateExperiences`,filter:document.getElementById("search_input_Deadline").value.toLowerCase()})
                                                    break
                                                case 'description':
                                                    itemsObject = await indexedDB['get']({type:'index', index: `description`,filter:document.getElementById("search_input_AdditionalInfo").value.toLowerCase()})
                                                    break
                                                case 'finish':
                                                    itemsObject = await indexedDB['get']({type:'index', index: `finish`,filter:document.getElementById("search_input_Finish").value.toLowerCase()})
                                                    break
                                                case 'geo':
                                                    itemsObject = await indexedDB['get']({type:'index', index: `geo`,filter:document.getElementById("search_input_geo").value.toLowerCase()})
                                                    break
                                                case 'id':
                                                    itemsObject = await indexedDB['get']({type:'id', id:document.getElementById("search_input_id").value.toLowerCase()})
                                                    break
                                                case 'metro':
                                                    itemsObject = await indexedDB['get']({type:'index', index: `metro`,filter:document.getElementById("search_input_Metro").value.toLowerCase()})
                                                    break
                                                case 'name':
                                                    itemsObject = await indexedDB['get']({type:'index', index: `name`,filter:document.getElementById("search_input_Developer").value.toLowerCase()})
                                                    break
                                                case 'object':
                                                    itemsObject = await indexedDB['get']({type:'index', index: `object`,filter:document.getElementById("search_input_Object").value.toLowerCase()})
                                                    break
                                                case 'plans':
                                                    itemsObject = await indexedDB['get']({type:'index', index: `plans`,filter:document.getElementById("search_input_plan").value.toLowerCase()})
                                                    break
                                                case 'price':
                                                    itemsObject = await indexedDB['get']({type:'index', index: `price`,filter:document.getElementById("search_input_price").value.toLowerCase()})
                                                    break
                                                case 'tags':
                                                    break
                                                case 'type':
                                                    itemsObject = await indexedDB['get']({type:'index', index: `type`,filter:document.getElementById("search_input_houseType").value.toLowerCase()})
                                                    break
                                                default:
                                                    console.assert(false, `необрабатываемый запрос ${key}`)
                                                    break
                                            }
                                        }
                                        if(first){

                                            // console.assert(false, itemsObject)
                                            if(itemsObject === undefined){
                                                first = false
                                            }else{
                                                for(let i =0; i < itemsObject.length;i++){
                                                    session['set']({type:'item', key:`${itemsObject[i]['id']}`, value:JSON.stringify(itemsObject[i])})
                                                }
                                                first = false
                                            }

                                        }else{

                                            if(itemsObject === undefined){
                                                let itemsStorage = await session['get']({type:'all'})
                                                for(let i =0; i < itemsStorage.length;i++){

                                                    session['delete']({type:'item', key:itemsStorage[i]['id']})
                                                }
                                            }else{
                                                let itemsStorage = await session['get']({type:'all'})

                                                for(let i =0; i < itemsStorage.length;i++){
                                                    let verify = false
                                                    for(let j = 0; j < itemsObject.length; j++){
                                                        if(itemsStorage[i]['id'] === itemsObject[j]['id']){
                                                            verify = true
                                                        }
                                                    }
                                                    if(!verify){

                                                        session['delete']({type:'item', key:itemsStorage[i]['id']})

                                                    }
                                                }
                                            }

                                        }
                                        v = true
                                    }
                                }
                            }
                            if(v){
                                out(true)
                            }else{
                                out(false)
                            }
                        }
                    })(obj, type, rest)
                    break
                default:
                    err(`новая функция ${obj['type']} `)
                    break
            }

        })
    },
    put:async (obj, type, ...rest)=>{
        return new Promise(async (resolve, reject) => {
            let out = (obj)=>{
                resolve(obj)
            }
            let err = (obj)=>{
                reject(obj)
            }
            switch(obj['type']){
                case 'getAll':
                    ((obj, type, rest)=>{



                    })(obj, type, rest)
                    break
                default:
                    err(`новая функция ${obj['type']} `)
                    break
            }

        })
    },
    delete:async (obj, type, ...rest)=>{
        return new Promise(async (resolve, reject) => {
            let out = (obj)=>{
                resolve(obj)
            }
            let err = (obj)=>{
                reject(obj)
            }
            switch(obj['type']){
                case 'getAll':
                    ((obj, type, rest)=>{
                        out(sessionStorage.removeItem(obj['key']))
                    })(obj, type, rest)
                    break
                default:
                    err(`новая функция ${obj['type']} `)
                    break
            }

        })
    },
    clearn:async (obj, type, ...rest)=>{
        return new Promise(async (resolve, reject) => {
            let out = (obj)=>{
                resolve(obj)
            }
            let err = (obj)=>{
                reject(obj)
            }
            switch(obj['type']){
                case 'sessionStorage':
                    ((obj, type, rest)=>{
                        let keys =  Object.keys(sessionStorage)
                        for(let i=0; i < keys.length; i++){
                            if(keys[i].split('_').length > 1){

                            }else{
                                session['delete']({type:'item', key:keys[i]})
                            }
                        }
                        out(true)
                    })(obj, type, rest)
                    break
                default:
                    err(`новая функция ${obj['type']} `)
                    break
            }
        })
    }
}