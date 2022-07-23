import { WORKERFS } from './init.mjs'
import * as Comlink from '../comlink/comlink.min.mjs'
import logs from '../debug/index.mjs'
import blockchain from '../blockchain/index.mjs'
import manager from './task-manager.mjs'
import buffer from '../buffer/index.mjs'

let debug = (maxCount, id, ...args) => {
    let path = import.meta.url
    let from = path.search('fs');
    let to = path.length;
    let url = path.substring(from,to);
    logs.assert(maxCount,url, id, args)
}

WORKERFS().then(fs => {
  if(fs.existsSync('/DATA-BROWSER/67676')) {
    debug(-3,'🌷[(FS)a]')
    let func = {}
    func.SaveParams = function (filename,data)
    {
      let mocks_data = {
        test: "test"
      }
      let buff = buffer.from(JSON.stringify(mocks_data, "", 4))
      debug(-5, '[(worker)SaveParams]',filename, buff)
      return buff
    }
    if(!fs.existsSync('/DATA-BROWSER/log.log')) {

    }
    for(let i =0; i< 10000000;i++) {
      fs.writeFile('/DATA-BROWSER/log.log', "28.12.2021 02:36:33.134 : CheckStartedBlocks at 0\r\n")
      fs.writeFile('/DATA-BROWSER/log.log', "28.12.2021 02:36:33.134 : CheckStartedBlocks at 1\r\n")
      fs.writeFile('/DATA-BROWSER/log.log', "28.12.2021 02:36:33.134 : CheckStartedBlocks at 2\r\n")
      fs.writeFile('/DATA-BROWSER/log.log', "28.12.2021 02:36:33.134 : CheckStartedBlocks at 3\r\n")
      fs.writeFile('/DATA-BROWSER/log.log', "28.12.2021 02:36:33.134 : CheckStartedBlocks at 4\r\n")
      fs.readFileSync('/DATA-BROWSER/log.log', 'utf8')

    }

    // let chunk = func.SaveParams('hello', {})
    // fs.writeFile('/DATA_BROWSER/log.log', "28.12.2021 02:36:33.134 : CheckStartedBlocks at 0\r\n", null, 'utf8')
    // fs.readFileSync('/DATA-BROWSER/log.log', 'utf8')

  } else {
    manager(fs).then(global => {
      blockchain(global).then(blockchain => {
        self.onmessage = function(event) {
          if (event.data.state.isConnected && event.data.state.type === 'main-memory') {
            debug( -3,'🌷🎫[(FS)onmessage] main-memory message', event.data.state)
            for(let port in event.data.state.from) {
              Comlink.expose({}, event.data.state.from[port])
            }
            self.postMessage({
              state: {
                "main-memory": true
              }
            })
          } else if(event.data.state.isConnected && event.data.state.type === 'proxy-memory') {
            debug( -3,'🌷🎫[(FS)onmessage] proxy-memory message', event.data.state)
            for(let port in event.data.state.from) {
              Comlink.expose({}, event.data.state.from[port])
            }
            self.postMessage({
              state: {
                "proxy-memory": true
              }
            })
          }
        }
        self.postMessage({
          state: {
            install: true
          }
        })
      }).catch(e => { console.error('error', e) })
    }).catch(e => { console.error('error', e) })
  }
})