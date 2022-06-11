'use strict'
import {io} from "./utils/index.js";
import AccessController from "./access-controller-interface.js";
import logs from "../../../utils/debug/index.js";

const type = 'ipfs'
let debug = (id, ...args) => {
  let path = 'frontend/src/components/newkind-control/src/database/orbit-db-access-controllers/src/ipfs-access-controller.js'
  let from = path.search('db');
  let to = path.length;
  let url = path.substring(from,to);
  logs.assert(-4,url, id, args)
}
class IPFSAccessController extends AccessController {
  constructor (ipfs, options) {
    super()
    this._ipfs = ipfs
    this._write = Array.from(options.write || [])
    debug(`@@[(IPFSAccessController extends AccessController)constructor]`,{
      "this._write": this._write,
      options: options
    })
  }

  // Returns the type of the access controller
  static get type () { return type }

  // Return a Set of keys that have `access` capability
  get write () {
    return this._write
  }
  // @ts-ignore
  async canAppend (entry, identityProvider) {
    // Allow if access list contain the writer's publicKey or is '*'
    const key = entry.identity.id
    if (this.write.includes(key) || this.write.includes('*')) {
      // check identity is valid
      return identityProvider.verifyIdentity(entry.identity)
    }
    return false
  }
  // @ts-ignore
  async load (address) {
    // Transform '/ipfs/QmPFtHi3cmfZerxtH9ySLdzpg1yFhocYDZgEZywdUXHxFU'
    // to 'QmPFtHi3cmfZerxtH9ySLdzpg1yFhocYDZgEZywdUXHxFU'
    if (address.indexOf('/ipfs') === 0) { address = address.split('/')[2] }

    try {
      this._write = await io.read(this._ipfs, address)
    } catch (e) {
      console.log('IPFSAccessController.load ERROR:', e)
    }
  }

  async save () {
    debug(`@@[(IPFSAccessController extends AccessController)save]`,{
      write: JSON.stringify(this.write, null, 2)
    })
    let cid
    try {
      cid = await io.write(this._ipfs, 'dag-cbor', { write: JSON.stringify(this.write, null, 2) },{ pin: true })
    } catch (e) {
      debug(`@@[(IPFSAccessController extends AccessController)save:error]`,{
        error: e
      })
      console.log('IPFSAccessController.save ERROR:', e)
    }
    // return the manifest data
    return { address: cid }
  }
  // @ts-ignore
  static async create (orbitdb, options = {}) {
    // @ts-ignore
    options = { ...options, ...{ write: options.write || [orbitdb.identity.id] } }
    return new IPFSAccessController(orbitdb._ipfs, options)
  }
}

export default  IPFSAccessController
