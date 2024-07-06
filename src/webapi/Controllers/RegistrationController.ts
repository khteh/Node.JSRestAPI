import { Request, Response, NextFunction } from 'express';
import express from 'express'
import emailvalidator from 'email-validator'
import { RegisterStudentRequest, RegisterTeacherRequest } from "webapi.core"
import { RegisterStudentModel } from "../Models/Request/RegisterStudentModel.js"
import { RegisterTeacherModel } from "../Models/Request/RegisterTeacherModel.js"
import { ILogger, LogLevels, LoggerTypes, IRegisterStudentUseCase, IRegisterTeacherUseCase, Student } from "webapi.core"
import { RegisterUserPresenter } from "../Presenters/RegisterUserPresenter.js"
import { inject } from "inversify";
import { UseCaseTypes } from "webapi.core";
import { forEach } from 'async';
export class RegistrationController {
    private _logger: ILogger;
    private studentUseCase: IRegisterStudentUseCase;
    private teacherUseCase: IRegisterTeacherUseCase;
    private presenter: RegisterUserPresenter;
    public constructor(@inject(LoggerTypes.ILogger) logger: ILogger, @inject(UseCaseTypes.IRegisterStudentUseCase) student: IRegisterStudentUseCase, @inject(UseCaseTypes.IRegisterStudentUseCase) teacher: IRegisterTeacherUseCase) {
        this._logger = logger;
        this.studentUseCase = student;
        this.teacherUseCase = teacher;
        this.presenter = new RegisterUserPresenter();
    }
    public async RegisterStudent (req: Request, res: Response, next: NextFunction) {
        try {
            this._logger.Log(LogLevels.debug, 'POST /api/register/students query: ' + JSON.stringify(req.body));
            let message = { 'message': 'Calling /api/register/students' };
            if (!req.body.hasOwnProperty('students') || req.body.students === undefined || !Array.isArray(req.body.students) || !req.body.students.length) {
                message.message += ' without a students specified!';
                res.status(400);
                res.json(message);
            } else {
                let students: Student[] = [];
                req.body.students.map((i: RegisterStudentModel) => {
                    if (emailvalidator.validate(i.email)) {
                        students.push(new Student(i.firstName, i.lastName, i.email))
                    }
                });
                if (students.length) {
                    let request = new RegisterStudentRequest(students);
                    await this.studentUseCase.Handle(request, this.presenter);
                    res.status(this.presenter.Code);
                    res.json({ 'message': this.presenter.Message, "errors": this.presenter.Errors });
                }
            }
        } catch (e) {
            console.error(e);
        }
    }
    public async RegisterTeacher (req: Request, res: Response, next: NextFunction) {
        try {
            this._logger.Log(LogLevels.debug, 'POST /api/register/teacher query: ' + JSON.stringify(req.body));
            let message = { 'message': '' };
            if (!req.body.hasOwnProperty('teacher') || req.body.teacher === undefined)
                message.message += 'Calling /api/register/teacher without a teacher specified!';
            else if (emailvalidator.validate(req.body.teacher.email) === false)
                message.message += 'Calling /api/register/teacher with invalid teacher email address! ' + req.body.teacher.email;
            if (message["message"]) {
                res.status(400);
                res.json(message);
            } else {
                let model: RegisterTeacherModel = new RegisterTeacherModel(req.body.teacher.firstName, req.body.teacher.lastName, req.body.teacher.email);
                let request = new RegisterTeacherRequest(model.firstName, model.lastName, model.email);
                await this.teacherUseCase.Handle(request, this.presenter);
                res.status(this.presenter.Code);
                res.json({ 'message': this.presenter.Message, "errors": this.presenter.Errors });
            }
        } catch (e) {
            console.error(e);
        }
    }
}