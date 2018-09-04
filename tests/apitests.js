// Set env variable to test during the tests
process.env.NODE_ENV = 'test';
var assert = require('assert');
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
var should = require('chai').should();
var app = require('../app');
var registration = require('../BusinessLogic/registration.js');
var notifications = require('../BusinessLogic/notifications.js');
var suspend = require('../BusinessLogic/suspend.js');
var commonstudents = require('../BusinessLogic/commonstudents.js');
chai.use(chaiHttp);
/*
  * Test the /GET commonstudents
  */
describe('/GET commonstudents', () => {
    it('it should GET students common to a given list of teachers', (done) => {
        chai.request(app)
            .get('/api/commonstudents')
            .query({ teacher: ['teacherken@gmail.com', 'teacher1@gmail.com', 'teacher2@gmail.com', 'teacher3@gmail.com', 'teacher4@gmail.com'] })
            .end((err, res) => {
                //console.log("/GET /api/commonstudents response: "+JSON.stringify(res.body));
                res.should.have.status(200);
                expect(res.body).to.have.property('students');
                expect(res.body.students).to.be.a('array');
                //res.body.students.length.should.be.eql(0);
                done();
            });
    });
});
/*
  * Test the /POST /api/register
  */
describe('/POST /api/register', () => {
    it('it should register one or more students to a specified teacher', (done) => {
        let register = {
            "teacher": "teacher1@gmail.com",
            "students": [
                "student1@example.com",
                "student2@example.com"
            ]
        }
        chai.request(app)
            .post('/api/register')
            .send(register)
            .end((err, res) => {
                //console.log("/POST /api/register response: " + JSON.stringify(res));
                res.should.have.status(204);
                done();
            });
    });
});
/*
  * Test the /POST /api/suspend
  */
describe('/POST /api/suspend', () => {
    it('it should suspend a specified student', (done) => {
        let suspend = { "student": "student1@example.com" };
        chai.request(app)
            .post('/api/suspend')
            .send(suspend)
            .end((err, res) => {
                //console.log("/POST /api/suspend response: " + JSON.stringify(res));
                res.should.have.status(204);
                done();
            });
    });
});
/*
  * Test the /POST /api/retrievefornotifications
  */
describe('/POST /api/retrievefornotifications', () => {
    it('it should retrieve a list of students who can receive a given notification', (done) => {
        let notifications = {
            "teacher": "teacherken@example.com",
            "notification": "Hello students! @student1@example.com @student3@example.com @student5@example.com @studentjon@example.com"
        }
        chai.request(app)
            .post('/api/retrievefornotifications')
            .send(notifications)
            .end((err, res) => {
                //console.log("/POST /api/register response: " + JSON.stringify(res));
                res.should.have.status(200);
                expect(res.body).to.have.property('recipients');
                expect(res.body.recipients).to.be.a('array');
                done();
            });
    });
});