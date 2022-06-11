'use strict'
import crypto from "../../../libp2p-crypto/index.js";
import { Buffer } from "../../../safe-buffer/index.js";

export default  {
  verify: async (signature, publicKey, data) => {
    if (!signature) {
      throw new Error('No signature given')
    }
    if (!publicKey) {
      throw new Error('Given publicKey was undefined')
    }
    if (!data) {
      throw new Error('Given input data was undefined')
    }

    if (!Buffer.isBuffer(data)) {
      data = Buffer.from(data)
    }

    const isValid = (key, msg, sig) => new Promise((resolve, reject) => {
      key.verify(msg, sig, (err, valid) => {
        if (!err) {
          resolve(valid)
        }
        reject(valid)
      })
    })

    let res = false
    try {
      const pubKey = crypto.keys.supportedKeys.secp256k1.unmarshalSecp256k1PublicKey(Buffer.from(publicKey, 'hex'))
      res = await isValid(pubKey, data, Buffer.from(signature, 'hex'))
    } catch (e) {
      // Catch error: sig length wrong
    }
    return Promise.resolve(res)
  }
}
