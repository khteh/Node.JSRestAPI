import 'reflect-metadata'
import config from 'config'
import { Mock, It, Times } from 'moq.ts';
import { assert, test } from 'vitest'
import { app } from "../../src/webapi/index.js"
import * as chai from 'chai';
import { default as chaiHttp, request } from "chai-http";
import chaiAsPromised from "chai-as-promised";
//const chai = chaiModule.use(chaiHttp).use(chaiAsPromised)
chai.use(chaiAsPromised);
chai.use(chaiHttp)
import { EntityBase, Student, IStudentRepository, ITeacherRepository, Teacher } from "webapi.core";
import { reject } from 'async';
import { send } from 'process';
/*var expect = chai.expect
var assert = chai.assert
var should = chai.should()*/
//console.log("NODE_ENV: "+config.util.getEnv('NODE_ENV')+ " : "+process.env.NODE_ENV)
expect(config.util.getEnv('NODE_ENV')).toEqual('test');
var verifyClientError = function (err: any, res: any) {
    expect(res).toHaveProperty("statusCode", 400);
    expect(res).toHaveProperty('body');
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).not.toBe('');
}
// WIP. Mock doesn't work for integration tests!
describe.skip('Add students to teacher tests', () => {
    /*
      * Test the /POST /api/addstudents passes with valid student data
      */
    it('Valid student should succeed test', () => new Promise<void>(async done => {
        var mockTeacherRepository = new Mock<ITeacherRepository>()
            .setup(i => i.GetByEmail(It.IsAny<string>()))
            .returnsAsync(It.IsAny<Teacher>());
        mockTeacherRepository.setup(i => i.AddStudent(It.IsAny<Teacher>(), It.IsAny<Student>())).returnsAsync(It.IsAny<Teacher>());
        let payload = {
            teacher: {
                "id": 123,
                "firstName": "First Name",
                "lastName": "LastName",
                "email": "teacher@example.com",
                "created": new Date(),
                "modified": new Date(),
            },
            students: [
                {
                    "firstName": "First Name",
                    "lastName": "LastName",
                    "email": "student1@example.com"
                },
                {
                    "firstName": "First Name",
                    "lastName": "LastName",
                    "email": "student2@example.com"
                }]
        };
        var mockStudentRepository = new Mock<IStudentRepository>()
            .setup(i => i.GetByEmail(It.IsAny<string>()))
            .returnsAsync(It.IsAny<Student>());
        const response = await fetch(`https://localhost:${port}/api/addstudents`,
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }
        )
        expect(response).toHaveProperty("statusCode", 200);
        expect(response).toHaveProperty('body');
        const data = await response.json()
        expect(data.body).toHaveProperty('message');
        expect(data.body.message).toEqual("2 students added successfully to teacher teacher@example.com");
        done();
        /*request.execute(app)
            .post('/api/addstudents')
            .send(data)
            .end((err, res) => {
                //console.log("/POST /api/register response: " + JSON.stringify(res));
                expect(res).to.have.status(200);
                expect(err).to.be.empty;
                expect(res).to.have.property("Message").and.to.be.a("string").and.to.equal("2 students added successfully to teacher teacher@example.com");
                done();
            });*/
    }));
    it('InValid students should succeed test', () => new Promise<void>(async done => {
        var mockTeacherRepository = new Mock<ITeacherRepository>()
            .setup(i => i.GetByEmail(It.IsAny<string>()))
            .returnsAsync(It.IsAny<Teacher>());
        mockTeacherRepository.setup(i => i.AddStudent(It.IsAny<Teacher>(), It.IsAny<Student>())).returnsAsync(It.IsAny<Teacher>());
        let payload = {
            teacher: {
                "id": 123,
                "firstName": "First Name",
                "lastName": "LastName",
                "email": "teacher@example.com",
                "created": new Date(),
                "modified": new Date(),
            },
            students: [
                {
                    "firstName": "First Name",
                    "lastName": "LastName",
                    "email": "student1@example.com"
                },
                {
                    "firstName": "First Name",
                    "lastName": "LastName",
                    "email": "student2@example.com"
                }]
        };
        var mockStudentRepository = new Mock<IStudentRepository>()
            .setup(i => i.GetByEmail(It.IsAny<string>()))
            .returnsAsync(null);
        const response = await fetch(`https://localhost:${port}/api/addstudents`,
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }
        )
        expect(response).toHaveProperty("statusCode", 200);
        expect(response).toHaveProperty('body');
        const data = await response.json()
        expect(data.body).toHaveProperty('message');
        expect(data.body.message).toEqual("2 students added successfully to teacher teacher@example.com");
        done();
        /*request.execute(app)
            .post('/api/addstudents')
            .send(data)
            .end((err, res) => {
                //console.log("/POST /api/register response: " + JSON.stringify(res));
                expect(res).to.have.status(200);
                expect(err).to.be.empty;
                expect(res).to.have.property("Message").and.to.be.a("string").and.to.equal("2 students added successfully to teacher teacher@example.com");
                done();
            });*/
    }));
});