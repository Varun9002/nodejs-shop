const mysql = require('mysql2');

const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'node-shop',
});
module.exports = pool.promise();
