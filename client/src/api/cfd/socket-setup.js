import io from 'socket.io-client';

export const availableMarketsEvtType = 'available-markets';
export const marketSelectedEvtType = 'market-select';
export const marketDataBulkEvtType = 'market-data-bulk';
export const marketDataAllEvtType = 'market-data-all';
export const marketDataUpdateEvtType = 'market-data-update';
export const marketUpdateParamentersEvtType = 'market-update-parameters';

const allSupportedEvtTypes = [
  availableMarketsEvtType,
  marketSelectedEvtType,
  marketDataBulkEvtType,
  marketDataAllEvtType,
  marketDataUpdateEvtType,
  marketUpdateParamentersEvtType,
];

export const createSocket = () => io.connect(CFD_API_URL);

export const createSocketChannel = ({
  eventChannel,
  socket,
}) => eventChannel(
  (emitter) => {
    allSupportedEvtTypes.forEach((evtType) => {
      socket.on(evtType, (payload) => {
        emitter({
          type: evtType,
          payload,
        });
      });
    });
    return () => {
      allSupportedEvtTypes.forEach((evtType) => {
        socket.off(evtType);
      });
      socket.emit('disconnect');
    };
  },
);
