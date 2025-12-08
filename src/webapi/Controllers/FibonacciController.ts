import { injectable, inject } from "inversify";
import { FastifyRequest, FastifyReply } from "fastify"
import { ILogger, LoggerTypes, LogLevels, LogLevelsType, Fibonacci } from "webapi.core";
import url from 'url'
export class FibonacciController {
    private _fibonacci: Fibonacci;
    private _logger: ILogger;
    public constructor(@inject(LoggerTypes.ILogger) logger: ILogger) {
        this._logger = logger;
        this._fibonacci = new Fibonacci();
    }
    public Fibonacci (req: FastifyRequest, res: FastifyReply) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        var message = "";
        this._logger.Log(LogLevels.debug, 'GET /api/fibonacci query: ' + JSON.stringify(query, null, 2));
        if (query.n !== undefined && query.n.length > 0 && !isNaN(Number(query.n))) {
            try {
                let result = this._fibonacci.fibonacci(+query.n);
                this._logger.Log(LogLevels.debug, "fib(" + query.n + "): " + result)
                message = "Fibonacci(" + query.n + "): " + this._fibonacci.fibonacci(Number(query.n));
                res.code(200).send({ message: message });
            } catch (e) {
                this._logger.Log(LogLevels.debug, "Exception! " + e)
                res.code(500).send({ message: e });
            }
        } else {
            message = "Please provide a valid integer as query string for fibonacci(n) calculation!";
            res.code(400).send({ message: message });
        }
    }
}