import express from 'express';
const app = express();
const data = require('./api/data')
const ip = require('ip');
const query = require('./query')
const query2 = require('./query2')
const bodyParser = require("body-parser")
const test = require('./test')
const path = require('path')
const jwt = require('express-jwt');
const ManagementClient = require('auth0').ManagementClient;
const AuthenticationClient = require('auth0').AuthenticationClient;

const DEBUG_LEVEL = 1;

const log_debug = level => msg => {
    if (DEBUG_LEVEL === level) console.log(msg)
}

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
  res.status(200).send("quoter.getRandomOne()");
});


// TODO: Acutally protect the quotes. Expects access_token=xxxx in query string.

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/********************************* DATA PATHS *********************************/

/*app.post('*', (req, res) => {
 res.send({status: 'posted'})
 })*/

 app.post('/api/create_user', (req, res) => {
    const { first_name, last_name, email, mailing_address } = req.body

    // TODO, create user, include Auth0 ID

    // TODO, update Auth0 metadata to include user's competitor id

    // send back the created competitor
    res.send({})

 });

  app.post('/api/create_empty_competition', (req, res) => {
    query2.create_empty_competition().then(function (value){
        console.log(value);
        res.send(value[0]);
    })
 });

app.post('/api/create_judge', (req, res) => {
    const email = req.body.email
    const token = req.body.token
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const competitionid = parseInt(req.body.competitionid)
    const phonenumber = req.body.phonenumber
    query2.create_judge(firstname, lastname, email, token, phonenumber, competitionid).then(function (value) {
            console.log(value);
            res.send(value);
        },
        function (err){
            res.send(err);
        });
});

app.post('/api/delete_judge', (req, res) => {
    const id = req.body.id
    query2.delete_judge(id).then(function (value) {
            console.log(value);
            res.send(value);
        },
        function (err){
            res.send(err);
        });
});

app.post('/api/update_competitor', (req, res) => {
    const id = req.body.id
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const affiliationid = req.body.affiliationid
    const mailingaddress = req.body.mailingaddress
    const hasregistered = req.body.hasregistered
    query2.update_competitor_by_id(id, firstname, lastname, mailingaddress, affiliationid, hasregistered)
        .then(function (value) {
                console.log(value);
                res.send(value);
            },
            function (err){
                res.send(err);
            });
})

app.post('/api/create_partnership', (req, res) => {
    const leadcompetitorid = parseInt(req.body.leadcompetitorid)
    const followcompetitorid = parseInt(req.body.followcompetitorid)
    const eventid = parseInt(req.body.eventid)
    const competitionid = parseInt(req.body.competitionid)
    query2.create_partnership(leadcompetitorid, followcompetitorid, eventid, competitionid).then(function (value) {
            log_debug(2)(value)
            res.send(value);
        },
        function (err){
            res.send(err);
        });
});

app.post('/api/delete_partnership', (req, res) => {
    const leadcompetitorid = parseInt(req.body.leadcompetitorid)
    const followcompetitorid = parseInt(req.body.followcompetitorid)
    const eventid = parseInt(req.body.eventid)
    query2.delete_partnership(leadcompetitorid, followcompetitorid, eventid).then(function (value) {
            log_debug(2)(value)
            res.send(value);
        },
        function (err){
            res.send(err);
        });
});

app.post('/api/competition/generateRounds', (req, res) => {
    query.create_rounds_for_events_for_competition(req.body.cid).then(value => {
        log_debug(2)(value)
        res.end(value);
    });
});

app.post('/api/competition/updateEvents', (req, res) => {
    query.update_events_for_competition(req.body).then(value => {
        log_debug(2)(value)
        res.end(value);
    });
});

app.post('/api/competition/updateLevelsStyles', (req, res) => {
    query.update_levels_and_styles_for_competition(req.body).then(value => {
        log_debug(2)(value)
        res.end(value);
    });
});

app.post('/api/competition/updateRounds', (req, res) => {
    query.update_rounds_for_competition(req.body).then(value => {
        log_debug(2)(value)
        res.end(value);
    });
});

app.post('/api/competition/updateCompetitionInfo', (req, res) => {
    query.update_competition_info(req.body).then(value => {
        console.log(value)
        res.send(value);
    }, err =>{
        console.log(err);
        res.send(err);
    });
});

