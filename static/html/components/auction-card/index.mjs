import auction from '/static/html/components/auction-card/modules/index.mjs'
import store from '/static/html/components/component_modules/store/index.mjs'
import matcher from '/static/html/components/component_modules/matcher/matcher.mjs'
import config from '/static/html/components/component_modules/matcher/matcher/this/database/config/index.mjs'
const template = (self) => {
  return new Promise(async (resolve, reject) => {
    self.attachShadow({mode: 'open'})
    const style = document.createElement('style')
    style.innerText = `@import "/static/html/components/auction-card/template/css/default/index.css";`
    const content = self.querySelector('div')
    const classes = self.querySelector('.item').classList
    for(let item of classes) {
      if(item.indexOf('timestamp') !== -1) {
        self.timestamp = item.split('_')[1]
      }
    }
    self.shadowRoot.appendChild(content)
    self.shadowRoot.appendChild(style)
    self.admin = content.classList.contains('admin')

    resolve({
      self: self.shadowRoot,
      admin: content.classList.contains('admin')
    })
  })
}

const index =  class extends HTMLElement {
  constructor () {
    super()
    template(this)
      .then(data => auction(data.self, data.admin))
      .catch(error => {
        console.warn('error', error)
      })
  }
  side = true
  rotate = async (e) => {
    e.preventDefault()
    if(!e.target.classList.contains('section')) {
      let item = e.target
      while (!item.classList.contains('item')) {
        item = item.parentNode
      }
      const front = item.querySelector('.front')
      const back = item.querySelector('.back')

      if(this.side) {
        back.style.visibility = "visible";
        item.style.transform = "rotateY(180deg)";
        front.style.transform = "rotateY(180deg)";
        back.style.transform = "rotateY(360deg)";
      } else {
        item.style.transform = "rotateY(0deg)";
        back.style.transform = "rotateY(180deg)";
        front.style.transform = "rotateY(360deg)";
      }
      this.side = !this.side
    }
  }

  change = async (event) => {
    let target = event.target
    let verify = false
    while (!verify) {
      if(target.tagName === 'DIV' && target.className.indexOf('item') > -1){
        verify = true
      } else {
        target = target.parentNode
      }
    }

    let date = {}
    date['timestamp'] = +target.className.split('_')[1]
    date['iso'] =  (new Date(date['timestamp'])).toISOString()
    date['utc'] =  (new Date(date['timestamp'])).toUTCString()

    let time = await matcher['server']({
      path:`/timer/${date['timestamp']}`,
      type:'timer'
    },'get', 'type')

    if(time['mongo']['time'] === -2) {

      target.querySelector('.change').innerText = `Данные Добавляются`
      target.querySelector('.change').disabled = true;

      await store.dispatch({
        type:'auction.admin.get.item',
        button: target.querySelector('.change'),
        delete: target.querySelector('.delete'),
        date: date,
      })
    } else {
      alert('Проходит аукцион, редактирование невозможно')
    }
  }

  remove = async (event) => {
    let target = event.target
    let verify = false
    while (!verify) {
      if(target.tagName === 'DIV' && target.className.indexOf('item') > -1){
        verify = true
      }else{
        target = target.parentNode
      }
    }
    let date = {}
    date['timestamp'] = +target.className.split('_')[1]
    date['iso'] =  (new Date(date['timestamp'])).toISOString()
    date['utc'] =  (new Date(date['timestamp'])).toUTCString()

    let time = await matcher['server']({
      path:`/timer/${date['timestamp']}`,
      type:'timer'
    },'get', 'type')

    if(time['mongo']['time'] === -2) {
      let result = confirm('Вы точно хотите удалить новость ?');
      if(result) {
        target.querySelector('.change').remove()
        target.querySelector('.delete').innerText = 'Идёт процесс удаления'
        target.querySelector('.delete').style.backgroundColor = 'red'
        target.querySelector('.delete').disabled = true

        store.dispatch({
          type:'delete',
          date:date,
          remove:target
        })
      } else {

      }
    } else{
      alert('Проходит аукцион, вы не можете удалить товар')
    }
  }

  connectedCallback() {
    this.shadowRoot.querySelector('.section').addEventListener('click', this.rotate)
    if(this.admin) {
      // this.shadowRoot.querySelector('.change').addEventListener('click', this.change)
      // this.shadowRoot.querySelector('.delete').addEventListener('click', this.remove)
      matcher['mongo']({
        input: 'action',
        type:'item',
        id: (new Date(parseInt(this.timestamp, 10))).toISOString(),
      }, 'get', 'type').then(item => {
          store.dispatch({
            type: "admin.set.data.editor",
            data: {
              content_html: item.mongo.message.item.content_html,
              summery: item.mongo.message.item.summary
            }
          })
      })
    } else {
      let eventSource = {};
      if (!window.EventSource) {
          alert("Ваш браузер не поддерживает EventSource.");
      } else {
        eventSource = new window.EventSource(`${matcher['config']['account']['sse']}`);
        eventSource.addEventListener('message', async function (event) {
            // let msg = JSON.parse(event['data'])
            // let obj = JSON.parse(msg['msg'])
            // const card = store.get.component('auction-card')
            console.log('-------------------', card)
        })
      }
    }
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector('.section').removeEventListener('click', this.rotate)
      if(this.admin) {
        const editor = this.querySelectorAll('varan-editor')
        for(let item of editor) {
          store.remove.editor(item.slot)
        }
        store.remove.auctionCard()
        this.shadowRoot.querySelector('.change').removeEventListener('click', this.change)
        this.shadowRoot.querySelector('.delete').removeEventListener('click', this.remove)
      }
  }
}

try {
  customElements.define('auction-card', index );
} catch (e) {
  console.error('error',e)
}

export default index
