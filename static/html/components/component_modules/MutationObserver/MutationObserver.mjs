export default  (obj, func, ...args)=>{
    return new Promise( function (resolve, reject) {
        let out = (obj) => {
            // console.log('~~~ out  ~~~')
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
                            case 'nav':
                                (async (obj, props,data) => {
                                    try {

                                        console.assert(false, obj['target'])
                                        let config = { attributes: true, childList: true, characterData: true }
                                        let target = obj['target']
                                        let observer = new MutationObserver(function (mutations) {
                                            mutations.forEach(function (mutation) {
                                                // console.log(mutation.type)
                                                switch (mutation.type) {
                                                    case 'childList':

                                                        break
                                                    default:
                                                        break
                                                }
                                            })
                                        })
                                        observer.observe(target, config)
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
