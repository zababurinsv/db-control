import * as mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'

export default {
  state: {
    loadedTodosG: [],
    loadedInProgressG: [],
    loadedInDoneG: []
  },
  mutations,
  actions,
  getters
}
