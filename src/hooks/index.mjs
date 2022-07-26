import { Hooks } from './hooks.mjs'
export const node = async (self, component) => {
  const { init } = Hooks
  let state = await init(self, component)
  return {
    click: async () => {
      state = (await state.click()).state
      return 'test'
    },
    idbfs: async () => (state = (await state.idbfs()).state)
  }
}