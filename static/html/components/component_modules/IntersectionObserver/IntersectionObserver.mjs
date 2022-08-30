import action from '/static/html/components/component_modules/action/action.mjs'

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
            case 'get':
                (async (obj, props,data) => {
                    try {
                        console.log(`${func}[(${obj['input']})${obj[props]}]`)
                        switch (obj[props]) {
                            case 'lazy':
                                (async (obj, props,data) => {
                                    try {
                                        if ("IntersectionObserver" in window) {
                                            let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
                                                entries.forEach(async function(entry) {
                                                    if (entry.isIntersecting) {
                                                        let lazyImage = entry.target;
                                                        let img = await action({
                                                            input:'intersectionobserver',
                                                            data: lazyImage.dataset.src,
                                                            type:'lazyImg'
                                                        },'get','type')
                                                        lazyImage.src =  img['mongo']['img'];
                                                        lazyImage.srcset = img['mongo']['img'];
                                                        lazyImage.classList.remove("lazy");
                                                        lazyImageObserver.unobserve(lazyImage);
                                                    }
                                                });
                                            });

                                            obj['data'].forEach(function(lazyImage) {
                                                lazyImageObserver.observe(lazyImage);
                                            });
                                        } else {
                                            // Possibly fall back to a more compatible method here
                                        }

                                        out(obj)
                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])
                                break
                            case 'video':
                                (async (obj, props,data) => {
                                    try {
                                        let lazyVideoObserver = new IntersectionObserver(function(entries, observer) {
                                            entries.forEach(async function(entry) {
                                                if (entry.isIntersecting) {
                                                    entries.forEach(async function(video) {
                                                        if (video.isIntersecting) {
                                                            for (var source in video.target.children) {


                                                                var videoSource = video.target.children[source];
                                                                if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {

                                                                    // console.assert(false,  videoSource.dataset.src)
                                                                    videoSource.src = videoSource.dataset.src;
                                                                }
                                                            }

                                                            video.target.load();
                                                            video.target.classList.remove("lazy");
                                                            lazyVideoObserver.unobserve(video.target);
                                                        }
                                                    });

                                                }
                                            });
                                        });

                                        obj['data'].forEach(function(lazyImage) {
                                            lazyVideoObserver.observe(lazyImage);
                                        });

                                        out(obj)
                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])

                                break
                            default:
                                err(`новая функция ${func}`)
                                break
                        }

                        out(obj)
                    } catch (e) { err(e) }
                })(obj, args[0], args[1], args[2], args[3])
                break
            case 'set':
                (async (obj, props,data) => {
                    try {
                        console.log(`app(${func}[(${obj['input']})${obj[props]}]intersection)`)
                        switch (obj[props]) {
                            case 'observer':
                                (async (obj, props,data) => {
                                    try {

                                        if ("IntersectionObserver" in window) {
                                            let Observer = new IntersectionObserver(function(entries, observer) {
                                                entries.forEach(async function(entry) {
                                                    if (entry.isIntersecting) {
                                                        let object = entry.target;



                                                    }else{
                                                        switch (entry.target.tagName) {
                                                            case "LACERTA-REQUEST":
                                                                entry.target.shadowRoot.querySelector('details').open = false
                                                                break
                                                            case "LACERTA-GALLERY":
                                                                entry.target.shadowRoot.querySelector('details').open = false
                                                                break
                                                            default:
                                                                break
                                                        }
                                                    }
                                                });
                                            });
                                            Observer.observe(obj['this']);
                                        } else {
                                            // Possibly fall back to a more compatible method here
                                        }

                                        out(obj)
                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])
                                break
                            default:
                                err(`новая функция ${func}`)
                                break
                        }
                        out(obj)
                    } catch (e) { err(e) }
                })(obj, args[0], args[1], args[2], args[3])

                break
            default:
                err(`новая функция ${func}`)
                break
        }
    })
}
