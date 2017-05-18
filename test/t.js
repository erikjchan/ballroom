import http from 'ava-http';
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

/* test: create official */
test('create official', async t => {
  t.plan(1);

  const body = {
    'token': '',
    'firstname':'angie',
    'lastname': 'pinilla',
    'roleid':'4444',
    'competitionid': '4'
  };

  const res = await http.postResponse('http://localhost:8080/api/create_official', {body});
  t.is(res.statusCode, 200);
  console.log(res.body);

});


/* test: delete official by id */

test('delete official by id', async t => {
  const body = {
    'id': '',
  };
  const res = await http.postResponse('http://localhost:8080/api/delete_official', {body});
  t.is(res.statusCode, 200);
  console.log(res.body);

});

test('clear amount owed', async t => {
  const body = {
          'competititonid': '',
          'affiliationid': '',
          };
        const res = await http.postResponse('http://localhost:8080/api/clear_organization_owed', {body});
        t.is(res.statusCode, 200);
        console.log(res.body);
});

test('create payment record', async t => {
        const body = {
                'competitionid':'',
                'competitorid':'',
                'amount':'',
                'online': '',
                'paidwithaffiliation':'',
                };
        const res = await http.postResponse('http://localhost:8080/api/create_paymentrecord', {body});
        t.is(res.statusCode, 200);
        console.log(res.body);
});

test('get amount owed by organization', async t => {
        const body = {
                'cid':'',
                'aid':'',
        };
        const res = await http.postResponse('http://localhost:8080/api/create_paymentrecord', {body});
        t.is(res.statusCode, 200);
        console.log(res.body);
});

test('create partnership', async t => {
        const body = {
                'leadcompetitorid':'',
                'followcompetitorid':'',
                'eventid':'',
                'competitionid':'',
                };
        const res = await http.postResponse('http://localhost:8080/api/create_partnership', {body});
        t.is(res.statusCode, 200);
        console.log(res.body);
});

test('delete partnership', async t => {
        const body = {
                'leadcompetitorid':'',
                'followcompetitorid':'',
                'eventid':'',
                };
        const res = await http.postResponse('http://localhost:8080/api/delete_partnership', {body});
        t.is(res.statusCode, 200);
        console.log(res.body);
});

test('update current competition', async t => {
  const body = {
      'id': '',
      'name':'',
      'leadidstartnum':'',
      'locationname':'',
      'earlyprice':'',
      'regularprice':'',
      'lateprice':'',
      'startdate':'',
      'enddate':'',
      'regstartdate':'',
      'earlyregdeadline':'',
      'regularregdeadline':'',
      'lateregdeadline':'',
      'description':'',
  };

  const res = await http.postResponse('http://localhost:8080/api/competition/updateCompetitionInfo', {body});
        t.is(res.statusCode, 200);
        console.log(res.body);

});

test('update current competition round id', async t => {
  const body = {
    'cid':'',
    'rid':'',
  };

  const res = await http.postResponse('http://localhost:8080/api/competition/updateCompetitionCurrentRoundId', {body});
        t.is(res.statusCode, 200);
        console.log(res.body);

});

test('update a payment record', async t => {
  const body = {
    'competitionid':'',
    'competitorid':'',
    'amount':'',
    'online':'',
    'paidwithaffiliation':'',
  };

  const res = await http.postResponse('http://localhost:8080/api/payment_records/update/', {body});
        t.is(res.statusCode, 200);
        console.log(res.body);

});


test('generate rounds', async t => {
  const body = {
    'cid':'',
  };

  const res = await http.postResponse('http://localhost:8080/api/competition/generateRounds', {body});
        t.is(res.statusCode, 200);
        console.log(res.body);

});

// NEED BODY PARAMS 
test('update events', async t => {
  const body = {
    'cid':'',
  };

  const res = await http.postResponse('http://localhost:8080/api/competition/updateEvents', {body});
        t.is(res.statusCode, 200);
        console.log(res.body);

});


test('update levels and styles', async t => {
  const body = {
    'cid':'',
  };

  const res = await http.postResponse('http://localhost:8080/api/competition/updateLevelsStyles', {body});
        t.is(res.statusCode, 200);
        console.log(res.body);

});

test('update rounds', async t => {
  const body = {
    'cid':'',
  };

  const res = await http.postResponse('http://localhost:8080/api/competition/updateRounds', {body});
        t.is(res.statusCode, 200);
        console.log(res.body);

});

test('update competition info', async t => {
  const body = {
    'cid':'',
  };

  const res = await http.postResponse('http://localhost:8080/api/competition/updateCompetitionInfo', {body});
        t.is(res.statusCode, 200);
        console.log(res.body);

});


test('update competition by current round id', async t => {
  const body = {
    'cid':'',
  };

  const res = await http.postResponse('http://localhost:8080/api/competition/updateCompetitionCurrentRoundId', {body});
        t.is(res.statusCode, 200);
        console.log(res.body);

});




/* GET */



// test('get events for competition, level, and style', async t => {
//         const params = {
//                 cid:'1',
//                 level:'silver',
//                 lid:'1',
//                 style:'cha-cha',
//                 sid:'1',
//         };
//         const res = await http.getResponse('http://localhost:8080/api/competition', {params});
//         t.is(res.statusCode, 200);
//         console.log(res.body);
// });





















