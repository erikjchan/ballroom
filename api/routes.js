
// Database queries
const query = require('./query')
const query2 = require('./query2')
const log_debug = require('./log')

const jwt = require('express-jwt');
const ManagementClient = require('auth0').ManagementClient;
const AuthenticationClient = require('auth0').AuthenticationClient;

/******************************* AUTHORIZATION! *******************************/

var auth0 = new AuthenticationClient({
  domain: 'mrkev.auth0.com',
  clientId: 'Dl30IRGbXkkPlENLT4nR9QIWLHiMAxxF'
});

const management = new ManagementClient({
  token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlEwUkVSRGN4TXpnM1JqaEJPRVUwUVRSR01FVXlRalZFUVRZd1FqSkZOekUyUWpCRk1UTXpOZyJ9.eyJpc3MiOiJodHRwczovL21ya2V2LmF1dGgwLmNvbS8iLCJzdWIiOiJvSVVDaVlISlI1NVgwOTJ0Q2pQcm13ZjFadDRoeWI5bEBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9tcmtldi5hdXRoMC5jb20vYXBpL3YyLyIsImV4cCI6MTUwMzAyNzA4MSwiaWF0IjoxNDk0Mzg3MDgxLCJzY29wZSI6InJlYWQ6Y2xpZW50X2dyYW50cyBjcmVhdGU6Y2xpZW50X2dyYW50cyBkZWxldGU6Y2xpZW50X2dyYW50cyB1cGRhdGU6Y2xpZW50X2dyYW50cyByZWFkOnVzZXJzIHVwZGF0ZTp1c2VycyBkZWxldGU6dXNlcnMgY3JlYXRlOnVzZXJzIHJlYWQ6dXNlcnNfYXBwX21ldGFkYXRhIHVwZGF0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgZGVsZXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBjcmVhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGNyZWF0ZTp1c2VyX3RpY2tldHMgcmVhZDpjbGllbnRzIHVwZGF0ZTpjbGllbnRzIGRlbGV0ZTpjbGllbnRzIGNyZWF0ZTpjbGllbnRzIHJlYWQ6Y2xpZW50X2tleXMgdXBkYXRlOmNsaWVudF9rZXlzIGRlbGV0ZTpjbGllbnRfa2V5cyBjcmVhdGU6Y2xpZW50X2tleXMgcmVhZDpjb25uZWN0aW9ucyB1cGRhdGU6Y29ubmVjdGlvbnMgZGVsZXRlOmNvbm5lY3Rpb25zIGNyZWF0ZTpjb25uZWN0aW9ucyByZWFkOnJlc291cmNlX3NlcnZlcnMgdXBkYXRlOnJlc291cmNlX3NlcnZlcnMgZGVsZXRlOnJlc291cmNlX3NlcnZlcnMgY3JlYXRlOnJlc291cmNlX3NlcnZlcnMgcmVhZDpkZXZpY2VfY3JlZGVudGlhbHMgdXBkYXRlOmRldmljZV9jcmVkZW50aWFscyBkZWxldGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGNyZWF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgcmVhZDpydWxlcyB1cGRhdGU6cnVsZXMgZGVsZXRlOnJ1bGVzIGNyZWF0ZTpydWxlcyByZWFkOmVtYWlsX3Byb3ZpZGVyIHVwZGF0ZTplbWFpbF9wcm92aWRlciBkZWxldGU6ZW1haWxfcHJvdmlkZXIgY3JlYXRlOmVtYWlsX3Byb3ZpZGVyIGJsYWNrbGlzdDp0b2tlbnMgcmVhZDpzdGF0cyByZWFkOnRlbmFudF9zZXR0aW5ncyB1cGRhdGU6dGVuYW50X3NldHRpbmdzIHJlYWQ6bG9ncyByZWFkOnNoaWVsZHMgY3JlYXRlOnNoaWVsZHMgZGVsZXRlOnNoaWVsZHMgdXBkYXRlOnRyaWdnZXJzIHJlYWQ6dHJpZ2dlcnMgcmVhZDpncmFudHMgZGVsZXRlOmdyYW50cyByZWFkOmd1YXJkaWFuX2ZhY3RvcnMgdXBkYXRlOmd1YXJkaWFuX2ZhY3RvcnMgcmVhZDpndWFyZGlhbl9lbnJvbGxtZW50cyBkZWxldGU6Z3VhcmRpYW5fZW5yb2xsbWVudHMgY3JlYXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRfdGlja2V0cyByZWFkOnVzZXJfaWRwX3Rva2VucyJ9.tC0ql0LDX_lJXXpzzU7ZCRWyrxOcudnIofjUrY6hTcXwxsvw-UOnvDzInEIehnGb-qDnFeVOH44n-XPaTr3ZPckkbVuXlraFUqktW9xFITXOVWvHbycouDPCdZ98ssoAJEukn-E9DHamiIjxO7jxdEV0ABQv2sEG3pBKs1pR3bak-eKJCtKYCP3wqY9rc2J7EEk_-XY0yc8bLVFtOVkJ1O6Oau9bJjZmPqU3c-1r4FxMbfFJvcwcSC7HbGl8XrOcYsC9rNltZEQ4bnCnzyEI9aWfatQM7tGxiw4C4zVZrRuoFhEh58tuElz3y1gFDz49vqw5AoWkiZZ0vce1XlcDkw',
  domain: 'mrkev.auth0.com'
})

