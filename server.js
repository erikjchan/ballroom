import express from 'express';
const app = express();
const data          = require('./api/data')
const ip = require('ip');
const query          = require('./query')
const query2          = require('./query2')
const bodyParser = require("body-parser")


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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/********************************* DATA PATHS *********************************/

/*app.post('*', (req, res) => {
 res.send({status: 'posted'})
 })*/

app.post('/api/competition/generateRounds', (req, res) => {
    query.create_rounds_for_events_for_competition(req.body.cid).then(value => {
        console.log(value);
        res.end(value);
    });
});

app.post('/api/competition/updateEvents', (req, res) => {
    query.update_events_for_competition(req.body).then(value => {
        console.log(value);
        res.end(value);
    });
});

app.post('/api/competition/updateRounds', (req, res) => {
    query.update_rounds_for_competition(req.body).then(value => {
        console.log(value);
        res.end(value);
    });
});

app.post('/api/competition/updateCompetitionInfo', (req, res) => {
    query.update_competition_info(req.body).then(value => {
        console.log(value);
        res.end(value);
    });
});

app.post('/api/competition/updateCompetitionCurrentEventId', (req, res) => {
    query.update_competition_current_event_id(req.body).then(value => {
        console.log(value);
        res.end(value);
    });
});

app.get('/api/competition/:id', (req, res) => {
    query.get_competition_info(req.params.id).then(value => {
        console.log(value);
        res.send(value);
    });
})

app.get('/api/competition/:cid/affiliations', (req, res) => {
    query.get_affiliations_for_competition(req.params.cid).then(value => {
        console.log(value);
        res.send(value);
    });
})

app.get('/api/competition/:cid/competitors', (req, res) => {
    query.get_competitors_for_competition(req.params.cid).then(value => {
        console.log(value);
        res.send(value);
    });
})

app.get('/api/competition/:cid/competitors_styles', (req, res) => {
    query.get_num_competitors_per_style_for_competition(req.params.cid).then(value => {
        console.log(value);
        res.send(value);
    });
})

app.get('/api/competition/:cid/events', (req, res) => {
    query.get_events_for_competition(req.params.cid).then(value => {
        console.log(value);
        res.send(value);
    });
})

app.get('/api/competition/:cid/judges', (req, res) => {
    query.get_judges_for_competition(req.params.cid).then(value => {
        console.log(value);
        res.send(value);
    });
})

app.get('/api/competition/:cid/levels', (req, res) => {
    query.get_levels_for_competition(req.params.cid).then(value => {
        console.log(value);
        res.send(value);
    });
})

app.get('/api/competition/:cid/rounds', (req, res) => {
    query.get_rounds_for_competition(req.params.cid).then(value => {
        console.log(value);
        res.send(value);
    });
})

app.get('/api/competition/:cid/styles', (req, res) => {
    query.get_styles_for_competition(req.params.cid).then(value => {
        console.log(value);
        res.send(value);
    });
})

