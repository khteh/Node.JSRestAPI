import { CommonStudentsRequest } from "../../DTO/UseCaseRequests/CommonStudentsRequest"
import { CommonStudentsResponse } from "../../DTO/UseCaseResponse/CommonStudentsResponse"
import { IUseCaseRequestHandler } from "../IUseCaseRequestHandler"
export interface ICommonStudentsUseCase extends IUseCaseRequestHandler<CommonStudentsRequest, CommonStudentsResponse> {
}