import {
  basicGet,
} from '@nomisma/utils';

import {
  getCfdQuasiLiveURL,
} from '../urls';

export const fetchQuasiLiveFromServer = params => basicGet(
  getCfdQuasiLiveURL(params),
)();
