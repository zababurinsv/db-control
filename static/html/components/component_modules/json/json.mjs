import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import Class from '/static/html/components/component_modules/json/module-class.mjs'
let object = { }
object.staticProperty = {}
object.staticProperty.class = undefined
export default (view = true)=>{
    return new Promise( async (resolve, reject) =>{
        let out = (obj) => {
            // console.log('~~~ out  ~~~', obj['input'])
            resolve(obj)
        }
        let err = (error) => {
            console.log('~~~ err ~~~', error)
            reject(error)
        }
        if(typeof view !== 'boolean'){console.assert(false, 'значение для вывода на консоль должно быть true/false')}
        object['class'] = (view = true)=>{
            if(typeof view !== 'boolean'){console.assert(false, 'значение для вывода на консоль должно быть true/false')}
            if(isEmpty(object.staticProperty.class)){ object.staticProperty.class = new Class(view) }
            return object.staticProperty.class
        }
        if(isEmpty(object.staticProperty.class)){
            object.staticProperty.class = new Class(view)
        }
        object.staticProperty.class.view = view
        out(object.staticProperty.class)
    })
}
