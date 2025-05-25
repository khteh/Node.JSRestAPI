import { GenerateContentRequest } from "../../DTO/UseCaseRequests/GenerateContentRequest.js"
import { UseCaseResponseMessage } from "../../DTO/UseCaseResponse/UseCaseResponseMessage.js"
import { IUseCaseRequestHandler } from "../IUseCaseRequestHandler.js"
export interface IGenerateContentUseCase extends IUseCaseRequestHandler<GenerateContentRequest, UseCaseResponseMessage> {
}