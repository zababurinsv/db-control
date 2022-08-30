import button from '/static/html/components/auction-button/modules/index.mjs'
import store from '/static/html/components/component_modules/store/index.mjs'
import matcher from '/static/html/components/component_modules/matcher/matcher.mjs'
import config from '/static/html/components/component_modules/matcher/matcher/this/database/config/index.mjs'

const template = (self) => {
  return new Promise(async (resolve, reject) => {
    self.style.width = '100%'
    const style = document.createElement('style')
    style.innerText = `@import "/static/html/components/auction-button/template/css/default/index.css";`
    const content = self.querySelector('div')
    self.appendChild(content)
    self.appendChild(style)
    resolve(self)
  })
}

const index =  class extends HTMLElement {
  constructor () {
    super()
    template(this)
      .then(data => button(data))
      .catch(error => {
        console.warn('error', error)
      })
  }
  connectedCallback() { }
  disconnectedCallback() { }
}

try {
  customElements.define('auction-button', index );
} catch (e) {
  console.error('error',e)
}

export default index
