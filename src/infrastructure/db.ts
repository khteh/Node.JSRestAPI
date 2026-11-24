import "reflect-metadata"
import config from 'config'
import { DataSource, type EntityTarget, Repository } from "typeorm"
import { injectable, inject } from "inversify";
import { Student, Teacher, type ILogger, LogLevels, LoggerTypes, EntityBase } from "webapi.core"

@injectable()
export class Database {
	private _logger: ILogger;
	public static _dataSource: DataSource;
	private static _initialized: Promise<DataSource> | undefined;
	public constructor(@inject(LoggerTypes.ILogger) logger: ILogger) { this._logger = logger; }
	/**
	 * The returned repository can be created before the DataSource is initialized, but it must not be
	 * queried until Ready() resolves: TypeORM builds the entity metadata during initialize(), and querying
	 * earlier fails with "No metadata for <Entity> was found".
	 */
	public getRepository<T extends EntityBase> (repository: EntityTarget<T>): Repository<T> {
		return this.dataSource().getRepository(repository);
	}
	/** Resolves once the DataSource is initialized. After a failed attempt, the next call retries. */
	public async Ready (): Promise<DataSource> {
		const dataSource = this.dataSource();
		if (!Database._initialized) {
			Database._initialized = dataSource.initialize()
				.then(() => {
					this._logger.Log(LogLevels.info, "TypeORM initialized successfully!");
					return dataSource;
				}, error => {
					this._logger.Log(LogLevels.error, `TypeORM initialization failed! ${error}`);
					Database._initialized = undefined;
					throw error;
				});
			// Callers that never await Ready() must not turn a failed connection into an unhandled rejection.
			Database._initialized.catch(() => { });
		}
		return Database._initialized;
	}
	private dataSource (): DataSource {
		if (Database._dataSource instanceof DataSource)
			return Database._dataSource;
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
		} catch (error) {
			this._logger.Log(LogLevels.error, `getRepository(): ${error}`);
			throw new Error('failed to initialized pool');
		}
		// Start connecting right away, as before; queries wait for it through Ready().
		void this.Ready();
		return Database._dataSource;
	}
}