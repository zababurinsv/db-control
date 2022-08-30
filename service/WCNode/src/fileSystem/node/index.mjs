import { hooks } from '/service/WCNode/hooks/index.mjs';
import * as Comlink from "/modules/comlink/dist/esm/comlink.mjs";

const service = async (self) => {
    try {
        const { render, useEffect, useState, useRef } = hooks;
        const [health, setHealth] = useState(0);
        const [idbfs, setIdbfs] = useState(false);
        const [isFs, setFs] = useState(false);
        const [error, setError] = useState(false);
        // const [document, setDocument] = useState(self);
        // const memoryLog = useRef('memory');

        const memory = () => {
            return new Promise(async resolve  => {
                const url = new URL('/worker/worker.idbfs.mjs', import.meta.url)
                console.log('=== url worker ===', url)
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
                            type: 'idbfs',
                            from: mainMemoryChannel.port1
                        }, [mainMemoryChannel.port1]);
                        worker.port = Comlink.wrap(mainMemoryChannel.port2)
                    } else if(event.data.active) {
                        console.log('🌷 🎫 🎫 🌷')
                        resolve(worker)
                    } else {
                        setError({
                            message: 'неизвестное событие',
                            data: event.data
                        })
                    }
                }
            })
        }

        await useEffect(async () => {
            console.log('==== init module ====');
        }, []);

        await useEffect(async () => {
            console.log('==== health ====', health);
        }, [health]);

        await useEffect(async () => {
            console.log('==== idbfs ====')
            if(idbfs) {
                setFs(true)
            }
        }, [idbfs])

        await useEffect(async () => {
            console.log('==== api set ====', isFs)
        }, [isFs])

        await useEffect(async () => {
            console.log('==== error ====', error)
        }, [error])
        console.log('========', isFs)
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
            async terminate() {
                //TODO надо сделать правильное уничтожение web worker - а
                console.log('======== terminate service==========')
                setIdbfs(null)
                setFs(false)
                return await render(service)
            },
            api: isFs ? {
                create: {
                    dir: idbfs.port.create.dir
                },
                is: {
                    file: idbfs.port.is.file,
                    dir: idbfs.port.is.dir
                },
                get: {
                    all: {
                        files: async (dir, call) => {
                           await idbfs.port.get.all.files(dir, Comlink.proxy(call))
                        }
                    },
                    dir: idbfs.port.get.dir,
                    file: idbfs.port.get.file
                },
                set: {
                    file: idbfs.port.set.file,
                    data: idbfs.port.set.data
                },
                file: {
                    rename: idbfs.port.file.rename
                },
                load: idbfs.port.load,
                save: idbfs.port.save,
                info: () => {
                    console.log(JSON.stringify({
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
                    }, null, 4))
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
