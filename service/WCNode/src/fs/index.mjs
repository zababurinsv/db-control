import { hooks } from '../../hooks/index.mjs';
import service from './node/index.mjs';
export const node = async (self = document) => {
  const { init } = hooks;
  let state = await init(service, self);
  return {
    click: async () => {
      state = (await state.click()).state;
      return 'test';
    },
    idbfs: async () => (state = (await state.idbfs()).state)
  }
}
