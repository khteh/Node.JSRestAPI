import config from 'config'
import { Mock, It, Times } from 'moq.ts';
import { app } from "../../src/webapi/index"
import chai from 'chai'
import chaiHttp from 'chai-http'
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
import * as typeorm from "typeorm";
import { EntityBase, Student, IStudentRepository, ITeacherRepository, Teacher } from "core";
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
    //console.log("/POST /api/register err: "+JSON.stringify(err));
}
// WIP. Mock doesn't work for integration tests!
describe('Valid data should succeed tests', () => {
    /*
      * Test the /POST /api/register/student passes with valid student data
      */
    it('Valid student should succeed test', (done) => {
        let students = [
            {
                "firstName": "First Name",
                "lastName": "LastName",
                "email": "student1@example.com"
            },
            {
                "firstName": "First Name",
                "lastName": "LastName",
                "email": "student2@example.com"
            }
        ];
        var mockRepository = new Mock<IStudentRepository>()
            .setup(i => i.GetByEmail(It.IsAny<string>()))
            .returnsAsync(null);
        mockRepository.setup(i => i.Add(It.IsAny<Student>())).returnsAsync(It.IsAny<Student>());

        chai.request(app)
            .post('/api/register/student')
            .send(students)
            .end((err, res) => {
                //console.log("/POST /api/register response: " + JSON.stringify(res));
                expect(res).to.have.status(201);
                expect(err).to.be.empty;
                expect(res).to.have.property("Message").and.to.be.a("string").and.to.equal("2 students registered successfully");
                done();
            });
    });
    /*
      * Test the /POST /api/register/teacher passes with valid student data
      */
    it('Valid teacher should succeed test', (done) => {
        let teacher: Teacher =
        {
            "id": 123,
            "firstName": "First Name",
            "lastName": "LastName",
            "email": "teacher@example.com",
            "created": new Date(),
            "modified": new Date(),
            "student": []
        };
        var mockRepository = new Mock<ITeacherRepository>()
            .setup(i => i.GetByEmail(It.IsAny<string>()))
            .returnsAsync(null);
        mockRepository.setup(i => i.Add(It.IsAny<Teacher>())).returnsAsync(It.IsAny<Teacher>());

        chai.request(app)
            .post('/api/register/teacher')
            .send(teacher)
            .end((err, res) => {
                //console.log("/POST /api/register response: " + JSON.stringify(res));
                expect(res).to.have.status(201);
                expect(err).to.be.empty;
                expect(res).to.have.property("Message").and.to.be.a("string").and.to.equal("Teacher teacher@example.com registered successfully!");
                done();
            });
    });
});
describe('InValid data should fail tests', () => {
    /*
      * Test the /POST /api/register/student passes with valid student data
      */
    it('InValid student should fail test', (done) => {
        let students = [
            {
                "firstName": "First Name",
                "lastName": "LastName",
                "email": "student1@example.com"
            },
            {
                "firstName": "First Name",
                "lastName": "LastName",
                "email": "student1@example.com"
            }
        ];
        var mockRepository = new Mock<IStudentRepository>()
            .setup(i => i.GetByEmail(It.IsAny<string>()))
            .returnsAsync(It.IsAny<Student>());
        mockRepository.setup(i => i.Add(It.IsAny<Student>())).returnsAsync(null);

        chai.request(app)
            .post('/api/register/student')
            .send(students)
            .end((err, res) => {
                //console.log("/POST /api/register response: " + JSON.stringify(res));
                expect(res).to.have.status(400);
                expect(err).to.not.be.empty;
                expect(res).to.have.property("Message").and.to.be.a("string").and.to.equal("0 students registered successfully");
                done();
            });
    });
    /*
      * Test the /POST /api/register/teacher passes with valid student data
      */
    it('InValid teacher should fail test', (done) => {
        let teacher: Teacher =
        {
            "id": 123,
            "firstName": "First Name",
            "lastName": "LastName",
            "email": "teacher@example.com",
            "created": new Date(),
            "modified": new Date(),
            "student": []
        };
        var mockRepository = new Mock<ITeacherRepository>()
            .setup(i => i.GetByEmail(It.IsAny<string>()))
            .returnsAsync(It.IsAny<Teacher>());
        mockRepository.setup(i => i.Add(It.IsAny<Teacher>())).returnsAsync(null);

        chai.request(app)
            .post('/api/register/teacher')
            .send(teacher)
            .end((err, res) => {
                //console.log("/POST /api/register response: " + JSON.stringify(res));
                expect(res).to.have.status(400);
                expect(err).to.not.be.empty;
                expect(res).to.have.property("Message").and.to.be.a("string").and.to.equal("Teacher teacher@example.com registration failed!");
                done();
            });
    });
});