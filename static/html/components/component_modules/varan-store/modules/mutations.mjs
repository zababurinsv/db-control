const statusChange = (state, payload) => {
  console.log('status Change', payload)
  state.user = payload
}
const setKey = (state, payload) => {
  state.key = payload
}
const setObj = (state, payload) => {
  localStorage.setItem(`${payload['component']}-${payload['id']}`, JSON.stringify(payload))
  state.component = payload
}
const setLoading = (state, payload) => {
  state.loading = payload
}

export default {
  statusChange,
  setKey,
  setObj,
  setLoading
}
