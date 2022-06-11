/* eslint-disable */
// adapted from https://github.com/cheton/is-electron - (c) Cheton Wu
const isElectron = () => {
  if (typeof window !== 'undefined' && typeof window.process === 'object') {
    return true
  }
// @ts-ignore
  if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
    return true
  }

  return false
}

const fs = null

export default  fs
