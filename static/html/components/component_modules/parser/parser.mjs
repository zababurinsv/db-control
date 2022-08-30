import matcher from '/static/html/components/component_modules/matcher/matcher.mjs'
import utils from '/static/html/components/component_modules/utils/utils.mjs'
(()=>{

    if (!Object.keys) {
        Object.keys = function (o) {
            if (o !== Object(o)) { throw new TypeError('Object.keys called on a non-object') }
            var k = []; var p
            for (p in o) if (Object.prototype.hasOwnProperty.call(o, p)) k.push(p)
            return k
        }
    }

})()

let parser = {}
parser['this'] = {}
parser['this']['tag'] = []
parser['this']['tag']['in'] = []
parser['this']['tag']['out'] = []
parser['this']['tag'].push('div')
parser['this']['tag'].push('section')
parser['this']['tag'].push('style')
parser['this']['tag'].push('script')
parser['this']['tag'].push('varan-editor')
parser['this']['tag']['in'].push('&lt;div')
parser['this']['tag']['in'].push('&lt;/div')
parser['this']['tag']['in'].push('&lt;style')
parser['this']['tag']['in'].push('&lt;/style')
parser['this']['tag']['in'].push('&lt;section')
parser['this']['tag']['in'].push('/section&gt;')
parser['this']['tag']['in'].push('&lt;article')
parser['this']['tag']['in'].push('/article&gt;')
parser['this']['tag']['in'].push('&lt;time')
parser['this']['tag']['in'].push('/time&gt;')
parser['this']['tag']['in'].push('&lt;/script')
parser['this']['tag']['in'].push('&lt;script')
parser['this']['tag']['out'].push('&lt;p')
parser['this']['tag']['out'].push('&lt;/p')
parser['this']['tag']['out'].push('&lt;style')
parser['this']['tag']['out'].push('&lt;/style')
parser['this']['tag']['out'].push('&lt;section')
parser['this']['tag']['out'].push('/section&gt;')
parser['this']['tag']['out'].push('&lt;article')
parser['this']['tag']['out'].push('/article&gt;')
parser['this']['tag']['out'].push('&lt;time')
parser['this']['tag']['out'].push('/time&gt;')

