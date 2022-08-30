import events from '/static/html/components/varan-body/external/events.mjs'
export default async (v,p,c,obj,r) => {
    if(obj.preset.status) {
        let template = await (await import(`/static/html/components/${obj.this.tagName.toLowerCase()}/template/${obj.preset.name}/${obj.preset.name}.mjs`))['default'](v,p,c,obj,r)
        // console.log(`(external-index.mjs*)${template}`,template)
    }
    events(v,p,c,obj,r)
}