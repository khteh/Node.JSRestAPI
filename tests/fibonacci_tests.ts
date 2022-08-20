import config from 'config'
//import app from '../app.js'
import { app } from "../src/webapi/index"
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
describe('Fibonacci API tests', () => {
    /*
      * Test the /GET /api/fibonacci fails without valid input parameter as query string
      */
    describe('/GET /api/fibonacci', () => {
        it('It should fail with response containing failure message!', (done) => {
            chai.request(app)
                .get('/api/fibonacci')
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(err).to.be.null;
                    expect(res).to.have.property('body');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.not.be.empty;
                    let expects = "Please provide a valid integer as query string for fibonacci(n) calculation!";
                    assert.strictEqual(res.body.message, expects, 'Expects the failure message');
                    done();
                });
        });
    });
    /*
      * Test the /GET /api/fibonacci?n=Hello  fails without valid input integer parameter as query string
      */
    describe('/GET /api/fibonacci?n=Hello', () => {
        it('It should fail with response containing failure message!', (done) => {
            chai.request(app)
                .get('/api/fibonacci?n=Hello')
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(err).to.be.null;
                    expect(res).to.have.property('body');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.not.be.empty;
                    let expects = "Please provide a valid integer as query string for fibonacci(n) calculation!";
                    assert.strictEqual(res.body.message, expects, 'Expects the failure message');
                    done();
                });
        });
    });
    /*
      * Test the /GET /api/fibonacci?n=20 succeeds
      */
    describe('/GET /api/fibonacci?n=20', () => {
        it('It should succeed with response containing the calculated fib(20)!', (done) => {
            chai.request(app)
                .get('/api/fibonacci?n=20')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(err).to.be.null;
                    expect(res).to.have.property('body');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.not.be.empty;
                    let expects = "Fibonacci(20): 6765";
                    assert.strictEqual(res.body.message, expects, 'Expects the calculated fib(20) value');
                    done();
                });
        });
    });
});