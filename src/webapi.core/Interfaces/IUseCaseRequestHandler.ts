import { type IUseCaseRequest } from "./IUseCaseRequest.js"
import { type IOutputPort } from "./IOutputPort.js";
export interface IUseCaseRequestHandler<TUseCaseRequest extends IUseCaseRequest<TUseCaseResponse>, TUseCaseResponse> {
    Handle (message: TUseCaseRequest, outputPort: IOutputPort<TUseCaseResponse>): Promise<Boolean>;
}