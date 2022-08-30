import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import IDBFS from '/distrib/fs/idbfs.mjs'
export default async (v,p,c,obj,r) => {
    let system = {}
    try {
        system.worker_main = {
            _:"#external_fs",
            "output":[], 
            "path": ["/static/html/components/varan-header/external/fs.mjs"],
            "status":false,
            "ok":false,
            "fs": undefined,
            "ptr": {},
            "worker_main": {},
            "object": { },
            "_scriptDir": import.meta.url
        }
        const fsLoad = () => {
            return new Promise(async (resolve, reject) => {
                window.zb.fs[`${system.worker_main['fs.path']}`].syncfs(true , (err) => {
                    // console.log('header load')
                    resolve()
                });
            })
        }
        const fsSave  = () => {
            return new Promise(async (resolve, reject) => {
                window.zb.fs[`${system.worker_main['fs.path']}`].syncfs(false , (err) => {
                    console.log('header save')
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
                    fsSetup("/footer");
                  
                } catch (e) {
                    console.error('error', e)
                }
            },
            print: d => system.worker_main["output"].push(d),
        })
        await fsLoad()
        let dir = window.zb.fs['/footer'].readdir('/footer')
        for(let item of dir) {
            if(item !== '.' && item !== '..') {
                let html = obj.this.shadowRoot.querySelector(`.${item}`)
                let dataItem = JSON.parse(window.zb.fs[`/footer`].readFile(`/footer/${item}`,{ encoding: "utf8" }));
                html.style.left = dataItem.left
                html.style.top = dataItem.top
            }
        }
    
        return system
    } catch (error) {
        system = {
            _:"#external_fs",
            path: ["/static/html/components/varan-footer/external/fs.mjs"],
            status:false,
            ok:false,
            object: {
                container: error,
                state: error
            }
        }
        return system
    } finally {
        // console.log('system-fs-finaly', system)
    }
}