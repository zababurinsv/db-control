'use strict'
import io from "../../../orbit-db-io/index.js";

export default  {
  read: async (ipfs, cid, options = {}) => {
    const access = await io.read(ipfs, cid, options)
    return (typeof access.write === 'string') ? JSON.parse(access.write) : access.write // v0 access.write not stringified
  },
  write: io.write
}
