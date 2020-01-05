import { Request, Response, Router } from 'express';
import { getQuasiLiveData } from '../controllers/cfd/index';

const cfdRouter = Router();

cfdRouter.get('/quasi', async (req : Request, res : Response) : Promise<Response> => {
  const quasi = await getQuasiLiveData(req.query);
  return res.send(quasi);
});

export default cfdRouter;
