import { Request, Response, NextFunction } from 'express';
import emailvalidator from 'email-validator'
import { RegisterStudentRequest, RegisterTeacherRequest, Error } from "webapi.core"
import { RegisterStudentModel } from "../Models/Request/RegisterStudentModel.js"
import { RegisterTeacherModel } from "../Models/Request/RegisterTeacherModel.js"
import { ILogger, LogLevels, LoggerTypes, IRegisterStudentUseCase, IRegisterTeacherUseCase, Student, Teacher } from "webapi.core"
import { RegisterUserPresenter } from "../Presenters/RegisterUserPresenter.js"
import { inject } from "inversify";
import { UseCaseTypes } from "webapi.core";
import { forEach } from 'async';
export class RegistrationController {
    private _logger: ILogger;
    private studentUseCase: IRegisterStudentUseCase;
    private teacherUseCase: IRegisterTeacherUseCase;
    private presenter: RegisterUserPresenter;
    public constructor(@inject(LoggerTypes.ILogger) logger: ILogger, @inject(UseCaseTypes.IRegisterStudentUseCase) student: IRegisterStudentUseCase, @inject(UseCaseTypes.IRegisterTeacherUseCase) teacher: IRegisterTeacherUseCase) {
        this._logger = logger;
        this.studentUseCase = student;
        this.teacherUseCase = teacher;
        this.presenter = new RegisterUserPresenter();
    }
    public async Register (req: Request, res: Response, next: NextFunction) {
        try {
            let message: string = "";
            let errors: Array<Error> = [];
            this._logger.Log(LogLevels.debug, 'POST /api/register query: ' + JSON.stringify(req.body));
            if (req.body.hasOwnProperty('students') && req.body.students !== undefined || Array.isArray(req.body.students) && req.body.students.length) {
                let students: Student[] = [];
                req.body.students.map((i: RegisterStudentModel) => {
                    if (emailvalidator.validate(i.email)) {
                        students.push(new Student(i.firstName, i.lastName, i.email))
                    }
                });
                if (students.length) {
                    let request = new RegisterStudentRequest(students);
                    await this.studentUseCase.Handle(request, this.presenter);
                    message = this.presenter.Message;
                    errors = this.presenter.Errors;
                }
            }
            if (req.body.hasOwnProperty('teachers') && req.body.teachers !== undefined || Array.isArray(req.body.teachers) && req.body.teachers.length) {
                let teachers: Teacher[] = [];
                req.body.teachers.map((i: RegisterTeacherModel) => {
                    if (emailvalidator.validate(i.email)) {
                        teachers.push(new Teacher(i.firstName, i.lastName, i.email))
                    }
                });
                if (teachers.length) {
                    let request = new RegisterTeacherRequest(teachers);
                    await this.teacherUseCase.Handle(request, this.presenter);
                    message += `, ${this.presenter.Message}`;
                    this.presenter.Errors.forEach(function (item) {
                        errors.push(item);
                    });
                }
            }
            res.status(this.presenter.Code);
            res.json({ 'message': message, "errors": errors });
        } catch (e) {
            console.error(e);
        }
    }
}