import { EntityBase } from "../Domain/Entities/EntityBase";
export interface IRepository<T extends EntityBase> {
    GetById (id: number): Promise<T | null>;
    GetByEmail (email: string): Promise<T | null>;
    ListAll (): Promise<Array<T>>;
    Add (entity: T): Promise<T | null>;
    Update (entity: T): Promise<T | null>;
    Delete (id: number): Promise<Number>;
}