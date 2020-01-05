import setupPublisher from '../publisher';
import { IgIndex } from './ig';
import { persistLiveData, persistQuasiLiveData } from '../common-cfd';

const fetchIg = async () => {
  const ig = new IgIndex();
  await ig.initialize();

  const sink = await setupPublisher(ig);

  ig.setLiveDataHandler(persistLiveData({ sink }));
  ig.setQuasiDataHandler(persistQuasiLiveData);
  ig.subscribe();
  ig.cron.start();

  return new Promise(() => {});
};

export default fetchIg;
