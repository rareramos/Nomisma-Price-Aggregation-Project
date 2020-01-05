import { basicGet } from '@nomisma/utils';
import {
  getChartApiUrl,
} from './urls';

export const fetchChart = ({
  protocol,
  chartLengthSeconds,
}) => basicGet(getChartApiUrl({
  protocol,
  chartLengthSeconds,
}))();
