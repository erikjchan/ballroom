// Database queries
const query = require('./query')
const query2 = require('./query2')
const log_debug = require('./log')

/************************ TEST PATHS *************************/

module.exports = app => {

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
        const online =  (req.params.online)
        const paidwithaffiliation = (req.params.paidwithaffiliation)
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
        query2.get_confirmed_partnerships_by_event(eventid).then(function (value) {
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
}
