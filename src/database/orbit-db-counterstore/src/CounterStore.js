'use strict'

import Store from "../../orbit-db-store/dist/Store.js";

import CounterIndex from "./CounterIndex.js";

import Counter from "../../crdts/src/G-Counter.js";

class CounterStore extends Store {
  constructor (ipfs, id, dbname, options = {}) {
    if (!options.Index) {
      Object.assign(options, { Index: CounterIndex })
    }
    super(ipfs, id, dbname, options)
    this._index = new this.options.Index(this.identity.publicKey)
    this._type = 'counter'
  }

  get value () {
    return this._index.get().value
  }

  inc (amount, options = {}) {
    const counter = new Counter(this.identity.publicKey, Object.assign({}, this._index.get()._counters))
    counter.increment(amount)
    return this._addOperation({
      op: 'COUNTER',
      key: null,
      value: counter.toJSON()
    }, options)
  }
}

export default  CounterStore
