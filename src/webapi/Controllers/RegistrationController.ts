import { Request, Response, NextFunction } from 'express';
import express from 'express'
import emailvalidator from 'email-validator'
import { RegisterStudentRequest, RegisterTeacherRequest } from "core"
import { RegisterStudentModel } from "Models/Request/RegisterStudentModel"
import { RegisterTeacherModel } from "Models/Request/RegisterTeacherModel"
import { IRegisterStudentUseCase, IRegisterTeacherUseCase, Student } from "core"
import { RegisterUserPresenter } from "Presenters/RegisterUserPresenter"
import { fileURLToPath } from 'url';
import { injectable, inject } from "inversify";
import { UseCaseTypes } from "core";
var router = express.Router();
export class RegistrationController {
    private studentUseCase: IRegisterStudentUseCase;
    private teacherUseCase: IRegisterTeacherUseCase;
    private presenter: RegisterUserPresenter;
    public constructor(@inject(UseCaseTypes.IRegisterStudentUseCase) student: IRegisterStudentUseCase, @inject(UseCaseTypes.IRegisterStudentUseCase) teacher: IRegisterTeacherUseCase) {
        this.studentUseCase = student;
        this.teacherUseCase = teacher;
        this.presenter = new RegisterUserPresenter();
    }
    public async RegisterStudent (req: Request, res: Response, next: NextFunction) {
        let message = { 'message': 'Calling /api/register' };
        if (req.body.students !== undefined && req.body.students.length > 0) {
            if (!Array.isArray(req.body.students)) {
                message.message += ' without a list of students specified!';
            } else {
                let models: RegisterStudentModel[] = JSON.parse(req.body);
                let students: Student[] = [];
                models.map(i => {
                    if (emailvalidator.validate(i.email)) {
                        students.push(new Student(i.firstname, i.lastname, i.email))
                    }
                });
                if (students.length) {
                    let request = new RegisterStudentRequest(students);
                    await this.studentUseCase.Handle(request, this.presenter);
                    res.status(this.presenter.Code);
                    res.json({ 'message': this.presenter.Message, "errors": this.presenter.Errors });
                }
            }
        }
    }
    public async RegisterTeacher (req: Request, res: Response, next: NextFunction) {
        let message = { 'message': 'Calling /api/register' };
        if (!req.body.hasOwnProperty('teacher') || req.body.teacher === undefined)
            message.message += ' without a teacher specified!';
        else if (emailvalidator.validate(req.body.teacher) === false)
            message.message += ' with invalid teacher email address!';
        else {
            let model: RegisterTeacherModel = JSON.parse(req.body.teacher);
            let request = new RegisterTeacherRequest(model.firstname, model.lastname, model.email);
            await this.teacherUseCase.Handle(request, this.presenter);
            res.status(this.presenter.Code);
            res.json({ 'message': this.presenter.Message, "errors": this.presenter.Errors });
        }
    }
}