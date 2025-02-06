import fs from 'fs';
import { GoogleGenerativeAI, GenerativeModel, Part } from "@google/generative-ai";
import { IGenerateTextUseCase } from "../Interfaces/UseCases/IGenerateTextUseCase.js"
import { IOutputPort } from "../Interfaces/IOutputPort.js";
import { UseCaseResponseMessage } from "../DTO/UseCaseResponse/UseCaseResponseMessage.js"
import { GenerateTextRequest } from "../DTO/UseCaseRequests/GenerateTextRequest.js"
import { Error } from "../DTO/Error.js"
import { injectable, inject } from "inversify";
import { ILogger, LogLevels } from "../Interfaces/ILogger.js";
import { LoggerTypes, RepositoryTypes } from "../types.js";
import e from "express";
@injectable()
export class GenerateTextUseCase implements IGenerateTextUseCase {
    private _logger: ILogger;
    private readonly _genAI: GoogleGenerativeAI;
    private readonly _model: GenerativeModel;
    public constructor(@inject(LoggerTypes.ILogger) logger: ILogger) {
        this._logger = logger;
        this._genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        this._model = this._genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    }
    private FileToGenerativePart (path: string, mimeType: string) {
        return {
            inlineData: {
                data: Buffer.from(fs.readFileSync(path)).toString("base64"),
                mimeType,
            },
        };
    }
    // Retrieve students who are registered to ALL of the given teachers:
    public async Handle (request: GenerateTextRequest, outputPort: IOutputPort<UseCaseResponseMessage>): Promise<Boolean> {
        let errors: Error[] = [];
        let response: UseCaseResponseMessage;
        try {
            this._logger.Log(LogLevels.debug, 'POST /api/gemini query: ' + JSON.stringify(request, null, 2));
            if (request.Prompt) {
                let result;
                if (request.Image) {
                    this._logger.Log(LogLevels.debug, `Reading uploaded file from ${request.Image.Path}`);
                    let imagePart: Part = this.FileToGenerativePart(request.Image.Path, request.Image.MimeType);
                    result = await this._model.generateContent([request.Prompt, imagePart]);
                    fs.unlink(request.Image.Path, (err) => {
                        if (err) throw err;
                        this._logger.Log(LogLevels.debug, `${request!.Image!.Path} was deleted successfully`);
                    });
                } else
                    result = await this._model.generateContent(request.Prompt);
                response = new UseCaseResponseMessage("", true, result.response.text(), errors);
                this._logger.Log(LogLevels.debug, `Prompt: ${request.Prompt} generates: ${response.Message}`);

            } else {
                this._logger.Log(LogLevels.error, `Invalid prompt! ${request.Prompt}!`);
                response = new UseCaseResponseMessage("", false, `Invalid prompt! ${request.Prompt}`, errors);
            }
            outputPort.Handle(response);
            return response.Success;
        } catch (e) {
            console.error(e);
            if (typeof e === "string") {
                errors.push(new Error("", e));
                response = new UseCaseResponseMessage("", false, e, errors);
            } else {
                errors.push(new Error("", JSON.stringify(e, null, 2)));
                response = new UseCaseResponseMessage("", false, "Exception!", errors);
            }
            outputPort.Handle(response);
            return false;
        }
    }
}