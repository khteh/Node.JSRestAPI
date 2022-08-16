import { Request, Response, NextFunction } from 'express';
import express from 'express'
import emailvalidator from 'email-validator'
import { ICommonStudentsUseCase, CommonStudentsRequest, Student, Teacher } from "core"
import { CommonStudentsPresenter } from "Presenters/CommonStudentsPresenter"
import { inject } from "inversify";
import { UseCaseTypes } from "core";
export class CommonStudentsController {
    private _usecase: ICommonStudentsUseCase;
    private presenter: CommonStudentsPresenter;
    public constructor(@inject(UseCaseTypes.IAddStudentsToTeacherUseCase) usecase: ICommonStudentsUseCase) {
        this._usecase = usecase;
        this.presenter = new CommonStudentsPresenter();
    }
    public async CommonStudents (req: Request, res: Response, next: NextFunction) {
        let message = { 'message': 'Calling /api/commonstudents' };
        if (!req.body.hasOwnProperty('teachers') || req.body.teachers === undefined || !Array.isArray(req.body.teachers) || !req.body.teachers.length) {
            message.message += ' without teachers specified!';
            res.status(400);
            res.json(message);
        } else {
            let request: CommonStudentsRequest = new CommonStudentsRequest(JSON.parse(req.body.teachers));
            await this._usecase.Handle(request, this.presenter);
            res.status(this.presenter.Code);
            res.json({ 'message': this.presenter.Message, "errors": this.presenter.Errors, "Common Students": this.presenter.Students });
        }
    }
}