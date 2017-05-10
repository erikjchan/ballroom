const pool = require('./api/db');
const SQL = require('sql-template-strings')

//     //to run a query we just pass it to the pool
//     //after we're done nothing has to be taken care of
//     //we don't have to return any client to the pool or close a connection

const rollback = (client, done) => {
    client.query('ROLLBACK', (err) => {
        return done(err);
    });
}

const get_num_couples_per_event_for_competition = cid => {
    return pool.query(SQL`SELECT COUNT(p.number), e.id
        FROM partnership p
        LEFT JOIN event e ON (e.id = p.eventid)
        WHERE p.competitionid = ${cid}
        GROUP BY e.id`);
}

const NUM_COUPLES_FINAL_ROUND = 7;

const create_rounds_for_events_for_competition = cid => {
    return new Promise(function(resolve, reject) {
       get_num_couples_per_event_for_competition(cid).then(value => {
          pool.connect(function(err, client, done) {
              if (err) {
                  console.error('error getting client', err);
                  reject(err);
              } else {
                  client.query('SELECT * FROM round', (err, result) => {
                    if (err) {
                      return reject(err);
                    }
                    if (result.rowCount == 0) {
                      client.query('BEGIN', (err) => {
                        if (err) {
                            rollback(client, done);
                            return reject(err);
                        }
                        let ordernumber = 1;
                        for (let row of value) {
                            let couples = parseInt(row.count);
                            let eventid = row.id;
                            let numRounds = Math.max(1, Math.ceil(Math.log2(couples / NUM_COUPLES_FINAL_ROUND) + 1));
                            for (let i = 1; i <= numRounds; i++) {
                                let size = Math.min(couples, NUM_COUPLES_FINAL_ROUND * Math.pow(2, numRounds - i));
                                if (i == numRounds) {
                                    client.query(SQL`INSERT INTO round (eventid, name, ordernumber, size) VALUES (${eventid}, 'Final', ${ordernumber}, ${size})`, (err, result) => {
                                        if (err) {
                                            rollback(client, done);
                                            return reject(err);
                                        }
                                    });
                                } else if (i == numRounds - 1) {
                                    client.query(SQL`INSERT INTO round (eventid, name, ordernumber, size) VALUES (${eventid}, 'Semifinal', ${ordernumber}, ${size})`, (err, result) => {
                                        if (err) {
                                            rollback(client, done);
                                            return reject(err);
                                        }
                                    });
                                } else if (i == numRounds - 2) {
                                    client.query(SQL`INSERT INTO round (eventid, name, ordernumber, size) VALUES (${eventid}, 'Quarter', ${ordernumber}, ${size})`, (err, result) => {
                                        if (err) {
                                            rollback(client, done);
                                            return reject(err);
                                        }
                                    });
                                } else {
                                    const name = 'Round ' + i;
                                    client.query(SQL`INSERT INTO round (eventid, name, ordernumber, size) VALUES (${eventid}, ${name}, ${ordernumber}, ${size})`, (err, result) => {
                                        if (err) {
                                            rollback(client, done);
                                            return reject(err);
                                        }
                                    });
                                }
                                ordernumber++;
                            }
                        }
                        client.query('COMMIT', (err) => {
                            if (err) {
                                rollback(client, done);
                                return reject(err);
                            }
                            done(null);
                            resolve('{"finished": true}');
                        });
                      });
                    }
                  });
              }
          })
       });
    });
}

