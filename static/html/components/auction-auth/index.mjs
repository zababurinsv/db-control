import modules from '/static/html/components/auction-auth/modules/index.mjs'

const template = (self) => {
  return new Promise(async (resolve, reject) => {
    self.attachShadow({mode: 'open'})
    const style = document.createElement('style')
    const content = self.querySelector('div')
    style.innerText = `@import "/static/html/components/auction-auth/template/css/default/index.css";`
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

  connectedCallback() {

  }

  disconnectedCallback() {

  }
}

try {
  customElements.define('auction-auth', index );
} catch (e) {
  console.error('error',e)
}

export default index
