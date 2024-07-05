// Set env variable to test during the tests
import config from 'config'
import { app } from "../src/webapi/index.js"
import chai from 'chai'
import chaiHttp from 'chai-http'
var expect = chai.expect
var assert = chai.assert
var should = chai.should()
chai.use(chaiHttp)
//console.log("NODE_ENV: "+config.util.getEnv('NODE_ENV')+ " : "+process.env.NODE_ENV)
expect(config.util.getEnv('NODE_ENV')).to.be.eql('test');
var verifyClientError = function (err: any, res: any) {
    expect(res).to.have.status(400);
    expect(res).to.have.property('body');
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.not.be.empty;
    //console.log("/POST /api/register err: "+JSON.stringify(err));
}
describe('Greetings API tests', () => {
    /*
      * Test the /GET /api/greetings
      */
    describe('/GET /api/greetings', () => {
        it('It should succeed with response containing current timestamp!', (done) => {
            chai.request(app)
                .get('/api/greetings')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(err).to.be.null;
                    expect(res).to.have.property('body');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.not.be.empty;
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
                    assert.strictEqual(res.body.message, expects, 'Expects the greetings message including timestamp to be strictly equal');
                    done();
                });
        });
    });
    /*
      * Test the /GET /api/greetings
      */
    describe('/GET /api/greetings?name=Mickey%20Mouse', () => {
        it('It should succeed with response containing name and current timestamp!', (done) => {
            chai.request(app)
                .get('/api/greetings')
                .query({ "name": "Mickey Mouse" })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(err).to.be.null;
                    expect(res).to.have.property('body');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.not.be.empty;
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
                    assert.strictEqual(res.body.message, expects, 'Expects the greetings message including timestamp to be strictly equal');
                    done();
                });
        });
    });
});