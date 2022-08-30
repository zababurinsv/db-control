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

        let obj = parameters['obj']

        obj['this'].shadowRoot.querySelector('div.w3-container').style.cursor = 'pointer'
        obj['this'].shadowRoot.querySelector('div.w3-container').innerHTML = ''
        obj['this'].shadowRoot.querySelector('div.w3-container').insertAdjacentHTML('afterbegin', `
                  
                  <label class="avatar" for="image"><img src="/static/html/components/telegram-login/images/cameraadd_svg.svg"><input required="" type="file" id="image"></label>
                `)
        // obj['this']['shadowRoot'].querySelector('.head').innerHTML = ''
        // obj['this']['shadowRoot'].querySelector('.head').insertAdjacentHTML('afterbegin',`
        //     <h1>Your Name</h1>
        //     `)
        // obj['this']['shadowRoot'].querySelector('.message').innerText = ''
        // obj['this']['shadowRoot'].querySelector('.message').insertAdjacentHTML('afterbegin',`
        //         <p>Enter your name and add</p>
        //         <p>a profile picture</p>`)
        // obj['this']['shadowRoot'].querySelector('form').style.display = 'none'
        // obj['this']['shadowRoot'].querySelector('.buttonNext').remove()
        // obj['this']['shadowRoot'].querySelector('.telegram').style.background = '#7694f4'
        // obj['this']['shadowRoot'].querySelector('#login').insertAdjacentHTML('beforeend',`
        //         <div id="bio">
        //             <input type="text" id="name" placeholder="name">
        //             <input type="text" id="last_name" placeholder="last name"></input>
        //         </div>
        //         `)


        resolve(obj)
    })
}