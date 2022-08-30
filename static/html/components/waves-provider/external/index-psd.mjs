import psd from '/static/html/components/component_modules/bundle/psd/docs.mjs'

export default async (v,p,c,obj,r) =>{
   let obj01 = await psd.init(true,['psd'],'red',obj,'psd')
   let obj02 = await psd.write(true,['psd'],'red',obj,'psd-write')
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',obj01.r)
}