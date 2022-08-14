import { Request, Response, NextFunction } from 'express';
import { Fibonacci } from 'core';
import url from 'url'
import { Logger } from "infrastructure"
export class FibonacciController {
    private _fibonacci: Fibonacci;
    public constructor() {
        this._fibonacci = new Fibonacci();
    }
    public Fibonacci (req: Request, res: Response, next: NextFunction) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        var message = "";
        Logger.debug('GET /api/fibonacci query: ' + JSON.stringify(query));
        if (query.n !== undefined && query.n.length > 0 && !isNaN(Number(query.n))) {
            try {
                let result = this._fibonacci.fibonacci(+query.n);
                Logger.debug("fib(" + query.n + "): " + result)
                message = "Fibonacci(" + query.n + "): " + this._fibonacci.fibonacci(Number(query.n));
                res.status(200);
                res.json({ 'message': message });
            } catch (e) {
                Logger.debug("Exception! " + e)
                res.status(500);
                res.json({ 'message': e });
            }
        } else {
            message = "Please provide a valid integer as query string for fibonacci(n) calculation!";
            res.status(400);
            res.json({ 'message': message });
        }
    }
}