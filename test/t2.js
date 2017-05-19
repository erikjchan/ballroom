import http from 'ava-http';
import test from 'ava';
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
      "/api/officials"
    ]
  });
});


/* ################################# GET ######################################## */


/********************************* Main APIS *********************************/
test.serial('api/competitions', async t => {
    t.plan(2);
    const res = await request(api())
    .get('/api/competitions/admin@admin.com')

    t.is(res.status,200);
    t.deepEqual(res.body, 
[{"id":1,"name":"Cornell DanceSport Classic","leadidstartnum":1,"locationname":"Ithaca, New York","earlyprice":"10.00","regularprice":"20.00","lateprice":"30.00","startdate":"2017-05-09T04:00:00.000Z","enddate":"2017-05-10T04:00:00.000Z","regstartdate":"2017-05-05T04:00:00.000Z","earlyregdeadline":"2017-05-07T04:00:00.000Z","regularregdeadline":"2017-05-08T04:00:00.000Z","lateregdeadline":"2017-05-09T04:00:00.000Z","compadmin":"admin@admin.com","currentroundid":1,"description":"description"}]
)});


test.serial('api/affiliations', async t => {
    t.plan(2);
    const res = await request(api())
    .get('/api/affiliations')

    t.is(res.status,200);
    t.deepEqual(res.body, 
    [{"id":1,"name":"Cornell Dance Team"},{"id":2,"name":"Harvard Dance Team"},{"id":3,"name":"MIT Dance Team"},{"id":4,"name":"Princeton Dance Team"}]
)});

