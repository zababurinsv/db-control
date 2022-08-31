import wasm from './wasm.mjs';
import { IDBFS, WORKERFS } from './api/index.mjs';

const CONFIG_DEFAULTS = {
    jinn: "/DATA",
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
    fs: {},
    terminate: () => {}
};

let create = async (object) => {
    if(!object.fs.worker.is.dir('/DATA-BROWSER')) {
        object.fs.worker.mkdirSync('/DATA-BROWSER');
    }

    if(!await object.fs.idbfs.is.dir(object.dirMounted)) {
        await object.fs.idbfs.create.dir(object.dirMounted);
    }

    if(!await object.fs.idbfs.is.dir(object.dirShared)) {
        await object.fs.idbfs.create.dir(object.dirShared);
    }

    if(!await object.fs.idbfs.is.dir(`${object.dirShared}${object.dirData}`)) {
        await object.fs.idbfs.create.dir(`${object.dirShared}${object.dirData}`);
    }

    if(!await object.fs.idbfs.is.dir(`${object.dirShared}${object.dirMounted}`)) {
        await object.fs.idbfs.create.dir(`${object.dirShared}${object.dirMounted}`);
    }
    return object;
};

export const indexFileSystem = (CONFIG = { }) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('set idbfs');
            let object = Object.assign({}, CONFIG_DEFAULTS, CONFIG);
            const Module = await wasm();
            object.fs.self = await Module.FS;
            object.fs.idbfs = await IDBFS(object);
            object.fs.worker = await WORKERFS(object);
            object = await create(object);
            const mount = `${object.dirShared}${object.dirData}`;
            await object.fs.idbfs.mount(object.fs.self.filesystems.IDBFS,  mount, {})
            await object.fs.idbfs.load();
            resolve({
                idbfs: object.fs.idbfs,
                worker: object.fs.worker
            });
        } catch (e) {
            reject(e);
        }
    });
};

// object.terminate = () => {
// if(window) {
//     window.onbeforeunload = function () {
//         object.fs.api.fsSave()
//     };
// } else {
//     console.log('неопределённое поведение')
// }
// }
