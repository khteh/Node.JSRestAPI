/*
 * gRPC School service. The message and service types are generated from grpc/proto/*.proto by ts-proto
 * (`npm run proto`): messages are plain objects, e.g. request.students rather than request.getStudentsList().
 */
import { Server, status, type ServerUnaryCall, type sendUnaryData, type ServiceError } from '@grpc/grpc-js';
import emailvalidator from 'email-validator'
import { SchoolService, type SchoolServer, type RegisterRequest, type AddStudentsToTeacherRequest as GrpcAddStudentsToTeacherRequest, type CommonStudentsRequest as GrpcCommonStudentsRequest, type CommonStudentsResponse } from "../grpc/generated/school.js";
import type { Response, Error as GrpcError } from "../grpc/generated/response.js";
import type { Student as GrpcStudent } from "../grpc/generated/student.js";
import { type ILogger, LogLevels, LoggerTypes, Student, Teacher, RegisterStudentRequest, RegisterTeacherRequest, AddStudentsToTeacherRequest, CommonStudentsRequest, UseCaseTypes, type IRegisterStudentUseCase, type IRegisterTeacherUseCase, type IAddStudentsToTeacherUseCase, type ICommonStudentsUseCase, type UseCaseResponseMessage, type StudentDTO, Error } from "webapi.core"
import { PresenterBase } from "../Presenters/PresenterBase.js"
import { RegisterUserPresenter } from "../Presenters/RegisterUserPresenter.js"
import { CommonStudentsPresenter } from "../Presenters/CommonStudentsPresenter.js";

/** The use cases the School service delegates to. */
export interface SchoolUseCases {
    registerStudent: IRegisterStudentUseCase;
    registerTeacher: IRegisterTeacherUseCase;
    addStudentsToTeacher: IAddStudentsToTeacherUseCase;
    commonStudents: ICommonStudentsUseCase;
}

const toGrpcErrors = (errors: Error[]): GrpcError[] => errors.map(e => ({ code: e.Code ?? "", description: e.Description ?? "" }));
const failure = (description: string): Response => ({ success: false, errors: [{ code: "", description }] });
const toGrpcStudent = (s: StudentDTO): GrpcStudent => ({ id: String(s.id ?? ""), firstName: s.firstName ?? "", lastName: s.lastName ?? "", email: s.email ?? "", isSuspended: !!s.isSuspended, teachers: [] });

/**
 * Runs an async handler and reports its result through the gRPC callback. An unexpected exception becomes an
 * INTERNAL status with a generic message; the details are only logged.
 */
function unary<Req, Res> (logger: ILogger, name: string, handler: (request: Req) => Promise<Res>) {
    return (call: ServerUnaryCall<Req, Res>, callback: sendUnaryData<Res>) => {
        handler(call.request).then(
            response => callback(null, response),
            (e: unknown) => {
                logger.Log(LogLevels.error, `gRPC ${name}: ${e instanceof globalThis.Error ? e.message : e}`);
                callback({ code: status.INTERNAL, details: `${name} failed!` } as Partial<ServiceError> as ServiceError, null);
            });
    };
}

/** The School service handlers. A new presenter is created per call. */
export function createSchoolServer (logger: ILogger, useCases: SchoolUseCases): SchoolServer {
    return {
        /** Registers students and/or teachers. success is false if nothing is given, or any of them can't be registered. */
        register: unary(logger, "Register", async (request: RegisterRequest): Promise<Response> => {
            logger.Log(LogLevels.debug, `gRPC Register: ${request.students.length} students, ${request.teachers.length} teachers`);
            if (!request.students.length && !request.teachers.length)
                return failure("Register without students or teachers to register!");
            const errors: Error[] = [];
            let success = true;
            // Invalid emails are passed on, so the use cases report them as errors instead of dropping them.
            if (request.students.length) {
                const presenter = new RegisterUserPresenter();
                await useCases.registerStudent.Handle(new RegisterStudentRequest(request.students.map(i => new Student(i.firstName, i.lastName, i.email))), presenter);
                errors.push(...presenter.Errors);
                success &&= presenter.Code === 201;
            }
            if (request.teachers.length) {
                const presenter = new RegisterUserPresenter();
                await useCases.registerTeacher.Handle(new RegisterTeacherRequest(request.teachers.map(i => new Teacher(i.firstName, i.lastName, i.email))), presenter);
                errors.push(...presenter.Errors);
                success &&= presenter.Code === 201;
            }
            return { success, errors: toGrpcErrors(errors) };
        }),
        /** Adds students (by email) to a teacher. success is false for an invalid teacher, no valid students, or any student that can't be added. */
        addStudentsToTeacher: unary(logger, "AddStudentsToTeacher", async (request: GrpcAddStudentsToTeacherRequest): Promise<Response> => {
            const teacherEmail = request.teacher?.email ?? "";
            logger.Log(LogLevels.debug, `gRPC AddStudentsToTeacher: teacher ${teacherEmail}, ${request.students.length} students`);
            if (!emailvalidator.validate(teacherEmail))
                return failure("Invalid teacher email address!");
            const students = request.students.filter(i => emailvalidator.validate(i)).map(i => new Student("", "", i));
            if (!students.length)
                return failure("Without a list of valid students specified!");
            const presenter = new PresenterBase<UseCaseResponseMessage>();
            await useCases.addStudentsToTeacher.Handle(new AddStudentsToTeacherRequest(new Teacher("", "", teacherEmail), students), presenter);
            return { success: presenter.Code === 200, errors: toGrpcErrors(presenter.Errors) };
        }),
        /** The students registered to all of the given teachers. */
        commonStudents: unary(logger, "CommonStudents", async (request: GrpcCommonStudentsRequest): Promise<CommonStudentsResponse> => {
            logger.Log(LogLevels.debug, `gRPC CommonStudents: ${request.teachers.join(", ")}`);
            if (!request.teachers.length)
                return { students: [], response: failure("CommonStudents without teachers specified!") };
            const presenter = new CommonStudentsPresenter();
            await useCases.commonStudents.Handle(new CommonStudentsRequest(request.teachers), presenter);
            return { students: presenter.Students.map(toGrpcStudent), response: { success: presenter.Code === 200, errors: toGrpcErrors(presenter.Errors) } };
        }),
    };
}

/** A gRPC server with the School service, using the use cases from the application's DI container. */
export async function getServer (): Promise<Server> {
    // Imported here rather than at the top, so the handlers above can be unit tested without the app's container.
    const { di } = await import("../routes/api.js");
    const server = new Server();
    server.addService(SchoolService, createSchoolServer(di.get<ILogger>(LoggerTypes.ILogger), {
        registerStudent: di.get<IRegisterStudentUseCase>(UseCaseTypes.IRegisterStudentUseCase),
        registerTeacher: di.get<IRegisterTeacherUseCase>(UseCaseTypes.IRegisterTeacherUseCase),
        addStudentsToTeacher: di.get<IAddStudentsToTeacherUseCase>(UseCaseTypes.IAddStudentsToTeacherUseCase),
        commonStudents: di.get<ICommonStudentsUseCase>(UseCaseTypes.ICommonStudentsUseCase),
    }));
    return server;
}
