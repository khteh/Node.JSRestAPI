import config from 'config'
import { Mock, It, Times } from 'moq.ts';
import { app } from "../../src/webapi/index.js"
import chai from 'chai'
import chaiHttp from 'chai-http'
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
import * as typeorm from "typeorm";
import { EntityBase, Student, StudentDTO, IStudentRepository, ITeacherRepository, Teacher } from "webapi.core";
import { reject } from 'async';
import { send } from 'process';
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
}
// WIP. Mock doesn't work for integration tests!
describe.skip('Valid data should succeed tests', () => {
    /*
      * Test the /POST /api/register passes with valid student data
      */
    it('Valid student should succeed test', (done) => {
        let request = {
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
        chai.request.execute(app)
            .post('/api/register')
            .send(request)
            .end((err, res) => {
                //console.log("/POST /api/register response: " + JSON.stringify(res));
                expect(res).to.have.status(201);
                expect(err).to.be.empty;
                expect(res).to.have.property("Message").and.to.be.a("string").and.to.equal("2 students registered successfully");
                done();
            });
    });
    /*
      * Test the /POST /api/register passes with valid student data
      */
    it('Valid teacher should succeed test', (done) => {
        let request = {
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
        chai.request.execute(app)
            .post('/api/register')
            .send(request)
            .end((err, res) => {
                //console.log("/POST /api/register response: " + JSON.stringify(res));
                expect(res).to.have.status(201);
                expect(err).to.be.empty;
                expect(res).to.have.property("Message").and.to.be.a("string").and.to.equal("2 teachers registered successfully");
                done();
            });
    });
});
describe.skip('InValid data should fail tests', () => {
    /*
      * Test the /POST /api/register fails with invalid student data
      */
    it('InValid student should fail test', (done) => {
        let request = {
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
        chai.request.execute(app)
            .post('/api/register')
            .send(request)
            .end((err, res) => {
                //console.log("/POST /api/register response: " + JSON.stringify(res));
                expect(res).to.have.status(400);
                expect(err).to.not.be.empty;
                expect(res).to.have.property("Message").and.to.be.a("array").and.to.include("Student student1@b.c registration failed!");
                done();
            });
    });
    /*
      * Test the /POST /api/register fails with invalid teacher data
      */
    it('InValid teacher should fail test', (done) => {
        let request = {
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
        chai.request.execute(app)
            .post('/api/register')
            .send(request)
            .end((err, res) => {
                //console.log("/POST /api/register response: " + JSON.stringify(res));
                expect(res).to.have.status(400);
                expect(err).to.not.be.empty;
                expect(res).to.have.property("Message").and.to.be.a("array").and.to.include("Teacher teacher1@b.c registration failed!");
                done();
            });
    });
});