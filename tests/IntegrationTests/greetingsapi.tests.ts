import 'reflect-metadata'
// Set env variable to test during the tests
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
var verifyClientError = async function (response: Response) {
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('message');
    expect(data.message).not.toBe('');
}
// Same format as the server's greeting. Seconds are included, so accept the time just before or after the request.
const sgTime = (d: Date) => d.toLocaleString("en-SG", {
    timeZone: 'Asia/Singapore',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
});
describe('Greetings API tests', async () => {
    /*
      * Test the /GET /api/greetings
      */
    describe('/GET /api/greetings', async () => {
        it('It should succeed with response containing current timestamp!', async () => {
            const before = sgTime(new Date());
            const response = await fetch(`https://localhost:${port}/api/greetings`)
            const after = sgTime(new Date());
            expect(response.status).toBe(200);
            const data = await response.json()
            expect(["Hello! It's " + before + " now.", "Hello! It's " + after + " now."]).toContain(data.message);
        });
    });
    /*
      * Test the /GET /api/greetings
      */
    describe('/GET /api/greetings?name=Mickey%20Mouse', async () => {
        it('It should succeed with response containing name and current timestamp!', async () => {
            const before = sgTime(new Date());
            const response = await fetch(`https://localhost:${port}/api/greetings?name=Mickey Mouse`)
            const after = sgTime(new Date());
            expect(response.status).toBe(200);
            const data = await response.json()
            expect(["Hello Mickey Mouse! It's " + before + " now.", "Hello Mickey Mouse! It's " + after + " now."]).toContain(data.message);
        });
    });
});