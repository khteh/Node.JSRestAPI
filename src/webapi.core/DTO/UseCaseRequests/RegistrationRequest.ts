import { injectable, unmanaged, inject } from "inversify";
import { type IRepository, EntityBase } from "webapi.core"
import { type IUseCaseRequest } from "../../Interfaces/IUseCaseRequest.js";
import { UseCaseResponseMessage } from "../UseCaseResponse/UseCaseResponseMessage.js";
@injectable()
export abstract class RegistrationRequest<T extends EntityBase> implements IUseCaseRequest<UseCaseResponseMessage> {
    public Entities: T[];
    constructor(entities: T[]) {
        this.Entities = entities;
    }
}