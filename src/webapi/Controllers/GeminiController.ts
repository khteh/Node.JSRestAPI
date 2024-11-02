import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from 'express';
import { ILogger, LoggerTypes, LogLevels, LogLevelsType, GenerateTextRequest, IGenerateTextUseCase } from "webapi.core";
import { GenerateTextPresenter } from "../Presenters/GenerateTextPresenter.js"
import { UseCaseTypes } from "webapi.core";
import url from 'url'
//import Logger from "infrastructure"
export class GeminiController {
    private _logger: ILogger;
    private _usecase: IGenerateTextUseCase;
    private presenter: GenerateTextPresenter;
    public constructor(@inject(LoggerTypes.ILogger) logger: ILogger, @inject(UseCaseTypes.IGenerateTextUseCase) usecase: IGenerateTextUseCase) {
        this._logger = logger;
        this._usecase = usecase;
        this.presenter = new GenerateTextPresenter();
    }
    public async GenerateText (req: Request, res: Response, next: NextFunction) {
        this._logger.Log(LogLevels.debug, 'POST /api/gemini query: ' + JSON.stringify(req.body, null, 2));
        let message = { 'message': 'Calling /api/gemini' };
        try {
            if (!req.body.hasOwnProperty('prompt') || req.body.prompt === undefined || !req.body.prompt.length) {
                message.message += ' invalid prompt!';
                res.status(400);
                res.json(message);
            } else {
                let request: GenerateTextRequest = new GenerateTextRequest(req.body.prompt);
                await this._usecase.Handle(request, this.presenter);
                res.status(this.presenter.Code);
                res.json({ 'message': this.presenter.Message, "errors": this.presenter.Errors });
            }
        } catch (e) { console.log(e); }
    }
}