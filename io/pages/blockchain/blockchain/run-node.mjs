import isEmpty from '../isEmpty/isEmpty.mjs'
import main_process from "./process/main-process.mjs"
import logs from '../../modules/debug/index.mjs'
import zlib from '../../modules/zlib/index.mjs'
import BufferBrowser from '../buffer/index.mjs'
import querystring from '../../modules/querystring/index.mjs'
import secp256k1 from 'secp256k1'
import natUpnp from 'nat-upnp';

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
        logs.assert(-3,url, id, props, data, ...args)
    }
}

let global = {}
debug(-2, '[(self)a]')
if(!global.MODE_RUN) {
    global.MODE_RUN="MAIN_JINN";
}
if(global.LOCAL_RUN===undefined) {
    global.LOCAL_RUN=0;
}
global.natUpnp = natUpnp
global.secp256k1 = secp256k1;
global.IS_NODE_JS = true
global.buffer = BufferBrowser
// global.buffer = Buffer
global.os = await import("os")
global.fs = await import("fs")
global.crypto = await import("crypto")
global.GlobalRunMap = {}
// global.zlib = await import('zlib');
global.zlib = zlib.zlib

global.http = await import('http')
global.net = await import('net')
global.url = await import('url')
global.querystring = querystring
// global.querystring = await import('querystring')
global.cluster = await import('cluster')
global.vm = await import('vm')
global['child_process'] = await import('child_process')
global['https'] = await import('https')
global.process = process
process.blockchain = global.process
if(!global.DATA_PATH || global.DATA_PATH==="")
    global.DATA_PATH="../DATA-BROWSER";
global.CODE_PATH=process.cwd();
global.HTTP_PORT_NUMBER = 8008;

let type = '/blockchain/jinn/src/jinn-connect-item.mjs ~~~~~~~⛔[(DoNode*)ip] '
let type2 = '/jinn/src/index.mjs [(NextRunEngine*)NetNodeArr] '

await main_process(new Proxy(global, {
    get: (obj, prop) => {
        debug(2, type, 0, obj[prop], prop, null, 'proxy')
        debug(2, type2, 0, obj[prop], prop, null, 'proxy')
        return obj[prop];
    },
    set: (obj, prop, value) => {
        debug(6, type,0, null, prop, value, 'proxy')
        debug(6, type2,0, null, prop, value, 'proxy')
        if(!!obj[prop]) {
            obj[prop] = []
        }
        obj[prop] = value;
        return true
    }
}))