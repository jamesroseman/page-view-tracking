import * as dotenv from 'dotenv';
import * as path from 'path';
import { createConnection } from 'typeorm';

import EnvVarUtils from '../utils/EnvVarUtils';
import createServer from './server/createServer';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function main() {
  // Connect to the database.
  console.log('[-] Connecting to the database...');
  await createConnection(EnvVarUtils.getConnectionOptions());
  console.log('[x] Connected!\n')

  // Create the API server.
  const { app } = await createServer();
  const apiUrl: string = EnvVarUtils.getApiUrl();
  const apiPort: number = EnvVarUtils.getApiPort();
  await app.listen(apiPort);

  // eslint-disable-next-line no-console
  console.log(`[x] Server started on port ${apiUrl}:${apiPort}`);
}

main();
