import { CID } from '../multiformats/esm/src/cid.js'
import dagPB from "../ipld-dag-pb/index.js";
import logs from "../utils/debug/index.mjs";

const defaultBase = 'base58btc'
// const pinataSDK = require('@pinata/sdk');
// const Web3Storage = require('../storage/lib.js');
// const Name = require('../storage/name.js');
// import * as Name from 'web3.storage/name'

// let optons = {
//   API_TOKEN:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDA3RTI4QjllODU3RjYyQkVlZTI5ZDNBNkJiRDY5OTEwYTlBYzlDYjciLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Mzk1MTExMDA1MjksIm5hbWUiOiJ6YiJ9.3Wvo-xrpSiwlQxEbCU6f0VuJen9E-v3VIwaJkqLdKXc"
// }
// @ts-ignore
// function makeStorageClient() {
//   return new Web3Storage.Web3Storage({token:optons.API_TOKEN})
// }
// @ts-ignore
// async function checkStatus(cid) {
  // const client = makeStorageClient()
  // const status = await client.status(cid)
  // console.log(status)
  // if (status) {
    // your code to do something fun with the status info here
  // }
// }
// @ts-ignore
// function makeFileObjects(file, name) {
  // You can create File objects from a Blob of binary data
  // see: https://developer.mozilla.org/en-US/docs/Web/API/Blob
  // Here we're just storing a JSON object, but you can store images,
  // audio, or whatever you want!
  // const obj = file
  // const blob = new Blob([JSON.stringify(obj)], {type : 'application/json'})
  //
  // const files = [new File([blob], name)]
  // return files
// }
let debug = (id, ...args) => {
  let path = '/db-io/index.js'
  let from = path.search('dba');
  let to = path.length;
  let url = path.substring(from,to);
  logs.default.assert(-4,url, id, args)
}

// function storeWithProgress(files) {
// return new Promise(resolve => {
//     let uploaded = 0
//     let CID = false// @ts-ignore
//     const totalSize = files.map(f => f.size).reduce((a, b) => a + b, 0)
    // @ts-ignore
    // show the root cid as soon as it's ready
    // let onRootCidReady = (cid) => {
    //   CID = cid
    //   debug('🌅[(storeWithProgress)onRootCidReady] uploading files with cid:', CID)
    //   uploaded = 0
    //   resolve(cid)
    // }
    // when each chunk is stored, update the percentage complete and display
  // let onStoredChunk = (size) => {
  //     if(!CID) {
  //       uploaded += size
  //       const pct = totalSize / uploaded
  //       debug('🌅[(storeWithProgress)onStoredChunk] Uploading...',pct,{
  //         size:size,
  //         uploaded: uploaded,
  //         CID: CID
  //       })
  //     }
  //   }

    // makeStorageClient returns an authorized Web3.Storage client instance
    // const client = makeStorageClient()

    // client.put will invoke our callbacks during the upload
    // and return the root cid when the upload completes
    // return client.put(files, { onRootCidReady, onStoredChunk })
  // })
// }
// @ts-ignore
// async function storeFiles(files) {
//   const client = makeStorageClient()
//   const cid = await client.put(files)
//   console.log('stored files with cid:', cid)
//   return cid
// }
// @ts-ignore
// async function retrieveFiles(cid) {
//   const client = makeStorageClient()
//   const res = await client.get(cid)
//   console.log(`Got a response! [${res.status}] ${res.statusText}`)
//   if (!res.ok) {
//     throw new Error(`failed to get ${cid} - [${res.status}] ${res.statusText}`)
//   }

  // unpack File objects from the response
  // const files = await res.files()
  // for (const file of files) {
  //   console.log(`${file.cid} -- ${file.path} -- ${file.size}`)
  // }
// }


// checkStatus('bafybeifljln6rmvrdqu7xopiwk2bykwa25onxnvjsmlp3xdiii3opgg2gq')
// @ts-ignore
// const server = pinataSDK('604779a1617a8dbb791e', '842b2195a752048e6f5db7ba178c622b2eeb64c937c266f75d5fe636aafebcd8');
// @ts-ignore
const cidifyString = (str) => {
  if (!str) {
    return str
  }

  if (Array.isArray(str)) {
    return str.map(cidifyString)
  }


  return new CID(str)
}
// @ts-ignore
const stringifyCid = (cid, options) => {
  if (!cid || typeof cid === 'string') {
    return cid
  }

  if (Array.isArray(cid)) {
    return cid.map(stringifyCid)
  }

  if (cid['/']) {
    return cid['/']
  }

  const base = options.base || defaultBase
  return cid.toBaseEncodedString(base)
}

