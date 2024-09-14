import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './envConfig';

const { server_port, frontend_server } = config;

const corsOptions = {
  origin: frontend_server,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

const expressConfig = async (app: Express): Promise<void> => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors(corsOptions));
  app.use(cookieParser());

  app.listen(server_port, () => {
    console.log(`Server is running on port ${server_port}`);
  });
};

export default expressConfig;
