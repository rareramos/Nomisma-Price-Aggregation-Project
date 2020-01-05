import { CfdQuasiLiveData } from 'price-aggregation-db';
import { isEmpty } from 'lodash';

export const persistQuasiLiveData = ({ symbol, serviceName, ...rest }) => {
  if (!isEmpty(rest)) {
    CfdQuasiLiveData.updateOne(
      {
        symbol,
        serviceName,
      },
      {
        $set: rest,
      },
      {
        upsert: true,
      },
    );
  }
};

export const persistLiveData = ({ sink }) => ({
  symbol,
  serviceName,
  base,
  underlying,
  offer,
  bid,
}) => {
  sink({
    symbol, serviceName, base, underlying, offer, bid,
  });
};