const jwtCheck = jwt({
  secret: 'W8p06kShQyGZjHXWfv56C1hQDuzYsPf6OucdEq36JHd9pPYtkUcYnss_bLachbyW',
  audience: 'Dl30IRGbXkkPlENLT4nR9QIWLHiMAxxF'
})

/*********************************** ROUTES ***********************************/

module.exports = app => {

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


   app.post('/api/create_user', (req, res) => {
      const { profile, firstname, lastname, email, mailingaddress, affiliationname } = req.body;
      const { user_id } = profile
      query2.create_competitor(firstname, lastname, email, mailingaddress, affiliationname)
      .then(idstr => {
          const idobj = JSON.parse(idstr)

          // Update Auth0 profile app_metadata
          management.users
          .updateAppMetadata({ id: user_id }, {competitor_id : idobj.id})
          .then(body => { console.log(body); res.send(idobj)})
          .catch(err => { console.error(err); res.send({severity: "ERROR", err})})
      }, err => {
        res.send(err)
      })
      .catch(err => res.send(err))
   });

    app.post('/api/create_competition', (req, res) => {
      query2.create_competition(req.body).then(function (value){
          console.log(value);
          res.send(value[0]);
      })
   });

  app.post('/api/create_official', (req, res) => {
      const token = req.body.token
      const firstname = req.body.firstname
      const lastname = req.body.lastname
      const roleid = req.body.roleid
      const competitionid = req.body.competitionid
      query2.create_official(firstname, lastname, token, roleid, competitionid).then(function (value) {
              console.log(value);
              res.send(value);
          },
          function (err){
              res.send(err);
          });
  });

  app.post('/api/clear_organization_owed', (req, res) => {
      const cid = req.body.competitionid
      const aid = req.body.affiliationid
      query2.clear_organization_owed(cid, aid).then(function (value) {
              console.log(value);
              res.send(value);
          },
          function (err){
              res.send(err);
          });
  });

  app.post('/api/create_paymentrecord', (req, res) => {
      const competitionid = parseInt(req.body.competitionid)
      const competitorid = parseInt(req.body.competitorid)
      const amount = parseFloat(req.body.amount)
      const online = (req.body.online)
      const paidwithaffiliation = (req.body.paidwithaffiliation)
      query2.create_paymentrecord(competitionid, competitorid, amount, online, paidwithaffiliation).then(function (value) {
              log_debug(2)(value)
              res.send(value);
          },
          function (err){
              res.send(err);
          });
  })

  app.get('/api/get_organization_owed/:cid/:aid', (req, res) => {
      const cid = req.params.cid
      const aid = req.params.aid
      query2.get_organization_owed(cid, aid).then(function (value) {
              console.log(value);
              res.send(value[0]);
          },
          function (err){
              res.send(err);
          });
  });

  app.post('/api/delete_official', (req, res) => {
      const id = req.body.id
      query2.delete_official(id).then(function (value) {
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
      
  app.post('/api/payment_records/update/', (req, res) => {
      const competitionid = parseInt(req.body.competitionid)
      const competitorid = parseInt(req.body.competitorid)
      const amount = parseFloat(req.body.amount)
      const online = req.body.online
      const paidwithaffiliation = req.body.paidwithaffiliation
      query2.update_paymentrecord(competitionid, competitorid, amount, online, paidwithaffiliation).then(function (value) {
          log_debug(2)(value)
          res.send(value);
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

  app.get('/api/affiliations/:id', (req, res) => {
      query2.get_affiliation(req.params.id).then(value => {
          log_debug(2)(value)
          res.send(value[0]);
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

  app.get('/api/competition/:cid/officials', (req, res) => {
      query.get_officials_for_competition(req.params.cid).then(value => {
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
      query2.get_confirmed_partnerships_by_competition_competitor(cid, id).then(value => {
          log_debug(2)(value)
          res.send(value);
      });
  })

  app.get('/api/competitions/:email', (req, res) => {
      query.get_competitions(req.params.email).then(value => {
          log_debug(2)(value)
          res.send(value);
      })
      .catch(console.error)
  })

  app.get('/api/competitions/:cid', (req, res) => {
      const cid = parseInt(req.params.cid)
      query.get_your_competitions(cid).then(value => {
          console.log(value)
          res.send(value);
      });
  })
  app.get('/api/competitions/:cid/unregistered', (req, res) => {
      const cid = parseInt(req.params.cid)
      query.get_other_competitions(cid).then(value => {
          console.log(value)
          res.send(value);
      });
  })

  app.get('/api/event/:eid/', (req, res) => {
      const eid =  parseInt(req.params.eid)
      const events = data.events.filter(e => e.id === eid)
      res.send(events[0])
  })

  app.get('/api/event/rounds/:rid', (req, res) => {
      const rid = parseInt(req.params.rid)
      query.get_rounds_in_same_event_as_round(rid).then(value => {
          console.log(value);
          res.send(value);
      });
  })

  app.get('/api/affiliations', (req, res) => {
      query.get_affiliations().then(value => {
          log_debug(2)(value)
          res.send(value);
      });
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
      query2.get_paymentrecords_by_competitor(id).then(function (value) {
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

  app.post('/api/callbacks/update', (req, res) => {
     query.update_callbacks_for_round_and_judge(req.body).then(function(value) {
        log_debug(2)(value);
        res.send(value);
     });
  });

  app.post('/api/callbacks/calculate', (req, res) => {
      query.calculate_callbacks_for_round(req.body).then(function(value) {
          log_debug(2)(value);
          res.send(value);
      });
  });

  app.get('/api/admins', (req, res) => {
      query.get_all_admins().then(value => {
          log_debug(2)(value)
          res.send(value);
      });
  })

  app.get('/api/roles', (req, res) => {
      query.get_roles().then(value => {
        log_debug(2)(value);
        res.send(value);
      });
  })

  app.get('/api/officials/:id', (req, res) => {
      query.get_official(req.params.id).then(value => {
          log_debug(2)(value)
          res.send(value);
      });
  })

  app.get('/api/judges/round/:rid', (req, res) => {
      query.get_judges_submitted_round(req.params.rid).then(value => {
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
          '/api/officials',
          'api/querytest'
      ]})
  })

}