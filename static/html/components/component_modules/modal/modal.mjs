import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import universe from '/static/html/components/component_modules/modal/templates/universe.mjs'
import standart from '/static/html/components/component_modules/modal/templates/default.mjs'
import universFirst from '/static/html/components/component_modules/modal/templates/universeFirst.mjs'
import universAvatar from '/static/html/components/component_modules/modal/templates/universAvatar.mjs'
import universPhoto from '/static/html/components/component_modules/modal/templates/universePhoto.mjs'
export default (parameters={id:'default'})=>{
   return new Promise(async (resolve, reject) => {
       let template = {}
       let out = (obj) => {
           resolve(obj)
       }
       let err = (error) => {
           console.log('~~~ err upload ~~~', error)
           reject(error)
       }
       if(isEmpty(parameters['id'])){
           console.assert(false, 'не id темплейта')
       }else {
           for(let key in parameters){
               switch (parameters['id']) {
                   case 'universe':
                       out(template =  await universe(parameters))
                       break
                   case 'universe.first':
                       out(template =  await universFirst(parameters))
                       break
                   case "universe.avatar":
                       out(template =  await universAvatar(parameters))
                       break
                   case "universe.photo":
                       out(template =  await universPhoto(parameters))
                       break
                   case "default":
                       out(template =  await standart(parameters))
                       break
                   default:
                       console.warn(false, 'неизвестный тип id --->', parameters['id'] )
                       break
               }
           }
       }
    })
}