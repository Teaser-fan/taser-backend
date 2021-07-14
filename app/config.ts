export interface IConfig {
  port: number;
  dbUri: string;
  secret: string;
  mail: {
    host: string;
    port: number;
    user: string;
    password: string;
  };
  baseUrl: string;
}

export const config: IConfig = {
  port: parseInt(process.env.NODE_PORT, 10) || 3500,
  dbUri: process.env.DB_URI,
  secret: process.env.SECRET,
  mail: {
    host: 'smtp.mandrillapp.com',
    port: 587,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
  },
  baseUrl: 'http://localhost:4200'
};
