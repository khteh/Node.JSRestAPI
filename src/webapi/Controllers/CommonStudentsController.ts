import { type Request, type Response, type NextFunction } from 'express';
import { type ILogger, LogLevels, LoggerTypes, type ICommonStudentsUseCase, CommonStudentsRequest, Student, Teacher } from "webapi.core"
import { CommonStudentsPresenter } from "../Presenters/CommonStudentsPresenter.js"
import { inject } from "inversify";
import { UseCaseTypes } from "webapi.core";
export class CommonStudentsController {
    private _logger: ILogger;
    private _usecase: ICommonStudentsUseCase;
    public constructor(@inject(LoggerTypes.ILogger) logger: ILogger, @inject(UseCaseTypes.IAddStudentsToTeacherUseCase) usecase: ICommonStudentsUseCase) {
        this._logger = logger;
        this._usecase = usecase;
    }
    public async CommonStudents (req: Request, res: Response, next: NextFunction) {
        const presenter = new CommonStudentsPresenter(); // per request: the controller is shared by all requests
        this._logger.Log(LogLevels.debug, 'POST /api/commonstudents query: ' + JSON.stringify(req.body, null, 2));
        let message = { 'message': 'Calling /api/commonstudents' };
        try {
            if (!Array.isArray(req.body?.teachers) || !req.body.teachers.length) {
                message.message += ' without teachers specified!';
                res.status(400);
                res.json(message);
            } else {
                let request: CommonStudentsRequest = new CommonStudentsRequest(req.body.teachers);
                await this._usecase.Handle(request, presenter);
                res.status(presenter.Code);
                res.json({ 'message': presenter.Message, "errors": presenter.Errors, "Common Students": presenter.Students });
            }
        } catch (e) {
            this._logger.Log(LogLevels.error, `POST /api/commonstudents: ${e}`);
            res.status(500).json({ 'message': 'Failed to find common students!' });
        }
    }
}