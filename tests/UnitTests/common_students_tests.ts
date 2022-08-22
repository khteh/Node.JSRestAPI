import config from 'config'
import { Mock, It, Times } from 'moq.ts';
import chai from 'chai'
import chaiHttp from 'chai-http'
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
import { ILogger, Student, Teacher, IStudentRepository, ITeacherRepository, CommonStudentsUseCase, IOutputPort, CommonStudentsResponse, CommonStudentsRequest } from "core";
import { CommonStudentsPresenter } from "../../src/webapi/Presenters/CommonStudentsPresenter"
var expect = chai.expect
var assert = chai.assert
var should = chai.should()
chai.use(chaiHttp)
//console.log("NODE_ENV: "+config.util.getEnv('NODE_ENV')+ " : "+process.env.NODE_ENV)
expect(config.util.getEnv('NODE_ENV')).to.be.eql('test');
describe('Common students among teachers tests', () => {
    let logger: ILogger;
    beforeEach(() => {
        logger = new Mock<ILogger>().setup(i => i.Log(It.IsAny<number>(), It.IsAny<string>())).returns().object();
    });
    it('Valid students and teacher should have common students test', async () => {
        // arrange
        let student1 = new Student("First Name1", "LastName1", "student1@gmail.com");
        let student2 = new Student("First Name2", "LastName2", "student2@gmail.com");
        let student3 = new Student("First Name3", "LastName3", "student3@gmail.com");
        let student4 = new Student("First Name4", "LastName4", "student4@gmail.com");
        let student5 = new Student("First Name5", "LastName5", "student5@gmail.com");

        let teacher1 = new Teacher("First Name1", "LastName1", "teacher1@gmail.com");
        let teacher2 = new Teacher("First Name2", "LastName2", "teacher2@gmail.com");
        let teacher3 = new Teacher("First Name3", "LastName3", "teacher3@gmail.com");
        teacher1.students = [student1, student2, student3];
        teacher2.students = [student2, student3, student4];
        teacher3.students = [student3, student4, student5];
        var mockStudentRepository = new Mock<IStudentRepository>()
        var mockTeacherRepository = new Mock<ITeacherRepository>()
            .setup(i => i.GetByEmail("teacher1@gmail.com"))
            .returnsAsync(teacher1)
            .setup(i => i.GetByEmail("teacher2@gmail.com"))
            .returnsAsync(teacher2)
            .setup(i => i.GetByEmail("teacher3@gmail.com"))
            .returnsAsync(teacher3)
        // 2. The use case and star of this test
        var useCase = new CommonStudentsUseCase(logger, mockStudentRepository.object(), mockTeacherRepository.object());

        // 3. The output port is the mechanism to pass response data from the use case to a Presenter 
        // for final preparation to deliver back to the UI/web page/api response etc.
        //var mockOutputPort = new Mock<IOutputPort<CommonStudentsResponse>>()
        //    .setup(outputPort => outputPort.Handle(It.IsAny<CommonStudentsResponse>()));
        var presenter = new CommonStudentsPresenter();

        // act
        // 4. We need a request model to carry data into the use case from the upper layer (UI, Controller etc.)
        let teachers: string[] = ["teacher1@gmail.com", "teacher2@gmail.com", "teacher3@gmail.com"];
        var response: Boolean = await useCase.Handle(new CommonStudentsRequest(teachers), presenter);

        // assert
        expect(response).to.be.true;
        mockTeacherRepository.verify(i => i.GetByEmail("teacher1@gmail.com"), Times.Once());
        mockTeacherRepository.verify(i => i.GetByEmail("teacher2@gmail.com"), Times.Once());
        mockTeacherRepository.verify(i => i.GetByEmail("teacher3@gmail.com"), Times.Once());
        mockTeacherRepository.verify(i => i.GetByEmail(It.IsAny<string>()), Times.Exactly(teachers.length));
        expect(presenter.Code).to.be.eq(200);
        expect(presenter.Errors).to.be.an("array").that.is.empty;
        expect(presenter.Message).to.be.eq("1 common students found!");
        expect(presenter.Students).to.be.an("array").to.have.length(1);
        expect(presenter.Students[0].email).to.be.eq(student3.email);
    });
    it('Valid students and teacher should NOT have common students test', async () => {
        // arrange
        let student1 = new Student("First Name1", "LastName1", "student1@gmail.com");
        let student2 = new Student("First Name2", "LastName2", "student2@gmail.com");
        let student3 = new Student("First Name3", "LastName3", "student3@gmail.com");
        let student4 = new Student("First Name4", "LastName4", "student4@gmail.com");
        let student5 = new Student("First Name5", "LastName5", "student5@gmail.com");
        let teacher1 = new Teacher("First Name1", "LastName1", "teacher1@gmail.com");
        let teacher2 = new Teacher("First Name2", "LastName2", "teacher2@gmail.com");
        let teacher3 = new Teacher("First Name3", "LastName3", "teacher3@gmail.com");
        teacher1.students = [student1, student2, student3];
        teacher2.students = [student4, student5];
        teacher3.students = [student3, student4, student5];
        var mockStudentRepository = new Mock<IStudentRepository>()
        var mockTeacherRepository = new Mock<ITeacherRepository>()
            .setup(i => i.GetByEmail("teacher1@gmail.com"))
            .returnsAsync(teacher1)
            .setup(i => i.GetByEmail("teacher2@gmail.com"))
            .returnsAsync(teacher2)
            .setup(i => i.GetByEmail("teacher3@gmail.com"))
            .returnsAsync(teacher3)
        // 2. The use case and star of this test
        var useCase = new CommonStudentsUseCase(logger, mockStudentRepository.object(), mockTeacherRepository.object());

        // 3. The output port is the mechanism to pass response data from the use case to a Presenter 
        // for final preparation to deliver back to the UI/web page/api response etc.
        //var mockOutputPort = new Mock<IOutputPort<CommonStudentsResponse>>()
        //    .setup(outputPort => outputPort.Handle(It.IsAny<CommonStudentsResponse>()));
        var presenter = new CommonStudentsPresenter();

        // act
        // 4. We need a request model to carry data into the use case from the upper layer (UI, Controller etc.)
        let teachers: string[] = ["teacher1@gmail.com", "teacher2@gmail.com", "teacher3@gmail.com"];
        var response: Boolean = await useCase.Handle(new CommonStudentsRequest(teachers), presenter);

        // assert
        expect(response).to.be.true;
        mockTeacherRepository.verify(i => i.GetByEmail("teacher1@gmail.com"), Times.Once());
        mockTeacherRepository.verify(i => i.GetByEmail("teacher2@gmail.com"), Times.Once());
        mockTeacherRepository.verify(i => i.GetByEmail("teacher3@gmail.com"), Times.Once());
        mockTeacherRepository.verify(i => i.GetByEmail(It.IsAny<string>()), Times.Exactly(teachers.length));
        expect(presenter.Code).to.be.eq(200);
        expect(presenter.Errors).to.be.an("array").that.is.empty;
        expect(presenter.Message).to.be.eq("0 common students found!");
        expect(presenter.Students).to.be.an("array").that.is.empty;
    });
});