export default  (obj, func, ...args)=>{
    return new Promise( function (resolve, reject) {
        let out = (obj) => {
            console.log('~~~ out  ~~~')
            resolve(obj)
        }
        let err = (error) => {
            console.log('~~~ err  ~~~', error)
            reject(error)
        }
        switch (func) {
            case 'set':
                (async (obj, props,data) => {
                    try {
                        // console.log(`app(${func}[(${obj['input']})${obj[props]}]property)`)
                        switch (obj[props]) {
                            case 'editor':
                                (async (obj, props,data) => {
                                    try {
                                        console.log(`${obj['input']}[(parser)${obj[props]}]`)


                                        let typeEditor = await utils({
                                            input: 'parser',
                                            this:obj['this']
                                        }, 'getType')


                                        obj['typeEditor'] = typeEditor
                                        for (let key = 0; key < obj['typeEditor'].length; key++) {
                                            switch (obj['typeEditor'][key]) {
                                                case 'text':
                                                    colorLog(`~~~~~~~~~~~~~set (wall).innerHTML)~~~~~~~~~~~~`, 'info', component)
                                                    obj['upload'] = {}
                                                    obj['this'].querySelector('.wall').innerHTML = ''
                                                    obj['this'].querySelector('.wall').innerHTML = component['content']
                                                    matcher['database']['request']['functions']['getObject'](obj)
                                                        .then((obj) => {
                                                            colorLog(`~~~~~~~~~~~~~set (wall).innerHTML)~~~~~~~~~~~~`, 'info', obj)
                                                            if (!obj['get']) {
                                                                obj['upload'] = component
                                                                obj['upload']['content'] = component['content']
                                                                matcher['database']['request']['functions']['setImages'](obj)
                                                                    .then((obj) => { })
                                                            } else {
                                                                colorLog(`~~~~~~~~~~~~~set (wall).innerHTML)~~~~~~get~~~~~~`, 'info', obj)
                                                                let name = {}
                                                                if (!obj['slot']) {
                                                                    name = obj['parent']
                                                                } else {
                                                                    name = obj['slot']
                                                                }
                                                                obj['upload'] = {}
                                                                for (let key = 0; key < obj['get_n'].length; key++) {
                                                                    obj['upload'] = obj['get_n'][key]
                                                                    obj['upload'][name]['content'] = component['content']
                                                                    obj['upload'][name]['edit-delta'] = component['edit-delta']
                                                                    matcher['database']['request']['functions']['updImage'](obj)
                                                                }
                                                            }
                                                        })

                                                    break
                                                case 'slider-one-text':
                                                    obj['upload'] = null
                                                    matcher['database']['request']['functions']['getObject'](obj)
                                                        .then((obj) => {
                                                            if (!obj['get']) {
                                                                obj['upload'] = component
                                                                obj['upload']['content'] = component['edit-content']
                                                                matcher['database']['request']['functions']['setImages'](obj)
                                                                    .then((obj) => {
                                                                        if (obj['this'].querySelector('.peppermint-slides') === null) {
                                                                            obj['this'].querySelector('.ql-view').innerHTML = component['content']
                                                                        } else {
                                                                            obj['this'].querySelector('.peppermint-slides').children[obj['slider']['getCurrentPos']()].innerHTML = component['content']
                                                                        }
                                                                    })
                                                            } else {
                                                                // let key = Object.keys(obj['get'][`${obj['slot']}`])[obj['slider']['getCurrentPos']()]
                                                                // component['id'] = key
                                                                let name = {}
                                                                if (!obj['slot']) {
                                                                    name = obj['parent']
                                                                } else {
                                                                    name = obj['slot']
                                                                }
                                                                let position = obj['slider']['getCurrentPos']()
                                                                let sort = []
                                                                for (let i = 0; i < obj['get_n'].length; i++) {
                                                                    sort.push(obj['get_n'][i][name]['view-slider-pos'])
                                                                }
                                                                sort.sort(function (a, b) {
                                                                    return a - b
                                                                })
                                                                for (let i = 0; i < obj['get_n'].length; i++) {
                                                                    if (obj['get_n'][i][name]['view-slider-pos'] === sort[position]) {
                                                                        obj['get_n'][i][name]['content'] = component['content']
                                                                        obj['get_n'][i][name]['edit-delta'] = component['edit-delta']
                                                                        obj['upload'] = obj['get_n'][i]
                                                                    }
                                                                }
                                                                obj['get'] = null
                                                                obj['get_n'] = null
                                                                matcher['database']['request']['functions']['updImage'](obj)
                                                                    .then((obj) => {
                                                                        obj['upload'] = null
                                                                        obj['update'] = null
                                                                        if (obj['this'].querySelector('.peppermint-slides') === null) {
                                                                            colorLog(`~~~~~~['functions']['updImage']~~~~~  ${component['content']}`, 'info', component['content'])
                                                                            obj['this'].querySelector('.ql-view').innerHTML = component['content']
                                                                        } else {
                                                                            colorLog(`~~~~~~['functions']['updImage']~~~slider~~  ${component['content']}`, 'info', component['content'])
                                                                            obj['this'].querySelector('.peppermint-slides').children[obj['slider']['getCurrentPos']()].innerHTML = component['content']
                                                                        }
                                                                    })
                                                            }
                                                        })
                                                    break
                                                default:



                                                    obj['upload'] = {}

                                                    while ( obj['this'].querySelector('.wall').lastChild) {
                                                        obj['this'].querySelector('.wall').removeChild( obj['this'].querySelector('.wall').lastChild);
                                                    }


                                                    obj['this'].querySelector('.wall').insertAdjacentHTML('beforeend', obj['component']['content'])
                                                    break
                                            }
                                        }
                                        out(obj)
                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])
                                break
                            default:
                                err(`new type [(${func})${obj[props]}]`)
                                break
                        }
                    } catch (e) { err(e) }
                })(obj, args[0], args[1], args[2], args[3])
                break
            default:
                err(`new function ${func}`)
                break
        }
    })
}
