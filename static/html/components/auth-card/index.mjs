import auth from '/static/html/components/auth-card/modules/index.mjs'

const template = (self) => {
  return new Promise(async (resolve, reject) => {
    self.style.width = '100%'
    self.attachShadow({mode: 'open'})
    const style = document.createElement('style')
    style.innerText = `@import "/static/html/components/auth-card/template/default/index.css";`
    self.shadowRoot.appendChild(self.querySelector('div'))
    self.shadowRoot.appendChild(style)
    resolve(self.shadowRoot)
  })
}

const index =  class extends HTMLElement {
  constructor () {
    super()
    template(this)
      .then(self => auth(self))
      .catch(error => {
        console.warn('error', error)
      })
  }
}

try {
  customElements.define('auth-card', index );
} catch (e) {
  console.error('error',e)
}

export default index
