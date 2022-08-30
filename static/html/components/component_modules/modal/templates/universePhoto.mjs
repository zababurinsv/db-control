import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
let obj = {}
obj['img'] = async (obj)=>{
    return `<img class="avatar" src='${obj.data}' alt="avatar">`
}

export default (parameters= {})=>{
    return new Promise(async function (resolve, reject) {
        let data = {}
        if(!isEmpty(parameters)){
            for(let key in parameters) {
                switch (key) {
                    case 'universe':
                        data[`${key}`] = parameters[key]
                        break
                    case 'data':
                        data[`${key}`] = parameters[key]
                        break
                    default:
                        console.warn(false, 'неизвестное свойство --->',key, '---->', parameters[key])
                        break
                }
            }
        }
    resolve(`
<figure>
<div class="avatar">${await obj.img(data)}</div>
<figcaption>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sit amet massa bibendum, lobortis neque et, rutrum eros. Aenean finibus magna molestie hendrerit scelerisque. Sed iaculis mollis libero, nec semper massa tempus sit amet. Maecenas scelerisque porttitor eros eget consectetur. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec fermentum porta lacus eu rutrum. Mauris posuere augue quis dignissim fringilla. Praesent ornare erat scelerisque purus egestas eleifend. Sed vestibulum pulvinar ante in condimentum. Ut volutpat libero nec dui fringilla efficitur. Quisque consequat turpis non massa volutpat scelerisque. In posuere varius mollis. Etiam auctor metus at mattis pulvinar.
</figcaption>
</figure>
        `)
    })
}