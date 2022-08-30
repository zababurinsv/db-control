import actions from '/static/html/components/component_modules/varan-store/user/actions.js'
import getters from '/static/html/components/component_modules/varan-store/user/getters.js'
import mutations from '/static/html/components/component_modules/varan-store/user/mutations.js'

export default {
  state: {
    key: true,
    user: null,
    component:'',
    loading: false
  },
  mutations,
  actions,
  getters
}
