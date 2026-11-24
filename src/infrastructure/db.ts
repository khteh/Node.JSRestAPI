import "reflect-metadata"
import config from 'config'
import { DataSource, type EntityTarget, Repository } from "typeorm"
import { injectable, inject } from "inversify";
import { Student, Teacher, type ILogger, LogLevels, LoggerTypes, EntityBase } from "webapi.core"

// Required database settings. Their values come from config/: default.json, then local-{NODE_CONFIG_ENV}.json (not in git;
// a ConfigMap in Kubernetes), then the environment variables mapped in custom-environment-variables.json.
const dbSettings = ['db.host', 'db.port', 'db.database', 'db.username', 'db.password'] as const;
const setting = <T> (key: string): T | undefined => config.has(key) ? config.get<T>(key) : undefined;

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
			// A missing setting fails here, like an unreachable database, rather than when the app starts,
			// so endpoints that don't use the database keep working.
			const missing = dbSettings.filter(key => !config.has(key));
			const initialize = missing.length
				? Promise.reject(new Error(`Missing database configuration: ${missing.join(', ')}. Set them in config/local-${config.util.getEnv('NODE_CONFIG_ENV')}.json or with the environment variables in config/custom-environment-variables.json.`))
				: dataSource.initialize();
			Database._initialized = initialize
				.then(() => {
					this._logger.Log(LogLevels.info, "TypeORM initialized successfully!");
					return dataSource;
				}, error => {
					this._logger.Log(LogLevels.error, `TypeORM initialization failed connecting to ${setting('db.host')}:${setting('db.port')}/${setting('db.database')} as ${setting('db.username')}! ${error}`);
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
				host: setting<string>('db.host'),
				port: setting<number>('db.port'),
				username: setting<string>('db.username'),
				password: setting<string>('db.password'),
				database: setting<string>('db.database'),
				// Without a timeout, an address that never answers makes every query wait indefinitely.
				connectTimeoutMS: setting<number>('db.connectTimeoutMS'),
				entities: [Student, Teacher],
				synchronize: true,
				logging: false,
			});
		} catch (error) {
			this._logger.Log(LogLevels.error, `getRepository(): ${error}`);
			throw new Error('failed to initialized pool');
		}
		// Start connecting right away, as before; queries wait for it through Ready().
		// Failures are logged in Ready() and reported to each query; don't let this unawaited call crash the process.
		this.Ready().catch(() => { });
		return Database._dataSource;
	}
}