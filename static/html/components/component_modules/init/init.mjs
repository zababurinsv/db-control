import queue from '/static/html/components/component_modules/staticProperty/staticProperty.mjs'
import colorLog from '/static/html/components/component_modules/colorLog/colorLog.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import Quill from '/static/html/components/component_modules/bundle/quill.mjs'
export default  (obj, func, ...args)=>{
    return new Promise( async function (resolve, reject) {
            let quill =  (await Quill.default()).Quill
            let out = (obj) => {
                resolve(obj)
            }
            let err = (error) => {
                console.log('~~~ err  ~~~', error)
                reject(error)
            }
            switch (func) {
                case 'init':
                    (async (obj, props,data) => {
                        try {
                            // console.log(`app(${func}[(${obj['input']})${obj[props]}]property)`)
                            switch (obj[props]) {
                                case 'editor':
                                    (async (obj, props,data) => {
                                        try {
                                            (async (obj, props,data) => {
                                                try {
                                                    console.log(`${obj['input']}[(init)${obj[props]}]`)


                                                    //        console.assert('false', config)
                                                    //     [{'color': []}, {'background': []}], // dropdown with defaults from theme
                                                    let editor = {}
                                                    editor['self'] = obj['this']
                                                    editor['this'] = {}
                                                    editor['this']['quillEditor'] = {}
                                                    editor['this']['contentEditor'] = {}
                                                    editor['this']['contentView'] = {}
                                                    editor['this']['contentViewSlider'] = {}
                                                    editor['this']['toolbarOptions'] = [
                                                        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
                                                        ['blockquote', 'code-block'],
                                                        [{'header': 1}, {'header': 2}], // custom button values
                                                        [{'list': 'ordered'}, {'list': 'bullet'}],
                                                        [{'script': 'sub'}, {'script': 'super'}], // superscript/subscript
                                                        [{'indent': '-1'}, {'indent': '+1'}], // outdent/indent
                                                        ['link', 'image'],
                                                        [{'size': ['small', false, 'large', 'huge']}], // custom dropdown
                                                        [{'header': [1, 2, 3, 4, 5, 6, false]}],
                                                        [{'color': ["#000000", "#232f62", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466", 'custom-color']}, {'background': []}],
                                                        [{'font': []}],
                                                        [{'align': []}],
                                                        ['clean'] // remove formatting button
                                                    ]
                                                    editor['this']['contentView'] = obj['this'].querySelector('.wall')
                                                    editor['this']['quillEditor'] = obj['this'].querySelector('.editor')
                                                    editor['this']['contentViewSlider'] =  obj['this'].querySelector('.peppermint-slides')

                                                    // console.assert(false,  config['Quill'])
                                                    // config['Quill'].register('modules/imageResize', config['ImageResize']);
                                                    // config['Quill'].register('modules/imageDrop', config['ImageDrop'])


                                                    editor['quill'] = new quill(editor['this']['quillEditor'], {
                                                        theme: 'snow',
                                                        modules: {
                                                            // imageResize: {
                                                            //     parchment: config['Quill'].import('parchment'),
                                                            //     displaySize: true
                                                            // },
                                                            toolbar: editor['this']['toolbarOptions']
                                                        },
                                                        placeholder: 'Введите сообщение...'
                                                    })
                                                    editor['quill'].getModule('toolbar').addHandler('color', (value) => {

                                                        // if the user clicked the custom-color option, show a prompt window to get the color
                                                        if (value == 'custom-color') {
                                                            value = prompt('Enter Hex/RGB/RGBA');
                                                        }

                                                        editor['quill'].format('color', value);
                                                    });
                                                    if(isEmpty(obj['slot'])){
                                                        err('должен быть объект slot')
                                                    }

                                                    editor['slot'] = obj['slot']
                                                    editor['parent'] = obj['parent']
                                                    editor['obj'] = {}
                                                    editor['obj']['this'] = obj['this']
                                                    editor['editor'] = editor //надо исправить
                                                    editor['menu'] = obj['menu']
                                                    let store =  await queue({
                                                        input:'init',
                                                        self: obj['this'],
                                                        type: 'editor',
                                                        slot: obj['slot'],
                                                        menu:obj['menu'],
                                                        editor:editor
                                                    },'set', 'type' )

                                                    colorLog(`~~~~~~~~~end init~~~~~~~~~`, 'warning', store)
                                                    out(editor)
                                                } catch (e) { err(e) }
                                            })(obj, args[0], args[1], args[2], args[3])


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
