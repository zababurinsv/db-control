import modules from '/static/html/components/auction-details/modules/index.mjs'

const template = (self) => {
  return new Promise(async (resolve, reject) => {
    self.attachShadow({mode: 'open'})
    const style = document.createElement('style')
    style.innerText = `@import "/static/html/components/auction-details/template/css/default/index.css";`
    const content = self.querySelector('div')
    self.shadowRoot.appendChild(content)
    self.shadowRoot.appendChild(style)
    resolve(self)
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

  connectedCallback() { }

  disconnectedCallback() { }
}

try {
  customElements.define('auction-details', index);
} catch (e) {
  console.error('error',e)
}

export default index
