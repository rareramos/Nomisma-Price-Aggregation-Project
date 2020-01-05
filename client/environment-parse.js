
const reduceVars = (
  vars,
  transform,
) => vars.reduce(
  (acc, [key, value]) => {
    if (typeof value === 'object') {
      const flattened = reduceVars(
        Object.entries(value),
        transform,
      );
      return Object.assign(
        {},
        acc,
        flattened,
      );
    }

    return Object.assign(
      {},
      acc,
      {
        [key]: transform(value),
      },
    );
  },
  {},
);

const parseVars = (
  config,
  transform = value => JSON.stringify(value),
) => reduceVars(
  Object.entries(
    config,
  ),
  transform,
);

module.exports = parseVars;
