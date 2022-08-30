import action from '/static/html/components/component_modules/action/action.mjs'
import utils from '/static/html/components/component_modules/utils/utils.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import Feed from '/static/html/components/component_modules/feed/module/feed-bundle.mjs'
let feed = Feed['default']
export default  (obj, func, ...args)=>{
    return new Promise( async (resolve, reject) => {
            let out = (obj) => {
                //console.log('~~~ out router ~~~')
                resolve(obj)
            }
            let err = (error) => {
                console.log('~~~ err router ~~~', error)
                reject(error)
            }
            switch (func) {
                case 'create':
                   await (async (obj, props,data) => {
                        try {
                            console.log(`${obj['input']}[${func}][(feed)${obj[props]}]`)
                            let news = {}
                            let feed = {}
                            let item = {}
                            switch (obj[props]) {
                                case 'channel':
                                    if(isEmpty(obj['name'])){
                                       obj['name'] = 'default'
                                    }
                                    switch(obj['name']){
                                        case'bid':
                                            news['option'] ={
                                                title: "Аукцион",
                                                description: "описание",
                                                id: "https://www.universitykids.ru/",
                                                link: "https://www.universitykids.ru/rss",
                                                language: "ru",
                                                webMaster: "s.zababurin.v@gmail.com",
                                                image: "https://www.universitykids.ru/universitykids.jpg",
                                                favicon: "https://www.universitykids.ru/favicon.ico",
                                                copyright: "All rights reserved 2019, Zababurin Sergey",
                                                generator: "awesome",
                                                author: {
                                                    name: "Zababurin Sergey",
                                                    email: "s.zababurin.v@gmail.com",
                                                    link: "https://vk.com/zababurin"
                                                },
                                                category:'product'
                                            }
                                            feed = new feed['feed'](news['option']);
                                            feed.addCategory("product");
                                            news['json'] = feed.json1()
                                            news['rss'] = feed.rss2()
                                            news['atom'] = feed.atom1()
                                        break
                                        default:
                                            news['option'] ={
                                                title: "Детский университет",
                                                description: "Сайт предоставляет родителям и детям возможность" +
                                                    " публикации проектно-исследовательских работ" +
                                                    " Эксперты смогут просмотреть проекты" +
                                                    " в любое время и жать необходимые комментарии.",
                                                id: "https://www.universitykids.ru/",
                                                link: "https://www.universitykids.ru/rss",
                                                language: "ru",
                                                webMaster: "s.zababurin.v@gmail.com",
                                                image: "https://www.universitykids.ru/universitykids.jpg",
                                                favicon: "https://www.universitykids.ru/favicon.ico",
                                                copyright: "All rights reserved 2019, Zababurin Sergey",
                                                generator: "awesome",
                                                author: {
                                                    name: "Zababurin Sergey",
                                                    email: "s.zababurin.v@gmail.com",
                                                    link: "https://vk.com/zababurin"
                                                },
                                                category:'education'
                                            }
                                            feed = new feed['feed'](news['option']);
                                            feed.addCategory("education");
                                            news['json'] = feed.json1()
                                            news['rss'] = feed.rss2()
                                            news['atom'] = feed.atom1()
                                        break
                                    }
                                    out(news)
                                    break
                                case 'item':
                                    feed = new feed['feed'](obj['feed']['option']);


                                    if(isEmpty(obj['data']['rss'])){
                                        obj['data']['rss'] = 'default'
                                    }
                                    switch (obj['data']['rss']) {
                                        case'bid':
                                            break
                                        default:
                                            break

                                    }


                                     item = {
                                        title:  obj['data']['title'],
                                        link:obj['data']['url'],
                                        description: obj['data']['short_content'],
                                        content: obj['data']['content'],
                                        author: [
                                            {
                                                name: "Zababurin Sergey",
                                                email: "s.zababurin.v@gmail.com",
                                                link: "https://vashi-faili.firebaseapp.com/"
                                            }
                                        ],
                                        date: new Date(obj['data']['timestamp']),
                                        image: obj['data']['image']['data']
                                    }

                                    feed.addItem(item);
                                    obj['feed']['json'] = feed.json1()
                                    obj['feed']['rss'] = feed.rss2()
                                    obj['feed']['atom'] = feed.atom1()
                                    obj['item'] = {}
                                    obj['item'] = JSON.parse(feed.json1()).items[0]
                                    obj['item']['date_modified'] = obj['item']['date_modified'].replace(/(\..*$)/g,'.000Z')
                                    obj['timestamp'] = obj['data']['timestamp']
                                    out(obj)
                                    break
                                case 'feed':
                                   let newFeed = new feed['feed'](obj['feed']['option']);

                                    // console.log(obj['items'])
                                    // console.assert(false, obj['items'][0]['title'])
                                    // console.log(obj['items'][0]['title'][0])
                                    // console.log(obj['items'][0]['guid'][0])
                                    //
                                    // console.assert(false, obj['items'])
                                   let newItems = []
                                    for(let i =0; i < obj['items'].length;i++){

                                        let tmp = `    <item>
            <title>${obj['items'][i]['title'][0]}</title>
            <guid>${obj['items'][i]['guid'][0]}</guid>
             <link>${obj['items'][i]['link'][0]}</link>
            <pubDate>${obj['items'][i]['pubDate'][0]}</pubDate>
            <description>${obj['items'][i]['description'][0]}</description>
            <content:encoded>${obj['items'][i]['content:encoded'][0]}</content:encoded>
            <author>${obj['items'][i]['author'][0]}</author>
            <enclosure url="${obj['items'][i]['enclosure'][0]['$']['url']}"/>
</item>`
                                        newItems.push(tmp)
                                    }

                                  let temp =  newFeed.rss2()
                                    let subString =  temp.substr(0,temp.indexOf(`</channel>`))
                                    for(let i = 0; i < newItems.length; i++){

                                        subString = subString + newItems[i]
                                    }
                                    let end =` </channel>
                                               </rss>`

                                    subString = subString + end

                                    out(subString)
                                    break
                                default:
                                    err(`необрабатываемый тип запроса ${obj[props]}` )
                                    break
                            }
                        } catch (e) { err(e) }
                    })(obj, args[0], args[1], args[2], args[3])
                    break
                case 'convert':
                   await (async (obj, props,data) => {
                        try {
                            console.log(`${obj['input']}[${func}][(feed)${obj[props]}]`)

                            switch (obj[props]) {
                                case 'rss':
                                    const feed = new feed['feed'](obj['data']);
                                    out(feed.rss2())
                                    break
                                case 'light':

                                    break
                                default:
                                    err(`необрабатываемый тип запроса ${obj[props]}` )
                                    break
                            }

                            // console.assert(false, feed['feed'])


                        } catch (e) { err(e) }
                    })(obj, args[0], args[1], args[2], args[3])
                    break
                case 'get':
                   await (async (obj, props,data) => {
                        try {
                            console.log(`${obj['input']}[${func}][(feed)${obj[props]}]`)
                            switch (obj[props]) {
                                case 'yandex':
                                    const CORS_PROXY = "https://cors-anywhere.herokuapp.com/"
                                    let parser = new feed['parser']();
                                    parser.parseURL(CORS_PROXY + 'https://news.yandex.ru/culture.rss', function(err, feed) {


                                        console.log('~~~~~~~~', feed)


                                    })


                                    // feed.items.forEach(item => {
                                    //     console.log(item.title + ':' + item.link)
                                    // });
                                    // template({
                                    //     input:"rss",
                                    //     export: '',
                                    //     import: feed,
                                    //     self: obj
                                    //
                                    // }, 'news', 'import')
                                    //     .then((template)=>{
                                    //
                                    //
                                    //         console.assert(false, template)
                                    // out(template)
                                    // })

                                    break
                                case 'feeds':

                                    out(action({
                                        input:'feed',
                                        type:'feeds'
                                    }, 'get', 'type'))


                                    break
                                case 'items':
                                    obj['func'](obj['data'], async function (err, result) {

                                        // console.assert(false, result['rss']['channel'][0]['item'])

                                        out(result['rss']['channel'][0]['item'])

                                    })
                                    break
                                default:
                                    err(`необрабатываемый тип запроса ${obj[props]}` )
                                    break
                            }

                            // console.assert(false, feed['feed'])


                        } catch (e) { err(e) }
                    })(obj, args[0], args[1], args[2], args[3])
                    break
                case 'search':
                  await  (async (obj, props,data) => {
                        try {
                            console.log(`${obj['input']}[${func}][(feed)${obj[props]}]`)
                            switch (obj[props]) {
                                case 'item':
                                    let remove = {}
                                    let items = []
                                    // const filter = obj['data'].filter((item) => item.pubDate[0] !== obj['target']);

                                    for(let i = 0; i < obj['data'].length;i++){
                                        if(obj['data'][i].pubDate[0] === obj['target']){
                                            remove = obj['data'][i]
                                        }else{
                                            items.push(obj['data'][i])
                                        }

                                    }

                                    let object = {}
                                    object['feed'] = items
                                    object['remove'] = remove
                                    out(object)
                                    break
                                default:
                                    err(`необрабатываемый тип запроса ${obj[props]}` )
                                    break
                            }
                        } catch (e) { err(e) }
                    })(obj, args[0], args[1], args[2], args[3])
                    break
                case 'find':
                   await (async (obj, props,data) => {
                        try {
                            console.log(`${obj['input']}[${func}][(feed)${obj[props]}]`)
                            switch (obj[props]) {
                                case 'item':
                                    let verify = false

                                    for(let i = 0; i < obj['data'].length; i++){

                                        console.assert(false)
                                        let dateItem = await utils({
                                            input:'action',
                                            data:obj['data'][i]['item']['date_modified'],
                                            type:'feedDate'
                                        },'convert', 'type')


                                        if(dateItem['all'] === obj['target']){
                                            verify = true
                                            out(obj['data'][i]['_id'])
                                            break
                                        }
                                    }
                                    if(verify === true){


                                    }else{
                                        out(undefined)
                                    }
                                    break
                                case 'itemUpdate':
                                    let verifyUpdate = false
                                    for(let i = 0; i < obj['data'].length; i++){

                                        console.log('~~1~~~', Date.parse(obj['data'][i]['item']['date_modified']))
                                        console.log('~~2~~~', obj['target'])
                                        if(Date.parse(obj['data'][i]['item']['date_modified']) === obj['target']){
                                            verifyUpdate = true
                                            out(obj['data'][i])
                                            break
                                        }
                                    }
                                    if(verifyUpdate === true){


                                    }else{
                                        out(undefined)
                                    }
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
