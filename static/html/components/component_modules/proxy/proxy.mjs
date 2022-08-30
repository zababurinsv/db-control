import store from '../../../../../../static.frontend/static/html/components/component_modules/staticProperty/staticProperty.mjs'
let handler = {
    get: function(obj, prop) {
        console.log('~~~!!!~~~',obj, prop)

        return obj[prop];
    },
    set: function(obj, prop, value) {
        obj[prop] = value;
        console.log('~~~!0!~~~',obj[prop], value)
        switch (prop) {
            case 'delete':

                break
            case 'create':

                break
            case 'update':

                break
            default:
                break
        }
        return true
    }
}
export default  (obj, func, ...args)=>{
    return new Promise( function (resolve, reject) {
        let out = (obj) => {
            console.log('~~~ out  ~~~')
            resolve(obj)
        }
        let err = (error) => {
            console.log('~~~ err  ~~~', error)
            reject(error)
        }
        switch (func) {
            case 'init':
                (async (obj, props,data) => {
                    try {
                        console.log(`app(${func}[(${obj['input']})${obj[props]}]property)`)
                        switch (obj[props]) {
                            case 'queue':
                                (async (obj, props,data) => {
                                    try {
                                        let task = await  store({
                                            input:'proxy',
                                            type:'queue'
                                        },'proxy', 'type')
                                        task = new Proxy(task, handler)
                                        out(task)
                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])
                                break
                            default:
                                err(`new type [(${func})${obj[props]}]`)
                                break
                        }
                    } catch (e) { err(e) }
                })(obj, args[0], args[1], args[2], args[3])
                break
            default:
                err(`new function ${func}`)
                break
        }
    })
}
