import { type IRepository, EntityBase, type ILogger, LoggerTypes } from "webapi.core"
import { Database } from "../../db.js"
import { type EntityTarget, Repository } from "typeorm"
import { injectable, unmanaged, inject } from "inversify";
import { DatabaseTypes } from "../../types.js";
import { timingSafeEqual } from "crypto";
@injectable()
export abstract class RepositoryBase<T extends EntityBase> implements IRepository<T> {
    protected _logger: ILogger;
    protected _repository: Repository<T>;
    protected _db: Database;
    constructor(logger: ILogger, @unmanaged() entity: EntityTarget<T>, db: Database) {
        this._logger = logger;
        this._db = db;
        this._repository = this._db.getRepository(entity);
    }
    /** The TypeORM repository, once the database is initialized. Use this instead of _repository directly. */
    protected async repository (): Promise<Repository<T>> {
        await this._db.Ready();
        return this._repository;
    }
    public async GetById (id: number): Promise<T | null> {
        throw new Error("Method not implemented.");
    }
    public async GetByEmail (email: string): Promise<T | null> {
        throw new Error("Method not implemented.");
    }
    public async ListAll (): Promise<T[]> {
        return await (await this.repository()).find();
    }
    public async Add (entity: T): Promise<T | null> {
        return await (await this.repository()).save(entity)
    }
    public async Update (entity: T): Promise<T | null> {
        return await (await this.repository()).save(entity);
    }
    public async Delete (id: number): Promise<Number> {
        let result = await (await this.repository()).delete(id);
        return result.affected ?? 0;
    }
    public async Clear (): Promise<boolean> {
        await (await this.repository()).clear();
        return true;
    }
}