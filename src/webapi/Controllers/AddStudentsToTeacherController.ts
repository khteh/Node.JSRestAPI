import { type Request, type Response, type NextFunction } from 'express'
import express from 'express'
import emailvalidator from 'email-validator'
import { type ILogger, LogLevels, LoggerTypes, type IAddStudentsToTeacherUseCase, AddStudentsToTeacherRequest, Student, Teacher, UseCaseResponseMessage } from "webapi.core"
import { RegisterStudentModel } from "../Models/Request/RegisterStudentModel.js"
import { PresenterBase } from "../Presenters/PresenterBase.js"
import { inject } from "inversify";
import { UseCaseTypes } from "webapi.core";
export class AddStudentsToTeacherController {
    private _logger: ILogger;
    private _usecase: IAddStudentsToTeacherUseCase;
    public constructor(@inject(LoggerTypes.ILogger) logger: ILogger, @inject(UseCaseTypes.IAddStudentsToTeacherUseCase) usecase: IAddStudentsToTeacherUseCase) {
        this._logger = logger;
        this._usecase = usecase;
    }
    /**
     * POST /api/addstudents { teacher: { email }, students: ["student email" or { email }, ...] }
     * 200 when all students are added; 400 for a missing or invalid teacher, no valid students, or any student
     * that can't be added (the "errors" list says which).
     */
    public async AddStudentsToTeacher (req: Request, res: Response, next: NextFunction) {
        try {
            this._logger.Log(LogLevels.debug, 'POST /api/addstudents query: ' + JSON.stringify(req.body, null, 2));
            let message = 'Calling /api/addstudents';
            const teacherEmail = req.body?.teacher?.email;
            const studentEmails: unknown[] = Array.isArray(req.body?.students) ? req.body.students : [];
            if (teacherEmail === undefined)
                message += ' without a teacher specified!';
            else if (!emailvalidator.validate(teacherEmail))
                message += ' with invalid teacher email address!';
            // Students may be given as email strings or as { email } objects.
            const students = studentEmails.map(i => typeof i === 'string' ? i : (i as { email?: unknown })?.email)
                .filter((i): i is string => typeof i === 'string' && emailvalidator.validate(i)).map(i => new Student("", "", i));
            if (!students.length)
                message += ' without a list of valid students specified!';
            if (teacherEmail === undefined || !emailvalidator.validate(teacherEmail) || !students.length) {
                res.status(400).json({ 'message': message, "errors": [] });
                return;
            }
            this._logger.Log(LogLevels.debug, `Adding ${students.length} students to teacher ${teacherEmail}...`);
            const presenter = new PresenterBase<UseCaseResponseMessage>(); // per request: the controller is shared
            await this._usecase.Handle(new AddStudentsToTeacherRequest(new Teacher("", "", teacherEmail), students), presenter);
            res.status(presenter.Code).json({ 'message': presenter.Message, "errors": presenter.Errors });
        } catch (e) {
            this._logger.Log(LogLevels.error, `POST /api/addstudents: ${e}`);
            res.status(500).json({ 'message': 'Failed to add students to teacher!', "errors": [] });
        }
    }
}
