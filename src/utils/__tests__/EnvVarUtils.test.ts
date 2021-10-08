import { ConnectionOptions } from "typeorm";
import EnvVarUtils, { EnvVarNames } from "../EnvVarUtils";

describe('EnvVarUtils', () => {
  let oldEnv: NodeJS.ProcessEnv;

  beforeAll(() => {
    oldEnv = process.env;
  });

  beforeEach(() => {
    jest.resetModules();
    process.env = {};
  });

  afterAll(() => {
    process.env = oldEnv;
  });

  describe('getConnectionOptions', () => {
    let validEnvironment = {
        DATABASE_CACHE: 'false',
        DATABASE_SYNCHRONIZE: 'false',
        DATABASE_SSL: 'false',
        DATABASE_TYPE: 'postgres',
        DATABASE_URL: 'postgresql://localhost/page-view-tracking'
    }

    beforeEach(() => {
      process.env = JSON.parse(JSON.stringify(validEnvironment));
    });

    it('should throw if no variables are present', () => {
      process.env = {};
      expect(() => { EnvVarUtils.getConnectionOptions() }).toThrow();
    });

    it('should throw if missing database type', () => {
      delete process.env['DATABASE_TYPE'];
      expect(() => { EnvVarUtils.getConnectionOptions() }).toThrow();
    });

    it('should throw if missing database URL', () => {
      delete process.env['DATABASE_URL'];
      expect(() => { EnvVarUtils.getConnectionOptions() }).toThrow();
    });

    it('should throw if database type is invalid', () => {
      process.env['DATABASE_TYPE'] = 'invalid database type';
      expect(() => { EnvVarUtils.getConnectionOptions() }).toThrow();
    });

    it('should get connection options if environment is valid', () => {
      const expectedConnectionOptions: ConnectionOptions = {
        type: 'postgres',
        url: 'postgresql://localhost/page-view-tracking',
        entities: [ './src/models/**/!(test.ts)' ],
        migrations: [ './src/migrations/**/*.ts' ],
        cache: false,
        synchronize: false,
        cli: { entitiesDir: './src/models', migrationsDir: './src/migrations' },
        extra: {}
      };
      const actualConnectionOptions: ConnectionOptions = EnvVarUtils.getConnectionOptions();
      expect(actualConnectionOptions).toEqual(expectedConnectionOptions);
    });
  });

  describe('getApiUrl', () => {
    let validEnvironment = {
      API_URL: 'localhost',
    }

    beforeEach(() => {
      process.env = JSON.parse(JSON.stringify(validEnvironment));
    });

    it('should throw if missing API URL', () => {
      process.env = {};
      expect(() => { EnvVarUtils.getApiUrl() }).toThrow();
    });

    it('should get API url if environment is valid', () => {
      process.env = validEnvironment;
      const expectedApiUrl: string = 'localhost';
      const actualApiUrl: string = EnvVarUtils.getApiUrl();
      expect(actualApiUrl).toEqual(expectedApiUrl);
    });
  });

  describe('getApiPort', () => {
    let validEnvironment = {
      API_PORT: '8080',
    }

    beforeEach(() => {
      process.env = JSON.parse(JSON.stringify(validEnvironment));
    });

    it('should throw if missing API PORT', () => {
      process.env = {};
      expect(() => { EnvVarUtils.getApiPort() }).toThrow();
    });

    it('should throw if API port is invalid', () => {
      process.env['API_PORT'] = 'not a number';
      expect(() => { EnvVarUtils.getApiPort() }).toThrow();
    })

    it('should get API port if environment is valid', () => {
      process.env = validEnvironment;
      const expectedApiPort: number = 8080;
      const actualApiPort: number = EnvVarUtils.getApiPort();
      expect(actualApiPort).toEqual(expectedApiPort);
    });
  });
});