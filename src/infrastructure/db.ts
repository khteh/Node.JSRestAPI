import "reflect-metadata"
import config from 'config'
import { DataSource, type EntityTarget, Repository } from "typeorm"
import { injectable, inject } from "inversify";
import { Student, Teacher, type ILogger, LogLevels, LoggerTypes, EntityBase } from "webapi.core"

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
				host: process.env.DB_HOST || config.get('DB_HOST'),
				port: Number(process.env.DB_PORT || config.get('DB_PORT')),
				username: process.env.DB_USERNAME || config.get('DB_USERNAME'),
				password: process.env.DB_PASSWORD || config.get('DB_PASSWORD'),
				database: process.env.DB_DATABASE || config.get('DB_DATABASE'),
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