app.post('/api/competition/updateCompetitionCurrentRoundId', (req, res) => {
    query.update_competition_current_round_id(req.body).then(value => {
        log_debug(2)(value)
        res.end(value);
    });
});

app.get('/api/competition/:id', (req, res) => {
    query.get_competition_info(req.params.id).then(value => {
        log_debug(2)(value)
        res.send(value[0]);
    });
})

app.get('/api/competition/:cid/affiliations', (req, res) => {
    query.get_affiliations_for_competition(req.params.cid).then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/competition/:cid/competitors', (req, res) => {
    query.get_competitors_for_competition(req.params.cid).then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/competition/:cid/competitors_styles', (req, res) => {
    query.get_num_competitors_per_style_for_competition(req.params.cid).then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/competition/:cid/events', (req, res) => {
    query.get_events_for_competition(req.params.cid).then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/competition/:cid/judges', (req, res) => {
    query.get_judges_for_competition(req.params.cid).then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/competition/:cid/levels', (req, res) => {
    query.get_levels_for_competition(req.params.cid).then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/competition/:cid/level/:lid/styles', (req, res) => {
    query2.get_styles_for_competition_level(req.params.cid, req.params.lid).then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/competition/:cid/level/:lid/style/:sid', (req, res) => {
    query2.get_events_for_competition_level_style(req.params.cid, req.params.lid, req.params.sid).then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/competition/:cid/rounds', (req, res) => {
    query.get_rounds_for_competition(req.params.cid).then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/competition/:cid/styles', (req, res) => {
    query.get_styles_for_competition(req.params.cid).then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/competitors/:id', (req, res) => {
    const id = parseInt(req.params.id)
    query2.get_competitor_by_id(req.params.id).then(value => {
        log_debug(2)(value)
        res.send(value[0]);
    });
})

app.get('/api/competitors/', (req, res) => {
    query2.get_all_competitors().then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/competitors/round/:rid', (req, res) => {
    query.get_competitors_for_round(req.params.rid).then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})

// app.get('/api/competitors/:id1/competition/:id2', (req, res) => {
//     const id1 = parseInt(req.params.id1)
//     const id2 = parseInt(req.params.id2)
//     res.send(data.competitor_competition_information[id1])
// })

app.get('/api/competitors/:id/:cid/events', (req, res) => {
    const id = parseInt(req.params.id)
    const cid = parseInt(req.params.cid)
    query2.get_comfirmed_partnerships_by_competition_competitor(cid, id).then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/competitions', (req, res) => {
    query.get_competitions().then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/competitions/:cid', (req, res) => {
    const cid = parseInt(req.params.cid)
    query.get_your_competitions(cid).then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})
