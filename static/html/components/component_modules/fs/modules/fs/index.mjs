import main from '/static/html/components/component_modules/wasm/fs/main.mjs'
import api from '/static/html/components/component_modules/fs/modules/fs/api/index.mjs'

const CONFIG_DEFAULTS = {
    // Folder to use for mounting the shared filesystem
    dirShared: "/shared",
    // Folder to use for mounting File/Blob objects to the virtual file system
    dirMounted: "/mnt",
    // Folder to use for symlinks (basically, we make a symlink to each file mounted on WORKERFS
    // so that operations like "samtools index" don't crash due to the read-only nature of WORKERS).
    // Also mount URLs lazily in that folder.
    dirData: "/data",
    // Interleave stdout/stderr. If set to false, `.exec()` returns an object { "stdout": <text>, "stderr": <text> }
    printInterleaved: true,

    callback: null,

    // Debugging
    debug: false,
    env: "prd",
    fs: {
        worker: { },
        idbfs: { },
        api: { }
    },
    terminate: () => { }
};

let create = async (object) => {
    if(! await object.fs.api.is.dir(object.dirMounted)) {
        await object.fs.api.create.dir(object.dirMounted);
    }
    if(! await object.fs.api.is.dir(object.dirShared)) {
        await object.fs.api.create.dir(object.dirShared);
    }
    if(! await object.fs.api.is.dir(`${object.dirShared}${object.dirData}`)) {
        await object.fs.api.create.dir(`${object.dirShared}${object.dirData}`);
    }
    if(! await object.fs.api.is.dir(`${object.dirShared}${object.dirMounted}`)) {
        await object.fs.api.create.dir(`${object.dirShared}${object.dirMounted}`);
    }
    return object
}

export let IDBFS = (object = { }) => {
    return new Promise(async (resolve, reject) => {
        try {
            object = Object.assign({}, CONFIG_DEFAULTS, object);
            let Module = await main()
            object.fs.idbfs = await Module.FS;
            object.fs.api = await api.IDBFS(object);
            await create(object)
            let mount = `${object.dirShared}${object.dirData}`
            await object.fs.api.mount(object.fs.idbfs.filesystems.IDBFS,  mount, {})
            await object.fs.api.load();
            object.terminate = () => {
                // if(window) {
                //     window.onbeforeunload = function () {
                //         object.fs.api.fsSave()
                //     };
                // } else {
                //     console.log('неопределённое поведение')
                // }
            }
            resolve(object.fs.api)
        } catch (e) {
            reject(e)
        }
    })
}

export default {
    IDBFS
}