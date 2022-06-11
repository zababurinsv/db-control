class ReplicationInfo {
  constructor () {
    this.reset()
  }

  reset () {
    this.progress = 0
    this.max = 0
    this.buffered = 0
    this.queued = 0
  }
}

export default  ReplicationInfo
