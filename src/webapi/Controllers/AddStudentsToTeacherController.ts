import { Request, Response, NextFunction } from 'express'
import express from 'express'
import emailvalidator from 'email-validator'
import { ILogger, LogLevels, LoggerTypes, IAddStudentsToTeacherUseCase, AddStudentsToTeacherRequest, Student, Teacher, UseCaseResponseMessage } from "webapi.core"
import { RegisterStudentModel } from "../Models/Request/RegisterStudentModel.js"
import { PresenterBase } from "../Presenters/PresenterBase.js"
import { inject } from "inversify";
import { UseCaseTypes } from "webapi.core";
var router = express.Router();
export class AddStudentsToTeacherController {
    private _logger: ILogger;
    private _usecase: IAddStudentsToTeacherUseCase;
    private presenter: PresenterBase<UseCaseResponseMessage>;
    public constructor(@inject(LoggerTypes.ILogger) logger: ILogger, @inject(UseCaseTypes.IAddStudentsToTeacherUseCase) usecase: IAddStudentsToTeacherUseCase) {
        this._logger = logger;
        this._usecase = usecase;
        this.presenter = new PresenterBase();
    }
    public async AddStudentsToTeacher (req: Request, res: Response, next: NextFunction) {
        try {
            this._logger.Log(LogLevels.debug, 'POST /api/addstudents query: ' + JSON.stringify(req.body));
            let teacher: Teacher | null = null;
            //let studentsModel: RegisterStudentModel[] = [];
            let students: Student[] = [];
            let message = { 'message': 'Calling /api/addstudents' };
            if (!req.body.hasOwnProperty('teacher') || req.body.teacher === undefined) {
                message.message += ' without a teacher specified!';
            } else if (emailvalidator.validate(req.body.teacher.email) === false)
                message.message += ' with invalid teacher email address!';
            else
                teacher = new Teacher("", "", req.body.teacher.email);
            if (!req.body.hasOwnProperty('students') || req.body.students === undefined || !req.body.students.length || !Array.isArray(req.body.students))
                message.message += ' without a list of students specified!';
            //else
            //    studentsModel = req.body.students;//JSON.parse(req.body.students);
            this._logger.Log(LogLevels.debug, `teacher: ${JSON.stringify(teacher)}, students: ${JSON.stringify(req.body.students)}`);
            if (teacher && req.body.students.length) {
                req.body.students.map((i: string) => {
                    if (emailvalidator.validate(i)) {
                        students.push(new Student("", "", i))
                    }
                });
                this._logger.Log(LogLevels.debug, `teacher: ${JSON.stringify(teacher)}, students: ${JSON.stringify(students)}`);
                if (students.length) {
                    this._logger.Log(LogLevels.debug, `Adding ${students.length} students to teacher ${teacher.email}...`);
                    let request = new AddStudentsToTeacherRequest(teacher, students);
                    await this._usecase.Handle(request, this.presenter);
                    res.status(this.presenter.Code);
                    res.json({ 'message': this.presenter.Message, "errors": this.presenter.Errors });
                }
            } else {
                res.status(400);
                res.json(message);
            }
        } catch (e) {
            console.error(e);
        }
    }
}
