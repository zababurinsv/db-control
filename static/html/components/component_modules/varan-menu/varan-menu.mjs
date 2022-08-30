import matcher from '/static/html/components/component_modules/matcher/matcher.mjs'
import utils from '/static/html/components/component_modules/utils/utils.mjs'
import staticProperty from '/static/html/components/component_modules/staticProperty/staticProperty.mjs'
import addEventListener from '/static/html/components/component_modules/addEventListener/addEventListener.mjs'
import events from '/static/html/components/component_modules/customEvent/callback.mjs'
(async ()=>{
  bundle['default']({
    input:'object'
  },null, async function (error, config) {
    events()
    function once (obj) {
      timeStamp['staticProperty'] = obj
      once = function (obj) { return obj }
    }
    let timeStamp = {}
    timeStamp['staticProperty'] = 0
    let store = {}
    for(let m = 0; m < config['store']['varan-menu'].length; m++){

      let node = (obj, target)=>{
        if(obj.tagName === 'VARAN-EDITOR'){
          return true
        }else {
          return false
        }
      }
      let nodeSlot = (obj, target)=>{

        if(obj.slot === target){
          return true
        }else {
          return false
        }
      }

      let saveAction = function (event) {
        once(event.timeStamp)
        let time = (event.timeStamp - timeStamp['staticProperty'])
        if ((time) > 140 || time === 0) {
          event.target.disable = 'true'
          event.target.style.backgroundColor = '#62bcd7'
          let target = event.target
          let verify = false
          while (!verify) {
            target = target.parentNode
            if(target.tagName === undefined || target.tagName === 'undefined'){
              target =  target.getRootNode().host

            }
            verify = node(target, 'varan-editor')
          }
          let save = new CustomEvent('saveEditor', {
            detail: {
              id: target.slot
            }
          })
          document.dispatchEvent(save)
          setTimeout(function tick () {
            event.target.disable = 'false'
            event.target.style.backgroundColor = '#ccc'
          }, 3000)
        }
        timeStamp['staticProperty'] = event.timeStamp
      }
      let convertAction = async function (event) {
        once(event.timeStamp)
        let time = (event.timeStamp - timeStamp['staticProperty'])
        if ((time) > 140 || time === 0) {
          event.target.disable = 'true'
          event.target.style.backgroundColor = '#62bcd7'
          let target = event.target
          let verify = false

          while (!verify) {
            target = target.parentNode
            if(target.tagName === undefined || target.tagName === 'undefined'){
              target =  target.getRootNode().host

            }
            verify = node(target, 'varan-editor')
          }
          let store =  await staticProperty({
            input:'action',
            type: 'all'
          }, 'get', 'type')

          let content = {}
          content['moderator'] = {}
          content['news'] = {}
          let data = {}
          let moderator = {}
          let newsContent = {}

          for(let i = 0; i < store['varan-editor'].length; i ++){
            switch (store['varan-editor'][i].slot) {
              case 'description':
                content['news']['description'] = await   utils({
                  input:'varan-menu',
                  data: store['varan-editor'][i]['editor']['quill'].root.innerHTML,
                  type:'html2string'
                },'convert', 'type')
                newsContent['description'] = store['varan-editor'][i]['editor']['quill'].root.innerHTML
                store['varan-editor'][i]['obj']['this'].querySelector('.wall').innerHTML = ''
                store['varan-editor'][i]['editor']['quill'].root.innerHTML = ''

                break
              case 'content':
                content['news']['content'] =  await  utils({
                  input:'varan-menu',
                  data: store['varan-editor'][i]['editor']['quill'].root.innerHTML,
                  type:'html2string'
                },'convert', 'type')
                newsContent['content'] = store['varan-editor'][i]['editor']['quill'].root.innerHTML
                store['varan-editor'][i]['obj']['this'].querySelector('.wall').innerHTML = ''
                store['varan-editor'][i]['editor']['quill'].root.innerHTML = ''

                break
              case 'about':
                content['about'] =  await  utils({
                  input:'varan-menu',
                  data: store['varan-editor'][i]['editor']['quill'].root.innerHTML,
                  type:'html2string'
                },'convert', 'type')
                data = store['varan-editor'][i]['editor']['quill'].root.innerHTML
                break
              case 'moderator':
                // console.assert(false, store['varan-editor'][i]['editor']['quill'].root.innerHTML)
                content['moderator']['description'] =  await  utils({
                  input:'varan-menu',
                  data: store['varan-editor'][i]['editor']['quill'].root.innerHTML,
                  type:'html2string'
                },'convert', 'type')
                moderator['description'] = store['varan-editor'][i]['editor']['quill'].root.innerHTML
                break
              case 'moderatorContent':
                content['moderator']['content'] =  await  utils({
                  input:'varan-menu',
                  data: store['varan-editor'][i]['editor']['quill'].root.innerHTML,
                  type:'html2string'
                },'convert', 'type')
                moderator['content']  = store['varan-editor'][i]['editor']['quill'].root.innerHTML
                break
              default:
                console.warn('~~~~~~~~~', 'На этот объект нет действия ',store['varan-editor'][i].slot )
                break
            }
          }
          let targetModerator = {}
          let authtoritem = {}
          let authtor = {}
          let timeInMs = {}
          let outObject = {}
          let template ={}
          let viewsAdmin ={}
          let views ={}

          let out = {}
          switch (target.slot) {
            case 'about':
              out = 'about'
              break
            case 'moderator':
              out = 'moderator'
              break
            case 'moderatorContent':
              out = 'moderator'
              break
            case 'content':
              out = 'news'
              break
            case 'description':
              out = 'news'
              break
            default:
              out = target.slot
              console.warn('необрабатываемый тип', target.slot)
              break
          }
          switch (out) {
            case 'about':
              let  string =   await   utils({
                input:'varan-menu',
                data: data,
                type:'html2string'
              },'convert', 'type')

              for(let i = 0; i < config['store']['varan-about'].length; i ++) {
                switch (config['store']['varan-about'][i].slot) {
                  case 'about-admin':

                    let aboutTemp = {}
                    if(config['store']['varan-about'][i]['obj']['this'].querySelector('.menu-convert') === null){
                      let menu = config['store']['varan-about'][i]['obj']['this'].querySelector('varan-menu')
                      aboutTemp =   menu.shadowRoot.querySelector('.menu-convert')
                    }else{
                      aboutTemp = config['store']['varan-about'][i]['obj']['this'].querySelector('.menu-convert')
                    }
                    aboutTemp.innerText = 'Идёт сохранение данных.'
                    aboutTemp.disabled = true
                    aboutTemp.style.backgroundColor = 'red'



                    let temlate =  await matcher['webdav']({
                      input:'varan-menu',
                      data:{
                        txt: string
                      },
                      type:'about',
                      path:'/about'
                    },'set', 'type')
                    let about = await utils({
                      input:'varan-menu',
                      target: 'varan-about',
                      type:'object',
                      source:config['store']['varan-about'],
                      get:'.main'
                    }, 'get', 'type')
                    about.innerHTML = ''
                    about.insertAdjacentHTML('beforeend', temlate);

                    aboutTemp.innerText = 'Данные сохранены'
                    setTimeout(()=>{
                      aboutTemp.innerText =  'сохранить'
                      aboutTemp.disabled = false
                      aboutTemp.style.backgroundColor = '#ccc'
                    }, 2000);

                    break
                  default:
                    break
                }
              }
              break
            case 'moderator':
              verify = false
              targetModerator = {}
              while (!verify) {
                targetModerator = target.parentNode
                verify = nodeSlot(targetModerator,  target.getAttribute('parent'))
              }

              authtoritem = {}

              authtor = targetModerator.shadowRoot.querySelector('#titleItem').value
              let result2 = {}
              if(config['isEmpty'](authtor)){
                result2 = prompt('введите Имя и Фамилию  автора', 'введите Имя и Фамилию  автора')
                if(result2 === 'введите Имя и Фамилию  автора'){

                  alert('вы не ввели имя автора поле остаётся пустым')
                  authtoritem = 'модератор'
                }else{
                  authtoritem = result2
                }

              }else{
                authtoritem = authtor
              }
              if (!Date.now) {
                Date.now = function now() {
                  return new Date().getTime();
                };
              }
              timeInMs = Date.now();
              // if(moderator['content'].length < 10){}
              // if(moderator['description'].length < 10){}
              // let img = targetModerator.shadowRoot.querySelector('.moderator').src

              outObject = {}

              outObject['timestamp'] = timeInMs
              outObject['title'] = authtoritem
              outObject['img'] = targetModerator.shadowRoot.querySelector('.moderator').src
              outObject['description'] =content['moderator']['description']
              outObject['content'] = content['moderator']['content']
              outObject['dir'] =  'moderator'
              outObject['positionImg'] = confirm("Фотографию разположить слева ?");
              let create ={}
              let save = {}
              let update = {}
              let menu = {}
              for(let i = 0; i < config['store']['varan-editor'].length; i ++){
                switch (config['store']['varan-editor'][i].slot) {
                  case 'moderator':
                    if(!config['store']['varan-editor'][i]['obj']['this'].querySelector('varan-menu').shadowRoot ||
                      config['store']['varan-editor'][i]['obj']['this'].querySelector('varan-menu').shadowRoot === undefined ||
                      config['store']['varan-editor'][i]['obj']['this'].querySelector('varan-menu').shadowRoot === null){

                      menu = config['store']['varan-editor'][i]['obj']['this'].querySelector('varan-menu')
                    }else{
                      menu = config['store']['varan-editor'][i]['obj']['this'].querySelector('varan-menu').shadowRoot


                    }
                    create = menu.querySelector('.menu-convert')
                    save = menu.querySelectorAll('.menu-save')[0]
                    update = menu.querySelector('.update')
                    if(update === null || update === 'null'){
                    }else{
                      update.remove()
                    }
                    create.innerHTML = 'создаётся модератор'
                    create.style.backgroundColor = '#e1e1e1'
                    create.disabled = true
                    save.disabled = true
                    break
                  case 'moderatorContent':

                    if(!config['store']['varan-editor'][i]['obj']['this'].querySelector('varan-menu').shadowRoot ||
                      config['store']['varan-editor'][i]['obj']['this'].querySelector('varan-menu').shadowRoot === undefined ||
                      config['store']['varan-editor'][i]['obj']['this'].querySelector('varan-menu').shadowRoot === null){

                      menu = config['store']['varan-editor'][i]['obj']['this'].querySelector('varan-menu')
                    }else{
                      menu = config['store']['varan-editor'][i]['obj']['this'].querySelector('varan-menu').shadowRoot


                    }
                    create = menu.querySelector('.menu-convert')
                    save = menu.querySelectorAll('.menu-save')[0]
                    update = menu.querySelector('.update')
                    if(update === null || update === 'null'){
                    }else{
                      update.remove()
                    }
                    create.innerHTML = 'создаётся модератор'
                    create.style.backgroundColor = '#e1e1e1'
                    create.disabled = true
                    save.disabled = true
                    break
                  default:
                    break
                }
              }
              views = await utils({
                input:'varan-menu',
                target: 'lacerta-moderator',
                type:'object',
                source:config['store']['lacerta-moderator'],
                get:'.main'
              }, 'get', 'type')

              template = await matcher['webdav']({
                input:'varan-menu',
                data: outObject,
                type:'components',
                name:'moderator',
                path:'/components'
              },'set', 'type', views.querySelectorAll('.adminMenu').length)
              let itemId = views.querySelectorAll('.adminMenu').length

              viewsAdmin = await utils({
                input:'varan-menu',
                target: 'moderator-admin',
                type:'object',
                source:config['store']['lacerta-moderator'],
                get:'.adminContent'
              }, 'get', 'type')

              for(let i = 0; i < template.length; i++){
                views.insertAdjacentHTML('beforeend', template[i]);
                views.querySelector(`.item_${views.querySelectorAll('.adminMenu').length}`)
                console.log(itemId)
                let source =  views.querySelector(`.item_${itemId}`)

                await addEventListener({
                  input:'varan-menu',
                  delete: source.querySelector('.delete'),
                  change: source.querySelector('.change'),
                  type:'lacerta-moderator'
                },'add','type')

              }
              for(let i = 0; i < config['store']['varan-editor'].length; i ++){
                switch (config['store']['varan-editor'][i].slot) {
                  case 'moderator':
                    if(!config['store']['varan-editor'][i]['obj']['this'].querySelector('varan-menu').shadowRoot ||
                      config['store']['varan-editor'][i]['obj']['this'].querySelector('varan-menu').shadowRoot === undefined ||
                      config['store']['varan-editor'][i]['obj']['this'].querySelector('varan-menu').shadowRoot === null){

                      menu = config['store']['varan-editor'][i]['obj']['this'].querySelector('varan-menu')
                    }else{
                      menu = config['store']['varan-editor'][i]['obj']['this'].querySelector('varan-menu').shadowRoot


                    }
                    create = menu.querySelector('.menu-convert')
                    save = menu.querySelectorAll('.menu-save')[0]
                    update = menu.querySelector('.update')
                    if(update === null || update === 'null'){
                    }else{
                      update.remove()
                    }
                    create.innerHTML = 'модератор создан'
                    location.reload()
                    // create.style.backgroundColor = 'red'
                    // create.disabled = false
                    // save.disabled = false
                    break
                  case 'moderatorContent':

                    if(!config['store']['varan-editor'][i]['obj']['this'].querySelector('varan-menu').shadowRoot ||
                      config['store']['varan-editor'][i]['obj']['this'].querySelector('varan-menu').shadowRoot === undefined ||
                      config['store']['varan-editor'][i]['obj']['this'].querySelector('varan-menu').shadowRoot === null){

                      menu = config['store']['varan-editor'][i]['obj']['this'].querySelector('varan-menu')
                    }else{
                      menu = config['store']['varan-editor'][i]['obj']['this'].querySelector('varan-menu').shadowRoot


                    }
                    create = menu.querySelector('.menu-convert')
                    save = menu.querySelectorAll('.menu-save')[0]
                    update = menu.querySelector('.update')
                    if(update === null || update === 'null'){
                    }else{
                      update.remove()
                    }
                    create.innerHTML = 'модератор создан'
                    create.style.backgroundColor = 'red'
                    create.disabled = false
                    save.disabled = false
                    break
                  default:
                    break
                }
              }
              break
            case 'news':


              /**
               * get content
               */
              let lacertaNews = config['store']['varan-editor-admin'][0]['this'].querySelector('lacerta-news')

              let title = lacertaNews.shadowRoot.querySelector('#titleItem').value
              let image = lacertaNews.shadowRoot.querySelector('.gallery').src
              let ImageName = 'image'
              if(title.length === 0){title = 'Новость'}

              if (!Date.now) {
                Date.now = function now() {
                  return new Date().getTime();
                };
              }
              let news = {}
              news['image'] = {}
              news['image']['data'] = image
              news['image']['name'] = ImageName
              news['title'] = title
              news['content'] = content['news']['content']
              news['short_content'] = content['news']['description']
              news['url'] = `https://universitykids.ru`
              news['rss'] = `https://universitykids.ru/rss`
              news['timestamp'] = Date.now();
              for(let i = 0; i < config['store']['lacerta-news'].length; i ++){
                switch (config['store']['lacerta-news'][i].slot) {
                  case 'news-admin':

                    config['store']['lacerta-news'][i]['obj']['this'].shadowRoot.querySelector('#titleItem').value = ''
                    config['store']['lacerta-news'][i]['obj']['this'].shadowRoot.querySelector('.date').innerHTML = ''
                    config['store']['lacerta-news'][i]['obj']['this'].shadowRoot.querySelector('.gallery').src = '/static/html/components/lacerta-news/icons/no_image.jpg'
                    if(config['isEmpty'](config['store']['action'])){
                      config['store']['action'] = {}
                    }if(config['isEmpty'](config['store']['action']['create'])){
                    config['store']['action']['create'] = {}
                  }
                    // console.assert(false, config['store'])
                    config['store']['action']['create'] = true


                    let menuEditor = config['store']['lacerta-news'][i]['obj']['this'].querySelectorAll('varan-menu')
                    let out = {}
                    let convert ={}
                    let save = {}
                    let update = {}
                    for(let i = 0; i < menuEditor.length; i ++){
                      if(menuEditor[i].shadowRoot === undefined ||menuEditor[i].shadowRoot === null  ){
                        out = menuEditor[i]
                      }else{
                        out = menuEditor[i].shadowRoot
                      }

                      convert = out.querySelector('.menu-convert')
                      save = out.querySelector('.menu-save')
                      update = out.querySelector('.update')
                      if(update === null || update === 'null'){

                      }else{
                        update.remove()
                      }
                      convert.innerText = 'Создаётся новость. Страница сама перезагрузится'
                      convert.style.backgroundColor = 'red'
                      convert.disabled = true
                      save.disabled = true
                    }
                    break
                  default:
                    console.warn('~~~~~~~~~', 'На этот объект нет действия ',config['store']['lacerta-news'][i].slot )
                    break
                }
              }

              staticProperty({
                type:'task',
                task: {
                  type:'create',
                  data:news
                }
              },'task', 'type')
              break
            default:
              console.assert(false, out )
              break
          }
          setTimeout(function tick () {
            event.target.disable = 'false'
            event.target.style.backgroundColor = '#ccc'
          }, 3000)
        }
        timeStamp['staticProperty'] = event.timeStamp
      }

      if(!config['store']['varan-menu'][m]['this'].querySelector('.menu-save')){
        config['store']['varan-menu'][m]['this'].shadowRoot.querySelector('.menu-save').addEventListener('click', saveAction, false)
        config['store']['varan-menu'][m]['this'].shadowRoot.querySelector('.menu-convert').addEventListener('click', convertAction, false)
      }else{
        config['store']['varan-menu'][m]['this'].querySelector('.menu-save').addEventListener('click', saveAction, false)
        config['store']['varan-menu'][m]['this'].querySelector('.menu-convert').addEventListener('click', convertAction, false)
      }



    }
  })
})()