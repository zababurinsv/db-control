function connect(obj, callback) {
    return new Promise(async (resolve, reject) => {
        if (!window.indexedDB) {
            window.alert("Ваш браузер не поддерживат стабильную версию IndexedDB. Такие-то функции будут недоступны");
        }else{
            let db = {}
            // console.assert(false, obj)
            db['name'] = obj['name']
            db['version'] = obj['version']
            try {
                db['request'] = window.indexedDB.open(`${obj['name']}`, `${obj['version']}`);

            }catch (e) {

                console.assert(false)
            }

            db['request'].onsuccess = function (event) {

                // console.assert(false, callback)
                callback(db['request'].result)
                // db = this.result;
                // resolve(db)
            };
            db['request'].onerror = function (event) {
                // reject(evt.target.errorCode)
            };

            db['request'].onupgradeneeded = function(event) {

                switch (obj['name']) {
                    case'mirrors':
                        db['db'] = event.target.result;
                        db['objectStore'] = db['db'].createObjectStore("mirrors", { keyPath: "assetId" });
                        db['objectStore'].createIndex("assetId", "assetId", { unique: false });
                        db['objectStore'].createIndex("name", "name", { unique: false });
                        db['objectStore'].createIndex("description", "description", { unique: false })
                        db['objectStore'].createIndex("timestamp", "timestamp", { unique: false })
                        db['objectStore'].createIndex("sender", "sender", { unique: false })
                        db['objectStore'].createIndex("proofs", "proofs", { unique: false })
                        db['objectStore'].createIndex("timestampUpdate", "timestampUpdate", { unique: false })
                        if(obj['data']){
                            for (let i in obj['data']) {
                                db['objectStore'].add(obj['data'][i]);
                            }
                        }
                        break
                    case'dictionary':
                        db['db'] = event.target.result;
                        db['objectStore'] = db['db'].createObjectStore("dictionary", {autoIncrement:true});
                        if(obj['data']){
                            for (let i in obj['data']) {
                                db['objectStore'].add(obj['data'][i]);
                            }
                        }
                        break
                    default:
                        console.assert(false, 'не найден подходящий объект --->', obj['name'])
                        break
                }
                resolve(db)
            };
        }
    })
}

