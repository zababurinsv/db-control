import colorLog from '/static/html/components/component_modules/colorLog/colorLog.mjs'
import staticProperty from '/static/html/components/component_modules/staticProperty/staticProperty.mjs'
import parser from '/static/html/components/component_modules/parser/parser.mjs'
import matcher from '/static/html/components/component_modules/matcher/matcher.mjs'
import feed from '/static/html/components/component_modules/feed/feed.mjs'
import template from '/static/html/components/component_modules/template/template.mjs'
import utils from '/static/html/components/component_modules/utils/utils.mjs'
import IntersectionObserver from '/static/html/components/component_modules/IntersectionObserver/IntersectionObserver.mjs'
import getBoundingClientRect from '/static/html/components/component_modules/getBoundingClientRect/getBoundingClientRect.mjs'
import verification from '/static/html/components/component_modules/verification/verification.mjs'
import addEventListener from '/static/html/components/component_modules/addEventListener/addEventListener.mjs'
import conf from '/static/html/components/component_modules/matcher/matcher/this/database/config/index.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import config from '/static/html/components/component_modules/bundle/action.mjs'

export default  (obj, func, ...args)=>{
    return new Promise( function (resolve, reject) {
            let out = (obj) => {
                // console.log('~~~ out  ~~~', obj['input'])
                resolve(obj)
            }
            let err = (error) => {
                console.log('~~~ err ~~~', error)
                reject(error)
            }
            switch (func) {
                case 'add':
                    (async (obj, props,data) => {
                        try {
                            // console.log(`app(${func}[(${obj['input']})${obj[props]}action])`)
                            switch (obj[props]) {
                                case 'menu-update':
                                    out(addEventListener({
                                        input:'lacerta-moderator',
                                        type:'menu-update',
                                        data: obj['data']
                                    }, 'add', 'type'))
                                    break
                                case 'image':

                                    let storeFile =  await staticProperty({
                                        input:'action',
                                        object:['sidebar', obj['id']],
                                        type:'object'
                                    }, 'get', 'type')
                                    let file = await staticProperty(obj,'set_n', 'type')

                                    let sideBar =  storeFile['varan-sidebar'][0]['obj']['this']


                                    sideBar.shadowRoot.querySelector('.filename').innerText = `${file['name']}.jpg`


                                    out(file)
                                    break
                                default:
                                    err(`необрабатываемый тип запроса set ${obj[props]}` )
                                    break
                            }
                        } catch (e) { err(e) }
                    })(obj, args[0], args[1], args[2], args[3])

                    break
                case 'save':
                    (async (obj, props,data) => {
                        try {
                            // console.log(`app(${func}[(${obj['input']})${obj[props]}action])`)
                            switch (obj[props]) {
                                case 'editor':
                                    let store =  await staticProperty({
                                        input:'customEvents',
                                        type:'editor',
                                        target: obj['id']
                                    }, 'get', 'type')


                                    let component = {}
                                    component['component'] = obj['id']
                                    component['user'] = 'anonymous'
                                    component['type'] = 'public'
                                    component['captcha'] = ''
                                    component['init'] = false
                                    component['count'] = 0
                                    component['status'] = -1
                                    component['online'] = false
                                    component['Timestamp'] = ''
                                    component['view-wall'] = ''
                                    component['view-slider-pos'] = null
                                    component['view-slider-db'] = 0
                                    component[`id`] = obj['id']
                                    component['edit-delta'] = JSON.stringify(store.quill.getContents())
                                    component[`content`] = store.quill.root.innerHTML
                                    component['view-slider'] = 0
                                    component[`url`] = window.location.href


                                    await parser({
                                        input:'action',
                                        this: store['self'],
                                        component: component,
                                        type:'editor'
                                    }, 'set', 'type')

                                    let about =  await staticProperty({
                                        input:'customEvents',
                                        type:'obj',
                                        target: 'varan-about',
                                        slot:'about-admin'
                                    }, 'get', 'type')
                                    // console.assert(false, (await config.default()).store)

                                    let bundleStore = (await config.default())['store']
                                    if(about === undefined){
                                        if(bundleStore['varan-about'] === undefined){

                                        }else{

                                            for(let i = 0 ; i < bundleStore['varan-about'].length;i++){

                                                if(bundleStore['varan-about'][i].slot === 'about-admin'){

                                                    about = bundleStore['varan-about'][i]

                                                }

                                            }
                                        }

                                    }
                                    if(about === undefined){

                                    }else{
                                        if(about['obj']['this'].querySelector('.menu-convert') === null){
                                            let menu = about['obj']['this'].querySelector('varan-menu')
                                            menu.shadowRoot.querySelector('.menu-convert').innerText = 'Сохраните данные'
                                        }else{
                                            about['obj']['this'].querySelector('.menu-convert').innerText = 'Сохраните данные'
                                        }
                                    }
                                    out(obj)
                                    break
                                case 'image':

                                    let storeFile =  await staticProperty({
                                        input:'action',
                                        object:['telegram-login', obj['input']],
                                        type:'object'
                                    }, 'get', 'type')

                                    if(isEmpty(storeFile)){
                                        out(obj)
                                    }else{

                                        storeFile[0][0]['file'] = obj
                                        console.warn('надо переписать это частный случай')

                                        // let file = await staticProperty(obj,'set_n', 'type')
                                        // let sideBar =  storeFile['varan-sidebar'][0]['obj']['this']
                                        // sideBar.shadowRoot.querySelector('.filename').innerText = `${file['name']}.jpg`

                                        out(storeFile[0][0])
                                    }
                                    break
                                default:
                                    err(`необрабатываемый тип запроса set ${obj[props]}` )
                                    break
                            }
                        } catch (e) { err(e) }
                    })(obj, args[0], args[1], args[2], args[3])

                    break
                case 'action':
                    (async (obj, props,data) => {
                        try {
                            // console.log(`${func}[(${obj['input']})${obj[props]}]`)
                            switch (obj[props]) {
                                case 'crop':
                                    let store =  await staticProperty({
                                        input:'action',
                                        type:'all'
                                    }, 'get', 'type')
                                    obj['upload'] = {}

                                    if(isEmpty(store['varan-crop'])){
                                        alert('добавьте в проект компонент varan-crop')
                                    }else{
                                        obj['this'] = store['varan-crop'][0]['obj']['this'].shadowRoot

                                        obj['upload']['url'] = URL.createObjectURL(obj['file']);

                                        obj['this'].querySelector('.modal').style.display ='flex'

                                        let file =  await matcher['external']['func']['crop']['cropUrl'](obj)

                                        if(obj['slot'] === "moderator-admin"){
                                            for(let i = 0; i < store['lacerta-moderator'].length; i ++){
                                                switch (store['lacerta-moderator'][i].slot) {
                                                    case 'moderator-admin':

                                                        store['lacerta-moderator'][i]['upload'] = {}
                                                        store['lacerta-moderator'][i]['upload']['img'] = file['dataURL']
                                                        store['lacerta-moderator'][i]['img'].src = file['dataURL']
                                                        out({crop:'true'})
                                                        break
                                                    default:
                                                        console.warn('~~~~~~~~~', 'На этот объект нет действия ',store['varan-editor'][i].slot )
                                                        break
                                                }
                                            }
                                        }else if(obj['slot'] === "card-admin"){
                                            for(let i = 0; i < store['varan-card-news'].length; i ++){
                                                switch (store['varan-card-news'][i].slot) {
                                                    case 'card-admin':
                                                        store['varan-card-news'][i]['img'].src =file['dataURL']
                                                        out({crop:'true'})
                                                        break
                                                    default:
                                                        console.warn('~~~~~~~~~', 'На этот объект нет действия ',store['varan-editor'][i].slot )
                                                        break
                                                }
                                            }
                                        }else if(obj['slot'] === "lacerta-news"){
                                            for(let i = 0; i < store['lacerta-news'].length; i ++){
                                                switch (store['lacerta-news'][i].slot) {
                                                    case 'news-admin':
                                                        store['lacerta-news'][i]['upload'] = {}
                                                        store['lacerta-news'][i]['upload']['img'] = file['dataURL']
                                                        store['lacerta-news'][i]['img'].src = file['dataURL']
                                                        out({crop:'true'})
                                                        break
                                                    default:
                                                        console.warn('~~~~~~~~~', 'На этот объект нет действия ',store['varan-editor'][i].slot )
                                                        break
                                                }
                                            }
                                        }else{
                                            switch (obj['slot']) {
                                                case 'telegram-login':
                                                    // console.log(file['file']['dataURL'])
                                                    // console.assert(false, file['this']['shadowRoot'])
                                                    if(file['this']['shadowRoot'].querySelector('.imageAvatar') === null){

                                                    }else{
                                                        file['this']['shadowRoot'].querySelector('.imageAvatar').remove()
                                                    }
                                                    file['this']['shadowRoot'].querySelector('.avatar').insertAdjacentHTML('afterbegin',`
                                                    <img class="imageAvatar" src="${file['file']['dataURL']}">
                                                    
                                                    `)
                                                    let image = new CustomEvent('telegram-login-action', {
                                                        detail: {
                                                            photo: file['file'],
                                                        }

                                                    })
                                                    document.dispatchEvent(image)
                                                    out({crop:'true'})
                                                    break
                                                case 'monopoly-struct':
                                                    document.dispatchEvent(new CustomEvent('monopoly-struct', {
                                                        detail: {
                                                            photo: file,
                                                        }

                                                    }))
                                                    out({crop:'true'})
                                                    break
                                                default:
                                                    console.warn('необрабатываемое событие', obj['slot'])
                                                    break
                                            }
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
                case 'get':
                    (async (obj, props,data) => {
                        try {
                            // console.log(`${func}(${obj['input']})${obj[props]}]`)
                            let feeds = {}
                            switch (obj[props]) {
                                case 'manifest':
                                    let manifest = document['body'].shadowRoot.querySelectorAll('slot')
                                    out(manifest)
                                    break
                                case 'jsonPhoto':
                                    let json = await  matcher['mongo']({
                                        input: 'action',
                                        type:'jsonPhoto',
                                    }, 'get', 'type')
                                    out(json)
                                    break
                                case 'lazyImg':
                                    let img = await  matcher['mongo']({
                                        input: 'action',
                                        type:'img',
                                        data: obj['data']
                                    }, 'get', 'type')
                                    out(img)
                                    break
                                case 'feeds':
                                    let fwwd = await  matcher['mongo']({
                                        input: 'action',
                                        relation: obj['input'],
                                        type:'feeds'
                                    }, 'get', 'type')
                                    out(fwwd)
                                    break
                                case 'yandex':
                                    out(feed({
                                        input: 'action',
                                        relation: obj['input'],
                                        data: obj['data'],
                                        type:'yandex'
                                    }, 'get', 'type'))
                                    break
                                case 'bids':
                                    let status = null

                                    let feeds = {}
                                    feeds = await  matcher['mongo']({
                                        input: 'action',
                                        relation: obj['input'],
                                        type:'bids'
                                    }, 'get', 'type')
                                    status = await fetch(`${conf['mongo']['web']}/bid`)

                                    /**
                                     *
                                     * нужно проверить сравнение
                                     */
                                    if( status === null || await status.text() === 'rss not found' ){
                                        out(obj)
                                    }else{
                                        let parser = new config['rssParser']();
                                        let  temp = {}
                                        temp = await parser.parseURL(`${conf['mongo']['web']}/bid`);
                                        out(temp['items'])

                                    }

                                    break
                                case 'itemsBid':
                                   await (async (obj, props,data) => {
                                        try {
                                            let itemsBid = await  matcher['mongo']({
                                                input: 'action',
                                                type:'itemsBid'
                                            }, 'get', 'type')
                                            out(itemsBid)

                                        } catch (e) { err(e) }
                                    })(obj, args[0], args[1], args[2], args[3])
                                    break
                                case 'newsTemplate':
                                    (async (obj, props,data) => {
                                        try {
                                            if(isEmpty(obj['name'])){
                                                obj['name'] = 'default'
                                            }
                                            let status = null

                                            let feeds = {}
                                            feeds = await feed({
                                                input: 'action',
                                                type:'feeds'
                                            }, 'get', 'type')
                                            // status = await fetch(conf['mongo']['web'])
                                            /**
                                             *
                                             * нужно проверить сравнение
                                             */
                                            if( feeds['mongo'].length === 0){
                                                out(obj)
                                            }else{
                                                let parser = new config['rssParser']();
                                                let  temp = {}

                                                temp = await parser.parseURL(conf['mongo']['web']);
                                                out(temp['items'])

                                            }
                                        } catch (e) { err(e) }
                                    })(obj, args[0], args[1], args[2], args[3])
                                    break
                                default:
                                    err(`необрабатываемый тип запроса ${obj[props]}` )
                                    break
                            }
                        } catch (e) { err(e) }
                    })(obj, args[0], args[1], args[2], args[3])

                    break
                case 'convert':
                    (async (obj, props,data) => {
                        try {
                            // console.assert(false)
                            // console.log(`${obj['input']}[${func}][(action)${obj[props]}]`)
                            switch (obj[props]) {
                                case 'rss':
                                    out(feed({
                                        input: 'action',
                                        relation: obj['input'],
                                        data: obj['data'],
                                        type:'rss'
                                    }, 'convert', 'type'))
                                    break
                                case 'light':

                                    break
                                default:
                                    err(`необрабатываемый тип запроса ${obj[props]}` )
                                    break
                            }
                        } catch (e) { err(e) }
                    })(obj, args[0], args[1], args[2], args[3])

                    break
                case 'create':
                    (async (obj, props,data) => {
                        try {
                            // console.log(`${func}[(${obj['input']})${obj[props]}]`)
                            let store = {}
                            let channel = {}
                            let feeds = {}
                            let item = {}
                            let feedItem = {}
                            switch (obj[props]) {
                                case 'jsonPhoto':

                                    obj['this'].shadowRoot.querySelector('section').innerHTML = ''
                                    for(let i =0; i < obj['data'].length;i++){



                                        let templateGalary = `
                                                <div class="gallery-item">
                                                    <img class="lazy" src="/static/html/components/lacerta-gallery/images/empty.jpeg" data-src="${obj['data'][i]['filename'].split('/')[2]}" data-srcset="${obj['data'][i]['filename'].split('/')[2]}" alt="gallery">
                                                </div>`

                                        obj['this'].shadowRoot.querySelector('section').insertAdjacentHTML('beforeend', templateGalary)

                                    }

                                    // console.log(obj['this'].shadowRoot.querySelector('section'))
                                    out('sds')
                                    break
                                case 'channel':
                                    let  store =  await staticProperty({
                                        input:'action',
                                        object:['sidebar', obj['id']],
                                        type:'object'
                                    }, 'get', 'type')

                                    let   channelCreate = await feed({
                                        input:'action',
                                        type: 'channel'
                                    }, 'create', 'type')
                                    let   channelMongo =   await  matcher['mongo']({
                                        input: 'action',
                                        data: JSON.stringify(channelCreate),
                                        type:'channel'
                                    }, 'create', 'type')
                                    out(channelCreate)
                                    break
                                case 'itemFeed':

                                    // let store =  await staticProperty({
                                    //      input:'action',
                                    //      type: 'all'
                                    //  }, 'get', 'type')
                                    /**
                                     * Получаю текущий feed
                                     *
                                     */
                                    feeds = await matcher['mongo']({
                                        input: 'action',
                                        relation: obj['input'],
                                        type:'feeds'
                                    }, 'get', 'type')
                                    if(feeds['mongo'].length === 0 || feeds['mongo']['status']=== -2){
                                        console.warn('нет ленты новостей')
                                    }
                                    let feedId = {}

                                    if(await isEmpty(feeds['mongo'])){
                                        console.warn('нет канала' )
                                        err('нет канала')
                                    }else {

                                        feedId = feeds['mongo'][0]['_id']
                                        /**
                                         * parsing previous rss
                                         *
                                         */



                                        config['parseString']['parseString'](feeds['mongo'][0]['feed']['rss'], async function (err, result) {






                                            let items = []

                                            /**
                                             * get old items
                                             *
                                             */

                                            if(isEmpty(result['rss']['channel'][0]['item']) === true){

                                                /**
                                                 * создаём новый фид
                                                 */
                                                let FeedItem = await feed({
                                                    input:'action',
                                                    feed:feeds['mongo'][0]['feed'],
                                                    type: 'item',
                                                    data: obj['data'],
                                                }, 'create', 'type')

                                                /**
                                                 * create item
                                                 */
                                                await matcher['mongo']({
                                                    input: 'action',
                                                    data: JSON.stringify(FeedItem['item']),
                                                    id:FeedItem['feed']['option']['category'],
                                                    type:'item'
                                                }, 'create', 'type')


                                                FeedItem['feed']['rss'] =  FeedItem['feed']['rss'].replace(/<!\[CDATA\[/g, "").replace(/]]>/g, "");

                                                await matcher['mongo']({
                                                    input: 'action',
                                                    id: feedId,
                                                    data:  JSON.stringify(FeedItem['feed']),
                                                    type:'feed'
                                                }, 'update', 'type')
                                                location.reload()
                                                out(item)
                                            }else{
                                                for(let i =0; i< result['rss']['channel'][0]['item'].length; i++) {

                                                    if(!result['rss']['channel'][0]['item'][i]['title']){
                                                        result['rss']['channel'][0]['item'][i]['title'] = {}
                                                        result['rss']['channel'][0]['item'][i]['title'][0] = 'отсутствует'
                                                    }
                                                    let tmp = `    <item>
            <title>${result['rss']['channel'][0]['item'][i]['title'][0]}</title>
            <guid>${result['rss']['channel'][0]['item'][i]['guid'][0]}</guid>
             <link>${result['rss']['channel'][0]['item'][i]['link'][0]}</link>
            <pubDate>${result['rss']['channel'][0]['item'][i]['pubDate'][0]}</pubDate>
            <description>${result['rss']['channel'][0]['item'][i]['description'][0]}</description>
            <content:encoded>${result['rss']['channel'][0]['item'][i]['content:encoded'][0]}</content:encoded>
            <author>${result['rss']['channel'][0]['item'][i]['author'][0]}</author>
            <enclosure url="${result['rss']['channel'][0]['item'][i]['enclosure'][0]['$']['url']}"/>
</item>`


                                                    items.push(tmp)
                                                }


                                                /**
                                                 * create item and feed
                                                 */
                                                    // console.assert(false, obj['data'])
                                                let FeedItem = await feed({
                                                        input:'action',
                                                        feed:feeds['mongo'][0]['feed'],
                                                        type: 'item',
                                                        data:  obj['data'],
                                                    }, 'create', 'type')


                                                // console.assert(false, FeedItem)
                                                let subString =  FeedItem['feed']['rss'].substr(0, FeedItem['feed']['rss'].indexOf(`</channel>`))

                                                for(let i = 0; i < items.length; i++){

                                                    subString = subString + items[i]
                                                }
                                                let end =` </channel>
                                                      </rss>`
                                                subString = subString + end

                                                FeedItem['feed']['rss'] = subString
                                                // console.log('~~~~~~~', obj['data']['timestamp'])
                                                // console.log(Date.parse(FeedItem['item']['date_modified']))
                                                // console.log('~~~~~~~~~~',FeedItem['feed'] )
                                                // console.assert(false,FeedItem['item'] )
                                                // console.assert(false, FeedItem['feed'])
                                                /**
                                                 * save feed in mongo
                                                 *
                                                 */
                                                // console.assert(false, obj)
                                                channel = await matcher['mongo']({
                                                    input: 'action',
                                                    id: feedId,
                                                    data:  JSON.stringify(FeedItem['feed']),
                                                    type:'feed'
                                                }, 'update', 'type')

                                                /**
                                                 * create item
                                                 */
                                                // console.assert(false, FeedItem['item'])
                                                await matcher['mongo']({
                                                    input: 'action',
                                                    data: JSON.stringify(FeedItem['item']),
                                                    id:FeedItem['feed']['option']['category'],
                                                    type:'item'
                                                }, 'create', 'type')

                                                // store['action']['create'] = false
                                                location.reload()
                                                out(channel)
                                            }
                                        })
                                    }
                                    break
                                case 'itemBid':
                                    (async (obj, props,data) => {



                                        // let store =  await staticProperty({
                                        //     input:'action',
                                        //     type: 'all'
                                        // }, 'get', 'type')

                                        /**
                                         * Получаю текущий feed
                                         *
                                         */
                                        feeds = await matcher['mongo']({
                                            input: 'action',
                                            relation: obj['input'],
                                            type:'bids'
                                        }, 'get', 'type')

                                        let feedId = {}

                                        if(await isEmpty(feeds['mongo']) || feeds['mongo'] === 'null' ){


                                            channel = await feed({
                                                input:'action',
                                                type: 'channel',
                                                name:'bid'
                                            }, 'create', 'type')

                                            await matcher['mongo']({
                                                input: 'action',
                                                data: JSON.stringify(channel),
                                                type:'bidChanel',
                                                name:'bid'
                                            }, 'create', 'type')
                                            console.assert(false, channel)
                                            feeds = await matcher['mongo']({
                                                input: 'action',
                                                relation: obj['input'],
                                                type:'bids'
                                            }, 'get', 'type')

                                        }
                                        feedId = feeds['mongo'][0]['_id']
                                        /**
                                         * parsing previous rss
                                         *
                                         */



                                        config['parseString']['parseString'](feeds['mongo'][0]['feed']['rss'], async function (err, result) {



                                            let items = []

                                            /**
                                             * get old items
                                             *
                                             */

                                            if(isEmpty(result['rss']['channel'][0]['item']) === true){

                                                /**
                                                 * создаём новый фид
                                                 */


                                                let FeedItem = await feed({
                                                    input:'action',
                                                    feed:feeds['mongo'][0]['feed'],
                                                    type: 'item',
                                                    data: obj['data'],
                                                }, 'create', 'type')





                                                FeedItem['item']['details'] = {
                                                    price: obj['data']['description']['price'],
                                                    time: obj['data']['description']['time']
                                                }
                                                /**
                                                 * create item
                                                 */
                                                await  matcher['mongo']({
                                                    input: 'action',
                                                    data: JSON.stringify(FeedItem['item']),
                                                    id:FeedItem['feed']['option']['category'],
                                                    type:'bid',
                                                }, 'create', 'type')
                                                FeedItem['feed']['rss'] =  FeedItem['feed']['rss'].replace(/<!\[CDATA\[/g, "").replace(/]]>/g, "");

                                                await matcher['mongo']({
                                                    input: 'action',
                                                    id: feedId,
                                                    data:  JSON.stringify(FeedItem['feed']),
                                                    type:'bid'
                                                }, 'update', 'type')
                                                location.reload()
                                                out(item)
                                            }else{
                                                for(let i =0; i< result['rss']['channel'][0]['item'].length; i++) {
                                                    if(!result['rss']['channel'][0]['item'][i]['title']){
                                                        result['rss']['channel'][0]['item'][i]['title'] = {}
                                                        result['rss']['channel'][0]['item'][i]['title'][0] = 'отсутствует'
                                                    }
                                                    let tmp = `    <item>
            <title>${result['rss']['channel'][0]['item'][i]['title'][0]}</title>
            <guid>${result['rss']['channel'][0]['item'][i]['guid'][0]}</guid>
             <link>${result['rss']['channel'][0]['item'][i]['link'][0]}</link>
            <pubDate>${result['rss']['channel'][0]['item'][i]['pubDate'][0]}</pubDate>
            <description>${result['rss']['channel'][0]['item'][i]['description'][0]}</description>
            <content:encoded>${result['rss']['channel'][0]['item'][i]['content:encoded'][0]}</content:encoded>
            <author>${result['rss']['channel'][0]['item'][i]['author'][0]}</author>
            <enclosure url="${result['rss']['channel'][0]['item'][i]['enclosure'][0]['$']['url']}"/>
</item>`


                                                    items.push(tmp)
                                                }


                                                /**
                                                 * create item and feed
                                                 */
                                                    // console.assert(false, obj['data'])
                                                let FeedItem = await feed({
                                                        input:'action',
                                                        feed:feeds['mongo'][0]['feed'],
                                                        type: 'item',
                                                        data:  obj['data'],
                                                    }, 'create', 'type')

                                                FeedItem['item']['details'] = {
                                                    price: obj['data']['description']['price'],
                                                    time: obj['data']['description']['time']
                                                }
                                                // console.assert(false, FeedItem)
                                                let subString =  FeedItem['feed']['rss'].substr(0, FeedItem['feed']['rss'].indexOf(`</channel>`))

                                                for(let i = 0; i < items.length; i++){

                                                    subString = subString + items[i]
                                                }
                                                let end =` </channel>
                                                      </rss>`
                                                subString = subString + end

                                                FeedItem['feed']['rss'] = subString
                                                // console.log('~~~~~~~', obj['data']['timestamp'])
                                                // console.log(Date.parse(FeedItem['item']['date_modified']))
                                                // console.log('~~~~~~~~~~',FeedItem['feed'] )
                                                // console.assert(false,FeedItem['item'] )
                                                // console.assert(false, FeedItem['feed'])
                                                /**
                                                 * save feed in mongo
                                                 *
                                                 */
                                                // console.assert(false, obj)
                                                channel = await matcher['mongo']({
                                                    input: 'action',
                                                    id: feedId,
                                                    data:  JSON.stringify(FeedItem['feed']),
                                                    type:'bid'
                                                }, 'update', 'type')

                                                /**
                                                 * create item
                                                 */
                                                // console.assert(false, FeedItem['item'])
                                                await matcher['mongo']({
                                                    input: 'action',
                                                    data: JSON.stringify(FeedItem['item']),
                                                    id:FeedItem['feed']['option']['category'],
                                                    type:'bid'
                                                }, 'create', 'type')
                                                // console.assert(false, result)
                                                // store['action']['create'] = false
                                                location.reload()
                                                out(channel)
                                            }
                                        })

                                    })(obj, args[0], args[1], args[2], args[3])
                                    break
                                case 'background':
                                    store =  await staticProperty({
                                        input:'action',
                                        type: 'object'
                                    }, 'getObject', obj['id'])
                                    let objectURL = URL.createObjectURL(obj['file']);
                                    store['self'].querySelector('.wall').style.background = `url(${objectURL})`
                                    store['self'].querySelector('.wall').style.backgroundSize = `100%`
                                    out(obj)
                                    break
                                default:
                                    err(`необрабатываемый тип запроса ${obj[props]}` )
                                    break
                            }
                        } catch (e) { err(e) }
                    })(obj, args[0], args[1], args[2], args[3])

                    break
                case 'set':
                    (async (obj, props,data) => {
                        try {
                            console.log(`${obj['input']}[(action)${obj[props]}]`)
                            switch (obj[props]) {
                                case 'store':
                                    out(await staticProperty({
                                        input: obj['input'],
                                        obj,
                                        type: 'obj',
                                        name: obj['input']
                                    }, 'set', 'type'))
                                    break
                                case 'IntersectionObserver':

                                    out(IntersectionObserver({
                                        input: 'action',
                                        type: 'observer',
                                        this: obj['this'],
                                        target: obj['target']
                                    }, 'set', 'type'))
                                    break
                                default:
                                    err(`необрабатываемый тип запроса set ${obj[props]}` )
                                    break
                            }
                        } catch (e) { err(e) }
                    })(obj, args[0], args[1], args[2], args[3])

                    break
                case 'delete':
                    (async (obj, props,data) => {
                        try {
                            console.log(`${obj['input']}[(action)${obj[props]}]`)
                            let store = {}
                            switch (obj[props]) {
                                case 'news':
                                    store =  await staticProperty({
                                        input:'action',
                                        type: 'all'
                                    }, 'get', 'type')

                                    /**
                                     * get current feed
                                     */
                                    let feeds = await matcher['mongo']({
                                        input: 'action',
                                        relation: obj['input'],
                                        type:'feeds'
                                    }, 'get', 'type')


                                    /**
                                     * get items
                                     */
                                    let items = await feed({
                                        input: 'action',
                                        relation: obj['input'],
                                        data: feeds['mongo'][0]['feed']['rss'],
                                        func: config['parseString']['parseString'],
                                        type:'items'
                                    }, 'get', 'type')


                                    /**
                                     * search item
                                     */
                                    let item = await feed({
                                        input: 'action',
                                        relation: obj['input'],
                                        data: items,
                                        target: obj['date']['utc'],
                                        type:'item'
                                    }, 'search', 'type')

                                    /**
                                     * create feed
                                     */
                                    let newFeeds = await feed({
                                        input:'action',
                                        feed:feeds['mongo'][0]['feed'],
                                        items: item['feed'],
                                        type: 'feed'
                                    }, 'create', 'type')
                                    /**
                                     * update mongo feed
                                     */
                                    feeds['mongo'][0]['feed']['rss'] = newFeeds
                                    let feedId = feeds['mongo'][0]['_id']
                                    /**
                                     * update feed it mongo
                                     */
                                    await  matcher['mongo']({
                                        input: 'action',
                                        relation: obj['input'],
                                        id: feedId,
                                        data: JSON.stringify(feeds['mongo'][0]['feed']),
                                        type:'feed'
                                    }, 'update', 'type')


                                    // console.assert(false, obj['date'])

                                    await  matcher['mongo']({
                                        input: 'action',
                                        id: {date:obj['date']['iso']},
                                        type:'item'
                                    }, 'delete', 'type')
                                    obj['remove'].remove()
                                    out(newFeeds)
                                    break
                                case 'bid':
                                    (async (obj, props,data) => {
                                        store =  await staticProperty({
                                            input:'action',
                                            type: 'all'
                                        }, 'get', 'type')

                                        /**
                                         * get current feed
                                         */
                                        let  feeds = await  matcher['mongo']({
                                            input: 'action',
                                            relation: obj['input'],
                                            type:'bids'
                                        }, 'get', 'type')

                                        /**
                                         * get items
                                         */
                                        let items = await feed({
                                            input: 'action',
                                            relation: obj['input'],
                                            data: feeds['mongo'][0]['feed']['rss'],
                                            func: config['parseString']['parseString'],
                                            type:'items'
                                        }, 'get', 'type')

                                        /**
                                         * search item
                                         */
                                        let item = await feed({
                                            input: 'action',
                                            relation: obj['input'],
                                            data: items,
                                            target: obj['date']['utc'],
                                            type:'item'
                                        }, 'search', 'type')
                                        /**
                                         * create feed
                                         */

                                        let newFeeds = await feed({
                                            input:'action',
                                            feed:feeds['mongo'][0]['feed'],
                                            items: item['feed'],
                                            type: 'feed'
                                        }, 'create', 'type')

                                        /**
                                         * update mongo feed
                                         */
                                        feeds['mongo'][0]['feed']['rss'] = newFeeds
                                        let feedId = feeds['mongo'][0]['_id']
                                        /**
                                         * update feed it mongo
                                         */
                                        await  matcher['mongo']({
                                            input: 'action',
                                            relation: obj['input'],
                                            id: feedId,
                                            data: JSON.stringify(feeds['mongo'][0]['feed']),
                                            type:'bid'
                                        }, 'update', 'type')
                                        await  matcher['mongo']({
                                            input: 'action',
                                            id: {date:obj['date']['iso']},
                                            type:'itemBid'
                                        }, 'delete', 'type')
                                        obj['remove'].remove()
                                        out(newFeeds)
                                    })(obj, args[0], args[1], args[2], args[3])
                                    break
                                case 'moderator':

                                    let del = await matcher['webdav']({
                                        input:'action',
                                        type:'moderator',
                                        data:obj['date'],
                                        path:`/moderator/${obj['date']}`
                                    },'delete','type')
                                    out({delete:'ok'})
                                    break
                                default:
                                    err(`необрабатываемый тип запроса set ${obj[props]}` )
                                    break
                            }
                        } catch (e) { err(e) }
                    })(obj, args[0], args[1], args[2], args[3])

                    break
                case 'update':
                    (async (obj, props,data) => {
                        try {
                            console.log(`${obj['input']}[(action)${obj[props]}]`)
                            let store = {}
                            switch (obj[props]) {
                                case 'bid':
                                   await (async (obj, props,data) => {
                                        /**
                                         * get current feed
                                         */
                                        let feeds = await matcher['mongo']({
                                            input: 'action',
                                            type:'bidItem',
                                            date: obj['date']['iso']
                                        }, 'get', 'type')


                                        /**
                                         * получаем хранилище
                                         */
                                        store =  await staticProperty({
                                            input:'action',
                                            type: 'all'
                                        }, 'get', 'type')

                                        console.log('ddddddddddddddddddddddddddddddddd', store)
                                        /**
                                         * собираю всю информацию
                                         * @type {{}}
                                         */
                                        let content = {}
                                        let img = feeds['mongo']['item']['image']
                                        let title = feeds['mongo']['item']['title']
                                        let time = feeds['mongo']['item']['details']['time']
                                        let price = feeds['mongo']['item']['details']['price']
                                        let content_html =  await   utils({
                                            input:'varan-menu',
                                            data: feeds['mongo']['item']['content_html'],
                                            type:'string2html'
                                        },'convert', 'type')
                                        let summary =await   utils({
                                            input:'varan-menu',
                                            data: feeds['mongo']['item']['summary'],
                                            type:'string2html'
                                        },'convert', 'type')

                                        for(let i = 0; i < store['varan-card-news'].length; i ++){
                                            switch (store['varan-card-news'][i].slot) {
                                                case "card-admin":
                                                    let admin = store['varan-card-news'][i]['this'].shadowRoot.querySelectorAll('.section')[1]

                                                    admin.querySelector('.nameBid').value = title
                                                    admin.querySelector('.imgBidAdmin').src = img
                                                    admin.querySelector('.timerValue').value = time
                                                    admin.querySelector('.priceValue').value = price

                                                    console.log(obj['date']['timestamp'])
                                                    let className =admin.querySelector('.item').className
                                                    className = `${className}_${obj['date']['timestamp']}`
                                                    admin.querySelector('.item').className = className
                                                    break
                                                default:
                                                    console.warn('~~~~~~~~~', 'На этот объект нет действия ',store['varan-editor'][i].slot )
                                                    break
                                            }

                                        }
                                        let menu = {}
                                        let menuSource = {}
                                        for(let i = 0; i < store['varan-editor'].length; i ++){
                                            switch (store['varan-editor'][i].slot) {
                                                case 'cardDescription':
                                                    // console.assert(false, item['item']['description'][0])
                                                    content['description'] = summary
                                                    if(store['varan-editor'][i]['menu'].querySelector('.menu-convert') === null ||
                                                        store['varan-editor'][i]['menu'].querySelector('.menu-convert') === 'null'){
                                                        menu = store['varan-editor'][i]['menu'].shadowRoot

                                                    }else{
                                                        menu = store['varan-editor'][i]['menu']

                                                    }
                                                    if(menu.querySelector('.update') === null){
                                                        menu.querySelector('.menu-convert').insertAdjacentHTML('afterend', `<button class="update" type="button">update</button>`)
                                                        addEventListener({
                                                            input:'action',
                                                            type:'menu-update',
                                                            data: menu.querySelector('.update')
                                                        }, 'add', 'type')
                                                    }else{
                                                        menu.querySelector('.update').remove()

                                                        menu.querySelector('.menu-convert').insertAdjacentHTML('afterend', `<button class="update" type="button">update</button>`)
                                                        addEventListener({
                                                            input:'action',
                                                            type:'menu-update',
                                                            data: menu.querySelector('.update')
                                                        }, 'add', 'type')
                                                    }


                                                    // console.assert(false, store['varan-editor'][i]['obj']['this'])
                                                    store['varan-editor'][i]['obj']['this'].querySelector('.wall').innerHTML =  content['description']
                                                    store['varan-editor'][i]['editor']['quill'].root.innerHTML = content['description']
                                                    break
                                                case 'cardContent':
                                                    // console.assert(false, item['item']['content:encoded'][0])
                                                    content['content'] = content_html
                                                    if(store['varan-editor'][i]['menu'].querySelector('.menu-convert') === null ||
                                                        store['varan-editor'][i]['menu'].querySelector('.menu-convert') === 'null'){
                                                        menu = store['varan-editor'][i]['menu'].shadowRoot

                                                    }else{
                                                        menu = store['varan-editor'][i]['menu']

                                                    }
                                                    if(menu.querySelector('.update') === null){
                                                        menu.querySelector('.menu-convert').insertAdjacentHTML('afterend', `<button class="update" type="button">update</button>`)
                                                        addEventListener({
                                                            input:'action',
                                                            type:'menu-update',
                                                            data: menu.querySelector('.update')
                                                        }, 'add', 'type')
                                                    }else{
                                                        menu.querySelector('.update').remove()

                                                        menu.querySelector('.menu-convert').insertAdjacentHTML('afterend', `<button class="update" type="button">update</button>`)
                                                        addEventListener({
                                                            input:'action',
                                                            type:'menu-update',
                                                            data: menu.querySelector('.update')
                                                        }, 'add', 'type')
                                                    }
                                                    store['varan-editor'][i]['obj']['this'].querySelector('.wall').innerHTML =  content['content']
                                                    store['varan-editor'][i]['editor']['quill'].root.innerHTML = content['content']
                                                    break
                                                default:
                                                    console.warn('~~~~~~~~~', 'На этот объект нет действия ',store['varan-editor'][i].slot )
                                                    break
                                            }
                                        }
                                        obj['button'].innerText = 'данные в редакторe'
                                        setTimeout(()=>{
                                            obj['button'].innerText = 'изменить'
                                            obj['button'].disabled = false;
                                        }, 2000);

                                    })(obj, args[0], args[1], args[2], args[3])
                                    break
                                case 'news':
                                    /**
                                     * get current feed
                                     */
                                    let feeds = await matcher['mongo']({
                                        input: 'action',
                                        type:'feeds'
                                    }, 'get', 'type')
                                    let feedid = feeds['mongo'][0]['_id']
                                    /**
                                     * get items
                                     */
                                    let items = await feed({
                                        input: 'action',
                                        data: feeds['mongo'][0]['feed']['rss'],
                                        func: config['parseString']['parseString'],
                                        type:'items'
                                    }, 'get', 'type')
                                    /**
                                     * search item
                                     *
                                     */
                                    let item = await feed({
                                        input: 'action',
                                        data: items,
                                        target: obj['date']['utc'],
                                        type:'item'
                                    }, 'search', 'type')

                                    /**
                                     * получаем хранилище
                                     */
                                    store =  await staticProperty({
                                        input:'action',
                                        type: 'all'
                                    }, 'get', 'type')


                                    item['_id'] = feedid

                                    /**
                                     * собираю всю информацию
                                     * @type {{}}
                                     */
                                    let content = {}
                                    let img = item['remove']['enclosure'][0]['$']['url']
                                    let title = 'нет заголовка'
                                    if(item['remove']['title']){
                                        title =  item['remove']['title']
                                    }
                                    for(let i = 0; i < store['lacerta-news'].length; i ++){
                                        switch (store['lacerta-news'][i].slot) {
                                            case 'news-admin':
                                                store['lacerta-news'][i]['this'].shadowRoot.querySelector('.gallery').src = img
                                                store['lacerta-news'][i]['this'].shadowRoot.querySelector('#titleItem').value = title
                                                break
                                            default:
                                                console.warn('~~~~~~~~~', 'На этот объект нет действия ',store['varan-editor'][i].slot )
                                                break
                                        }

                                    }
                                    let menu = {}
                                    let menuSource = {}
                                    for(let i = 0; i < store['varan-editor'].length; i ++){
                                        switch (store['varan-editor'][i].slot) {
                                            case 'description':
                                                // console.assert(false, item['item']['description'][0])
                                                content['description'] = await   utils({
                                                    input:'varan-menu',
                                                    data: item['remove']['description'][0],
                                                    type:'string2html'
                                                },'convert', 'type')

                                                if(store['varan-editor'][i]['menu'].querySelector('.menu-convert') === null ||
                                                    store['varan-editor'][i]['menu'].querySelector('.menu-convert') === 'null'){
                                                    menu = store['varan-editor'][i]['menu'].shadowRoot

                                                }else{
                                                    menu = store['varan-editor'][i]['menu']

                                                }
                                                if(menu.querySelector('.update') === null){
                                                    menu.querySelector('.menu-convert').insertAdjacentHTML('afterend', `<button class="update" type="button">update</button>`)
                                                    addEventListener({
                                                        input:'action',
                                                        type:'menu-update',
                                                        data: menu.querySelector('.update')
                                                    }, 'add', 'type')
                                                }else{
                                                    menu.querySelector('.update').remove()

                                                    menu.querySelector('.menu-convert').insertAdjacentHTML('afterend', `<button class="update" type="button">update</button>`)
                                                    addEventListener({
                                                        input:'action',
                                                        type:'menu-update',
                                                        data: menu.querySelector('.update')
                                                    }, 'add', 'type')
                                                }


                                                // console.assert(false, store['varan-editor'][i]['obj']['this'])
                                                store['varan-editor'][i]['obj']['this'].querySelector('.wall').innerHTML =  content['description']
                                                store['varan-editor'][i]['editor']['quill'].root.innerHTML = content['description']
                                                break
                                            case 'content':
                                                // console.assert(false, item['item']['content:encoded'][0])
                                                content['content'] =  await  utils({
                                                    input:'varan-menu',
                                                    data: item['remove']['content:encoded'][0],
                                                    type:'string2html'
                                                },'convert', 'type')
                                                if(store['varan-editor'][i]['menu'].querySelector('.menu-convert') === null ||
                                                    store['varan-editor'][i]['menu'].querySelector('.menu-convert') === 'null'){
                                                    menu = store['varan-editor'][i]['menu'].shadowRoot

                                                }else{
                                                    menu = store['varan-editor'][i]['menu']

                                                }
                                                if(menu.querySelector('.update') === null){
                                                    menu.querySelector('.menu-convert').insertAdjacentHTML('afterend', `<button class="update" type="button">update</button>`)
                                                    addEventListener({
                                                        input:'action',
                                                        type:'menu-update',
                                                        data: menu.querySelector('.update')
                                                    }, 'add', 'type')
                                                }else{
                                                    menu.querySelector('.update').remove()

                                                    menu.querySelector('.menu-convert').insertAdjacentHTML('afterend', `<button class="update" type="button">update</button>`)
                                                    addEventListener({
                                                        input:'action',
                                                        type:'menu-update',
                                                        data: menu.querySelector('.update')
                                                    }, 'add', 'type')
                                                }
                                                store['varan-editor'][i]['obj']['this'].querySelector('.wall').innerHTML =  content['content']
                                                store['varan-editor'][i]['editor']['quill'].root.innerHTML = content['content']
                                                break
                                            default:
                                                console.warn('~~~~~~~~~', 'На этот объект нет действия ',store['varan-editor'][i].slot )
                                                break
                                        }
                                    }
                                    for(let i = 0; i < store['lacerta-news'].length; i ++){
                                        switch (store['lacerta-news'][i].slot) {
                                            case 'news-admin':
                                                // console.log(content)
                                                store['lacerta-news'][i]['obj']['this'].shadowRoot.querySelector('.date').innerHTML = obj['date']['timestamp']
                                                break
                                            default:
                                                // console.warn('~~~~~~~~~', 'На этот объект нет действия ',store['lacerta-news'][i].slot )
                                                break
                                        }
                                    }
                                    obj['button'].innerText = 'данные в редакторe'
                                    setTimeout(()=>{
                                        obj['button'].innerText = 'изменить'
                                        obj['button'].disabled = false;
                                    }, 2000);
                                    break

                                case 'news-item':

                                    /**
                                     * получаем хранилище
                                     */
                                    store =  await staticProperty({
                                        input:'action',
                                        type: 'all'
                                    }, 'get', 'type')

                                    let feedItem = await matcher['mongo']({
                                        input: 'action',
                                        type:'feeds'
                                    }, 'get', 'type')
                                    let feedidItem = feedItem['mongo'][0]['_id']

                                    let itemsItems = await feed({
                                        input: 'action',
                                        relation: obj['input'],
                                        data: feedItem['mongo'][0]['feed']['rss'],
                                        func: config['parseString']['parseString'],
                                        type:'items'
                                    }, 'get', 'type')


                                    let itemItems = await feed({
                                        input: 'action',
                                        data: itemsItems,
                                        target: obj['date']['utc'],
                                        type:'item'
                                    }, 'search', 'type')




                                    itemItems['remove']['content:encoded'][0] = obj['data']['content']
                                    itemItems['remove']['description'][0] = obj['data']['short_content']
                                    itemItems['remove']['enclosure'][0]['$']['url'] = obj['data']['image']['data']
                                    itemItems['remove']['title'][0] = obj['data']['title']





                                    itemItems['feed'].unshift( itemItems['remove'])

                                    /**
                                     * create feed
                                     */
                                    let newFeeds = await feed({
                                        input:'action',
                                        feed:feedItem['mongo'][0]['feed'],
                                        items: itemItems['feed'],
                                        type: 'feed'
                                    }, 'create', 'type')
                                    /**
                                     * update mongo feed
                                     */
                                    feedItem['mongo'][0]['feed']['rss'] = newFeeds


                                    /**
                                     * update feed it mongo
                                     */
                                    let feedidItems = feedItem['mongo'][0]['_id']
                                    let mongoFeed =  await  matcher['mongo']({
                                        input: 'action',
                                        id: feedidItems,
                                        data: JSON.stringify(feedItem['mongo'][0]['feed']),
                                        type:'feed'
                                    }, 'update', 'type')

                                    /**
                                     * get old items
                                     */
                                    let oldItem = await matcher['mongo']({
                                        input: 'action',
                                        type:'item',
                                        id: obj['date']['iso']
                                    }, 'get', 'type')

                                    if(oldItem['mongo'] === null){
                                        console.warn('нет id для обновления')
                                        // out(newFeeds)
                                    }else{
                                        oldItem['mongo']['item']['content_html'] = obj['data']['content']

                                        oldItem['mongo']['item']['summary'] = obj['data']['short_content']

                                        oldItem['mongo']['item']['image'] = obj['data']['image']['data']
                                        oldItem['mongo']['item']['title'] = obj['data']['title']
                                        /**
                                         * update item to mongo
                                         */
                                        let mongoItem =  await  matcher['mongo']({
                                            input: 'action',
                                            id: obj['date']['iso'],
                                            data: JSON.stringify(oldItem['mongo']['item']),
                                            type:'item'
                                        }, 'update', 'type')
                                    }



                                    let contentSource =  await  utils({
                                        input:'varan-menu',
                                        data: obj['data']['content'],
                                        type:'string2html'
                                    },'convert', 'type')
                                    let description =  await  utils({
                                        input:'varan-menu',
                                        data: obj['data']['short_content'],
                                        type:'string2html'
                                    },'convert', 'type')
                                    for(let i = 0; i < store['lacerta-news'].length; i ++){
                                        switch (store['lacerta-news'][i].slot) {
                                            case 'lacerta-news':
                                                let children =  store['lacerta-news'][i]['obj']['this'].shadowRoot.querySelector('#news').children

                                                for(let i =0; i < children.length;i++){
                                                    let time = children[i].querySelector('.timestamp').innerText
                                                    time =+time
                                                    if(obj['date']['timestamp'] === time){
                                                        let target = children[i]
                                                        target.querySelector('.gallery').src =  obj['data']['image']['data']
                                                        target.querySelector('.title').innerText = obj['data']['title']
                                                        target.querySelector('.contentOut').innerHTML = ''
                                                        target.querySelector('.contentOut').insertAdjacentHTML('beforeend',contentSource )
                                                        target.querySelector('.preview').innerHTML = ''
                                                        target.querySelector('.preview').insertAdjacentHTML('beforeend',description )
                                                    }

                                                }

                                                let out = {}
                                                for(let i = 0; i < store['varan-editor'].length; i ++){
                                                    switch (store['varan-editor'][i].slot) {
                                                        case 'description':
                                                            out = store['varan-editor'][i]['obj']['this'].querySelector('varan-menu')
                                                            if(out.shadowRoot === null || out.shadowRoot === undefined){

                                                            }else{
                                                                out = out.shadowRoot
                                                            }
                                                            out.querySelector('.menu-convert').disabled = false;
                                                            out.querySelector('.menu-convert').style.backgroundColor = '#e1e1e1';
                                                            out.querySelector('.menu-save').disabled = false;
                                                            out.querySelector('.menu-save').style.backgroundColor = '#e1e1e1';
                                                            out.querySelector('.update').remove()
                                                            break
                                                        case 'content':
                                                            out = store['varan-editor'][i]['obj']['this'].querySelector('varan-menu')
                                                            if(out.shadowRoot === null || out.shadowRoot === undefined){

                                                            }else{
                                                                out = out.shadowRoot
                                                            }
                                                            out.querySelector('.menu-convert').disabled = false;
                                                            out.querySelector('.menu-convert').style.backgroundColor = '#e1e1e1';
                                                            out.querySelector('.menu-save').disabled = false;
                                                            out.querySelector('.menu-save').style.backgroundColor = '#e1e1e1';
                                                            out.querySelector('.update').remove()
                                                            break
                                                        default:
                                                            // console.warn('~~~~~~~~~', 'На этот объект нет действия ',store['lacerta-news'][i].slot )
                                                            break
                                                    }
                                                }
                                                break
                                            default:
                                                console.warn('~~~~~~~~~', 'На этот объект нет действия ',store['varan-editor'][i].slot )
                                                break
                                        }

                                    }


                                    break
                                case 'bid-item':
                                    (async (obj, props,data) => {
                                        /**
                                         * получаем хранилище
                                         */
                                        store =  await staticProperty({
                                            input:'action',
                                            type: 'all'
                                        }, 'get', 'type')


                                        let feedItem = await matcher['mongo']({
                                            input: 'action',
                                            type:'bids'
                                        }, 'get', 'type')


                                        let feedidItem = feedItem['mongo'][0]['_id']
                                        // console.assert(false,feedItem['mongo'][0]['feed']['rss'] )
                                        let itemsItems = await feed({
                                            input: 'action',
                                            relation: obj['input'],
                                            data: feedItem['mongo'][0]['feed']['rss'],
                                            func: config['parseString']['parseString'],
                                            type:'items'
                                        }, 'get', 'type')


                                        let itemItems = await feed({
                                            input: 'action',
                                            data: itemsItems,
                                            target: obj['date']['utc'],
                                            type:'item'
                                        }, 'search', 'type')




                                        itemItems['remove']['content:encoded'][0] = obj['data']['content']
                                        itemItems['remove']['description'][0] = obj['data']['short_content']
                                        itemItems['remove']['enclosure'][0]['$']['url'] = obj['data']['image']['data']
                                        itemItems['remove']['title'][0] = obj['data']['title']





                                        itemItems['feed'].unshift( itemItems['remove'])

                                        /**
                                         * create feed
                                         */
                                        let newFeeds = await feed({
                                            input:'action',
                                            feed:feedItem['mongo'][0]['feed'],
                                            items: itemItems['feed'],
                                            type: 'feed'
                                        }, 'create', 'type')
                                        /**
                                         * update mongo feed
                                         */
                                        feedItem['mongo'][0]['feed']['rss'] = newFeeds


                                        /**
                                         * update feed it mongo
                                         */
                                        let feedidItems = feedItem['mongo'][0]['_id']

                                        let mongoFeed =  await  matcher['mongo']({
                                            input: 'action',
                                            id: feedidItems,
                                            data: JSON.stringify(feedItem['mongo'][0]['feed']),
                                            type:'bid'
                                        }, 'update', 'type')
                                        /**
                                         * get old items
                                         */
                                        let oldItem = await matcher['mongo']({
                                            input: 'action',
                                            type:'bidItem',
                                            date: obj['date']['iso']
                                        }, 'get', 'type')


                                        if(oldItem['mongo'] === null){
                                            console.warn('нет id для обновления')
                                            // out(newFeeds)
                                        }else{
                                            oldItem['mongo']['item']['content_html'] = obj['data']['content']
                                            oldItem['mongo']['item']['summary'] = obj['data']['short_content']
                                            oldItem['mongo']['item']['image'] = obj['data']['image']['data']
                                            oldItem['mongo']['item']['title'] = obj['data']['title']
                                            oldItem['mongo']['item']['details']['price'] = obj['data']['price']
                                            oldItem['mongo']['item']['details']['time'] = obj['data']['time']
                                            /**
                                             * update item to mongo
                                             */
                                            await  matcher['mongo']({
                                                input: 'action',
                                                id: obj['date']['iso'],
                                                data: JSON.stringify(oldItem['mongo']['item']),
                                                type:'itemBid'
                                            }, 'update', 'type')
                                        }



                                        let contentSource =  await  utils({
                                            input:'varan-menu',
                                            data: obj['data']['content'],
                                            type:'string2html'
                                        },'convert', 'type')
                                        let description =  await  utils({
                                            input:'varan-menu',
                                            data: obj['data']['short_content'],
                                            type:'string2html'
                                        },'convert', 'type')
                                        for(let i = 0; i < store['varan-card-news'].length; i ++){
                                            switch (store['varan-card-news'][i].slot) {
                                                case 'card-admin':
                                                    let admin = store['varan-card-news'][i]['this'].shadowRoot.querySelectorAll('.section')[0]
                                                    let children =  admin.children

                                                    for(let i =0; i < children.length;i++){
                                                        let time = +children[i].className.split('_')[1]
                                                        if(obj['date']['timestamp'] === time){
                                                            let target = children[i]



                                                            target.querySelector('.preview').innerHTML = ''
                                                            target.querySelector('.preview').innerText = obj['data']['title']
                                                            target.querySelector('.imgBid').src = obj['data']['image']['data']
                                                            target.querySelector('.timer').innerText = ''
                                                            target.querySelector('.timer').innerText = `00:${obj['data']['time']}:00`
                                                            target.querySelector('.price').innerText = ''
                                                            target.querySelector('.price').innerText = `Waves: ${obj['data']['price']}`
                                                        }

                                                    }

                                                    let out = {}
                                                    for(let i = 0; i < store['varan-editor'].length; i ++){
                                                        switch (store['varan-editor'][i].slot) {
                                                            case 'cardDescription':
                                                                out = store['varan-editor'][i]['this'].querySelector('varan-menu')
                                                                if(out.shadowRoot === null || out.shadowRoot === undefined){

                                                                }else{
                                                                    out = out.shadowRoot
                                                                }
                                                                out.querySelector('.menu-convert').disabled = false;
                                                                out.querySelector('.menu-convert').style.backgroundColor = '#e1e1e1';
                                                                out.querySelector('.menu-save').disabled = false;
                                                                out.querySelector('.menu-save').style.backgroundColor = '#e1e1e1';
                                                                out.querySelector('.update').remove()
                                                                break
                                                            case 'cardContent':
                                                                out = store['varan-editor'][i]['this'].querySelector('varan-menu')
                                                                if(out.shadowRoot === null || out.shadowRoot === undefined){

                                                                }else{
                                                                    out = out.shadowRoot
                                                                }
                                                                out.querySelector('.menu-convert').disabled = false;
                                                                out.querySelector('.menu-convert').style.backgroundColor = '#e1e1e1';
                                                                out.querySelector('.menu-save').disabled = false;
                                                                out.querySelector('.menu-save').style.backgroundColor = '#e1e1e1';
                                                                out.querySelector('.update').remove()
                                                                break
                                                            default:
                                                                // console.warn('~~~~~~~~~', 'На этот объект нет действия ',store['lacerta-news'][i].slot )
                                                                break
                                                        }
                                                    }
                                                    break
                                                default:
                                                    console.warn('~~~~~~~~~', 'На этот объект нет действия ',store['varan-editor'][i].slot )
                                                    break
                                            }

                                        }

                                    })(obj, args[0], args[1], args[2], args[3])
                                    break
                                default:
                                    err(`необрабатываемый тип запроса set ${obj[props]}` )
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
