import setupPublisher from '../publisher';
import { Kraken } from './kraken';
import { persistLiveData, persistQuasiLiveData } from '../common-cfd';

const fetchKraken = async () => {
  const kraken = new Kraken();
  await kraken.initialize();

  const sink = await setupPublisher(kraken);

  kraken.setLiveDataHandler(persistLiveData({ sink }));
  kraken.setQuasiDataHandler(persistQuasiLiveData);
  kraken.subscribe();
  kraken.cron.start();

  return new Promise(() => {});
};

export default fetchKraken;
