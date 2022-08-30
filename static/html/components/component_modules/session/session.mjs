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
                case 'item':
                    ((obj, type, rest)=>{
                        out(sessionStorage.setItem(obj['key'], obj['value']));
                    })(obj, type, rest)
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
                case 'item':
                    ((obj, type, rest)=>{
                        out(sessionStorage.getItem(obj['key']));
                    })(obj, type, rest)
                    break
                case 'all':
                    ((obj, type, rest)=>{
                        let keys =  Object.keys(sessionStorage)
                        let storage = []
                        for(let i=0; i < keys.length; i++){
                            if(keys[i].split('_').length > 1){
                            }else{
                                storage.push(JSON.parse(sessionStorage.getItem(keys[i])))
                            }
                        }
                        out(storage);
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
                case 'item':
                    ((obj, type, rest)=>{
                        out(sessionStorage.removeItem(obj['key']))
                    })(obj, type, rest)
                    break
                default:
                    err(`новая функция ${obj['type']} `)
                    break
            }

        })
    }
}