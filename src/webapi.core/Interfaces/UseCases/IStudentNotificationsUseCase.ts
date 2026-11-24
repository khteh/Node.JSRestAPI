import { StudentNotificationsRequest } from "../../DTO/UseCaseRequests/StudentNotificationsRequest.js"
import { StudentNotificationsResponse } from "../../DTO/UseCaseResponse/StudentNotificationsResponse.js"
import { type IUseCaseRequestHandler } from "../IUseCaseRequestHandler.js"
export interface IStudentNotificationsUseCase extends IUseCaseRequestHandler<StudentNotificationsRequest, StudentNotificationsResponse> {
}