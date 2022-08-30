(()=>{

    if (!Object.keys) {
        Object.keys = function (o) {
            if (o !== Object(o)) { throw new TypeError('Object.keys called on a non-object') }
            var k = []; var p
            for (p in o) if (Object.prototype.hasOwnProperty.call(o, p)) k.push(p)
            return k
        }
    }

})()
import init from '/static/html/components/component_modules/init/init.mjs'
import store from '/static/html/components/component_modules/staticProperty/staticProperty.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
export default  (obj, func, ...args)=>{
    return new Promise( function (resolve, reject) {
            let out = (obj) => {
                resolve(obj)
            }
            let err = (error) => {
                console.log('~~~ err  ~~~', error)
                reject(error)
            }
            switch (func) {
                case 'get':
                    (async (obj, props,data) => {
                        try {
                            // console.log(`app(${func}[(${obj['input']})${obj[props]}]property)`)
                            switch (obj[props]) {
                                case 'editor':
                                  await (async (obj, props,state, server) => {
                                        try {
                                            console.log(`app(${func}[(${obj['input']})${obj[props]} ditor]`)
                                            if(isEmpty(obj.slot)) {
                                                err('должен быть указан слот')
                                            }

                                            let verify = await store({
                                                input:'editor',
                                                this: obj['this'],
                                                target:obj['slot'],
                                                type: 'editor'
                                            },'get', 'type' )

                                            // console.assert(false, verify)
                                            if(isEmpty(verify)){


                                                if(isEmpty(obj['slot'])){
                                                    err('должен быть объект slot')
                                                }
                                                let editor = await init({
                                                    input:'editor',
                                                    this: obj['this'],
                                                    slot: obj['slot'],
                                                    parent: obj['parent'],
                                                    menu:obj['menu'],
                                                    type:'editor'
                                                }, 'init', 'type')

                                                out(editor)

                                            }else{


                                                out(obj)

                                            }
                                        } catch (e) { err(e) }
                                    })(obj, args[0], args[1], args[2], args[3])
                                    break
                                default:
                                    err(`new type ${obj[props]}`)
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