test.serial('api/competitors', async t => {
    t.plan(2);
    const res = await request(api())
    .get('/api/competitors')

    t.is(res.status,200);
    t.deepEqual(res.body, 
[{"id":1,"firstname":"Luke","lastname":"Skywalker","email":"luke@skywalker.com","mailingaddress":"Tatooine","affiliationid":1,"hasregistered":true},{"id":2,"firstname":"Leia","lastname":"Organa","email":"leia@organa.com","mailingaddress":"Alderaan","affiliationid":1,"hasregistered":true},{"id":3,"firstname":"Rey","lastname":"who knows","email":"rey@rey.com","mailingaddress":"Jakku","affiliationid":1,"hasregistered":false},{"id":4,"firstname":"fname4","lastname":"lname4","email":"email4@email.com","mailingaddress":"mailingaddress4","affiliationid":2,"hasregistered":false},{"id":5,"firstname":"fname5","lastname":"lname5","email":"email5@email.com","mailingaddress":"mailingaddress5","affiliationid":2,"hasregistered":false},{"id":6,"firstname":"fname6","lastname":"lname7","email":"email6@email.com","mailingaddress":"mailingaddress6","affiliationid":3,"hasregistered":false},{"id":7,"firstname":"fname7","lastname":"lname7","email":"email7@email.com","mailingaddress":"mailingaddress7","affiliationid":4,"hasregistered":false},{"id":8,"firstname":"fname8","lastname":"lname8","email":"email8@email.com","mailingaddress":"mailingaddress8","affiliationid":4,"hasregistered":false},{"id":9,"firstname":"fname9","lastname":"lname9","email":"email9@email.com","mailingaddress":"mailingaddress9","affiliationid":4,"hasregistered":false},{"id":10,"firstname":"fname10","lastname":"lname10","email":"email10@email.com","mailingaddress":"mailingaddress10","affiliationid":4,"hasregistered":false},{"id":11,"firstname":"fname11","lastname":"lname11","email":"email11@email.com","mailingaddress":"mailingaddress11","affiliationid":4,"hasregistered":false},{"id":12,"firstname":"fname12","lastname":"lname12","email":"email12@email.com","mailingaddress":"mailingaddress12","affiliationid":4,"hasregistered":false},{"id":13,"firstname":"fname13","lastname":"lname13","email":"email13@email.com","mailingaddress":"mailingaddress13","affiliationid":4,"hasregistered":false},{"id":14,"firstname":"fname14","lastname":"lname14","email":"email14@email.com","mailingaddress":"mailingaddress14","affiliationid":4,"hasregistered":false},{"id":15,"firstname":"fname15","lastname":"lname15","email":"email15@email.com","mailingaddress":"mailingaddress15","affiliationid":4,"hasregistered":false},{"id":16,"firstname":"fname16","lastname":"lname16","email":"email16@email.com","mailingaddress":"mailingaddress16","affiliationid":4,"hasregistered":false},{"id":17,"firstname":"fname17","lastname":"lname17","email":"email17@email.com","mailingaddress":"mailingaddress17","affiliationid":4,"hasregistered":false},{"id":18,"firstname":"fname18","lastname":"lname18","email":"email18@email.com","mailingaddress":"mailingaddress18","affiliationid":4,"hasregistered":false},{"id":19,"firstname":"fname19","lastname":"lname19","email":"email19@email.com","mailingaddress":"mailingaddress19","affiliationid":4,"hasregistered":false},{"id":20,"firstname":"fname20","lastname":"lname20","email":"email20@email.com","mailingaddress":"mailingaddress20","affiliationid":4,"hasregistered":false},{"id":21,"firstname":"fname21","lastname":"lname21","email":"email21@email.com","mailingaddress":"mailingaddress21","affiliationid":4,"hasregistered":false},{"id":22,"firstname":"fname22","lastname":"lname22","email":"email22@email.com","mailingaddress":"mailingaddress22","affiliationid":4,"hasregistered":false},{"id":23,"firstname":"fname23","lastname":"lname23","email":"email23@email.com","mailingaddress":"mailingaddress23","affiliationid":4,"hasregistered":false},{"id":24,"firstname":"fname24","lastname":"lname24","email":"email24@email.com","mailingaddress":"mailingaddress24","affiliationid":4,"hasregistered":false},{"id":25,"firstname":"fname25","lastname":"lname25","email":"email25@email.com","mailingaddress":"mailingaddress25","affiliationid":4,"hasregistered":false},{"id":26,"firstname":"fname26","lastname":"lname26","email":"email26@email.com","mailingaddress":"mailingaddress26","affiliationid":4,"hasregistered":false},{"id":27,"firstname":"fname27","lastname":"lname27","email":"email27@email.com","mailingaddress":"mailingaddress27","affiliationid":4,"hasregistered":false},{"id":28,"firstname":"fname28","lastname":"lname28","email":"email28@email.com","mailingaddress":"mailingaddress28","affiliationid":4,"hasregistered":false},{"id":29,"firstname":"fname29","lastname":"lname29","email":"email29@email.com","mailingaddress":"mailingaddress29","affiliationid":4,"hasregistered":false},{"id":30,"firstname":"fname30","lastname":"lname30","email":"email30@email.com","mailingaddress":"mailingaddress30","affiliationid":4,"hasregistered":false},{"id":31,"firstname":"fname31","lastname":"lname31","email":"email31@email.com","mailingaddress":"mailingaddress31","affiliationid":4,"hasregistered":false},{"id":32,"firstname":"fname32","lastname":"lname32","email":"email32@email.com","mailingaddress":"mailingaddress32","affiliationid":4,"hasregistered":false},{"id":33,"firstname":"fname33","lastname":"lname33","email":"email33@email.com","mailingaddress":"mailingaddress33","affiliationid":4,"hasregistered":false},{"id":34,"firstname":"fname34","lastname":"lname34","email":"email34@email.com","mailingaddress":"mailingaddress34","affiliationid":4,"hasregistered":false},{"id":35,"firstname":"fname35","lastname":"lname35","email":"email35@email.com","mailingaddress":"mailingaddress35","affiliationid":4,"hasregistered":false},{"id":36,"firstname":"fname36","lastname":"lname36","email":"email36@email.com","mailingaddress":"mailingaddress36","affiliationid":4,"hasregistered":false},{"id":37,"firstname":"fname37","lastname":"lname37","email":"email37@email.com","mailingaddress":"mailingaddress37","affiliationid":4,"hasregistered":false},{"id":38,"firstname":"fname38","lastname":"lname38","email":"email38@email.com","mailingaddress":"mailingaddress38","affiliationid":4,"hasregistered":false},{"id":39,"firstname":"fname39","lastname":"lname39","email":"email39@email.com","mailingaddress":"mailingaddress39","affiliationid":4,"hasregistered":false},{"id":40,"firstname":"fname40","lastname":"lname40","email":"email40@email.com","mailingaddress":"mailingaddress40","affiliationid":4,"hasregistered":false},{"id":41,"firstname":"fname41","lastname":"lname41","email":"email41@email.com","mailingaddress":"mailingaddress41","affiliationid":4,"hasregistered":false},{"id":42,"firstname":"fname42","lastname":"lname42","email":"email42@email.com","mailingaddress":"mailingaddress42","affiliationid":4,"hasregistered":false},{"id":43,"firstname":"fname43","lastname":"lname43","email":"email43@email.com","mailingaddress":"mailingaddress43","affiliationid":4,"hasregistered":false},{"id":44,"firstname":"fname44","lastname":"lname44","email":"email44@email.com","mailingaddress":"mailingaddress44","affiliationid":4,"hasregistered":false},{"id":45,"firstname":"fname45","lastname":"lname45","email":"email45@email.com","mailingaddress":"mailingaddress45","affiliationid":4,"hasregistered":false},{"id":46,"firstname":"fname46","lastname":"lname46","email":"email46@email.com","mailingaddress":"mailingaddress46","affiliationid":4,"hasregistered":false},{"id":47,"firstname":"fname47","lastname":"lname47","email":"email47@email.com","mailingaddress":"mailingaddress47","affiliationid":4,"hasregistered":false},{"id":48,"firstname":"fname48","lastname":"lname48","email":"email48@email.com","mailingaddress":"mailingaddress48","affiliationid":4,"hasregistered":false},{"id":49,"firstname":"fname49","lastname":"lname49","email":"email49@email.com","mailingaddress":"mailingaddress49","affiliationid":4,"hasregistered":false},{"id":50,"firstname":"fname50","lastname":"lname50","email":"email50@email.com","mailingaddress":"mailingaddress50","affiliationid":4,"hasregistered":false}]    )});


