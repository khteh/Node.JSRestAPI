import 'reflect-metadata'
// Set env variable to test during the tests
import config from 'config'
//import assert from assert
import * as chai from 'chai'
import chaiHttp from 'chai-http'
import port from "../../src/webapi/server.js"
import { app } from "../../src/webapi/index.js"
import { di } from "../../src/webapi/routes/api.js"
import { EntityBase, Student, StudentDTO, IStudentRepository, ITeacherRepository, Teacher, RepositoryTypes } from "webapi.core";
//var expect = chai.expect
chai.use(chaiHttp)
expect(config.util.getEnv('NODE_ENV')).toEqual('test');
var verifyClientError = async function (response: Response) {
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('message');
    expect(data.message).not.toBe('');
}
describe('Two teachers, two students tests', () => {
    //Clean up before all tests in this block
    beforeAll(/* Cleanup teacher_student table! */ async () => {
        let studentRepo = di.get<IStudentRepository>(RepositoryTypes.IStudentRepository);
        let result = await studentRepo.DeleteAllRelations();
        expect(result).toBe(true);
        //console.log("Cleanup teacher_student table!");
        /*Query('delete from teacher_student', function (error, result) {
            expect(error).toBeNull();
        });*/
    });
    beforeAll(/* Cleanup students table! */ async () => {
        let studentRepo = di.get<IStudentRepository>(RepositoryTypes.IStudentRepository);
        let result = await studentRepo.DeleteAllStudents();
        expect(result).toBe(true);
        //console.log("Cleanup students table!");
        /*Query('delete from students', function (error, result) {
            expect(error).toBeNull();
        });*/
    });
    beforeAll(/* Cleanup teachers table! */ async () => {
        //console.log("Cleanup teachers table!");
        let teacherRepo = di.get<ITeacherRepository>(RepositoryTypes.ITeacherRepository);
        let result = await teacherRepo.DeleteAllTeachers();
        expect(result).toBe(true);
        /*Query('delete from teachers', function (error, result) {
            expect(error).toBeNull();
        });*/
    });
    /*
      * Test the /POST /api/register
      */
    describe('/POST /api/register', async () => {
        it('It should FAIL to register due to empty data!', async () => {
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
            await verifyClientError(response);
            /*
            chai.request(app)
                .post('/api/register')
                .send({})
                .end((err, res) => {
                    verifyClientError(err, res);
                });*/
        });
    });
    /*
      * Test the /POST /api/register
      */
    describe('/POST /api/register', () => {
        it('It should NOT register teacher1 and student1 due to invalid email of the teacher!', async () => {
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
            await verifyClientError(response);
            /*chai.request(app)
                .post('/api/register')
                .send(register)
                .end((err, res) => {
                    verifyClientError(err, res);
                });*/
        });
    });
    /*
      * Test the /POST /api/register
      */
    describe('/POST /api/register', () => {
        it('It should NOT register teacher1 and student1 due to invalid email of the student!', async () => {
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
            await verifyClientError(response);
            /*
            chai.request(app)
                .post('/api/register')
                .send(register)
                .end((err, res) => {
                    verifyClientError(err, res);
                });*/
        });
    });
    /*
      * Test the /POST /api/register
      */
    describe('/POST /api/register', () => {
        it('It should register teacher1 and student1', async () => {
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
            expect(response.status).toBe(204);
            /*chai.request(app)
                .post('/api/register')
                .send(register)
                .end((err, res) => {
                    //console.log("/POST /api/register response: " + JSON.stringify(res));
                    expect(res).toHaveProperty("statusCode", 204);
                    expect(err).toBeNull();
                });*/
        });
    });
    /*
      * Test the /POST /api/register
      */
    describe('/POST /api/register', () => {
        it('It should register teacher2 and student2', async () => {
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
            expect(response.status).toBe(204);
            /*chai.request(app)
                .post('/api/register')
                .send(register)
                .end((err, res) => {
                    //console.log("/POST /api/register response: " + JSON.stringify(res));
                    expect(res).toHaveProperty("statusCode", 204);
                    expect(err).toBeNull();
                });*/
        });
    });
    /*
      * Test the /GET commonstudents
      */
    describe('/GET commonstudents', () => {
        it('it should GET students common to empty query string which results in error', async () => {
            const response = await fetch(`https://localhost:${port}/api/commonstudents`)
            await verifyClientError(response);
            /*chai.request(app)
                .get('/api/commonstudents')
                .query({})
                .end((err, res) => {
                    verifyClientError(err, res);
                });*/
        });
    });
    /*
      * Test the /GET commonstudents
      */
    describe('/GET commonstudents', () => {
        it('it should GET students common to invalid email in query string which results in error', async () => {
            const query = new URLSearchParams({ "teacher": "teacher1 @example.com" })
            const response = await fetch(`https://localhost:${port}/api/commonstudents?${query.toString()}`)
            await verifyClientError(response);
            /*chai.request(app)
                .get('/api/commonstudents')
                .query({ "teacher": "teacher1 @example.com" })
                .end((err, res) => {
                    verifyClientError(err, res);
                });*/
        });
    });
    /*
      * Test the /GET commonstudents
      */
    describe('/GET commonstudents', () => {
        it('it should GET students common to teacher1@example.com', async () => {
            const query = new URLSearchParams({ "teacher": "teacher1@example.com" })
            const response = await fetch(`https://localhost:${port}/api/commonstudents?${query.toString()}`)
            expect(response.status).toBe(200);
            const data = await response.json()
            expect(data).toHaveProperty('students');
            expect(data).toEqual({
                students: expect.arrayContaining(['student1@example.com'])
            })
            expect(data.students.length).toEqual(1);
            /*chai.request(app)
                        .get('/api/commonstudents')
                        .query({ "teacher": "teacher1@example.com" })
                        .end((err, res) => {
                            //console.log("/GET /api/commonstudents response: "+JSON.stringify(res.body));
                            expect(res).toHaveProperty("statusCode", 200);
                            expect(err).toBeNull();
                            expect(res).toHaveProperty('body');
                            expect(res.body).toHaveProperty('students');
                            expect(res.body.students).toBeTypeOf("array").that.includes('student1@example.com');
                            expect(res.body.students.length).toEqual(1);
                            expect(res.body.students[0]).toEqual('student1@example.com');
                        });*/
        });
    });
    /*
      * Test the /GET commonstudents
      */
    describe('/GET commonstudents', () => {
        it('it should GET students common to teacher2@example.com', async () => {
            const query = new URLSearchParams({ "teacher": "teacher2@example.com" })
            const response = await fetch(`https://localhost:${port}/api/commonstudents?${query.toString()}`)
            expect(response.status).toBe(200);
            const data = await response.json()
            expect(data).toHaveProperty('students');
            expect(data).toEqual({
                students: expect.arrayContaining(['student1@example.com', 'student2@example.com'])
            })
            expect(data.students.length).toEqual(2);
            /*chai.request(app)
                .get('/api/commonstudents')
                .query({ "teacher": "teacher2@example.com" })
                .end((err, res) => {
                    //console.log("/GET /api/commonstudents response: "+JSON.stringify(res.body));
                    expect(res).toHaveProperty("statusCode", 200);
                    expect(err).toBeNull();
                    expect(res).toHaveProperty('body');
                    expect(res.body).toHaveProperty('students');
                    expect(res.body.students).toBeTypeOf("array").that.includes('student1@example.com', 'student2@example.com');
                    expect(res.body.students.length).toEqual(2);
                });*/
        });
    });
    /*
      * Test the /GET commonstudents
      */
    describe('/GET commonstudents', () => {
        it('it should GET students common to teacher1 and teacher2', async () => {
            let query = new URLSearchParams({ teacher: 'teacher1@example.com' })
            query.append("teacher", 'teacher2@example.com');
            const response = await fetch(`https://localhost:${port}/api/commonstudents?${query.toString()}`)
            expect(response.status).toBe(200);
            const data = await response.json()
            expect(data).toHaveProperty('students');
            expect(data).toEqual({
                students: expect.arrayContaining(['student1@example.com'])
            })
            expect(data.students.length).toEqual(1);
            /*chai.request(app)
                .get('/api/commonstudents')
                .query({ teacher: ['teacher1@example.com', 'teacher2@example.com'] })
                .end((err, res) => {
                    //console.log("/GET /api/commonstudents response: "+JSON.stringify(res.body));
                    expect(res).toHaveProperty("statusCode", 200);
                    expect(err).toBeNull();
                    expect(res).toHaveProperty('body');
                    expect(res.body).toHaveProperty('students');
                    expect(res.body.students).toBeTypeOf("array").that.includes('student1@example.com');
                    expect(res.body.students.length).toEqual(1);
                    expect(res.body.students[0]).toEqual('student1@example.com');
                });*/
        });
    });
    /*
     * Test the /POST /api/retrievefornotifications
     */
    describe('/POST /api/retrievefornotifications', () => {
        it('it should NOT retrieve a list of students who can receive a given notification due to invalid teacher1 email', async () => {
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
            await verifyClientError(response);
            /*chai.request(app)
                .post('/api/retrievefornotifications')
                .send(notifications)
                .end((err, res) => {
                    verifyClientError(err, res);
                });*/
        });
    });
    /*
     * Test the /POST /api/retrievefornotifications
     */
    describe('/POST /api/retrievefornotifications', () => {
        it('it should retrieve a list of students who can receive a given notification from teacher1', async () => {
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
            expect(response.status).toBe(200);
            const data = await response.json()
            expect(data).toHaveProperty('recipients');
            expect(data).toEqual({
                recipients: expect.arrayContaining(['student1@example.com'])
            })
            expect(data.recipients.length).toEqual(1);
            /*chai.request(app)
                .post('/api/retrievefornotifications')
                .send(notifications)
                .end((err, res) => {
                    //console.log("/POST /api/register response: " + JSON.stringify(res));
                    expect(res).toHaveProperty("statusCode", 200);
                    expect(err).toBeNull();
                    expect(res).toHaveProperty('body');
                    expect(res.body).toHaveProperty('recipients');
                    expect(res.body.recipients).toBeTypeOf("array").that.includes('student1@example.com');
                    expect(res.body.recipients.length).toEqual(1);
                });*/
        });
    });
    /*
     * Test the /POST /api/retrievefornotifications
     */
    describe('/POST /api/retrievefornotifications', () => {
        it('it should retrieve a list of students who can receive a given notification from teacher1. Unregistered student mentioned should not be considered', async () => {
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
            expect(response.status).toBe(200);
            const data = await response.json()
            expect(data).toHaveProperty('recipients');
            expect(data).toEqual({
                recipients: expect.arrayContaining(['student1@example.com'])
            })
            expect(data.recipients.length).toEqual(1);
            /*chai.request(app)
                .post('/api/retrievefornotifications')
                .send(notifications)
                .end((err, res) => {
                    //console.log("/POST /api/register response: " + JSON.stringify(res));
                    expect(res).toHaveProperty("statusCode", 200);
                    expect(err).toBeNull();
                    expect(res).toHaveProperty('body');
                    expect(res.body).toHaveProperty('recipients');
                    expect(res.body.recipients).toBeTypeOf("array").that.includes('student1@example.com');
                    expect(res.body.recipients.length).toEqual(1);
                });*/
        });
    });
    /*
     * Test the /POST /api/retrievefornotifications
     */
    describe('/POST /api/retrievefornotifications', () => {
        it('it should retrieve a student1 and student2 who can receive a given notification from teacher1', async () => {
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
            expect(response.status).toBe(200);
            const data = await response.json()
            expect(data).toHaveProperty('recipients');
            expect(data).toEqual({
                recipients: expect.arrayContaining(['student1@example.com', 'student2@example.com'])
            })
            expect(data.recipients.length).toEqual(2);
            /*chai.request(app)
                .post('/api/retrievefornotifications')
                .send(notifications)
                .end((err, res) => {
                    //console.log("/POST /api/register response: " + JSON.stringify(res));
                    expect(res).toHaveProperty("statusCode", 200);
                    expect(err).toBeNull();
                    expect(res).toHaveProperty('body');
                    expect(res.body).toHaveProperty('recipients');
                    expect(res.body.recipients).toBeTypeOf("array").that.includes('student1@example.com', 'student2@example.com');
                    expect(res.body.recipients.length).toEqual(2);
                });*/
        });
    });
    /*
     * Test the /POST /api/retrievefornotifications
     */
    describe('/POST /api/retrievefornotifications', () => {
        it('it should retrieve a student1 WITHOUT student2 who can receive a given notification from teacher1 due to invalid student2 email', async () => {
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
            expect(response.status).toBe(200);
            const data = await response.json()
            expect(data).toHaveProperty('recipients');
            expect(data).toEqual({
                recipients: expect.arrayContaining(['student1@example.com'])
            })
            expect(data.recipients.length).toEqual(1);
            /*chai.request(app)
                .post('/api/retrievefornotifications')
                .send(notifications)
                .end((err, res) => {
                    //console.log("/POST /api/register response: " + JSON.stringify(res));
                    expect(res).toHaveProperty("statusCode", 200);
                    expect(err).toBeNull();
                    expect(res).toHaveProperty('body');
                    expect(res.body).toHaveProperty('recipients');
                    expect(res.body.recipients).toBeTypeOf("array").that.includes('student1@example.com');
                    expect(res.body.recipients.length).toEqual(1);
                });*/
        });
    });
    /*
     * Test the /POST /api/retrievefornotifications
     */
    describe('/POST /api/retrievefornotifications', () => {
        it('it should retrieve a list of students who can receive a given notification from teacher2 without any student mentioned', async () => {
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
            expect(response.status).toBe(200);
            const data = await response.json()
            expect(data).toHaveProperty('recipients');
            expect(data).toEqual({
                recipients: expect.arrayContaining(['student1@example.com', 'student2@example.com'])
            })
            expect(data.recipients.length).toEqual(2);
            /*chai.request(app)
                .post('/api/retrievefornotifications')
                .send(notifications)
                .end((err, res) => {
                    //console.log("/POST /api/register response: " + JSON.stringify(res));
                    expect(res).toHaveProperty("statusCode", 200);
                    expect(err).toBeNull();
                    expect(res).toHaveProperty('body');
                    expect(res.body).toHaveProperty('recipients');
                    expect(res.body.recipients).toBeTypeOf("array").that.includes('student1@example.com', 'student2@example.com');
                    expect(res.body.recipients.length).toEqual(2);
                });*/
        });
    });
    /*
     * Test the /POST /api/suspend
     */
    describe('/POST /api/suspend', () => {
        it('it should FAIL to suspend due to empty data!', async () => {
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
            await verifyClientError(response);
            /*chai.request(app)
                .post('/api/suspend')
                .send({})
                .end((err, res) => {
                    verifyClientError(err, res);
                });*/
        });
    });
    /*
     * Test the /POST /api/suspend
     */
    describe('/POST /api/suspend', () => {
        it('it should FAIL to suspend due to invalid email provided!', async () => {
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
            await verifyClientError(response);
            /*chai.request(app)
                .post('/api/suspend')
                .send({})
                .end((err, res) => {
                    verifyClientError(err, res);
                });*/
        });
    });
    /*
     * Test the /POST /api/suspend
     */
    describe('/POST /api/suspend', () => {
        it('it should FAIL to suspend due to invalid student datatype provided!', async () => {
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
            await verifyClientError(response);
            /*chai.request(app)
                .post('/api/suspend')
                .send({})
                .end((err, res) => {
                    verifyClientError(err, res);
                });*/
        });
    });
    /*
     * Test the /POST /api/suspend
     */
    describe('/POST /api/suspend', () => {
        it('it should suspend student1', async () => {
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
            expect(response.status).toBe(204);
            /*chai.request(app)
                .post('/api/suspend')
                .send(suspend)
                .end((err, res) => {
                    //console.log("/POST /api/suspend response: " + JSON.stringify(res));
                    expect(res).toHaveProperty("statusCode", 204);
                    expect(err).toBeNull();
                });*/
        });
    });
    /*
      * Test the /GET commonstudents
      */
    describe('/GET commonstudents', () => {
        it('it should GET students common to teacher1 and teacher2 after suspending student1', async () => {
            let query = new URLSearchParams({ teacher: 'teacher1@example.com' })
            query.append("teacher", 'teacher2@example.com');
            const response = await fetch(`https://localhost:${port}/api/commonstudents?${query.toString()}`)
            expect(response.status).toBe(200);
            const data = await response.json()
            expect(data).toHaveProperty('students');
            expect(data).toEqual({
                students: expect.arrayContaining(['student1@example.com'])
            })
            expect(data.students.length).toEqual(1);
            /*chai.request(app)
                .get('/api/commonstudents')
                .query({ teacher: ['teacher1@example.com', 'teacher2@example.com'] })
                .end((err, res) => {
                    //console.log("/GET /api/commonstudents response: "+JSON.stringify(res.body));
                    expect(res).toHaveProperty("statusCode", 200);
                    expect(err).toBeNull();
                    expect(res).toHaveProperty('body');
                    expect(res.body).toHaveProperty('students');
                    expect(res.body.students).toBeTypeOf("array").that.includes('student1@example.com');
                    expect(res.body.students.length).toEqual(1);
                    expect(res.body.students[0]).toEqual('student1@example.com');
                });*/
        });
    });
    /*
     * Test the /POST /api/retrievefornotifications
     */
    describe('/POST /api/retrievefornotifications', () => {
        it('it should retrieve a list of EMPTY students who can receive a given notification from teacher1', async () => {
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
            expect(response.status).toBe(200);
            const data = await response.json()
            expect(data).toHaveProperty('recipients');
            expect(data).toEqual({
                recipients: expect.arrayContaining([])
            })
            expect(data.recipients.length).toEqual(0);
            /*chai.request(app)
                .post('/api/retrievefornotifications')
                .send(notifications)
                .end((err, res) => {
                    //console.log("/POST /api/register response: " + JSON.stringify(res));
                    expect(res).toHaveProperty("statusCode", 200);
                    expect(err).toBeNull();
                    expect(res).toHaveProperty('body');
                    expect(res.body).toHaveProperty('recipients');
                    expect(res.body.recipients).toBeTypeOf("array").that.is.empty;
                    expect(res.body.recipients.length).toEqual(0);
                });*/
        });
    });
    /*
     * Test the /POST /api/retrievefornotifications
     */
    describe('/POST /api/retrievefornotifications', () => {
        it('it should retrieve a list of students who can receive a given notification from teacher1 when student2 is mentioned', async () => {
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
            expect(response.status).toBe(200);
            const data = await response.json()
            expect(data).toHaveProperty('recipients');
            expect(data).toEqual({
                recipients: expect.arrayContaining(['student2@example.com'])
            })
            expect(data.recipients.length).toEqual(1);
            /*chai.request(app)
                .post('/api/retrievefornotifications')
                .send(notifications)
                .end((err, res) => {
                    //console.log("/POST /api/register response: " + JSON.stringify(res));
                    expect(res).toHaveProperty("statusCode", 200);
                    expect(err).toBeNull();
                    expect(res).toHaveProperty('body');
                    expect(res.body).toHaveProperty('recipients');
                    expect(res.body.recipients).toBeTypeOf("array").that.includes('student2@example.com');
                    expect(res.body.recipients.length).toEqual(1);
                });*/
        });
    });
    /*
     * Test the /POST /api/retrievefornotifications
     */
    describe('/POST /api/retrievefornotifications', () => {
        it('it should retrieve a list of students who can receive a given notification from teacher2', async () => {
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
            expect(response.status).toBe(200);
            const data = await response.json()
            expect(data).toHaveProperty('recipients');
            expect(data).toEqual({
                recipients: expect.arrayContaining(['student2@example.com'])
            })
            expect(data.recipients.length).toEqual(1);
            /*chai.request(app)
                .post('/api/retrievefornotifications')
                .send(notifications)
                .end((err, res) => {
                    //console.log("/POST /api/register response: " + JSON.stringify(res));
                    expect(res).toHaveProperty("statusCode", 200);
                    expect(err).toBeNull();
                    expect(res).toHaveProperty('body');
                    expect(res.body).toHaveProperty('recipients');
                    expect(res.body.recipients).toBeTypeOf("array").that.includes('student2@example.com');
                    expect(res.body.recipients.length).toEqual(1);
                });*/
        });
    });
    /*
     * Test the /POST /api/retrievefornotifications
     */
    describe('/POST /api/retrievefornotifications', () => {
        it('it should retrieve a list of students who can receive a given notification from teacher2 when student1 is mentioned', async () => {
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
            expect(response.status).toBe(200);
            const data = await response.json()
            expect(data).toHaveProperty('recipients');
            expect(data).toEqual({
                recipients: expect.arrayContaining(['student2@example.com'])
            })
            expect(data.recipients.length).toEqual(1);
            /*chai.request(app)
                .post('/api/retrievefornotifications')
                .send(notifications)
                .end((err, res) => {
                    //console.log("/POST /api/register response: " + JSON.stringify(res));
                    expect(res).toHaveProperty("statusCode", 200);
                    expect(err).toBeNull();
                    expect(res).toHaveProperty('body');
                    expect(res.body).toHaveProperty('recipients');
                    expect(res.body.recipients).toBeTypeOf("array").that.includes('student2@example.com');
                    expect(res.body.recipients.length).toEqual(1);
                });*/
        });
    });
});