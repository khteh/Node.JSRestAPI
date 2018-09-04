var mysql = require('mysql');
config = require('config');
module.exports = {
query: function(query, callback, db) {
	var connParam = {
	    host: config.get('DBHost'),
		port	: config.get('Port'),
		user    : config.get('Username'),
		password: config.get('Password'),
		database: config.get('Database'),
		insecureAuth: true
	};
	//console.log("db: connection: " + JSON.stringify(connParam));
	var conn = mysql.createConnection (connParam);
	conn.connect(function(err) {
		if (err) {
			console.error('error connecting: ' + err.stack);
			callback(err, 0, 0);
		} else
			console.log('connected as id ' + conn.threadId);
	});
	conn.query(query, function(err, rows, fields) {
		var result;
		if (!err && typeof rows !== 'undefined') {
		    //console.log("db.query(). rows: "+JSON.stringify(rows)+" fields: " + JSON.stringify(fields));
		} else if (err)
		    console.error("db.query() error: "+JSON.stringify(err));
		result = rows;		
		conn.end();
		callback(err, result);
	});	
}
};