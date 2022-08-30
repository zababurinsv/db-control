import IDBFS from '/static/html/components/component_modules/idbfs/idbfs.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import loader from '/static/html/components/component_modules/loader/loader.mjs'
export default async (v,p,c,obj,r) => {
    const target = {
        notProxied: "original value",
        proxied: "original value"
    };
    const handler = {
        get: function(target, prop, receiver) {
            if (prop === "proxied") {
                return "replaced value";
            }
            return Reflect.get(...arguments);
        }
    };
    let system = {
        _scriptDir: import.meta.url,
        ptr: {},
        validation: {
            key: (...args) =>{ return system.validation.value },
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

            }
        },
        location: location,
        value: {},
        json: {
            "ok":false,
            "status":false,
            "type": "main",
            "tagName": `${obj.this.tagName}`,
            "attributes": [{ "key": "href", "value": "#" }],
            "swap":[],
            "children": ''
        },
        proxy: new Proxy(target, handler),
        worker_main: { }
    }
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
    window.onbeforeunload = () => { fsSave(); }
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
                fsSetup("/universe");
                fsLoad();
            } catch (e) {
                console.error('error', e)
            }
        },
        print: d => system.worker_main["output"].push(d),
    })
    await loader('/static/html/components/component_modules/ipfs/db/orbitdb.js','OrbitDB')
    await loader('/static/html/components/component_modules/ipfs/ipfs/index.js','Ipfs')
    if(obj.preset.status) {
        let template = await (await import(`/static/html/components/${obj.this.tagName.toLowerCase()}/template/${obj.preset.name}/${obj.preset.name}.mjs`))['default'](v,p,c,obj,r)
        // console.log(`(external-index.mjs*)${template}`,template)
    }
}
