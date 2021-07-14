import Koa from 'koa';
import koaBody from 'koa-body';
import cors from '@koa/cors';
import passport from 'koa-passport';
import dotenv from 'dotenv';
dotenv.config();

const serve = require('koa-static');
const koaValidator = require('koa-async-validator');
const koaBunyanLogger = require('koa-bunyan-logger');

import { config } from './config';
import { routes } from './routes/index';
import { logger } from './logger';
import { connectDB } from './database';
import './passport';
import './nodemailer';
const app = new Koa();
connectDB();

app.use(koaBody());
app.use(koaValidator());
app.use(cors());
app.use(koaBunyanLogger(logger));
app.use(koaBunyanLogger.requestLogger());
app.use(koaBunyanLogger.timeContext());
app.use(passport.initialize());
app.use(passport.session());
app.use(routes);
app.use(serve('public'));

export const server = app.listen(config.port);

console.log(`Server running on port ${config.port}`);
