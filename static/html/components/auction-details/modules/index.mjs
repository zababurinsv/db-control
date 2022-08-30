import Peppermint from '/static/html/components/auction-details/modules/slider/index.mjs'

export default (self) => {
  return new Promise(async (resolve, reject) => {
    try {
      const style = document.createElement('style')
      style.innerText = `@import "/static/html/components/auction-details/modules/slider/init.css";`
      self.shadowRoot.appendChild(style)

      const container = self.shadowRoot.querySelector('.auction-details__preview_slider')
      console.log('container', container)
      const slider = Peppermint(container, {
        dots: false,
        slideshow: false,
        speed: 500,
        slideshowInterval: 5000,
        stopSlideshowAfterInteraction: true,
        onSetup: function (n) {
          console.log('setup done. Slides found: ' + n)
        }
      })
      resolve(true)

    } catch (e) {

      resolve(false)

    }
  })
}