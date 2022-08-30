import * as Comlink from "/static/html/components/component_modules/fs/modules/comlink/dist/esm/comlink.mjs";
let memory = () => {
  return new Promise(async resolve  => {
    const url = new URL('/static/html/components/component_modules/fs/worker.idbfs.mjs', import.meta.url)
    let worker = {};
    worker.worker = new Worker(url, { type: "module" });

    worker.worker.onmessageerror = async event => {
      console.log('🌷 web worker onmessageerror', event.data)
    }

    worker.worker.oncontrollerchange = async event => {
      console.log('🌷 web worker controllerchange', event.data)
    }

    worker.worker.onmessage = async event => {
      console.log('🌷 web worker onmessage', event.data.state)
      if(event.data.state.install) {
        console.log('🌷 🎫')
        const mainMemoryChannel = new MessageChannel();
        const mainWorker = {
          state: {
            isConnected: true,
            type: 'main-memory',
            from: {"0": mainMemoryChannel.port1}
          }
        };
        worker.worker.postMessage(mainWorker, [mainMemoryChannel.port1]);
        worker.port = Comlink.wrap(mainMemoryChannel.port2)
      } else if(event.data.state['main-memory']) {
        console.log('🌷 🎫', event.data.state['main-memory'])
        resolve(worker)
      } else {
        console.log('неизвестное событие', event.data)
      }
    }
  })
}

export default (callback) => {
  return new Promise(async resolve => {
    memory()
      .then(worker => {
        let terminate = () => {
          if (document.visibilityState === 'hidden') {
            worker.port = null
            worker.worker.terminate()
            document.removeEventListener('visibilitychange', terminate);
            terminate = null
            memory = null
          }
        }
        // document.addEventListener('visibilitychange', terminate);
        worker.worker.onmessage = null
        worker.worker.oncontrollerchange = null
        worker.worker.onmessageerror = null
        callback({
          terminate: terminate,
          create: {
            dir: worker.port.create.dir
          },
          is: {
            file: worker.port.is.file,
            dir: worker.port.is.dir
          },
          get: {
            all: {
              files: (dir) => {
                return new Promise((resolve) => {
                  worker.port.get.all.files(dir, Comlink.proxy((data) => {
                    resolve(data)
                  }))
                })
              }
            },
            dir: worker.port.get.dir,
            file: worker.port.get.file,
          },
          set: {
            file: worker.port.set.file,
            data: worker.port.set.data
          },
          file: {
            rename: worker.port.files.rename
          },
          save: worker.port.save,
          load: worker.port.load
        })
    })
  })
}