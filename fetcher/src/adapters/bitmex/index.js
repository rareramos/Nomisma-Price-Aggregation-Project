import setupPublisher from '../publisher';
import { Bitmex } from './bitmex';
import { persistLiveData, persistQuasiLiveData } from '../common-cfd';

const fetchBitmex = async () => {
  const bitmex = new Bitmex();
  await bitmex.initialize();

  const sink = await setupPublisher(bitmex);

  bitmex.setLiveDataHandler(persistLiveData({ sink }));
  bitmex.setQuasiDataHandler(persistQuasiLiveData);
  bitmex.subscribe();
  bitmex.cron.start();

  return new Promise(() => {});
};

export default fetchBitmex;
