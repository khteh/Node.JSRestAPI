import { SuspendStudentRequest } from "../../DTO/UseCaseRequests/SuspendStudentRequest"
import { UseCaseResponseMessage } from "../../DTO/UseCaseResponse/UseCaseResponseMessage"
import { IUseCaseRequestHandler } from "../IUseCaseRequestHandler"
export interface ISuspendStudentUseCase extends IUseCaseRequestHandler<SuspendStudentRequest, UseCaseResponseMessage> {
}