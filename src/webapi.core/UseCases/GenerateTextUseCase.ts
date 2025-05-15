import fs from 'fs';
import { GoogleGenAI, createUserContent, Part, GenerateContentResponse } from "@google/genai";
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
    private readonly _genAI: GoogleGenAI;
    public constructor(@inject(LoggerTypes.ILogger) logger: ILogger) {
        this._logger = logger;
        this._genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
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
                let result: GenerateContentResponse;
                if (request.Image) {
                    this._logger.Log(LogLevels.debug, `Reading uploaded file from ${request.Image.Path}`);
                    let imagePart: Part = this.FileToGenerativePart(request.Image.Path, request.Image.MimeType);
                    result = await this._genAI.models.generateContent({
                        model: 'gemini-2.0-flash',
                        contents: [
                            createUserContent([
                                request.Prompt,
                                imagePart,
                            ]),
                        ],
                    });
                    fs.unlink(request.Image.Path, (err) => {
                        if (err) throw err;
                        this._logger.Log(LogLevels.debug, `${request!.Image!.Path} was deleted successfully`);
                    });
                } else
                    result = await this._genAI.models.generateContent({
                        model: 'gemini-2.0-flash',
                        contents: request.Prompt
                    });
                if (result && result.text) {
                    let text = result.text.replace('```json', '')
                    text = text.replace('```', '')
                    response = new UseCaseResponseMessage("", true, result.text, errors);
                    this._logger.Log(LogLevels.debug, `Prompt: ${request.Prompt} generates: ${response.Message}`);
                } else {
                    this._logger.Log(LogLevels.error, `Prompt ${request.Prompt} fails to generate result!`);
                    response = new UseCaseResponseMessage("", false, `Prompt ${request.Prompt} fails to generate result!`, errors);
                }
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