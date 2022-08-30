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
                case 'getSliderTemplate':
                    (async (obj, props,state, server) => {
                        try {
                            console.log(`${obj['input']}[(slider)${obj[props]}]`)
                                    fetch(`/static/html/components/varan-slider/template/${obj[props]['slot']}.html`)
                                        .then(function (response) {
                                            if (response.ok) {
                                                return response.text()
                                            }
                                        }).then(function (body) {
                                        let parser = new DOMParser()
                                        let doc = parser.parseFromString(body, 'text/html')
                                        obj[props]['slider'] = doc.getElementsByTagName('template')[0].content.cloneNode(true)
                                        let slider = document.createElement('section')
                                        slider.className = 'slider'
                                        slider.slot = 'view'
                                        slider.appendChild(obj['slider'])
                                        obj[props]['slider'] = slider
                                        obj[props]['slider-template'] = slider
                                        for (let key = 0; key < obj['type'].length; key++) {
                                            if (obj['type'][key] === 'slider-one-text') {
                                                obj['verify']['sliderText'] = true
                                            }
                                        }
                                        matcher['database']['request']['functions']['getObject'](obj)
                                            .then((obj) => {
                                                if (!obj['get']) {
                                                    resolve(obj)
                                                } else {
                                                    pagination['init'](obj)
                                                    pagination['action'](obj)
                                                        .then(obj => {

                                                            out(obj)
                                                        })
                                                }
                                            })
                                    })
                                    .catch(error => {
                                            return error
                                        })
                        } catch (e) { err(e) }
                    })(obj, args[0], args[1], args[2], args[3])
                    break
                case 'setSlider':
                    (async (obj, props,data, server) => {
                        try {
                            console.log(`${obj['input']}[(slider)${obj[props]}]`)
                            out(Peppermint(obj, {
                                        dots: false,
                                        slideshow: false,
                                        speed: 500,
                                        slideshowInterval: 5000,
                                        stopSlideshowAfterInteraction: true,
                                        onSetup: function (n) {
                                            // //console.log('Peppermint setup done. Slides found: ' + n)
                                        }
                                    }))
                        } catch (e) { err(e) }
                    })(obj, args[0], args[1], args[2], args[3])

                    break
                default:
                    err(`новая функция ${func}`)
                    break
            }
    })
}
