import staticProperty from '/static/html/components/component_modules/staticProperty/staticProperty.mjs'
import waves from '/static/html/components/component_modules/waves/index.mjs'
import matcher from '/static/html/components/component_modules/matcher/matcher.mjs'
export default async (obj, func, ...args)=>{
    bundle['default'](obj,null, async function (error, config) {
        return new Promise(async function (resolve, reject) {
            let out = (obj) => {
                //console.log('~~~ out router ~~~')
                resolve(obj)
            }
            let err = (error) => {
                console.log('~~~ err router ~~~', error)
                reject(error)
            }
            switch (func) {
                case 'change':
                   await (async (obj, props,state, server) => {
                        try {
                            // console.log(`app [(${func}[(${obj['input']})${obj[props]}])request]`)
                            switch (obj[props]) {
                                case 'router':
                                  await  (async (obj, props,data) => {
                                        try {
                                            let store =  await staticProperty({
                                                input:'action',
                                                type: 'all'
                                            }, 'get', 'type')
                                            //
                                            switch (obj['pathname']) {
                                                case '/':
                                                    for(let i = 0; i< obj['manifest'].length; i++){

                                                        if(obj['manifest'][i].name === 'lacerta-gallery'){


                                                            obj['manifest'][i].style.display = 'none'

                                                        }else{
                                                            if( obj['manifest'][i].name === 'varan-header'){


                                                            }else{

                                                                obj['manifest'][i].style.display = 'flex'

                                                            }

                                                        }
                                                        // console.log(obj['manifest'][i])

                                                    }
                                                    break
                                                case '/about':
                                                    for(let i = 0; i< obj['manifest'].length; i++){

                                                        window.scrollTo({
                                                            top: 0,
                                                            behavior: "smooth"
                                                        });
                                                    }
                                                    break
                                                case '/gallery':
                                                   // console.log('store', obj['store'])
                                                    let moderator = obj['store']['varan-gallery'][0]['this'].shadowRoot.querySelector('section')
                                                    obj['store']['lacerta-request'][0]['this'].shadowRoot.querySelector('details').open =false
                                                    moderator.scrollIntoView({block: "start", behavior: "smooth"});
                                                    break
                                                case '/photo':
                                                    let photo = obj['store']['lacerta-gallery'][0]['this'].shadowRoot.querySelector('details')
                                                    photo.open = true
                                                    obj['store']['lacerta-request'][0]['this'].shadowRoot.querySelector('details').open =false
                                                    photo.scrollIntoView({block: "start", behavior: "smooth"});
                                                    break
                                                case '/news':

                                                    let news = obj['store']['lacerta-news'][0]['this'].shadowRoot.querySelector('section')
                                                    obj['store']['lacerta-request'][0]['this'].shadowRoot.querySelector('details').open =false
                                                    news.scrollIntoView({block: "start", behavior: "smooth"});

                                                    break
                                                case '/request':
                                                    // console.log('store', obj['store'])
                                                    obj['store']['lacerta-request'][0]['this'].shadowRoot.querySelector('details').open =true
                                                    let request = obj['store']['lacerta-request'][0]['this'].shadowRoot.querySelector('section')
                                                    request.scrollIntoView({block: "start", behavior: "smooth"});

                                                    break
                                                case '/documents':
                                                    // console.log('store', obj['store'])
                                                    let contact = obj['store']['lacerta-documents'][0]['this'].shadowRoot.querySelector('section')

                                                    contact.scrollIntoView({block: "start", behavior: "smooth"});
                                                    obj['store']['lacerta-request'][0]['this'].shadowRoot.querySelector('details').open =false
                                                    break
                                                case '/contact':
                                                    // console.log('store', obj['store'])
                                                    let documents = obj['store']['varan-contact'][0]['this'].shadowRoot.querySelector('section')
                                                    documents.scrollIntoView({block: "start", behavior: "smooth"});
                                                    obj['store']['lacerta-request'][0]['this'].shadowRoot.querySelector('details').open =false

                                                    break
                                                case '/login':

                                                   let auth = await waves({
                                                        input:'request',
                                                        type:'login',
                                                       data: { data: "Auth on my  site" }
                                                    },'auth', 'type')

                                                    if(auth['mongo'] === true){
                                                        document.location.href = "http://localhost:8888/admin";
                                                        out(auth['mongo'] )
                                                    }else{
                                                        document['body'].innerHTML = ''
                                                        document['body'].insertAdjacentHTML('afterbegin', `${auth['mongo']}`);
                                                        out(auth['mongo'] )
                                                    }

                                                    break
                                                default:
                                                    console.error('неизвестный путь', obj['pathname'])

                                                    break
                                            }


                                            /*
                                            fetch(`${server}${obj[props]}`)
                                                .then(function (response) {
                                                    if (response.ok) {
                                                        return response.text()
                                                    }
                                                }).then(function (html) {



                                            }).catch(error => {
                                                return error
                                            })

                                             */
                                        } catch (e) { err(e) }
                                    })(obj, args[0], args[1], args[2], args[3])
                                    break
                                case 'default':

                                  await  (async (obj, props,data) => {
                                        try {

                                            fetch(`${server}${obj[props]}`)
                                                .then(function (response) {
                                                    if (response.ok) {
                                                        return response.text()
                                                    }
                                                }).then(function (obj) {

                                                // let scr = document.createElement('script')

                                                let str = '<script>function __ssr(){var a=document.currentScript.previousElementSibling,b=a.firstElementChild;a.removeChild(b);for(var c=a.attachShadow({mode:"open"});b.hasChildNodes();)c.appendChild(b.firstChild);}<\/script><x-hello><shadow-root><span>Hello, <x-yell><shadow-root><strong><slot><\/slot><\/strong><\/shadow-root><slot><\/slot><\/x-yell><script>__ssr()<\/script>!<\/span><\/shadow-root>World<\/x-hello><script>__ssr()<\/script>';


                                                $('body').append(str)

                                                // scr.innerText = 'function ff(){console.log(`ffffffffff`)} ff()'
                                                // let ssr = document.createElement('script')
                                                //     ssr.type = 'module'

                                                // let str = '<script>function __ssr(){var a=document.currentScript.previousElementSibling,b=a.firstElementChild;a.removeChild(b);for(var c=a.attachShadow({mode:"open"});b.hasChildNodes();)c.appendChild(b.firstChild);}<\/script><x-hello><shadow-root><span>Hello, <x-yell><shadow-root><strong><slot><\/slot><\/strong><\/shadow-root><slot><\/slot><\/x-yell><script>__ssr()<\/script>!<\/span><\/shadow-root>World<\/x-hello><script>__ssr()<\/script>';

                                                // document['body'].insertAdjacentHTML( 'beforeend', `<script>function ff(){console.log('ffffffffff')} ff()</script>` );
                                                //
                                                // document['body'].appendChild(scr)


                                                // console.log('~~~~~~sss~~~~',`<script>console.log('some function')</script>`)
                                                // document['body'].appendChild()


                                            }).catch(error => {
                                                return error
                                            })
                                        } catch (e) { err(e) }
                                    })(obj, args[0], args[1], args[2], args[3])

                                    break
                                default:
                                    err(`новая функция ${func}`)
                                    break
                                }
                            } catch (e) { err(e) }
                    })(obj, args[0], args[1], args[2], args[3])
                    break
                case 'post':
                   await (async (obj, props,data) => {
                        try {
                            // console.log(`app(${func}[(${obj['input']})${obj[props]}]property)`)
                            switch (obj[props]) {
                                case 'form':
                                  await  (async (obj, props,data) => {
                                        try {
                                          let store = await  matcher['webdav']({
                                                input:'request',
                                                data: obj['data'],
                                                type:'request'
                                            }, 'set', 'type')

                                            store['mongo']['data'] = obj['data']['file']
                                            let mail = await  matcher['email']({
                                                input:'request',
                                                data: store['mongo'],
                                                type:'request'
                                            }, 'set', 'type')
                                            out(mail)
                                        } catch (e) { err(e) }
                                    })(obj, args[0], args[1], args[2], args[3])
                                    break
                                default:
                                    err(`new type [(${func})${obj[props]}]`)
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
    })
}
