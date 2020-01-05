import io from 'socket.io-client';
import environment from '../../../environment';

const serviceApiHandler = handler => (payload) => {
  handler.emit('update', payload);
};

const run = (adapter) => {
  const handler = io.connect(environment.publisher.ENDPOINT);
  return new Promise((resolve) => {
    handler.on('connect', () => resolve(serviceApiHandler(handler)));
    handler.on('market-update-parameters', () => {
      handler.emit('market-updated-parameters', adapter && adapter.getCurrentInstuments());
    });
  });
};

export default run;
