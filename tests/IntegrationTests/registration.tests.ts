import 'reflect-metadata'
import config from 'config'
import { Mock, It, Times } from 'moq.ts';
import { app } from "../../src/webapi/index.js"
import * as chai from 'chai';
import { default as chaiHttp, request } from "chai-http";
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
import * as typeorm from "typeorm";
import { EntityBase, Student, StudentDTO, IStudentRepository, ITeacherRepository, Teacher } from "webapi.core";
import { reject } from 'async';
import { send } from 'process';
//var expect = chai.expect
chai.use(chaiHttp)
//console.log("NODE_ENV: "+config.util.getEnv('NODE_ENV')+ " : "+process.env.NODE_ENV)
expect(config.util.getEnv('NODE_ENV')).toEqual('test');
var verifyClientError = function (err: any, res: any) {
    expect(res).toHaveProperty("status", 400);
    expect(res).toHaveProperty('body');
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).not.toBe('');
}
// WIP. Mock doesn't work for integration tests!
describe.skip('Valid data should succeed tests', () => {
    /*
      * Test the /POST /api/register passes with valid student data
      */
    it('Valid student should succeed test', (done) => {
        let payload = {
            "students": [
                {
                    "firstName": "One",
                    "lastName": "Student",
                    "email": "student1@example.com"
                },
                {
                    "firstName": "Two",
                    "lastName": "Student",
                    "email": "student2@example.com"
                }
            ]
        };
        var mockRepository = new Mock<IStudentRepository>()
            .setup(i => i.GetByEmail(It.IsAny<string>()))
            .returnsAsync(null);
        mockRepository.setup(i => i.Add(It.IsAny<Student>())).returnsAsync(It.IsAny<Student>());
        request.execute(app)
            .post('/api/register')
            .send(payload)
            .end((err, res) => {
                //console.log("/POST /api/register response: " + JSON.stringify(res));
                expect(res).toHaveProperty("status", 201);
                expect(err).toBe('');
                expect(res).toHaveProperty("Message").and.toBeTypeOf("string").and.to.equal("2 students registered successfully");
                done();
            });
    });
    /*
      * Test the /POST /api/register passes with valid student data
      */
    it('Valid teacher should succeed test', (done) => {
        let payload = {
            "teachers": [
                {
                    "firstName": "One",
                    "lastName": "Teacher",
                    "email": "teacher1@example.com"
                },
                {
                    "firstName": "Two",
                    "lastName": "Teacher",
                    "email": "teacher2@example.com"
                }
            ]
        };
        /*{
            "id": 123,
            "firstName": "First Name",
            "lastName": "LastName",
            "email": "teacher@example.com",
            "created": new Date(),
            "modified": new Date(),
            "students": []
        };*/
        var mockRepository = new Mock<ITeacherRepository>()
            .setup(i => i.GetByEmail(It.IsAny<string>()))
            .returnsAsync(null);
        mockRepository.setup(i => i.Add(It.IsAny<Teacher>())).returnsAsync(It.IsAny<Teacher>());
        request.execute(app)
            .post('/api/register')
            .send(payload)
            .end((err, res) => {
                //console.log("/POST /api/register response: " + JSON.stringify(res));
                expect(res).toHaveProperty("status", 201);
                expect(err).toBe('');
                expect(res).toHaveProperty("Message").and.toBeTypeOf("string").and.to.equal("2 teachers registered successfully");
                done();
            });
    });
});
describe.skip('InValid data should fail tests', () => {
    /*
      * Test the /POST /api/register fails with invalid student data
      */
    it('InValid student should fail test', (done) => {
        let payload = {
            "students": [
                {
                    "firstName": "One",
                    "lastName": "Student",
                    "email": "student1@b.c"
                },
                {
                    "firstName": "Two",
                    "lastName": "Student",
                    "email": "student2@b.c"
                }
            ]
        };
        var mockRepository = new Mock<IStudentRepository>()
            .setup(i => i.GetByEmail(It.IsAny<string>()))
            .returnsAsync(It.IsAny<Student>());
        mockRepository.setup(i => i.Add(It.IsAny<Student>())).returnsAsync(null);
        request.execute(app)
            .post('/api/register')
            .send(payload)
            .end((err, res) => {
                //console.log("/POST /api/register response: " + JSON.stringify(res));
                expect(res).toHaveProperty("status", 400);
                expect(err).not.toBe('');
                expect(res).toHaveProperty("Message").and.toBeTypeOf("array").and.toContain("Student student1@b.c registration failed!");
                done();
            });
    });
    /*
      * Test the /POST /api/register fails with invalid teacher data
      */
    it('InValid teacher should fail test', (done) => {
        let payload = {
            "teachers": [
                {
                    "firstName": "One",
                    "lastName": "Teacher",
                    "email": "teacher1@b.c"
                },
                {
                    "firstName": "Two",
                    "lastName": "Teacher",
                    "email": "teacher2@b.c"
                }
            ]
        };
        /*{
            "id": 123,
            "firstName": "First Name",
            "lastName": "LastName",
            "email": "teacher@example.com",
            "created": new Date(),
            "modified": new Date(),
            "students": []
        };*/
        var mockRepository = new Mock<ITeacherRepository>()
            .setup(i => i.GetByEmail(It.IsAny<string>()))
            .returnsAsync(It.IsAny<Teacher>());
        mockRepository.setup(i => i.Add(It.IsAny<Teacher>())).returnsAsync(null);
        request.execute(app)
            .post('/api/register')
            .send(payload)
            .end((err, res) => {
                //console.log("/POST /api/register response: " + JSON.stringify(res));
                expect(res).toHaveProperty("status", 400);
                expect(err).not.toBe('');
                expect(res).toHaveProperty("Message").and.toBeTypeOf("array").and.toContain("Teacher teacher1@b.c registration failed!");
                done();
            });
    });
});