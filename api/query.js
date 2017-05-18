const pool = require('./db');
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

const createRoundInsertBottomHelper = (resolve, reject, err, client, done, i, numRounds, couples, counter, values, ordernumber, eventid) => {
    if (i <= numRounds) {
        const size = Math.min(couples, NUM_COUPLES_FINAL_ROUND * Math.pow(2, numRounds - i));
        if (i == numRounds) {
            client.query(SQL`INSERT INTO round (eventid, name, ordernumber, size) VALUES (${eventid}, 'Final', ${ordernumber}, ${size})`, (err, result) => {
                if (err) {
                    rollback(client, done);
                    return reject(err);
                }
                createRoundInsertBottomHelper(resolve, reject, err, client, done, i + 1, numRounds, couples, counter, values, ordernumber + 1, eventid);
            });
        } else if (i == numRounds - 1) {
            client.query(SQL`INSERT INTO round (eventid, name, ordernumber, size) VALUES (${eventid}, 'Semifinal', ${ordernumber}, ${size})`, (err, result) => {
                if (err) {
                    rollback(client, done);
                    return reject(err);
                }
                createRoundInsertBottomHelper(resolve, reject, err, client, done, i + 1, numRounds, couples, counter, values, ordernumber + 1, eventid);
            });
        } else if (i == numRounds - 2) {
            client.query(SQL`INSERT INTO round (eventid, name, ordernumber, size) VALUES (${eventid}, 'Quarter', ${ordernumber}, ${size})`, (err, result) => {
                if (err) {
                    rollback(client, done);
                    return reject(err);
                }
                createRoundInsertBottomHelper(resolve, reject, err, client, done, i + 1, numRounds, couples, counter, values, ordernumber + 1, eventid);
            });
        } else {
            const name = 'Round ' + i;
            client.query(SQL`INSERT INTO round (eventid, name, ordernumber, size) VALUES (${eventid}, ${name}, ${ordernumber}, ${size})`, (err, result) => {
                if (err) {
                    rollback(client, done);
                    return reject(err);
                }
                createRoundInsertBottomHelper(resolve, reject, err, client, done, i + 1, numRounds, couples, counter, values, ordernumber + 1, eventid);
            });
        }
    } else {
        createRoundInsertTopHelper(resolve, reject, err, client, done, counter + 1, values, ordernumber);
    }
}

const createRoundInsertTopHelper = (resolve, reject, err, client, done, counter, values, ordernumber) => {
    if (counter < values.length) {
        const row = values[counter];
        const couples = parseInt(row.count);
        const eventid = row.id;
        const numRounds = Math.max(1, Math.ceil(Math.log2(couples / NUM_COUPLES_FINAL_ROUND) + 1));
        createRoundInsertBottomHelper(resolve, reject, err, client, done, 1, numRounds, couples, counter, values, ordernumber, eventid)
    } else {
        client.query('COMMIT', (err) => {
            if (err) {
                rollback(client, done);
                return reject(err);
            }
            done(null);
            resolve('{"finished": true}');
        });
    }
}

const create_rounds_for_events_for_competition = cid => {
    return new Promise(function(resolve, reject) {
       get_num_couples_per_event_for_competition(cid).then(value => {
          pool.connect(function(err, client, done) {
              if (err) {
                  console.error('error getting client', err);
                  reject(err);
              } else {
                  client.query(SQL`SELECT * FROM round LEFT JOIN event ON (round.eventid = event.id) WHERE competitionid = ${cid}`, (err, result) => {
                    if (err) {
                      return reject(err);
                    }
                    if (result.rowCount == 0) {
                      client.query('BEGIN', (err) => {
                        if (err) {
                            rollback(client, done);
                            return reject(err);
                        }
                        createRoundInsertTopHelper(resolve, reject, err, client, done, 0, value, 1);
                      });
                    }
                  });
              }
          })
       });
    });
}

