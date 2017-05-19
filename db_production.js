const babelRegister = require('babel-register');
babelRegister();
var pool = require('./api/db');
var fs = require('fs');

const init_db = () => {
	var sql = fs.readFileSync('./db_production.sql').toString();
	pool.connect(function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		client.query(sql, err => {
			done();
			if (err) {
				console.error(err);
			}
		});
	});
}

init_db();
