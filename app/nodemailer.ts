import nodemailer from 'nodemailer';
import { config } from './config';

const transport = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  auth: {
    user: config.mail.user,
    pass: config.mail.password,
  },
});

export default transport;
