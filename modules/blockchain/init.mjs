import buffer from '/service/ReactNode/controlCenter/database/modules/safe-buffer/dist/index.js'
const Buffer = buffer.Buffer
import ua from '/modules/ua/ua.index.mjs';
import isEmpty from '/modules/isEmpty/isEmpty.mjs'
import logs from '/modules/debug/index.mjs'
import instantiateSecp256k1 from '/modules/bitauth/index.mjs'
import crypto from '/service/ReactNode/controlCenter/database/modules/crypto-browserify/dist/index.js'
let encoder = new TextEncoder();
import zlib from '/modules/zlib/index.mjs';
import querystring from '/modules/querystring/index.mjs'

function prettySize(bytes, separator = '', postFix = '') {
  if (bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.min(parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString(), 10), sizes.length - 1);
    return `${(bytes / (1024 ** i)).toFixed(i ? 1 : 0)}${separator}${sizes[i]}${postFix}`;
  }
  return 'n/a';
}

function GbSize(bytes) {
  if (bytes) {
    return bytes * (1024 ** 3)
  }
  return null;
}

/**
 *
 * @param maxCount {number}
 * @param id {string}
 * @param props {(number|Array.<number>)}
 * @param data
 * @param payload
 * @param value
 * @param message
 * @param args
 */
let debug = (maxCount, id, props, data, payload, value, message , ...args) => {
  if(message === 'proxy') {
    let type = id.trim().split(' ')
      logs.proxy(type[0].trim(), type[1].trim(), props, data, payload, value, maxCount);
  } else {
    let path = import.meta.url
    let from = path.search('/fs');
    let to = path.length;
    let url = path.substring(from,to);
    logs.assert(maxCount,url, id, props, data, ...args)
  }
}

