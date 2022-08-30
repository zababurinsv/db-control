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
                            case 'scroll':
                                (async (obj, props,data) => {
                                    try {
                                       out(window.addEventListener('scroll', async (event)=>{

                                           var scrolled = window.pageYOffset || document.documentElement.scrollTop;

                                           var centerX = document.documentElement.clientWidth / 2;
                                           var centerY = document.documentElement.clientHeight * 0.649;

                                           let scroll = obj['this']

                                           if(!scroll){}else{
                                               if(scrolled > 350){
                                                   scroll.style.display = 'flex'
                                               }else{
                                                   scroll.style.display = 'none'
                                               }
                                           }


                                           var elem = document.elementFromPoint(centerX, centerY);

                                           // console.log(elem.shadowRoot.elementFromPoint(centerX, centerY))
                                           // console.log(elem, centerX,centerY,  scrolled)



                                       }, false))
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
