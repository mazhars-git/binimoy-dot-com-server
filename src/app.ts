// const express = require('express')
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './app/routers';
import { globalErrorHandler } from './app/middlwares/globalErrorHandler';
import notFound from './app/middlwares/notFound';

const app: Application = express();

//parser
app.use(express.json());
app.use(
  cors({
    origin: ['https://binimoy-client.vercel.app/', 'http://localhost:3000'],
    credentials: true,
  }),
);
app.use(cookieParser());

//application routes
app.use('', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Home Page');
});

app.use(globalErrorHandler);

// not found route
app.use(notFound);

export default app;
