const pool = require('./api/db');
const SQL = require('sql-template-strings')

const rollback = (client, done) => {
    client.query('ROLLBACK', (err) => {
        return done(err);
    });
}

/*******************************************
 ***  Query about competitor START HERE ****
 *******************************************/
// SELECT
const get_all_competitors = () => {
    return pool.query('SELECT * FROM competitor;', []);
}

// const get_competitors_by_competition = (id) => {
//     return pool.query(SQL`SELECT * FROM competitor 
//                           WHERE EXISTS 
//                                 (SELECT * FROM partnership
//                                  WHERE partnership.competitionid = ${id} 
//                                        AND
//                                        (partnership.leadcompetitorid = competitor.id
//                                        OR partnership.followcompetitorid = competitor.id));`);
// }

const get_competitor_by_id = (id) => {
    return pool.query(SQL`SELECT DISTINCT competitor.*, affiliation.name as affiliationname, partnership.number as number
                          FROM competitor
                          LEFT JOIN affiliation ON competitor.affiliationid = affiliation.id
                          LEFT JOIN partnership ON leadcompetitorid = competitor.id
                          WHERE competitor.id = ${id};`);
}

const get_competitor_by_email = (email) => {
    return pool.query(SQL`SELECT * FROM competitor WHERE email = ${email};`);
}

const check_competitor_email_exist = (email) => {
    return pool.query_wrapped(SQL`SELECT * FROM competitor WHERE email = ${email};`)
                .then(function(value){
                    return (value.rowCount>0);
                });
}

// INSERT
const create_competitor = (firstname, lastname, email, mailingaddress, 
    affiliationid) => {
    return pool.query_wrapped(SQL`INSERT INTO competitor (firstname, lastname, email, mailingaddress,
                                                  affiliationid, hasregistered)
                          VALUES (${firstname}, ${lastname}, ${email}, ${mailingaddress}, 
                                  ${affiliationid}, ${false});`);
}

// UPDATE
const update_competitor_by_email = (email, firstname, lastname, mailingaddress, 
    affiliationid,  hasregistered) => {
    return pool.query_wrapped(SQL`UPDATE competitor 
                          SET firstname=${firstname} , lastname=${lastname},
                              mailingaddress=${mailingaddress}, affiliationid=${affiliationid}, 
                              hasregistered=${hasregistered}
                          WHERE email=${email};`);
}

const update_competitor_by_id = (id, firstname, lastname, mailingaddress, 
    affiliationid, hasregistered) => {
    return pool.query_wrapped(SQL`UPDATE competitor 
                          SET firstname=${firstname} , lastname=${lastname},
                              mailingaddress=${mailingaddress}, affiliationid=${affiliationid}, 
                               hasregistered=${hasregistered}
                          WHERE id=${id};`);
}
//DELETE

/**********************************************
 ***  Query about paymentrecord START HERE ****
 **********************************************/
// SELECT
const get_all_paymentrecords = () => {
    return pool.query(SQL`SELECT * FROM paymentrecord;`);
}


const get_paymentrecords_by_competition = (id) => {
    return pool.query(SQL`SELECT * FROM paymentrecord WHERE competitionid = ${id};`);
}

const get_paymentrecords_by_competitior = (id) => {
    return pool.query(SQL`SELECT * FROM paymentrecord WHERE competitorid = ${id};`);
}

const get_paymentrecord_by_competition_competitor = (competitionid, competitorid) => {
    return pool.query(SQL`SELECT * FROM paymentrecord 
                          WHERE competitionid = ${competitionid} and competitorid = ${competitorid};`);
}

// INSERT
const create_paymentrecord = (competitionid, competitorid, amount, online, paidwithaffiliation) => {
    return pool.query_wrapped(SQL`INSERT INTO paymentrecord (competitionid, timestamp, competitorid, amount, 
                                                     online, paidwithaffiliation)
                          VALUES (${competitionid}, now(), ${competitorid}, ${amount}, 
                                  ${online}, ${paidwithaffiliation});`);
}

// UPDATE
const update_paymentrecord = (competitionid, competitorid, amount, online, paidwithaffiliation) => {
    return pool.query_wrapped(SQL`UPDATE paymentrecord 
                          SET timestamp = now(), amount = ${amount},
                              online = ${online}, paidwithaffiliation = ${paidwithaffiliation}
                          WHERE competitionid = ${competitionid} AND competitorid = ${competitorid};`);
}

// DELETE