export default {
    get:async (obj, type, ...rest)=>{
        return new Promise(async (resolve, reject) => {
            let out = (obj)=>{
                resolve(obj)
            }
            let err = (obj)=>{
                reject(obj)
            }
            switch(obj['type']){
                case 'dictionary':
                   await (async (obj, type, rest)=>{
                        await connect({name:'dictionary', version: 1, data:obj['data'] },async (db)=>{
                            let object = []
                            db.transaction(['dictionary'], "readwrite").objectStore('dictionary').openCursor().onsuccess = (e)=>{
                                let cursor = e.target.result;
                                if (cursor) {
                                    object.push(cursor['value'])
                                    cursor.continue();
                                }
                                else {
                                    out(object)
                                }
                            }
                        })
                    })(obj, type, rest)
                    break
                case 'id':
                   await (async (obj, type, rest)=>{ await connect({name:'mirrors', version: 1 },async (db)=>{
                        // console.assert(false, obj['id'].length)
                        let object = []
                        if(obj['id'].length === 0 ){

                            db.transaction(['mirrors'], "readwrite").objectStore('mirrors').openCursor().onsuccess = (e)=>{
                                let cursor = e.target.result;
                                if (cursor) {
                                    object.push(cursor['value'])
                                    cursor.continue();
                                }
                                else {
                                    out(object)
                                }
                            }
                        }else{
                            db.transaction(['mirrors'], "readwrite").objectStore('mirrors').get(obj['id']).onsuccess = (e)=>{
                                // console.log(e['target'].result)
                                out(e['target'].result)
                            }
                        }
                    })
                    })(obj, type, rest)
                    break
                case 'getAll':
                   await (async (obj, type, rest)=>{

                        await connect({name:'mirrors', version: 1 },async (db)=>{
                            let object = []

                            db.transaction(['mirrors'], "readwrite").objectStore('mirrors').openCursor().onsuccess = (e)=>{
                                let cursor = e.target.result;
                                if (cursor) {
                                    object.push(cursor['value'])
                                    cursor.continue();
                                }
                                else {
                                    out(object)
                                }
                            }
                        })
                    })(obj, type, rest)
                    break
                case 'index':
                   await (async (obj, type, rest)=>{ await connect({name:'mirrors', version: 1 },async (db)=>{
                        let index =    db.transaction(['mirrors'], "readwrite").objectStore('mirrors').index(`${obj['index']}`)
                        let object = []
                        if(obj['index'] === 'price'){
                            index.openCursor().onsuccess = function(event) {
                                let cursor = event.target.result;
                                if (cursor) {
                                    let template = cursor['key'].split(',')
                                    let verify = false
                                    const regEx = /[^\d\.\' ']/g;
                                    for(let i =0; i < template.length;i++){
                                        let temp  =  template[i].replace(regEx, '')
                                        temp = temp.replace(/^\s+/g, '')
                                        temp = temp.split(' ')
                                        temp = temp[0]
                                        temp = parseFloat(temp)
                                        let float = parseFloat(obj['filter'])
                                        if(isNaN(temp)){
                                            verify = true
                                            // console.assert(false)
                                            // object.push(cursor['value'])
                                        }else{

                                            if(isNaN(float)){

                                                verify = true

                                            }else{
                                                if(float >= temp){
                                                    verify = true

                                                    // console.assert(false)
                                                    // object.push(cursor['value'])
                                                }
                                            }

                                        }
                                    }

                                    if(verify){
                                        object.push(cursor['value'])
                                    }
                                    cursor.continue();
                                } else {
                                    out(object)

                                }
                            }
                        }else if (obj['index'] === 'city'){
                            let index =    db.transaction(['mirrors'], "readwrite").objectStore('mirrors').index(`${obj['index']}`)
                            let object = []
                            index.openCursor().onsuccess = function(event) {
                                let cursor = event.target.result;
                                if (cursor) {
                                    if(parseInt(obj['filter'], 10) === 0){
                                        object.push(cursor['value'])
                                    }else{
                                        if(parseInt(cursor['key'], 10) === parseInt(obj['filter'], 10)){
                                            object.push(cursor['value'])
                                        }
                                    }
                                    cursor.continue();
                                } else {
                                    out(object)
                                }
                            }
                        }else{
                            index.openCursor().onsuccess = function(event) {
                                let cursor = event.target.result;
                                if (cursor) {
                                    // console.log('~~~~~~~~~~~~~~~~!!!!!~~~~~~~~~~~~~~~~~~',     console.assert(false, object))
                                    if( cursor['key'].toLowerCase().indexOf(obj['filter'].toLowerCase()) > -1){

                                        object.push(cursor['value'])
                                    }
                                    cursor.continue();
                                } else {

                                    // console.assert(false, object)
                                    out(object)

                                }
                            }
                        }
                    })
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
                case 'data':
                   await (async (obj, type, rest)=>{
                        let data = await fetch('http://dev.work/api/item',{method: 'GET' }).then(obj => { return obj.json()})
                        await connect({name:'mirrors', version: 1 },async (db)=>{
                            for (let i in data) {
                                db.transaction(['mirrors'], "readwrite").objectStore('mirrors').put(data[0]).onsuccess = (e)=>{
                                    if(data.length -1 == i){
                                        out(true)
                                    }
                                }
                            }
                        })
                    })(obj, type, rest)
                    break
                case 'item':
                   await (async (obj, type, rest)=>{
                        await connect({name:'mirrors', version: 1 },async (db)=>{
                            db.transaction(['mirrors'], "readwrite").objectStore('mirrors').put(obj['value']).onsuccess = (e)=>{
                                out(true)
                            }
                        })
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
                case 'test':
                    (async (obj, type, rest)=>{
                        await connect({name:'mirrors', version: 1 },async (db)=>{
                            (db.transaction(['mirrors'], "readwrite").objectStore('mirrors').delete('144')).onsuccess = (e)=>{

                                console.log(e['target'].result)
                                out(true)
                            }
                        })
                    })(obj, type, rest)
                    break
                default:
                    err(`новая функция ${obj['type']} `)
                    break
            }

        })
    },
    set:async (obj, type, ...rest)=>{
        return new Promise(async (resolve, reject) => {
            let out = (obj)=>{
                resolve(obj)
            }
            let err = (obj)=>{
                reject(obj)
            }
            switch(obj['type']){
                case 'dictionary':
                    (async (obj, type, rest)=>{
                        await connect({name:'dictionary', version: 1, data:obj['data'] },async (db)=>{ out(true) })
                    })(obj, type, rest)
                    break
                default:
                    err(`новая функция ${obj['type']} `)
                    break
            }

        })
    }
}