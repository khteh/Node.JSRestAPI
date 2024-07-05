import { CommonStudentsRequest } from "../../DTO/UseCaseRequests/CommonStudentsRequest.js"
import { CommonStudentsResponse } from "../../DTO/UseCaseResponse/CommonStudentsResponse.js"
import { IUseCaseRequestHandler } from "../IUseCaseRequestHandler.js"
export interface ICommonStudentsUseCase extends IUseCaseRequestHandler<CommonStudentsRequest, CommonStudentsResponse> {
}