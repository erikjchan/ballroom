import express from 'express';
const app = express();
const data          = require('./api/data')


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
    res.redirect('//localhost:9090/build/app.js');
  }
});

// Serve aggregate stylesheet depending on environment
app.get('/style.css', (req, res) => {
  if (process.env.PRODUCTION) {
    res.sendFile(__dirname + '/build/style.css');
  } else {
    res.redirect('//localhost:9090/build/style.css');
  }
});


const path          = require('path')

/********************************* DATA PATHS *********************************/

app.post('*', (req, res) => {
  res.send({status: 'posted'})
})

app.get('/api/competition/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const comps = data.competitions.filter(c => c.id === id)
  res.send(comps[0])
})

app.get('/api/competitors', (req, res) => {
  res.send(data.competitors)
})

app.get('/api/competitors/:id/events', (req, res) => {
  res.send(data.events)
})

app.get('/api/competitions', (req, res) => {
  res.send(data.competitions)
})

app.get('/api/events', (req, res) => {
  res.send(data.events)
})

app.get('/api/rounds', (req, res) => {
  res.send(data.rounds)
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
    '/api/judges'
  ]})
})

const routes = [
  "/",
  "/home",
  "/competition/:competition_id/eventregistration",
  "/competition/:competition_id/editschedule",
  "/competition/:competition_id/run",
  "/competition/:competition_id",
  "/competitions",
  "/admin/competition/:competition_id",
]

// Serve index page
app.get(routes, (req, res) => {
  res.sendFile(__dirname + '/build/index.html');
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
  }).listen(9090, 'localhost', (err, result) => {
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
