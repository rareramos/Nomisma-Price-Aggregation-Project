// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getDeepCopiedMarkets = (state, data) : any => {
  const toReturn = {};
  Object.keys(data).forEach((platform) => {
    toReturn[platform] = {
      ...state[platform],
      ...data[platform],
    };
  });
  return toReturn;
};
