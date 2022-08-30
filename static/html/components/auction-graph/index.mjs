import Modules from '/static/html/components/auction-graph/modules/index.mjs'
import { node } from '/static/html/components/component_modules/hooks/index.mjs'

const template = (self) => {
  return new Promise(async (resolve, reject) => {
    self.attachShadow({mode: 'open'})
    const style = document.createElement('style')
    style.innerText = `@import "/static/html/components/auction-graph/template/css/default/index.css";`
    const content = self.querySelector('div')
    content.classList.remove('skeleton-box')
    self.shadowRoot.appendChild(content)
    self.shadowRoot.appendChild(style)
    resolve(self)
  })
}

const index =  class extends HTMLElement {
  constructor () {
    super()
    template(this).catch(error => {
        console.warn('error', error)
    })
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
    let api = node.render(Modules, this.shadowRoot.querySelector('div'))
    api = api.start()
  }

  disconnectedCallback() {
    window.removeEventListener("popstate", this.router);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    window.addEventListener("popstate", this.router);
    this.router()
  }

  adoptedCallback() { }
}

try {
  customElements.define('auction-graph', index );
} catch (e) {
  console.error('error',e)
}

export default index
