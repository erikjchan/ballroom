const pool = require('./api/db');

// SELECT

const get_all_competitors = () => {
    
//     //to run a query we just pass it to the pool
//     //after we're done nothing has to be taken care of
//     //we don't have to return any client to the pool or close a connection
    return new Promise(function(resolve, reject) {
        pool.query('SELECT * FROM competitor', function(err, res) {
        if(err) {
            console.error('error running query', err);
            reject(err);
        }
        console.log('Competitors:', res.rows);
        resolve(res.rows);
        });
    });
}

const get_competitor_by_id = (id) => {
    
//     //to run a query we just pass it to the pool
//     //after we're done nothing has to be taken care of
//     //we don't have to return any client to the pool or close a connection
    return new Promise(function(resolve, reject) {
        pool.query('SELECT * FROM competitor where id = $1::INT', [id], function(err, res) {
        if(err) {
            console.error('error running query', err);
            reject(err);
        }
        console.log('Competitor ', id, ':', res.rows);
        resolve(res.rows);
        });
    });
}

const get_competitor_by_email = (email) => {
    
//     //to run a query we just pass it to the pool
//     //after we're done nothing has to be taken care of
//     //we don't have to return any client to the pool or close a connection
    return new Promise(function(resolve, reject) {
        pool.query('SELECT * FROM competitor where email = $1', [email], function(err, res) {
        if(err) {
            console.error('error running query', err);
            reject(err);
        }
        console.log('Competitor ', email, ':', res.rows);
        resolve(res.rows);
        });
    });
}

const check_competitor_email_no_duplicate = (email) => {
    
//     //to run a query we just pass it to the pool
//     //after we're done nothing has to be taken care of
//     //we don't have to return any client to the pool or close a connection
    return new Promise(function(resolve, reject) {
        pool.query('SELECT COUNT(*) FROM competitor where email = $1', [email], function(err, res) {
        if(err) {
            console.error('error running query', err);
            reject(err);
        }
        console.log('Competitor ', email, ':', res.rows[0]);
        resolve(res.rows[0]==0);
        });
    });
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
