import { Router, Request, Response } from 'express';
import userController from './controllers/userController';
import errorHandler from './middlewares/errorHandler';

const router = Router();

router.use('/user', userController);

router.use((err: any, req: Request, res: Response) => {
  errorHandler(err, req, res, err.statusCode || 500);
});

export default router;