/**********************************************
 ***  Query about partnership START HERE ****
 **********************************************/

// SELECT
const get_all_partnerships = () => {
    return pool.query(SQL`SELECT * FROM partnership;`);
}

const get_partnerships_by_competitor = (competitorid) => {
    return pool.query(SQL`SELECT * FROM partnership 
                          WHERE leadcompetitorid = ${competitorid} OR followcompetitorid = ${competitorid};`);
}

const get_comfirmed_partnerships_by_competition_competitor = (competitionid, competitorid) => {
    return pool.query(SQL`SELECT partnership.*, event.dance as dance,
                                style.name as style, level.name as level,
                                competitor1.firstname as leadfirstname, competitor1.lastname as leadlastname, 
                                competitor2.firstname as followfirstname, competitor2.lastname as followlastname  
                          FROM partnership
                          LEFT JOIN event
                          ON partnership.eventid = event.id
                          LEFT JOIN style
                          ON style.id = event.styleid
                          LEFT JOIN level
                          ON level.id = event.levelid
                          LEFT JOIN competitor as competitor1
                          ON competitor1.id = partnership.leadcompetitorid
                          LEFT JOIN competitor as competitor2
                          ON competitor2.id = partnership.followcompetitorid                     
                          WHERE (leadcompetitorid = ${competitorid} OR followcompetitorid = ${competitorid})
                                AND leadconfirmed = ${true} AND followconfirmed = ${true}
                                AND partnership.competitionid = ${competitionid};`);
}

const get_partnerships_by_competition_competitor = (competitionid, competitorid) => {
    return pool.query(SQL`SELECT * FROM partnership 
                          WHERE competitionid = ${competitionid} AND 
                                (leadcompetitorid = ${competitionid} OR followcompetitorid = ${competitorid});`);
}

const get_partnership = (leadcompetitorid, followcompetitorid, eventid) => {
    return pool.query(SQL`SELECT * FROM partnership 
                          WHERE leadcompetitorid = ${leadcompetitorid} AND followcompetitorid = ${followcompetitorid}
                                AND eventid = ${eventid};`
                                );
}

const get_partnerships_by_event = eventid =>{
    return pool.query(SQL`SELECT * FROM partnership 
                          WHERE eventid = ${eventid};`);
}

const get_comfirmed_partnerships_by_event = eventid =>{
    return pool.query(SQL`SELECT * FROM partnership 
                          WHERE eventid = ${eventid} AND leadconfirmed = ${true} AND followconfirmed = ${true};`);
}

const get_partnership_by_number = (competitionid, number)=>{
    return pool.query(SQL`SELECT * FROM partnership 
                          WHERE competitionid = ${competitionid}AND number = ${number};`);
}

const delete_partnership = (leadcompetitorid, followcompetitorid, eventid) => {
    return pool.query(SQL`DELETE FROM partnership 
                          WHERE eventid = ${eventid}
                                AND leadcompetitorid = ${leadcompetitorid}
                                AND followcompetitorid = ${followcompetitorid};`);
}

