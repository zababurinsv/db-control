import action from '/static/html/components/component_modules/action/action.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
let queue = {}
queue.staticProperty = []

let handler = {
    get: function(obj, prop) {
        // console.log('~~~!!!~~~',obj, prop)

        return obj[prop];
    },
    set: function(obj, prop, value) {
            obj[prop] = value;
            switch (prop) {
                case 'length':
                    if(obj.length === 1){
                        let timerId = setTimeout(async function tick() {
                            console.log('~~~~~input~~~~~~')
                            if(obj.length === 0){
                                console.log('end~~~~~~~~~~~')
                                clearTimeout(timerId);
                            }else{
                                switch (obj[0]['task']['type']) {
                                    case 'delete':
                                        if(!obj[0]['name']){
                                            obj[0]['name'] = 'default'
                                        }
                                        switch (obj[0]['name']) {
                                            case 'bid':
                                                await action({
                                                    input:'static-property',
                                                    date:obj[0]['task']['date'],
                                                    remove:obj[0]['task']['remove'],
                                                    type:'bid'
                                                }, 'delete', 'type')
                                                break
                                            default:
                                                await action({
                                                    input:'static-property',
                                                    date:obj[0]['task']['date'],
                                                    remove:obj[0]['task']['remove'],
                                                    type:'news'
                                                }, 'delete', 'type')
                                                break
                                        }
                                        break
                                    case 'create':
                                        let convert = new CustomEvent('convertAction', {
                                            detail: {
                                                data: obj[0]['task']['data']
                                            }
                                        })
                                        document.dispatchEvent(convert)
                                        break
                                    case 'update':
                                        if(!obj[0]['name']){
                                            obj[0]['name'] = 'default'
                                        }
                                        switch (obj[0]['name']) {
                                            case 'bid':
                                                action({
                                                    button: obj[0]['task']['button'],
                                                    input:'varan-card-news',
                                                    this: obj[0]['task']['this'],
                                                    date:obj[0]['task']['date'],
                                                    type:'bid'
                                                }, 'update', 'type')
                                                break
                                            default:
                                                action({
                                                    button: obj[0]['task']['button'],
                                                    input:'lacerta-news',
                                                    this: obj[0]['task']['this'],
                                                    date:obj[0]['task']['date'],
                                                    type:'news'
                                                }, 'update', 'type')
                                                break
                                        }

                                        break
                                    case 'updateAction':
                                        if(!obj[0]['name']){
                                            obj[0]['name'] = 'default'
                                        }
                                        let updateAction ={}
                                        switch (obj[0]['name']) {
                                            case 'bid':
                                                 updateAction = new CustomEvent('updateAction', {
                                                    detail: {
                                                        date: obj[0]['task']['date'],
                                                        data: obj[0]['task']['update'],
                                                        name:'bid'
                                                    }
                                                })
                                                document.dispatchEvent(updateAction)
                                                break
                                            default:
                                                 updateAction = new CustomEvent('updateAction', {
                                                    detail: {
                                                        date: obj[0]['task']['date'],
                                                        data: obj[0]['task']['update'],
                                                        name:'news'
                                                    }
                                                })
                                                document.dispatchEvent(updateAction)
                                                break
                                        }

                                        break
                                    default:
                                        break
                                }
                                console.log('all~~~~~~~~~~~',obj, obj.length)
                                console.log('now~~~~~~~~~~~',obj[0])
                                obj.shift()
                                timerId = setTimeout(tick, 10);
                            }
                        }, 0);
                    }
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
                // console.log('~~~ out staticProperty ~~~')
                resolve(obj)
            }
            let err = (error) => {
                console.log('~~~ err staticProperty ~~~', error)
                reject(error)
            }
            switch (func) {
                case 'object':
                    (async (obj, props,data) => {
                        try {
                            console.log(`${obj['input']}[(staticProperty)${obj[props]}]`)
                            if(isEmpty(queue.staticProperty[obj[props]])){
                                out(true)
                            }else{
                                out(queue.staticProperty[obj[props]])
                            }
                        } catch (e) { err(e) }
                    })(obj, args[0], args[1], args[2], args[3])
                    break
                case 'task':
                    (async (obj, props,data) => {
                        switch (obj[props]) {
                            case 'task':
                                try {
                                    if(isEmpty(queue.staticProperty['task'])){
                                        queue.staticProperty['task'] = []
                                        queue.staticProperty['task'] = new Proxy(queue.staticProperty['task'], handler)

                                    }
                                    queue.staticProperty['task'].push(obj)
                                    out({task:'push'})
                                } catch (e) { err(e) }
                                break
                            default:
                                err(`необрабатываемый тип запроса ${obj[props]}` )
                                break
                        }
                    })(obj, args[0], args[1], args[2], args[3])
                    break
                case 'set':
                    (async (obj, props,data) => {
                        try {
                            // console.log(`app(${obj['input']}[(staticProperty)${obj[props]}]staticProperty}`)
                            switch (obj[props]) {
                                case 'store':
                                    if( queue.staticProperty[`${obj['input']}`] === undefined){
                                        queue.staticProperty[`${obj['input']}`] = []
                                    }
                                    queue.staticProperty[`${obj['input']}`] = obj['store']
                                    out(queue.staticProperty)
                                    break
                                case 'timer':
                                    if( queue.staticProperty[`${obj['input']}`] === undefined){
                                        queue.staticProperty[`${obj['input']}`] = []
                                    }
                                    queue.staticProperty[`${obj['input']}_${obj['id']}`] = obj['data']
                                    out(queue.staticProperty[`${obj['input']}_${obj['id']}`])
                                    break
                                case 'obj':

                                    // console.log(queue.staticProperty)
                                    // console.assert(false,obj['input'], obj )
                                    if(!queue.staticProperty[obj['input']]){
                                        queue.staticProperty[obj['input']] = []
                                    }
                                    queue.staticProperty[obj['input']].push(obj)
                                    // console.log('store image', obj)
                                    out(obj)

                                    break
                                case 'all':

                                    queue.staticProperty = obj['store']
                                    // if(!queue.staticProperty[obj['input']]){
                                    //     queue.staticProperty[obj['input']] = []
                                    // }
                                    // queue.staticProperty[obj['input']].push(obj)
                                    // console.log('store image', obj)
                                    out(queue.staticProperty)

                                    break
                                case 'object':

                                    if(!queue.staticProperty[obj['name']]){
                                        queue.staticProperty[obj['name']] = []
                                    }
                                    queue.staticProperty[obj['name']].push(obj)

                                    console.log('store', obj)
                                    out(obj)

                                    break
                                case 'editor':
                                    if(isEmpty(queue.staticProperty['varan-editor'])){

                                        queue.staticProperty['varan-editor'] = []
                                        queue.staticProperty['varan-editor'].push(obj['editor'])
                                        out(obj['editor'])
                                    }
                                    else{
                                        let verify = false
                                        let position = 0
                                        let count = 0
                                        for(let i = 0; i < queue.staticProperty['varan-editor'].length; i++){
                                            if(isEmpty(obj['slot'])){
                                                console.assert(false, 'должен быть слот')

                                            }else{
                                                if(obj['slot'] === queue.staticProperty['varan-editor'][i]['slot']){


                                                    verify = true
                                                    position = i
                                                    count++
                                                }
                                            }
                                            // console.log(obj['slot'])
                                            // console.log(queue.staticProperty['varan-editor'][i]['slot'])

                                        }

                                        if(verify){
                                           if(count > 1){

                                               console.assert(false , 'должен быть один объект')
                                           }else{
                                               queue.staticProperty['varan-editor'][position]['editor'] = obj['editor']
                                               out(obj['editor'])
                                           }

                                        }else{
                                            queue.staticProperty['varan-editor'].push(obj['editor'])
                                            out(obj['editor'])
                                        }
                                    }
                                    break
                                default:
                                    err(`необрабатываемый тип запроса ${obj[props]}` )
                                    break
                            }
                        } catch (e) { err(e) }
                    })(obj, args[0], args[1], args[2], args[3])
                    break
                case 'put':
                    (async (obj, props,data) => {
                        try {
                            switch (obj[props]) {
                                case 'timer':
                                  out(queue.staticProperty[`${obj['input']}_${obj['id']}`]['timer'] = obj['timer'])

                                    break
                                default:
                                    break
                            }
                        }catch (e) { err(e) }
                    })(obj, args[0], args[1], args[2], args[3])
                    break
                case 'add':
                    (async (obj, props,data) => {
                        try {
                            switch (obj[props]) {
                                case 'timer':
                                    queue.staticProperty[`${obj['input']}_${obj['id']}`]['timer'] = +queue.staticProperty[`${obj['input']}_${obj['id']}`]['timer'] + obj['timer']
                                    queue.staticProperty[`${obj['input']}_${obj['id']}`]['price'] = +queue.staticProperty[`${obj['input']}_${obj['id']}`]['price'] + obj['price']
                                    out( queue.staticProperty[`${obj['input']}_${obj['id']}`])

                                    break
                                default:
                                    break
                            }
                        }catch (e) { err(e) }
                    })(obj, args[0], args[1], args[2], args[3])
                    break
                case 'get':
                    (async (obj, props,data) => {
                        try {
                            console.log(`${func}[(${obj['input']})${obj[props]}]`)
                            switch (obj[props]) {
                                case 'all':

                                    out(queue.staticProperty )

                                    break
                                case 'timer':
                                    out(queue.staticProperty[`${obj['input']}_${obj['id']}`]['timer'])
                                    break
                                case 'editor':
                                    // obj['target']

                                    let verify = false
                                    let position = 0
                                    let count = 0
                                    // console.log(isEmpty(queue.staticProperty['varan-editor']))
                                   // console.assert(false, queue.staticProperty)
                                    if(isEmpty(queue.staticProperty['varan-editor'])){

                                        out(undefined)
                                    }else{

                                        for(let i = 0; i < queue.staticProperty['varan-editor'].length; i++){
                                            // console.assert(false, obj['target'])

                                            if(obj['target'] === queue.staticProperty['varan-editor'][i]['slot']){
                                                verify = true
                                                position = i
                                                count++
                                            }
                                        }
                                        if(verify){
                                            if(count > 1){

                                                // console.assert(false , 'должен быть один объект')
                                            }else{
                                                // console.assert(false,queue.staticProperty['varan-editor'][position]['editor'])
                                                out(queue.staticProperty['varan-editor'][position]['editor'])
                                            }
                                        }else{
                                         out(undefined)
                                        }
                                    }

                                    break
                                case 'obj':
                                    // obj['target']
                                   await (async (obj, props,data) => {
                                        try {
                                            let verify = false
                                            let position = 0
                                            let count = 0
                                            // console.log(isEmpty(queue.staticProperty['varan-editor']))
                                            // console.assert(false, queue.staticProperty)
                                            if(isEmpty(queue.staticProperty[obj['target']])){

                                                out(undefined)
                                            }else{

                                                if(isEmpty(obj['slot'])){
                                                    out(queue.staticProperty[obj['target']])
                                                }else{
                                                    for(let i = 0; i < queue.staticProperty[obj['target']].length; i++){
                                                        // console.assert(false, obj['target'])

                                                        if(obj['slot'] === queue.staticProperty[obj['target']][i]['slot']){
                                                            verify = true
                                                            position = i
                                                            count++
                                                        }
                                                    }
                                                    if(verify){
                                                        if(count > 1){

                                                            console.assert(false , 'должен быть один объект')
                                                        }else{
                                                            // console.assert(false,queue.staticProperty['varan-editor'][position]['editor'])
                                                            out(queue.staticProperty[obj['target']][position])
                                                        }
                                                    }else{
                                                        console.warn('staticProperty - слот не найден')
                                                        out(queue.staticProperty[obj['target']])
                                                    }

                                                }
                                            }

                                        }catch (e) {

                                        }

                                    })(obj, args[0], args[1], args[2], args[3])
                                    break
                                case 'object':
                                    // obj['target']
                                   await (async (obj, props,data) => {
                                        try {
                                            let components = []
                                            for(let i =0; i < obj['object'].length; i++){
                                                console.log(obj['object'][i])
                                                if(isEmpty(queue.staticProperty[obj['object'][i]])){

                                                }else{
                                                    components.push(queue.staticProperty[obj['object'][i]])
                                                }
                                            }
                                            out(components)
                                        }catch (e) {

                                            err({
                                                'staticProperty': e
                                            })
                                        }

                                    })(obj, args[0], args[1], args[2], args[3])
                                    break
                                default:
                                    err(`необрабатываемый тип запроса ${obj[props]}` )
                                    break
                            }


                        } catch (e) { err(e) }
                    })(obj, args[0], args[1], args[2], args[3])
                    break
                case 'getObject':
                    (async (obj, props,data) => {
                        try {
                            console.log(`${func}[(${obj['input']})${obj[props]}]`)
                            out(queue.staticProperty[props] )

                        } catch (e) { err(e) }
                    })(obj, args[0], args[1], args[2], args[3])
                    break
                case 'set_n':
                    (async (obj, props,data) => {
                        try {
                            console.log(`${func}[(${obj['input']})${obj[props]}]`)
                            switch (obj[props]) {
                                case 'image':

                                    if(!queue.staticProperty[obj['input']]){
                                        queue.staticProperty[obj['input']] = []
                                    }
                                    queue.staticProperty[obj['input']].push(obj)
                                    out(obj)
                                    break
                                case 'object':

                                    if(!queue.staticProperty[obj['name']]){
                                        queue.staticProperty[obj['name']] = []
                                    }
                                    queue.staticProperty[obj['name']].push(obj)
                                    out(obj)
                                    break
                                case 'obj':

                                    if(!obj['input']){
                                        console.assert(false, 'надо указаь obj[input]')
                                    }
                                    if(!queue.staticProperty[obj['input']]){
                                        queue.staticProperty[obj['input']] = []
                                    }
                                    queue.staticProperty[obj['input']].push(obj)
                                    console.log('store', obj)
                                    out(obj)

                                    break
                                default:
                                    err(`необрабатываемый тип запроса ${obj[props]}` )
                                    break
                            }
                        } catch (e) { err(e) }
                    })(obj, args[0], args[1], args[2], args[3])
                    break
                default:
                    err(`новая функция ${func}`)
                    break
            }
    })
}
