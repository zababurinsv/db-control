import { hooks } from '../../hooks/index.mjs';
import service from './node/index.mjs';
export default async (self = document) => {
  const { init } = hooks;
  let state = await init(service, self);
  return {
    health: async () => (state = (await state.health()).state),
    idbfs: async () => {
      state = (await state.idbfs()).state
      return state.api
    },
    terminate: async () => {
      state = (await state.terminate()).state
      return true
    }
  }
}
