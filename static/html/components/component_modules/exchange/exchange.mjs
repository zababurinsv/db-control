import auth from '/static/html/components/component_modules/exchange/auth.mjs'
let object = {}
object['SE'] = auth
export default async (obj)=>{
    return new Promise((resolve, reject) => {
        object['class'] = class Exchange {
            #SE= auth
            #setData = (data)=>{
                    let formData  = new FormData();
                    for(let name in data) {
                        formData.append(name, data[name]);
                    }
                    return(formData)
            };
            #auth = ()=>{
                    this.#SE.authenticate({
                        scope: ['read_inbox'],
                        success: function(data) { alert('Я получил доступ!'); }, // Приложение авторизовало пользователя
                        error: function(data) {  alert('Я не получил доступ :('); }, // Приложение не авторизовало пользователя
                    });
                // console.assert(false, this)
            };
            get self() {
                return object
            }
            init(obj){
                // console.log('~~~~~~~~~~~~~~~~~~~~', this)
                // console.assert(false)
                this.#SE.init({
                    clientId: 16891,
                    key: 'D*FoLFAUI68xi01Lx6ztTw',
                    channelUrl: 'http://localhost:8888',
                    complete: this.#auth
                });
                return obj
                // let formData =  this.#setData(obj)
                // fetch(`${node}${path}`, {
                //     method: method,
                //     body: formData
                // }).then(function (response) {
                //     if (!response.ok) {
                //         throw new Error('HTTP error, status = ' + response.status)
                //     } else {
                //         return response.json()
                //     }
                // })
                //     .then(function (json) {
                //         obj = []
                //         obj['get_n'] = []
                //         obj['mongo'] = json
                //         obj['get_n'].push(json)
                //         resolve(obj)
                //     })
                //     .catch(function (error) {
                //         console.assert(false, 'webDav', error, `${node}${path}`)
                //     })
            }
        }
        resolve(object)
    })
}