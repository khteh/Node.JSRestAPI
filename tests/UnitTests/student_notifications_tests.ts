import config from 'config'
import { Mock, It, Times } from 'moq.ts';
import chai from 'chai'
import chaiHttp from 'chai-http'
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
import { DataSource, EntityTarget, Repository } from "typeorm"
import { ILogger, Student, Teacher, IStudentRepository, ITeacherRepository, StudentNotificationsUseCase, IOutputPort, StudentNotificationsRequest, UseCaseResponseMessage } from "webapi.core";
import { Database } from 'infrastructure';
import { StudentNotificationsPresenter } from "../../src/webapi/Presenters/StudentNotificationsPresenter"
var expect = chai.expect
var assert = chai.assert
var should = chai.should()
chai.use(chaiHttp)
//console.log("NODE_ENV: "+config.util.getEnv('NODE_ENV')+ " : "+process.env.NODE_ENV)
expect(config.util.getEnv('NODE_ENV')).to.be.eql('test');
describe('Student notifications tests', () => {
  let logger: ILogger, studentDB, teacherDB;
  beforeEach(() => {
    logger = new Mock<ILogger>().setup(i => i.Log(It.IsAny<number>(), It.IsAny<string>())).returns().object();
    // public getRepository<T extends EntityBase> (repository: EntityTarget<T>): Repository<T> {
    studentDB = new Mock<Database>().prototypeof(Database.prototype).setup(i => i.getRepository<Student>(It.IsAny<Student>())).returns(It.IsAny<Repository<Student>>());
    teacherDB = new Mock<Database>().prototypeof(Database.prototype).setup(i => i.getRepository<Teacher>(It.IsAny<Teacher>())).returns(It.IsAny<Repository<Teacher>>());
  });
  /*
{
"teacher":  "teacherken@gmail.com",
"notification": "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com"
}
{
"recipients":
  [
    "studentbob@gmail.com",
    "studentagnes@gmail.com",
    "studentmiche@gmail.com"
  ]
}
{
"teacher":  "teacherken@gmail.com",
"notification": "Hey everybody"
}
{
"recipients":
  [
    "studentbob@gmail.com"
  ]
}
```
  */
  it('Valid teacher and students should be notified successfully tests', async () => {
    // arrange
    let student1 = new Student("First Name", "LastName", "student1@gmail.com");
    let student2 = new Student("First Name", "LastName", "student2@gmail.com");
    let student3 = new Student("First Name", "LastName", "student3@gmail.com");
    student3.isSuspended = true;
    let student4 = new Student("First Name", "LastName", "student4@gmail.com");
    var studentRepository = new Mock<IStudentRepository>()
      .setup(i => i.GetByEmail("student1@gmail.com"))
      .returnsAsync(student1)
      .setup(i => i.GetByEmail("student2@gmail.com"))
      .returnsAsync(student2)
      .setup(i => i.GetByEmail("student3@gmail.com"))
      .returnsAsync(student3)
      .setup(i => i.GetByEmail("student4@gmail.com"))
      .returnsAsync(student4);
    let teacher = new Teacher("First Name", "LastName", "teacher@gmail.com");
    teacher.students = [student1, student3];
    var teacherRepository = new Mock<ITeacherRepository>()
      .setup(i => i.GetByEmail("teacher@gmail.com"))
      .returnsAsync(teacher);
    // 2. The use case and star of this test
    var useCase = new StudentNotificationsUseCase(logger, teacherRepository.object(), studentRepository.object());
    // 3. The output port is the mechanism to pass response data from the use case to a Presenter 
    // for final preparation to deliver back to the UI/web page/api response etc.
    var presenter = new StudentNotificationsPresenter();
    // act
    // 4. We need a request model to carry data into the use case from the upper layer (UI, Controller etc.)
    var response: Boolean = await useCase.Handle(new StudentNotificationsRequest("Hello students! ", "teacher@gmail.com", ["student2@gmail.com", "student4@gmail.com"]), presenter);

    // assert
    expect(response).to.be.true;
    teacherRepository.verify(i => i.GetByEmail(It.IsAny<string>()), Times.Once());
    studentRepository.verify(i => i.GetByEmail(It.IsAny<string>()), Times.Exactly(2));
    expect(presenter.Code).to.be.eq(200);
    expect(presenter.Errors).to.be.an("array").that.is.empty;
    expect(presenter.Message).to.be.eq('"Hello students! " sent successfully to 3 students from teacher teacher@gmail.com!');
    expect(presenter.Recipients).to.be.an("array").to.have.length(3);
    expect(presenter.Recipients).to.be.an("array").to.not.include("student3@gmail.com");
    expect(presenter.Recipients).to.be.an("array").to.include.members(["student1@gmail.com", "student2@gmail.com", "student4@gmail.com"]);
  });
});