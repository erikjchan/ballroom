import express from 'express';
const app = express();
const data          = require('./api/data')
const ip = require('ip');
const query          = require('./query')


/************************************************************
 *
 * Express routes for:
 *   - app.js
 *   - style.css
 *   - index.html
 *
 ************************************************************/

// Serve application file depending on environment
app.get('/app.js', (req, res) => {
  if (process.env.PRODUCTION) {
    res.sendFile(__dirname + '/build/app.js');
  } else {
    res.redirect('//' + ip.address() + ':9090/build/app.js');
  }
});

// Serve aggregate stylesheet depending on environment
app.get('/style.css', (req, res) => {
  if (process.env.PRODUCTION) {
    res.sendFile(__dirname + '/build/style.css');
  } else {
    res.redirect('//' + ip.address() + ':9090/build/style.css');
  }
});


const path = require('path')

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

app.get('/api/affiliations', (req, res) => {
    query.get_affiliations().then(function (value) {
        console.log(value);
        res.send(value);
    });
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
  query.get_all_admins().then(function (value) {
      console.log(value);
      res.send(value);
  });
})

app.get('/api/judges/:jid', (req, res) => {
    query.get_judge(req.params.jid).then(function (value) {
        console.log(value);
        res.send(value);
    });
})

app.get('/api/competition/:cid/judges', (req, res) => {
  query.get_judges_by_competition(req.params.cid).then(function (value) {
      console.log(value);
      res.send(value);
  });
})

app.get('/api/', (req, res) => {
  res.send({routes: [
    '/api/affiliations',
    '/api/competitors',
    '/api/competitions',
    '/api/events',
    '/api/rounds',
    '/api/partnerships',
    '/api/organizations',
    '/api/payment_records',
    '/api/callbacks',
    '/api/admins',
    '/api/judges'
  ]})
})

const routes = [
  "/",
  "/home",
  "/competition/:competition_id/",
  "/competition/:competition_id/eventregistration",
  "/competition/:competition_id/editschedule",
  "/competition/:competition_id/run",
  "/competition/:competition_id/:competitor_id",
  "/competitions",
  "/admin/competition/:competition_id",
  '/editprofile',
  '/editcompetition/:competition_id',
  '/editofficial/:competition_id'
]

// Serve index page
app.get(routes, (req, res) => {
  res.sendFile(__dirname + '/build/index.html');
});


/*************** **************************/

var jwt = require('express-jwt');

app.use('/api/protected', function (req, res, next) {
  console.log(req)
  next()
});

app.use('/api/protected', jwt({
  secret: 'W8p06kShQyGZjHXWfv56C1hQDuzYsPf6OucdEq36JHd9pPYtkUcYnss_bLachbyW',
  audience: 'Dl30IRGbXkkPlENLT4nR9QIWLHiMAxxF'
}));

app.get('/api/protected/random-quote', function(req, res) {
  res.status(200).send("quoter.getRandomOne()");
});


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
