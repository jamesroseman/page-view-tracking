/* eslint-disable no-console */
import * as dotenv from 'dotenv';
import * as path from 'path';
import { writeFileSync } from 'fs';

import EnvVarUtils from '../utils/EnvVarUtils';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function main() {
  const connectionOptStr: string = JSON.stringify(EnvVarUtils.getConnectionOptions(), null, 2);
  await writeFileSync(path.join(__dirname, '../../ormconfig.json'), connectionOptStr);
  console.log(' [x] Successfully wrote ormconfig.json file.');
}

main()
  .catch(console.error);
