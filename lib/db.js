import mysql2 from 'mysql2'
import { createPool, Pool} from 'mysql2';
import config from 'config'
let pool;
/**
 * generates pool connection to be used throughout the app
 */
const init = () => {
  try {
	pool = createPool({
		connectionLimit: process.env.MY_SQL_DB_CONNECTION_LIMIT ? parseInt(process.env.MY_SQL_DB_CONNECTION_LIMIT) : 4,
		host: process.env.MYSQL_HOST || config.get('DBHost'),
		port: process.env.MYSQL_PORT || config.get('Port'),
		user: process.env.MYSQL_USER || config.get('Username'),
		password: process.env.MYSQL_PASSWORD || config.get('Password'),
		database: process.env.MYSQL_DB || config.get('Database'),
		insecureAuth: true
	});
    console.debug('MySql Adapter Pool generated successfully');
  } catch (error) {
    console.error('[mysql.connector][init][Error]: ', error);
    throw new Error('failed to initialized pool');
  }
};

function Query(query, callback) {
/*			
	var connParam = {
	    host: process.env.MYSQL_HOST || config.get('DBHost'),
	    port: process.env.MYSQL_PORT || config.get('Port'),
	    user: process.env.MYSQL_USER || config.get('Username'),
	    password: process.env.MYSQL_PASSWORD || config.get('Password'),
	    database: process.env.MYSQL_DB || config.get('Database'),
	    insecureAuth: true
	};
	//console.log("db: connection: " + JSON.stringify(connParam));
	//var conn = mysql2.createConnection(connParam);
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
*/
	try {
		if (!pool) {
			console.error('Pool was not created. Ensure pool is created when running the app.');
			callback('Pool was not created. Ensure pool is created when running the app.', null);
		}
        pool.query(query, function (err, rows, fields) {
            if (err)
                console.error("Query() error: " + JSON.stringify(err));
            //conn.end();
            callback(err, rows);
        });
	} catch (error) {
		console.error('[mysql.connector][execute][Error]: ', error);
		throw new Error('failed to execute MySQL query');		
	}
};
export { init, Query };
