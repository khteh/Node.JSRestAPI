import { type Request, type Response, type NextFunction } from 'express';
import emailvalidator from 'email-validator'
import { type IStudentNotificationsUseCase, StudentNotificationsRequest, StudentNotificationsResponse, Student, Teacher } from "webapi.core"
import { StudentNotificationsPresenter } from "../Presenters/StudentNotificationsPresenter.js"
import { inject } from "inversify";
import { UseCaseTypes } from "webapi.core";
export class StudentNotificationsController {
    private _usecase: IStudentNotificationsUseCase;
    public constructor(@inject(UseCaseTypes.IAddStudentsToTeacherUseCase) usecase: IStudentNotificationsUseCase) {
        this._usecase = usecase;
    }
    /*
    {
        "teacher":  "teacherken@gmail.com",
        "notification": "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com"
    }
    */
    /**
     * POST /api/notifystudents { teacher: "teacher email", notification: "text, may @mention student emails" }
     * Recipients: the teacher's students plus registered students @mentioned in the text, never suspended ones.
     * 200 on success; 400 for a missing or invalid teacher, a missing notification, or an unknown teacher.
     */
    public async NotifyStudents (req: Request, res: Response, next: NextFunction) {
        const presenter = new StudentNotificationsPresenter(); // per request: the controller is shared by all requests
        const teacher = req.body?.teacher;
        const notification = req.body?.notification;
        if (typeof teacher !== 'string' || !emailvalidator.validate(teacher)) {
            res.status(400).json({ 'message': 'Calling /api/notifystudents without valid teacher information!' });
            return;
        }
        if (typeof notification !== 'string' || notification.trim() === '') {
            res.status(400).json({ 'message': 'Calling /api/notifystudents without a notification!' });
            return;
        }
        // "@student@example.com" anywhere in the text, at the start or after whitespace.
        const mentioned = [...notification.matchAll(/(?:^|\s)@(\S+)/g)].map(m => m[1]).filter(i => emailvalidator.validate(i));
        await this._usecase.Handle(new StudentNotificationsRequest(notification, teacher, mentioned), presenter);
        res.status(presenter.Code).json({ 'message': presenter.Message, "errors": presenter.Errors, "recipients": presenter.Recipients });
    }
}