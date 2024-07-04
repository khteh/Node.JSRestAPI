import config from 'config'
import { Mock, It, Times } from 'moq.ts';
import { app } from "../../src/webapi/index"
import chaiModule from 'chai'
import chaiHttp from 'chai-http'
import chaiAsPromised from "chai-as-promised";
const chai = chaiModule.use(chaiHttp).use(chaiAsPromised)
//chai.use(chaiAsPromised);
import * as typeorm from "typeorm";
import { EntityBase, Student, IStudentRepository, ITeacherRepository, Teacher } from "webapi.core";
import { reject } from 'async';
import { send } from 'process';
var expect = chai.expect
var assert = chai.assert
var should = chai.should()
//chai.use(chaiHttp)
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
describe.skip('Add students to teacher tests', () => {
    /*
      * Test the /POST /api/addstudents passes with valid student data
      */
    it('Valid student should succeed test', (done) => {
        var mockTeacherRepository = new Mock<ITeacherRepository>()
            .setup(i => i.GetByEmail(It.IsAny<string>()))
            .returnsAsync(It.IsAny<Teacher>());
        mockTeacherRepository.setup(i => i.AddStudent(It.IsAny<Teacher>(), It.IsAny<Student>())).returnsAsync(It.IsAny<Teacher>());

        let data = {
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

        chai.request.execute(app)
            .post('/api/addstudents')
            .send(data)
            .end((err, res) => {
                //console.log("/POST /api/register response: " + JSON.stringify(res));
                expect(res).to.have.status(200);
                expect(err).to.be.empty;
                expect(res).to.have.property("Message").and.to.be.a("string").and.to.equal("2 students added successfully to teacher teacher@example.com");
                done();
            });
    });
    it('InValid students should succeed test', (done) => {
        var mockTeacherRepository = new Mock<ITeacherRepository>()
            .setup(i => i.GetByEmail(It.IsAny<string>()))
            .returnsAsync(It.IsAny<Teacher>());
        mockTeacherRepository.setup(i => i.AddStudent(It.IsAny<Teacher>(), It.IsAny<Student>())).returnsAsync(It.IsAny<Teacher>());

        let data = {
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

        chai.request.execute(app)
            .post('/api/addstudents')
            .send(data)
            .end((err, res) => {
                //console.log("/POST /api/register response: " + JSON.stringify(res));
                expect(res).to.have.status(200);
                expect(err).to.be.empty;
                expect(res).to.have.property("Message").and.to.be.a("string").and.to.equal("2 students added successfully to teacher teacher@example.com");
                done();
            });
    });
});