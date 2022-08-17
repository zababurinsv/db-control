import { hooks } from '/service/WCNode/hooks/index.mjs';
import Service from './node/index.mjs';

export const node = async (self= document) => {
  const { init } = hooks;
  let state = await init(Service, self);
  return {
    click: async () => state = (await state.click()).state
  };
};
