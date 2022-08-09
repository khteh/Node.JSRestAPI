import { Request, Response, NextFunction } from 'express';
import url from 'url'
export class Fibonacci {
    public fibonacci(req: Request, res: Response, next: NextFunction) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        var message = "";
        console.log('GET /api/fibonacci query: ' + JSON.stringify(query));
        if (query.n !== undefined && query.n.length > 0 && !isNaN(Number(query.n))) {
            try {
                let result = this.fib(+query.n);
                console.log("fib("+query.n+"): "+ result)
                message = "Fibonacci(" + query.n + "): " + this.fib(Number(query.n));
                res.status(200);
                res.json({ 'message':  message});	
            } catch (e) {
                console.log("Exception! "+ e)
                res.status(500);
                res.json({ 'message':  e});	
            }
        } else {
            message = "Please provide a valid integer as query string for fibonacci(n) calculation!";
            res.status(400);
            res.json({ 'message':  message});	
        }
    }
    private fib(n: number) {
        if (n <= 1)
            return 1;
        else {
            // return fib(n-2) + fib(n-1)
            let result = [0, 1]
            for (let i = 2; i < n + 1; i++) {
                result[i % 2] = result[(i - 2) % 2] + result[(i - 1) % 2];
            }
            return result[n % 2];
        }
    }
}