import axios from '../stream/axios.mjs'
export let WORKERFS =  (object = {}) => {
    return new Promise(async (resolve, reject) => {
        let workerfs = {
            files: [],
            is: {
                chrdev:  async (chrdev) => {
                    try {
                        let isChrdev = (object.fs.worker.analyzePath(isChrdev).exists)
                            ? await object.fs.worker.isChrdev(object.fs.worker.analyzePath(block).object.mode)
                            : false
                        console.log('socket', isChrdev, chrdev)
                        resolve(isChrdev)
                    } catch (e) {
                        console.error('error', e)
                        resolve({
                            status: true,
                            message: e
                        })
                    }
                },
                socket: async (socket) => {
                    try {
                        let isSocket = (object.fs.worker.analyzePath(isSocket).exists)
                            ? await object.fs.worker.isSocket(object.fs.worker.analyzePath(block).object.mode)
                            : false
                        console.log('socket', isSocket, socket)
                        resolve(isSocket)
                    } catch (e) {
                        console.error('error', e)
                        resolve({
                            status: true,
                            message: e
                        })
                    }
                },
                blkdev: async (block) => {
                    try {
                        let isBlkdev = (object.fs.worker.analyzePath(block).exists)
                            ? await object.fs.worker.isBlkdev(object.fs.worker.analyzePath(block).object.mode)
                            : false
                        resolve(isBlkdev)
                    } catch (e) {
                        console.error('error', e)
                        resolve({
                            status: true,
                            message: e
                        })
                    }
                },
                file: async (file) => {
                    try {
                        let isFile = (object.fs.worker.analyzePath(file).exists)
                            ? await object.fs.worker.isFile(object.fs.worker.analyzePath(file).object.mode)
                            : false
                        console.log(`${file} file ${isFile}`)
                        resolve(isFile)
                    } catch (e) {
                        console.error('error', e)
                        resolve({
                            status: true,
                            message: e
                        })
                    }
                },
                dir: (dir = '/') => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            let isDir = (object.fs.worker.analyzePath(dir).exists)
                                ? await object.fs.worker.isDir(object.fs.worker.analyzePath(dir).object.mode)
                                : false
                            console.log(`${dir} dir ${isDir}`)
                            resolve(isDir)
                        } catch (e) {
                            console.error('error', e)
                            resolve({
                                status: true,
                                message: e
                            })
                        }
                    })
                },
                link: async (dir = '/') => {
                    try {
                        let isLink = (object.fs.worker.analyzePath(dir).exists)
                            ? await object.fs.worker.isLink(object.fs.worker.analyzePath(dir).object.mode)
                            : false
                        resolve(isLink)
                    } catch (e) {
                        console.error('error', e)
                        resolve({
                            status: true,
                            message: e
                        })
                    }
                },
            },
            list: {
                dir: (path = '/') => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            let list = {}
                            if(await workerfs.is.dir(path)) {
                                list = (await workerfs.readdir(path)).filter(item => item !== '.' && item !== '..')
                            }
                            console.log(list)
                            resolve(list)
                        } catch (e) {
                            console.error('error',e)
                            resolve({
                                status: true,
                                message: e
                            })
                        }
                    })
                },
                files: () => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            let list = {}
                            if(await workerfs.is.dir(object.dirMounted)) {
                                list = (await workerfs.readdir(object.dirMounted)).filter(item => item !== '.' && item !== '..')
                            }
                            resolve(list)
                        } catch (e) {
                            console.error('error',e)
                            resolve({
                                status: true,
                                message: e
                            })
                        }
                    })
                }
            },
            readFile: (file, type = 'binary' | 'utf8') => {
                return new Promise(async (resolve, reject) => {
                    try {
                        let contents = object.fs.worker.readFile(file, { encoding: type });
                        resolve(contents)
                    } catch (e) {
                        resolve({
                            status: true,
                            message: e
                        })
                    }
                })
            },
            symlink: (oldpath, newpath) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        let symlink = await object.fs.worker.symlink(oldpath, newpath)
                        resolve(symlink)
                    } catch (e) {
                        console.error('error', e)
                        resolve({
                            status: true,
                            message: e
                        })
                    }
                })
            },
            unlink: (path) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        let unlink = await object.fs.worker.unlink(path)
                        resolve(unlink)
                    } catch (e) {
                        resolve({
                            status: true,
                            message: e
                        })
                    }
                })
            },
            read: async (file, call, highWaterMark = 200, isRelation = true ) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        let path = `${object.dirMounted}/${file}`
                        let isFile = workerfs.is.file(path)
                        if(isFile) {
                            let reader = await axios(object,'isWorkerFs', path, highWaterMark, isRelation)
                            new ReadableStream({
                                start(controller) {
                                async function push() {
                                    await reader.read().then( ({done, value, progress}) => {
                                            if (done) {
                                                call(done, value, progress)
                                                controller.close();
                                                resolve(true)
                                                return;
                                            }
                                            controller.enqueue(done, value);
                                            call(done, value, progress)
                                            push();
                                        })
                                    }
                                    push();
                                }
                            })
                        } else {
                            resolve(false)
                        }
                    } catch (e) {
                        console.error('dir error:',e)
                        resolve({
                            status: true,
                            message: e
                        })
                    }
                })
            },
            stat: (path) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        let stat = await object.fs.worker.stat(path)
                        console.log('stat:',stat)
                        resolve(stat)
                    } catch (e) {
                        console.error('dir error:',e)
                        resolve({
                            status: true,
                            message: e
                        })
                    }
                })
            },
            readdir: (path = "/") => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const readdir = (await workerfs.is.dir(path))
                            ? await object.fs.worker.readdir(path)
                            : false
                        resolve(readdir)
                    } catch (e) {
                        console.error('dir error:',e)
                        resolve({
                            status: true,
                            message: e
                        })
                    }
                })
            },
            unMount: async (dirMounted = '/newKind') => {
                try {
                    let unMount = await object.fs.worker.unmount(dirMounted)
                    console.log('unMount', unMount)
                    resolve(unMount)
                } catch (e) {
                    resolve({
                        status: true,
                        message: e
                    })
                }
            },
            mount: (files,dirMounted = '/mnt', dirShared = '/shared', dirData='/data') => {
                return new Promise((resolve, reject) => {
                    let toMount = [], mountedPaths = [];
                    if(!files?.length || typeof files === "string")
                        files = [ files ];
                    for(let file of files)
                    {
                        if(file instanceof File || (file?.data instanceof Blob && file.name)) {
                            toMount.push(file);
                            mountedPaths.push(file.name);
                        } else if(typeof file == "string" && file.startsWith("http")) {
                            const fileName = file.split("//").pop().replace(/\//g, "-");
                            mountedPaths.push(fileName);
                        } else {
                            throw "Cannot mount file(s) specified. Must be a File, Blob, or a URL string.";
                        }
                    }
                    try {
                        workerfs.unmount(dirMounted)
                    } catch(e) {}
                    workerfs.files = workerfs.files.concat(toMount);
                    object.fs.worker.mount(object.fs.worker.filesystems.WORKERFS, {
                        files: workerfs.files.filter(f => f instanceof File),
                        blobs: workerfs.files.filter(f => f?.data instanceof Blob)
                    }, dirMounted);

                    let out = mountedPaths.map(path => `${dirShared}${dirData}`);
                    resolve(out)
                })
            },
            mkdir: (path) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        let mkdir = await object.fs.worker.mkdir(path)
                        resolve(mkdir)
                    }catch (e) {
                        resolve({
                            status: true,
                            message: e
                        })
                    }
                })
            },
            unmount: async (mountPoint = '/newKind') => {
                try {
                    let unmount = await object.fs.worker.unmount(mountPoint)
                    resolve(unmount)
                } catch (e) {
                    resolve({
                        status: true,
                        message: e
                    })
                }
            },
            // Log if debug enabled
            _log(message) {
                // if(!aioli.config.debug)
                //     return;

                // Support custom %c arguments
                let args = [...arguments];
                args.shift();
                console.log(`%c[WebWorker]%c ${message}`, "font-weight:bold", "", ...args);
            }
        }
        resolve(workerfs)
    })
}

export default {


}