app.get('/api/competition/:cid/rounds', (req, res) => {
    res.send(data.rounds)
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
    query.get_affiliations().then(value => {
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
    query.get_all_admins().then(value => {
        console.log(value);
        res.send(value);
    });
})

app.get('/api/judges/:jid', (req, res) => {
    query.get_judge(req.params.jid).then(value => {
        console.log(value);
        res.send(value);
    });
})

app.get('/api/', (req, res) => {
    res.send({routes: [
        '/api/affiliations',
        '/api/competitors',
        '/api/competitions',
        '/api/levels',
        '/api/styles',
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

/************************ TEST PATHS *************************/
app.get('/test/competitors', (req, res) => {
    query2.get_all_competitors().then(function (value) {
        console.log(value);
        res.send(value);
    });
})

app.get('/test/competitors/competition/:id', (req, res) => {
    const id = parseInt(req.params.id)
    query2.get_competitors_by_competition(id).then(function (value) {
        console.log(value);
        res.send(value);
    });
})

app.get('/test/competitors/id/:id', (req, res) => {
    const id = parseInt(req.params.id)
    query2.get_competitor_by_id(id).then(function (value) {
        console.log(value);
        res.send(value);
    });
})

app.get('/test/competitors/email/:email', (req, res) => {
    const email = req.params.email
    query2.get_competitor_by_email(email).then(function (value) {
        console.log(value);
        query2.check_competitor_email_exist(email).then(function (value2) {
            console.log(value2);
            res.send({query_result: value, check_if_exists: value2});
        });
    });
})

app.get('/test/competitors/insert/:email/:firstname/:lastname/:mailingaddress/:affiliationid/:password', (req, res) => {
    const affiliationid = null
    const lastname = req.params.lastname
    const firstname = req.params.firstname
    const email = req.params.email
    const mailingaddress = req.params.mailingaddress
    const password = req.params.password
    query2.create_competitor(firstname, lastname, email, mailingaddress, affiliationid, password).then(function (value) {
            console.log(value);
            res.send(value);
        },
        function (err){
            res.send(err);
        });
})

app.get('/test/competitors/update/email/:email/:firstname/:lastname/:mailingaddress/:affiliationid/:password/:hasregistered', (req, res) => {
    const affiliationid = null
    const lastname = req.params.lastname
    const firstname = req.params.firstname
    const email = req.params.email
    const mailingaddress = req.params.mailingaddress
    const password = req.params.password
    const hasregistered = parseInt(req.params.hasregistered)
    query2.update_competitor_by_email(email, firstname, lastname, mailingaddress, affiliationid, password, hasregistered)
        .then(function (value) {
                console.log(value);
                res.send(value);
            },
            function (err){
                res.send(err);
            });
})

app.get('/test/competitors/update/id/:id/:firstname/:lastname/:mailingaddress/:affiliationid/:password/:hasregistered', (req, res) => {
    const affiliationid = null
    const lastname = req.params.lastname
    const firstname = req.params.firstname
    const id = parseInt(req.params.id)
    const mailingaddress = req.params.mailingaddress
    const password = req.params.password
    const hasregistered = parseInt(req.params.hasregistered)
    query2.update_competitor_by_id(id, firstname, lastname, mailingaddress, affiliationid, password, hasregistered)
        .then(function (value) {
                console.log(value);
                res.send(value);
            },
            function (err){
                res.send(err);
            });
})

app.get('/test/payment_records', (req, res) => {
    query2.get_all_paymentrecords().then(function (value) {
        console.log(value);
        res.send(value);
    });
})

app.get('/test/payment_records/competition/:id', (req, res) => {
    const id = parseInt(req.params.id)
    query2.get_paymentrecords_by_competition(id).then(function (value) {
        console.log(value);
        res.send(value);
    });
})

app.get('/test/payment_records/competitor/:id', (req, res) => {
    const id = parseInt(req.params.id)
    query2.get_paymentrecords_by_competitior(id).then(function (value) {
        console.log(value);
        res.send(value);
    });
})

app.get('/test/payment_records/:competitionid/:competitorid', (req, res) => {
    const competitionid = parseInt(req.params.competitionid)
    const competitorid = parseInt(req.params.competitorid)
    query2.get_paymentrecord_by_competition_competitor(competitionid, competitorid).then(function (value) {
        console.log(value);
        res.send(value);
    });
})

app.get('/test/payment_records/insert/:competitionid/:competitorid/:amount/:online/:paidwithaffiliation', (req, res) => {
    const competitionid = parseInt(req.params.competitionid)
    const competitorid = parseInt(req.params.competitorid)
    const amount = parseFloat(req.params.amount)
    const online = parseInt(req.params.online)
    const paidwithaffiliation = parseInt(req.params.paidwithaffiliation)
    query2.create_paymentrecord(competitionid, competitorid, amount, online, paidwithaffiliation).then(function (value) {
            console.log(value);
            res.send(value);
        },
        function (err){
            res.send(err);
        });
})

app.get('/test/payment_records/update/:competitionid/:competitorid/:amount/:online/:paidwithaffiliation', (req, res) => {
    const competitionid = parseInt(req.params.competitionid)
    const competitorid = parseInt(req.params.competitorid)
    const amount = parseFloat(req.params.amount)
    const online = parseInt(req.params.online)
    const paidwithaffiliation = parseInt(req.params.paidwithaffiliation)
    query2.update_paymentrecord(competitionid, competitorid, amount, online, paidwithaffiliation).then(function (value) {
            console.log(value);
            res.send(value);
        },
        function (err){
            res.send(err);
        });
})

app.get('/test/partnerships/', (req, res) => {
    query2.get_all_partnerships().then(function (value) {
        console.log(value);
        res.send(value);
    });
})

app.get('/test/partnerships/competitor/:id', (req, res) => {
    const id = parseInt(req.params.id)
    query2.get_partnerships_by_competitor(id).then(function (value) {
        console.log(value);
        res.send(value);
    });
})

app.get('/test/partnerships/competition/:competitionid/competitor/:competitorid', (req, res) => {
    const competitionid = parseInt(req.params.competitionid)
    const competitorid = parseInt(req.params.competitorid)
    query2.get_partnerships_by_competition_competitor(competitionid, competitorid).then(function (value) {
        console.log(value);
        res.send(value);
    });
})

app.get('/test/partnerships/lead/:competitiorid1/follow/:competitorid2/event/:eventid', (req, res) => {
    const competitiorid1 = parseInt(req.params.competitiorid1)
    const competitorid2 = parseInt(req.params.competitorid2)
    const eventid = parseInt(req.params.eventid)
    query2.get_partnership(competitiorid1, competitorid2, eventid).then(function (value) {
        console.log(value);
        res.send(value);
    });
})

app.get('/test/partnerships/event/:eventid', (req, res) => {
    const eventid = parseInt(req.params.eventid)
    query2.get_partnerships_by_event(eventid).then(function (value) {
        console.log(value);
        res.send(value);
    });
})

app.get('/test/partnerships/competition/:cid/number/:number', (req, res) => {
    const cid = parseInt(req.params.cid)
    const number = parseInt(req.params.number)
    query2.get_partnership_by_number(cid, number).then(function (value) {
        console.log(value);
        res.send(value);
    });
})

app.get('/test/partnerships/comfirmed/event/:eventid', (req, res) => {
    const eventid = parseInt(req.params.eventid)
    console.log("here")
    query2.get_comfirmed_partnerships_by_event(eventid).then(function (value) {
        console.log(value);
        res.send(value);
    });
})

app.get('/test/partnerships/insert/:leadcompetitorid/:followcompetitorid/:eventid/:competitionid/:number', (req, res) => {
    const leadcompetitorid = parseInt(req.params.leadcompetitorid)
    const followcompetitorid = parseInt(req.params.followcompetitorid)
    const eventid = parseInt(req.params.eventid)
    const competitionid = parseInt(req.params.competitionid)
    const number = parseInt(req.params.number)
    query2.create_partnership(leadcompetitorid, followcompetitorid, eventid, competitionid, number).then(function (value) {
            console.log(value);
            res.send(value);
        },
        function (err){
            res.send(err);
        });
})

app.get('/test/partnerships/update/:leadcompetitorid/:followcompetitorid/:eventid/:leadconfirmed/:followconfirmed/:calledback/:number', (req, res) => {
    const leadcompetitorid = parseInt(req.params.leadcompetitorid)
    const followcompetitorid = parseInt(req.params.followcompetitorid)
    const eventid = parseInt(req.params.eventid)
    const leadconfirmed = parseInt(req.params.leadconfirmed)
    const followconfirmed = parseInt(req.params.followconfirmed)
    const calledback = parseInt(req.params.calledback)
    const number = parseInt(req.params.number)
    query2.update_partnership(leadcompetitorid, followcompetitorid, eventid, leadconfirmed, followconfirmed, calledback, number).then(function (value) {
            console.log(value);
            res.send(value);
        },
        function (err){
            res.send(err);
        });
})


app.get('/test/', (req, res) => {
  res.send({routes: [
    '/test/competitors',
    '/test/competitors/competition/:id',
    '/test/competitors/id/:id',
    '/test/competitors/email/:email',
    '/test/competitors/insert/:email/:firstname/:lastname/:mailingaddress/:affiliationid/:password',
    '/test/payment_records',
    '/test/payment_records/competition/:id',
    '/test/payment_records/competitor/:id',
    '/test/payment_records/:competitionid/:competitorid',
    '/test/payment_records/insert/:competitionid/:competitorid/:amount/:online/:paidwithaffiliation',
    '/test/payment_records/update/:competitionid/:competitorid/:amount/:online/:paidwithaffiliation',
    '/test/partnerships/',
    '/test/partnerships/competitor/:id',
    '/test/partnerships/competition/:competitionid/competitor/:competitorid',
    '/test/partnerships/lead/:competitiorid1/follow/:competitorid2/event/:eventid',
    '/test/partnerships/event/:eventid',
    '/test/partnerships/competition/:competitionid/number/:number',
    '/test/partnerships/comfirmed/event/:eventid',
    '/test/partnerships/insert/:leadcompetitorid/:followcompetitorid/:eventid/:competitionid/:number',
    '/test/partnerships/update/:leadcompetitorid/:followcompetitorid/:eventid/:leadconfirmed/:followconfirmed/:calledback/:numbe',
  ]})
})


/*********************** ROUTES **************************/
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