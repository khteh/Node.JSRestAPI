import mysql2 from 'mysql2'
import { createPool, Pool } from 'mysql2';
import config from 'config'
import "reflect-metadata"
import { DataSource, EntityTarget, Repository } from "typeorm"
import { injectable, inject } from "inversify";
import { Student, Teacher, ILogger, LogLevels, LoggerTypes, EntityBase } from "core"
import { Logger } from "./index"

@injectable()
export class Database {
	private _logger: ILogger;
	private static _pool: Pool;
	public static _dataSource: DataSource;
	public constructor(@inject(LoggerTypes.ILogger) logger: ILogger) { this._logger = logger; }
	public getRepository<T extends EntityBase> (repository: EntityTarget<T>): Repository<T> {
		if (Database._dataSource instanceof DataSource)
			return Database._dataSource.getRepository(repository);
		try {
			Database._dataSource = new DataSource({
				type: "mysql",
				host: process.env.MYSQL_HOST || config.get('DBHost'),
				port: Number(process.env.MYSQL_PORT || config.get('Port')),
				username: process.env.MYSQL_USER || config.get('Username'),
				password: process.env.MYSQL_PASSWORD || config.get('Password'),
				database: process.env.MYSQL_DB || config.get('Database'),
				entities: [Student, Teacher],
				synchronize: true,
				logging: false,
			});
			Database._dataSource.initialize()
				.then(() => {
					// here you can start to work with your database
					this._logger.Log(LogLevels.info, "TypeORM initialized successfully!")
				})
				.catch((error) => this._logger.Log(LogLevels.error, `TypeORM initialization failed! ${error}`))
		} catch (error) {
			this._logger.Log(LogLevels.error, `[mysql.connector][init][Error]: ${error}`);
			throw new Error('failed to initialized pool');
		}
		return Database._dataSource.getRepository(repository);
	}
	static init () {
		try {
			// to initialize initial connection with the database, register all entities
			// and "synchronize" database schema, call "initialize()" method of a newly created database
			// once in your application bootstrap
			Database._pool = createPool({
				connectionLimit: process.env.MY_SQL_DB_CONNECTION_LIMIT ? parseInt(process.env.MY_SQL_DB_CONNECTION_LIMIT) : 4,
				host: process.env.MYSQL_HOST || config.get('DBHost'),
				port: Number(process.env.MYSQL_PORT || config.get('Port')),
				user: process.env.MYSQL_USER || config.get('Username'),
				password: process.env.MYSQL_PASSWORD || config.get('Password'),
				database: process.env.MYSQL_DB || config.get('Database'),
				insecureAuth: true
			});
			Logger.info('MySql Adapter Pool generated successfully');
		} catch (error) {
			console.error('[mysql.connector][init][Error]: ', error);
			throw new Error('failed to initialized pool');
		}
	}
	public static Query (query: string, callback: any) {
		//console.log('connected as id ' + conn.threadId);
		Database._pool.query(query, function (err: any, rows: number, fields: any) {
			if (err)
				console.error("Query() error: " + JSON.stringify(err));
			callback(err, rows);
		});
	};
}