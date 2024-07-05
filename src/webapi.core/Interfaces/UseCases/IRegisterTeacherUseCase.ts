import { RegisterTeacherRequest } from "../../DTO/UseCaseRequests/RegisterTeacherRequest.js"
import { UseCaseResponseMessage } from "../../DTO/UseCaseResponse/UseCaseResponseMessage.js"
import { IUseCaseRequestHandler } from "../IUseCaseRequestHandler.js"
export interface IRegisterTeacherUseCase extends IUseCaseRequestHandler<RegisterTeacherRequest, UseCaseResponseMessage> {
}