// @ts-ignore
const writePb = async (ipfs, obj, options) => {
  const buffer = Buffer.from(JSON.stringify(obj))
  const dagNode = new dagPB.DAGNode(buffer)
  debug('🌅💄[(writePb)ipfs, obj, options]',{
    obj:obj,
    options: options,
    dagNode: dagNode,
    buffer: buffer
  })
  const cid = await ipfs.dag.put(dagNode, {
    format: 'dag-pb',
    hashAlg: 'sha2-256'
  })

  const res = cid.toV0().toBaseEncodedString()
  const pin = options.pin || false
  if (pin) {
    debug('🌅💄💋[(writePb)PIN writePb]',{
      res:res,
    })
    await ipfs.pin.add(res)
  }
  return res
}
// @ts-ignore
const readPb = async (ipfs, cid) => {
  console.log('👗 readPb 👗', cid)
  const result = await ipfs.dag.get(cid)
  const dagNode = result.value

  return JSON.parse(Buffer.from(dagNode.Data).toString())
}
// @ts-ignore
const writeCbor = async (ipfs, obj, options) => {
  // debug('🌅💄[(writeCbor) ipfs, obj, options]',{
  //   obj: obj,
  //   options:options
  // })
  const dagNode = Object.assign({}, obj)
  const links = options.links || []
  links.forEach((prop) => {
    if (dagNode[prop]) {
      dagNode[prop] = cidifyString(dagNode[prop])
    }
  })

  const base = options.base || defaultBase
  const onlyHash = options.onlyHash || false
  // const name = await Name.create()
  // let objectStore = makeFileObjects(dagNode)

  // storeWithProgress(objectStore).then(cid => {
  //   debug('🌅💄💋[(writeCbor/storage)storeWithProgress]🌅💄💋',{
  //     cid: cid,
  //   })
  // })

  debug('🌅💄[(writeCbor) ipfs.dag.put]',{
    dagNode: dagNode,
    onlyHash:onlyHash,
    obj: obj,
    options:options
  })
  const cid = await ipfs.dag.put(dagNode, { onlyHash })
  const res = cid.toBaseEncodedString(base)
  const pin = options.pin || false
  if (pin) {
    // const options = {
    //   pinataMetadata: {
    //     name: res
    //   },
    // };
    // storeWithProgress(objectStore)
    // const value = `/ipfs/${res}`
    // const revision = await Name.v0(name, value)
    // await Name.publish(client, revision, name.key)
    // const rootCid = await client.put(res)
    // const info = await client.status(rootCid)
    // console.log('###############', info)
    //handle results here
    debug('🌅💄💋[(writeCbor) PIN]',{
      res: res,
      cid: cid
    })
    await ipfs.pin.add(res)

    // @ts-ignore
    // server.pinByHash(res, options).then(async (result) => {
    // console.log('result',result,'res', res)
    // console.log(result);
      // @ts-ignore
    // }).catch((err) => {
      //handle error here
      // console.log(err);
    // });
  }
  return res
}
// @ts-ignore
const readCbor = async (ipfs, cid, options) => {
  debug('🌅👗[(readCbor) ipfs, cid, options]',{
    cid: cid,
    options:options
  })
  const result = await ipfs.dag.get(cid)
  const obj = result.value
  const links = options.links || []
  // @ts-ignore
  links.forEach((prop) => {
    if (obj[prop]) {
      obj[prop] = stringifyCid(obj[prop], options)
    }
  })

  return obj
}
// @ts-ignore
const writeObj = async (ipfs, obj, options) => {
  debug('🌅💄[(writeObj) ipfs, obj, options]',{
    obj: obj,
    options:options
  })
  const onlyHash = options.onlyHash || false
  const base = options.base || defaultBase
  const opts = Object.assign({}, { onlyHash: onlyHash }, options.format ? { format: options.format, hashAlg: 'sha2-256' } : {})
  if (opts.format === 'dag-pb') {
    obj = new dagPB.DAGNode(obj)
  }

  const cid = await ipfs.dag.put(obj, opts)
  const res = cid.toBaseEncodedString(base)
  const pin = options.pin || false
  if (pin) {
    // @ts-ignore
    // let result = await server.testAuthentication()
    debug('🌅💋[(writeObj) PIN]',{
      res: res,
      pinata: null
    })
    await ipfs.pin.add(res)
  }
  return res
}

const formats = {
  'dag-pb': { read: readPb, write: writePb },
  'dag-cbor': { write: writeCbor, read: readCbor },
  'raw': { write: writeObj }
}

const write = (ipfs, codec, obj, options = {}) => {
  debug('🌅[(write) ipfs, codec, obj, options]',{
    codec: codec,
    obj: obj,
    options: options
  })
  const format = formats[codec]
  if (!format) throw new Error('Unsupported codec')
  let object = format.write(ipfs, obj, options)
  object.then((data) =>  {
    debug('🌅[(write)]🌅',{
      data: data,
    })
  })
  return object
}

const read = (ipfs, cid, options = {}) => {
  cid = new CID(cid)
  debug('🌅[(read)ipfs, cid, options]',{
    cid: cid,
    options:options
  })
  // @ts-ignore
  const format = formats[cid.codec]
  if (!format) throw new Error('Unsupported codec')
  let object = format.read(ipfs, cid, options)
  // @ts-ignore
  object.then(data =>  {
    debug('🌅[(read)]🌅',{
      data: data,
    })
  })
  return object
}

export default  {
  read,
  write
}
