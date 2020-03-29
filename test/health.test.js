import supertest from 'supertest';
import server from '../src';
import config from '../src/config';

const PORT = config.get('PORT') ?? 3000;
let listener;
let request;

beforeAll(() => {
  listener = server.listen(PORT);
  request = supertest(listener);
});
afterAll(async () => {
  await listener.close();
});

