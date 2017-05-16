
import test from 'ava';
import * as rp from 'request-promise-native'
import { api } from './helpers'
const request = require('supertest');

test('/api/main', async t => {
  t.plan(2);

  const res = await request(api())
    .get('/api')

  t.is(res.status, 200);
  t.deepEqual(res.body, {
    "routes": [
      "/api/affiliations",
      "/api/competitors",
      "/api/competitions",
      "/api/levels",
      "/api/styles",
      "/api/events",
      "/api/rounds",
      "/api/partnerships",
      "/api/organizations",
      "/api/payment_records",
      "/api/callbacks",
      "/api/admins",
      "/api/officials",
      "api/querytest"
    ]
  });
});
