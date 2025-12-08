import 'reflect-metadata'
// Set env variable to test during the tests
import config from 'config'
import { app } from "../../src/webapi/index.js"
import port from "../../src/webapi/server.js"
import * as chai from 'chai';
import chaiHttp from 'chai-http'
var expect = chai.expect
var assert = chai.assert
var should = chai.should()
chai.use(chaiHttp)
//console.log("NODE_ENV: "+config.util.getEnv('NODE_ENV')+ " : "+process.env.NODE_ENV)
expect(config.util.getEnv('NODE_ENV')).to.be.eql('test');
var verifyClientError = function (err: any, res: any) {
    expect(res).to.have.status(400);
    expect(res).toHaveProperty('body');
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).not.toBe('');
}
describe('Greetings API tests', async () => {
    /*
      * Test the /GET /api/greetings
      */
    describe('/GET /api/greetings', async () => {
        it('It should succeed with response containing current timestamp!', () => new Promise<void>(async done => {
            const response = await fetch(`https://localhost:${port}/api/greetings`)
            expect(response.status).toBe(200);
            expect(response).toHaveProperty('body');
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).not.toBe('');
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
            let expects = "Hello! It's " + time + " now.";
            assert.strictEqual(response.body.message, expects, 'Expects the greetings message including timestamp to be strictly equal');
            done()
        }));
    });
    /*
      * Test the /GET /api/greetings
      */
    describe('/GET /api/greetings?name=Mickey%20Mouse', async () => {
        it('It should succeed with response containing name and current timestamp!', () => new Promise<void>(async done => {
            const response = await fetch(`https://localhost:${port}/api/greetings?name=Mickey Mouse`)
            expect(response.status).toBe(200);
            expect(response).toHaveProperty('body');
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).not.toBe('');
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
            let expects = "Hello Mickey Mouse! It's " + time + " now.";
            assert.strictEqual(response.body.message, expects, 'Expects the greetings message including timestamp to be strictly equal');
            done()
        }));
    });
});