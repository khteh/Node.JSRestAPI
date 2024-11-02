import { IUseCaseRequest } from "../../Interfaces/IUseCaseRequest.js";
import { UseCaseResponseMessage } from "../UseCaseResponse/UseCaseResponseMessage.js";
export class GenerateTextRequest implements IUseCaseRequest<UseCaseResponseMessage> {
    public Prompt: string;
    constructor(prompt: string) {
        this.Prompt = prompt;
    }
}