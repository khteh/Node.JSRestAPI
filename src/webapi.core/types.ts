const UseCaseTypes = {
    IGenerateContentUseCase: Symbol.for("IGenerateContentUseCase"),
    IRegisterStudentUseCase: Symbol.for("IRegisterStudentUseCase"),
    IRegisterTeacherUseCase: Symbol.for("IRegisterTeacherUseCase"),
    IAddStudentsToTeacherUseCase: Symbol.for("IAddStudentsToTeacherUseCase"),
    ICommonStudentsUseCase: Symbol.for("ICommonStudentsUseCase"),
    ISuspendStudentUseCase: Symbol.for("ISuspendStudentUseCase"),
    IStudentNotificationsUseCase: Symbol.for("IStudentNotificationsUseCase")
};
const RepositoryTypes = {
    IStudentRepository: Symbol.for("IStudentRepository"),
    ITeacherRepository: Symbol.for("ITeacherRepository"),
}
const LoggerTypes = {
    ILogger: Symbol.for("ILogger")
}
export { UseCaseTypes, RepositoryTypes, LoggerTypes };