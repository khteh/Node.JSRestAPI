import 'reflect-metadata'
import config from 'config'
import { expect } from 'vitest'
import { status, type ServerUnaryCall, type ServiceError } from '@grpc/grpc-js';
import { type ILogger, type IOutputPort, Student, Teacher, StudentDTO, UseCaseResponseMessage, CommonStudentsResponse, Error } from "webapi.core";
import { createSchoolServer, type SchoolUseCases } from "../../src/webapi/Services/SchoolService.js";

/*
 * The gRPC School service handlers, called directly with fake use cases: no server, no database.
 */
expect(config.util.getEnv('NODE_ENV')).toEqual('test');

const logger: ILogger = { Log: () => { } } as unknown as ILogger;

/** A fake use case that records its requests and answers with the given response, or throws. */
function fakeUseCase<Res> (response: Res | (() => never)) {
    const requests: any[] = [];
    return {
        requests,
        useCase: {
            async Handle (request: any, outputPort: IOutputPort<Res>): Promise<Boolean> {
                requests.push(request);
                if (typeof response === 'function') (response as () => never)();
                await outputPort.Handle(response as Res);
                return true;
            }
        } as any
    };
}
const ok = (message = "ok") => new UseCaseResponseMessage("", true, message, []);
const failed = (code: string, description: string) => new UseCaseResponseMessage("", false, "failed", [new Error(code, description)]);

/** Calls a unary handler the way @grpc/grpc-js does, and returns what it passes to the callback. */
function invoke<Req, Res> (handler: Function, request: Req): Promise<{ error: ServiceError | null, response: Res | null }> {
    return new Promise(resolve => handler({ request } as ServerUnaryCall<Req, Res>, (error: ServiceError | null, response: Res | null) => resolve({ error, response })));
}

function setup (responses: Partial<Record<keyof SchoolUseCases, unknown>> = {}) {
    const fakes = {
        registerStudent: fakeUseCase(responses.registerStudent ?? ok()),
        registerTeacher: fakeUseCase(responses.registerTeacher ?? ok()),
        addStudentsToTeacher: fakeUseCase(responses.addStudentsToTeacher ?? ok()),
        commonStudents: fakeUseCase(responses.commonStudents ?? new CommonStudentsResponse("", true, [], "ok", [])),
    };
    const server = createSchoolServer(logger, {
        registerStudent: fakes.registerStudent.useCase,
        registerTeacher: fakes.registerTeacher.useCase,
        addStudentsToTeacher: fakes.addStudentsToTeacher.useCase,
        commonStudents: fakes.commonStudents.useCase,
    });
    return { server, fakes };
}
const student = { id: "", firstName: "Student", lastName: "One", email: "student1@example.com", isSuspended: false, teachers: [] };
const teacher = { id: "", firstName: "Teacher", lastName: "One", email: "teacher1@example.com", students: [] };

