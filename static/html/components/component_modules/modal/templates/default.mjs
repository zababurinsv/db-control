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
                        console.warn(false, 'необрабатываемое свойство --->',key, '---->', parameters[key])
                        break
                }
            }
        }
    resolve(    `
      <div id="id01" class="w3-modal w3-animate-opacity">
            <div class="w3-modal-content w3-card-4">
                <header class="w3-container w3-teal">
                    <span id="close" class="w3-button w3-large w3-display-topright">&times;</span>
                    <h2>Modal Header</h2>
                </header>
                <div class="w3-container">
                    <p>Some text..</p>
                    <p>Some text..</p>
                </div>
                <footer class="w3-container w3-teal">
                    <p>Modal Footer</p>
                </footer>
            </div>
        </div>
        `)
    })
}