import 'reflect-metadata'
// Set env variable to test during the tests
import config from 'config'
//import assert from assert
import chai from 'chai'
import chaiHttp from 'chai-http'
import { app } from "../../src/webapi/index.js"
import di from "./IntegrationTestSetup.js"
import * as typeorm from "typeorm";
import { EntityBase, Student, StudentDTO, IStudentRepository, ITeacherRepository, Teacher, RepositoryTypes } from "webapi.core";
import registration from '../BusinessLogic/registration.js'
import notifications from '../BusinessLogic/notifications.js'
import suspend from '../BusinessLogic/suspend.js'
import commonstudents from '../BusinessLogic/commonstudents.js'
//var expect = chai.expect
chai.use(chaiHttp)
expect(config.util.getEnv('NODE_ENV')).toEqual('test');
var verifyClientError = function (err, res) {
    expect(res).toHaveProperty("status", 400);
    expect(res).toHaveProperty('body');
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).not.toBe('');
    //console.log("/POST /api/register err: "+JSON.stringify(err));
}
describe('Two teachers, two students tests', () => {
    //Clean up before all tests in this block
    before('Cleanup teacher_student table!', async (done) => {
        let studentRepo = di.get<IStudentRepository>(RepositoryTypes.IStudentRepository);
        let result = await studentRepo.DeleteAllRelations();
        expect(result).toBe(true);
        //console.log("Cleanup teacher_student table!");
        /*Query('delete from teacher_student', function (error, result) {
            expect(error).toBeNull();
            done();
        });*/
    });
    before("Cleanup students table!", async (done) => {
        let studentRepo = di.get<IStudentRepository>(RepositoryTypes.IStudentRepository);
        let result = await studentRepo.DeleteAllStudents();
        expect(result).toBe(true);
        //console.log("Cleanup students table!");
        /*Query('delete from students', function (error, result) {
            expect(error).toBeNull();
            done();
        });*/
    });
    before("Cleanup teachers table!", async (done) => {
        //console.log("Cleanup teachers table!");
        let teacherRepo = di.get<ITeacherRepository>(RepositoryTypes.ITeacherRepository);
        let result = await teacherRepo.DeleteAllTeachers();
        expect(result).toBe(true);
        /*Query('delete from teachers', function (error, result) {
            expect(error).toBeNull();
            done();
        });*/
    });
    /*
      * Test the /POST /api/register
      */
    describe('/POST /api/register', () => {
        it('It should FAIL to register due to empty data!', (done) => {
            chai.request(app)
                .post('/api/register')
                .send({})
                .end((err, res) => {
                    verifyClientError(err, res);
                    done();
                });
        });
    });
    /*
      * Test the /POST /api/register
      */
    describe('/POST /api/register', () => {
        it('It should NOT register teacher1 and student1 due to invalid email of the teacher!', (done) => {
            let register = {
                "teacher": "teacher1 @example.com",
                "students": [
                    "student1@example.com",
                ]
            }
            chai.request(app)
                .post('/api/register')
                .send(register)
                .end((err, res) => {
                    verifyClientError(err, res);
                    done();
                });
        });
    });
    /*
      * Test the /POST /api/register
      */
    describe('/POST /api/register', () => {
        it('It should NOT register teacher1 and student1 due to invalid email of the student!', (done) => {
            let register = {
                "teacher": "teacher1@example.com",
                "students": [
                    "student1 @example.com",
                ]
            }
            chai.request(app)
                .post('/api/register')
                .send(register)
                .end((err, res) => {
                    verifyClientError(err, res);
                    done();
                });
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
                    expect(res).toHaveProperty("status", 204);
                    expect(err).toBeNull();
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
                    expect(res).toHaveProperty("status", 204);
                    expect(err).toBeNull();
                    done();
                });
        });
    });
    /*
      * Test the /GET commonstudents
      */
    describe('/GET commonstudents', () => {
        it('it should GET students common to empty query string which results in error', (done) => {
            chai.request(app)
                .get('/api/commonstudents')
                .query({})
                .end((err, res) => {
                    verifyClientError(err, res);
                    done();
                });
        });
    });
    /*
      * Test the /GET commonstudents
      */
    describe('/GET commonstudents', () => {
        it('it should GET students common to invalid email in query string which results in error', (done) => {
            chai.request(app)
                .get('/api/commonstudents')
                .query({ "teacher": "teacher1 @example.com" })
                .end((err, res) => {
                    verifyClientError(err, res);
                    done();
                });
        });
    });
    /*
      * Test the /GET commonstudents
      */
    describe('/GET commonstudents', () => {
        it('it should GET students common to teacher1@example.com', (done) => {
            chai.request(app)
                .get('/api/commonstudents')
                .query({ "teacher": "teacher1@example.com" })
                .end((err, res) => {
                    //console.log("/GET /api/commonstudents response: "+JSON.stringify(res.body));
                    expect(res).toHaveProperty("status", 200);
                    expect(err).toBeNull();
                    expect(res).toHaveProperty('body');
                    expect(res.body).toHaveProperty('students');
                    expect(res.body.students).toBeTypeOf("array").that.includes('student1@example.com');
                    expect(res.body.students.length).toEqual(1);
                    expect(res.body.students[0]).toEqual('student1@example.com');
                    done();
                });
        });
    });
    /*
      * Test the /GET commonstudents
      */
    describe('/GET commonstudents', () => {
        it('it should GET students common to teacher2@example.com', (done) => {
            chai.request(app)
                .get('/api/commonstudents')
                .query({ "teacher": "teacher2@example.com" })
                .end((err, res) => {
                    //console.log("/GET /api/commonstudents response: "+JSON.stringify(res.body));
                    expect(res).toHaveProperty("status", 200);
                    expect(err).toBeNull();
                    expect(res).toHaveProperty('body');
                    expect(res.body).toHaveProperty('students');
                    expect(res.body.students).toBeTypeOf("array").that.includes('student1@example.com', 'student2@example.com');
                    expect(res.body.students.length).toEqual(2);
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
                    expect(res).toHaveProperty("status", 200);
                    expect(err).toBeNull();
                    expect(res).toHaveProperty('body');
                    expect(res.body).toHaveProperty('students');
                    expect(res.body.students).toBeTypeOf("array").that.includes('student1@example.com');
                    expect(res.body.students.length).toEqual(1);
                    expect(res.body.students[0]).toEqual('student1@example.com');
                    done();
                });
        });
    });
    /*
     * Test the /POST /api/retrievefornotifications
     */
    describe('/POST /api/retrievefornotifications', () => {
        it('it should NOT retrieve a list of students who can receive a given notification due to invalid teacher1 email', (done) => {
            let notifications = {
                "teacher": "teacher1 @example.com",
                "notification": "Hello students!"
            }
            chai.request(app)
                .post('/api/retrievefornotifications')
                .send(notifications)
                .end((err, res) => {
                    verifyClientError(err, res);
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
                    expect(res).toHaveProperty("status", 200);
                    expect(err).toBeNull();
                    expect(res).toHaveProperty('body');
                    expect(res.body).toHaveProperty('recipients');
                    expect(res.body.recipients).toBeTypeOf("array").that.includes('student1@example.com');
                    expect(res.body.recipients.length).toEqual(1);
                    done();
                });
        });
    });
    /*
     * Test the /POST /api/retrievefornotifications
     */
    describe('/POST /api/retrievefornotifications', () => {
        it('it should retrieve a list of students who can receive a given notification from teacher1. Unregistered student mentioned should not be considered', (done) => {
            let notifications = {
                "teacher": "teacher1@example.com",
                "notification": "Hello students! @invalidstudent@example.com"
            }
            chai.request(app)
                .post('/api/retrievefornotifications')
                .send(notifications)
                .end((err, res) => {
                    //console.log("/POST /api/register response: " + JSON.stringify(res));
                    expect(res).toHaveProperty("status", 200);
                    expect(err).toBeNull();
                    expect(res).toHaveProperty('body');
                    expect(res.body).toHaveProperty('recipients');
                    expect(res.body.recipients).toBeTypeOf("array").that.includes('student1@example.com');
                    expect(res.body.recipients.length).toEqual(1);
                    done();
                });
        });
    });
    /*
     * Test the /POST /api/retrievefornotifications
     */
    describe('/POST /api/retrievefornotifications', () => {
        it('it should retrieve a student1 and student2 who can receive a given notification from teacher1', (done) => {
            let notifications = {
                "teacher": "teacher1@example.com",
                "notification": "Hello students! @student2@example.com"
            }
            chai.request(app)
                .post('/api/retrievefornotifications')
                .send(notifications)
                .end((err, res) => {
                    //console.log("/POST /api/register response: " + JSON.stringify(res));
                    expect(res).toHaveProperty("status", 200);
                    expect(err).toBeNull();
                    expect(res).toHaveProperty('body');
                    expect(res.body).toHaveProperty('recipients');
                    expect(res.body.recipients).toBeTypeOf("array").that.includes('student1@example.com', 'student2@example.com');
                    expect(res.body.recipients.length).toEqual(2);
                    done();
                });
        });
    });
    /*
     * Test the /POST /api/retrievefornotifications
     */
    describe('/POST /api/retrievefornotifications', () => {
        it('it should retrieve a student1 WITHOUT student2 who can receive a given notification from teacher1 due to invalid student2 email', (done) => {
            let notifications = {
                "teacher": "teacher1@example.com",
                "notification": "Hello students! @student2 @example.com"
            }
            chai.request(app)
                .post('/api/retrievefornotifications')
                .send(notifications)
                .end((err, res) => {
                    //console.log("/POST /api/register response: " + JSON.stringify(res));
                    expect(res).toHaveProperty("status", 200);
                    expect(err).toBeNull();
                    expect(res).toHaveProperty('body');
                    expect(res.body).toHaveProperty('recipients');
                    expect(res.body.recipients).toBeTypeOf("array").that.includes('student1@example.com');
                    expect(res.body.recipients.length).toEqual(1);
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
                    expect(res).toHaveProperty("status", 200);
                    expect(err).toBeNull();
                    expect(res).toHaveProperty('body');
                    expect(res.body).toHaveProperty('recipients');
                    expect(res.body.recipients).toBeTypeOf("array").that.includes('student1@example.com', 'student2@example.com');
                    expect(res.body.recipients.length).toEqual(2);
                    done();
                });
        });
    });
    /*
     * Test the /POST /api/suspend
     */
    describe('/POST /api/suspend', () => {
        it('it should FAIL to suspend due to empty data!', (done) => {
            chai.request(app)
                .post('/api/suspend')
                .send({})
                .end((err, res) => {
                    verifyClientError(err, res);
                    done();
                });
        });
    });
    /*
     * Test the /POST /api/suspend
     */
    describe('/POST /api/suspend', () => {
        it('it should FAIL to suspend due to invalid email provided!', (done) => {
            let suspend = { "student": "student @example.com" };
            chai.request(app)
                .post('/api/suspend')
                .send({})
                .end((err, res) => {
                    verifyClientError(err, res);
                    done();
                });
        });
    });
    /*
     * Test the /POST /api/suspend
     */
    describe('/POST /api/suspend', () => {
        it('it should FAIL to suspend due to invalid student datatype provided!', (done) => {
            let suspend = { "student": ["student @example.com"] };
            chai.request(app)
                .post('/api/suspend')
                .send({})
                .end((err, res) => {
                    verifyClientError(err, res);
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
                    expect(res).toHaveProperty("status", 204);
                    expect(err).toBeNull();
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
                    expect(res).toHaveProperty("status", 200);
                    expect(err).toBeNull();
                    expect(res).toHaveProperty('body');
                    expect(res.body).toHaveProperty('students');
                    expect(res.body.students).toBeTypeOf("array").that.includes('student1@example.com');
                    expect(res.body.students.length).toEqual(1);
                    expect(res.body.students[0]).toEqual('student1@example.com');
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
                    expect(res).toHaveProperty("status", 200);
                    expect(err).toBeNull();
                    expect(res).toHaveProperty('body');
                    expect(res.body).toHaveProperty('recipients');
                    expect(res.body.recipients).toBeTypeOf("array").that.is.empty;
                    expect(res.body.recipients.length).toEqual(0);
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
                    expect(res).toHaveProperty("status", 200);
                    expect(err).toBeNull();
                    expect(res).toHaveProperty('body');
                    expect(res.body).toHaveProperty('recipients');
                    expect(res.body.recipients).toBeTypeOf("array").that.includes('student2@example.com');
                    expect(res.body.recipients.length).toEqual(1);
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
                    expect(res).toHaveProperty("status", 200);
                    expect(err).toBeNull();
                    expect(res).toHaveProperty('body');
                    expect(res.body).toHaveProperty('recipients');
                    expect(res.body.recipients).toBeTypeOf("array").that.includes('student2@example.com');
                    expect(res.body.recipients.length).toEqual(1);
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
                    expect(res).toHaveProperty("status", 200);
                    expect(err).toBeNull();
                    expect(res).toHaveProperty('body');
                    expect(res.body).toHaveProperty('recipients');
                    expect(res.body.recipients).toBeTypeOf("array").that.includes('student2@example.com');
                    expect(res.body.recipients.length).toEqual(1);
                    done();
                });
        });
    });
});