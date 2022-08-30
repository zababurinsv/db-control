import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'

export default (parameters= {})=>{
    return new Promise(async function (resolve, reject) {
        let data = {}
        if(!isEmpty(parameters)){
            for(let key in parameters) {
                switch (key) {
                    case 'universe':
                        data[`${key}`] = parameters[key]
                        break
                    default:
                        console.warn(false, 'неизвестное свойство --->',key, '---->', parameters[key])
                        break
                }
            }
        }
        resolve(    `
        
                   <label for="name">Universe name<input id="name" type="text" placeholder="Название вселенной" ></label>
                   <label for="modifiers">Private Public <input id="modifiers" type="text" placeholder="public or privat or protected"></label>
                   <label for="description">Description <input id="description" type="text" placeholder="add description"></label>
      
        `)
    })
}