import waves from '/static/html/components/component_modules/api/blockchain/waves/index.mjs'

export default {
  waves: {
    get: {
      tokens: waves.get.tokens,
      token: waves.get.token
    }
  }
}