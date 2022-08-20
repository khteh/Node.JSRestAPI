import config from 'config'
import { Mock, It, Times } from 'moq.ts';
import { app } from "webapi"
import chai from 'chai'
import chaiHttp from 'chai-http'
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
import * as typeorm from "typeorm";
import { ILogger, Student, Teacher, IStudentRepository, ITeacherRepository, AddStudentsToTeacherUseCase, IOutputPort, UseCaseResponseMessage, AddStudentsToTeacherRequest } from "core";
import { reject } from 'async';
import { send } from 'process';
var expect = chai.expect
var assert = chai.assert
var should = chai.should()
chai.use(chaiHttp)
//console.log("NODE_ENV: "+config.util.getEnv('NODE_ENV')+ " : "+process.env.NODE_ENV)
expect(config.util.getEnv('NODE_ENV')).to.be.eql('test');
describe('Add students to teacher tests', () => {
    it('Valid students and teacher should succeed test', async () => {
        // arrange
        let logger = new Mock<ILogger>().setup(i => i.Log(It.IsAny<number>(), It.IsAny<string>())).returns().object();
        let student = new Student("First Name", "LastName", "student@gmail.com");
        let teacher = new Teacher("First Name", "LastName", "teacher@gmail.com");
        var mockStudentRepository = new Mock<IStudentRepository>()
            .setup(i => i.GetByEmail(It.IsAny<string>()))
            .returnsAsync(It.IsAny<Student>());
        var mockTeacherRepository = new Mock<ITeacherRepository>()
            .setup(i => i.GetByEmail(It.IsAny<string>()))
            .returnsAsync(It.IsAny<Teacher>())
            .setup(i => i.AddStudent(It.IsAny<Teacher>(), It.IsAny<Student>())).returnsAsync(It.IsAny<Teacher>());
        // 2. The use case and star of this test
        var useCase = new AddStudentsToTeacherUseCase(logger, mockStudentRepository.object(), mockTeacherRepository.object());

        // 3. The output port is the mechanism to pass response data from the use case to a Presenter 
        // for final preparation to deliver back to the UI/web page/api response etc.
        var mockOutputPort = new Mock<IOutputPort<UseCaseResponseMessage>>()
            .setup(outputPort => outputPort.Handle(It.IsAny<UseCaseResponseMessage>())).returnsAsync().object();

        // act
        // 4. We need a request model to carry data into the use case from the upper layer (UI, Controller etc.)
        let students: Student[] = [student];
        var response: Boolean = await useCase.Handle(new AddStudentsToTeacherRequest(teacher, students), mockOutputPort);

        // assert
        expect(response).to.be.true;
        mockStudentRepository.verify(i => i.GetByEmail(It.IsAny<string>()), Times.Once());
        mockTeacherRepository.verify(i => i.GetByEmail(It.IsAny<string>()), Times.Once());
        mockTeacherRepository.verify(i => i.AddStudent(It.IsAny<Teacher>(), It.IsAny<Student>()), Times.Once());
        mockStudentRepository.verify(i => i.AddTeacher(It.IsAny<Student>(), It.IsAny<Teacher>()), Times.Once());
    });
    it('InValid students should fail test', async () => {
        // arrange
        let logger = new Mock<ILogger>().setup(i => i.Log(It.IsAny<number>(), It.IsAny<string>())).returns().object();
        let student = new Student("First Name", "LastName", "student@gmail.com");
        let teacher = new Teacher("First Name", "LastName", "teacher@gmail.com");
        var mockStudentRepository = new Mock<IStudentRepository>()
            .setup(i => i.GetByEmail(It.IsAny<string>()))
            .returnsAsync(null);
        var mockTeacherRepository = new Mock<ITeacherRepository>()
            .setup(i => i.GetByEmail(It.IsAny<string>()))
            .returnsAsync(It.IsAny<Teacher>());
        mockTeacherRepository.setup(i => i.AddStudent(It.IsAny<Teacher>(), It.IsAny<Student>())).returnsAsync(It.IsAny<Teacher>());
        // 2. The use case and star of this test
        var useCase = new AddStudentsToTeacherUseCase(logger, mockStudentRepository.object(), mockTeacherRepository.object());

        // 3. The output port is the mechanism to pass response data from the use case to a Presenter 
        // for final preparation to deliver back to the UI/web page/api response etc.
        var mockOutputPort = new Mock<IOutputPort<UseCaseResponseMessage>>()
            .setup(outputPort => outputPort.Handle(It.IsAny<UseCaseResponseMessage>())).returnsAsync().object();

        // act
        // 4. We need a request model to carry data into the use case from the upper layer (UI, Controller etc.)
        let students: Student[] = [student];
        var response: Boolean = await useCase.Handle(new AddStudentsToTeacherRequest(teacher, students), mockOutputPort);

        // assert
        expect(response).to.be.false;
        mockStudentRepository.verify(i => i.GetByEmail(It.IsAny<string>()), Times.Once());
        mockTeacherRepository.verify(i => i.GetByEmail(It.IsAny<string>()), Times.Once());
        mockTeacherRepository.verify(i => i.AddStudent(It.IsAny<Teacher>(), It.IsAny<Student>()), Times.Never());
        mockStudentRepository.verify(i => i.AddTeacher(It.IsAny<Student>(), It.IsAny<Teacher>()), Times.Never());
    });
    it('InValid teacher should fail test', async () => {
        // arrange
        let logger = new Mock<ILogger>().setup(i => i.Log(It.IsAny<number>(), It.IsAny<string>())).returns().object();
        let student = new Student("First Name", "LastName", "student@gmail.com");
        let teacher = new Teacher("First Name", "LastName", "teacher@gmail.com");
        var mockStudentRepository = new Mock<IStudentRepository>()
            .setup(i => i.GetByEmail(It.IsAny<string>()))
            .returnsAsync(It.IsAny<Student>());
        var mockTeacherRepository = new Mock<ITeacherRepository>()
            .setup(i => i.GetByEmail(It.IsAny<string>()))
            .returnsAsync(null)
            .setup(i => i.AddStudent(It.IsAny<Teacher>(), It.IsAny<Student>())).returnsAsync(It.IsAny<Teacher>());
        // 2. The use case and star of this test
        var useCase = new AddStudentsToTeacherUseCase(logger, mockStudentRepository.object(), mockTeacherRepository.object());

        // 3. The output port is the mechanism to pass response data from the use case to a Presenter 
        // for final preparation to deliver back to the UI/web page/api response etc.
        var mockOutputPort = new Mock<IOutputPort<UseCaseResponseMessage>>()
            .setup(outputPort => outputPort.Handle(It.IsAny<UseCaseResponseMessage>())).returnsAsync().object()

        // act
        // 4. We need a request model to carry data into the use case from the upper layer (UI, Controller etc.)
        let students: Student[] = [student];
        var response: Boolean = await useCase.Handle(new AddStudentsToTeacherRequest(teacher, students), mockOutputPort);

        // assert
        expect(response).to.be.false;
        mockStudentRepository.verify(i => i.GetByEmail(It.IsAny<string>()), Times.Once());
        mockTeacherRepository.verify(i => i.GetByEmail(It.IsAny<string>()), Times.Once());
        mockTeacherRepository.verify(i => i.AddStudent(It.IsAny<Teacher>(), It.IsAny<Student>()), Times.Never());
        mockStudentRepository.verify(i => i.AddTeacher(It.IsAny<Student>(), It.IsAny<Teacher>()), Times.Never());
    });
    it('Existing students with teacher should fail test', async () => {
        // arrange
        let logger = new Mock<ILogger>().setup(i => i.Log(It.IsAny<number>(), It.IsAny<string>())).returns().object();
        let student = new Student("First Name", "LastName", "student@gmail.com");
        let teacher = new Teacher("First Name", "LastName", "teacher@gmail.com");
        teacher.students.push(student);
        var mockStudentRepository = new Mock<IStudentRepository>()
            .setup(i => i.GetByEmail(It.IsAny<string>()))
            .returnsAsync(It.IsAny<Student>());
        var mockTeacherRepository = new Mock<ITeacherRepository>()
            .setup(i => i.GetByEmail(It.IsAny<string>()))
            .returnsAsync(teacher);
        mockTeacherRepository.setup(i => i.AddStudent(It.IsAny<Teacher>(), It.IsAny<Student>())).returnsAsync(It.IsAny<Teacher>());
        // 2. The use case and star of this test
        var useCase = new AddStudentsToTeacherUseCase(logger, mockStudentRepository.object(), mockTeacherRepository.object());

        // 3. The output port is the mechanism to pass response data from the use case to a Presenter 
        // for final preparation to deliver back to the UI/web page/api response etc.
        var mockOutputPort = new Mock<IOutputPort<UseCaseResponseMessage>>()
            .setup(outputPort => outputPort.Handle(It.IsAny<UseCaseResponseMessage>())).returnsAsync().object();

        // act
        // 4. We need a request model to carry data into the use case from the upper layer (UI, Controller etc.)
        let students: Student[] = [student];
        var response: Boolean = await useCase.Handle(new AddStudentsToTeacherRequest(teacher, students), mockOutputPort);

        // assert
        expect(response).to.be.false;
        mockStudentRepository.verify(i => i.GetByEmail(It.IsAny<string>()), Times.Once());
        mockTeacherRepository.verify(i => i.GetByEmail(It.IsAny<string>()), Times.Once());
        mockTeacherRepository.verify(i => i.AddStudent(It.IsAny<Teacher>(), It.IsAny<Student>()), Times.Never());
        mockStudentRepository.verify(i => i.AddTeacher(It.IsAny<Student>(), It.IsAny<Teacher>()), Times.Never());
    });
});