const update_events_for_competition = data => {
    return new Promise(function(resolve, reject) {
        pool.connect(function(err, client, done) {
           if (err) {
               console.error('error getting client', err);
               reject(err);
           } else {
               client.query('BEGIN', (err) => {
                   if (err) {
                       rollback(client, done);
                       return reject(err);
                   }
                   client.query(SQL`CREATE TEMPORARY TABLE newevents (
                        id integer,
                        styleid integer,
                        stylename character varying(30),
                        levelid integer,
                        levelname character varying(30),
                        dance character varying(30),
                        ordernumber integer
                        ) ON COMMIT DROP`, (err, result) => {
                       if (err) {
                           rollback(client, done);
                           return reject(err);
                       }
                   });
                   for (let row of data.rows) {
                       client.query(SQL`INSERT INTO newevents (id, stylename, levelname, dance, ordernumber) VALUES (${row.id}, ${row.stylename}, ${row.levelname}, ${row.dance}, ${row.ordernumber})`, (err, result) => {
                           if (err) {
                               rollback(client, done);
                               return reject(err);
                           }
                       });
                   }
                   client.query(SQL`UPDATE newevents SET styleid = s.id FROM style s WHERE newevents.stylename = s.name AND s.competitionid = ${data.cid}`, (err, result) => {
                       if (err) {
                           console.log(err);
                           rollback(client, done);
                           return reject(err);
                       }
                   });
                   client.query(SQL`UPDATE newevents SET levelid = l.id FROM level l WHERE newevents.levelname = l.name AND l.competitionid = ${data.cid}`, (err, result) => {
                       if (err) {
                           rollback(client, done);
                           return reject(err);
                       }
                   });
                   client.query(SQL`DELETE FROM event WHERE id NOT IN 
                    (SELECT id FROM newevents WHERE id IS NOT NULL) AND competitionid = ${data.cid} returning id`, (err, result) => {
                       if (err) {
                           rollback(client, done);
                           return reject(err);
                       }
                       console.log("deleted ids", result.rows);
                   });
                   client.query(SQL`UPDATE event e SET ordernumber = n.ordernumber FROM newevents n
                    WHERE e.id = n.id`, (err, result) => {
                       if (err) {
                           rollback(client, done);
                           return reject(err);
                       }
                   });
                   client.query(SQL`INSERT INTO event (competitionid, styleid, levelid, dance, ordernumber)
                    SELECT ${data.cid} AS competitionid, styleid, levelid, dance, ordernumber
                    FROM newevents
                    WHERE id IS NULL`, (err, result) => {
                       if (err) {
                           rollback(client, done);
                           return reject(err);
                       }
                   });
                   client.query('COMMIT', (err) => {
                       if (err) {
                           rollback(client, done);
                           return reject(err);
                       }
                       done(null);
                       resolve('{"finished": true}');
                   });
               });
           }
        });
    });
}

