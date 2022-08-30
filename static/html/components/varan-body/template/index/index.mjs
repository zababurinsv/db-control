import task from '/static/html/components/component_modules/heap/index.mjs'

export default (v,p,c,obj,r) => {
  let system = {}
   system['main-body-lab'] = obj['this']['shadowRoot'].querySelector('.main-body-lab')
   system['main-body-dev'] = obj['this']['shadowRoot'].querySelector('.main-body-dev')
   system['main-body-prod'] = obj['this']['shadowRoot'].querySelector('.main-body-prod')

   system['main-body-lab'].addEventListener('click', async (event) =>{
    await task.set(true, '', '5', {
     head: {
      prev: import.meta.url,
      current: import.meta.url
     },
     payload: {}
    },'/route_lab')
   })
   system['main-body-dev'].addEventListener('click', async (event) =>{
    await task.set(true, '', '5', {
     head: {
      prev: import.meta.url,
      current: import.meta.url
     },
     payload: {}
    },'/route_dev')
   })
   system['main-body-prod'].addEventListener('click', async (event) =>{
    await task.set(true, '', '5', {
     head: {
      prev: import.meta.url,
      current: import.meta.url
     },
     payload: {}
    },'/route_prod')
   })
}