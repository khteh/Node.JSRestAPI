import config from 'config'
import { Mock, It, Times } from 'moq.ts';
//import app from '../app.js'
import app from "../../src/webapi/index"
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
describe('Valid student should succeed test', () => {
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
                "email": "student1@example.com"
            }
        ];
        let student = new Student("First Name", "LastName", "student@gmail.com");
        var mockRepository = new Mock<IStudentRepository>()
            .setup(i => i.GetByEmail(It.IsAny<string>()))
            .returnsAsync(null);
        mockRepository.setup(i => i.Add(It.IsAny<Student>())).returnsAsync(student);

        chai.request(app)
            .post('/api/register/student')
            .send(students)
            .end((err, res) => {
                //console.log("/POST /api/register response: " + JSON.stringify(res));
                expect(res).to.have.status(201);
                expect(err).to.be.null;
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
        mockRepository.setup(i => i.Add(It.IsAny<Teacher>())).returnsAsync(teacher);

        chai.request(app)
            .post('/api/register/teacher')
            .send(teacher)
            .end((err, res) => {
                //console.log("/POST /api/register response: " + JSON.stringify(res));
                expect(res).to.have.status(201);
                expect(err).to.be.null;
                expect(res).to.have.property("Message").and.to.be.a("string").and.to.equal("Teacher teacher@example.com added successfully!");
                done();
            });
    });
});