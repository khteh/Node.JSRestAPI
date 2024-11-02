import { GenerateTextRequest } from "../../DTO/UseCaseRequests/GenerateTextRequest.js"
import { UseCaseResponseMessage } from "../../DTO/UseCaseResponse/UseCaseResponseMessage.js"
import { IUseCaseRequestHandler } from "../IUseCaseRequestHandler.js"
export interface IGenerateTextUseCase extends IUseCaseRequestHandler<GenerateTextRequest, UseCaseResponseMessage> {
}