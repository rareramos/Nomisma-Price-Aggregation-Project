import { collection, connect } from './connect';

export const getAdapter = async (opts) => {
  await connect(opts);
  return {
    collection: name => collection(name),
  };
};
