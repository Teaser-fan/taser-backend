import nodemailer from 'nodemailer';
import { config } from './config';

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.mail.user,
    pass: config.mail.password,
  },
});

export default transport;
