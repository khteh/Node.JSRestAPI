import config from 'config'
import { Mock, It, Times } from 'moq.ts';
import { DataSource, EntityTarget, Repository } from "typeorm"
import { app } from "webapi"
import { Database } from 'infrastructure';
import chai from 'chai'
import chaiHttp from 'chai-http'
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
import * as typeorm from "typeorm";
import { ILogger, EntityBase, Student, Teacher, IStudentRepository, ITeacherRepository, RegisterStudentUseCase, RegisterTeacherUseCase, IOutputPort, UseCaseResponseMessage, RegisterStudentRequest, RegisterTeacherRequest } from "core";
import { reject } from 'async';
import { send } from 'process';
var expect = chai.expect
var assert = chai.assert
var should = chai.should()
chai.use(chaiHttp)
//console.log("NODE_ENV: "+config.util.getEnv('NODE_ENV')+ " : "+process.env.NODE_ENV)
expect(config.util.getEnv('NODE_ENV')).to.be.eql('test');
describe('Valid data should succeed tests', () => {
    let logger: ILogger, studentDB, teacherDB;
    beforeEach(() => {
        logger = new Mock<ILogger>().setup(i => i.Log(It.IsAny<number>(), It.IsAny<string>())).returns().object();
        // public getRepository<T extends EntityBase> (repository: EntityTarget<T>): Repository<T> {
        studentDB = new Mock<Database>().prototypeof(Database.prototype).setup(i => i.getRepository<Student>(It.IsAny<Student>())).returns(It.IsAny<Repository<Student>>());
        teacherDB = new Mock<Database>().prototypeof(Database.prototype).setup(i => i.getRepository<Teacher>(It.IsAny<Teacher>())).returns(It.IsAny<Repository<Teacher>>());
    });
    it('Valid student should succeed test', async () => {
        // arrange
        let student = new Student("First Name", "LastName", "student@gmail.com");
        var mockRepository = new Mock<IStudentRepository>()
            .setup(i => i.GetByEmail(It.IsAny<string>()))
            .returnsAsync(null);
        mockRepository.setup(i => i.Add(It.IsAny<Student>())).returnsAsync(student);
        // 2. The use case and star of this test
        var useCase = new RegisterStudentUseCase(logger, mockRepository.object());

        // 3. The output port is the mechanism to pass response data from the use case to a Presenter 
        // for final preparation to deliver back to the UI/web page/api response etc.
        var mockOutputPort = new Mock<IOutputPort<UseCaseResponseMessage>>()
            .setup(outputPort => outputPort.Handle(It.IsAny<UseCaseResponseMessage>())).returnsAsync().object();

        // act
        // 4. We need a request model to carry data into the use case from the upper layer (UI, Controller etc.)
        let students: Student[] = [student];
        var response: Boolean = await useCase.Handle(new RegisterStudentRequest(students), mockOutputPort);

        // assert
        expect(response).to.be.true;
        mockRepository.verify(i => i.GetByEmail(It.IsAny<string>()), Times.Once());
        mockRepository.verify(i => i.Add(It.IsAny<string>()), Times.Once());
    });
    it('Valid teacher should succeed test', async () => {
        // arrange
        let teacher = new Teacher("First Name", "LastName", "teacher@gmail.com");
        var mockRepository = new Mock<ITeacherRepository>()
            .setup(i => i.GetByEmail(It.IsAny<string>()))
            .returnsAsync(null);
        mockRepository.setup(i => i.Add(It.IsAny<Teacher>())).returnsAsync(teacher);
        // 2. The use case and star of this test
        var useCase = new RegisterTeacherUseCase(logger, mockRepository.object());

        // 3. The output port is the mechanism to pass response data from the use case to a Presenter 
        // for final preparation to deliver back to the UI/web page/api response etc.
        var mockOutputPort = new Mock<IOutputPort<UseCaseResponseMessage>>()
            .setup(outputPort => outputPort.Handle(It.IsAny<UseCaseResponseMessage>())).returnsAsync().object();

        // act
        // 4. We need a request model to carry data into the use case from the upper layer (UI, Controller etc.)
        var response: Boolean = await useCase.Handle(new RegisterTeacherRequest(teacher.firstName, teacher.lastName, teacher.email), mockOutputPort);

        // assert
        expect(response).to.be.true;
        mockRepository.verify(i => i.GetByEmail(It.IsAny<string>()), Times.Once());
        mockRepository.verify(i => i.Add(It.IsAny<string>()), Times.Once());
    });
});
describe('InValid data should fail tests', () => {
    let logger: ILogger, studentDB, teacherDB;
    beforeEach(() => {
        logger = new Mock<ILogger>().setup(i => i.Log(It.IsAny<number>(), It.IsAny<string>())).returns().object();
        // public getRepository<T extends EntityBase> (repository: EntityTarget<T>): Repository<T> {
        studentDB = new Mock<Database>().prototypeof(Database.prototype).setup(i => i.getRepository<Student>(It.IsAny<Student>())).returns(It.IsAny<Repository<Student>>());
        teacherDB = new Mock<Database>().prototypeof(Database.prototype).setup(i => i.getRepository<Teacher>(It.IsAny<Teacher>())).returns(It.IsAny<Repository<Teacher>>());
    });
    it('InValid student should fail test', async () => {
        // arrange
        let student = new Student("First Name", "LastName", "student@gmail.com");
        var mockRepository = new Mock<IStudentRepository>()
            .setup(i => i.GetByEmail(It.IsAny<string>()))
            .returnsAsync(It.IsAny<Student>());
        mockRepository.setup(i => i.Add(It.IsAny<Student>())).returnsAsync(null);
        // 2. The use case and star of this test
        var useCase = new RegisterStudentUseCase(logger, mockRepository.object());

        // 3. The output port is the mechanism to pass response data from the use case to a Presenter 
        // for final preparation to deliver back to the UI/web page/api response etc.
        var mockOutputPort = new Mock<IOutputPort<UseCaseResponseMessage>>()
            .setup(outputPort => outputPort.Handle(It.IsAny<UseCaseResponseMessage>())).returnsAsync().object();

        // act
        // 4. We need a request model to carry data into the use case from the upper layer (UI, Controller etc.)
        let students: Student[] = [student];
        var response: Boolean = await useCase.Handle(new RegisterStudentRequest(students), mockOutputPort);

        // assert
        expect(response).to.be.false;
        mockRepository.verify(i => i.GetByEmail(It.IsAny<string>()), Times.Once());
        mockRepository.verify(i => i.Add(It.IsAny<string>()), Times.Never());
    });
    it('InValid teacher should fail test', async () => {
        // arrange
        let teacher = new Teacher("First Name", "LastName", "teacher@gmail.com");
        var mockRepository = new Mock<ITeacherRepository>()
            .setup(i => i.GetByEmail(It.IsAny<string>()))
            .returnsAsync(It.IsAny<Teacher>());
        mockRepository.setup(i => i.Add(It.IsAny<Teacher>())).returnsAsync(null);
        // 2. The use case and star of this test
        var useCase = new RegisterTeacherUseCase(logger, mockRepository.object());

        // 3. The output port is the mechanism to pass response data from the use case to a Presenter 
        // for final preparation to deliver back to the UI/web page/api response etc.
        var mockOutputPort = new Mock<IOutputPort<UseCaseResponseMessage>>()
            .setup(outputPort => outputPort.Handle(It.IsAny<UseCaseResponseMessage>())).returnsAsync().object();

        // act
        // 4. We need a request model to carry data into the use case from the upper layer (UI, Controller etc.)
        var response: Boolean = await useCase.Handle(new RegisterTeacherRequest(teacher.firstName, teacher.lastName, teacher.email), mockOutputPort);

        // assert
        expect(response).to.be.false;
        mockRepository.verify(i => i.GetByEmail(It.IsAny<string>()), Times.Once());
        mockRepository.verify(i => i.Add(It.IsAny<string>()), Times.Never());
    });
    it("InValid student's email should fail test", async () => {
        // arrange
        let student = new Student("First Name", "LastName", "Hello World!!!");
        var mockRepository = new Mock<IStudentRepository>()
            .setup(i => i.GetByEmail(It.IsAny<string>()))
            .returnsAsync(It.IsAny<Student>());
        mockRepository.setup(i => i.Add(It.IsAny<Student>())).returnsAsync(It.IsAny<Student>());
        // 2. The use case and star of this test
        var useCase = new RegisterStudentUseCase(logger, mockRepository.object());

        // 3. The output port is the mechanism to pass response data from the use case to a Presenter 
        // for final preparation to deliver back to the UI/web page/api response etc.
        var mockOutputPort = new Mock<IOutputPort<UseCaseResponseMessage>>()
            .setup(outputPort => outputPort.Handle(It.IsAny<UseCaseResponseMessage>())).returnsAsync().object();

        // act
        // 4. We need a request model to carry data into the use case from the upper layer (UI, Controller etc.)
        let students: Student[] = [student];
        var response: Boolean = await useCase.Handle(new RegisterStudentRequest(students), mockOutputPort);

        // assert
        expect(response).to.be.false;
        mockRepository.verify(i => i.GetByEmail(It.IsAny<string>()), Times.Never());
        mockRepository.verify(i => i.Add(It.IsAny<string>()), Times.Never());
    });
    it('InValid teacher should fail test', async () => {
        // arrange
        let teacher = new Teacher("First Name", "LastName", "Hello World!!!");
        var mockRepository = new Mock<ITeacherRepository>()
            .setup(i => i.GetByEmail(It.IsAny<string>()))
            .returnsAsync(It.IsAny<Teacher>());
        mockRepository.setup(i => i.Add(It.IsAny<Teacher>())).returnsAsync(It.IsAny<Teacher>());
        // 2. The use case and star of this test
        var useCase = new RegisterTeacherUseCase(logger, mockRepository.object());

        // 3. The output port is the mechanism to pass response data from the use case to a Presenter 
        // for final preparation to deliver back to the UI/web page/api response etc.
        var mockOutputPort = new Mock<IOutputPort<UseCaseResponseMessage>>()
            .setup(outputPort => outputPort.Handle(It.IsAny<UseCaseResponseMessage>())).returnsAsync().object();

        // act
        // 4. We need a request model to carry data into the use case from the upper layer (UI, Controller etc.)
        var response: Boolean = await useCase.Handle(new RegisterTeacherRequest(teacher.firstName, teacher.lastName, teacher.email), mockOutputPort);

        // assert
        expect(response).to.be.false;
        mockRepository.verify(i => i.GetByEmail(It.IsAny<string>()), Times.Never());
        mockRepository.verify(i => i.Add(It.IsAny<string>()), Times.Never());
    });
});