import {
  MongoClient,
} from 'mongodb';
import {
  getEnvironment,
  getLogger,
} from '../utils';

let db = null;
let client = null;

export async function connect(options) {
  if (db !== null) {
    return db;
  }

  const environment = getEnvironment();
  const log = getLogger();

  const uri = !!options && !!options.url ? options.url : environment.database.MONGODB_URI;
  const dbPath = !!options && !!options.db ? options.db : environment.database.DB_PATH;
  const configPath = environment.database.CONFIG_PATH;
  /* eslint-disable-next-line import/no-dynamic-require, global-require */
  const config = configPath ? require(configPath) : {};

  try {
    client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      ...config,
    });
    db = client.db(dbPath);

    log.info({
      message: 'MongoDB connection established',
    });

    return db;
  } catch (error) {
    log.error({
      message: 'MongoDB connection could not be established',
    });

    throw error;
  }
}

export async function close(code) {
  if (client !== null) {
    const log = getLogger();

    log.info({
      message: `MongoDB connection closing with exit code: ${code}`,
    });

    await client.close();
  }
}

export async function collection(
  collectionName,
) {
  if (db === null) {
    throw new Error('MongoDB connection is not established');
  }

  return db.collection(collectionName);
}
