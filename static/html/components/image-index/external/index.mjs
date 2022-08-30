import events from '/static/html/components/image-index/external/events.mjs'
let config = {
    slot:['header','body','footer','components']
}
export default async (v,p,c,obj,r) => {
    events(v,p,c,obj,r)
    // let include = obj.this.shadowRoot.querySelector('design-property-layout-main')
    // include['attachShadow']({mode: 'open'})
    // let shadow = obj.this.shadowRoot.querySelector('.design-property-layout-main')
    // include.shadowRoot.appendChild(shadow)
    // await psd.write(true,'','red',obj,'psd-write')
}