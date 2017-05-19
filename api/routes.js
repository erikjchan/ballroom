
// Database queries
const query = require('./query')
const query2 = require('./query2')
const log_debug = require('./log')

const jwt = require('express-jwt');
const ManagementClient = require('auth0').ManagementClient;
const AuthenticationClient = require('auth0').AuthenticationClient;

/******************************* AUTHORIZATION! *******************************/

var auth0 = new AuthenticationClient({
  domain: 'floorcraftapp.auth0.com',
  clientId: 'taQWcPVhkpPly1Xr9CXs1wFroWuSVptB'
});

const management = new ManagementClient({
  token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik1EZzVSa0k0UXpORE9Ua3dRekZETmpRME1UTkNSa1JDUlRsRE5EQTBPREZFUmtFeVJEaERSZyJ9.eyJpc3MiOiJodHRwczovL2Zsb29yY3JhZnRhcHAuYXV0aDAuY29tLyIsInN1YiI6ImlQZkwxOWZMNERZeXd1M0dKWlJISmtmMHlINVo3ang0QGNsaWVudHMiLCJhdWQiOiJodHRwczovL2Zsb29yY3JhZnRhcHAuYXV0aDAuY29tL2FwaS92Mi8iLCJleHAiOjE1MjY2ODA2MjQsImlhdCI6MTQ5NTE0NDYyNCwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBjcmVhdGU6dXNlcl90aWNrZXRzIHJlYWQ6Y2xpZW50cyB1cGRhdGU6Y2xpZW50cyBkZWxldGU6Y2xpZW50cyBjcmVhdGU6Y2xpZW50cyByZWFkOmNsaWVudF9rZXlzIHVwZGF0ZTpjbGllbnRfa2V5cyBkZWxldGU6Y2xpZW50X2tleXMgY3JlYXRlOmNsaWVudF9rZXlzIHJlYWQ6Y29ubmVjdGlvbnMgdXBkYXRlOmNvbm5lY3Rpb25zIGRlbGV0ZTpjb25uZWN0aW9ucyBjcmVhdGU6Y29ubmVjdGlvbnMgcmVhZDpyZXNvdXJjZV9zZXJ2ZXJzIHVwZGF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGRlbGV0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGNyZWF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIHJlYWQ6ZGV2aWNlX2NyZWRlbnRpYWxzIHVwZGF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgZGVsZXRlOmRldmljZV9jcmVkZW50aWFscyBjcmVhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIHJlYWQ6cnVsZXMgdXBkYXRlOnJ1bGVzIGRlbGV0ZTpydWxlcyBjcmVhdGU6cnVsZXMgcmVhZDplbWFpbF9wcm92aWRlciB1cGRhdGU6ZW1haWxfcHJvdmlkZXIgZGVsZXRlOmVtYWlsX3Byb3ZpZGVyIGNyZWF0ZTplbWFpbF9wcm92aWRlciBibGFja2xpc3Q6dG9rZW5zIHJlYWQ6c3RhdHMgcmVhZDp0ZW5hbnRfc2V0dGluZ3MgdXBkYXRlOnRlbmFudF9zZXR0aW5ncyByZWFkOmxvZ3MgcmVhZDpzaGllbGRzIGNyZWF0ZTpzaGllbGRzIGRlbGV0ZTpzaGllbGRzIHVwZGF0ZTp0cmlnZ2VycyByZWFkOnRyaWdnZXJzIHJlYWQ6Z3JhbnRzIGRlbGV0ZTpncmFudHMgcmVhZDpndWFyZGlhbl9mYWN0b3JzIHVwZGF0ZTpndWFyZGlhbl9mYWN0b3JzIHJlYWQ6Z3VhcmRpYW5fZW5yb2xsbWVudHMgZGVsZXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGNyZWF0ZTpndWFyZGlhbl9lbnJvbGxtZW50X3RpY2tldHMgcmVhZDp1c2VyX2lkcF90b2tlbnMifQ.TJbaroU1w9gn5opb7-d9sep2W0dPOXkJ-7SCKsfYLhT9xugaPWoDMgGh15pVHUUCCknZRLsdAQIPNRmaU4WrVX90DiyTh2SMjiVa-1JX1EqK6xtWhJCA29sq4W9GAINXOHKT5tmIfQ9Dfbzv8HaQ7IQE7BYbU1C7B3aO8x_IGdNB3-L6NWC9NwGnQOdEuxVp4W55NHG4zKFGDDsIcsjdZghbBURp2Dtt5GSF6z-TJA33BMqz7FYcP3eBvbhT115PZO92ga_xS6f0Vp43ovkJF3R24LxsM_qGcpi19grRsUrgskT_Gr9n7qlqQCdsJ-5_M4G9eO3IrugBsFmOgG8Dzg',
  domain: 'floorcraftapp.auth0.com'
})

const jwtCheck = jwt({
  secret: 'jd2_ZLxBhaFETNH3_1cTbO10EX2MWuIXUIKA8xHoIZYylVt1Xsr2g9gbVHj4wy5L',
  audience: 'taQWcPVhkpPly1Xr9CXs1wFroWuSVptB'
})

/*********************************** ROUTES ***********************************/

module.exports = app => {

  // first check jwt, then fetch role straight from auth0
  app.use('/api/protected', jwtCheck, function (req, res, next) {

    auth0.users.getInfo(req.query.access_token).then(json => {
    const profile = JSON.parse(json)
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
          .then(body => { res.send(idobj)})
          .catch(err => { console.error(err); res.send({severity: "ERROR", err})})
      }, err => {
        res.send(err)
      })
      .catch(err => res.send(err))
   });

    app.post('/api/create_competition', (req, res) => {
      query2.create_competition(req.body).then(function (value){
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
              res.send(value[0]);
          },
          function (err){
              res.send(err);
          });
  });

  app.post('/api/delete_official', (req, res) => {
      const id = req.body.id
      query2.delete_official(id).then(function (value) {
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
          res.send(value);
      }, err =>{
          console.log(err);
          res.send(err);
      });
  });

  app.post('/api/competition/updateCompetitionCurrentRoundId', (req, res) => {
      query.update_competition_current_round_id(req.body).then(value => {
          res.send(value);
      }, err => {
          res.send(err);
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
          res.send(value);
      });
  })
  app.get('/api/competitions/:cid/unregistered', (req, res) => {
      const cid = parseInt(req.params.cid)
      query.get_other_competitions(cid).then(value => {
          res.send(value);
      });
  })

  app.get('/api/event/rounds/:rid', (req, res) => {
      const rid = parseInt(req.params.rid)
      query.get_rounds_in_same_event_as_round(rid).then(value => {
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
          '/api/officials'
      ]})
  })
}