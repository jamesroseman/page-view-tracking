import ApolloClient from 'apollo-boost';

import EnvVarUtils from '../utils/EnvVarUtils';

// Get the API URL and port
const apiUrl: string = EnvVarUtils.getApiUrl();
const apiPort: number = EnvVarUtils.getApiPort();
const uri: string = !apiUrl.startsWith('http') ? `http://${apiUrl}:${apiPort}` : `${apiUrl}`;

console.log(`Connected to GraphQL API at: ${uri}`);

// Disable caching of responses
// https://github.com/apollographql/apollo-client/issues/3234
// apollo-boost clients don't include defaultOptions
// https://github.com/apollographql/apollo-client/issues/3900
const client = new ApolloClient({ uri });

export default client;