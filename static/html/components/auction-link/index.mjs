import modules from '/static/html/components/auction-link/modules/index.mjs'

const template = (self) => {
  return new Promise(async (resolve, reject) => {
    self.attachShadow({mode: 'open'})
    const style = document.createElement('style')
    style.innerText = `@import "/static/html/components/auction-link/template/css/default/index.css";`
    const content = document.createElement('p')
    content.classList.add(self.classList[0])
    content.textContent = self.textContent
    self.textContent = ''
    self.shadowRoot.appendChild(content)
    self.shadowRoot.appendChild(style)
    resolve(self.shadowRoot)
  })
}

const index =  class extends HTMLElement {
  constructor () {
    super()
    template(this)
      .then(data => modules(data))
      .catch(error => {
        console.warn('error', error)
      })
  }

  push = (events) => {
    const activeClass = 'auction-link__active'
    const item = events.currentTarget

    const state = { }
    const title = ''
    const url = item.getRootNode().host.getAttribute('to')
    item.classList.add(activeClass)
    window.history.pushState(state, title,url);
    window.dispatchEvent(new Event('popstate'));
    setTimeout(() => {
      item.classList.remove(activeClass)
    },130)
  }

  connectedCallback() {
    this.shadowRoot.querySelector('p').addEventListener('click', this.push)
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector('p').removeEventListener('click', this.push)
  }
}

try {
  customElements.define('auction-link', index );
} catch (e) {
  console.error('error',e)
}

export default index