test.serial('api/payment_records', async t => {
    t.plan(2);
    const res = await request(api())
    .get('/api/payment_records')

    t.is(res.status,200);
    t.deepEqual(res.body, 
    [{"id":2,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":1,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":3,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":2,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":4,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":3,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":5,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":4,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":6,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":5,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":7,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":6,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":8,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":7,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":9,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":8,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":10,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":9,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":11,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":10,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":12,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":11,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":13,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":12,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":14,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":13,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":15,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":14,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":16,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":15,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":17,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":16,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":18,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":17,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":19,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":18,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":20,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":19,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":21,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":20,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":22,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":21,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":23,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":22,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":24,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":23,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":25,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":24,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":26,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":25,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":27,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":26,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":28,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":27,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":29,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":28,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":30,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":29,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":31,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":30,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":32,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":31,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":33,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":32,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":34,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":33,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":35,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":34,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":36,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":35,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":37,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":36,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":38,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":37,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":39,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":38,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":40,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":39,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":41,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":40,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":42,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":41,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":43,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":42,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":44,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":43,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":45,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":44,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":46,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":45,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":47,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":46,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":48,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":47,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":49,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":48,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":50,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":49,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":51,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":50,"amount":"21.87","online":true,"paidwithaffiliation":true}]
    )});

/****************************** Competition APIs ***********************************/

test.serial('api/competition/1', async t => {
    t.plan(2);
    const res = await request(api())
    .get('/api/competition/1')

    t.is(res.status,200);
    t.deepEqual(res.body, 
{"id":1,"name":"Cornell DanceSport Classic","leadidstartnum":1,"locationname":"Ithaca, New York","earlyprice":"10.00","regularprice":"20.00","lateprice":"30.00","startdate":"2017-05-09T04:00:00.000Z","enddate":"2017-05-10T04:00:00.000Z","regstartdate":"2017-05-05T04:00:00.000Z","earlyregdeadline":"2017-05-07T04:00:00.000Z","regularregdeadline":"2017-05-08T04:00:00.000Z","lateregdeadline":"2017-05-09T04:00:00.000Z","compadmin":"admin@admin.com","currentroundid":1,"description":"description"}
    )});


test.serial('api/competition/1/affiliations', async t => {
    t.plan(2);
    const res = await request(api())
    .get('/api/competition/1/affiliations')

    t.is(res.status,200);
    t.deepEqual(res.body, 
    [{"affiliationname":"Cornell Dance Team"},{"affiliationname":"Harvard Dance Team"},{"affiliationname":"MIT Dance Team"},{"affiliationname":"Princeton Dance Team"}]
 )});

 test.serial('api/competition/1/competitors', async t => {
    t.plan(2);
    const res = await request(api())
    .get('/api/competition/1/competitors')

    t.is(res.status,200);
    t.deepEqual(res.body, 
    [{"id":1,"name":"Luke Skywalker","email":"luke@skywalker.com","number":1,"affiliationname":"Cornell Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":2,"name":"Leia Organa","email":"leia@organa.com","number":2,"affiliationname":"Cornell Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":3,"name":"Rey who knows","email":"rey@rey.com","number":null,"affiliationname":"Cornell Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":4,"name":"fname4 lname4","email":"email4@email.com","number":4,"affiliationname":"Harvard Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":5,"name":"fname5 lname5","email":"email5@email.com","number":null,"affiliationname":"Harvard Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":6,"name":"fname6 lname7","email":"email6@email.com","number":6,"affiliationname":"MIT Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":7,"name":"fname7 lname7","email":"email7@email.com","number":null,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":8,"name":"fname8 lname8","email":"email8@email.com","number":8,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":9,"name":"fname9 lname9","email":"email9@email.com","number":null,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":10,"name":"fname10 lname10","email":"email10@email.com","number":10,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":11,"name":"fname11 lname11","email":"email11@email.com","number":null,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":12,"name":"fname12 lname12","email":"email12@email.com","number":12,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":13,"name":"fname13 lname13","email":"email13@email.com","number":null,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":14,"name":"fname14 lname14","email":"email14@email.com","number":14,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":15,"name":"fname15 lname15","email":"email15@email.com","number":null,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":16,"name":"fname16 lname16","email":"email16@email.com","number":16,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":17,"name":"fname17 lname17","email":"email17@email.com","number":null,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":18,"name":"fname18 lname18","email":"email18@email.com","number":18,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":19,"name":"fname19 lname19","email":"email19@email.com","number":null,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":20,"name":"fname20 lname20","email":"email20@email.com","number":20,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":21,"name":"fname21 lname21","email":"email21@email.com","number":null,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":22,"name":"fname22 lname22","email":"email22@email.com","number":null,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":23,"name":"fname23 lname23","email":"email23@email.com","number":23,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":24,"name":"fname24 lname24","email":"email24@email.com","number":null,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":25,"name":"fname25 lname25","email":"email25@email.com","number":25,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":26,"name":"fname26 lname26","email":"email26@email.com","number":null,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":27,"name":"fname27 lname27","email":"email27@email.com","number":27,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":28,"name":"fname28 lname28","email":"email28@email.com","number":null,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":29,"name":"fname29 lname29","email":"email29@email.com","number":29,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":30,"name":"fname30 lname30","email":"email30@email.com","number":null,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":31,"name":"fname31 lname31","email":"email31@email.com","number":31,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":32,"name":"fname32 lname32","email":"email32@email.com","number":null,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":33,"name":"fname33 lname33","email":"email33@email.com","number":33,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":34,"name":"fname34 lname34","email":"email34@email.com","number":null,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":35,"name":"fname35 lname35","email":"email35@email.com","number":35,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":36,"name":"fname36 lname36","email":"email36@email.com","number":null,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":37,"name":"fname37 lname37","email":"email37@email.com","number":37,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":38,"name":"fname38 lname38","email":"email38@email.com","number":null,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":39,"name":"fname39 lname39","email":"email39@email.com","number":39,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":40,"name":"fname40 lname40","email":"email40@email.com","number":null,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":41,"name":"fname41 lname41","email":"email41@email.com","number":41,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":42,"name":"fname42 lname42","email":"email42@email.com","number":null,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":43,"name":"fname43 lname43","email":"email43@email.com","number":43,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":44,"name":"fname44 lname44","email":"email44@email.com","number":null,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":45,"name":"fname45 lname45","email":"email45@email.com","number":45,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":46,"name":"fname46 lname46","email":"email46@email.com","number":null,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":47,"name":"fname47 lname47","email":"email47@email.com","number":47,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":48,"name":"fname48 lname48","email":"email48@email.com","number":null,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":49,"name":"fname49 lname49","email":"email49@email.com","number":49,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"},{"id":50,"name":"fname50 lname50","email":"email50@email.com","number":null,"affiliationname":"Princeton Dance Team","paidwithaffiliation":true,"amount":"21.87"}]
 )});

  test.serial('api/competition/1/competitors_styles', async t => {
    t.plan(2);
    const res = await request(api())
    .get('/api/competition/1/competitors_styles')

    t.is(res.status,200);
    t.deepEqual(res.body, 
    [{"count":"50","sname":"Latin"},{"count":"20","sname":"Smooth"}]
 )});

test.serial('api/competition/1/events', async t => {
    t.plan(2);
    const res = await request(api())
    .get('/api/competition/1/events')

    t.is(res.status,200);
    t.deepEqual(res.body, 
    [{"id":1,"stylename":"Latin","levelname":"Bronze","dance":"Waltz","ordernumber":1},{"id":2,"stylename":"Smooth","levelname":"Bronze","dance":"Waltz","ordernumber":2},{"id":3,"stylename":"Latin","levelname":"Silver","dance":"Tango","ordernumber":3},{"id":4,"stylename":"Smooth","levelname":"Silver","dance":"Tango","ordernumber":4},{"id":5,"stylename":"Latin","levelname":"Gold","dance":"Cha Cha","ordernumber":5},{"id":6,"stylename":"Smooth","levelname":"Gold","dance":"Cha Cha","ordernumber":6},{"id":7,"stylename":"Latin","levelname":"Bronze","dance":"Tango","ordernumber":7},{"id":13,"stylename":"Latin","levelname":"Bronze","dance":"Cha Cha","ordernumber":7},{"id":14,"stylename":"Smooth","levelname":"Bronze","dance":"Cha Cha","ordernumber":8},{"id":8,"stylename":"Smooth","levelname":"Bronze","dance":"Tango","ordernumber":8},{"id":9,"stylename":"Latin","levelname":"Silver","dance":"Cha Cha","ordernumber":9},{"id":15,"stylename":"Latin","levelname":"Silver","dance":"Waltz","ordernumber":9},{"id":16,"stylename":"Smooth","levelname":"Silver","dance":"Waltz","ordernumber":10},{"id":10,"stylename":"Smooth","levelname":"Silver","dance":"Cha Cha","ordernumber":10},{"id":11,"stylename":"Latin","levelname":"Gold","dance":"Waltz","ordernumber":11},{"id":17,"stylename":"Latin","levelname":"Gold","dance":"Tango","ordernumber":11},{"id":12,"stylename":"Smooth","levelname":"Gold","dance":"Waltz","ordernumber":12},{"id":18,"stylename":"Smooth","levelname":"Gold","dance":"Tango","ordernumber":12}]
 )});

test.serial('api/competition/1/officials', async t => {
    t.plan(2);
    const res = await request(api())
    .get('/api/competition/1/officials')

    t.is(res.status,200);
    t.deepEqual(res.body, 
    [{"id":1,"token":"officialtoken","firstname":"Len","lastname":"Goodman","roleid":1,"competitionid":1,"rolename":"Adjudicator"},{"id":2,"token":"officialtoken","firstname":"Bruno","lastname":"Tonioli","roleid":1,"competitionid":1,"rolename":"Adjudicator"},{"id":3,"token":"officialtoken","firstname":"Carrie Ann","lastname":"Inaba","roleid":1,"competitionid":1,"rolename":"Adjudicator"},{"id":4,"token":"officialtoken","firstname":"Julianne","lastname":"Hough","roleid":1,"competitionid":1,"rolename":"Adjudicator"},{"id":5,"token":"officialtoken","firstname":"Tom","lastname":"Bergeron","roleid":1,"competitionid":1,"rolename":"Adjudicator"},{"id":6,"token":"officialtoken","firstname":"Erin","lastname":"Andrews","roleid":1,"competitionid":1,"rolename":"Adjudicator"}]
 )});

 test.serial('api/competition/1/judges', async t => {
    t.plan(2);
    const res = await request(api())
    .get('/api/competition/1/judges')

    t.is(res.status,200);
    t.deepEqual(res.body, 
[{"id":1,"token":"officialtoken","firstname":"Len","lastname":"Goodman","roleid":1,"competitionid":1},{"id":2,"token":"officialtoken","firstname":"Bruno","lastname":"Tonioli","roleid":1,"competitionid":1},{"id":3,"token":"officialtoken","firstname":"Carrie Ann","lastname":"Inaba","roleid":1,"competitionid":1},{"id":4,"token":"officialtoken","firstname":"Julianne","lastname":"Hough","roleid":1,"competitionid":1},{"id":5,"token":"officialtoken","firstname":"Tom","lastname":"Bergeron","roleid":1,"competitionid":1},{"id":6,"token":"officialtoken","firstname":"Erin","lastname":"Andrews","roleid":1,"competitionid":1}]
 )});

  test.serial('api/competition/1/levels', async t => {
    t.plan(2);
    const res = await request(api())
    .get('/api/competition/1/levels')

    t.is(res.status,200);
    t.deepEqual(res.body, 
    [{"id":1,"name":"Bronze","ordernumber":1},{"id":2,"name":"Silver","ordernumber":2},{"id":3,"name":"Gold","ordernumber":3}]
)});

test.serial('api/competition/1/level/1/styles', async t => {
    t.plan(2);
    const res = await request(api())
    .get('/api/competition/1/level/1/styles')

    t.is(res.status,200);
    t.deepEqual(res.body, 
    [{"id":1,"name":"Latin","ordernumber":1},{"id":2,"name":"Smooth","ordernumber":2}]
)});

test.serial('api/competition/1/level/1/style/1', async t => {
    t.plan(2);
    const res = await request(api())
    .get('/api/competition/1/level/1/style/1')

    t.is(res.status,200);
    t.deepEqual(res.body, 
    [{"id":1,"dance":"Waltz","stylename":"Latin","levelname":"Bronze","ordernumber":1},{"id":7,"dance":"Tango","stylename":"Latin","levelname":"Bronze","ordernumber":7},{"id":13,"dance":"Cha Cha","stylename":"Latin","levelname":"Bronze","ordernumber":7}]
)});

test.serial('api/competition/1/level/1/rounds', async t => {
    t.plan(2);
    const res = await request(api())
    .get('/api/competition/1/rounds')

    t.is(res.status,200);
    t.deepEqual(res.body, 
    []
)});

test.serial('api/competition/1/level/1/styles', async t => {
    t.plan(2);
    const res = await request(api())
    .get('/api/competition/1/styles')

    t.is(res.status,200);
    t.deepEqual(res.body, 
    [{"id":1,"name":"Latin","ordernumber":1},{"id":2,"name":"Smooth","ordernumber":2},{"id":3,"name":"Rough","ordernumber":3}]
)});


/**************************** Competitors APIs *******************************/

test.serial('api/competitors/1', async t => {
    t.plan(2);
    const res = await request(api())
    .get('/api/competitors/1')

    t.is(res.status,200);
    t.deepEqual(res.body, 
    {"id":1,"firstname":"Luke","lastname":"Skywalker","email":"luke@skywalker.com","mailingaddress":"Tatooine","affiliationid":1,"hasregistered":true,"affiliationname":"Cornell Dance Team","number":1}
)});

test.serial('api/competitors/round/1', async t => {
    t.plan(2);
    const res = await request(api())
    .get('/api/competitors/round/1')

    t.is(res.status,200);
    t.deepEqual(res.body, 
    []
)});

test.serial('api/competitors/1/1/events', async t => {
    t.plan(2);
    const res = await request(api())
    .get('/api/competitors/1/1/events')

    t.is(res.status,200);
    t.deepEqual(res.body, 
    [{"leadcompetitorid":1,"followcompetitorid":2,"eventid":1,"leadconfirmed":true,"followconfirmed":true,"competitionid":1,"number":1,"calledback":true,"timestamp":"2017-05-10T04:00:00.000Z","dance":"Waltz","style":"Latin","level":"Bronze","leadfirstname":"Luke","leadlastname":"Skywalker","followfirstname":"Leia","followlastname":"Organa"}]
)});

/************************************* Event APIs*****************************************/

test.serial('api/event/rounds/1', async t => {
    t.plan(2);
    const res = await request(api())
    .get('/api/event/rounds/1')

    t.is(res.status,200);
    t.deepEqual(res.body, 
    []
)});

/************************************ Payment Records APIs******************************************/

test.serial('api/payment_records/competition/1', async t => {
    t.plan(2);
    const res = await request(api())
    .get('/api/payment_records/competition/1')

    t.is(res.status,200);
    t.deepEqual(res.body, 
    [{"id":2,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":1,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":3,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":2,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":4,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":3,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":5,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":4,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":6,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":5,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":7,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":6,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":8,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":7,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":9,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":8,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":10,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":9,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":11,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":10,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":12,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":11,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":13,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":12,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":14,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":13,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":15,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":14,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":16,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":15,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":17,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":16,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":18,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":17,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":19,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":18,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":20,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":19,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":21,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":20,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":22,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":21,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":23,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":22,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":24,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":23,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":25,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":24,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":26,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":25,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":27,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":26,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":28,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":27,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":29,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":28,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":30,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":29,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":31,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":30,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":32,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":31,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":33,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":32,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":34,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":33,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":35,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":34,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":36,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":35,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":37,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":36,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":38,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":37,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":39,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":38,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":40,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":39,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":41,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":40,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":42,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":41,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":43,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":42,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":44,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":43,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":45,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":44,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":46,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":45,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":47,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":46,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":48,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":47,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":49,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":48,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":50,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":49,"amount":"21.87","online":true,"paidwithaffiliation":true},{"id":51,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":50,"amount":"21.87","online":true,"paidwithaffiliation":true}]
)});


test.serial('api/payment_records/competitor/1', async t => {
    t.plan(2);
    const res = await request(api())
    .get('/api/payment_records/competitor/1')

    t.is(res.status,200);
    t.deepEqual(res.body, 
    [{"id":2,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":1,"amount":"21.87","online":true,"paidwithaffiliation":true}]
)});

test.serial('api/payment_records/1/1', async t => {
    t.plan(2);
    const res = await request(api())
    .get('/api/payment_records/1/1')

    t.is(res.status,200);
    t.deepEqual(res.body, 
    {"id":2,"competitionid":1,"timestamp":"2017-05-10T04:00:00.000Z","competitorid":1,"amount":"21.87","online":true,"paidwithaffiliation":true}
)});

/************************************ Other APIs******************************************/

test.serial('api/affiliations/1', async t => {
    t.plan(2);
    const res = await request(api())
    .get('/api/affiliations/1')

    t.is(res.status,200);
    t.deepEqual(res.body, 
    {"id":1,"name":"Cornell Dance Team"}
)});

test.serial('api/roles', async t => {
    t.plan(2);
    const res = await request(api())
    .get('/api/roles')

    t.is(res.status,200);
    t.deepEqual(res.body, 
    [{"id":1,"name":"Adjudicator"},{"id":2,"name":"Master of Ceremonies"},{"id":3,"name":"Scrutineer"},{"id":4,"name":"Music Director"}]
)});

test.serial('api/judges/round/1', async t => {
    t.plan(2);
    const res = await request(api())
    .get('/api/judges/round/1')

    t.is(res.status,200);
    t.deepEqual(res.body, 
    []
)});

/* ################################# POST ######################################## */

/****************************** Callback APIs **************************************/
test.serial('api/callbacks/update', async t => {
  t.plan(1);

  const body = {
    'rid':1,
    'jid':1,
    'cid':1,
    'callbacks': [1,2,3]
  };

  const res = await http.postResponse('http://localhost:8080/api/callbacks/update', {body});
  t.is(res.statusCode, 200);
  console.log(res.body);

});

test.serial('generate rounds', async t => {
  const body = {
    'cid':1,
  };

  const res = await http.postResponse('http://localhost:8080/api/competition/generateRounds', {body});
        t.is(res.statusCode, 200);
        console.log(res.body);

});

test.serial('api/callbacks/calculate', async t => {
  t.plan(1);

  const body = {
      'rid':1,
      'eventid':1,
      'size':3
  };

  const res = await http.postResponse('http://localhost:8080/api/callbacks/calculate', {body});
  t.is(res.statusCode, 200);
  console.log(res.body);

});

/* test.serial: create official */
test.serial('/api/create_official', async t => {
  t.plan(1);

  const body = {
    'token': '',
    'firstname':'angie',
    'lastname': 'pinilla',
    'roleid': 1,
    'competitionid':1
  };

  const res = await http.postResponse('http://localhost:8080/api/create_official', {body});
  t.is(res.statusCode, 200);
  console.log(res.body);

});

test.serial('/api/delete_official', async t => {
  const body = {
    'id': 1,
  };
  const res = await http.postResponse('http://localhost:8080/api/delete_official', {body});
  t.is(res.statusCode, 200);
  console.log(res.body);

});

test.serial('/api/clear_organization_owed', async t => {
  const body = {
          'competitionid': 1,
          'affiliationid': 1,
          };
        const res = await http.postResponse('http://localhost:8080/api/clear_organization_owed', {body});
        t.is(res.statusCode, 200);
        console.log(res.body);
});

test.serial('api/create_paymentrecord', async t => {
        const body = {
                'competitionid':1,
                'competitorid':1,
                'amount':1,
                'online': false,
                'paidwithaffiliation':false,
                };
        const res = await http.postResponse('http://localhost:8080/api/create_paymentrecord', {body});
        t.is(res.statusCode, 200);
        console.log(res.body);
});

test.serial('create partnership', async t => {
        const body = {
                'leadcompetitorid':1,
                'followcompetitorid':1,
                'eventid':1,
                'competitionid':1,
                };
        const res = await http.postResponse('http://localhost:8080/api/create_partnership', {body});
        t.is(res.statusCode, 200);
        console.log(res.body);
});

test.serial('delete partnership', async t => {
        const body = {
                'leadcompetitorid':1,
                'followcompetitorid':1,
                'eventid':1,
                };
        const res = await http.postResponse('http://localhost:8080/api/delete_partnership', {body});
        t.is(res.statusCode, 200);
        console.log(res.body);
});


test.serial('update a payment record', async t => {
  const body = {
    'competitionid':1,
    'competitorid':1,
    'amount':1,
    'online':true,
    'paidwithaffiliation':true,
  };

  const res = await http.postResponse('http://localhost:8080/api/payment_records/update/', {body});
        t.is(res.statusCode, 200);
        console.log(res.body);

});

test.serial('update events', async t => {
  const body = {
    'id':1,
    'rows':[{'styleid':1,
             'stylename':'',
             'levelid':1,
             'levelname':'',
             'dance':'',
             'ordernumber':1
    }]
   };

  const res = await http.postResponse('http://localhost:8080/api/competition/updateEvents', {body});
        t.is(res.statusCode, 200);
        console.log(res.body);

});


test.serial('update levels and styles', async t => {
  const body = {
    'cid':1,
    'levels':[{'id':1,
    'name':'',
    'ordernumber':1
    }],
    'styles':[{'id':1,
    'name':'',
    'ordernumber':1
  }]
  };

  const res = await http.postResponse('http://localhost:8080/api/competition/updateLevelsStyles', {body});
        t.is(res.statusCode, 200);
        console.log(res.body);

});

test.serial('update rounds', async t => {
  const body = {
    'cid':1,
    'rows': [{ 'levelid':1,
              'levelname':'',
              'styleid':1,
              'stylename':'',
              'dance':'',
              'eventid':1,
              'name':'',
              'ordernumber':1,
              'size':3,
              'callbackscalculated':true
            }]
  };

  const res = await http.postResponse('http://localhost:8080/api/competition/updateRounds', {body});
        t.is(res.statusCode, 200);
        console.log(res.body);

});

test.serial('update competition info', async t => {
  const body = {
    'id':1,
    'name':'test',
    'leadidstartnum':1,
    'locationname':'place',
    'earlyprice':20,
    'regularprice':30,
    'lateprice':40,
    'startdate': '2017-05-09 00:00:00',
    'enddate': '2017-05-09 00:00:00',
    'regstartdate': '2017-05-09 00:00:00',
    'earlyregdeadline': '2017-05-09 00:00:00',
    'regularregdeadline': '2017-05-09 00:00:00',
    'lateregdeadline': '2017-05-09 00:00:00',
    'description':'alpha'
  };

  const res = await http.postResponse('http://localhost:8080/api/competition/updateCompetitionInfo', {body});
        t.is(res.statusCode, 200);
        console.log(res.body);

});

test.serial('update competition by current round id', async t => {
  const body = {
    'cid':1,
    'rid':1,
  };

  const res = await http.postResponse('http://localhost:8080/api/competition/updateCompetitionCurrentRoundId', {body});
        t.is(res.statusCode, 200);
        console.log(res.body);

});


test.serial('add new competition', async t => {
  const body = {
    'name': '', 
    'leadidstartnum': 10, 
    'locationname': '', 
    'earlyprice': 10, 
    'regularprice': 20, 
    'lateprice': 30, 
    'startdate': '2017-05-09 00:00:00' , 
    'enddate': '2017-05-09 00:00:00',
    'regstartdate': '2017-05-09 00:00:00', 
    'earlyregdeadline': '2017-05-09 00:00:00', 
    'regularregdeadline': '2017-05-09 00:00:00', 
    'lateregdeadline': '2017-05-09 00:00:00', 
    'description': ' ' 
  };

  const res = await http.postResponse('http://localhost:8080/api/create_competition', {body});
        t.is(res.statusCode, 200);
        console.log(res.body);

});

test.serial('add new competitor', async t => {
  const body = {
    'profile': ' ', 
    'firstname': ' ', 
    'lastname': ' ', 
    'email': ' ', 
    'mailingaddress': ' ', 
    'affiliationname': ' '
  };

  const res = await http.postResponse('http://localhost:8080/api/create_user', {body});
        t.is(res.statusCode, 200);
        console.log(res.body);

});
