import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import task from '/static/html/components/component_modules/heap/index.mjs'
import config from '/static/html/components/component_modules/account/com.waves-ide_config.mjs'
import database from '/static/html/components/component_modules/storage/module/index.mjs'

let object = {}
object.staticProperty = {}
object.staticProperty.class = undefined
export let store = ((obj = {_:'type'}) => {
    return new Promise( async (resolve, reject) => {
      let Class = class store {
            constructor() {
                this.set = this.set.bind(this)
                task.get(true, 'await', '5', '','/storage/set/item',async (object)=>{
                    await database.set(object.view, object.relation, object.color, object.substrate, object.property)
                    return    object.callback(object)
                })

                task.get(true, 'await', '5', '','/storage/get/all',async (object)=>{
                    return object.callback(await database.get(object.view, object.relation, object.color, object.substrate, object.property))
                })

                task.get(true, 'await', '5', '','/storage/get/item',async (object)=>{
                    await database.get(object.view, object.relation, object.color, object.substrate, object.property)
                    return  object.callback(object)
                })

                task.get(true, 'await', '5', '','/storage/update/item', async (object)=>{
                    await database.update(object.view, object.relation, object.color, object.substrate, object.property)
                    return  object.callback(object)
                })

                task.get(true, 'await', '5', '','/storage/delete/item', async (object)=>{
                    await database.delete(object.view, object.relation, object.color, object.substrate, object.property)
                    return   object.callback(object)
                })

                task.get(true, 'await', '5', '','/storage/delete/all', async (object)=>{
                    await database.delete(object.view, object.relation, object.color, object.substrate, object.property)
                    return   object.callback(object)
                })
                task.get(true, 'await', '5', '','/storage/delete/all/items', async (object)=>{
                    await database.delete(object.view, object.relation, object.color, object.substrate, object.property)
                    return   object.callback(object)
                })
            }
            set(v,p,c,obj,r) {
                return task.set(v,p,c,obj,'/storage/set/item')
            }
        }
        resolve(isEmpty(object.staticProperty.class)
          ? object.staticProperty.class = new Class()
          : object.staticProperty.class)

    })
})();
export default 'zb'
