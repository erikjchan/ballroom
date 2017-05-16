import express from 'express';
const app = express();
const ip = require('ip');
const bodyParser = require("body-parser")
const api_routes = require('./api')
const test_routes = require('./api/test')
const log_debug = require('./api/log')

/********************************* MIDDLEWARE *********************************/

app.use('/', function (req, res, next) { console.log(req.route); next(); })
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/********************************* API Routes *********************************/

api_routes(app)
test_routes(app)

/*********************************** Assets ***********************************/

const page_routes = [
    '/',
    '/home',
    '/competition/:competition_id/eventregistration'              ,
    '/competitions'                                               ,
    '/editprofile'                                                ,
    '/competition/:competition_id/run'                            ,
    '/competition/:competition_id/round/:round_id/entercallbacks' ,
    '/competition/:competition_id/editschedule'                   ,
    '/competition/:competition_id/editlevelsandstyles'            ,
    '/competition/:competition_id/editevents'                     ,
    '/competition/:competition_id/competitorslist'                ,
    '/competition/:competition_id/seecompetitor/:competitor_id'   ,
    '/competition/:competition_id/regcompetitor/:competitor_id'   ,
    '/competition/:competition_id/:competitor_id'                 ,
    '/admin/competitions'                                         ,
    '/admin/competition/:competition_id'                          ,
    '/editcompetition/:competition_id'                            ,
    '/editofficials/:competition_id'                              ,
    '/querytest'                                                  ,
    '/newuser'                                                    ,
    '/organizationpayment/:competition_id/:organization_id'       ,
    '/querytest'                                                  ,
    '/competitorpayment/:competition_id/:competitor_id'           ,
]


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
app.get(page_routes, (req, res) => {
    res.sendFile(__dirname + '/build/index.html');
});


/********************************* DEV SERVER *********************************/

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

/****************TEST *****************/
app.get('/api/querytest', (req, res) => {
    test.get_test_result(req.body).then(value => {
        log_debug(2)(value)
        res.send(value);
    });
});
