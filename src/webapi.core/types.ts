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
/** Configuration values the web layer binds into the container (webapi.core doesn't read config itself). */
const ConfigTypes = {
    GeminiApiKey: Symbol.for("GeminiApiKey")
}
export { UseCaseTypes, RepositoryTypes, LoggerTypes, ConfigTypes };