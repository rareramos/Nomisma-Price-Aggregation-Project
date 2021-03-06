import express from 'express';
import { query, validationResult } from 'express-validator/check';
import {
  getLoans,
  getLoanTokens,
  getLoanVolumeBinDataPoints,
  supportedBins,
} from '../controllers/loans';

const router = express.Router();

const supportedPlatformFilters = [
  'all',
  'compound',
  'dharma',
  'maker',
];

router.get('/all', [
  query('offset').isInt().toInt(),
  query('limit').isInt().toInt(),
  query('protocol').isIn(supportedPlatformFilters),
], async (req, res) => {
  const errors = validationResult(req);
  let toReturn;
  if (!errors.isEmpty()) {
    toReturn = res.status(422).json({ errors: errors.array() });
  } else {
    const {
      offset,
      limit,
      token,
      sort,
      order,
      protocol: platform,
    } = req.query;
    const loans = await getLoans({
      offset,
      limit,
      token,
      sort,
      order,
      platform,
    });
    toReturn = res.send(loans);
  }
  return toReturn;
});

router.get('/tokens', [], async (req, res) => {
  const tokens = await getLoanTokens();
  return res.send(tokens);
});

router.get('/volumes', [
  query('chart-length-seconds')
    .isInt()
    .isIn(Object.keys(supportedBins))
    .toInt(),
  query('protocol').isIn(supportedPlatformFilters),
], async (req, res) => {
  const errors = validationResult(req);
  let toReturn;
  if (!errors.isEmpty()) {
    toReturn = res.status(422).json({ errors: errors.array() });
  } else {
    const {
      'chart-length-seconds': chartLengthInSeconds,
      protocol: platform,
    } = req.query;
    const dataPoints = await getLoanVolumeBinDataPoints({
      chartLengthInSeconds,
      platform,
    });
    toReturn = res.send(dataPoints);
  }
  return toReturn;
});

export default router;
