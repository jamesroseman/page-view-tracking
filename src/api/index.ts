import createServer from './server/createServer';

async function main() {
  const { app } = await createServer();
  const apiUrl: string = 'localhost';
  const apiPort: number = 8085;
  await app.listen(apiPort);
  // eslint-disable-next-line no-console
  console.log(`Server started at ${apiUrl}:${apiPort}`);
}

main();
