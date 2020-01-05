import { PublicClient, V3WebsocketClient } from '@okfe/okex-node';

import setupPublisher from '../publisher';
import { log } from '../../utils/logger';

const serviceName = 'okex.com';

const subscribe = (sink, instruments) => {
  const wss = new V3WebsocketClient();

  wss.on('open', () => {
    instruments.forEach(i => wss.subscribe(`spot/depth5:${i.instrument_id}`));
  });

  wss.on('message', (msgStr) => {
    const msg = JSON.parse(msgStr);
    if (!msg.data) return;

    msg.data.forEach((record) => {
      const symbol = record.instrument_id;

      log.debug({
        message: `OKEX ${symbol} price update`,
      });

      const [base, underlying] = record.instrument_id.split('-');
      sink({
        serviceName,
        base,
        underlying,
        bid: record.bids[0][0],
        offer: record.asks[0][0],
      });
    });
  });

  wss.connect();
};

const fetchOkex = async () => {
  const sink = await setupPublisher();

  const pClient = new PublicClient();
  const instruments = await pClient.spot().getSpotInstruments();
  subscribe(sink, instruments);

  await new Promise(() => {});
};

export default fetchOkex;
