import { Request, Response, Router } from 'express';
import {
  getInstruments,
  getScrapingInstruments,
  getUnmatchedInstruments,
} from '../controllers/instruments';

const router = Router();

router.get('/quasi-live', async (req : Request, res : Response) : Promise<void> => {
  const data = await getInstruments(req.query);
  res.send(data);
});

router.get('/scraping', async (req : Request, res : Response) : Promise<void> => {
  const data = await getScrapingInstruments(req.query);
  res.send(data);
});

router.get('/unmatched', async (req : Request, res : Response) : Promise<void> => {
  const data = await getUnmatchedInstruments(req.query);
  res.send(data);
});

export default router;
