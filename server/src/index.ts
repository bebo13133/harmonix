import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

import express, { Express } from 'express';
import expressConfig from './config/expressConfig';
import router from './router';

const app: Express = express();

expressConfig(app);

app.use(router);
