import { StudentNotificationsRequest } from "../../DTO/UseCaseRequests/StudentNotificationsRequest"
import { StudentNotificationsResponse } from "../../DTO/UseCaseResponse/StudentNotificationsResponse"
import { IUseCaseRequestHandler } from "../IUseCaseRequestHandler"
export interface IStudentNotificationsUseCase extends IUseCaseRequestHandler<StudentNotificationsRequest, StudentNotificationsResponse> {
}