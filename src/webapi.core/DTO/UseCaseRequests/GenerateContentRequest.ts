import { IUseCaseRequest } from "../../Interfaces/IUseCaseRequest.js";
import { ImagePart } from "../ImagePart.js";
import { UseCaseResponseMessage } from "../UseCaseResponse/UseCaseResponseMessage.js";
export class GenerateContentRequest implements IUseCaseRequest<UseCaseResponseMessage> {
    public Prompt: string;
    public Image: ImagePart | null;
    public IsReceipt: boolean;
    constructor(prompt: string, receipt: boolean, image: ImagePart | null) {
        this.Prompt = prompt;
        this.IsReceipt = receipt;
        this.Image = image;
    }
}