const newEventsInsertHelper = (resolve, reject, err, client, done, counter, data) => {
    if (counter < data.rows.length) {
        const row = data.rows[counter];
        client.query(SQL`INSERT INTO newevents (id, stylename, levelname, dance, ordernumber) VALUES (${row.id}, ${row.stylename}, ${row.levelname}, ${row.dance}, ${row.ordernumber})`, (err, result) => {
            if (err) {
                rollback(client, done);
                return reject(err);
            }
            newEventsInsertHelper(resolve, reject, err, client, done, counter + 1, data);
        });
    } else {
        client.query(SQL`UPDATE newevents SET styleid = s.id FROM style s WHERE newevents.stylename = s.name AND s.competitionid = ${data.cid}`, (err, result) => {
            if (err) {
                console.log(err);
                rollback(client, done);
                return reject(err);
            }
            client.query(SQL`UPDATE newevents SET levelid = l.id FROM level l WHERE newevents.levelname = l.name AND l.competitionid = ${data.cid}`, (err, result) => {
                if (err) {
                    rollback(client, done);
                    return reject(err);
                }
                client.query(SQL`DELETE FROM event WHERE id NOT IN 
                    (SELECT id FROM newevents WHERE id IS NOT NULL) AND competitionid = ${data.cid} returning id`, (err, result) => {
                    if (err) {
                        rollback(client, done);
                        return reject(err);
                    }
                    client.query(SQL`UPDATE event e SET ordernumber = n.ordernumber FROM newevents n
                        WHERE e.id = n.id`, (err, result) => {
                        if (err) {
                            rollback(client, done);
                            return reject(err);
                        }
                        client.query(SQL`INSERT INTO event (competitionid, styleid, levelid, dance, ordernumber)
                            SELECT ${data.cid} AS competitionid, styleid, levelid, dance, ordernumber
                            FROM newevents
                            WHERE id IS NULL`, (err, result) => {
                            if (err) {
                                rollback(client, done);
                                return reject(err);
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
                    });
                });
            });
        });
    }
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
                   newEventsInsertHelper(resolve, reject, err, client, done, 0, data);
               });
           }
        });
    });
}

const newStylesInsertHelper = (resolve, reject, err, client, done, counter, data) => {
    if (counter < data.styles.length) {
        const row = data.styles[counter];
        client.query(SQL`INSERT INTO newrows (id, name, ordernumber) VALUES (${row.id}, ${row.name}, ${row.ordernumber})`, (err, result) => {
            if (err) {
                rollback(client, done);
                return reject(err);
            }
            newStylesInsertHelper(resolve, reject, err, client, done, counter + 1, data);
        });
    } else {
        client.query(SQL`DELETE FROM style WHERE id NOT IN 
                    (SELECT id FROM newrows WHERE id IS NOT NULL) AND competitionid = ${data.cid}`, (err, result) => {
            if (err) {
                rollback(client, done);
                return reject(err);
            }
            client.query(SQL`UPDATE style s SET ordernumber = n.ordernumber FROM newrows n
                    WHERE s.id = n.id`, (err, result) => {
                if (err) {
                    rollback(client, done);
                    return reject(err);
                }
                client.query(SQL`INSERT INTO style (name, ordernumber, competitionid)
                    SELECT name, ordernumber, ${data.cid} AS competitionid
                    FROM newrows
                    WHERE id IS NULL`, (err, result) => {
                    if (err) {
                        rollback(client, done);
                        return reject(err);
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
            });
        });
    }
}

const newLevelsInsertHelper = (resolve, reject, err, client, done, counter, data) => {
    if (counter < data.levels.length) {
        const row = data.levels[counter];
        client.query(SQL`INSERT INTO newrows (id, name, ordernumber) VALUES (${row.id}, ${row.name}, ${row.ordernumber})`, (err, result) => {
            if (err) {
                rollback(client, done);
                return reject(err);
            }
            newLevelsInsertHelper(resolve, reject, err, client, done, counter + 1, data);
        });
    } else {
        client.query(SQL`DELETE FROM level WHERE id NOT IN 
                    (SELECT id FROM newrows WHERE id IS NOT NULL) AND competitionid = ${data.cid}`, (err, result) => {
            if (err) {
                rollback(client, done);
                return reject(err);
            }
            client.query(SQL`UPDATE level l SET ordernumber = n.ordernumber FROM newrows n
                    WHERE l.id = n.id`, (err, result) => {
                if (err) {
                    rollback(client, done);
                    return reject(err);
                }
                client.query(SQL`INSERT INTO level (name, ordernumber, competitionid)
                    SELECT name, ordernumber, ${data.cid} AS competitionid
                    FROM newrows
                    WHERE id IS NULL`, (err, result) => {
                    if (err) {
                        rollback(client, done);
                        return reject(err);
                    }
                    client.query('TRUNCATE newrows', (err) => {
                        if (err) {
                            rollback(client, done);
                            return reject(err);
                        }
                        newStylesInsertHelper (resolve, reject, err, client, done, 0, data)
                    });
                });
            });
        });
    }
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
                        newLevelsInsertHelper(resolve, reject, err, client, done, 0, data);
                    });
                });
            }
        });
    });
}

