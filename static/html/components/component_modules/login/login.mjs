import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import bundle from '/static/html/components/component_modules/bundle/bundle.mjs'
export default async (obj)=>{
    return new Promise(async (resolve, reject) => {
            let config = await bundle['default']()
            let object = {}
            object['code'] = config['code']
            object['count'] = 0
            object['TelephoneCode'] =  config['countryTelephoneCode']
            object['template'] = document.createElement('div')
            object['template'].id = 'myDropdown'
            object['template'].className = 'dropdown-content'
            object['getCookie'] = async (cookie, name)=> {
                let value = "; " + cookie;
                let parts = value.split("; " + name + "=");
                if (parts.length == 2) return parts.pop().split(";").shift();
            }
            object['phoneCode'] = async (obj, data)=>{
                let country = {}
                country['code'] = undefined
                country['phone'] = undefined
                if(localStorage.getItem('signed') === null){

                }else{
                    let signed = localStorage.getItem('signed')

                    obj['this']['shadowRoot'].querySelector('#signed').checked = JSON.parse(signed)
                    // console.assert(false, obj['this']['shadowRoot'].querySelector('#signed'))
                }

                document.addEventListener('telegram-login', async (e)=>{
                    country['code'] =  e['detail']['code']
                    obj['this'].shadowRoot.querySelector('#code').innerText = e['detail']['code']
                    if( country['phone'] === undefined){
                        obj['this']['shadowRoot'].querySelector('div.buttonNext').style.display ='none'
                    }else{
                        obj['this']['shadowRoot'].querySelector('div.buttonNext').style.display ='flex'
                    }
                }, false)

                obj['this']['shadowRoot'].querySelector('#phone').addEventListener('input',async (e)=>{

                    let number = e.target.value.replace(/\s/g, '')

                    if(number.length === 10){
                        country['phone'] = number

                        if(country['code'] === undefined){
                            obj['this']['shadowRoot'].querySelector('div.buttonNext').style.display ='none'
                        }else{
                            obj['this']['shadowRoot'].querySelector('div.buttonNext').style.display ='flex'

                        }
                    }
                    obj['this']['shadowRoot'].querySelector('#phone').style.borderColor = '#acb2b5'
                    obj['this']['shadowRoot'].querySelector('#code').style.borderColor = '#acb2b5'
                })
                return  obj
            }

            object['template-children'] = async (obj, visible)=>{
                if(visible){
                    return `<div class="country"><div class="emoji">${obj['emoji']}</div><div class="name">${obj['name']}</div><div class="code">${obj['code']}</div></div>`
                }else{
                    return `<div class="country" style="display: none"><div class="emoji">${obj['emoji']}</div><div class="name">${obj['name']}</div><div class="code">${obj['code']}</div></div>`
                }
            }
            // console.assert(false, config['code']['code'])
            // console.assert(false, object['template'])
            for(let key in config['code']['countries'] ){
                if(config['code']['countries'][key][0].length === 1){}else{
                    object['count']++
                    let xxx = {}
                    let obj = {}
                    obj['name'] = config['code']['countries'][key][0]
                    obj['emoji'] = config['code']['flag'](config['code']['countries'][key][0])
                    if(config['countryTelephoneCode'](config['code']['code'](config['code']['countries'][key][0])) === undefined){}else{
                        obj['code'] = `+${(config['countryTelephoneCode'](config['code']['code'](config['code']['countries'][key][0])))[0]}`
                        if(object['count'] > 6){
                            xxx = await object['template-children'](obj, false)
                        }else{
                            xxx = await object['template-children'](obj, true)
                        }
                        object['template'].insertAdjacentHTML('beforeend',xxx)
                    }
                }
            }
            object['photoTemplate'] = async (obj)=>{
                // obj['this']['shadowRoot'].querySelector('div#password').remove()
                obj['this'].shadowRoot.querySelector('div.telegram').style.cursor = 'pointer'
                obj['this'].shadowRoot.querySelector('div.telegram').innerHTML = ''
                obj['this'].shadowRoot.querySelector('div.telegram').insertAdjacentHTML('afterbegin', `
                  
                  <label class="avatar" for="image"><img src="/static/html/components/telegram-login/images/cameraadd_svg.svg"><input required="" type="file" id="image"></label>
                `)
                obj['this']['shadowRoot'].querySelector('.head').innerHTML = ''
                obj['this']['shadowRoot'].querySelector('.head').insertAdjacentHTML('afterbegin',`
            <h1>Your Name</h1>
            `)
                obj['this']['shadowRoot'].querySelector('.message').innerText = ''
                obj['this']['shadowRoot'].querySelector('.message').insertAdjacentHTML('afterbegin',`
                <p>Enter your name and add</p>
                <p>a profile picture</p>`)
                obj['this']['shadowRoot'].querySelector('form').style.display = 'none'
                obj['this']['shadowRoot'].querySelector('.buttonNext').remove()
                obj['this']['shadowRoot'].querySelector('.telegram').style.background = '#7694f4'
                obj['this']['shadowRoot'].querySelector('#login').insertAdjacentHTML('beforeend',`
                <div id="bio">
                    <input type="text" id="name" placeholder="name">
                    <input type="text" id="last_name" placeholder="last name"></input>
                </div>
                `)
                return obj
            }
            object['count'] = 0
            object['class'] = class country {
                constructor(name) {
                    this.webComponents = obj['name'];
                    this.code = country =>{
                        return config['countryTelephoneCode'](config['code']['code'](country))
                    }
                    this.templateCode = obj =>{
                        obj.querySelector('#next').disabled = true
                        obj.querySelector('.telegram').style.background = 'transparent'
                        obj.querySelector('img.telegram').src = '/static/html/components/telegram-login/images/monkey.png'
                        obj.querySelector('#next').innerText = 'PLEASE WAIT...'
                        obj.querySelector('.loader').style.display = 'flex'
                        return obj
                    }
                    this.templatePhoto = this.templatePhoto.bind(this)
                    this.phoneCode = this.phoneCode.bind(this)
                    this.getCookie = this.getCookie.bind(this)
                }
                self() {
                    return object
                }
                phoneCode(obj, data = {}){
                    return object['phoneCode'](obj, data)
                }
                getCookie(obj, data = {}){
                    return object['getCookie'](obj, data)
                }
                templatePhoto(obj){
                    return object['photoTemplate'](obj)
                }
                get template() {
                    return  object['template'];
                }

            }
            resolve(object)
    })
}