import { Container } from "inversify";
import { IRegisterStudentUseCase, IRegisterTeacherUseCase, IAddStudentsToTeacherUseCase, ICommonStudentsUseCase, ISuspendStudentUseCase, IStudentNotificationsUseCase, IGenerateContentUseCase, Student, UseCaseTypes } from "webapi.core"
import { IStudentRepository, ITeacherRepository, RepositoryTypes, LoggerTypes } from "webapi.core";
import { RegisterStudentUseCase, SuspendStudentUseCase, RegisterTeacherUseCase, AddStudentsToTeacherUseCase, CommonStudentsUseCase, GenerateContentUseCase, StudentNotificationsUseCase } from "webapi.core";
import { StudentRepository, TeacherRepository, LoggerImpl, DatabaseTypes, Database } from "infrastructure"
import { ILogger } from "webapi.core";

const di = new Container();
di.bind<ILogger>(LoggerTypes.ILogger).to(LoggerImpl);
di.bind<IGenerateContentUseCase>(UseCaseTypes.IGenerateContentUseCase).to(GenerateContentUseCase);
di.bind<IRegisterStudentUseCase>(UseCaseTypes.IRegisterStudentUseCase).to(RegisterStudentUseCase);
di.bind<ISuspendStudentUseCase>(UseCaseTypes.ISuspendStudentUseCase).to(SuspendStudentUseCase);
di.bind<IRegisterTeacherUseCase>(UseCaseTypes.IRegisterTeacherUseCase).to(RegisterTeacherUseCase);
di.bind<IAddStudentsToTeacherUseCase>(UseCaseTypes.IAddStudentsToTeacherUseCase).to(AddStudentsToTeacherUseCase);
di.bind<ICommonStudentsUseCase>(UseCaseTypes.ICommonStudentsUseCase).to(CommonStudentsUseCase);
di.bind<IStudentNotificationsUseCase>(UseCaseTypes.IStudentNotificationsUseCase).to(StudentNotificationsUseCase);
di.bind<IStudentRepository>(RepositoryTypes.IStudentRepository).to(StudentRepository);
di.bind<ITeacherRepository>(RepositoryTypes.ITeacherRepository).to(TeacherRepository);
di.bind(DatabaseTypes.DatabaseService).to(Database);

export default di
