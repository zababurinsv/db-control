'use strict'
import verifierv0 from './verifierv0.js'
import verifierv1 from './verifierv1.js'

const verifiers = {
  'v0': verifierv0,
  'v1': verifierv1
}

export const verifier = (v) => {
  return verifiers[v]
}

export default verifier
