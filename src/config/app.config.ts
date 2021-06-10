type MongoConfig = {
  timeoutMS: number;
  minPoolSize: number;
  maxPoolSize: number;
  maxIdleTimeMS: number;
  host: string;
  username: string;
  password: string;
  dbName: string;
  schemaVersion: string;
  colNames: {
    [key: string]: string;
  };
};

type AppConfig = {
  mongo: MongoConfig;
};

const { MONGO_DB_HOST, MONGO_DB_PASSWORD, MONGO_DB_USERNAME } = process.env;

export const AppConf: AppConfig = {
  mongo: {
    timeoutMS: 360000,
    minPoolSize: 5,
    maxPoolSize: 10,
    maxIdleTimeMS: 360000,
    host: MONGO_DB_HOST as string,
    username: MONGO_DB_USERNAME as string,
    password: MONGO_DB_PASSWORD as string,
    dbName: 'povi',
    schemaVersion: '1',
    colNames: {
      accounts: 'accounts',
      portfolios: 'portfolios'
    }
  }
};
