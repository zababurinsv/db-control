import path from "../../path/index.js";
import io from "../../orbit-db-io/index.js";
import logs from "../../../utils/debug/index.js";

let debug = (id, ...args) => {
  let path = 'frontend/src/components/newkind-control/src/database/orbit-db/src/db-manifest.js'
  let from = path.search('db');
  let to = path.length;
  let url = path.substring(from,to);
  logs.assert(-4,url, id, args)
}
// Creates a DB manifest file and saves it in IPFS
const createDBManifest = async (ipfs, name, type, accessControllerAddress, options) => {
  debug('^^^[(createDBManifest)ipfs, name, type, accessControllerAddress, options]',{
    name: name,
    type: type,
    accessControllerAddress: accessControllerAddress,
    options: options,
  })
  const manifest = Object.assign({
    name: name,
    type: type,
    accessController: (path.posix || path).join('/ipfs', accessControllerAddress)
  },
  // meta field is only added to manifest if options.meta is defined
  options.meta !== undefined ? { meta: options.meta } : {}
  )
  options.pin = true
  debug('^^^[(createDBManifest)io.write]',{
    manifest: manifest,
    options: options,
  })
  return io.write(ipfs, options.format || 'dag-cbor', manifest, options)
}

export default  createDBManifest
