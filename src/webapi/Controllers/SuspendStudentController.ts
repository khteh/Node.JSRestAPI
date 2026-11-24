import { type Request, type Response, type NextFunction } from 'express';
import emailvalidator from 'email-validator'
import { type ISuspendStudentUseCase, SuspendStudentRequest, UseCaseResponseMessage, Student, Teacher } from "webapi.core"
import { PresenterBase } from "../Presenters/PresenterBase.js"
import { inject } from "inversify";
import { UseCaseTypes } from "webapi.core";
export class SuspendStudentController {
    private _usecase: ISuspendStudentUseCase;
    public constructor(@inject(UseCaseTypes.IAddStudentsToTeacherUseCase) usecase: ISuspendStudentUseCase) {
        this._usecase = usecase;
    }
    public async SuspendStudent (req: Request, res: Response, next: NextFunction) {
        const presenter = new PresenterBase<UseCaseResponseMessage>(); // per request: the controller is shared by all requests
        let message = { 'message': 'Calling /api/suspendstudent' };
        if (typeof req.body?.student === 'string' && emailvalidator.validate(req.body.student)) {
            let request: SuspendStudentRequest = new SuspendStudentRequest(req.body.student);
            await this._usecase.Handle(request, presenter);
            res.status(presenter.Code);
            res.json({ 'message': presenter.Message, "errors": presenter.Errors });
        } else {
            message.message += ' without valid student information!';
            res.status(400);
            res.json(message);
        }
    }
}