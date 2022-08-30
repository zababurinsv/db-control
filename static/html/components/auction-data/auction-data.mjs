import modules from '/static/html/components/auction-data/modules/index.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import tableItem from '/static/html/components/auction-data/template/html/table/index.mjs'

const template = (self) => {
  return new Promise(async (resolve, reject) => {
    self.attachShadow({mode: 'open'})
    const style = document.createElement('style')
    style.innerText = `@import "/static/html/components/auction-data/template/css/default/index.css";`
    const content = self.querySelector('div')
    content.classList.remove('skeleton-box')
    self.shadowRoot.appendChild(content)
    self.shadowRoot.appendChild(style)
    resolve(self)
  })
}

const index =  class extends HTMLElement {
  static get observedAttributes() { return ['idbfs'] }

  constructor () {
    super()
    template(this)
      .then(data => modules(data))
      .catch(error => {
        console.warn('error', error)
      })
  }

  set isIdbfs(val) {
    if (val) {
      this.setAttribute('idbfs', '');
    } else {
      this.removeAttribute('idbfs');
    }
  }

  bodyItems = async (events) => {
    let content = events.target.classList
    if(!content.contains('auction-data__table_body_tr') && !content.contains('auction-data__table_body') && !content.contains('auction-data__table') && !content.contains('auction-data')) {
      const activeClass = 'auction-data__active'
      const item = (events.target.classList.contains('auction-data__table_body_td'))
        ? events.target
        : events.target.parentNode
      const value =  item.querySelector('span').textContent
      await navigator.clipboard.writeText(value)
      item.classList.add(activeClass)
      setTimeout(() => {
        item.classList.remove(activeClass)
      },140)
    }
  };

  filter = (input, data) => {
    return data.filter(item => {
      if(item[`${input.name}`] === undefined || item[`${input.name}`].indexOf(input.value) !== -1 ) {
        return item
      }
    })
  }

  footerItems = async (events) => {
    const inputs = events.currentTarget.querySelectorAll('input')
    const body = this.shadowRoot.querySelector('.auction-data__table_body')
    let data = await this.idbfs.get.all.files('/shared/data')
    for(let input of inputs) {
      if(!isEmpty(input.value)) {
        data = this.filter(input, data)
      }
    }
    body.innerHTML = ''
    for(let item of data) {
      body.insertAdjacentHTML('beforeend', tableItem.body(item))
    }
  };

  tableVisual = (even, odd) => {
   const items = this.shadowRoot.querySelectorAll('.auction-data__table_body_tr')
    for(let i = 0 ; i < items.length; i++ ) {
      if(i % 2) {
        for(let item of items[i].querySelectorAll('.auction-data__table_body_td')) {
          item.style.background = even
        }
      } else {
        for(let item of items[i].querySelectorAll('.auction-data__table_body_td')) {
          item.style.background = odd
        }
      }
    }
  }

  router = () => {
    switch (location.pathname) {
      case '/even':
        this.tableVisual('#859d85', 'white')
        break
      case '/odd':
        this.tableVisual('white', '#859d85')
        break
      case '/':
        this.tableVisual('white', 'white')
        break
      default:
        console.log('default router', location.pathname)
        break
    }
  }

  connectedCallback() {
    this.shadowRoot.querySelector('.auction-data__header_date').textContent = new Date().toLocaleString("en-US", {timeZone: "Europe/Moscow"});
  }

  disconnectedCallback() {
    this.idbfs.terminate();
    this.shadowRoot.querySelector('.auction-data__table_body').removeEventListener('click', this.bodyItems);
    this.shadowRoot.querySelector('.auction-data__table_footer').removeEventListener('input', this.footerItems);
    window.removeEventListener("popstate", this.router);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    window.addEventListener("popstate", this.router);
    this.router()
  }

  adoptedCallback() { }
}

try {
  customElements.define('auction-data', index );
} catch (e) {
  console.error('error',e)
}

export default index
