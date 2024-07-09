import express from 'express'
import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from "inversify";
import { ILogger, LoggerTypes, LogLevels, LogLevelsType, Fibonacci } from "webapi.core";
import emailvalidator from 'email-validator'
var router = express.Router();
import url from 'url'
//import { Logger } from "infrastructure"
export class GreetingsController {
    private _logger: ILogger;
    public constructor(@inject(LoggerTypes.ILogger) logger: ILogger) {
        this._logger = logger;
    }
    public Greetings (req: Request, res: Response, next: NextFunction) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        this._logger.Log(LogLevels.debug, 'GET /api/greetings query: ' + JSON.stringify(query, null, 2));
        var greetings = 'Hello';
        let now = new Date();
        let time = now.toLocaleString("en-SG", {
            timeZone: 'Asia/Singapore',
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        })
        if (query.name !== undefined && query.name.length > 0)
            greetings += ' ' + query.name;
        greetings += "! It's " + time + " now.";
        res.status(200);
        res.json({ 'message': greetings });
    };
}