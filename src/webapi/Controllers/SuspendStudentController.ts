import { Request, Response, NextFunction } from 'express';
import emailvalidator from 'email-validator'
import { ISuspendStudentUseCase, SuspendStudentRequest, UseCaseResponseMessage, Student, Teacher } from "core"
import { PresenterBase } from "../Presenters/PresenterBase.js"
import { inject } from "inversify";
import { UseCaseTypes } from "core";
export class SuspendStudentController {
    private _usecase: ISuspendStudentUseCase;
    private presenter: PresenterBase<UseCaseResponseMessage>;
    public constructor(@inject(UseCaseTypes.IAddStudentsToTeacherUseCase) usecase: ISuspendStudentUseCase) {
        this._usecase = usecase;
        this.presenter = new PresenterBase();
    }
    public async SuspendStudent (req: Request, res: Response, next: NextFunction) {
        let message = { 'message': 'Calling /api/suspendstudent' };
        if (req.body.hasOwnProperty('student') && req.body.student !== "" && emailvalidator.validate(req.body.student)) {
            let request: SuspendStudentRequest = new SuspendStudentRequest(req.body.student);
            await this._usecase.Handle(request, this.presenter);
            res.status(this.presenter.Code);
            res.json({ 'message': this.presenter.Message, "errors": this.presenter.Errors });
        } else {
            message.message += ' without valid student information!';
            res.status(400);
            res.json(message);
        }
    }
}