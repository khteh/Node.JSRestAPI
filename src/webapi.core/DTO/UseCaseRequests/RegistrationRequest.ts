import { injectable, unmanaged, inject } from "inversify";
import { IRepository, EntityBase } from "webapi.core"
import { IUseCaseRequest } from "../../Interfaces/IUseCaseRequest.js";
import { UseCaseResponseMessage } from "../UseCaseResponse/UseCaseResponseMessage.js";
@injectable()
export abstract class RegistrationRequest<T extends EntityBase> implements IUseCaseRequest<UseCaseResponseMessage> {
    public Entities: T[];
    constructor(entities: T[]) {
        this.Entities = entities;
    }
}