const newRoundsInsertHelper = (resolve, reject, err, client, done, counter, data) => {
    if (counter < data.rows.length) {
        const row = data.rows[counter];
        client.query(SQL`INSERT INTO newrounds (id, levelname, stylename, dance, name, ordernumber, size, callbackscalculated) 
                          VALUES (${row.id}, ${row.levelname}, ${row.stylename}, ${row.dance}, ${row.round}, ${row.ordernumber}, ${row.size}, ${row.callbackscalculated})`, (err, result) => {
            if (err) {
                rollback(client, done);
                return reject(err);
            }
            newRoundsInsertHelper(resolve, reject, err, client, done, counter + 1, data);
        });
    } else {
        client.query(SQL`UPDATE newrounds SET styleid = s.id FROM style s WHERE newrounds.stylename = s.name AND s.competitionid = ${data.cid}`, (err, result) => {
            if (err) {
                console.log(err);
                rollback(client, done);
                return reject(err);
            }
            client.query(SQL`UPDATE newrounds SET levelid = l.id FROM level l WHERE newrounds.levelname = l.name AND l.competitionid = ${data.cid}`, (err, result) => {
                if (err) {
                    rollback(client, done);
                    return reject(err);
                }
                client.query(SQL`UPDATE newrounds SET eventid = e.id FROM event e WHERE newrounds.levelid = e.levelid AND newrounds.styleid = e.styleid AND newrounds.dance = e.dance AND e.competitionid = ${data.cid}`, (err, result) => {
                    if (err) {
                        rollback(client, done);
                        return reject(err);
                    }
                    client.query(SQL`DELETE FROM round USING round AS rd
                        LEFT JOIN event ON (rd.eventid = event.id) 
                        WHERE round.id NOT IN 
                        (SELECT id FROM newrounds WHERE id IS NOT NULL) AND competitionid = ${data.cid}`, (err, result) => {
                        if (err) {
                            rollback(client, done);
                            return reject(err);
                        }
                        client.query(SQL`UPDATE round r SET name = n.name, ordernumber = n.ordernumber FROM newrounds n
                            WHERE r.id = n.id`, (err, result) => {
                            if (err) {
                                rollback(client, done);
                                return reject(err);
                            }
                            client.query(SQL`INSERT INTO round (eventid, name, ordernumber, size, callbackscalculated)
                                SELECT eventid, name, ordernumber, size, callbackscalculated
                                FROM newrounds
                                WHERE id IS NULL`, (err, result) => {
                                if (err) {
                                    rollback(client, done);
                                    console.log(err);
                                    return reject(err);
                                }
                                client.query(SQL`SELECT id FROM newrounds ORDER BY ordernumber LIMIT 1`, (err, result) => {
                                    if (err) {
                                        rollback(client, done);
                                        return reject(err);
                                    }
                                    client.query(SQL`UPDATE competition SET currentroundid = ${result.rows[0].id}`, (err) => {
                                        if (err) {
                                            rollback(client, done);
                                            return reject(err);
                                        }
                                        client.query('COMMIT', (err) => {
                                            if (err) {
                                                rollback(client, done);
                                                return reject(err);
                                            }
                                            done(null);
                                            resolve('{"finished": true}');
                                        });
                                    })
                                })
                            });
                        });
                    });
                });
            });
        });
    }
}

