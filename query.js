const pool = require('./api/db');
const SQL = require('sql-template-strings')

//     //to run a query we just pass it to the pool
//     //after we're done nothing has to be taken care of
//     //we don't have to return any client to the pool or close a connection

const get_all_admins = () => {
    return pool.query('SELECT * FROM admin', []);
}

const get_judges_by_competition = (comp_id) => {
    return pool.query(SQL`SELECT * FROM judge WHERE competitionid = ${comp_id}`);
}

const get_judge = id => {
    return pool.query(SQL`SELECT * FROM judge WHERE id = ${id}`);
}

const get_affiliations = () => {
    return pool.query('SELECT * FROM affiliation', []);
}

const add_new_judge = (judge) => {
    return pool.query(SQL`INSERT INTO judge VALUES (${judge.email}, ${judge.token}, ${judge.firstName}, ${judge.lastName}, ${judge.phoneNumber}, ${judge.competitionId})`);
}

// INSERT

// DELETE

module.exports = {
    get_all_admins,
    get_judges_by_competition,
    get_judge,
    get_affiliations,
    add_new_judge
}