// INSERT
const create_partnership = (leadcompetitorid, followcompetitorid, eventid, competitionid) => {
    return new Promise(function(resolve, reject) {
        pool.connect(function(err, client, done) {
            if (err) {
                console.error('error getting client', err);
                reject(err);
            } else {
                client.query('BEGIN', (err) => {
                    if (err) {
                        rollback(client, done);
                        console.log(err);
                        return reject(err);
                    }
                    client.query(SQL`SELECT DISTINCT competitor.*, affiliation.name as affiliationname, partnership.number as number
                          FROM competitor
                          LEFT JOIN affiliation ON competitor.affiliationid = affiliation.id
                          LEFT JOIN partnership ON leadcompetitorid = competitor.id
                          WHERE competitor.id = ${leadcompetitorid};`, (err, result) => {
                        if (err) {
                            rollback(client, done);
                            console.log(err);
                            return reject(err);
                        }
                        var comp = result.rows[0]
                        if (comp.number == null){
                             // TODO: UPDATE lead number of competition
                             client.query(SQL`SELECT * FROM competition WHERE id = ${competitionid};`, (err, result) => {
                                if (err) {
                                    rollback(client, done);
                                    return reject(err);
                                }
                                console.log("The lead number is" + result.rows[0].leadidstartnum);
                                var new_number = result.rows[0].leadidstartnum
                                client.query(SQL`UPDATE competition SET leadidstartnum = ${new_number+1} WHERE id = ${competitionid};`, (err, result) => {
                                    if (err) {
                                        rollback(client, done);
                                        return reject(err);
                                    }
                                });
                                client.query(SQL`INSERT INTO partnership (leadcompetitorid, followcompetitorid, eventid, 
                                                    leadconfirmed, followconfirmed,
                                                    competitionid, number, calledback, timestamp)
                                                VALUES (${leadcompetitorid}, ${followcompetitorid}, ${eventid}, ${true}, 
                                                        ${true}, ${competitionid},${new_number}, ${false}, now());`, 
                                        (err, result) => {
                                            if (err) {
                                                console.log(err);
                                                rollback(client, done);
                                                return reject(err);
                                            }
                                        }); 
                            });
                        } 
                        else{
                            client.query(SQL`INSERT INTO partnership (leadcompetitorid, followcompetitorid, eventid, 
                                                    leadconfirmed, followconfirmed,
                                                    competitionid, number, calledback, timestamp)
                                                VALUES (${leadcompetitorid}, ${followcompetitorid}, ${eventid}, ${true}, 
                                                        ${true}, ${competitionid},${comp.number}, ${false}, now());`, 
                                        (err, result) => {
                                            if (err) {
                                                console.log(err);
                                                rollback(client, done);
                                                return reject(err);
                                            }
                                        }); 
                        }
                        client.query('COMMIT', (err) => {
                            if (err) {
                                rollback(client, done);
                                console.log(err);
                                return reject(err);
                            }
                            done(null);
                            resolve("{finished: true}");
                        });
                    });
                });
            }
        });
    });
}


// UPDATE
const update_partnership = (leadcompetitorid, followcompetitorid, eventid, leadconfirmed, followconfirmed, calledback, number) => {
    return pool.query_wrapped(SQL`UPDATE partnership 
                            SET timestamp = now(), leadconfirmed=${leadconfirmed},
                                followconfirmed = ${followconfirmed}, calledback=${calledback}, number = ${number}
                            WHERE leadcompetitorid=${leadcompetitorid} AND followcompetitorid = ${followcompetitorid}
                                AND eventid = ${eventid};`);
}


const get_styles_for_competition_level = (competitionid, levelid) =>{
    return pool.query(SQL`SELECT DISTINCT style.id, style.name, style.ordernumber
                          FROM event
                          LEFT JOIN style 
                          ON event.styleid = style.id
                          WHERE event.competitionid = ${competitionid} AND event.levelid = ${levelid}
                          ORDER BY style.ordernumber;`);
}

const get_events_for_competition_level_style = (competitionid, levelid, styleid) => {
    return pool.query(SQL`SELECT event.id as id, event.dance as dance, style.name as stylename, level.name as levelname,event.ordernumber as ordernumber
                          FROM event
                          LEFT JOIN style
                          ON event.styleid = style.id
                          LEFT JOIN level
                          ON event.levelid = level.id
                          WHERE event.competitionid = ${competitionid} 
                          AND event.levelid = ${levelid}
                          AND event.styleid = ${styleid}
                          ORDER BY event.ordernumber;`);
}


const create_judge = (firstname, lastname, email, token, phonenumber, competitionid) => {
    return pool.query_wrapped(SQL`INSERT INTO judge (firstname, lastname, email, token, phonenumber, competitionid)
                          VALUES (${firstname}, ${lastname}, ${email}, ${token}, 
                                  ${phonenumber}, ${competitionid});`);
}

const delete_judge = (id) => {
    return pool.query_wrapped(SQL`DELETE FROM judge WHERE id = ${id};`);
}

module.exports = {
    get_all_competitors,
    get_competitor_by_id,
    get_competitor_by_email,
    check_competitor_email_exist,
    create_competitor,
    update_competitor_by_email,
    update_competitor_by_id,
    get_all_partnerships,
    get_partnership,
    get_partnership_by_number,
    get_partnerships_by_competition_competitor,
    get_partnerships_by_competitor,
    get_comfirmed_partnerships_by_competition_competitor,
    get_partnerships_by_event,
    get_comfirmed_partnerships_by_event,
    create_partnership,
    update_partnership,
    delete_partnership,
    get_all_paymentrecords,
    get_paymentrecord_by_competition_competitor,
    get_paymentrecords_by_competition,
    get_paymentrecords_by_competitior,
    create_paymentrecord,
    update_paymentrecord,
    get_styles_for_competition_level,
    get_events_for_competition_level_style,
    create_judge,
    delete_judge
}