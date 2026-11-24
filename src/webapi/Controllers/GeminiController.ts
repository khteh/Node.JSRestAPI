import { injectable, inject } from "inversify";
import { type Request, type Response, type NextFunction } from 'express';
import { type ILogger, LoggerTypes, LogLevels, type LogLevelsType, GenerateContentRequest, type IGenerateContentUseCase } from "webapi.core";
import { GenerateTextPresenter } from "../Presenters/GenerateTextPresenter.js"
import { UseCaseTypes, ImagePart } from "webapi.core";
export class GeminiController {
    private _logger: ILogger;
    private _usecase: IGenerateContentUseCase;
    public constructor(@inject(LoggerTypes.ILogger) logger: ILogger, @inject(UseCaseTypes.IGenerateContentUseCase) usecase: IGenerateContentUseCase) {
        this._logger = logger;
        this._usecase = usecase;
    }
    public async GenerateText (req: Request, res: Response, next: NextFunction) {
        this._logger.Log(LogLevels.debug, `POST /api/gemini query: ${JSON.stringify(req.body, null, 2)}`);
        const presenter = new GenerateTextPresenter(); // per request: the controller is shared by all requests
        let message = { 'message': 'Calling /api/gemini' };
        try {
            if (typeof req.body?.prompt !== 'string' || !req.body.prompt.length) {
                message.message += ' invalid prompt!';
                res.status(400);
                res.json(message);
            } else {
                let imagePart: ImagePart | null = null;
                if (req.file && req.file.filename) {
                    imagePart = new ImagePart(
                        `uploads/${req.file.filename}`,
                        req.file.mimetype,
                    );
                }
                this._logger.Log(LogLevels.debug, `receipt: ${req.body.receipt}`);
                if (req.body.receipt === true)
                    req.body.prompt = "Process the image by extracting the following information and return the result in JSON format: \
                            Date \
                            Currency (3-character currency code) \
                            Vendor \
                            Items (array):\
                            - Name \
                            - Amount \
                            TaxAmount (One GST/tax for the entire receipt) \
                            Total";
                let request: GenerateContentRequest = new GenerateContentRequest(req.body.prompt, req.body.receipt, imagePart);
                await this._usecase.Handle(request, presenter);
                res.status(presenter.Code);
                res.json({ 'message': presenter.Message, "errors": presenter.Errors });
            }
        } catch (e) {
            this._logger.Log(LogLevels.error, `POST /api/gemini: ${e instanceof Error ? e.message : e}`);
            res.status(500).json({ 'message': 'Failed to generate content!', "errors": [] });
        }
    }
}