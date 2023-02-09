import { Request, Response, NextFunction } from 'express'
import express from 'express'
import emailvalidator from 'email-validator'
import { IAddStudentsToTeacherUseCase, AddStudentsToTeacherRequest, Student, Teacher, UseCaseResponseMessage } from "core"
import { RegisterStudentModel } from "../Models/Request/RegisterStudentModel"
import { PresenterBase } from "../Presenters/PresenterBase.js"
import { inject } from "inversify";
import { UseCaseTypes } from "core";
var router = express.Router();
export class AddStudentsToTeacherController {
    private _usecase: IAddStudentsToTeacherUseCase;
    private presenter: PresenterBase<UseCaseResponseMessage>;
    public constructor(@inject(UseCaseTypes.IAddStudentsToTeacherUseCase) usecase: IAddStudentsToTeacherUseCase) {
        this._usecase = usecase;
        this.presenter = new PresenterBase();
    }
    public async AddStudentsToTeacher (req: Request, res: Response, next: NextFunction) {
        let teacher: Teacher | null = null;
        let studentsModel: RegisterStudentModel[] = [];
        let students: Student[] = [];
        let message = { 'message': 'Calling /api/addstudents' };
        if (!req.body.hasOwnProperty('teacher') || req.body.teacher === undefined) {
            message.message += ' without a teacher specified!';
        } else if (emailvalidator.validate(req.body.teacher) === false)
            message.message += ' with invalid teacher email address!';
        else
            teacher = JSON.parse(req.body.teacher);
        if (!req.body.hasOwnProperty('students') || req.body.students === undefined || !req.body.students.length || !Array.isArray(req.body.students))
            message.message += ' without a list of students specified!';
        else
            studentsModel = JSON.parse(req.body.students);
        if (teacher && studentsModel.length) {
            studentsModel.map(i => {
                if (emailvalidator.validate(i.email)) {
                    students.push(new Student(i.firstname, i.lastname, i.email))
                }
            });
            if (students.length) {
                let request = new AddStudentsToTeacherRequest(teacher, students);
                await this._usecase.Handle(request, this.presenter);
                res.status(this.presenter.Code);
                res.json({ 'message': this.presenter.Message, "errors": this.presenter.Errors });
            }
        } else {
            res.status(400);
            res.json(message);
        }
    }
}
