import axios from './axios.mjs';
import logs from '../../debug/index.mjs';
let debug = (maxCount, id, props, data, ...args) => {
    let path = import.meta.url;
    let from = path.search('/fs');
    let to = path.length;
    let url = path.substring(from,to);
    logs.assert(maxCount,url, id, props, data, ...args);
}
let encoder = new TextEncoder();

export let WORKERFS =  (object = {}) => {
    return new Promise(async (resolve, reject) => {
        let fs = {
            files: [],
            isActive: false,
            watch:(path, options, call) => {
                try {
                    debug( -2,'(👻)[(API)watch]', object.fs.self.filesystems.WORKERFS)
                    debug( -2,'(👻)[(API)watch]', object.fs.self.filesystems.MEMFS.trackingDelegate)
                    debug( -2,'(👻)[(API)watch]', object.fs.self.filesystems)
                    debug( -2,'(👻)[(API)watch]', object.fs.self.filesystems.trackingDelegate)
                    return false;
                } catch (e) {
                    console.error(e);
                    return false;
                }
            },
            ftruncateSync:(fd, size) => {
                try {
                    debug( -2,'(👻)[(API)ftruncateSync]', fd, size)
                    return false
                } catch (e) {
                    console.error(e);
                    return false;
                }
            },
            statSync:(path) => {
                try {
                    // debug( -2,'====👻[(API)statSync]', path)
                    return Object.assign(object.fs.self.stat(path), { isDirectory: () => {return fs.is.dir(path)}} )
                }catch (e) {
                    console.error(e);
                    return false;
                }
            },
            openSync: (path, mode) => {
                try {
                    // debug( -2,'==👻[(API)openSync]',path, mode)
                    return object.fs.self.open(path, mode)
                } catch (e) {
                    console.error(e);
                    return false
                }
            },
            closeSync: (stream) => {
                try {
                    debug( -2,'==========👻[(API)closeSync]', stream)
                    return object.fs.self.close(stream)
                }catch (e) {
                    console.error(e)
                    return false
                }
            },
            close: (stream, call = () => {}) => {
                try {
                    object.fs.self.close(stream)
                    call(null)
                }catch (e) {
                    call(e)
                }
            },
            mount: (path, files) => {
                const dirData= path;
                const  dirMounted = `/MOUNT${path}`;
                debug( -2,'----------------👻[(API)mount]', path, files)
                // Input validation. Note that FileList is not an array so we can't use Array.isArray() but it does have a
                // length attribute. So do strings, which is why we explicitly check for those.
                let toMount = [], mountedPaths = [];
                if(!files?.length || typeof files === "string") {
                    files = [ files ];
                }
                debug( -2,`Mounting ${files.length} files`);

                // Sort files by type: File vs. Blob vs. URL
                for(let file of files) {
                    // Handle File/Blob objects
                    // Blob formats: { name: "filename.txt", data: new Blob(['blob data']) }
                    if(file instanceof File || (file?.data instanceof Blob && file.name)) {
                        toMount.push(file);
                        mountedPaths.push(file.name);

                        // Handle URLs: mount "https://website.com/some/path.js" to "/urls/website.com-some-path.js")
                    } else if(typeof file == "string" && file.startsWith("http")) {
                        // Mount a URL "lazily" to the file system, i.e. don't download any of it, but will automatically do
                        // HTTP Range requests when a tool requests a subset of bytes from that file.
                        const fileName = file.split("//").pop().replace(/\//g, "-");
                        object.fs.self.createLazyFile(dirData, fileName, file, true, true);
                        mountedPaths.push(fileName);

                        // Otherwise, incorrect data provided
                    } else {
                        throw "Cannot mount file(s) specified. Must be a File, Blob, or a URL string.";
                    }
                }

                // Unmount and remount Files and Blobs since WORKERfs is read-only (i.e. can only mount a folder once)
                try {
                    object.fs.self.unmount(dirMounted);
                } catch(e) { }

                // Mount File & Blob objects
                fs.files = fs.files.concat(toMount);
                object.fs.self.mount(object.fs.self.filesystems.WORKERfs, {
                    files: fs.files.filter(f => f instanceof File),
                    blobs: fs.files.filter(f => f?.data instanceof Blob)
                }, dirMounted);

                // Create symlinks for convenience. The folder "dirMounted" is a WORKERfs, which is read-only. By adding
                // symlinks to a separate writeable folder "dirData", we can support commands like "samtools index abc.bam",
                // which create a "abc.bam.bai" file in the same path where the .bam file is created.
                toMount.map(file => {
                    const oldpath = `${dirMounted}/${file.name}`;
                    const newpath = `${dirData}/${file.name}`;
                    try {
                        object.fs.self.unlink(newpath);
                    } catch(e) {}
                    debug( -2,`Creating symlink: ${newpath} --> ${oldpath}`)

                    // Create symlink within first module's filesystem (note: tools[0] is always the "base" biowasm module)
                    object.fs.self.symlink(oldpath, newpath);
                })
                return mountedPaths.map(path => `${dirData}/${path}`);
            },
            mkdirSync: (path) => {
                try {
                    let mkdir = object.fs.self.mkdir(path)
                    debug( -2,'👻[(API)mkdirSync]', mkdir)
                    return mkdir
                } catch (e) {
                    console.error(e)
                    return false
                }
            },
            writeSync: (stream, buffer, offset, length) => {
                // debug( -2,'========👻[(API*)writeSync]', {
                //     stream,
                //     buffer,
                //     offset,
                //     length
                // })
                return  object.fs.self.write(stream, buffer, offset, length)
            },
            writeFileSync: (filePath, string, obj = {}, opt = 'a') => {
                try {
                    debug(-2, '=======👻[(API*)writeFileSync]', encoder.encode(string),  filePath)
                    let writeFile = object.fs.self.writeFile(filePath, string, {flags: "a+"})
                    return writeFile
                } catch (e) {
                    console.log('writeFileSync error', e)
                }

            },
            /**
             * @param files
             * @param type {'binary' | 'utf8'}
             * @returns {boolean|*}
             */
            readFileSync:(files,  type = 'utf8' ) => {
                try {
                    debug(-2,'========👻[(/)readFileSync]')
                    let contents = object.fs.self.readFile(`${files}`, { encoding: type });
                    return contents
                } catch (e) {
                    console.log('error',  e)
                    return false
                }
            },
            /**
             *
             * @param stream
             * @param buffer
             * @param offset
             * @param length
             * @param position
             * @returns {boolean|*}
             */
            readSync:(stream, buffer, offset, length, position) => {
                try {
                    debug(-2,'========👻[(/)readSync]')
                    let contents = object.fs.self.read(stream, buffer, offset, length, position);
                    return contents
                } catch (e) {
                    console.log('error',  e)
                    return false
                }
            },
            readdirSync: (path = '/') => {
                try {
                    let list = {}
                    if(fs.is.dir(path)) {
                        list = (fs.readdir(path)).filter(item => item !== '.' && item !== '..')
                    } else {
                        console.log('Это не дирректория', path)
                    }
                    console.log(list)
                    return list
                } catch (e) {
                    console.error('error',e)
                    return false
                }
            },
            existsSync: (obj = '/') => {
                try {
                    let isDir = (object.fs.self.analyzePath(obj).exists)
                        ? object.fs.self.isDir(object.fs.self.analyzePath(obj).object.mode)
                        : false
                    let isFile = (object.fs.self.analyzePath(obj).exists)
                        ? object.fs.self.isFile(object.fs.self.analyzePath(obj).object.mode)
                        : false
                    // debug( -2,'👻[(API)existsSync]',`${obj}: ${isDir || isFile}`)
                    return isDir || isFile
                } catch (e) {
                    console.error('error', e)
                    return false
                }
            },
            is: {
                file: (file) => {
                    try {
                        let isFile = (object.fs.self.analyzePath(file).exists)
                            ? object.fs.self.isFile(object.fs.self.analyzePath(file).object.mode)
                            : false
                        console.log(`👻 ${file} file ${isFile}`)
                        return isFile
                    } catch (e) {
                        console.error('error', e)
                        return false
                    }
                },
                dir: (dir = '/') => {
                    try {
                        let isDir = (object.fs.self.analyzePath(dir).exists)
                            ? object.fs.self.isDir(object.fs.self.analyzePath(dir).object.mode)
                            : false
                        console.log(`👻 ${dir} dir ${isDir}`)
                        return isDir
                    } catch (e) {
                        console.error('error', e)
                        return false
                    }
                }
            },
            symlink: (oldpath, newpath) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        let symlink = await object.fs.self.symlink(oldpath, newpath)
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
                        let unlink = await object.fs.self.unlink(path)
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
                        let isFile = fs.is.file(path)
                        if(isFile) {
                            let reader = await axios(object,'isWorkerfs', path, highWaterMark, isRelation)
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
                try {
                    let stat = object.fs.self.stat(path)
                    return {
                        error: null,
                        result: stat
                    }
                } catch (e) {
                    return {
                        error: e,
                        result: null
                    }
                }
            },
            readdir: (path = "/") => {
                try {
                    const readdir = (fs.is.dir(path))
                        ? object.fs.self.readdir(path)
                        : false
                    return readdir
                } catch (e) {
                    console.error('dir error:',e)
                    return e
                }
            },
            unMount: async (dirMounted = '/newKind') => {
                try {
                    let unMount = await object.fs.self.unmount(dirMounted)
                    console.log('unMount', unMount)
                    resolve(unMount)
                } catch (e) {
                    resolve({
                        status: true,
                        message: e
                    })
                }
            },
            unmount: async (mountPoint = '/newKind') => {
                try {
                    let unmount = await object.fs.self.unmount(mountPoint)
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

                // Suppclosort custom %c arguments
                let args = [...arguments];
                args.shift();
                console.log(`%c[WebWorker]%c ${message}`, "font-weight:bold", "", ...args);
            }
        }
        resolve(fs)
    })
}

export default { }