export default async (fs) => {
  let global = {}
  if(!global.MODE_RUN) {
    global.MODE_RUN="MAIN_JINN";
  }
  if (navigator.storage && navigator.storage.persist)
    navigator.storage.persist().then(function(persistent) {
      if (persistent)
        console.log("Storage will not be cleared except by explicit user action");
      else
        console.log("Storage may be cleared by the UA under storage pressure.");
    });

  global.natUpnp = {
    createClient: () => {
      debug(-2,'🥚[(natUpnp*)createClient] => ClientUPNP')
      return {
        portMapping: (map = {}, call) => {
          debug(-2,'ClientUPNP🥚[(call*)err,results]', map)
        }
      }
    }
  }
  global.dns = null
  global.stun = null
  global.IS_NODE_JS = false
  global.buffer = Buffer
  global.cluster = null
  global.vm = null
  global.https = null
  global.zlib = zlib.zlib
  global.child_process = null
  global.querystring = querystring
  global.url = null
  global.secp256k1 = await instantiateSecp256k1();
  global.Writable = {}
  global.http = {
    createServer:(...args) => {
      console.log('server listener', args)
      return {
        listen: global.http.listen,
        on: global.http.on
      }
    },
    listen:(...args) => {
      console.log('server listener', args)
      return {
        on: global.http.on
      }
    },
    on:(...args) => {
      console.log('server on', args)
    },
  }

  global.net = {
    createServer: (...args) => {
      console.log('~~~~~~ net createServer ~~~~~~', args)
      return {
        listen: global.net.listen,
        on: global.net.on
      }
    },
    listen:(...args) => {
      console.log('server net', args)
      return {
        on: global.net.on
      }
    },
    on: (...args) => {
      console.log('~~~~~~ net on ~~~~~~', args)
    },
  }

  global.crypto = crypto
  global.os = {
    freemem: () => {
      let mem = GbSize(navigator.deviceMemory)
      debug(-2, '🥚[(os)freemem]', mem)
      return mem
    },
    platform: () => {
      debug(-2, '🥚[(os)platform]', self.navigator.platform.split(' ')[0].trim())
      return self.navigator.platform.split(' ')[0].trim()
    },
    arch: () => {
      debug(-2, '🥚[(os)arch]', self.navigator.platform.split(' ')[1].trim())
      return self.navigator.platform.split(' ')[1].trim()
    },
    release: () => {
      debug(-2, '🥚[(os)release]', self.navigator.appVersion)
      return self.navigator.appVersion
    },
    cpus: () => {
      let num = navigator.hardwareConcurrency || 1
      let cpus = []
      for (let i = 0; i < num; i++) {
        cpus.push({
          model: 'anonymous',
          speed: 'anonymous',
          times: { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 }
        })
      }
      debug(-2, '🥚[(os)cpus]', cpus)
      return cpus
    }
  }

  global.process = {
    exit: (...args) => {
      debug(0,'🥚[(process)exit]', args)
    },
    send: (...args) => {
      debug(-1,'🥚[(process)send]', args)
    },
    memoryUsage:(...args) => {
      console.log('process memoryUsage: ', args)
      return {
        heapTotal: global.process.heapTotal
      }
    },
    heapTotal:(...args) => {
      console.log('process heapTotal: ', args)
      return 0
    },
    on: (type, call) => {
      debug(-2,'🥚[(/)process on]', {
        type: type,
        call: call
      })
    },
    hrtime: (...args) => {
      debug(0,'🥚[(/)hrtime]', args)
    },
    versions: {
      node: `17.0`
    },
    // node: `${self.navigator.appVersion}`
    argv: [],
    cwd: (...args) => {
      debug(-2, '🥚[(/)cwd]', args)
      return import.meta.url
    }
  }

  global.fs = {
    /**
     * @param path
     * @returns {Stats}
     * Stats {dev: 2050, mode: 33204, nlink: 1, uid: 1000, gid: 1000, …}
     * atime: Sun Dec 26 2021 11:13:49 GMT+0300 (Moscow Standard Time) {}
     * atimeMs: 1640506429012.9043
     * birthtime: Sun Dec 26 2021 11:13:49 GMT+0300 (Moscow Standard Time) {}
     * birthtimeMs: 1640506429012.9043
     * blksize: 4096
     * blocks: 0
     * ctime: Sun Dec 26 2021 11:13:49 GMT+0300 (Moscow Standard Time) {}
     * ctimeMs: 1640506429012.9043
     * dev: 2050
     * gid: 1000
     * ino: 18481300
     * mode: 33204
     * mtime: Sun Dec 26 2021 11:13:49 GMT+0300 (Moscow Standard Time) {}
     * mtimeMs: 1640506429012.9043
     * nlink: 1
     * rdev: 0
     * size: 0
     * uid: 1000
     */
    statSync: (...args) => {
      debug(-3, '🥚[(/)ftruncateSync]', args)
      return  {}
    },
    mkdirSync:  (...args) => {
      debug(-3, '🥚[(/)ftruncateSync]', args)
      return  {}
    },
    openSync:  (...args) => {
      debug(-3, '🥚[(/)ftruncateSync]', args)
      return  {}
    },
    existsSync:  (...args) => {
      debug(-3, '🥚[(/)ftruncateSync]', args)
      return  {}
    },
    closeSync:  (...args) => {
      debug(-3, '🥚[(/)ftruncateSync]', args)
      return  {}
    },
    close:  (...args) => {
      debug(-3, '🥚[(/)ftruncateSync]', args)
      return  {}
    },
    ftruncateSync: (fd, size) => {
      debug(-3, '🥚[(/)ftruncateSync]', {
        fd: fd,
        size: size
      })
      return  {}
    },
    readSync:  (...args) => {
      debug(-3, '🥚[(/)ftruncateSync]', args)
      return  {}
    },
    readFileSync:  (...args) => {
      debug(-3, '🥚[(/)ftruncateSync]', args)
      return  {}
    },
    unlinkSync: (path) => {
      debug(-2,'🥚[(/)unlinkSync]', path)
      return {}
    },
    stat: (path, call) => {
      let stat = {
        error: '',
        result: ''
      }
      debug(-2,'🥚[(/)stat]',path,  (stat.result)? stat.result: stat.error.message)
      call( stat.error, stat.result)
    },
    watch: (path, options, call) => {
      debug(-2,'🥚[(/)watch]',path, options, call)
    },
    writeSync: (stream, buffer, offset, length) => {
      if(global.IS_NODE_JS) {
        return fs.writeSync(stream, buffer, offset, length)
      } else {
        if (length === 'utf8') {
          let string = encoder.encode(buffer)
          return {}
        } else {
          return {}
        }
      }
    }
  }
  if(!global.DATA_PATH || global.DATA_PATH==="") {
    global.DATA_PATH="/DATA-BROWSER";
  }
  global.CODE_PATH=import.meta.url;
  global.HTTP_PORT_NUMBER = isEmpty(location.port)? location.origin: location.port;
  let type = '/jinn/src/jinn-net-socket.mjs ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~👔[(net*)SetEventsProcessing]'
  let type2 = '/fs/api/WORKERFS.mjs ==========👻[(API)closeSync] '
  return new Proxy(global, {
    get: (obj, prop) => {
      // debug(6, type,[1], null, prop, 'proxy')
      // debug(2, type2, 0, obj[prop], prop, null, 'proxy')
      return obj[prop];
    },
    set: (obj, prop, value) => {
      debug(6, type,[1], null, prop, value, 'proxy')
      // debug(2, type2, 0, obj[prop], prop, null, 'proxy')
      if(!!obj[prop]) {
        obj[prop] = []
      }
      obj[prop] = value;
      return true
    }
  })
}
