const pool = require('./lib/db');

const get_admins = () => {
    
    //to run a query we just pass it to the pool
    //after we're done nothing has to be taken care of
    //we don't have to return any client to the pool or close a connection
    pool.query('SELECT * FROM Admin', function(err, res) {
    if(err) {
        return console.error('error running query', err);
        Promise.reject(res.rows);
    }
    console.log('Admins:', res.rows);
    Promise.resolve(res.rows);
    });
}

const get_admins = () => {
        //to run a query we just pass it to the pool
    //after we're done nothing has to be taken care of
    //we don't have to return any client to the pool or close a connection
    pool.query('SELECT * FROM Admin', function(err, res) {
    if(err) {
        return console.error('error running query', err);
    }

    console.log('Admins:', res.rows);
    });
}

const get_judges_by_competition = (comp_id) => {
            //to run a query we just pass it to the pool
    //after we're done nothing has to be taken care of
    //we don't have to return any client to the pool or close a connection
    pool.query('SELECT * FROM Judge WHERE competitionid = $1::INT', [comp_id], function(err, res) {
    if(err) {
        return console.error('error running query', err);
    }

    console.log('Judges of Competition ', comp_id, ':', res.rows);
    });
}

const get_judge = id => {
        //to run a query we just pass it to the pool
    //after we're done nothing has to be taken care of
    //we don't have to return any client to the pool or close a connection
    pool.query('SELECT * FROM Judge WHERE id = $1::INT', [id], function(err, res) {
    if(err) {
        return console.error('error running query', err);
    }

    console.log('Judge:', res.rows[0]);
    });
}

const add_new_judge = (values) => {
}

const get_affiliations = () => {
        //to run a query we just pass it to the pool
    //after we're done nothing has to be taken care of
    //we don't have to return any client to the pool or close a connection
    pool.query('SELECT * FROM Affiliation', function(err, res) {
    if(err) {
        return console.error('error running query', err);
    }

    console.log('Affiliations:', res.rows);
    });
}

module.exports = {
    get_admins,
    get_judges_by_competition,
    get_judge,
    get_affiliations,
    add_new_judge
}
