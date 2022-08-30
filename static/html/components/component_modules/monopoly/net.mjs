let object = {}
export default (obj)=>{
    return new Promise(function (resolve, reject) {
        let out = (obj) => {

            resolve(obj)

        }
        let err = (error) => {

            console.log('~~~ err ~~~', error)

            reject(error)
        }

        switch (obj['_']) {
            case 'launch':
                (async (obj)=>{
                    console.log('launch')
                })(obj)
                break
            default:
                console.warn('неизвестный метод', obj['_'], '---->', obj)
                break
        }


        resolve(obj)
    })
}