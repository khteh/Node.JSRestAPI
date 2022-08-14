import config from 'config'
import { Mock, It, Times } from 'moq.ts';
//import app from '../app.js'
import app from "../../src/webapi/index"
import chai from 'chai'
import chaiHttp from 'chai-http'
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
import * as typeorm from "typeorm";
import { EntityBase, Student, Teacher, IStudentRepository, ITeacherRepository, RegisterStudentUseCase, RegisterTeacherUseCase, IOutputPort, UseCaseResponseMessage, RegisterStudentRequest, RegisterTeacherRequest } from "core";
import { reject } from 'async';
import { send } from 'process';
var expect = chai.expect
var assert = chai.assert
var should = chai.should()
chai.use(chaiHttp)
//console.log("NODE_ENV: "+config.util.getEnv('NODE_ENV')+ " : "+process.env.NODE_ENV)
expect(config.util.getEnv('NODE_ENV')).to.be.eql('test');
describe('Valid data should succeed test', () => {
    it('Valid student should succeed test', async (done) => {
        // arrange
        let student = new Student("First Name", "LastName", "student@gmail.com");
        var mockRepository = new Mock<IStudentRepository>()
            .setup(i => i.GetByEmail(It.IsAny<string>()))
            .returnsAsync(null);
        mockRepository.setup(i => i.Add(It.IsAny<Student>())).returnsAsync(student);
        // 2. The use case and star of this test
        var useCase = new RegisterStudentUseCase(mockRepository);

        // 3. The output port is the mechanism to pass response data from the use case to a Presenter 
        // for final preparation to deliver back to the UI/web page/api response etc.
        var mockOutputPort = new Mock<IOutputPort<UseCaseResponseMessage>>()
            .setup(outputPort => outputPort.Handle(It.IsAny<UseCaseResponseMessage>()));

        // act
        // 4. We need a request model to carry data into the use case from the upper layer (UI, Controller etc.)
        let students: Student[] = [student];
        var response: Boolean = await useCase.Handle(new RegisterStudentRequest(students), mockOutputPort);

        // assert
        expect(response).to.be.true;
        mockRepository.verify(i => i.GetByEmail(It.IsAny<string>()), Times.Once());
        mockRepository.verify(i => i.Add(It.IsAny<string>()), Times.Once());
    });
    it('Valid teacher should succeed test', async (done) => {
        // arrange
        let teacher = new Teacher("First Name", "LastName", "teacher@gmail.com");
        var mockRepository = new Mock<ITeacherRepository>()
            .setup(i => i.GetByEmail(It.IsAny<string>()))
            .returnsAsync(null);
        mockRepository.setup(i => i.Add(It.IsAny<Teacher>())).returnsAsync(teacher);
        // 2. The use case and star of this test
        var useCase = new RegisterTeacherUseCase(mockRepository);

        // 3. The output port is the mechanism to pass response data from the use case to a Presenter 
        // for final preparation to deliver back to the UI/web page/api response etc.
        var mockOutputPort = new Mock<IOutputPort<UseCaseResponseMessage>>()
            .setup(outputPort => outputPort.Handle(It.IsAny<UseCaseResponseMessage>()));

        // act
        // 4. We need a request model to carry data into the use case from the upper layer (UI, Controller etc.)
        var response: Boolean = await useCase.Handle(new RegisterTeacherRequest(teacher), mockOutputPort);

        // assert
        expect(response).to.be.true;
        mockRepository.verify(i => i.GetByEmail(It.IsAny<string>()), Times.Once());
        mockRepository.verify(i => i.Add(It.IsAny<string>()), Times.Once());
    });
});