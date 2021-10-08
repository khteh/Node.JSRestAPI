import mysql2 from 'mysql2'
import config from 'config'
function Query(query, callback) {
	var connParam = {
	    host: config.get('DBHost'),
		port	: config.get('Port'),
		user    : config.get('Username'),
		password: config.get('Password'),
		database: config.get('Database'),
		insecureAuth: true
	};
	//console.log("db: connection: " + JSON.stringify(connParam));
	var conn = mysql2.createConnection(connParam);
	conn.connect(function (err) {
	    if (err) {
	        console.error('error connecting: ' + err.stack);
	        callback(err, null);
	    } else {
	        //console.log('connected as id ' + conn.threadId);
	        conn.query(query, function (err, rows, fields) {
	            if (err)
	                console.error("Query() error: " + JSON.stringify(err));
	            conn.end();
	            callback(err, rows);
	        });
	    }
	});
};
export { Query };