const update_levels_and_styles_for_competition = data => {
    return new Promise(function(resolve, reject) {
        pool.connect(function(err, client, done) {
            if (err) {
                console.error('error getting client', err);
                reject(err);
            } else {
                client.query('BEGIN', (err) => {
                    if (err) {
                        rollback(client, done);
                        return reject(err);
                    }
                    client.query(SQL`CREATE TEMPORARY TABLE newrows (
                        id integer,
                        name character varying(30),
                        ordernumber integer
                        ) ON COMMIT DROP`, (err, result) => {
                        if (err) {
                            rollback(client, done);
                            return reject(err);
                        }
                    });
                    console.log("levels", data.levels);
                    for (let row of data.levels) {
                        client.query(SQL`INSERT INTO newrows (id, name, ordernumber) VALUES (${row.id}, ${row.name}, ${row.ordernumber})`, (err, result) => {
                            if (err) {
                                rollback(client, done);
                                return reject(err);
                            }
                        });
                    }
                    client.query(SQL`DELETE FROM level WHERE id NOT IN 
                    (SELECT id FROM newrows WHERE id IS NOT NULL) AND competitionid = ${data.cid}`, (err, result) => {
                        if (err) {
                            rollback(client, done);
                            return reject(err);
                        }
                    });
                    client.query(SQL`UPDATE level l SET ordernumber = n.ordernumber FROM newrows n
                    WHERE l.id = n.id`, (err, result) => {
                        if (err) {
                            rollback(client, done);
                            return reject(err);
                        }
                    });
                    client.query(SQL`INSERT INTO level (name, ordernumber, competitionid)
                    SELECT name, ordernumber, ${data.cid} AS competitionid
                    FROM newrows
                    WHERE id IS NULL`, (err, result) => {
                        if (err) {
                            rollback(client, done);
                            return reject(err);
                        }
                    });
                    client.query('TRUNCATE newrows', (err) => {
                        if (err) {
                            rollback(client, done);
                            return reject(err);
                        }
                    });
                    for (let row of data.styles) {
                        client.query(SQL`INSERT INTO newrows (id, name, ordernumber) VALUES (${row.id}, ${row.name}, ${row.ordernumber})`, (err, result) => {
                            if (err) {
                                rollback(client, done);
                                return reject(err);
                            }
                        });
                    }
                    client.query(SQL`DELETE FROM style WHERE id NOT IN 
                    (SELECT id FROM newrows WHERE id IS NOT NULL) AND competitionid = ${data.cid}`, (err, result) => {
                        if (err) {
                            rollback(client, done);
                            return reject(err);
                        }
                    });
                    client.query(SQL`UPDATE style s SET ordernumber = n.ordernumber FROM newrows n
                    WHERE s.id = n.id`, (err, result) => {
                        if (err) {
                            rollback(client, done);
                            return reject(err);
                        }
                    });
                    client.query(SQL`INSERT INTO style (name, ordernumber, competitionid)
                    SELECT name, ordernumber, ${data.cid} AS competitionid
                    FROM newrows
                    WHERE id IS NULL`, (err, result) => {
                        if (err) {
                            rollback(client, done);
                            return reject(err);
                        }
                    });
                    client.query('COMMIT', (err) => {
                        if (err) {
                            rollback(client, done);
                            return reject(err);
                        }
                        done(null);
                        resolve('{"finished": true}');
                    });
                });
            }
        });
    });
}

const update_rounds_for_competition = data => {
    console.log("data", data);
    return new Promise(function(resolve, reject) {
        pool.connect(function(err, client, done) {
           if (err) {
               console.error('error getting client', err);
               reject(err);
           } else {
               client.query('BEGIN', (err) => {
                   if (err) {
                       rollback(client, done);
                       return reject(err);
                   }
                   client.query(SQL`CREATE TEMPORARY TABLE newrounds (
                        id integer,
                        levelid integer,
                        levelname character varying(100),
                        styleid integer,
                        stylename character varying(100),
                        dance character varying(100),
                        eventid integer,
                        name character varying(100),
                        ordernumber integer,
                        size integer,
                        callbackscalculated boolean
                        ) ON COMMIT DROP`, (err, result) => {
                       if (err) {
                           rollback(client, done);
                           return reject(err);
                       }
                   });
                   for (let row of data.rows) {
                       client.query(SQL`INSERT INTO newrounds (id, levelname, stylename, dance, name, ordernumber, size, callbackscalculated) 
                          VALUES (${row.id}, ${row.levelname}, ${row.stylename}, ${row.dance}, ${row.round}, ${row.ordernumber}, ${row.size}, ${row.callbackscalculated})`, (err, result) => {
                           if (err) {
                               rollback(client, done);
                               return reject(err);
                           }
                       });
                   }
                   client.query(SQL`UPDATE newrounds SET styleid = s.id FROM style s WHERE newrounds.stylename = s.name AND s.competitionid = ${data.cid}`, (err, result) => {
                       if (err) {
                           console.log(err);
                           rollback(client, done);
                           return reject(err);
                       }
                   });
                   client.query(SQL`UPDATE newrounds SET levelid = l.id FROM level l WHERE newrounds.levelname = l.name AND l.competitionid = ${data.cid}`, (err, result) => {
                       if (err) {
                           rollback(client, done);
                           return reject(err);
                       }
                   });
                   client.query(SQL`UPDATE newrounds SET eventid = e.id FROM event e WHERE newrounds.levelid = e.levelid AND newrounds.styleid = e.styleid AND newrounds.dance = e.dance AND e.competitionid = ${data.cid}`, (err, result) => {
                       if (err) {
                           rollback(client, done);
                           return reject(err);
                       }
                   });
                   client.query(SQL`DELETE FROM round WHERE id NOT IN 
                    (SELECT id FROM newrounds WHERE id IS NOT NULL) AND competitionid = ${data.cid}`, (err, result) => {
                       if (err) {
                           rollback(client, done);
                           return reject(err);
                       }
                   });
                   client.query(SQL`UPDATE round r SET name = n.name, ordernumber = n.ordernumber FROM newrounds n
                    WHERE r.id = n.id`, (err, result) => {
                       if (err) {
                           rollback(client, done);
                           return reject(err);
                       }
                   });
                   client.query(SQL`INSERT INTO round (eventid, name, ordernumber, size, callbackscalculated)
                    SELECT eventid, name, ordernumber, size, callbackscalculated
                    FROM newrounds
                    WHERE id IS NULL`, (err, result) => {
                       if (err) {
                           rollback(client, done);
                           console.log(err);
                           return reject(err);
                       }
                   });
                   client.query('COMMIT', (err) => {
                       if (err) {
                           rollback(client, done);
                           return reject(err);
                       }
                       done(null);
                       resolve('{"finished": true}');
                   });
               });
           }
        });
    });
}

