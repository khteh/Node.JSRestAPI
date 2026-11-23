import { SuspendStudentRequest } from "../../DTO/UseCaseRequests/SuspendStudentRequest.js"
import { UseCaseResponseMessage } from "../../DTO/UseCaseResponse/UseCaseResponseMessage.js"
import { type IUseCaseRequestHandler } from "../IUseCaseRequestHandler.js"
export interface ISuspendStudentUseCase extends IUseCaseRequestHandler<SuspendStudentRequest, UseCaseResponseMessage> {
}