import { Request, Response, NextFunction } from 'express';
import emailvalidator from 'email-validator'
import { IStudentNotificationsUseCase, StudentNotificationsRequest, StudentNotificationsResponse, Student, Teacher } from "webapi.core"
import { StudentNotificationsPresenter } from "../Presenters/StudentNotificationsPresenter.js"
import { inject } from "inversify";
import { UseCaseTypes } from "webapi.core";
export class StudentNotificationsController {
    private _usecase: IStudentNotificationsUseCase;
    private presenter: StudentNotificationsPresenter;
    public constructor(@inject(UseCaseTypes.IAddStudentsToTeacherUseCase) usecase: IStudentNotificationsUseCase) {
        this._usecase = usecase;
        this.presenter = new StudentNotificationsPresenter();
    }
    /*
    {
        "teacher":  "teacherken@gmail.com",
        "notification": "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com"
    }
    */
    public async NotifyStudents (req: Request, res: Response, next: NextFunction) {
        let message = { 'message': 'Calling /api/notifystudents' };
        if (req.body.hasOwnProperty('teacher') && req.body.teacher !== "" && emailvalidator.validate(req.body.teacher)) {
            let notificationMessage = req.body.notification.split(' @').splice(0);
            var notifications: string[] = req.body.notification.split(' @').splice(1);
            //console.log("notifications: " + JSON.stringify(notifications, null, 2));
            var notification_recipients: string[] = [];
            notifications.map(i => { if (emailvalidator.validate(i)) notification_recipients.push(i) });
            //console.log("notification_emails: " + JSON.stringify(notification_emails, null, 2));
            let request: StudentNotificationsRequest = new StudentNotificationsRequest(notificationMessage, req.body.teacher, notification_recipients);
            await this._usecase.Handle(request, this.presenter);
            res.status(this.presenter.Code);
            res.json({ 'message': this.presenter.Message, "errors": this.presenter.Errors, "recipients": this.presenter.Recipients });
        } else {
            message.message += ' without valid teacher information!';
            res.status(400);
            res.json(message);
        }
    }
}