const update_competition_info = data => {
    return pool.query(SQL`UPDATE competition SET name = ${data.name}, leadidstartnum = ${data.leadidstartnum},
        locationname = ${data.locationname}, earlyprice = ${data.earlyprice}, regularprice = ${data.regularprice},
        lateprice = ${data.lateprice}, startdate = ${data.startdate}, enddate = ${data.enddate}, 
        regstartdate = ${data.regstartdate}, earlyregdeadline = ${data.earlyregdeadline}, 
        regularregdeadline = ${data.regularregdeadline}, lateregdeadline = ${data.lateregdeadline},
        description = ${data.description} WHERE id = ${data.id}`);
}

const update_competition_current_round_id = data => {
    return pool.query(SQL`UPDATE competition SET currentroundid = ${data.rid} WHERE id = ${data.cid}`);
}

const get_all_admins = () => {
    return pool.query('SELECT * FROM admin');
}

const get_roles = () => {
  return pool.query('SELECT * FROM role');
}

const get_officials_for_competition = (comp_id) => {
    return pool.query(SQL`SELECT official.*, role.name as rolename FROM official
      LEFT JOIN role ON(roleid = role.id) 
      WHERE competitionid = ${comp_id} ORDER BY roleid`);
}

const get_judges_for_competition = (comp_id) => {
    return pool.query(SQL`SELECT official.* FROM official
      LEFT JOIN role ON(roleid = role.id) 
      WHERE competitionid = ${comp_id} AND role.name = 'Adjudicator'`);
}

const get_official = id => {
    return pool.query(SQL`SELECT official.*, role.name as rolename FROM official
      LEFT JOIN role ON(roleid = role.id) 
      WHERE id = ${id}`);
}

const get_affiliations = () => {
    return pool.query('SELECT * FROM affiliation');
}

const get_competitions = () => {
    return pool.query('SELECT * FROM competition ORDER BY startdate');
}

const get_your_competitions = (cid) => {
    return pool.query(SQL`SELECT * FROM competition
                          WHERE EXISTS
                                (SELECT * FROM paymentrecord
                                 WHERE competition.id = competitionid
                                       AND
                                       competitorid = ${cid}) ORDER BY startdate;`);
}

const get_other_competitions = (cid) => {
    return pool.query(SQL`SELECT * FROM competition
                          WHERE NOT EXISTS
                                (SELECT * FROM paymentrecord
                                 WHERE competition.id = competitionid
                                       AND
                                       competitorid = ${cid}) ORDER BY startdate;`);
}


const get_levels_for_competition = cid => {
    return pool.query(SQL`SELECT id, name, ordernumber FROM level WHERE competitionid = ${cid} ORDER BY ordernumber`);
}

