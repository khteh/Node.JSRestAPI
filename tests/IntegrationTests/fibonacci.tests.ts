import 'reflect-metadata'
import config from 'config'
import { assert, test } from 'vitest'
import { app } from "../../src/webapi/index.js"
import port from "../../src/webapi/server.js"
import * as chai from 'chai';
import chaiHttp from 'chai-http'
/*var expect = chai.expect
var assert = chai.assert
var should = chai.should()*/
chai.use(chaiHttp)
//console.log("NODE_ENV: "+config.util.getEnv('NODE_ENV')+ " : "+process.env.NODE_ENV)
expect(config.util.getEnv('NODE_ENV')).toEqual('test');
var verifyClientError = function (err: any, res: any) {
    expect(res).toHaveProperty("statusCode", 400);
    expect(res).toHaveProperty('body');
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).not.toBe('');
}
describe('Fibonacci API tests', async () => {
    /*
      * Test the /GET /api/fibonacci fails without valid input parameter as query string
      */
    describe('/GET /api/fibonacci', async () => {
        it('It should fail with response containing failure message!', () => new Promise<void>(async done => {
            const response = await fetch(`https://localhost:${port}/api/fibonacci`)
            expect(response).toHaveProperty("statusCode", 400);
            expect(response).toHaveProperty('body');
            expect(response.body).toHaveProperty('message');
            const data = await response.json()
            expect(data.body.message).not.toBe('');
            let expects = "Please provide a valid integer as query string for fibonacci(n) calculation!";
            assert.strictEqual(data.body.message, expects, 'Expects the failure message');
            done();
        }));
    });
    /*
      * Test the /GET /api/fibonacci?n=Hello  fails without valid input integer parameter as query string
      */
    describe('/GET /api/fibonacci?n=Hello', async () => {
        it('It should fail with response containing failure message!', () => new Promise<void>(async done => {
            const response = await fetch(`https://localhost:${port}/api/fibonacci?n=Hello`)
            expect(response).toHaveProperty("statusCode", 400);
            expect(response).toHaveProperty('body');
            expect(response.body).toHaveProperty('message');
            const data = await response.json()
            expect(data.body.message).not.toBe('');
            let expects = "Please provide a valid integer as query string for fibonacci(n) calculation!";
            assert.strictEqual(data.body.message, expects, 'Expects the failure message');
            done();
        }));
    });
    /*
      * Test the /GET /api/fibonacci?n=20 succeeds
      */
    describe('/GET /api/fibonacci?n=20', async () => {
        it('It should succeed with response containing the calculated fib(20)!', () => new Promise<void>(async done => {
            const response = await fetch(`https://localhost:${port}/api/fibonacci?n=20`)
            expect(response).toHaveProperty("statusCode", 200);
            expect(response).toHaveProperty('body');
            expect(response.body).toHaveProperty('message');
            const data = await response.json()
            expect(data.body.message).not.toBe('');
            let expects = "Fibonacci(20): 6765";
            assert.strictEqual(data.body.message, expects, 'Expects the calculated fib(20) value');
            done();
        }));
    });
});