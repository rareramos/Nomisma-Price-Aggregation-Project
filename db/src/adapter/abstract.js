import { getAdapter } from './adapter';

class Abstract {}


export const createCollection = (collectionName) => {
  const abstract = new Abstract();

  const findProxy = async (filter) => {
    const adapter = await getAdapter();
    const connection = await adapter.collection(collectionName);
    const result = await connection.find(filter);
    return result.toArray();
  };

  return new Proxy(abstract, {
    get(
      _target,
      prop,
    ) {
      if (prop === 'find') {
        return findProxy;
      }

      const methods = [
        'findOne',
        'insertOne',
        'insertMany',
        'updateOne',
        'deleteMany',
        'aggregate',
        'replaceOne',
        'countDocuments',
        'distinct',
      ];

      if (methods.indexOf(prop) > -1) {
        const fnProxy = async (...args) => {
          const adapter = await getAdapter();
          const connection = await adapter.collection(collectionName);
          return connection[prop].call(connection, ...args);
        };

        return fnProxy;
      }

      throw new TypeError('No proxy for property');
    },
  });
};
