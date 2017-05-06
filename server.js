import express from 'express';
const app = express();
const data = require('./api/data')
const ip = require('ip');
const path = require('path')
const jwt = require('express-jwt');
const ManagementClient = require('auth0').ManagementClient;
const AuthenticationClient = require('auth0').AuthenticationClient;

/******************************* AUTHORIZATION *******************************/

var auth0 = new AuthenticationClient({
  domain: 'mrkev.auth0.com',
  clientId: 'Dl30IRGbXkkPlENLT4nR9QIWLHiMAxxF'
});

const management = new ManagementClient({
  token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlEwUkVSRGN4TXpnM1JqaEJPRVUwUVRSR01FVXlRalZFUVRZd1FqSkZOekUyUWpCRk1UTXpOZyJ9.eyJpc3MiOiJodHRwczovL21ya2V2LmF1dGgwLmNvbS8iLCJzdWIiOiJvSVVDaVlISlI1NVgwOTJ0Q2pQcm13ZjFadDRoeWI5bEBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9tcmtldi5hdXRoMC5jb20vYXBpL3YyLyIsImV4cCI6MTQ5NDExNzM3MCwiaWF0IjoxNDk0MDMwOTcwLCJzY29wZSI6InJlYWQ6Y2xpZW50X2dyYW50cyBjcmVhdGU6Y2xpZW50X2dyYW50cyBkZWxldGU6Y2xpZW50X2dyYW50cyB1cGRhdGU6Y2xpZW50X2dyYW50cyByZWFkOnVzZXJzIHVwZGF0ZTp1c2VycyBkZWxldGU6dXNlcnMgY3JlYXRlOnVzZXJzIHJlYWQ6dXNlcnNfYXBwX21ldGFkYXRhIHVwZGF0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgZGVsZXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBjcmVhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGNyZWF0ZTp1c2VyX3RpY2tldHMgcmVhZDpjbGllbnRzIHVwZGF0ZTpjbGllbnRzIGRlbGV0ZTpjbGllbnRzIGNyZWF0ZTpjbGllbnRzIHJlYWQ6Y2xpZW50X2tleXMgdXBkYXRlOmNsaWVudF9rZXlzIGRlbGV0ZTpjbGllbnRfa2V5cyBjcmVhdGU6Y2xpZW50X2tleXMgcmVhZDpjb25uZWN0aW9ucyB1cGRhdGU6Y29ubmVjdGlvbnMgZGVsZXRlOmNvbm5lY3Rpb25zIGNyZWF0ZTpjb25uZWN0aW9ucyByZWFkOnJlc291cmNlX3NlcnZlcnMgdXBkYXRlOnJlc291cmNlX3NlcnZlcnMgZGVsZXRlOnJlc291cmNlX3NlcnZlcnMgY3JlYXRlOnJlc291cmNlX3NlcnZlcnMgcmVhZDpkZXZpY2VfY3JlZGVudGlhbHMgdXBkYXRlOmRldmljZV9jcmVkZW50aWFscyBkZWxldGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGNyZWF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgcmVhZDpydWxlcyB1cGRhdGU6cnVsZXMgZGVsZXRlOnJ1bGVzIGNyZWF0ZTpydWxlcyByZWFkOmVtYWlsX3Byb3ZpZGVyIHVwZGF0ZTplbWFpbF9wcm92aWRlciBkZWxldGU6ZW1haWxfcHJvdmlkZXIgY3JlYXRlOmVtYWlsX3Byb3ZpZGVyIGJsYWNrbGlzdDp0b2tlbnMgcmVhZDpzdGF0cyByZWFkOnRlbmFudF9zZXR0aW5ncyB1cGRhdGU6dGVuYW50X3NldHRpbmdzIHJlYWQ6bG9ncyByZWFkOnNoaWVsZHMgY3JlYXRlOnNoaWVsZHMgZGVsZXRlOnNoaWVsZHMgdXBkYXRlOnRyaWdnZXJzIHJlYWQ6dHJpZ2dlcnMgcmVhZDpncmFudHMgZGVsZXRlOmdyYW50cyByZWFkOmd1YXJkaWFuX2ZhY3RvcnMgdXBkYXRlOmd1YXJkaWFuX2ZhY3RvcnMgcmVhZDpndWFyZGlhbl9lbnJvbGxtZW50cyBkZWxldGU6Z3VhcmRpYW5fZW5yb2xsbWVudHMgY3JlYXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRfdGlja2V0cyByZWFkOnVzZXJfaWRwX3Rva2VucyJ9.S-iAYB4L3KxNLfqYW41e5e0soj0s-dUHZ2reQ37tplsRGpPt_RZEz3w4-yhB1XQCDYnVwJC5BIuv3wgstQLHDwH_-EH34GF044dW6Q5RcDzZ2ixO9TaT_YMzd5NoBF4VATAM9MYTFHIIhGnBqBEWImNjR2ZEO5rgR1uE4WeftvKgkRyAO_Z0nJqOf7KaG3wSwHYCWbkhnFTu3vc2BxonhTcscx8cGyQlhkfea_6lt05L8JHfk02jWCZ5_BCJ3CHnPjDibCcDgO_1-yg5NnZw3w-McWHZEP-ssvCAiofu8QLdhFXNTHNeq6HIhvH8pvhd7xShncOwX3hEdE2PO-mvrQ',
  domain: 'mrkev.auth0.com'
})

