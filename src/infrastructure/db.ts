import config from 'config'
import "reflect-metadata"
import { DataSource, EntityTarget, Repository } from "typeorm"
import { injectable, inject } from "inversify";
import { Student, Teacher, ILogger, LogLevels, LoggerTypes, EntityBase } from "core"
import { Logger } from "./index"

@injectable()
export class Database {
	private _logger: ILogger;
	public static _dataSource: DataSource;
	public constructor(@inject(LoggerTypes.ILogger) logger: ILogger) { this._logger = logger; }
	public getRepository<T extends EntityBase> (repository: EntityTarget<T>): Repository<T> {
		if (Database._dataSource instanceof DataSource)
			return Database._dataSource.getRepository(repository);
		try {
			Database._dataSource = new DataSource({
				type: "postgres",
				host: process.env.POSTGRESQL_HOST || config.get('DBHost'),
				port: Number(process.env.POSTGRESQL_PORT || config.get('Port')),
				username: process.env.POSTGRESQL_USER || config.get('Username'),
				password: process.env.POSTGRESQL_PASSWORD || config.get('Password'),
				database: process.env.POSTGRESQL_DB || config.get('Database'),
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
			this._logger.Log(LogLevels.error, `getRepository(): ${error}`);
			throw new Error('failed to initialized pool');
		}
		return Database._dataSource.getRepository(repository);
	}
}