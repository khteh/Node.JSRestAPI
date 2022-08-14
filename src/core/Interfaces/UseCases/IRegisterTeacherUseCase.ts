import { RegisterTeacherRequest } from "DTO/UseCaseRequests/RegisterTeacherRequest"
import { UseCaseResponseMessage } from "DTO/UseCaseResponse/UseCaseResponseMessage"
import { IUseCaseRequestHandler } from "../IUseCaseRequestHandler"
export interface IRegisterTeacherUseCase extends IUseCaseRequestHandler<RegisterTeacherRequest, UseCaseResponseMessage> {
}