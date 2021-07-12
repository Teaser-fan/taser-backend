export interface IConfig {
  port: number;
  dbUri: string;
  secret: string;
  mail: {
    user: string;
    password: string;
  };
  baseUrl: string;
}

export const config: IConfig = {
  port: parseInt(process.env.NODE_PORT, 10) || 3500,
  dbUri:
    'mongodb+srv://test:test@teaser-db.mali1.mongodb.net/myFirstDatabase?authSource=admin&replicaSet=atlas-13jsoh-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true',
  secret: 'dH7qs9QdXo',
  mail: {
    user: '',
    password: '',
  },
  baseUrl: 'http://localhost:4200'
};
