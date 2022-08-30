// disabled idbfs
// import fs from '/static/html/components/varan-header/external/fs.mjs'

export default async (v,p,c,obj,r) => {
    // await fs(v,p,c,obj,r)
    // if(obj.preset.status) {
    await (await import(`/static/html/components/varan-header/template/${obj.preset.name}/${obj.preset.name}.mjs`))['default'](v,p,c,obj,r)
      // console.log(`(external-index.mjs*)${template}`,template)
    // }
}