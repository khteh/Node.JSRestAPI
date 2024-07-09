import { Request, Response, NextFunction } from 'express';
import { ILogger, LogLevels, LoggerTypes, ICommonStudentsUseCase, CommonStudentsRequest, Student, Teacher } from "webapi.core"
import { CommonStudentsPresenter } from "../Presenters/CommonStudentsPresenter.js"
import { inject } from "inversify";
import { UseCaseTypes } from "webapi.core";
export class CommonStudentsController {
    private _logger: ILogger;
    private _usecase: ICommonStudentsUseCase;
    private presenter: CommonStudentsPresenter;
    public constructor(@inject(LoggerTypes.ILogger) logger: ILogger, @inject(UseCaseTypes.IAddStudentsToTeacherUseCase) usecase: ICommonStudentsUseCase) {
        this._logger = logger;
        this._usecase = usecase;
        this.presenter = new CommonStudentsPresenter();
    }
    public async CommonStudents (req: Request, res: Response, next: NextFunction) {
        this._logger.Log(LogLevels.debug, 'POST /api/commonstudents query: ' + JSON.stringify(req.body, null, 2));
        let message = { 'message': 'Calling /api/commonstudents' };
        try {
            if (!req.body.hasOwnProperty('teachers') || req.body.teachers === undefined || !Array.isArray(req.body.teachers) || !req.body.teachers.length) {
                message.message += ' without teachers specified!';
                res.status(400);
                res.json(message);
            } else {
                let request: CommonStudentsRequest = new CommonStudentsRequest(req.body.teachers);
                await this._usecase.Handle(request, this.presenter);
                res.status(this.presenter.Code);
                res.json({ 'message': this.presenter.Message, "errors": this.presenter.Errors, "Common Students": this.presenter.Students });
            }
        } catch (e) { console.log(e); }
    }
}