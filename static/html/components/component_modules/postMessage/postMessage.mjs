import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import Class from '/static/html/components/component_modules/postMessage/module/class.mjs'
export default (obj = undefined)=>{
    return new Promise( async (resolve, reject) =>{
        let object = {}
        object.staticProperty = {}
        object.staticProperty.class = {}
        let out = (obj) => {
            resolve(obj)
        }
        let err = (error) => {
            reject(error)
        }
        try {
            if(obj === undefined){
                console.assert(false,'Что бы объявить класс надо указать откуда он будет ждать сообщение' )
                err({
                    _:'type',
                    error:'Что бы объявить класс надо указать откуда он будет ждать сообщение'
                })
            }else{
                object.staticProperty.class[`${obj}`] = {}
                object.staticProperty.class[`${obj}`] = new Class(obj)
                out(object.staticProperty.class[`${obj}`])
            }

        }catch (e) {
            err({
                _:'type',
                error:e
            })
        }

    })
}
