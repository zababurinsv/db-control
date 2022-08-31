import { hooks } from '/service/WCNode/hooks/index.mjs';
import * as Comlink from "/modules/comlink/dist/esm/comlink.mjs";

const service = async (self) => {
    try {
        const { render, useEffect, useState, useRef } = hooks;
        const [health, setHealth] = useState(0);
        const [idbfs, setIdbfs] = useState(false);
        const [fs, setFs] = useState(false);
        const [isFs, setIsFs] = useState(false);
        const [error, setError] = useState(false);
        // const [document, setDocument] = useState(self);
        // const memoryLog = useRef('memory');

        const memory = () => {
            return new Promise(async resolve  => {
                const url = new URL('/worker/worker.fs.mjs', import.meta.url)
                console.log('=== url worker ===', url.pathname)
                let worker = {};
                worker.self = new Worker(url, {
                    type: "module",
                });

                worker.self.onmessageerror = async event => {
                    console.log('🌷 web worker onmessageerror', event.data)
                }

                worker.self.oncontrollerchange = async event => {
                    console.log('🌷 web worker controllerchange', event.data)
                }

                worker.self.onmessage = async event => {
                    console.log('🌷 onmessage', event.data)
                    if(event.data.waiting) {
                        console.log('🌷 🎫')
                        const mainMemoryChannel = new MessageChannel();
                        worker.self.postMessage({
                            type: 'fs',
                            from: mainMemoryChannel.port1
                        }, [mainMemoryChannel.port1]);
                        worker.port = Comlink.wrap(mainMemoryChannel.port2)
                    } else if(event.data.active) {
                        console.log('🌷 🎫 🎫 🌷')
                        resolve(worker.port)
                    } else {
                        setError({
                            message: 'неизвестное событие',
                            data: event.data
                        });
                    }
                };
            });
        };

        await useEffect(async () => {
            console.log('==== init module ====');
        }, []);

        await useEffect(async () => {
            console.log('==== health ====', health);
        }, [health]);

        await useEffect(async () => {
            console.log('==== FS ====', idbfs)
            if(idbfs) {
                setIsFs(true)
            }
        }, [idbfs])

        await useEffect(async () => {
            if(fs) {
                setIsFs(true)
            }
        }, [fs])

        await useEffect(async () => {
            console.log('==== api set ====', isFs)
        }, [isFs])

        await useEffect(async () => {
            console.log('==== error ====', error)
        }, [error])

        return {
            async health() {
              setHealth(health + 1)
              return  await render(service)
            },
            async idbfs() {
                try {
                   setIdbfs(await memory())
                   return await render(service)
                } catch (e) {
                   setError(e)
                   return await render(service)
                }
            },
            async init() {
                try {
                    setFs(await memory())
                    return await render(service)
                } catch (e) {
                    setError(e)
                    return await render(service)
                }
            },
            async terminate() {
                //TODO надо сделать правильное уничтожение web worker - а
                console.log('======== terminate service==========')
                setIdbfs(null)
                setIsFs(false)
                return await render(service)
            },
            api: isFs ? {
                idbfs: {
                    create: {
                        dir: fs.idbfs.create.dir
                    },
                    is: {
                        file: fs.idbfs.is.file,
                        dir: fs.idbfs.is.dir
                    },
                    get: {
                        all: {
                            files: async (dir, call) => {
                                await fs.idbfs.get.all.files(dir, Comlink.proxy(call))
                            }
                        },
                        dir: fs.idbfs.get.dir,
                        file: fs.idbfs.get.file
                    },
                    set: {
                        file: fs.idbfs.set.file,
                        data: fs.idbfs.set.data
                    },
                    file: {
                        rename: fs.idbfs.file.rename
                    },
                    load: fs.idbfs.load,
                    save: fs.idbfs.save,
                },
                worker: {
                    writeFile: fs.worker.writeFile,
                    readFileSync: fs.worker.readFileSync,
                    ftruncateSync: fs.worker.ftruncateSync,
                    statSync: fs.worker.statSync,
                    openSync: fs.worker.openSync,
                    closeSync: fs.worker.closeSync,
                    close: fs.worker.close,
                    mount: fs.worker.mount,
                    mkdirSync: fs.worker.mkdirSync,
                    writeSync: fs.worker.writeSync,
                    writeFileSync: fs.worker.writeFileSync,
                    readSync: fs.worker.readSync,
                    readdirSync: fs.worker.readdirSync,
                    existsSync: fs.worker.existsSync,
                    is: {
                        file: fs.worker.is.file,
                        dir: fs.worker.is.dir,
                    },
                    symlink: fs.worker.symlink,
                    unlink: fs.worker.unlink,
                    read: fs.worker.read,
                    stat: fs.worker.stat,
                    readdir: fs.worker.readdir
                },
                info: () => {
                    return {
                        idbfs: {
                            create: {
                                dir: '() => {}'
                            },
                            is: {
                                file: '() => {}',
                                dir: '() => {}'
                            },
                            get: {
                                all: {
                                    files: '() => {}'
                                },
                                dir: '() => {}',
                                file: '() => {}'
                            },
                            set: {
                                file: '( file, contents, path ) => {}',
                                data: '() => {}'
                            },
                            file: {
                                rename: '() => {}'
                            }
                        },
                        worker: {
                            writeFile: '() => {}',
                            readFileSync:  '() => {}',
                            ftruncateSync: '() => {}',
                            statSync: '() => {}',
                            openSync: '() => {}',
                            closeSync: '() => {}',
                            close: '() => {}',
                            mount: '() => {}',
                            mkdirSync: '() => {}',
                            writeSync: '() => {}',
                            writeFileSync: '() => {}',
                            readSync: '() => {}',
                            readdirSync: '() => {}',
                            existsSync: '() => {}',
                            is: {
                                file: '() => {}',
                                dir: '() => {}',
                            },
                            symlink: '() => {}',
                            unlink: '() => {}',
                            read: '() => {}',
                            stat: '() => {}',
                            readdir: '() => {}'
                        }
                    }
                }
            } : undefined,
            async update() {
                return {
                    state: (await render(service)).state
                }
            }
        }
    } catch (e) {
        console.log('error', e)
    }
}

export default service
