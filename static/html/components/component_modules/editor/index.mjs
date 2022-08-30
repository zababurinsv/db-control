import store from '/static/html/components/component_modules/store/index.mjs'
import quill from '/static/html/components/component_modules/editor/init.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'

export default (obj) => {
    return new Promise( async (resolve, reject) => {
        try {
            if(isEmpty(obj.slot)) {
                reject('должен быть указан слот')
            } else {
                let verify = await  store.get.editor({
                    input: 'editor',
                    this: obj['this'],
                    target: obj['slot'],
                    type: 'editor'
                })
                // console.assert(false, verify)
                if(isEmpty(verify)) {
                    if(isEmpty(obj['slot'])) {
                        console.log('~~~~~ должен быть объект slot ~~~~~')
                        resolve('должен быть объект slot')
                    } else {
                        resolve(await quill({
                            type: 'editor',
                            input: 'editor',
                            this: obj['this'],
                            slot: obj['slot'],
                            parent: obj['parent'],
                            menu: obj['menu']
                        }))
                    }
                } else {
                    resolve(obj)
                }
            }
        } catch (e) { reject(e) }
    })
}
