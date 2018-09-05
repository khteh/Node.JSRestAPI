// Set env variable to test during the tests
process.env.NODE_ENV = 'test';
var assert = require('assert');
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
var should = require('chai').should();
var app = require('../app');
var db = require('../lib/db.js');
var registration = require('../BusinessLogic/registration.js');
var notifications = require('../BusinessLogic/notifications.js');
var suspend = require('../BusinessLogic/suspend.js');
var commonstudents = require('../BusinessLogic/commonstudents.js');
chai.use(chaiHttp);
expect(config.util.getEnv('NODE_ENV')).to.be.eql('test');
describe('Two teachers, two students tests', () => {
    //Clean up before all tests in this block
    before('Cleanup teacher_student table!', (done) => {
        console.log("Cleanup teacher_student table!");
        db.query('delete from teacher_student', function (error, result) {
            expect(error).to.be.null;
            done();
        });
    });
    before("Cleanup students table!", (done) => {
        console.log("Cleanup students table!");
        db.query('delete from students', function (error, result) {
            expect(error).to.be.null;
            done();
        });
    });
    before("Cleanup teachers table!", (done) => {
        console.log("Cleanup teachers table!");
        db.query('delete from teachers', function (error, result) {
            expect(error).to.be.null;
            done();
        });
    });
/*
  * Test the /POST /api/register
  */
describe('/POST /api/register', () => {
    it('It should register teacher1 and student1', (done) => {
        let register = {
            "teacher": "teacher1@example.com",
            "students": [
                "student1@example.com",
            ]
        }
        chai.request(app)
            .post('/api/register')
            .send(register)
            .end((err, res) => {
                //console.log("/POST /api/register response: " + JSON.stringify(res));
                expect(res).to.have.status(204);
                expect(err).to.be.null;
                done();
            });
    });
});
/*
  * Test the /POST /api/register
  */
describe('/POST /api/register', () => {
    it('It should register teacher2 and student2', (done) => {
        let register = {
            "teacher": "teacher2@example.com",
            "students": [
                "student1@example.com",
                "student2@example.com",
            ]
        }
        chai.request(app)
            .post('/api/register')
            .send(register)
            .end((err, res) => {
                //console.log("/POST /api/register response: " + JSON.stringify(res));
                expect(res).to.have.status(204);
                expect(err).to.be.null;
                done();
            });
    });
});
/*
  * Test the /GET commonstudents
  */
describe('/GET commonstudents', () => {
    it('it should GET students common to teacher1 and teacher2', (done) => {
        chai.request(app)
            .get('/api/commonstudents')
            .query({ teacher: ['teacher1@example.com', 'teacher2@example.com'] })
            .end((err, res) => {
                //console.log("/GET /api/commonstudents response: "+JSON.stringify(res.body));
                expect(res).to.have.status(200);
                expect(err).to.be.null;
                expect(res).to.have.property('body');
                expect(res.body).to.have.property('students');
                expect(res.body.students).to.be.a('array').that.includes('student1@example.com');
                expect(res.body.students.length).to.be.eql(1);
                expect(res.body.students[0]).to.be.eql('student1@example.com');
                done();
            });
    });
});
/*
 * Test the /POST /api/retrievefornotifications
 */
describe('/POST /api/retrievefornotifications', () => {
    it('it should retrieve a list of students who can receive a given notification from teacher1', (done) => {
        let notifications = {
            "teacher": "teacher1@example.com",
            "notification": "Hello students!"
        }
        chai.request(app)
            .post('/api/retrievefornotifications')
            .send(notifications)
            .end((err, res) => {
                //console.log("/POST /api/register response: " + JSON.stringify(res));
                expect(res).to.have.status(200);
                expect(err).to.be.null;
                expect(res).to.have.property('body');
                expect(res.body).to.have.property('recipients');
                expect(res.body.recipients).to.be.a('array').that.includes('student1@example.com');
                expect(res.body.recipients.length).to.be.eql(1);
                done();
            });
    });
});
    /*
     * Test the /POST /api/retrievefornotifications
     */
describe('/POST /api/retrievefornotifications', () => {
    it('it should retrieve a list of students who can receive a given notification from teacher2', (done) => {
        let notifications = {
            "teacher": "teacher1@example.com",
            "notification": "Hello students! @student2@example.com"
        }
        chai.request(app)
            .post('/api/retrievefornotifications')
            .send(notifications)
            .end((err, res) => {
                //console.log("/POST /api/register response: " + JSON.stringify(res));
                expect(res).to.have.status(200);
                expect(err).to.be.null;
                expect(res).to.have.property('body');
                expect(res.body).to.have.property('recipients');
                expect(res.body.recipients).to.be.a('array').that.includes('student1@example.com', 'student2@example.com');
                expect(res.body.recipients.length).to.be.eql(2);
                done();
            });
    });
});
    /*
     * Test the /POST /api/retrievefornotifications
     */
describe('/POST /api/retrievefornotifications', () => {
    it('it should retrieve a list of students who can receive a given notification from teacher2 without any student mentioned', (done) => {
        let notifications = {
            "teacher": "teacher2@example.com",
            "notification": "Hello students!"
        }
        chai.request(app)
            .post('/api/retrievefornotifications')
            .send(notifications)
            .end((err, res) => {
                //console.log("/POST /api/register response: " + JSON.stringify(res));
                expect(res).to.have.status(200);
                expect(err).to.be.null;
                expect(res).to.have.property('body');
                expect(res.body).to.have.property('recipients');
                expect(res.body.recipients).to.be.a('array').that.includes('student1@example.com', 'student2@example.com');
                expect(res.body.recipients.length).to.be.eql(2);
                done();
            });
    });
});
/*
 * Test the /POST /api/suspend
 */
describe('/POST /api/suspend', () => {
    it('it should suspend student1', (done) => {
        let suspend = { "student": "student1@example.com" };
        chai.request(app)
            .post('/api/suspend')
            .send(suspend)
            .end((err, res) => {
                //console.log("/POST /api/suspend response: " + JSON.stringify(res));
                expect(res).to.have.status(204);
                expect(err).to.be.null;
                done();
            });
    });
});
    /*
      * Test the /GET commonstudents
      */
describe('/GET commonstudents', () => {
    it('it should GET students common to teacher1 and teacher2 after suspending student1', (done) => {
        chai.request(app)
            .get('/api/commonstudents')
            .query({ teacher: ['teacher1@example.com', 'teacher2@example.com'] })
            .end((err, res) => {
                //console.log("/GET /api/commonstudents response: "+JSON.stringify(res.body));
                expect(res).to.have.status(200);
                expect(err).to.be.null;
                expect(res).to.have.property('body');
                expect(res.body).to.have.property('students');
                expect(res.body.students).to.be.a('array').that.includes('student1@example.com');
                expect(res.body.students.length).to.be.eql(1);
                expect(res.body.students[0]).to.be.eql('student1@example.com');
                done();
            });
    });
});

    /*
     * Test the /POST /api/retrievefornotifications
     */
describe('/POST /api/retrievefornotifications', () => {
    it('it should retrieve a list of EMPTY students who can receive a given notification from teacher1', (done) => {
        let notifications = {
            "teacher": "teacher1@example.com",
            "notification": "Hello students!"
        }
        chai.request(app)
            .post('/api/retrievefornotifications')
            .send(notifications)
            .end((err, res) => {
                //console.log("/POST /api/register response: " + JSON.stringify(res));
                expect(res).to.have.status(200);
                expect(err).to.be.null;
                expect(res).to.have.property('body');
                expect(res.body).to.have.property('recipients');
                expect(res.body.recipients).to.be.a('array').that.is.empty;
                expect(res.body.recipients.length).to.be.eql(0);
                done();
            });
    });
});
    /*
     * Test the /POST /api/retrievefornotifications
     */
describe('/POST /api/retrievefornotifications', () => {
    it('it should retrieve a list of students who can receive a given notification from teacher1 when student2 is mentioned', (done) => {
        let notifications = {
            "teacher": "teacher1@example.com",
            "notification": "Hello students! @student2@example.com"
        }
        chai.request(app)
            .post('/api/retrievefornotifications')
            .send(notifications)
            .end((err, res) => {
                //console.log("/POST /api/register response: " + JSON.stringify(res));
                expect(res).to.have.status(200);
                expect(err).to.be.null;
                expect(res).to.have.property('body');
                expect(res.body).to.have.property('recipients');
                expect(res.body.recipients).to.be.a('array').that.includes('student2@example.com');
                expect(res.body.recipients.length).to.be.eql(1);
                done();
            });
    });
});
    /*
     * Test the /POST /api/retrievefornotifications
     */
describe('/POST /api/retrievefornotifications', () => {
    it('it should retrieve a list of students who can receive a given notification from teacher2', (done) => {
        let notifications = {
            "teacher": "teacher2@example.com",
            "notification": "Hello students!"
        }
        chai.request(app)
            .post('/api/retrievefornotifications')
            .send(notifications)
            .end((err, res) => {
                //console.log("/POST /api/register response: " + JSON.stringify(res));
                expect(res).to.have.status(200);
                expect(err).to.be.null;
                expect(res).to.have.property('body');
                expect(res.body).to.have.property('recipients');
                expect(res.body.recipients).to.be.a('array').that.includes('student2@example.com');
                expect(res.body.recipients.length).to.be.eql(1);
                done();
            });
    });
});
    /*
     * Test the /POST /api/retrievefornotifications
     */
describe('/POST /api/retrievefornotifications', () => {
    it('it should retrieve a list of students who can receive a given notification from teacher2 when student1 is mentioned', (done) => {
        let notifications = {
            "teacher": "teacher2@example.com",
            "notification": "Hello students! @student1@example.com"
        }
        chai.request(app)
            .post('/api/retrievefornotifications')
            .send(notifications)
            .end((err, res) => {
                //console.log("/POST /api/register response: " + JSON.stringify(res));
                expect(res).to.have.status(200);
                expect(err).to.be.null;
                expect(res).to.have.property('body');
                expect(res.body).to.have.property('recipients');
                expect(res.body.recipients).to.be.a('array').that.includes('student2@example.com');
                expect(res.body.recipients.length).to.be.eql(1);
                done();
            });
    });
});
});