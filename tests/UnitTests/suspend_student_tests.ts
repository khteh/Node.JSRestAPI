import config from 'config'
import { Mock, It, Times } from 'moq.ts';
import * as chai from 'chai';
import chaiHttp from 'chai-http'
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
import { DataSource, EntityTarget, Repository } from "typeorm"
import { ILogger, Student, Teacher, IStudentRepository, ITeacherRepository, SuspendStudentUseCase, IOutputPort, SuspendStudentRequest, UseCaseResponseMessage } from "webapi.core";
import { Database } from 'infrastructure';
var expect = chai.expect
var assert = chai.assert
var should = chai.should()
chai.use(chaiHttp)
//console.log("NODE_ENV: "+config.util.getEnv('NODE_ENV')+ " : "+process.env.NODE_ENV)
expect(config.util.getEnv('NODE_ENV')).to.be.eql('test');
describe('Suspend student tests', () => {
    let logger: ILogger, studentDB, teacherDB;
    beforeEach(() => {
        logger = new Mock<ILogger>().setup(i => i.Log(It.IsAny<number>(), It.IsAny<string>())).returns().object();
        // public getRepository<T extends EntityBase> (repository: EntityTarget<T>): Repository<T> {
        studentDB = new Mock<Database>().prototypeof(Database.prototype).setup(i => i.getRepository<Student>(It.IsAny<Student>())).returns(It.IsAny<Repository<Student>>());
    });
    it('Valid student should suspend successfully tests', async () => {
        // arrange
        let student = new Student("First Name", "LastName", "student@gmail.com");
        var mockRepository = new Mock<IStudentRepository>()
            .setup(i => i.GetByEmail("student@gmail.com"))
            .returnsAsync(student);
        mockRepository.setup(i => i.Update(It.IsAny<Student>())).returnsAsync(student);
        // 2. The use case and star of this test
        var useCase = new SuspendStudentUseCase(logger, mockRepository.object());
        // 3. The output port is the mechanism to pass response data from the use case to a Presenter 
        // for final preparation to deliver back to the UI/web page/api response etc.
        var mockOutputPort = new Mock<IOutputPort<UseCaseResponseMessage>>()
            .setup(outputPort => outputPort.Handle(It.IsAny<UseCaseResponseMessage>())).returnsAsync();

        // act
        // 4. We need a request model to carry data into the use case from the upper layer (UI, Controller etc.)
        var response: Boolean = await useCase.Handle(new SuspendStudentRequest(student.email), mockOutputPort.object());

        // assert
        expect(response).to.be.true;
        mockRepository.verify(i => i.GetByEmail(It.IsAny<string>()), Times.Once());
        mockRepository.verify(i => i.Update(It.IsAny<string>()), Times.Once());
        mockOutputPort.verify(i => i.Handle(It.IsAny<UseCaseResponseMessage>()), Times.Once());
    });
    it('InValid student should FAIL to suspend tests', async () => {
        // arrange
        let student = new Student("First Name", "LastName", "student@gmail.com");
        var mockRepository = new Mock<IStudentRepository>()
            .setup(i => i.GetByEmail(It.IsAny<string>()))
            .returnsAsync(null);
        mockRepository.setup(i => i.Update(It.IsAny<Student>())).returnsAsync(student);
        // 2. The use case and star of this test
        var useCase = new SuspendStudentUseCase(logger, mockRepository.object());
        // 3. The output port is the mechanism to pass response data from the use case to a Presenter 
        // for final preparation to deliver back to the UI/web page/api response etc.
        var mockOutputPort = new Mock<IOutputPort<UseCaseResponseMessage>>()
            .setup(outputPort => outputPort.Handle(It.IsAny<UseCaseResponseMessage>())).returnsAsync();

        // act
        // 4. We need a request model to carry data into the use case from the upper layer (UI, Controller etc.)
        var response: Boolean = await useCase.Handle(new SuspendStudentRequest(student.email), mockOutputPort.object());

        // assert
        expect(response).to.be.false;
        mockRepository.verify(i => i.GetByEmail(It.IsAny<string>()), Times.Once());
        mockRepository.verify(i => i.Update(It.IsAny<string>()), Times.Never());
        mockOutputPort.verify(i => i.Handle(It.IsAny<UseCaseResponseMessage>()), Times.Once());
    });
});