'use strict'
import io from "../../orbit-db-io/index.js";

import logs from "../../../utils/debug/index.js";

let debug = (id, ...args) => {
  let path = 'frontend/src/components/newkind-control/src/database/orbit-db-access-controllers/src/access-controller-manifest.js'
  let from = path.search('db');
  let to = path.length;
  let url = path.substring(from,to);
  logs.assert(-4,url, id, args)
}
class AccessControllerManifest {
  constructor (type, params = {}) {
    this.type = type
    this.params = params
  }

  static async resolve (ipfs, manifestHash, options = {}) {
    if (options.skipManifest) {
      if (!options.type) {
        throw new Error('No manifest, access-controller type required')
      }
      return new AccessControllerManifest(options.type, { address: manifestHash })
    } else {
      // TODO: ensure this is a valid multihash
      if (manifestHash.indexOf('/ipfs') === 0) { manifestHash = manifestHash.split('/')[2] }
      const { type, params } = await io.read(ipfs, manifestHash)
      return new AccessControllerManifest(type, params)
    }
  }

  static async create (ipfs, type, params) {
    debug('^^^[(create)ipfs, type, params]',{
      type: type,
      params: params,
    })
    if (params.skipManifest) {
      return params.address
    }
    const manifest = {
      type: type,
      params: params
    }
    return io.write(ipfs, 'dag-cbor', manifest, { pin: true })
  }
}

export default  AccessControllerManifest
