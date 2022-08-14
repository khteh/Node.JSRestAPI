import { IUseCaseRequest } from "./IUseCaseRequest"
import { IOutputPort } from "./IOutputPort";
export interface IUseCaseRequestHandler<TUseCaseRequest extends IUseCaseRequest<TUseCaseResponse>, TUseCaseResponse> {
    Handle (message: TUseCaseRequest, outputPort: IOutputPort<TUseCaseResponse>): Promise<Boolean>;
}