const jwtCheck = jwt({
  secret: 'W8p06kShQyGZjHXWfv56C1hQDuzYsPf6OucdEq36JHd9pPYtkUcYnss_bLachbyW',
  audience: 'Dl30IRGbXkkPlENLT4nR9QIWLHiMAxxF'
})

// first check jwt, then fetch role straight from auth0
app.use('/api/protected', jwtCheck, function (req, res, next) {

  console.log(req.query.access_token)
  auth0.users.getInfo(req.query.access_token).then(json => {
  const profile = JSON.parse(json) 
    console.log('ay', profile)
    if (profile.roles.admin) next()
    else return res.sendStatus(401)
  }).catch(err => {res.sendStatus(400); console.error(err)})
});

app.get('/api/protected/random-quote', function(req, res) {
  res.status(200).send(quoter.getRandomOne());
});

app.use('/api/protected', authorizationCheck);

app.get('/api/protected/random-quote', function(req, res) {
  res.status(200).send("quoter.getRandomOne()");
});

// TODO: Acutally protect the quotes. Expects access_token=xxxx in query string.

/********************************* DATA PATHS *********************************/

app.post('*', (req, res) => {
  res.send({status: 'posted'})
})

app.get('/api/competition/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const comps = data.competitions.filter(c => c.id === id)
  res.send(comps[0])
})

app.get('/api/competition/:cid/events', (req, res) => {
  const cid = parseInt(req.params.cid)
  const events = data.events.filter(e => e.competition_id === cid)
  res.send(events)
})

app.get('/api/competition/:cid/rounds', (req, res) => {
  res.send(data.rounds)
})

app.get('/api/competitors', (req, res) => {
  res.send(data.competitors)
})

app.get('/api/competitors/competition/:id2', (req, res) => {
  const id1 = parseInt(req.params.id1)
  const id2 = parseInt(req.params.id2)
  res.send(data.competitor_competition_information)
})

app.get('/api/competitors/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const comps = data.competitors.filter(c => c.id === id)
  res.send(comps[0])
})

app.get('/api/competitors/:id1/competition/:id2', (req, res) => {
  const id1 = parseInt(req.params.id1)
  const id2 = parseInt(req.params.id2)
  res.send(data.competitor_competition_information[id1])
})

app.get('/api/competitors/:id/events', (req, res) => {
  res.send(data.competitor_events)
})