const get_styles_for_competition = cid => {
    return pool.query(SQL`SELECT id, name, ordernumber FROM style WHERE competitionid = ${cid} ORDER BY ordernumber`);
}

const get_competition_info = cid => {
    return pool.query(SQL`SELECT * FROM competition WHERE id = ${cid}`);
}

const get_events_for_competition = cid => {
    return pool.query(SQL`SELECT event.id, style.name as stylename, level.name as levelname, dance, event.ordernumber FROM event  
        LEFT JOIN style ON (style.id = event.styleid) 
        LEFT JOIN level ON (level.id = event.levelid)
        WHERE event.competitionid = ${cid} ORDER BY ordernumber`);
}

const get_rounds_for_competition = cid => {
    return pool.query(SQL`SELECT r.id, l.name as levelname, l.ordernumber as levelorder, s.name as stylename, s.ordernumber as styleorder, e.dance, e.ordernumber as eventorder, r.name as round, r.ordernumber, r.size, 
        r.callbackscalculated, r.eventid FROM round r
        LEFT JOIN event e ON (e.id = r.eventid) 
        LEFT JOIN level l ON (e.levelid = l.id)
        LEFT JOIN style s ON (e.styleid = s.id) 
        WHERE e.competitionid = ${cid} ORDER BY r.ordernumber`);
}

const get_current_round_for_competition = cid => {
  return pool.query(SQL`SELECT currentroundid FROM competition where id = ${cid}`);
}

const get_competitors_for_competition = cid => {
    return pool.query(SQL`SELECT DISTINCT ON (id) c.id, firstname || ' ' || lastname as name, email, 
        CASE WHEN c.id = p.leadcompetitorid THEN p.number ELSE NULL END as number, a.name as affiliationname, 
        pr.paidwithaffiliation, pr.amount FROM competitor c 
        LEFT JOIN partnership p ON (c.id = p.leadcompetitorid OR c.id = p.followcompetitorid) 
        LEFT JOIN paymentrecord pr ON (c.id = pr.competitorid) 
        LEFT JOIN  affiliation a ON (c.affiliationid = a.id) 
        WHERE p.competitionid = ${cid}`);
}

const get_competitors_for_round = rid => {
  return pool.query(SQL`SELECT number FROM partnership WHERE eventid IN (SELECT eventid FROM round WHERE id = ${rid}) AND calledback = true`);
}

const get_affiliations_for_competition = cid => {
    return pool.query(SQL`SELECT DISTINCT ON (affiliationname) a.name as affiliationname
        FROM competitor c 
        LEFT JOIN partnership p ON (c.id = p.leadcompetitorid OR c.id = p.followcompetitorid)
        LEFT JOIN  affiliation a ON (c.affiliationid = a.id) 
        WHERE p.competitionid = ${cid}`);
}

const get_num_competitors_per_style_for_competition = cid => {
    return pool.query(SQL`SELECT COUNT(c.id), s.name
        FROM competitor c 
        LEFT JOIN partnership p ON (c.id = p.leadcompetitorid OR c.id = p.followcompetitorid)
        LEFT JOIN event e ON (e.id = p.eventid)
        LEFT JOIN style s ON (e.styleid = s.id)
        WHERE p.competitionid = ${cid}
        GROUP BY s.name`)
}

// INSERT

// DELETE

module.exports = {
    get_all_admins,
    get_roles,
    get_officials_for_competition,
    get_judges_for_competition,
    get_official,
    get_affiliations,
    get_competitions,
    get_your_competitions,
    get_other_competitions,
    get_levels_for_competition,
    get_styles_for_competition,
    get_competition_info,
    get_events_for_competition,
    get_rounds_for_competition,
    get_competitors_for_competition,
    get_competitors_for_round,
    get_affiliations_for_competition,
    get_num_competitors_per_style_for_competition,
    create_rounds_for_events_for_competition,
    update_events_for_competition,
    update_levels_and_styles_for_competition,
    update_rounds_for_competition,
    update_competition_info,
    update_competition_current_round_id
}
