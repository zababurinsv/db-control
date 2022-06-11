'use strict'

export const getPeerID = async (ipfs) => {
  const peerInfo = await ipfs.id()
  return peerInfo.id
}

export default getPeerID
