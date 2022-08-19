import { IRepository, EntityBase } from "core"
import { Database } from "../../db"
import { EntityTarget, Repository } from "typeorm"
export abstract class RepositoryBase<T extends EntityBase> implements IRepository<T> {
    protected _repository: Repository<T>;
    constructor(entity: EntityTarget<T>) {
        this._repository = Database.AppDataSource.getRepository(entity);
    }
    public async GetById (id: number): Promise<T | null> {
        throw new Error("Method not implemented.");
    }
    public async GetByEmail (email: string): Promise<T | null> {
        throw new Error("Method not implemented.");
    }
    public async ListAll (): Promise<T[]> {
        return await this._repository.find();
    }
    public async Add (entity: T): Promise<T | null> {
        return await this._repository.save(entity)
    }
    public async Update (entity: T): Promise<T | null> {
        return await this._repository.save(entity);
    }
    public async Delete (id: number): Promise<Number> {
        let result = await this._repository.delete(id);
        return result.affected ?? 0;
    }
}