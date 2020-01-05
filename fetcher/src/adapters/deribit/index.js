import setupPublisher from '../publisher';
import { Deribit } from './deribit';
import { persistLiveData, persistQuasiLiveData } from '../common-cfd';

const fetchDeribit = async () => {
  const deribit = new Deribit();
  await deribit.initialize();

  const sink = await setupPublisher(deribit);

  deribit.setLiveDataHandler(persistLiveData({ sink }));
  deribit.setQuasiDataHandler(persistQuasiLiveData);
  deribit.subscribe();
  deribit.cron.start();

  return new Promise(() => {});
};

export default fetchDeribit;
