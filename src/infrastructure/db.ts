import mysql2 from 'mysql2'
import { createPool, Pool} from 'mysql2';
import config from 'config'
export class Database {
	private static _pool: Pool;
	static init() {
		try {
			Database._pool = createPool({
				connectionLimit: process.env.MY_SQL_DB_CONNECTION_LIMIT ? parseInt(process.env.MY_SQL_DB_CONNECTION_LIMIT) : 4,
				host: process.env.MYSQL_HOST || config.get('DBHost'),
				port: Number(process.env.MYSQL_PORT || config.get('Port')),
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
  	}
	public static Query(query: string, callback: any) {
		//console.log('connected as id ' + conn.threadId);
		Database._pool.query(query, function (err: any, rows: number, fields: any) {
			if (err)
				console.error("Query() error: " + JSON.stringify(err));
			callback(err, rows);
		});
	};
}
