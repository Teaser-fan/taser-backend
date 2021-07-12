import Mongoose from 'mongoose';
import { config } from './config';
import { logger } from './logger';

let database: Mongoose.Connection;
export const connectDB = () => {
  // add your own uri below
  const uri: string = config.dbUri;
  if (database) {
    return;
  }
  Mongoose.connect(uri, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  database = Mongoose.connection;
  database.once('open', async () => {
    logger.info('Connected to database');
  });
  database.on('error', () => {
    logger.error('Error connecting to database');
  });
};

export const disconnectDB = () => {
  if (!database) {
    return;
  }
  Mongoose.disconnect();
};
