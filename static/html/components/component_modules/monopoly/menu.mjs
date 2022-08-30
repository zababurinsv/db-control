import menuGame from "/static/html/components/component_modules/monopoly/menu-game.mjs";
import Monopoly from "/static/html/components/component_modules/monopoly/menu-monopoly.mjs";
let object = {}
object['menu'] = undefined
export default (obj)=>{
    return new Promise(async function (resolve, reject) {
        let out = (obj) => {
            resolve(obj)
        }
        let err = (error) => {
            console.log('~~~ err ~~~', error)
            reject(error)
        }
        try{
            object['class'] = class Monopoly {
                constructor(self) {
                    this.menu = this.menu.bind(this)
                }
                menu(obj ={_:'default'}){
                    return ((obj)=>{
                        return new Promise(async function (resolve, reject) {
                            let out = (obj) => {
                                resolve(obj)
                            }
                            let err = (error) => {
                                console.log('~~~ err ~~~', error)
                                reject(error)
                            }
                            switch (obj['_']) {
                                case'default':
                                    console.log('menu.mjs модуль класса монополии')
                                    break
                                case'init':
                                    try {
                                        let monopoly = await menuGame['get']({
                                            input:'main',
                                            type:'monopoly',
                                            this:obj.this
                                        })

                                        out(monopoly)
                                    }catch (e) {
                                        err({
                                            _:'error menu',
                                            error: e
                                        })
                                    }
                                    break
                                default:
                                    console.warn('необрабатывается',obj['_'],'--->', obj)
                                    break
                            }
                        })
                    })(obj)
                }
                get self() {
                    return object
                }
            }
            out(object)
        }catch (e) {
            err({
                _:'error menu',
                error: e
            })
        }
    })
}