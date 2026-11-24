import 'reflect-metadata'
import fs from 'node:fs'
import config from 'config'
import { expect } from 'vitest'
import { credentials, type ServiceError } from '@grpc/grpc-js'
import { grpcReady } from "../../src/webapi/server.js"
import { SchoolClient, RegisterRequest, AddStudentsToTeacherRequest, CommonStudentsRequest, type CommonStudentsResponse } from "../../src/webapi/grpc/generated/school.js"
import type { Response } from "../../src/webapi/grpc/generated/response.js"
import { resetDatabase } from "../helpers/integration.js"

/*
 * The gRPC School service against the real server and database, over TLS with a client certificate.
 * WARNING: the beforeAll hook empties the student and teacher tables of the test database.
 */
expect(config.util.getEnv('NODE_ENV')).toEqual('test');

const teacher1 = { firstName: "Teacher", lastName: "One", email: "teacher1@example.com" };
const teacher2 = { firstName: "Teacher", lastName: "Two", email: "teacher2@example.com" };
const student1 = { firstName: "Student", lastName: "One", email: "student1@example.com" };
const student2 = { firstName: "Student", lastName: "Two", email: "student2@example.com" };

// The server's self-signed certificate is the CA, and (for mutual TLS) also the client certificate.
const ca = fs.readFileSync('server.crt'), key = fs.readFileSync('server.key');
let client: SchoolClient;

/** Promisified unary calls. Requests go through fromPartial(), which fills in the fields not given. */
const call = <Res> (method: (request: any, callback: (error: ServiceError | null, response: Res) => void) => unknown, request: unknown) =>
    new Promise<Res>((resolve, reject) => method.call(client, request, (error: ServiceError | null, response: Res) => error ? reject(error) : resolve(response)));
const register = (request: Parameters<typeof RegisterRequest.fromPartial>[0]) => call<Response>(client.register, RegisterRequest.fromPartial(request));
const addStudents = (request: Parameters<typeof AddStudentsToTeacherRequest.fromPartial>[0]) => call<Response>(client.addStudentsToTeacher, AddStudentsToTeacherRequest.fromPartial(request));
const commonStudents = (teachers: string[]) => call<CommonStudentsResponse>(client.commonStudents, CommonStudentsRequest.fromPartial({ teachers }));
const descriptions = (response: Response | undefined) => (response?.errors ?? []).map(e => e.description);

describe('gRPC School service tests', () => {
    beforeAll(async () => {
        await resetDatabase();
        const port = await grpcReady;
        client = new SchoolClient(`localhost:${port}`, credentials.createSsl(ca, key, ca));
    });
    afterAll(() => client?.close());

    it('rejects a client without a certificate', async () => {
        const anonymous = new SchoolClient(`localhost:${await grpcReady}`, credentials.createSsl(ca));
        try {
            await expect(new Promise((resolve, reject) => anonymous.register(RegisterRequest.fromPartial({}), { deadline: Date.now() + 5000 }, (e, r) => e ? reject(e) : resolve(r)))).rejects.toMatchObject({ code: expect.any(Number) });
        } finally {
            anonymous.close();
        }
    });

    describe('Register', () => {
        it('fails without students or teachers', async () => {
            const response = await register({});
            expect(response.success).toBe(false);
            expect(descriptions(response)[0]).not.toBe('');
        });
        it('registers both teachers and both students', async () => {
            expect(await register({ teachers: [teacher1, teacher2], students: [student1, student2] })).toEqual({ success: true, errors: [] });
        });
        it('fails to register an existing student again', async () => {
            const response = await register({ students: [student1] });
            expect(response.success).toBe(false);
            expect(descriptions(response)).toEqual([`Skip existing student ${student1.email}`]);
        });
        it('fails for an invalid email', async () => {
            const response = await register({ teachers: [{ ...teacher1, email: "teacher3" }] });
            expect(response.success).toBe(false);
            expect(descriptions(response)).toEqual(["Skip teacher with invalid email: teacher3"]);
        });
    });

    describe('AddStudentsToTeacher', () => {
        it('fails for an invalid teacher email', async () => {
            expect((await addStudents({ teacher: { email: "teacher1" }, students: [student1.email] })).success).toBe(false);
        });
        it('fails for an unregistered teacher', async () => {
            const response = await addStudents({ teacher: { email: "teacher3@example.com" }, students: [student1.email] });
            expect(response.success).toBe(false);
            expect(descriptions(response)).toEqual(["Invalid teacher teacher3@example.com"]);
        });
        it('adds student1 to teacher1, and both students to teacher2', async () => {
            expect(await addStudents({ teacher: { email: teacher1.email }, students: [student1.email] })).toEqual({ success: true, errors: [] });
            expect(await addStudents({ teacher: { email: teacher2.email }, students: [student1.email, student2.email] })).toEqual({ success: true, errors: [] });
        });
        it('fails to add student1 to teacher1 twice', async () => {
            const response = await addStudents({ teacher: { email: teacher1.email }, students: [student1.email] });
            expect(response.success).toBe(false);
            expect(descriptions(response).join()).toContain(student1.email);
        });
    });

    describe('CommonStudents', () => {
        it('fails without teachers', async () => {
            const response = await commonStudents([]);
            expect(response.students).toEqual([]);
            expect(response.response?.success).toBe(false);
        });
        it('finds the students of teacher2', async () => {
            const response = await commonStudents([teacher2.email]);
            expect(response.response).toEqual({ success: true, errors: [] });
            expect(response.students.map(s => s.email).sort()).toEqual([student1.email, student2.email]);
        });
        it('finds the students common to teacher1 and teacher2', async () => {
            const response = await commonStudents([teacher1.email, teacher2.email]);
            expect(response.students).toEqual([expect.objectContaining({ email: student1.email, firstName: "Student", lastName: "One", isSuspended: false })]);
            expect(response.students[0].id).not.toBe('');
        });
    });
});
