import colorlog from '/static/html/components/component_modules/colorLog/colorLog.mjs'
import queue from '/static/html/components/component_modules/queue/queue.mjs'
let Class = class Recursion {
    constructor(self) {
        this.pre = this.pre.bind(this)
        this.key = this.key.bind(this)
        this.post = this.post.bind(this)
        this.end = this.end.bind(this)
        document.addEventListener('typeScript-end', this.end)
    }
    key(parent, key, state, object){
        return new Promise( function (resolve, reject) {
            if(key === '/'){
                object['path'][`${state}`] = `${object['path'][`${state}`]}${key}${parent[key]}`
            }
            if(typeof key === 'number'){
                object['file'][`${state}`].push(`${object['path'][`${state}`]}/${parent[key]}`)
            }
            resolve(true)
        })
    }
    pre(view = true,property='a',color = 'black', substrat={_:'default'},relation='default'  ){
        return new Promise( async (resolve, reject) => {
            colorlog(view, property,color,substrat,relation)
            let verify = {}
            verify['state'] = 0
            let file = {
               relation:[],
               property:[],
               substrate:[],
           }
           let path = {
               relation:'',
               property:'',
               substrate:'',
           }
            const it = property.deepIterator.default(substrat, {onlyLeaves: true});
            for (let {parent, key} of it) {
                switch (parent[key]) {
                    case 'relation':
                        verify['state'] = '1'
                        break
                    case 'property':
                        verify['state'] = '2'
                        break
                    case 'substrate':
                        verify['state'] = '3'
                        break
                    default:
                        break
                }
                switch (verify['state']) {
                    case '1':
                       await this.key(parent, key, 'relation', {file:file, path:path})
                        break
                    case '2':
                       await this.key(parent, key, 'property', {file:file, path:path})
                        break
                    case '3':
                      await  this.key(parent, key, 'substrate', {file:file, path:path})
                        break
                    default:
                        if(key === '/'){
                            path[`relation`] = `${key}${parent[key]}`
                            path[`property`] = `${key}${parent[key]}`
                            path[`substrate`] = `${key}${parent[key]}`
                        }

                        break
                }
            }
            colorlog(view, 'end',color,substrat,relation)
            resolve({
                path:path,
                file:file
            })

        })
    }
    post(console = true,property='a',color = 'black', substrat={_:'player'},relation='player'  ){
        return queue(console, property,color,substrat,relation)
    }
    end(event){
        queue(event['detail']['console'], '~end',event['detail']['color'],event['detail']['substrate'],event['detail']['relation']).then((data)=>{

            colorlog(true, 'stat','stat',data, 'статистика')

        })
    }
    get self() {
        return object
    }
}


export default Class