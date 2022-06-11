'use strict'
// @ts-ignore
import pMapSeries from "../../p-map-series/index.js";

import AccessController from "./access-controller-interface.js";

import ensureAddress from "./utils/ensure-ac-address.js";

const type = 'orbitdb'

class OrbitDBAccessController extends AccessController {
  // @ts-ignore
  constructor (orbitdb, options) {
    super()
    this._orbitdb = orbitdb
    this._db = null
    this._options = options || {}
  }

  // Returns the type of the access controller
  static get type () { return type }

  // Returns the address of the OrbitDB used as the AC
  get address () {
    return this._db.address
  }
  // @ts-ignore
  // Return true if entry is allowed to be added to the database
  async canAppend (entry, identityProvider) {
    // Write keys and admins keys are allowed
    const access = new Set([...this.get('write'), ...this.get('admin')])
    // If the ACL contains the writer's public key or it contains '*'
    if (access.has(entry.identity.id) || access.has('*')) {
      const verifiedIdentity = await identityProvider.verifyIdentity(entry.identity)
      // Allow access if identity verifies
      return verifiedIdentity
    }

    return false
  }

  get capabilities () {
    console.log('~~~~~~~~~~~ capabilities ~~~~~~~~~~~~')
    if (this._db) {
      const capabilities = this._db.index
      // @ts-ignore
      const toSet = (e) => {
        const key = e[0]
        capabilities[key] = new Set([...(capabilities[key] || []), ...e[1]])
      }

      // Merge with the access controller of the database
      // and make sure all values are Sets
      Object.entries({
        ...capabilities,
        // Add the root access controller's 'write' access list
        // as admins on this controller
        ...{ admin: new Set([...(capabilities.admin || []), ...this._db.access.write]) }
      }).forEach(toSet)

      return capabilities
    }
    return {}
  }
  // @ts-ignore
  get (capability) {
    return this.capabilities[capability] || new Set([])
  }

  async close () {
    await this._db.close()
  }
  // @ts-ignore
  async load (address) {
    if (this._db) { await this._db.close() }

    // Force '<address>/_access' naming for the database
    this._db = await this._orbitdb.keyvalue(ensureAddress(address), {
      // use ipfs controller as a immutable "root controller"
      accessController: {
        type: 'ipfs',
        write: this._options.admin || [this._orbitdb.identity.id]
      },
      sync: true
    })

    this._db.events.on('ready', this._onUpdate.bind(this))
    this._db.events.on('write', this._onUpdate.bind(this))
    this._db.events.on('replicated', this._onUpdate.bind(this))

    await this._db.load()
  }
  // @ts-ignore
  async save () {
    // return the manifest data
    return {
      address: this._db.address.toString()
    }
  }
  // @ts-ignore
  async grant (capability, key) {
    // Merge current keys with the new key
    const capabilities = new Set([...(this._db.get(capability) || []), ...[key]])
    await this._db.put(capability, Array.from(capabilities.values()))
  }
  // @ts-ignore
  async revoke (capability, key) {
    const capabilities = new Set(this._db.get(capability) || [])
    capabilities.delete(key)
    if (capabilities.size > 0) {
      await this._db.put(capability, Array.from(capabilities.values()))
    } else {
      await this._db.del(capability)
    }
  }

  /* Private methods */
  _onUpdate () {
    console.log('~~~~~~~~~~~~~~~_onUpdate~~~~~~~~')
    this.emit('updated')
  }

  /* Factory */
  // @ts-ignore
  static async create (orbitdb, options = {}) {
    const ac = new OrbitDBAccessController(orbitdb, options)
    // @ts-ignore
    await ac.load(options.address || options.name || 'default-access-controller')
    // @ts-ignore
    // Add write access from options
    if (options.write && !options.address) {
      // @ts-ignore
      await pMapSeries(options.write, async (e) => ac.grant('write', e))
    }

    return ac
  }
}

export default  OrbitDBAccessController