app.get('/api/competitions/:cid/unregistered', (req, res) => {
    const cid = parseInt(req.params.cid)
    query.get_other_competitions(cid).then(value => {
        log_debug(2)(value)
        res.send(value);
    });
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

app.get('/api/affiliations', (req, res) => {
    query.get_affiliations().then(value => {
        log_debug(2)(value)
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
    query2.get_all_paymentrecords().then(function (value) {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/payment_records/competition/:id', (req, res) => {
    const id = parseInt(req.params.id)
    query2.get_paymentrecords_by_competition(id).then(function (value) {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/payment_records/competitor/:id', (req, res) => {
    const id = parseInt(req.params.id)
    query2.get_paymentrecords_by_competitior(id).then(function (value) {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/payment_records/:competitionid/:competitorid', (req, res) => {
    const competitionid = parseInt(req.params.competitionid)
    const competitorid = parseInt(req.params.competitorid)
    query2.get_paymentrecord_by_competition_competitor(competitionid, competitorid).then(function (value) {
        log_debug(2)(value)
        res.send(value[0]);
    });
})


app.get('/api/callbacks', (req, res) => {
    res.send(data.callbacks)
})

app.get('/api/admins', (req, res) => {
    query.get_all_admins().then(value => {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/api/judges/:jid', (req, res) => {
    query.get_judge(req.params.jid).then(value => {
        log_debug(2)(value)
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
        '/api/judges',
        'api/querytest'
    ]})
})

/************************ TEST PATHS *************************/
app.get('/test/competitors', (req, res) => {
    query2.get_all_competitors().then(function (value) {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/test/competitors/competition/:id', (req, res) => {
    const id = parseInt(req.params.id)
    query2.get_competitors_by_competition(id).then(function (value) {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/test/competitors/id/:id', (req, res) => {
    const id = parseInt(req.params.id)
    query2.get_competitor_by_id(id).then(function (value) {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/test/competitors/email/:email', (req, res) => {
    const email = req.params.email
    query2.get_competitor_by_email(email).then(function (value) {
        log_debug(2)(value)
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
            log_debug(2)(value)
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
                log_debug(2)(value)
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
                log_debug(2)(value)
                res.send(value);
            },
            function (err){
                res.send(err);
            });
})

app.get('/test/payment_records', (req, res) => {
    query2.get_all_paymentrecords().then(function (value) {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/test/payment_records/competition/:id', (req, res) => {
    const id = parseInt(req.params.id)
    query2.get_paymentrecords_by_competition(id).then(function (value) {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/test/payment_records/competitor/:id', (req, res) => {
    const id = parseInt(req.params.id)
    query2.get_paymentrecords_by_competitior(id).then(function (value) {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/test/payment_records/:competitionid/:competitorid', (req, res) => {
    const competitionid = parseInt(req.params.competitionid)
    const competitorid = parseInt(req.params.competitorid)
    query2.get_paymentrecord_by_competition_competitor(competitionid, competitorid).then(function (value) {
        log_debug(2)(value)
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
            log_debug(2)(value)
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
            log_debug(2)(value)
            res.send(value);
        },
        function (err){
            res.send(err);
        });
})

app.get('/test/partnerships/', (req, res) => {
    query2.get_all_partnerships().then(function (value) {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/test/partnerships/competitor/:id', (req, res) => {
    const id = parseInt(req.params.id)
    query2.get_partnerships_by_competitor(id).then(function (value) {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/test/partnerships/competition/:competitionid/competitor/:competitorid', (req, res) => {
    const competitionid = parseInt(req.params.competitionid)
    const competitorid = parseInt(req.params.competitorid)
    query2.get_partnerships_by_competition_competitor(competitionid, competitorid).then(function (value) {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/test/partnerships/lead/:competitiorid1/follow/:competitorid2/event/:eventid', (req, res) => {
    const competitiorid1 = parseInt(req.params.competitiorid1)
    const competitorid2 = parseInt(req.params.competitorid2)
    const eventid = parseInt(req.params.eventid)
    query2.get_partnership(competitiorid1, competitorid2, eventid).then(function (value) {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/test/partnerships/event/:eventid', (req, res) => {
    const eventid = parseInt(req.params.eventid)
    query2.get_partnerships_by_event(eventid).then(function (value) {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/test/partnerships/competition/:cid/number/:number', (req, res) => {
    const cid = parseInt(req.params.cid)
    const number = parseInt(req.params.number)
    query2.get_partnership_by_number(cid, number).then(function (value) {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/test/partnerships/comfirmed/event/:eventid', (req, res) => {
    const eventid = parseInt(req.params.eventid)
    console.log("here")
    query2.get_comfirmed_partnerships_by_event(eventid).then(function (value) {
        log_debug(2)(value)
        res.send(value);
    });
})

app.get('/test/partnerships/insert/:leadcompetitorid/:followcompetitorid/:eventid/:competitionid', (req, res) => {
    const leadcompetitorid = parseInt(req.params.leadcompetitorid)
    const followcompetitorid = parseInt(req.params.followcompetitorid)
    const eventid = parseInt(req.params.eventid)
    const competitionid = parseInt(req.params.competitionid)
    query2.create_partnership(leadcompetitorid, followcompetitorid, eventid, competitionid).then(function (value) {
            log_debug(2)(value)
            res.send(value);
        },
        function (err){
            console.log(err);
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
            log_debug(2)(value)
            res.send(value);
        },
        function (err){
            res.send(err);
        });
})


app.get('/test/', (req, res) => {
    res.send({routes: [
        '/test/competitors',
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
