const pool = require('./lib/db');

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

const get_judges = () => {
        //to run a query we just pass it to the pool
    //after we're done nothing has to be taken care of
    //we don't have to return any client to the pool or close a connection
    pool.query('SELECT * FROM Judge', function(err, res) {
    if(err) {
        return console.error('error running query', err);
    }

    console.log('Judges:', res.rows);
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
    get_judges,
    get_judge,
    get_affiliations,
}
