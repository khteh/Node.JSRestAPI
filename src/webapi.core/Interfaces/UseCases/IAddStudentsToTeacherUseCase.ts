import { AddStudentsToTeacherRequest } from "../../DTO/UseCaseRequests/AddStudentsToTeacherRequest.js"
import { UseCaseResponseMessage } from "../../DTO/UseCaseResponse/UseCaseResponseMessage.js"
import { type IUseCaseRequestHandler } from "../IUseCaseRequestHandler.js"
export interface IAddStudentsToTeacherUseCase extends IUseCaseRequestHandler<AddStudentsToTeacherRequest, UseCaseResponseMessage> {
}