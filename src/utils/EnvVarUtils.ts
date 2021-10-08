import { ConnectionOptions } from 'typeorm';

/**
 * A centralized mapping of environment variable names.
 */
export type EnvVarNames = {
  DB_SHOULD_CACHE: string;
  DB_SHOULD_SYNCHRONIZE: string;
  DB_SHOULD_USE_SSL: string;
  DB_TYPE: string;
  DB_URL: string;
  API_URL: string;
  API_PORT: string;
}

/**
 * A utility class with helpers for accessing environment
 * variables, with safeguards and type safety.
 */
export default class EnvVarUtils {
  /**
   * Get the names of environment variables. 
   * Centralized to make it easier to change in the future.
   */
  static getEnvNames(): EnvVarNames {
    return {
      DB_SHOULD_CACHE: 'DATABASE_CACHE',
      DB_SHOULD_SYNCHRONIZE: 'DATABASE_SYNCHRONIZE',
      DB_SHOULD_USE_SSL: 'DATABASE_SSL',
      DB_TYPE: 'DATABASE_TYPE',
      DB_URL: 'DATABASE_URL',
      API_URL: 'API_URL',
      API_PORT: 'API_PORT'
    }
  }

  /**
   * Access the API URL (used to connect the frontend server to the backend API).
   */
  static getApiUrl(): string {
    const names: EnvVarNames = this.getEnvNames();
    const reactApiUrl: string | undefined = process.env[`REACT_APP_${names.API_URL}`];
    if (reactApiUrl !== undefined) {
      return reactApiUrl;
    }
    const apiUrl: string | undefined = process.env[names.API_URL];
    if (apiUrl !== undefined) {
      return apiUrl;
    }
    const apiUrlNotFoundError: Error = new Error(`API URL [${names.API_URL}] not found in env vars.`);
    apiUrlNotFoundError.name = 'Undefined API URL.';
    throw apiUrlNotFoundError;
  }

  /**
   * Access the API Port (used to connect the frontend server to the backend API).
   */
   static getApiPort(): number {
    const names: EnvVarNames = this.getEnvNames();
    let apiPortStr: string | undefined;
    apiPortStr = process.env[`REACT_APP_${names.API_PORT}`];
    if (apiPortStr === undefined) {
      apiPortStr = process.env[names.API_PORT];
    }
    if (apiPortStr === undefined) {
      const apiPortNotFoundError: Error = new Error(`API Port [${names.API_PORT}] not found in env vars.`);
      apiPortNotFoundError.name = 'Undefined API Port.';
      throw apiPortNotFoundError;
    }
    const apiPort: number = parseInt(apiPortStr);
    if (isNaN(apiPort)) {
      const invalidApiPortError: Error = new Error(`API Port [${names.API_PORT}] cannot be parsed as number.`);
      invalidApiPortError.name = 'Invalid API Port.';
      throw invalidApiPortError;
    }
    return apiPort;
  }

  /**
   * Access database connection options for TypeORM.
   */
  static getConnectionOptions(): ConnectionOptions {
    const names: EnvVarNames = this.getEnvNames();
    const migrations: string[] = ['./src/migrations/**/*.ts'];
    const entities: string[] = ['./src/models/**/!(test.ts)'];
    const cli: object = {
      entitiesDir: './src/models',
      migrationsDir: './src/migrations',
    };
    const cache: boolean = process.env[names.DB_SHOULD_CACHE] === 'true';
    const synchronize: boolean = process.env[names.DB_SHOULD_SYNCHRONIZE] === 'true';
    const ssl: boolean = process.env[names.DB_SHOULD_USE_SSL] === 'true';
    const extra: object = ssl
      ? {
        ssl: {
          rejectUnauthorized: false,
        },
      }
      : {};

    const dbTypeStr: string | undefined = process.env[names.DB_TYPE];
    if (dbTypeStr === undefined || !(dbTypeStr === 'sqlite' || dbTypeStr === 'postgres' || dbTypeStr === 'mysql')) {
      const typeNotFoundError: Error = new Error(`Database type [${names.DB_TYPE}] not found in env vars.`);
      typeNotFoundError.name = 'Undefined Database Type';
      throw typeNotFoundError;
    }
    const type: 'sqlite' | 'postgres' | 'mysql' = dbTypeStr;
    if (type === 'mysql' || type === 'postgres') {
      let url: string | undefined = process.env[names.DB_URL];
      if (url === undefined) {
        const urlNotFoundError: Error = new Error(`Database URL [${names.DB_URL}] not found in env vars.`);
        urlNotFoundError.name = 'Undefined URL';
        throw urlNotFoundError;
      }
      return {
        type, url, entities, migrations, cache, synchronize, cli, extra,
      };
    }
    const invalidDbOptionsError: Error = new Error(`Unrecognized type [${names.DB_TYPE}] and no corresponding env vars.`);
    invalidDbOptionsError.name = 'Unrecognized Database Type';
    throw invalidDbOptionsError;
  }
}