describe('gRPC School service tests', () => {
    describe('Register', () => {
        it('fails without students or teachers, without calling the use cases', async () => {
            const { server, fakes } = setup();
            const { error, response } = await invoke<any, any>(server.register, { students: [], teachers: [] });
            expect(error).toBeNull();
            expect(response.success).toBe(false);
            expect(response.errors[0].description).not.toBe('');
            expect(fakes.registerStudent.requests).toHaveLength(0);
            expect(fakes.registerTeacher.requests).toHaveLength(0);
        });
        it('registers students and teachers', async () => {
            const { server, fakes } = setup();
            const { response } = await invoke<any, any>(server.register, { students: [student], teachers: [teacher] });
            expect(response).toEqual({ success: true, errors: [] });
            const students: Student[] = fakes.registerStudent.requests[0].Entities;
            const teachers: Teacher[] = fakes.registerTeacher.requests[0].Entities;
            expect(students.map(s => [s.firstName, s.lastName, s.email])).toEqual([["Student", "One", "student1@example.com"]]);
            expect(teachers.map(t => [t.firstName, t.lastName, t.email])).toEqual([["Teacher", "One", "teacher1@example.com"]]);
        });
        it('fails and reports the errors when one of the use cases fails', async () => {
            const { server } = setup({ registerStudent: failed("", "Skip existing student student1@example.com") });
            const { response } = await invoke<any, any>(server.register, { students: [student], teachers: [teacher] });
            expect(response).toEqual({ success: false, errors: [{ code: "", description: "Skip existing student student1@example.com" }] });
        });
        it('passes invalid emails on to the use case instead of dropping them', async () => {
            const { server, fakes } = setup();
            await invoke<any, any>(server.register, { students: [{ ...student, email: "student1" }], teachers: [] });
            expect(fakes.registerStudent.requests[0].Entities.map((s: Student) => s.email)).toEqual(["student1"]);
        });
    });

    describe('AddStudentsToTeacher', () => {
        it('fails for a missing or invalid teacher', async () => {
            const { server, fakes } = setup();
            for (const t of [undefined, { ...teacher, email: "teacher1" }]) {
                const { response } = await invoke<any, any>(server.addStudentsToTeacher, { teacher: t, students: [student.email] });
                expect(response.success).toBe(false);
            }
            expect(fakes.addStudentsToTeacher.requests).toHaveLength(0);
        });
        it('fails without any valid student', async () => {
            const { server, fakes } = setup();
            const { response } = await invoke<any, any>(server.addStudentsToTeacher, { teacher, students: ["student1", ""] });
            expect(response.success).toBe(false);
            expect(fakes.addStudentsToTeacher.requests).toHaveLength(0);
        });
        it('adds only the valid students to the teacher', async () => {
            const { server, fakes } = setup();
            const { response } = await invoke<any, any>(server.addStudentsToTeacher, { teacher, students: [student.email, "student2"] });
            expect(response).toEqual({ success: true, errors: [] });
            const request = fakes.addStudentsToTeacher.requests[0];
            expect(request.Teacher.email).toBe(teacher.email);
            expect(request.Students.map((s: Student) => s.email)).toEqual([student.email]);
        });
        it('reports the use case errors', async () => {
            const { server } = setup({ addStudentsToTeacher: failed("", `Invalid teacher ${teacher.email}`) });
            const { response } = await invoke<any, any>(server.addStudentsToTeacher, { teacher, students: [student.email] });
            expect(response).toEqual({ success: false, errors: [{ code: "", description: `Invalid teacher ${teacher.email}` }] });
        });
    });

    describe('CommonStudents', () => {
        it('fails without teachers, without calling the use case', async () => {
            const { server, fakes } = setup();
            const { response } = await invoke<any, any>(server.commonStudents, { teachers: [] });
            expect(response.students).toEqual([]);
            expect(response.response.success).toBe(false);
            expect(fakes.commonStudents.requests).toHaveLength(0);
        });
        it('returns the common students', async () => {
            const { server, fakes } = setup({ commonStudents: new CommonStudentsResponse("", true, [new StudentDTO(7, "Student", "One", "student1@example.com", true)], "1 common students found!", []) });
            const { response } = await invoke<any, any>(server.commonStudents, { teachers: [teacher.email] });
            expect(fakes.commonStudents.requests[0].Teachers).toEqual([teacher.email]);
            expect(response).toEqual({
                students: [{ id: "7", firstName: "Student", lastName: "One", email: "student1@example.com", isSuspended: true, teachers: [] }],
                response: { success: true, errors: [] }
            });
        });
    });

    it('turns an unexpected exception into an INTERNAL status without the details', async () => {
        const { server } = setup({ registerStudent: () => { throw new globalThis.Error("database password is wrong") } });
        const { error, response } = await invoke<any, any>(server.register, { students: [student], teachers: [] });
        expect(response).toBeNull();
        expect(error?.code).toBe(status.INTERNAL);
        expect(error?.details).toBe("Register failed!");
    });
});
