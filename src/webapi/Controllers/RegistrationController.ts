import { type Request, type Response, type NextFunction } from 'express';
import { RegisterStudentRequest, RegisterTeacherRequest, Error } from "webapi.core"
import { RegisterStudentModel } from "../Models/Request/RegisterStudentModel.js"
import { RegisterTeacherModel } from "../Models/Request/RegisterTeacherModel.js"
import { type ILogger, LogLevels, LoggerTypes, type IRegisterStudentUseCase, type IRegisterTeacherUseCase, Student, Teacher } from "webapi.core"
import { RegisterUserPresenter } from "../Presenters/RegisterUserPresenter.js"
import { inject } from "inversify";
import { UseCaseTypes } from "webapi.core";
export class RegistrationController {
    private _logger: ILogger;
    private studentUseCase: IRegisterStudentUseCase;
    private teacherUseCase: IRegisterTeacherUseCase;
    public constructor(@inject(LoggerTypes.ILogger) logger: ILogger, @inject(UseCaseTypes.IRegisterStudentUseCase) student: IRegisterStudentUseCase, @inject(UseCaseTypes.IRegisterTeacherUseCase) teacher: IRegisterTeacherUseCase) {
        this._logger = logger;
        this.studentUseCase = student;
        this.teacherUseCase = teacher;
    }
    /**
     * POST /api/register { students?: [{ firstName, lastName, email }], teachers?: [...] }
     * 201 when every student and teacher is registered; 400 when nothing valid is given, or any entry is
     * invalid or already registered (the "errors" list says which).
     */
    public async Register (req: Request, res: Response, next: NextFunction) {
        try {
            this._logger.Log(LogLevels.debug, 'POST /api/register query: ' + JSON.stringify(req.body, null, 2));
            const students: RegisterStudentModel[] = Array.isArray(req.body?.students) ? req.body.students : [];
            const teachers: RegisterTeacherModel[] = Array.isArray(req.body?.teachers) ? req.body.teachers : [];
            if (!students.length && !teachers.length) {
                res.status(400).json({ 'message': 'Calling /api/register without students or teachers to register!', "errors": [] });
                return;
            }
            const messages: string[] = [];
            const errors: Array<Error> = [];
            let code = 201;
            // A new presenter per request and per use case: the controller is shared by all requests.
            // Invalid emails are passed on, so the use cases report them as errors instead of dropping them.
            if (students.length) {
                const presenter = new RegisterUserPresenter();
                await this.studentUseCase.Handle(new RegisterStudentRequest(students.map(i => new Student(i?.firstName, i?.lastName, i?.email))), presenter);
                messages.push(presenter.Message);
                errors.push(...presenter.Errors);
                if (presenter.Code !== 201) code = presenter.Code;
            }
            if (teachers.length) {
                const presenter = new RegisterUserPresenter();
                await this.teacherUseCase.Handle(new RegisterTeacherRequest(teachers.map(i => new Teacher(i?.firstName, i?.lastName, i?.email))), presenter);
                messages.push(presenter.Message);
                errors.push(...presenter.Errors);
                if (presenter.Code !== 201) code = presenter.Code;
            }
            res.status(code).json({ 'message': messages.join(', '), "errors": errors });
        } catch (e) {
            this._logger.Log(LogLevels.error, `POST /api/register: ${e}`);
            res.status(500).json({ 'message': 'Failed to register!', "errors": [] });
        }
    }
}