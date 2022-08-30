import staticProperty from '/static/html/components/component_modules/staticProperty/staticProperty.mjs'
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
            case 'set':
                (async (obj, props,data) => {
                    try {
                        // console.log(`app(${func}[(${obj['input']})${obj[props]}]property)`)
                        switch (obj[props]) {
                            case 'admin':
                                (async (obj, props,data) => {
                                    try {

                                        let store =  await staticProperty({
                                            input:'action',
                                            type: 'all'
                                        }, 'get', 'type')

                                        let left = obj['data'].querySelector('lacerta-left')
                                        left.style.position = 'absolute'
                                        left.style.top = '-4vw'
                                        left.style.left = '10vw'
                                        left.style.transform = "scale(0.7)"

                                        let right = obj['data'].querySelector('lacerta-right')
                                        right.style.position = 'absolute'
                                        right.style.top = '-6vw'
                                        right.style.left = '-5vw'
                                        right.style.transform = "scale(0.7)"

                                        // console.assert(false, obj['data'])

                                        out(obj)
                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])
                                break
                            default:
                                err(`new type ${func}`)
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
