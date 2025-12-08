import 'reflect-metadata'
// Set env variable to test during the tests
import config from 'config'
//import assert from assert
import chai from 'chai'
import chaiHttp from 'chai-http'
import port from "../../src/webapi/server.js"
import { app, di } from "../../src/webapi/index.js"
import { di } from "../../src/webapi/routes/api.js"
import { EntityBase, Student, StudentDTO, IStudentRepository, ITeacherRepository, Teacher, RepositoryTypes } from "webapi.core";
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
    before('Cleanup teacher_student table!', async () => new Promise<void>(async done => {
        let studentRepo = di.get<IStudentRepository>(RepositoryTypes.IStudentRepository);
        let result = await studentRepo.DeleteAllRelations();
        expect(result).toBe(true);
        done()
        //console.log("Cleanup teacher_student table!");
        /*Query('delete from teacher_student', function (error, result) {
            expect(error).toBeNull();
            done();
        });*/
    }));
    before("Cleanup students table!", async () => new Promise<void>(async done => {
        let studentRepo = di.get<IStudentRepository>(RepositoryTypes.IStudentRepository);
        let result = await studentRepo.DeleteAllStudents();
        expect(result).toBe(true);
        done()
        //console.log("Cleanup students table!");
        /*Query('delete from students', function (error, result) {
            expect(error).toBeNull();
            done();
        });*/
    }));
    before("Cleanup teachers table!", async () => new Promise<void>(async done => {
        //console.log("Cleanup teachers table!");
        let teacherRepo = di.get<ITeacherRepository>(RepositoryTypes.ITeacherRepository);
        let result = await teacherRepo.DeleteAllTeachers();
        expect(result).toBe(true);
        done()
        /*Query('delete from teachers', function (error, result) {
            expect(error).toBeNull();
            done();
        });*/
    }));
    /*
      * Test the /POST /api/register
      */
    describe('/POST /api/register', async () => {
        it('It should FAIL to register due to empty data!', async () => new Promise<void>(async done => {
            const response = await fetch(`https://localhost:${port}/api/register`,
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: ""
                }
            )
            verifyClientError(null, response)
            done()
            /*
            chai.request(app)
                .post('/api/register')
                .send({})
                .end((err, res) => {
                    verifyClientError(err, res);
                    done();
                });*/
        }));
    });
    /*
      * Test the /POST /api/register
      */
    describe('/POST /api/register', () => {
        it('It should NOT register teacher1 and student1 due to invalid email of the teacher!', async () => new Promise<void>(async done => {
            let register = {
                "teacher": "teacher1 @example.com",
                "students": [
                    "student1@example.com",
                ]
            }
            const response = await fetch(`https://localhost:${port}/api/register`,
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(register)
                }
            )
            verifyClientError(null, response)
            done()
            /*chai.request(app)
                .post('/api/register')
                .send(register)
                .end((err, res) => {
                    verifyClientError(err, res);
                    done();
                });*/
        }));
    });
    /*
      * Test the /POST /api/register
      */
    describe('/POST /api/register', () => {
        it('It should NOT register teacher1 and student1 due to invalid email of the student!', () => new Promise<void>(async done => {
            let register = {
                "teacher": "teacher1@example.com",
                "students": [
                    "student1 @example.com",
                ]
            }
            const response = await fetch(`https://localhost:${port}/api/register`,
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(register)
                }
            )
            verifyClientError(null, response)
            done()
            /*
            chai.request(app)
                .post('/api/register')
                .send(register)
                .end((err, res) => {
                    verifyClientError(err, res);
                    done();
                });*/
        }));
    });
    /*
      * Test the /POST /api/register
      */
    describe('/POST /api/register', () => {
        it('It should register teacher1 and student1', () => new Promise<void>(async done => {
            let register = {
                "teacher": "teacher1@example.com",
                "students": [
                    "student1@example.com",
                ]
            }
            const response = await fetch(`https://localhost:${port}/api/register`,
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(register)
                }
            )
            expect(response).toHaveProperty("status", 204);
            done();
            /*chai.request(app)
                .post('/api/register')
                .send(register)
                .end((err, res) => {
                    //console.log("/POST /api/register response: " + JSON.stringify(res));
                    expect(res).toHaveProperty("status", 204);
                    expect(err).toBeNull();
                    done();
                });*/
        }));
    });
    /*
      * Test the /POST /api/register
      */
    describe('/POST /api/register', () => {
        it('It should register teacher2 and student2', () => new Promise<void>(async done => {
            let register = {
                "teacher": "teacher2@example.com",
                "students": [
                    "student1@example.com",
                    "student2@example.com",
                ]
            }
            const response = await fetch(`https://localhost:${port}/api/register`,
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(register)
                }
            )
            expect(response).toHaveProperty("status", 204);
            done();
            /*chai.request(app)
                .post('/api/register')
                .send(register)
                .end((err, res) => {
                    //console.log("/POST /api/register response: " + JSON.stringify(res));
                    expect(res).toHaveProperty("status", 204);
                    expect(err).toBeNull();
                    done();
                });*/
        }));
    });
    /*
      * Test the /GET commonstudents
      */
    describe('/GET commonstudents', () => {
        it('it should GET students common to empty query string which results in error', () => new Promise<void>(async done => {
            const response = await fetch(`https://localhost:${port}/api/commonstudents`)
            verifyClientError(null, response);
            done();
            /*chai.request(app)
                .get('/api/commonstudents')
                .query({})
                .end((err, res) => {
                    verifyClientError(err, res);
                    done();
                });*/
        }));
    });
    /*
      * Test the /GET commonstudents
      */
    describe('/GET commonstudents', () => {
        it('it should GET students common to invalid email in query string which results in error', () => new Promise<void>(async done => {
            const query = new URLSearchParams({ "teacher": "teacher1 @example.com" })
            const response = await fetch(`https://localhost:${port}/api/commonstudents?${query.toString()}`)
            verifyClientError(null, response);
            done();
            /*chai.request(app)
                .get('/api/commonstudents')
                .query({ "teacher": "teacher1 @example.com" })
                .end((err, res) => {
                    verifyClientError(err, res);
                    done();
                });*/
        }));
    });
    /*
      * Test the /GET commonstudents
      */
    describe('/GET commonstudents', () => {
        it('it should GET students common to teacher1@example.com', () => new Promise<void>(async done => {
            const query = new URLSearchParams({ "teacher": "teacher1@example.com" })
            const response = await fetch(`https://localhost:${port}/api/commonstudents?${query.toString()}`)
            expect(response).toHaveProperty("status", 200);
            expect(response).toHaveProperty('body');
            expect(response.body).toHaveProperty('students');
            expect(response.body.students).toBeTypeOf("array").that.includes('student1@example.com');
            expect(response.body.students.length).toEqual(1);
            expect(response.body.students[0]).toEqual('student1@example.com');
            done();
            /*chai.request(app)
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
                        });*/
        }));
    });
    /*
      * Test the /GET commonstudents
      */
    describe('/GET commonstudents', () => {
        it('it should GET students common to teacher2@example.com', () => new Promise<void>(async done => {
            const query = new URLSearchParams({ "teacher": "teacher2@example.com" })
            const response = await fetch(`https://localhost:${port}/api/commonstudents?${query.toString()}`)
            expect(response).toHaveProperty("status", 200);
            expect(response).toHaveProperty('body');
            expect(response.body).toHaveProperty('students');
            expect(response.body.students).toBeTypeOf("array").that.includes('student1@example.com', 'student2@example.com');
            expect(response.body.students.length).toEqual(2);
            done();
            /*chai.request(app)
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
                });*/
        }));
    });
    /*
      * Test the /GET commonstudents
      */
    describe('/GET commonstudents', () => {
        it('it should GET students common to teacher1 and teacher2', () => new Promise<void>(async done => {
            let query = new URLSearchParams({ teacher: 'teacher1@example.com' })
            query.append("teacher", 'teacher2@example.com');
            const response = await fetch(`https://localhost:${port}/api/commonstudents?${query.toString()}`)
            expect(response).toHaveProperty("status", 200);
            expect(response).toHaveProperty('body');
            expect(response.body).toHaveProperty('students');
            expect(reresponses.body.students).toBeTypeOf("array").that.includes('student1@example.com');
            expect(response.body.students.length).toEqual(1);
            expect(response.body.students[0]).toEqual('student1@example.com');
            done();
            /*chai.request(app)
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
                });*/
        }));
    });
    /*
     * Test the /POST /api/retrievefornotifications
     */
    describe('/POST /api/retrievefornotifications', () => {
        it('it should NOT retrieve a list of students who can receive a given notification due to invalid teacher1 email', () => new Promise<void>(async done => {
            let notifications = {
                "teacher": "teacher1 @example.com",
                "notification": "Hello students!"
            }
            const response = await fetch(`https://localhost:${port}/api/retrievefornotifications`,
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(notifications)
                }
            )
            verifyClientError(null, response);
            done();
            /*chai.request(app)
                .post('/api/retrievefornotifications')
                .send(notifications)
                .end((err, res) => {
                    verifyClientError(err, res);
                    done();
                });*/
        }));
    });
    /*
     * Test the /POST /api/retrievefornotifications
     */
    describe('/POST /api/retrievefornotifications', () => {
        it('it should retrieve a list of students who can receive a given notification from teacher1', () => new Promise<void>(async done => {
            let notifications = {
                "teacher": "teacher1@example.com",
                "notification": "Hello students!"
            }
            const response = await fetch(`https://localhost:${port}/api/retrievefornotifications`,
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(notifications)
                }
            )
            expect(response).toHaveProperty("status", 200);
            expect(response).toHaveProperty('body');
            expect(response.body).toHaveProperty('recipients');
            expect(response.body.recipients).toBeTypeOf("array").that.includes('student1@example.com');
            expect(response.body.recipients.length).toEqual(1);
            done();
            /*chai.request(app)
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
                });*/
        }));
    });
    /*
     * Test the /POST /api/retrievefornotifications
     */
    describe('/POST /api/retrievefornotifications', () => {
        it('it should retrieve a list of students who can receive a given notification from teacher1. Unregistered student mentioned should not be considered', () => new Promise<void>(async done => {
            let notifications = {
                "teacher": "teacher1@example.com",
                "notification": "Hello students! @invalidstudent@example.com"
            }
            const response = await fetch(`https://localhost:${port}/api/retrievefornotifications`,
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(notifications)
                }
            )
            expect(response).toHaveProperty("status", 200);
            expect(response).toHaveProperty('body');
            expect(response.body).toHaveProperty('recipients');
            expect(response.body.recipients).toBeTypeOf("array").that.includes('student1@example.com');
            expect(response.body.recipients.length).toEqual(1);
            done();
            /*chai.request(app)
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
                });*/
        }));
    });
    /*
     * Test the /POST /api/retrievefornotifications
     */
    describe('/POST /api/retrievefornotifications', () => {
        it('it should retrieve a student1 and student2 who can receive a given notification from teacher1', () => new Promise<void>(async done => {
            let notifications = {
                "teacher": "teacher1@example.com",
                "notification": "Hello students! @student2@example.com"
            }
            const response = await fetch(`https://localhost:${port}/api/retrievefornotifications`,
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(notifications)
                }
            )
            expect(response).toHaveProperty("status", 200);
            expect(response).toHaveProperty('body');
            expect(response.body).toHaveProperty('recipients');
            expect(response.body.recipients).toBeTypeOf("array").that.includes('student1@example.com', 'student2@example.com');
            expect(response.body.recipients.length).toEqual(2);
            done();
            /*chai.request(app)
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
                });*/
        }));
    });
    /*
     * Test the /POST /api/retrievefornotifications
     */
    describe('/POST /api/retrievefornotifications', () => {
        it('it should retrieve a student1 WITHOUT student2 who can receive a given notification from teacher1 due to invalid student2 email', () => new Promise<void>(async done => {
            let notifications = {
                "teacher": "teacher1@example.com",
                "notification": "Hello students! @student2 @example.com"
            }
            const response = await fetch(`https://localhost:${port}/api/retrievefornotifications`,
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(notifications)
                }
            )
            expect(response).toHaveProperty("status", 200);
            expect(response).toHaveProperty('body');
            expect(response.body).toHaveProperty('recipients');
            expect(response.body.recipients).toBeTypeOf("array").that.includes('student1@example.com');
            expect(response.body.recipients.length).toEqual(1);
            done();
            /*chai.request(app)
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
                });*/
        }));
    });
    /*
     * Test the /POST /api/retrievefornotifications
     */
    describe('/POST /api/retrievefornotifications', () => {
        it('it should retrieve a list of students who can receive a given notification from teacher2 without any student mentioned', () => new Promise<void>(async done => {
            let notifications = {
                "teacher": "teacher2@example.com",
                "notification": "Hello students!"
            }
            const response = await fetch(`https://localhost:${port}/api/retrievefornotifications`,
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(notifications)
                }
            )
            expect(response).toHaveProperty("status", 200);
            expect(response).toHaveProperty('body');
            expect(response.body).toHaveProperty('recipients');
            expect(response.body.recipients).toBeTypeOf("array").that.includes('student1@example.com', 'student2@example.com');
            expect(response.body.recipients.length).toEqual(2);
            done();
            /*chai.request(app)
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
                });*/
        }));
    });
    /*
     * Test the /POST /api/suspend
     */
    describe('/POST /api/suspend', () => {
        it('it should FAIL to suspend due to empty data!', () => new Promise<void>(async done => {
            const response = await fetch(`https://localhost:${port}/api/suspend`,
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: ""
                }
            )
            verifyClientError(null, response);
            done();
            /*chai.request(app)
                .post('/api/suspend')
                .send({})
                .end((err, res) => {
                    verifyClientError(err, res);
                    done();
                });*/
        }));
    });
    /*
     * Test the /POST /api/suspend
     */
    describe('/POST /api/suspend', () => {
        it('it should FAIL to suspend due to invalid email provided!', () => new Promise<void>(async done => {
            let suspend = { "student": "student @example.com" };
            const response = await fetch(`https://localhost:${port}/api/suspend`,
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(suspend)
                }
            )
            verifyClientError(null, response);
            done();
            /*chai.request(app)
                .post('/api/suspend')
                .send({})
                .end((err, res) => {
                    verifyClientError(err, res);
                    done();
                });*/
        }));
    });
    /*
     * Test the /POST /api/suspend
     */
    describe('/POST /api/suspend', () => {
        it('it should FAIL to suspend due to invalid student datatype provided!', () => new Promise<void>(async done => {
            let suspend = { "student": ["student @example.com"] };
            const response = await fetch(`https://localhost:${port}/api/suspend`,
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(suspend)
                }
            )
            verifyClientError(null, response);
            done();
            /*chai.request(app)
                .post('/api/suspend')
                .send({})
                .end((err, res) => {
                    verifyClientError(err, res);
                    done();
                });*/
        }));
    });
    /*
     * Test the /POST /api/suspend
     */
    describe('/POST /api/suspend', () => {
        it('it should suspend student1', () => new Promise<void>(async done => {
            let suspend = { "student": "student1@example.com" };
            const response = await fetch(`https://localhost:${port}/api/suspend`,
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(suspend)
                }
            )
            expect(response).toHaveProperty("status", 204);
            done();
            /*chai.request(app)
                .post('/api/suspend')
                .send(suspend)
                .end((err, res) => {
                    //console.log("/POST /api/suspend response: " + JSON.stringify(res));
                    expect(res).toHaveProperty("status", 204);
                    expect(err).toBeNull();
                    done();
                });*/
        }));
    });
    /*
      * Test the /GET commonstudents
      */
    describe('/GET commonstudents', () => {
        it('it should GET students common to teacher1 and teacher2 after suspending student1', () => new Promise<void>(async done => {
            let query = new URLSearchParams({ teacher: 'teacher1@example.com' })
            query.append("teacher", 'teacher2@example.com');
            const response = await fetch(`https://localhost:${port}/api/commonstudents?${query.toString()}`)
            expect(response).toHaveProperty("status", 200);
            expect(response).toHaveProperty('body');
            expect(response.body).toHaveProperty('students');
            expect(response.body.students).toBeTypeOf("array").that.includes('student1@example.com');
            expect(response.body.students.length).toEqual(1);
            expect(response.body.students[0]).toEqual('student1@example.com');
            done();
            /*chai.request(app)
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
                });*/
        }));
    });
    /*
     * Test the /POST /api/retrievefornotifications
     */
    describe('/POST /api/retrievefornotifications', () => {
        it('it should retrieve a list of EMPTY students who can receive a given notification from teacher1', () => new Promise<void>(async done => {
            let notifications = {
                "teacher": "teacher1@example.com",
                "notification": "Hello students!"
            }
            const response = await fetch(`https://localhost:${port}/api/retrievefornotifications`,
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(notifications)
                }
            )
            expect(response).toHaveProperty("status", 200);
            expect(response).toHaveProperty('body');
            expect(response.body).toHaveProperty('recipients');
            expect(response.body.recipients).toBeTypeOf("array").that.is.empty;
            expect(response.body.recipients.length).toEqual(0);
            done();
            /*chai.request(app)
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
                });*/
        }));
    });
    /*
     * Test the /POST /api/retrievefornotifications
     */
    describe('/POST /api/retrievefornotifications', () => {
        it('it should retrieve a list of students who can receive a given notification from teacher1 when student2 is mentioned', () => new Promise<void>(async done => {
            let notifications = {
                "teacher": "teacher1@example.com",
                "notification": "Hello students! @student2@example.com"
            }
            const response = await fetch(`https://localhost:${port}/api/retrievefornotifications`,
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(notifications)
                }
            )
            expect(response).toHaveProperty("status", 200);
            expect(response).toHaveProperty('body');
            expect(response.body).toHaveProperty('recipients');
            expect(response.body.recipients).toBeTypeOf("array").that.includes('student2@example.com');
            expect(response.body.recipients.length).toEqual(1);
            done();
            /*chai.request(app)
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
                });*/
        }));
    });
    /*
     * Test the /POST /api/retrievefornotifications
     */
    describe('/POST /api/retrievefornotifications', () => {
        it('it should retrieve a list of students who can receive a given notification from teacher2', () => new Promise<void>(async done => {
            let notifications = {
                "teacher": "teacher2@example.com",
                "notification": "Hello students!"
            }
            const response = await fetch(`https://localhost:${port}/api/retrievefornotifications`,
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(notifications)
                }
            )
            expect(response).toHaveProperty("status", 200);
            expect(response).toHaveProperty('body');
            expect(response.body).toHaveProperty('recipients');
            expect(response.body.recipients).toBeTypeOf("array").that.includes('student2@example.com');
            expect(response.body.recipients.length).toEqual(1);
            done();
            /*chai.request(app)
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
                });*/
        }));
    });
    /*
     * Test the /POST /api/retrievefornotifications
     */
    describe('/POST /api/retrievefornotifications', () => {
        it('it should retrieve a list of students who can receive a given notification from teacher2 when student1 is mentioned', () => new Promise<void>(async done => {
            let notifications = {
                "teacher": "teacher2@example.com",
                "notification": "Hello students! @student1@example.com"
            }
            const response = await fetch(`https://localhost:${port}/api/retrievefornotifications`,
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(notifications)
                }
            )
            expect(response).toHaveProperty("status", 200);
            expect(response).toHaveProperty('body');
            expect(response.body).toHaveProperty('recipients');
            expect(response.body.recipients).toBeTypeOf("array").that.includes('student2@example.com');
            expect(response.body.recipients.length).toEqual(1);
            done();
            /*chai.request(app)
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
                });*/
        }));
    });
});