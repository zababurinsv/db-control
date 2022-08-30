//https://medium.com/@dimko1/%D0%B0%D0%BB%D0%B3%D0%BE%D1%80%D0%B8%D1%82%D0%BC%D1%8B-%D0%BE%D0%B1%D1%85%D0%BE%D0%B4-%D0%B4%D0%B5%D1%80%D0%B5%D0%B2%D0%B0-ed54848c2d47
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import Class from '/static/html/components/component_modules/recursion/module/class.mjs'
export default (obj = {_:'type'})=>{
    return new Promise( async (resolve, reject) =>{
        let object = {}
        object.staticProperty = {}
        object.staticProperty.class = undefined
        let out = (obj) => {
            resolve(obj)
        }
        let err = (error) => {
            reject(error)
        }
        try {
            object['class'] = ()=>{
                if(isEmpty(object.staticProperty.class)){ object.staticProperty.class = new Class() }
                return object.staticProperty.class
            }
            if(isEmpty(object.staticProperty.class)){ object.staticProperty.class = new Class() }
            out(object.staticProperty.class)
        }catch (e) {
            err({
                _:'type',
                error:e
            })
        }

    })
}