app.get('/api/competitions', (req, res) => {
  res.send(data.competitions)
})

app.get('/api/admin/:id/competitions', (req, res) => {
    res.send(data.competitions)
})

app.get('/api/events', (req, res) => {
  res.send(data.events)
})

app.get('/api/event/:eid/', (req, res) => {
  const eid =  parseInt(req.params.eid)
  const events = data.events.filter(e => e.id === eid)
  res.send(events[0])
})

app.get('/api/event/:rid/rounds', (req, res) => {
  const rid = parseInt(req.params.rid)
  const rounds = data.rounds.filter(e => e.id === rid)
  res.send(rounds)
})

app.get('/api/rounds', (req, res) => {
  res.send(data.rounds)
})

app.get('/api/schedule', (req, res) => {
  res.send(data.schedule)
})

app.get('/api/partnerships', (req, res) => {
  res.send(data.partnerships)
})

app.get('/api/organizations', (req, res) => {
  res.send(data.organizations)
})

app.get('/api/payment_records', (req, res) => {
  res.send(data.payment_records)
})

app.get('/api/callbacks', (req, res) => {
  res.send(data.callbacks)
})

app.get('/api/admins', (req, res) => {
  res.send(data.admins)
})

app.get('/api/judges', (req, res) => {
  res.send(data.judges)
})

app.get('/api/', (req, res) => {
  res.send({routes: [
    '/api/competitors',
    '/api/competitions',
    '/api/events',
    '/api/rounds',
    '/api/partnerships',
    '/api/organizations',
    '/api/payment_records',
    '/api/callbacks',
    '/api/admins',
    '/api/judges',
  ]})
})

const routes = [
  "/",
    '/competition/:competition_id/eventregistration'             ,
    '/competition/:competition_id/:competitor_id'                ,
    '/competitions'                                              ,
    '/editprofile'                                               ,
    '/competition/:competition_id/run'                           ,
    '/competition/:competition_id/round/:round_id/entercallbacks',
    '/competition/:competition_id/editschedule'                  ,
    '/competition/:competition_id/editlevelsandstyles'           ,
    '/competition/:competition_id/editevents'                    ,
    '/competition/:competition_id/competitorslist'               ,
    '/admin/competition/:competition_id'                         ,
    '/editcompetition/:competition_id'                           ,
    '/editofficial/:competition_id'                              ,
    '/competition/:competition_id/seecompetitor/:competitor_id'  ,
    '/competition/:competition_id/regcompetitor/:competitor_id'  ,
    '/affiliationpayment/:competition_id/:affiliation_id'        
]

/*********************************** Assets ***********************************/

app.get('/app.js', (req, res) => {
  if (process.env.PRODUCTION) {
    res.sendFile(__dirname + '/build/app.js');
  } else {
    res.redirect('//' + ip.address() + ':9090/build/app.js');
  }
});

app.get('/style.css', (req, res) => {
  if (process.env.PRODUCTION) {
    res.sendFile(__dirname + '/build/style.css');
  } else {
    res.redirect('//' + ip.address() + ':9090/build/style.css');
  }
});

// Serve index page
app.get(routes, (req, res) => {
  res.sendFile(__dirname + '/build/index.html');
});


/*************** **************************/



/*************************************************************
 *
 * Webpack Dev Server
 *
 * See: http://webpack.github.io/docs/webpack-dev-server.html
 *
 *************************************************************/

if (!process.env.PRODUCTION) {
  const webpack = require('webpack');
  const WebpackDevServer = require('webpack-dev-server');
  const config = require('./webpack.local.config');

  new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    noInfo: true,
    historyApiFallback: true
  }).listen(9090, ip.address(), (err, result) => {
    if (err) {
      console.log(err);
    }
  });
}


/******************
 *
 * Express server
 *
 *****************/

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Essential React listening at http://%s:%s', host, port);
});
