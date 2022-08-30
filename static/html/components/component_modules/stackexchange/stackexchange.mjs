import auth from '/static/html/components/component_modules/stackexchange/auth.mjs'

let object = {}
object['SE'] = auth
export default async (obj)=>{
    return new Promise((resolve, reject) => {
        object['class'] = class Stackexchange {
            constructor() {
                this.init = this.init.bind(this)
                this.auth = this.auth.bind(this)
            }
            #tokens = null;
            #SE= auth
            #setData = (data)=>{
                    let formData  = new FormData();
                    for(let name in data) {
                        formData.append(name, data[name]);
                    }
                    return(formData)
            };
            auth = ()=>{

                try {
                    this.#SE.authenticate({
                        success: function(data) {
                            console.log('~~~~~~~~~data~~~~~~~~~~~~~~~~', data)

                        },
                        error: function(data) {
                            console.log('~~~~~~~~~data~~~~~~~~~~~~~~~~', data)
                        },
                        scope: ['read_inbox'],
                        networkUsers: true
                    });
                }catch (e) {
                    console.log('~~~~~~~error~~~~~~~~',e)
                }
            };
            get self() {
                return object
            }
            init(obj){
                let self = this
                this.#SE.init({
                    clientId: '17089',
                    key: '*cIdzfqglx40gwTjizHXSg((',
                    channelUrl: 'https://rington-websocket.herokuapp.com',
                    complete: (data)=>{

                        console.log('~~~~~~~~~~init~~~~~~~~~~~~~~', data)
                        console.log('~~~~~~~~~~self~~~~~~~~~~~~~~', self)

                    },
                    networkUsers: true
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