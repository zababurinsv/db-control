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
      <div id="id01" class="w3-modal w3-animate-opacity">
            <div class="w3-modal-content w3-card-4">
                <header class="w3-container w3-teal">
                    <span id="close" class="w3-button w3-large w3-display-topright">&times;</span>
                    <h2>Create Universe</h2>
                </header>
                <div class="w3-container">
                   <label for="name">Universe name<input id="name" type="text" placeholder="Название вселенной" ></label>
                   <label for="modifiers">Private Public <input id="modifiers" type="text" placeholder="public or privat or protected"></label>
                   <label for="description">Description <input id="description" type="text" placeholder="add description"></label>
                </div>
                <div class="button">
                <button class="previous" style="display: none">previous</button>
                <button class="next">Next</button>
                <button class="create" style="display: none">create</button>
                </div>
                <footer class="w3-container w3-teal">
                    <p>Zababurin Sergey Copyright © 2019</p>
                </footer>
            </div>
        </div>
        `)
    })
}