import { connect, Db, MongoClient, MongoClientOptions } from 'mongodb';
import { AppConf } from '../../../../config/app.config';

let client: MongoClient;

const getMongoClient = async (): Promise<MongoClient> => {
  const { mongo } = AppConf;
  const clientOptions: MongoClientOptions = {};
  const cxnString = `mongodb+srv://${mongo.username}:${mongo.password}@${mongo.host}`;

  if (mongo.maxPoolSize) {
    clientOptions.maxPoolSize = mongo.maxPoolSize;
  }

  if (mongo.minPoolSize) {
    clientOptions.minPoolSize = mongo.minPoolSize;
  }

  if (mongo.maxIdleTimeMS) {
    clientOptions.maxIdleTimeMS = mongo.maxIdleTimeMS;
  }

  clientOptions.useNewUrlParser = true;
  clientOptions.useUnifiedTopology = true;

  return await connect(cxnString, clientOptions);
};

export const getClientDb = async (dbName: string): Promise<Db> => {
  if (!client || !client.isConnected()) {
    client = await getMongoClient();
  }

  return client.db(dbName);
};

export const disconnect = async (): Promise<void> => {
  try {
    if (client?.isConnected()) {
      await client.close();
    }
  } catch (e) {
    console.error('[ERROR] unable to close database connection', e);
  }
};