const update_rounds_for_competition = data => {
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
                       newRoundsInsertHelper(resolve, reject, err, client, done, 0, data);
                   });
               });
           }
        });
    });
}
//
const calculate_callbacks_for_round = (data) => {
    return new Promise(function(resolve, reject) {
       pool.connect(function(err, client, done) {
          if (err) {
              console.error('error getting client', err);
              reject(err);
          } else {
              client.query('BEGIN', (err) => {
                  if (err) {
                      rollback(client, done);
                      reject(err);
                  } else {
                      client.query(SQL`CREATE TEMPORARY TABLE topcallbacks (
                        number integer
                        ) ON COMMIT DROP`, (err, result) => {
                          if (err) {
                              rollback(client, done);
                              reject(err);
                          } else {
                              client.query(SQL`WITH ranking AS (SELECT COUNT(judgeid) as c, number FROM callback WHERE roundid = ${data.rid} GROUP BY number ORDER BY c DESC LIMIT ${data.size})
                                    INSERT INTO topcallbacks (number) SELECT number FROM callback WHERE roundid = ${data.rid} 
                                    GROUP BY number HAVING COUNT(judgeid) >= (SELECT MIN(c) FROM ranking)`, (err) => {
                                  if (err) {
                                      rollback(client, done);
                                      reject(err);
                                  } else {
                                      client.query(SQL`UPDATE partnership SET calledback = false FROM topcallbacks WHERE partnership.number NOT IN (SELECT number FROM topcallbacks) AND eventid = ${data.eventid}`, (err) => {
                                         if (err) {
                                             rollback(client, done);
                                             reject(err);
                                         } else {
                                             client.query(SQL`UPDATE round SET callbackscalculated = true WHERE id = ${data.rid}`, (err) => {
                                                if (err) {
                                                    rollback(client, done);
                                                    reject(err);
                                                } else {
                                                    client.query('COMMIT', (err) => {
                                                        if (err) {
                                                            rollback(client, done);
                                                            return reject(err);
                                                        }
                                                        done(null);
                                                        resolve('{"finished": true}');
                                                    });
                                                }
                                             });
                                         }
                                      });
                                  }
                              });
                          }
                      });
                  }
              })
          }
       });
    });
}

const callbacksInsertHelper = (resolve, reject, err, client, done, counter, callbacks) => {
    if (counter < callbacks.length) {
        const data = callbacks[counter];
        client.query(SQL`INSERT INTO callback (judgeid, number, roundid, competitionid) 
            VALUES (${data.jid}, ${data.number}, ${data.rid}, ${data.cid})`, (err, result) => {
                if (err) {
                    rollback(client, done);
                    return reject(err);
                }
                callbacksInsertHelper(resolve, reject, err, client, done, counter + 1, callbacks);
        });
    } else {
        client.query('COMMIT', (err) => {
            if (err) {
                rollback(client, done);
                return reject(err);
            }
            done(null);
            resolve('{"finished": true}');
        });
    }
}

const update_callbacks_for_round_and_judge = (data) => {
    console.log("data", data);
    return new Promise(function(resolve, reject) {
       pool.connect(function(err, client, done) {
          if (err) {
              console.error('error getting client', err);
              reject(err);
          }  else {
              client.query('BEGIN', (err) => {
                  if (err) {
                      rollback(client, done);
                      reject(err);
                  }
                  client.query(SQL`DELETE FROM callback WHERE roundid = ${data.rid} AND judgeid = ${data.jid}`, (err) => {
                     if (err) {
                         rollback(client, done);
                         reject(err);
                     }
                     callbacksInsertHelper(resolve, reject, err, client, done, 0, data.callbacks);
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

const get_judges_submitted_round = (rid) => {
    return pool.query(SQL`SELECT DISTINCT ON (id) official.id, firstname, lastname FROM callback LEFT JOIN official ON (callback.judgeid = official.id) WHERE roundid = ${rid};`);
}

const get_official = id => {
    return pool.query(SQL`SELECT official.*, role.name as rolename FROM official
      LEFT JOIN role ON(roleid = role.id) 
      WHERE id = ${id}`);
}

const get_affiliations = () => {
    return pool.query('SELECT * FROM affiliation');
}

const get_competitions = (email) => {
    return pool.query(SQL`SELECT * FROM competition WHERE compadmin = ${email} ORDER BY startdate`);
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

const get_rounds_in_same_event_as_round = rid => {
  return pool.query(SQL`SELECT * FROM round WHERE eventid IN (SELECT eventid FROM round WHERE id = ${rid}) ORDER BY ordernumber`);
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
    get_judges_submitted_round,
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
    get_rounds_in_same_event_as_round,
    get_competitors_for_competition,
    get_competitors_for_round,
    get_affiliations_for_competition,
    get_num_competitors_per_style_for_competition,
    create_rounds_for_events_for_competition,
    update_events_for_competition,
    update_levels_and_styles_for_competition,
    update_rounds_for_competition,
    update_callbacks_for_round_and_judge,
    update_competition_info,
    update_competition_current_round_id,
    calculate_callbacks_for_round
}
