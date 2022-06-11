'use strict'
import path from "../../../path/index.js";
// Make sure the given address has '/_access' as the last part
const ensureAddress = address => {
  const suffix = address.toString().split('/').pop()
  return suffix === '_access'
    ? address
    : path.join(address, '/_access')
}
export default  ensureAddress
