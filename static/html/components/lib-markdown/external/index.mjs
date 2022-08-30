import events from '/static/html/components/lib-markdown/external/events.mjs'
import IDBFS from '/static/html/components/lib-markdown/external/wasm/idbfs.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import Parser from '/static/html/components/component_modules/bundle/html2json/html2json.index.mjs'
import * as md2html from  '/static/html/components/lib-markdown/external/wasm/markdown.es.mjs'
import task from '/static/html/components/component_modules/heap/index.mjs'
import JQ from '/static/html/components/component_modules/jq/jq.mjs'
import TextEditor from '/static/html/components/component_modules/codemirror/codemirror.mjs'
export default async (v,p,c,obj,r) => {
    const target = []

    let handler = {
        get: function(obj, prop) {
            console.log('proxy-body-get', {
                obj:obj,
                prop:prop
            })
            return obj[prop];
        },
        set: function(obj, prop, value) {
            obj[prop] = value;
            console.log('proxy-body-set', prop ,value )
            switch (prop) {
                case 'length':
                    if(obj.length === 1){
                        let timerId = setTimeout(async function tick() {
                            if(obj.length === 0){
                                console.log('proxy-body-end')
                                clearTimeout(timerId);
                            }else{
                                console.log('proxy-body-all',obj, obj.length)
                                console.log('proxy-body-now',obj[0])
                                obj.shift()
                                timerId = setTimeout(tick, 10);
                            }
                        }, 0);
                    }
                    break
                default:
                    break
            }
            return true

        }
    }
    let codemirror = await TextEditor(obj.this.shadowRoot.querySelector('.markdown__self'),'javascript')
    let codemirror_json_html = await TextEditor(obj.this.shadowRoot.querySelector('.markdown__string_html_json_input'),'javascript')
    let codemirror_json_code = await TextEditor(obj.this.shadowRoot.querySelector('.markdown__string_views_json_input'),'javascript')
    let codemirror_android_json = await TextEditor(obj.this.shadowRoot.querySelector('.markdown__jasonelle_android_input'),'javascript')
    let backJson = (json) => {
        return new Promise( async (resolve, reject)=>{
            let Json = await fetch(`${location.origin}/static/html/components/lib-markdown/external/${(json)?json:'index'}.json`)
            try {
                Json = await Json.json()
            } catch(e) {
                Json = {
                    status: false,
                    ok: false,
                    error:e
                }
            }
            resolve(Json)
        })
    }

    await md2html.ready
    let system = {
        _scriptDir: import.meta.url,
        worker_main: {},
        validation: {
            key: (...args) =>{ return validation.value },
            value: { onhashchange:("onhashchange" in window)}
        },
        pull: {
            "resolve": async (item) => {
                let pull = {}
                try {
                    pull = await fetch(`https://zababurinsv.github.io/docs/${item? item: 'index'}.md`)
                        .catch((e)=>{
                            console.warn({ "error":e })
                        })
                    if(pull.status === 404) {
                        return false
                    } else {
                        pull = await pull.text();
                        system.value = pull
                        return pull
                    }
                }catch (e) {
                    return false
                }

            },
            "orbitdb": async (path) => {
                let pull = {}
                try {
                    let dir = window.zb.fs['/body'].readdir("/body")
                    if(dir.find(item => item === `${path}.md`)) {
                        let mdfs = window.zb.fs[`${system.worker_main['fs.path']}`].readFile(`/body/${path}.md`,{ encoding: "utf8" });
                        if(!isEmpty(mdfs)) {
                            system.value = mdfs
                        } else {
                            system.worker_main["md"]= "# Empty"
                            codemirror.setValue("# Empty")
                            // system.worker_main["markdown__self"].value= "# Empty"
                            system.worker_main["self.value"]= "# Empty"
                        }
                    } else {
                        console.log('query db')
                        pull = await task.set(true,'t','green',{
                            _:'get orbitdb',
                            item: (path)?path:'external'
                        },'/orbitdb')
                        if(pull.status === 'ok') {
                            system.value = pull.md[0]['md']
                            return pull
                        } else {
                            return false
                        }
                    }
                }catch (e) {
                    return false
                }
            }
        },
        location: location,
        value: {},
        json: {
            "ok":false,
            "status":false,
            "type": "main",
            "tagName": " main-html",
            "attributes": [{ "key": "href", "value": "#" }],
            "swap":[],
            "children": await backJson()
        },
        proxy: new Proxy(target, handler)
    }
    system.json.ok = true; 
    system.json.status = true; 
    system.json.children.view = system.json.children.isMainThread.find(element => {
        if(element.type === "element" && element.tagName === "h1") {
            if(`#${element.children[1].content}` === system.location.hash) {
                console.log('~~~~~~~~~~~',system.location.hash, element.children[0])
                return true
            }
        }
    });
    system.worker_main = {
        "self.value": await system["pull"]["resolve"](),
        "src": false,
        "url_md": undefined,
        "markdown__self":obj['this']['shadowRoot'].querySelector('.markdown__self'),
        "markdown__self_menu": obj['this']['shadowRoot'].querySelector('.markdown__self_menu'),
        "markdown__self_menu_aside_0": obj['this']['shadowRoot'].querySelector('.markdown__self_menu_aside_left'),
        "markdown__self_menu_aside_1": obj['this']['shadowRoot'].querySelector('.markdown__self_menu_aside_right'),
        "markdown__self_html": obj['this']['shadowRoot'].querySelector('.markdown__self_html'),
        "markdown__string_html": obj['this']['shadowRoot'].querySelector('.markdown__string_html'),
        "markdown__string_html.iframe": false,
        "markdown__string_html_json":obj['this']['shadowRoot'].querySelector('.markdown__string_html_json'),
        "markdown__string_html_json_input":obj['this']['shadowRoot'].querySelector('.markdown__string_html_json_input'),
        "markdown__string_html_json_output":obj['this']['shadowRoot'].querySelector('.markdown__string_html_json_output'),
        "markdown__string_views_json":obj['this']['shadowRoot'].querySelector('.markdown__string_views_json'),
        "markdown__string_views_json_input":obj['this']['shadowRoot'].querySelector('.markdown__string_views_json_input'),
        "markdown__string_views_json_output":obj['this']['shadowRoot'].querySelector('.markdown__string_views_json_output'),
        "markdown__string_menu_json_html_query":obj['this']['shadowRoot'].querySelector('.markdown__string_menu_json_html_query'),
        "markdown__string_menu_json_html_run":obj['this']['shadowRoot'].querySelector('.markdown__string_menu_json_html_run'),
        "markdown__string_menu_json_code_query":obj['this']['shadowRoot'].querySelector('.markdown__string_menu_json_code_query'),
        "markdown__string_menu_json_code_run":obj['this']['shadowRoot'].querySelector('.markdown__string_menu_json_code_run'),
        "CodeMirror":obj['this']['shadowRoot'].querySelectorAll('.CodeMirror'),
        "fs": undefined,
        "fs.path": undefined,
        "markdown__string_menu_codemirror_search":obj['this']['shadowRoot'].querySelector('.markdown__string_menu_codemirror_search'),
        "markdown__string_menu_codemirror_fnext":obj['this']['shadowRoot'].querySelector('.markdown__string_menu_codemirror_fnext'),
        "markdown__string_menu_codemirror_fprev":obj['this']['shadowRoot'].querySelector('.markdown__string_menu_codemirror_fprev'),
        "markdown__string_menu_codemirror_replace":obj['this']['shadowRoot'].querySelector('.markdown__string_menu_codemirror_replace'),
        "markdown__string_menu_codemirror_replall":obj['this']['shadowRoot'].querySelector('.markdown__string_menu_codemirror_replall'),
        "markdown__string_menu_codemirror_goto":obj['this']['shadowRoot'].querySelector('.markdown__string_menu_codemirror_goto'),
        "markdown__string_menu_codemirror_undo":obj['this']['shadowRoot'].querySelector('.markdown__string_menu_codemirror_undo'),
        "markdown__string_menu_codemirror_redo":obj['this']['shadowRoot'].querySelector('.markdown__string_menu_codemirror_redo'),
        "markdown__string_menu_change_views":obj['this']['shadowRoot'].querySelector('#markdown__string_menu_change_views'),
        "checkbox": obj['this']['shadowRoot'].querySelector('.markdown__string_menu_change_views'),
        "checkbox.checked": true,
        "markdown__button_views":obj['this']['shadowRoot'].querySelector('#markdown__button_views'),
        "output":[],
        "markdown__string_menu":obj['this']['shadowRoot'].querySelectorAll('.markdown__string_menu'),
        "markdown__string_views": obj['this']['shadowRoot'].querySelector('#markdown__string_views'),
        "markdown__jasonelle":obj['this']['shadowRoot'].querySelector('.markdown__jasonelle'),
        "markdown__jasonelle_android":obj['this']['shadowRoot'].querySelector('.markdown__jasonelle_android'),
        "markdown__jasonelle_android_input":obj['this']['shadowRoot'].querySelector('.markdown__jasonelle_android_input'),
        "markdown__jasonelle_android_output":obj['this']['shadowRoot'].querySelector('.markdown__jasonelle_android_output'),
        "markdown__jasonelle_android_query":obj['this']['shadowRoot'].querySelector('.markdown__jasonelle_android_query'),
        "markdown__jasonelle_android_run":obj['this']['shadowRoot'].querySelector('.markdown__jasonelle_android_run'),
        "markdown__button_query_anil":obj['this']['shadowRoot'].querySelector('.markdown__button_query_anil'),
        "markdown__button_update_anil":obj['this']['shadowRoot'].querySelector('.markdown__button_update_anil'),
        "markdown__button_delete_value":obj['this']['shadowRoot'].querySelector('#markdown__button_delete_value'),
        "markdown__button_delete":obj['this']['shadowRoot'].querySelector('.markdown__button_delete'),
        "markdown__button_url_value":obj['this']['shadowRoot'].querySelector('#markdown__button_url_value'),
        "markdown__button_url":obj['this']['shadowRoot'].querySelector('.markdown__button_url'),
    }
    if(isEmpty(system.json.children.view) && !isEmpty(system.location.hash)) {
        system.validation.value.fsRead = true
        system.validation.value.hashRead = false
    } else {
        if(isEmpty(system.json.children.view) && isEmpty(system.location.hash)) {
            system.validation.value.fsRead = true
            system.validation.value.hashRead = false
        } else {
            system.validation.value.hashRead = true
            system.validation.value.fsRead = false
        }
    }
    let hash = async (id) => {

    }
    system.worker_main.markdown__self_menu_aside_1.innerHTML = ''
    system.worker_main.markdown__self_menu_aside_1.innerHTML = Parser.stringify(system.json.children.isMainThread)
    system.json.children.isMainThread.forEach(element => {
        switch(element.type) {
            case"element":
                system.worker_main.markdown__self_menu_aside_1.querySelector(`#${element.attributes[0].value}`).addEventListener('click',async (event) =>{
                    event.preventDefault();
                    switch (event.target.id) {
                        case 'external':
                            await system.pull.orbitdb(event.target.id)
                            break
                        case 'anil':
                            await system.pull.orbitdb(event.target.id)
                            break
                        default:
                            await system.pull.resolve(event.target.id)
                            break
                    }
                    system.worker_main["markdown__string_views"].innerHTML = ''
                    system.worker_main["md"]= system.value
                    codemirror.setValue(system.value)
                    system.worker_main["markdown__self"].value= system.value
                    system.worker_main["self.value"]= system.value
                    updateUI('', 'isMainThread')
                })
                break
            default:
                break
        }
    });

    const fsLoad = () => {
        return new Promise(async (resolve, reject) => {
            window.zb.fs[`${system.worker_main['fs.path']}`].syncfs(true , (err) => {
                console.log('file load')
                resolve()
            });
        })
    }
    const fsSave  = () => {
        return new Promise(async (resolve, reject) => {
            window.zb.fs[`${system.worker_main['fs.path']}`].syncfs(false , (err) => {
                console.log('file save')
                resolve()
            });
        })
    }
    let outputJq = []
    function jq(jsonStr, query)
    {
        var fileName = "/tmp/data.json";
        // let fileName = "/body/jq.json";

        // Create file from object
        window.zb.jq.fs.writeFile(fileName, jsonStr);

        // Launch jq's main() function
        //   -M to disable colors
        //   -r to output in raw format
        //   -c to output in compressed format
        outputJq = [];
        window.zb.jq.self.callMain([ "-M", "-r", "-c", query, fileName ]);

        // Re-open stdout/stderr after jq closes them
        window.zb.fs['/body'].streams[1] = window.zb.fs['/body'].open("/dev/stdout", "w");
        window.zb.fs['/body'].streams[2] = window.zb.fs['/body'].open("/dev/stderr", "w");

        return outputJq;
    }
    window.onbeforeunload = () => { fsSave(); }
    JQ({
        // Don't run main on page load
        noInitialRun: true,

        // Print functions
        print: stdout => outputJq = stdout,
        printErr: stderr => console.warn(stderr),

        // When the module is ready
        onRuntimeInitialized: async function() {
            window.zb.jq = {}
            window.zb.jq.self = this
            window.zb.jq.fs = this.FS
            system.worker_main["markdown__jasonelle_android_run"].disabled = false;
            if(!system.worker_main['checkbox.checked']) {
                system.worker_main["markdown__string_menu_json_html_run"].disabled = false;
                system.worker_main["markdown__string_menu_json_code_run"].disabled = false;
            } else {
                system.worker_main["markdown__string_menu_json_html_run"].disabled = true;
                system.worker_main["markdown__string_menu_json_code_run"].disabled = true;
            }
        }
    })
    await IDBFS({
        preInit() {  },
        onRuntimeInitialized() {
            try {
                if(isEmpty(window.zb)) { window.zb = {}; window.zb.fs = {} }
                const fsSetup = path => {
                    system.worker_main['fs.path'] = path
                    window.zb.fs[`${path}`] = this.FS 
                    window.zb.fs[`${path}`].mkdir(path);
                    window.zb.fs[`${path}`].mount(window.zb.fs[`${path}`].filesystems.IDBFS, {}, path);
                };
                fsSetup("/body");
            } catch (e) {
                console.error('error', e)
            }
        },
        print: d => system.proxy.push(d),
    })
   async function selected(event) {
        event.preventDefault()
        system.worker_main["md"] = await fetch(`${location.origin}/markdown/${event.target.value}.md`)
        .catch((e)=>{
            console.warn({
                "error":e
            })
            return undefined
        })
        if(!isEmpty(system.worker_main["md"])) {
            system.worker_main["md"] = await system.worker_main["md"].text()
        } else {
            let dir = window.zb.fs[`${system.worker_main['fs.path']}`].readdir("/body")
            if(dir.find(item => item === 'data.md')) {
                let mdfs =  window.zb.fs[`${system.worker_main['fs.path']}`].readFile("/body/data.md",{ encoding: "utf8" });
                if(!isEmpty(mdfs)) {
                    system.worker_main["md"]= mdfs
                    codemirror.setValue(mdfs)
                    // system.worker_main["markdown__self"].value= mdfs
                    system.worker_main["self.value"]= mdfs 
                }
            } else {
                system.worker_main["md"]="# Empty"
            }
        }
        codemirror.setValue(system.worker_main["md"])
        system.worker_main["self.value"] = system.worker_main["md"]
        system.worker_main["checkbox.checked"] = true        
        updateUI('', 'selected')
    }
    function download() {
        let name = prompt('Введите название файла', 'default');
        let dir = window.zb.fs[`${system.worker_main['fs.path']}`].readdir("/body")  
        let filename = `${name}.md`
        let text = ''
        if(dir.find(item => item === 'data.md')) {
            text =  window.zb.fs[`${system.worker_main['fs.path']}`].readFile("/body/data.md",{ encoding: "utf8" });
        }
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
    function upload(event) {
        console.log(event.path[0].files[0])
        let reader = new FileReader();
        reader.readAsText(event.path[0].files[0]);
        reader.onload = function() {
            system.worker_main["markdown__string_views"].innerHTML = ''
            system.worker_main["md"]= reader.result
            codemirror.setValue(reader.result)
            // system.worker_main["markdown__self"].value= reader.result
            system.worker_main["self.value"]= reader.result
            updateUI('', 'upload')
          };
          reader.onerror = function() {
            console.log(reader.error);
          };
    }
    function changeViews(event) {
        if(event.target.checked) {
            // system.worker_main["markdown__self"].style.display = "block"
            system.worker_main["markdown__self_html"].innerHTML = ''
            system.worker_main["markdown__self_html"].style.display = "none"
            system.worker_main["markdown__self_menu"].style.display = "grid"
            system.worker_main["markdown__self_menu_aside_1"].style.display = "block"
            system.worker_main["markdown__self_menu_aside_0"].style.display = "block"
            system.worker_main["markdown__string_html"].style.display = "block"
            system.worker_main["markdown__string_menu"][1].style.display = "flex"
            system.worker_main['CodeMirror'][0].style.display = "block"
        } else {
            system.worker_main["markdown__self"].style.display = "none"
            system.worker_main["markdown__self_html"].innerHTML = ''
            system.worker_main["markdown__self_html"].innerHTML = system.worker_main['markdown__string_html'].innerHTML
            system.worker_main["markdown__self_html"].style.display = "block"
            system.worker_main["markdown__self_menu"].style.display = "flex"
            system.worker_main["markdown__self_menu"].style.height = "auto"
            system.worker_main['CodeMirror'][0].style.display = "none"
            system.worker_main["markdown__string_html"].style.display = "none"
            system.worker_main["markdown__string_menu"][1].style.display = "none"
            system.worker_main["markdown__self_menu_aside_1"].style.display = "none"
            system.worker_main["markdown__self_menu_aside_0"].style.display = "none"
        }
    }
    function markdownToHTML(markdown) {
        system.worker_main["output"]  = [];
        window.zb.fs[`${system.worker_main['fs.path']}`].writeFile('/body/data.md',markdown)
        system.worker_main["output"] = md2html.parse(markdown)
        return system.worker_main["output"];
    }
    function asideitems (items = Array, item, id) {
        if(id === 'aside') {
            let component_h1 = document.createElement('h1')
            component_h1.innerText = 'empty'
            system.worker_main["markdown__self_menu_aside_0"].innerHTML = ''
            system.worker_main["markdown__self_menu_aside_0"].appendChild(component_h1)
        } else {
            for(let self of items) {
                let h1save = {}
                let section = document.createElement('section')
                section.classList.add(`${id}__list`);
                section.classList.add(`aside-menu`);
                // console.assert(false,items,  isEmpty(item),id )
                if(!isEmpty(item)) {
                    for(let paragraph of item) {
                        paragraph.addEventListener("click", async (event) => {
                            system.worker_main["markdown__string_html"].querySelector(`#${event.target.querySelector('a').id}`).scrollIntoView({block: "start", behavior: "smooth"})
                        }, false);
                        section.prepend(paragraph)
                    }

                    if(!isEmpty(self)) {
                        h1save = self.cloneNode(true)
                        system.worker_main["markdown__self_menu_aside_0"].innerHTML = ''
                        system.worker_main["markdown__self_menu_aside_0"].appendChild(h1save)
                        system.worker_main["markdown__self_menu_aside_0"].appendChild(section)
                    } else {
                        let component_h1 = document.createElement('h1')
                        let component_a = document.createElement('a')
                        let component_text = system.worker_main['markdown__string_html'].querySelector('h1').innerText
                        component_h1.id = id
                        component_h1.innerText = isEmpty(component_text)?'external': component_text
                        component_a.setAttribute('aria-hidden', true)
                        component_a.href = `#${id}`
                        component_h1.appendChild(component_a)
                        system.worker_main["markdown__self_menu_aside_0"].innerHTML = ''
                        system.worker_main["markdown__self_menu_aside_0"].appendChild(component_h1)
                        system.worker_main["markdown__self_menu_aside_0"].appendChild(section)
                    }
                } else {
                    if(!isEmpty(self)) {
                        h1save = self.cloneNode(true)
                        system.worker_main["markdown__self_menu_aside_0"].innerHTML = ''
                        system.worker_main["markdown__self_menu_aside_0"].appendChild(h1save)
                    } else {
                        let component_h1 = document.createElement('h1')
                        let component_a = document.createElement('a')
                        let component_text = system.worker_main['markdown__string_html'].querySelector('h1').innerText
                        component_h1.id = id
                        component_h1.innerText = isEmpty(component_text)?'external': component_text
                        component_a.setAttribute('aria-hidden', true)
                        component_a.href = `#${id}`
                        component_h1.appendChild(component_a)
                        system.worker_main["markdown__self_menu_aside_0"].innerHTML = ''
                        system.worker_main["markdown__self_menu_aside_0"].appendChild(component_h1)
                    }
                }
            }
        }
        return true
    }
    function ucFirst(str) {
        if (!str) return str;
        return str[0].toLowerCase() + str.slice(1);
    }
    function saveMd () {
        return new Promise(async (resolve, reject) => {
            let code = {}
            // codemirror.setValue(system.worker_main["self.value"])
            system.worker_main["markdown__self"].innerHTML = system.worker_main["self.value"];
            system.worker_main["output"] = markdownToHTML(system.worker_main["self.value"]);
            system.worker_main["markdown__string_html"].innerHTML = system.worker_main["output"];
            code = {}
            code.innerText = ' <div> </div> '
            if(!isEmpty(system.worker_main["markdown__string_html"].querySelector('code'))) {
                code = system.worker_main["markdown__string_html"].querySelector('code').cloneNode(true)
                system.worker_main["markdown__string_html"].querySelector('code').remove()
            }
            let tags = system.worker_main["markdown__string_html"].children
            let h1 = {}
            let h = []
            let countH1 = 0
            for(let i =0; i < tags.length; i++ ) {
                if(tags[i].tagName === 'H1') {
                    if(tags[i].children.length !== 0){
                        let str = ucFirst(tags[i].innerText.replace(/\s/g, ''))
                        tags[i].querySelector('a').id = str
                        if(countH1 === 0) {
                            h1 = tags[i].querySelector('a').id
                            countH1++
                        } else {
                            if(tags[i].children.length !== 0){
                                let str = ucFirst(tags[i].innerText.replace(/\s/g, ''))
                                tags[i].querySelector('a').id = str
                                h.unshift(tags[i].cloneNode(true))
                            } else {
                                h.unshift(tags[i].cloneNode(true))
                            }
                        }
                    }
                } else {
                    if(tags[i].tagName === 'H2' || tags[i].tagName === 'H3' || tags[i].tagName === 'H4' || tags[i].tagName === 'H5' ||tags[i].tagName === 'H6') {
                        if(tags[i].children.length !== 0){
                            let str = ucFirst(tags[i].innerText.replace(/\s/g, ''))
                            tags[i].querySelector('a').id = str
                            h.unshift(tags[i].cloneNode(true))
                        } else {
                            h.unshift(tags[i].cloneNode(true))
                        }
                    }
                }
            }
            if(isEmpty(h1)) {
                h1 = "aside"
            }
            let section_1 = system.worker_main["markdown__self_menu_aside_1"].querySelectorAll('section')
            let section_2 = system.worker_main["markdown__self_menu_aside_0"].querySelectorAll('section')

            if(section_1.length !== 0) {
                for (let i =0;i < section_1.length;i++){
                    section_1[i].parentNode.removeChild(section_1[i])
                }
            }
            if(section_2.length !== 0) {
                for (let i =0;i < section_2.length;i++){
                    section_2[i].parentNode.removeChild(section_2[i])
                }
            }
            if(h1 === 'aside') {
                asideitems([
                    [system.worker_main["markdown__self_menu_aside_1"]],
                ], h, h1)
            } else {
                asideitems(
                  [system.worker_main["markdown__self_menu_aside_1"].querySelector(`#${h1}`)],
                  h,
                  h1
                )
            }
            system.worker_main["markdown__string_html.code"] = code.innerText;
            system.worker_main["markdown__string_html.innerHTML"] = system.worker_main["markdown__string_html"].innerHTML;
            system.worker_main["src"] = 'data:text/html;charset=utf-8,' + encodeURIComponent(system.worker_main["markdown__string_html.code"])
            if(system.worker_main["markdown__string_views"].querySelector('iframe')) {
                system.worker_main["markdown__string_views"].querySelector('iframe').remove()
            }
            system.worker_main["markdown__string_html.iframe"] = document.createElement('iframe');
            system.worker_main["markdown__string_html.iframe"].src = system.worker_main["src"]
            system.worker_main["markdown__string_html.iframe"].width = "100%";
            system.worker_main["markdown__string_html.iframe"].height = "100%";
            system.worker_main["markdown__string_html.iframe"].style.border = "0";
            system.worker_main["markdown__string_html.iframe"].style.frameBorder = "0";
            system.worker_main["markdown__string_html.iframe"].sandbox = "allow-scripts";
            system.worker_main["markdown__string_views"].appendChild(system.worker_main["markdown__string_html.iframe"]);
            (code.innerText === ' <div> </div> ')
            ? system.worker_main["markdown__string_views"].style.height = '1vw'
            : system.worker_main["markdown__string_views"].style.height = '50vw'
            system.worker_main["markdown__self_html"].innerHTML = system.worker_main["markdown__string_html"].innerHTML;
            // system.worker_main["markdown__string_menu"][0].scrollIntoView()
            let json = {
                code: Parser.parse(system.worker_main['markdown__string_html.code']),
                html: Parser.parse(system.worker_main['markdown__string_html.innerHTML'])
            }
            codemirror_json_html.setValue(Parser.json(json.html))
            codemirror_json_code.setValue(Parser.json(json.code))
            resolve(fsSave())
        })
    }
    function markdown__string_menu_change_true(event) {
        system.worker_main["markdown__string_views"].innerHTML = ''
        if(system.worker_main["markdown__string_views"].querySelector('iframe')) {
            system.worker_main["markdown__string_views"].querySelector('iframe').remove()
        }
        system.worker_main["markdown__string_html"].style.display= 'block'
        system.worker_main["markdown__string_html"].innerHTML = ''
        system.worker_main["markdown__string_html"].innerHTML = system.worker_main['markdown__string_html.innerHTML']
        system.worker_main["markdown__string_html"].style.whiteSpace = "initial"

        system.worker_main["markdown__string_html_json"].style.display = 'none'

        system.worker_main["markdown__string_html.iframe"] = document.createElement('iframe');
        system.worker_main["markdown__string_html.iframe"].src = system.worker_main["src"]
        system.worker_main["markdown__string_html.iframe"].width = "100%";
        system.worker_main["markdown__string_html.iframe"].height = "100%";
        system.worker_main["markdown__string_html.iframe"].style.border = "0";
        system.worker_main["markdown__string_html.iframe"].style.frameBorder = "0";
        system.worker_main["markdown__string_html.iframe"].sandbox = "allow-scripts";
        system.worker_main["markdown__string_views"].appendChild(system.worker_main["markdown__string_html.iframe"])
        system.worker_main["markdown__string_views"].style.height = '25vh'
        system.worker_main["markdown__string_views"].style.whiteSpace = "initial"
        system.worker_main["markdown__string_views"].style.display = "flex"

        system.worker_main["markdown__string_views_json"].style.display = 'none'

        system.worker_main["markdown__string_menu_json_html_run"].disabled = true;
        system.worker_main["markdown__string_menu_json_code_run"].disabled = true;
    }
    function markdown__string_menu_change_false(event) {
        if(system.worker_main["markdown__string_views"].querySelector('iframe')) {
            system.worker_main["markdown__string_views"].querySelector('iframe').remove()
        }
        let json = {
            code: Parser.parse(system.worker_main['markdown__string_html.code']),
            html: Parser.parse(system.worker_main['markdown__string_html.innerHTML'])
        }

        system.worker_main["markdown__string_html"].style.display = 'none'
        system.worker_main["markdown__string_html_json"].style.display = 'flex'
        codemirror_json_html.setValue(Parser.json(json.html))
        system.worker_main["markdown__string_views"].style.display = 'none'
        system.worker_main["markdown__string_views_json"].style.display = 'flex'
        codemirror_json_code.setValue(Parser.json(json.code))
        system.worker_main["markdown__string_menu_json_html_run"].disabled = false;
        system.worker_main["markdown__string_menu_json_code_run"].disabled = false;
    }
    let updateUI = async (event = {}, type) => {
        console.log('updateUI', type)
        if(type === 'codeMirror' || type ===  'fsLoad') {
                system.worker_main["src"] = 'data:text/html;charset=utf-8,' + encodeURIComponent(system.worker_main["markdown__string_html.code"])
                system.worker_main["self.value"] = codemirror.getValue()
                await saveMd()
        } else {
            console.log('updateUI unknown', type)
        }
    }
    await fsLoad()
    if(system.validation.value.fsRead) {
        let dir = window.zb.fs[`${system.worker_main['fs.path']}`].readdir("/body")  
        if(dir.find(item => item === 'data.md')) {
            let mdfs = window.zb.fs[`${system.worker_main['fs.path']}`].readFile("/body/data.md",{ encoding: "utf8" });
            if(!isEmpty(mdfs)) {
                system.worker_main["md"]= mdfs
                codemirror.setValue(mdfs)
                // system.worker_main["markdown__self"].value= mdfs
                system.worker_main["self.value"]= mdfs
                updateUI('', 'fsLoad')
            } else {
                system.worker_main["md"]= "# Empty"
                codemirror.setValue("# Empty")
                // system.worker_main["markdown__self"].value= "# Empty"
                system.worker_main["self.value"]= "# Empty"
            }
        } else {
            system.worker_main["md"]= "# Empty"
            codemirror.setValue("# Empty")
            // system.worker_main["markdown__self"].value= "# Empty"
            system.worker_main["self.value"]= "# Empty"
        }
    } else {
        if(system.validation.value.hashRead) { hash() } else {
            updateUI('', 'undefined')
        }
    }
    async function update(event) {
        let res = {}
        let path = {}

        switch (event.target.id) {
            case 'markdown__button_update_anil':
                path = 'anil'
                break
            default:
                path = 'external'
                break
        }
        let status = await task.set(true,path,'red',codemirror.getValue(), '/orbitdb/set/:external')
        // let status = await task.set(true,'','red',system['worker_main']['markdown__self'].innerHTML, '/orbitdb/set/:external')
    }

    async function query(event) {
        let res = {}
        let path = {}
        switch (event.target.id) {
            case'markdown__button_query':
                path = 'external'
                break
            case 'markdown__button_query_anil':
                path = 'anil'
                break
            default:
                path = 'external'
                break
        }

        res = await task.set(true,path,'red',codemirror.getValue(), '/orbitdb/get/:external')
        if(res.status === 'ok') {
            try {
                window.zb.fs['/body'].writeFile(`/body/${path}.md`, res['md'][0]['md'])
                await system.pull.orbitdb(`${path}`)
                system.worker_main["markdown__string_views"].innerHTML = ''
                system.worker_main["md"]= system.value
                codemirror.setValue(system.value)
                system.worker_main["markdown__self"].value= system.value
                system.worker_main["self.value"]= system.value
            } catch (e) {
                system.worker_main["markdown__string_views"].innerHTML = ''
                system.worker_main["md"]= system.value
                codemirror.setValue(system.value)
                system.worker_main["markdown__self"].value= system.value
                system.worker_main["self.value"]= system.value
            }
        }
    }
    function checkbox(event) {
        switch(event.target.id) {
            case'markdown__button_views':
                system.worker_main['checkbox.checked'] = true
                system.worker_main['markdown__string_menu_change_views'].checked = true
                markdown__string_menu_change_true('updateUI')
                changeViews(event)
                break
            default:
                system.worker_main['checkbox.checked'] = event.target.checked
                system.worker_main['checkbox.checked']
                ? markdown__string_menu_change_true('updateUI')
                : markdown__string_menu_change_false('updateUI')
                break
        }
    }

    async function fetchMarkDown(event) {
        system.worker_main["url_md"] = await fetch(system.worker_main['markdown__button_url_value'].value)
          .catch((e)=>{
              console.warn({
                  "error":e
              })
              return undefined
          })
        system.worker_main["url_md"] = await system.worker_main["url_md"].text()

        codemirror.setValue(system.worker_main["url_md"])
        system.worker_main["self.value"] = system.worker_main["url_md"]
        system.worker_main["checkbox.checked"] = true
        updateUI('', 'fetch url')
    }
    obj.system = system
    events(true, codemirror, 'red', obj, 'codemirror events')
    codemirror.on('update', (event)=>{
        updateUI(event,'codeMirror')
    })

    try {
        let url = '/android/index.json'
        if(location.hostname !== 'localhost'){
            url = 'https://zababurinsv.github.io/android/index.json'
        }
        let jasonelle = await fetch(url)
        jasonelle = await jasonelle.text()
        codemirror_android_json.setValue(jasonelle)

    }catch (e) {
        console.warn({
            _:'error',
            data:e
        })
    }

   async function remove(event) {
        task.set(true,'t','green',{
            _:'delete data in orbitdb',
            item: system.worker_main["markdown__button_delete_value"].value
        },'/orbitdb/delete')
    }

    obj.this.shadowRoot.querySelector(".markdown__string_menu_json_html_run").addEventListener("click", async (event) =>
    {
        let out = jq(
          codemirror_json_html.getValue(),
          system.worker_main["markdown__string_menu_json_html_query"].value
        );
        console.log('~~~~~~~~~~~~~', out)
        system.worker_main["markdown__string_html_json_output"].value = JSON.stringify(JSON.parse(out), undefined, 4);
    });
    obj.this.shadowRoot.querySelector(".markdown__string_menu_json_code_run").addEventListener("click", async (event) =>
    {
        let out  = jq(
          codemirror_json_code.getValue(),
          system.worker_main["markdown__string_menu_json_code_query"].value
        );
        system.worker_main["markdown__string_views_json_output"].value =  JSON.stringify(JSON.parse(out), undefined, 4);
    });
    system.worker_main["markdown__jasonelle_android_run"].addEventListener("click", async (event) =>
    {
        let out  = jq(
          codemirror_android_json.getValue(),
          system.worker_main["markdown__jasonelle_android_query"].value
        );
        if(!isEmpty(out)) {
            system.worker_main["markdown__jasonelle_android_output"].value =  JSON.stringify(JSON.parse(out), undefined, 4);
        }
    });
    system.worker_main["markdown__button_url"].addEventListener("click", fetchMarkDown);
    system.worker_main["markdown__button_url_value"].addEventListener("input", (event)=>{
        isEmpty(event.target.value)
          ? system.worker_main["markdown__button_url"].disabled = true
          : system.worker_main["markdown__button_url"].disabled = false
    });
    obj.this.shadowRoot.querySelector('.markdown__button_views').addEventListener("change", checkbox);
    obj.this.shadowRoot.querySelector('.markdown__string_menu_change_views').addEventListener("change", checkbox);
    obj.this.shadowRoot.querySelector('.markdown__button_update').addEventListener("click", update);
    obj.this.shadowRoot.querySelector('.markdown__button_query').addEventListener("click", query);
    system.worker_main["markdown__button_query_anil"].addEventListener("click", query);
    system.worker_main["markdown__button_update_anil"].addEventListener("click", update);
    system.worker_main["markdown__button_delete"].addEventListener("click", remove);
    system.worker_main["markdown__button_delete_value"].addEventListener("input", (event)=>{
        isEmpty(event.target.value)
            ? system.worker_main["markdown__button_delete"].disabled = true
            : system.worker_main["markdown__button_delete"].disabled = false
    });
    obj.this.shadowRoot.querySelector('.markdown__button_download').addEventListener("click", download);
    obj.this.shadowRoot.querySelector('.markdown__button_upload').addEventListener("change", upload);
    obj.this.shadowRoot.querySelector('.markdown__button_select').addEventListener("change", selected);
}