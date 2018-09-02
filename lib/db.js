var mysql = require('mysql');
var host = "localhost";
var port = "3306";
var user = "guest";
var password = "P@$$w0rd";
var database = "school";
module.exports = {
query: function(query, callback, db = database) {
	var connParam = {
		host 	: host,
		port	: port,
		user    : user,
		password: password,
		database: db,
		insecureAuth: true
	};
	var conn = mysql.createConnection (connParam);
	//console.log("db: connection: "+JSON.stringify(connParam));
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