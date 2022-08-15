import { AddStudentsToTeacherRequest } from "DTO/UseCaseRequests/AddStudentsToTeacherRequest"
import { UseCaseResponseMessage } from "DTO/UseCaseResponse/UseCaseResponseMessage"
import { IUseCaseRequestHandler } from "../IUseCaseRequestHandler"
export interface IAddStudentsToTeacherUseCase extends IUseCaseRequestHandler<AddStudentsToTeacherRequest, UseCaseResponseMessage> {
}