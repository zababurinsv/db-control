import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
export default  (obj, func, ...args)=>{
    return new Promise( function (resolve, reject) {
            let out = (obj) => {
                //console.log('~~~ out router ~~~')
                resolve(obj)
            }
            let err = (error) => {
                console.log('~~~ err router ~~~', error)
                reject(error)
            }
            switch (func) {
                case 'disableMode':
                    (async (obj, props,data) => {
                        try {
                            console.log(`${obj['input']}[(table)${obj[props]}]`)
                            if (!obj[props].querySelector('.menu-mode')) {
                                obj[props].shadowRoot.querySelector('.menu-mode').disabled = true
                                obj[props].shadowRoot.querySelector('.menu-mode').style.backgroundColor = 'black'
                                obj[props].shadowRoot.querySelector('.menu-delete').disabled = true
                                obj[props].shadowRoot.querySelector('.menu-delete').style.backgroundColor = 'black'
                                out(obj)
                            } else {
                                obj[props].querySelector('.menu-mode').disabled = true
                                obj[props].querySelector('.menu-mode').style.backgroundColor = 'black'
                                obj[props].querySelector('.menu-delete').disabled = true
                                obj[props].querySelector('.menu-delete').style.backgroundColor = 'black'
                                out(obj)
                            }
                        } catch (e) { err(e) }
                    })(obj, args[0], args[1], args[2], args[3])
                    break
                case 'varan-slider-news':
                    (async (obj, props,data) => {
                        try {
                            console.log(`${obj['input']}[(table)${obj[props]}]`)

                            if (!obj[props].querySelector('.menu-save')) {
                                obj[props].shadowRoot.querySelector('.menu-save').innerText = 'Создать новость'
                                obj[props].shadowRoot.querySelector('.menu-mode').innerText = 'Редактировать новость'
                                obj[props].shadowRoot.querySelector('.menu-delete').innerText = 'Удалить новость'
                                // obj['this'].shadowRoot.querySelector('.menu-save').disabled = true
                                // obj['this'].shadowRoot.querySelector('.menu-save').style.backgroundColor = 'black'
                                // obj['this'].shadowRoot.querySelector('.menu-mode').disabled = true
                                // obj['this'].shadowRoot.querySelector('.menu-mode').style.backgroundColor = 'black'
                                // obj['this'].shadowRoot.querySelector('.menu-delete').disabled = true
                                // obj['this'].shadowRoot.querySelector('.menu-delete').style.backgroundColor = 'black'
                                out(obj)
                            } else {
                                obj[props].querySelector('.menu-save').innerText = 'Создать новость'
                                obj[props].querySelector('.menu-mode').innerText = 'Редактировать новость'
                                obj[props].querySelector('.menu-delete').innerText = 'Удалить новость'
                                // obj['this'].querySelector('.menu-save').disabled = true
                                // obj['this'].querySelector('.menu-save').style.backgroundColor = 'black'
                                // obj['this'].querySelector('.menu-mode').disabled = true
                                // obj['this'].querySelector('.menu-mode').style.backgroundColor = 'black'
                                // obj['this'].querySelector('.menu-delete').disabled = true
                                // obj['this'].querySelector('.menu-delete').style.backgroundColor = 'black'
                                out(obj)
                            }
                        } catch (e) { err(e) }
                    })(obj, args[0], args[1], args[2], args[3])
                    break
                case 'disableDelete':
                    (async (obj, props,data) => {
                        try {
                            console.log(`${obj['input']}[(table)${obj[props]}]`)
                            if(isEmpty(props)){
                                err('должно быть свойство')
                            }
                            if(props !== 'self'){
                                err('должно быть свойство self')
                            }

                            if (!obj[props].shadowRoot.querySelector('.menu-delete')) {
                                obj[props].shadowRoot.querySelector('.menu-delete').disabled = true
                                obj[props].shadowRoot.querySelector('.menu-delete').style.backgroundColor = 'black'
                                out(obj)
                            } else {
                                obj[props].querySelector('.menu-delete').disabled = true
                                obj[props].querySelector('.menu-delete').style.backgroundColor = 'black'
                                out(obj)
                            }


                        } catch (e) { err(e) }
                    })(obj, args[0], args[1], args[2], args[3])
                    break
                case 'addButton':
                    (async (obj, props,data) => {
                        try {
                               console.log(`${obj['input']}[(table)${obj[props]}]`)
                               if(isEmpty(props)){
                                   err('должно быть свойство')
                               }
                               if(props !== 'self'){
                                   err('должно быть свойство self')
                               }
                                if (!obj[props].shadowRoot.querySelector('.menu-mode')) {
                                    obj[props].shadowRoot.querySelector('.menu-mode').innerText = 'Add'
                                    obj[props].shadowRoot.querySelector('.menu-mode').disabled = false
                                    obj[props].shadowRoot.querySelector('.menu-mode').style.backgroundColor = '#ddd'
                                    out(obj)
                                } else {
                                    obj[props].querySelector('.menu-mode').innerText = 'Add'
                                    obj[props].querySelector('.menu-mode').disabled = false
                                    obj[props].querySelector('.menu-mode').style.backgroundColor = '#ddd'
                                    out(obj)
                                }
                        } catch (e) { err(e) }
                    })(obj, args[0], args[1], args[2], args[3])
                    break
                default:
                    err(`новая функция ${func}`)
                    break
            }
    })
}
