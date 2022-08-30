import utils from '/static/html/components/component_modules/utils/utils.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
function msConversion(millis) {
    let sec = Math.floor(millis / 1000);
    let hrs = Math.floor(sec / 3600);
    sec -= hrs * 3600;
    let min = Math.floor(sec / 60);
    sec -= min * 60;

    sec = '' + sec;
    sec = ('00' + sec).substring(sec.length);

    if (hrs > 0) {
        if(min < 10){
            min = '0' + min;
        }else{
            min = '' + min;
        }

        min = ('00' + min).substring(min.length);
        return hrs + ":" + min + ":" + sec;
    }
    else {
        if(min < 10){
            min = '0' + min;
        }else{
            min = '' + min;
        }
        return '00:'+min + ":" + sec;
    }
}
export default async (obj, func, ...args)=>{
    return new Promise(async function (resolve, reject) {
        let out = (obj) => {
            // //console.log('~~~ out router ~~~')
            resolve(obj)
        }
        let err = (error) => {
            console.log('~~~ err router ~~~', error)
            reject(error)
        }
        switch (func) {
            case 'create':
               await (async (obj, props,data, server) => {
                    try {
                        console.log(`${obj['input']}[(request)${obj[props]}]`)
                        let template = []
                        switch (obj[props]) {
                            case 'news':
                                let newsDescription  = await   utils({
                                    input:'varan-menu',
                                    data: obj['data']['content'],
                                    type:'string2html'
                                },'convert', 'type')
                                let newsContent  = await   utils({
                                    input:'varan-menu',
                                    data: obj['data']['content:encoded'],
                                    type:'string2html'
                                },'convert', 'type')

                                let feed = `<!--
        --><details class="item item_${Date.parse(obj['data']['isoDate'])}"><!--
        --><div class="timestamp" style="display: none">${Date.parse(obj['data']['isoDate'])}</div><!--
                --><summary class="item_content"><!--
                            --><section  class="news"><!--
                                    --><div class="hexagon"><!--
                                        --><img class="gallery" src="${obj['data']['enclosure']['url']}" alt ="photo"/><!--
                                    --></div><!--
                                    --><div class="information"><!--
                                        --><h2 class="title"><!--
                                           -->${obj['data']['title']}<!--
                                        --></h2><!--
                                        --><h3 class="date">${obj['data']['isoDate']}</h3><!--
                                        --><div class="short-content"><!--
                                            --><details class="content"><!--
                                                --><summary class="preview"><!--
                                                        -->${newsDescription}<!--
                                                --></summary><!--
                                                --><div class="contentOut"><!--
                                                -->${newsContent}<!--
                                                --></div><!--
                                            --></details><!--
                                        --></div><!--
                                    --></div><!--
                            --></section><!--
                --></summary><!--
                --><div class="menu"><!--
                    --><button class="delete"> удалить </button><!--
                    --><button class="change"> изменить </button><!--
                --></div><!--
            --></details>`



                                out(feed)
                                break
                            case 'template':
                                for(let i = 0; i < obj['data'].length; i++){

                                    let description  = await   utils({
                                        input:'varan-menu',
                                        data: obj['data'][i]['content'],
                                        type:'string2html'
                                    },'convert', 'type')
                                    let content  = await   utils({
                                        input:'varan-menu',
                                        data: obj['data'][i]['content:encoded'],
                                        type:'string2html'
                                    },'convert', 'type')

                                    // console.assert(false,obj['data'][i]['pubDate'])
                                    let feed = `<!--
        --><details class="item item_${i}"><!--
        --><div class="timestamp" style="display: none">${Date.parse(obj['data'][i]['isoDate'])}</div><!--
                --><summary class="item_content"><!--
                            --><section  class="news"><!--
                                    --><div class="hexagon"><!--
                                        --><img class="gallery" src="${obj['data'][i]['enclosure']['url']}" alt ="photo"/><!--
                                    --></div><!--
                                    --><div class="information"><!--
                                        --><h2 class="title"><!--
                                           -->${obj['data'][i]['title']}<!--
                                        --></h2><!--
                                        --><h3 class="date">${obj['data'][i]['isoDate']}</h3><!--
                                        --><div class="short-content"><!--
                                            --><details class="content"><!--
                                                --><summary class="preview"><!--
                                                        -->${description}<!--
                                                --></summary><!--
                                                --><div class="contentOut"><!--
                                                -->${content}<!--
                                                --></div><!--
                                            --></details><!--
                                        --></div><!--
                                    --></div><!--
                            --></section><!--
                --></summary><!--
                --><div class="menu"><!--
                    --><button class="delete"> удалить </button><!--
                    --><button class="change"> изменить </button><!--
                --></div><!--
            --></details>`
                                    template.push(feed)
                                }

                                out(template)
                                break
                            case'about':
                                // console.assert(false, obj)
                                let description  = await   utils({
                                    input:'template',
                                    data:  obj['data'],
                                    type:'string2html'
                                },'convert', 'type')

                                let about = `<div class = "content">${description}</div>`

                                out(about)

                                break
                            case 'templateJson':

                                for(let i = 0; i < obj['data'].length; i++){

                                    let description  = await   utils({
                                        input:'varan-menu',
                                        data: obj['data'][i]['summary'],
                                        type:'string2html'
                                    },'convert', 'type')
                                    let content  = await   utils({
                                        input:'varan-menu',
                                        data: obj['data'][i]['content_html'],
                                        type:'string2html'
                                    },'convert', 'type')

                                    let feed = `<!--
        --><details class="item item_${i}"><!--
                --><div class="timestamp" style="display: none"></div><!--
                --><summary class="item_content"><!--
                            --><section  class="news"><!--
                                    --><div class="hexagon"><!--
                                        --><img class="gallery" src="${obj['data'][i]['image']}" alt ="photo"/><!--
                                    --></div><!--
                                    --><div class="information"><!--
                                        --><h2 class="title"><!--
                                           -->${obj['data'][i]['title']}<!--
                                        --></h2><!--
                                        --><h3 class="date">${obj['data'][i]['date']['all']}</h3><!--
                                        --><div class="short-content"><!--
                                            --><details class="content"><!--
                                                --><summary class="preview"><!--
                                                        -->${description}<!--
                                              --></summary><!--
                                                --><div class="contentOut"><!--
                                                -->${content}<!--
                                                --></div><!--
                                            --></details><!--
                                        --></div><!--
                                    --></div><!--
                            --></section><!--
                --></summary><!--
                --><div class="menu"><!--
                    --><button class="delete"> удалить </button><!--
                    --><button class="change"> изменить </button><!--
                --></div><!--
            --></details>`
                                    template.push(feed)
                                }

                                out(template)
                                break
                            case 'moderator':



                                let outTemplate = []
                                let html = {}
                                for(let i = 0; i < obj['data'].length; i++){

                                    let cont = await   utils({
                                        input:'template',
                                        data:obj['data'][i]['content'],
                                        type:'string2html'
                                    },'convert', 'type')
                                    let descr = await   utils({
                                        input:'template',
                                        data:obj['data'][i]['description'],
                                        type:'string2html'
                                    },'convert', 'type')


                                    if(data === undefined){

                                        if(obj['data'][i]['positionImg'] === false || obj['data'][i]['positionImg'] === 'false'){



                                            html =             `<!--


                            --><details class="adminMenu item_${i}" ><!--
                                --><div class="timestamp" style="display: none">${obj['data'][i]['timestamp']}</div><!--
                                                      --><summary class="adminContent"><!--
                                                      --><div class ="item"><!--
                                                      --><div class="news"><!--
                                                      --><h2><!--
                                                         -->${obj['data'][i]['title']}<!--
                                                  --></h2><div class="short-content"><details><summary class="preview">${descr}</summary><div class="content">${cont}</div><!--
                                          --></details><!--
                                                  --></div><!--
                                          --></div><!--
                                              --><div class="hexagon"><!--
                                                   --><img  class="moderator" src="${obj['data'][i]['img']}" alt="moderator"><!--
                                              --></div><!--
                                          --></div><!--
                                                      --></summary><!--
                                          --><div class="menu"><!--
                                                      --><button class="delete"> удалить </button><!--
                                                      --><button class="change"> изменить </button><!--
                                          --></div><!--
                                  --></details><!--
                                    
                                    `
                                        }else{

                                            html =       `<!--                  
                                                    --><details class="adminMenu item_${i}" ><!--
                                                       --><div class="timestamp" style="display: none">${obj['data'][i]['timestamp']}</div><!--
                                                    --><summary class="adminContent"><!--
                                                    --><div class ="item"><!--
                                                          --><div class="hexagon"><!--
                                                                         --><img  class="moderator" src="${obj['data'][i]['img']}" alt="moderator"><!--
                                                         --></div><!--
                                                    --><div class="news"><!--
                                                    --><h2><!--
                                                       -->${obj['data'][i]['title']}<!--
                                                --></h2><div class="short-content"><details><summary class="preview">${descr}</summary><div class="content">${cont}</div><!--
                                        --></details><!--
                                                --></div><!--
                                        --></div><!--
                                        --></div><!--
                                                    --></summary><!--
                                        --><div class="menu"><!--
                                                    --><button class="delete"> удалить </button><!--
                                                    --><button class="change"> изменить </button><!--
                                        --></div><!--
                                --></details> <!--`
                                        }

                                    }else{

                                        if(obj['data'][i]['positionImg'] === false || obj['data'][i]['positionImg'] === 'false'){



                                            html =             `<!--


                                --><details class="adminMenu item_${data}" ><!--
                                --><div class="timestamp" style="display: none">${obj['data'][i]['timestamp']}</div><!--
                                                      --><summary class="adminContent"><!--
                                                      --><div class ="item"><!--
                                                      --><div class="news"><!--
                                                      --><h2><!--
                                                         -->${obj['data'][i]['title']}<!--
                                                  --></h2><!--
                                                  --><div class="short-content"><details><summary class="preview">${descr}</summary><div class="content">${cont}</div><!--
                                          --></details><!--
                                                  --></div><!--
                                          --></div><!--
                                              --><div class="hexagon"><!--
                                                   --><img  class="moderator" src="${obj['data'][i]['img']}" alt="moderator"><!--
                                              --></div><!--
                                          --></div><!--
                                                      --></summary><!--
                                          --><div class="menu"><!--
                                                      --><button class="delete"> удалить </button><!--
                                                      --><button class="change"> изменить </button><!--
                                          --></div><!--
                                  --></details><!--
                                    
                                    `
                                        }else{

                                            html =       `<!--                  
                                                    --><details class="adminMenu item_${data}" ><!--
                                                       --><div class="timestamp" style="display: none">${obj['data'][i]['timestamp']}</div><!--
                                                    --><summary class="adminContent"><!--
                                                    --><div class ="item"><!--
                                                          --><div class="hexagon"><!--
                                                                         --><img  class="moderator" src="${obj['data'][i]['img']}" alt="moderator"><!--
                                                         --></div><!--
                                                    --><div class="news"><!--
                                                    --><h2><!--
                                                       -->${obj['data'][i]['title']}<!--
                                                --></h2><!--
                                                --><div class="short-content"><!--
                                                    --><details><!--
                                                    --><summary class="preview">${descr}</summary><!--
                                                --><div class="content">${cont}</div><!--
                                        --></details><!--
                                                --></div><!--
                                        --></div><!--
                                        --></div><!--
                                                    --></summary><!--
                                        --><div class="menu"><!--
                                                    --><button class="delete"> удалить </button><!--
                                                    --><button class="change"> изменить </button><!--
                                        --></div><!--
                                --></details> <!--`
                                        }

                                    }



                                    outTemplate.push(html)
                                }



                                out(outTemplate)
                                break
                            default:
                                err(`необрабатываемый тип запроса ${obj[props]}` )
                                break
                        }
                    } catch (e) { err(e) }
                })(obj, args[0], args[1], args[2], args[3])
                break
            case 'get':
                await (async (obj, props,data) => {
                    try {
                        // console.log(`app(${func}[(${obj['input']})${obj[props]}]property)`)
                        switch (obj[props]) {
                            case 'auth':
                                await (async (obj, props,data) => {
                                    try {
                                        let auth = `
                                            <div class="col-md-8 m-auto">
                                            <h1 class="display-4 text-center">
                                            Регистрация
                                            </h1>
                                            <p class="lead text-center">
                                            Создайте свой аккаунт
                                            </p>
                                            <form novalidate="">
                                            <div class="form-group">
                                            <input type="text" class="form-control form-control-lg" placeholder="Name" name="name" value="">
                                            </div>
                                            <div class="form-group">
                                            <input type="email" class="form-control form-control-lg" placeholder="Email" name="email" value="">
                                            <small class="form-text text-muted">
                                            This site uses Gravatar so if you want a profile image, use a Gravatar email
                                            </small>
                                            </div>
                                            <div class="form-group">
                                            <input type="password" class="form-control form-control-lg" placeholder="Password" name="password" value="">
                                            </div>
                                            <div class="form-group">
                                            <input type="password" class="form-control form-control-lg" placeholder="Confirm Password" name="password2" value="">
                                            </div>
                                            <input type="submit" class="btn btn-info btn-block mt-4">
                                            </form>
                                            </div>`
                                        out(auth)
                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])
                                break
                            case 'login':
                                await (async (obj, props,data) => {
                                    try {
                                        let login = `
                                             <div class="col-md-8 m-auto">
                                             <h1 class="display-4 text-center">
                                             Вход
                                             </h1>
                                             <p class="lead text-center">
                                                Войдите в свой аккаунт
                                             </p>
                                             <form>
                                             <div class="form-group">
                                             <input type="email" class="form-control form-control-lg" placeholder="Email Address" name="email" value="">
                                             </div>
                                             <div class="form-group">
                                             <input type="password" class="form-control form-control-lg" placeholder="Password" name="password" value="">
                                             </div>
                                             <input type="submit" class="btn btn-info btn-block mt-4">
                                             </form>
                                             </div>`
                                        out(login)
                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])
                                break
                            case 'card':
                                await (async (obj, props,data) => {
                                    try {
                                        let cont = await   utils({
                                            input:'template',
                                            data:obj['data']['content_html'],
                                            type:'string2html'
                                        },'convert', 'type')
                                        let descr = await   utils({
                                            input:'template',
                                            data:obj['data']['summary'],
                                            type:'string2html'
                                        },'convert', 'type')
                                        let lime = msConversion(obj['data']['details']['time']*60*1000)

                                        let html  = `
             <div class = "item timestamp_${Date.parse(obj['data']['date_modified'])} ">
                <label class="details">
                    <div class="content">
                        <div class = "preview">
                            <p>
                                ${obj['data']['title']} 
                            </p>
                        </div>
                        <div class="images">
                            <a class="bid">
                                <img  class='imgBid' src="${obj['data']['image']}"  alt="bid">
                            </a>
                        </div>
                         <div class="timer">
                               ${lime}
                        </div>
                        <div class="price">
                          Waves: ${obj['data']['details']['price']}
                        </div>
                        <div class="name">
                            ~~~~~
                        </div>
                        <div class="bid">
                            bid
                        </div>
                    </div>
                    <input type="checkbox" class="input" />
                    <div class="summary">
                    <div class = "button">
                             <button class="bidButton"> ставка </button>
                             <button class="sellButton"> старт </button>
                    </div>
                    <div class="priceSend">
                    <div class="info">
                        <div>Повышение цены: 0.1 Waves</div>
                        <div>Стоимость ставки: 1 Waves</div>
                         <div>Перевод: 0.014 Waves</div>
                    </div>
                        <div class="priceWinner">
                            <div>
                                Сумма оплаты при выигрыше
                            </div>
                            <div class="outPrice">
                                0
                            </div>
                        </div>
                    </div>
                    </div>
                </label>
            </div>
                                        `
                                        out(html)
                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])
                                break
                            case 'cardAdmin':
                                await (async (obj, props,data) => {
                                    try {
                                        let cont = await   utils({
                                            input:'template',
                                            data:obj['data']['content_html'],
                                            type:'string2html'
                                        },'convert', 'type')
                                        let descr = await   utils({
                                            input:'template',
                                            data:obj['data']['summary'],
                                            type:'string2html'
                                        },'convert', 'type')
                                        let html  = `
             <div class = "item timestamp_${Date.parse(obj['data']['date_modified'])}">
                <label class="details">
                    <div class="content">
                        <div class = "preview">
                            <p>
                               ${obj['data']['title']} 
                            </p>
                        </div>
                        <div class="images">
                            <a class="bid">
                                <img  class='imgBid' src="${obj['data']['image']}" alt="bid">
                            </a>
                        </div>
                        <div class="timer">
                        ${obj['data']['details']['time']}
                        </div>
                        <div class="price">
                        Waves: ${obj['data']['details']['price']}
                        </div>
                        <div class="name">
                         ~~~~~
                        </div>
                        <div class="bid">
                            bid
                        </div>
                    </div>
                    <input type="checkbox" class="input" />
                    <div class="summary">
                     <div class="button">
                        <button class="delete"> удалить </button>
                        <button class="change"> изменить </button>
                        </div>
                    </div>
                </label>
            </div>`
                                        // console.assert(false, html)
                                        out(html)
                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])
                                break
                            case 'cardPrice':
                                await (async (obj, props,data) => {
                                    try {
                                        let object = document.createElement('div')
                                        let html  = `
                                            
                                            
                                            `
                                        // console.assert(false, html)
                                        out(html)
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
}