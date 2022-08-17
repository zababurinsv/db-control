import { hooks } from '../../hooks/index.mjs';
import * as Comlink from "../../../../modules/comlink/dist/esm/comlink.mjs";
export const service = async (self) => {
    try {
        const { render, useEffect, useState, useRef } = hooks
        const [click, setClick] = useState(0)
        const [test, setTest] = useState(0)
        const [idbfs, setIdbfs] = useState(false)
        const [error, setError] = useState(false)
        const [document, setDocument] = useState(self)
        const memoryLog = useRef('memory')
        const memory = () => {
            return new Promise(async resolve  => {
                const url = new URL('./modules/fs/worker.idbfs.mjs', import.meta.url)
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
                        console.log('🌷 🎫 🎫')
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
            console.log('==== init module ====')
        }, [])

        await useEffect(async () => {
            console.log('==== test ====', test)
        }, [test])

        await useEffect(async () => {
            console.log('==== click ====', click)
            setTest(test + 1)
        }, [click])

        await useEffect(async () => {
            console.log('==== idbfs ====', idbfs)
            setClick(2)
        }, [idbfs])

        await useEffect(async () => {
            console.log('==== error ====', error)
        }, [error])

        return {
            async click() {
              setClick(click + 1)
              return await render(service)
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
            async update() {
                return {
                    state: await render(service)
                }
            },
            terminate() {
                console.log('======== terminate service==========')
            }
        }
    } catch (e) {
        console.log('error', e)
    }
}
