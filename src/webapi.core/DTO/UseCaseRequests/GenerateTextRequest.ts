import { IUseCaseRequest } from "../../Interfaces/IUseCaseRequest.js";
import { ImagePart } from "../ImagePart.js";
import { UseCaseResponseMessage } from "../UseCaseResponse/UseCaseResponseMessage.js";
export class GenerateTextRequest implements IUseCaseRequest<UseCaseResponseMessage> {
    public Prompt: string;
    public Image: ImagePart | null;
    constructor(prompt: string, image: ImagePart | null) {
        this.Prompt = prompt;
        this.Image = image;
    }
}