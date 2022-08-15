const UseCaseTypes = {
    IRegisterStudentUseCase: Symbol.for("IRegisterStudentUseCase"),
    IRegisterTeacherUseCase: Symbol.for("IRegisterTeacherUseCase"),
    IAddStudentsToTeacherUseCase: Symbol.for("IAddStudentsToTeacherUseCase")
};
const RepositoryTypes = {
    IStudentRepository: Symbol.for("IStudentRepository"),
    ITeacherRepository: Symbol.for("ITeacherRepository"),
}
const LoggerTypes = {
    ILogger: Symbol.for("ILogger")
}
export { UseCaseTypes, RepositoryTypes, LoggerTypes };