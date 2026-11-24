import 'reflect-metadata'
import config from 'config'
import { expect } from 'vitest'
import port from "../../src/webapi/server.js"
import { post as postTo, errorMessages, resetDatabase } from "../helpers/integration.js"

/*
 * End-to-end scenario against the real API and database: register two teachers and two students, link them,
 * then check common students, notifications and suspension. The tests in this file build on each other and
 * run in order. WARNING: the beforeAll hook empties the student and teacher tables of the test database.
 */
expect(config.util.getEnv('NODE_ENV')).toEqual('test');

const teacher1 = { firstName: "Teacher", lastName: "One", email: "teacher1@example.com" };
const teacher2 = { firstName: "Teacher", lastName: "Two", email: "teacher2@example.com" };
const student1 = { firstName: "Student", lastName: "One", email: "student1@example.com" };
const student2 = { firstName: "Student", lastName: "Two", email: "student2@example.com" };
const unregistered = "student3@example.com";

const post = (path: string, body: unknown) => postTo(port, path, body);
const commonStudents = async (teachers: string[]) => {
    const { status, data } = await post('commonstudents', { teachers });
    expect(status).toBe(200);
    return (data["Common Students"] as { email: string, isSuspended: boolean }[]);
};
const recipients = async (teacher: string, notification: string) => {
    const { status, data } = await post('notifystudents', { teacher, notification });
    expect(status).toBe(200);
    return data.recipients as string[];
};

describe('Two teachers, two students tests', () => {
    beforeAll(resetDatabase);

    describe('/POST /api/register', () => {
        it('fails without students or teachers', async () => {
            const { status, data } = await post('register', {});
            expect(status).toBe(400);
            expect(data.message).not.toBe('');
        });
        it('fails for a teacher with an invalid email', async () => {
            const { status, data } = await post('register', { teachers: [{ ...teacher1, email: "teacher1" }] });
            expect(status).toBe(400);
            expect(errorMessages(data).join()).toContain("teacher1");
        });
        it('fails for a student with an invalid email', async () => {
            const { status, data } = await post('register', { students: [{ ...student1, email: "student1" }] });
            expect(status).toBe(400);
            expect(errorMessages(data).join()).toContain("student1");
        });
        it('registers both teachers and both students', async () => {
            const { status, data } = await post('register', { teachers: [teacher1, teacher2], students: [student1, student2] });
            expect(status).toBe(201);
            expect(data.errors).toEqual([]);
        });
        it('fails to register an existing teacher again', async () => {
            const { status, data } = await post('register', { teachers: [teacher1] });
            expect(status).toBe(400);
            expect(errorMessages(data).join()).toContain(teacher1.email);
        });
    });

    describe('/POST /api/addstudents', () => {
        it('fails without a teacher', async () => {
            const { status } = await post('addstudents', { students: [student1.email] });
            expect(status).toBe(400);
        });
        it('fails for a teacher with an invalid email', async () => {
            const { status } = await post('addstudents', { teacher: { email: "teacher1" }, students: [student1.email] });
            expect(status).toBe(400);
        });
        it('fails without any valid student', async () => {
            const { status } = await post('addstudents', { teacher: { email: teacher1.email }, students: ["student1"] });
            expect(status).toBe(400);
        });
        it('fails for an unregistered teacher', async () => {
            const { status, data } = await post('addstudents', { teacher: { email: "teacher3@example.com" }, students: [student1.email] });
            expect(status).toBe(400);
            expect(errorMessages(data).join()).toContain("teacher3@example.com");
        });
        it('fails for an unregistered student', async () => {
            const { status, data } = await post('addstudents', { teacher: { email: teacher1.email }, students: [unregistered] });
            expect(status).toBe(400);
            expect(errorMessages(data).join()).toContain(unregistered);
        });
        it('adds student1 to teacher1', async () => {
            const { status, data } = await post('addstudents', { teacher: { email: teacher1.email }, students: [student1.email] });
            expect(status).toBe(200);
            expect(data.errors).toEqual([]);
        });
        it('adds student1 and student2 to teacher2', async () => {
            const { status, data } = await post('addstudents', { teacher: { email: teacher2.email }, students: [student1.email, student2.email] });
            expect(status).toBe(200);
            expect(data.errors).toEqual([]);
        });
        it('fails to add student1 to teacher1 twice', async () => {
            const { status, data } = await post('addstudents', { teacher: { email: teacher1.email }, students: [student1.email] });
            expect(status).toBe(400);
            expect(errorMessages(data).join()).toContain(student1.email);
        });
    });

    describe('/POST /api/commonstudents', () => {
        it('fails without teachers', async () => {
            expect((await post('commonstudents', {})).status).toBe(400);
            expect((await post('commonstudents', { teachers: [] })).status).toBe(400);
        });
        it('fails for a teacher with an invalid email', async () => {
            const { status } = await post('commonstudents', { teachers: ["teacher1"] });
            expect(status).toBe(400);
        });
        it('fails for an unregistered teacher', async () => {
            const { status } = await post('commonstudents', { teachers: ["teacher3@example.com"] });
            expect(status).toBe(400);
        });
        it('finds the students of teacher1', async () => {
            expect((await commonStudents([teacher1.email])).map(s => s.email)).toEqual([student1.email]);
        });
        it('finds the students of teacher2', async () => {
            expect((await commonStudents([teacher2.email])).map(s => s.email).sort()).toEqual([student1.email, student2.email]);
        });
        it('finds the students common to teacher1 and teacher2', async () => {
            expect((await commonStudents([teacher1.email, teacher2.email])).map(s => s.email)).toEqual([student1.email]);
        });
    });

    describe('/POST /api/notifystudents', () => {
        it('fails for a teacher with an invalid email', async () => {
            const { status } = await post('notifystudents', { teacher: "teacher1", notification: "Hello students!" });
            expect(status).toBe(400);
        });
        it('fails without a notification', async () => {
            const { status } = await post('notifystudents', { teacher: teacher1.email });
            expect(status).toBe(400);
        });
        it('fails for an unregistered teacher', async () => {
            const { status } = await post('notifystudents', { teacher: "teacher3@example.com", notification: "Hello students!" });
            expect(status).toBe(400);
        });
        it("notifies teacher1's students", async () => {
            expect(await recipients(teacher1.email, "Hello students!")).toEqual([student1.email]);
        });
        it('also notifies a mentioned student of another teacher', async () => {
            expect((await recipients(teacher1.email, `Hello students! @${student2.email}`)).sort()).toEqual([student1.email, student2.email]);
        });
        it('ignores a mentioned student who is not registered', async () => {
            expect(await recipients(teacher1.email, `Hello students! @${unregistered}`)).toEqual([student1.email]);
        });
        it('lists a mentioned student who is also a student of the teacher only once', async () => {
            expect(await recipients(teacher1.email, `Hello students! @${student1.email}`)).toEqual([student1.email]);
        });
    });

    describe('/POST /api/suspendstudent', () => {
        it('fails without a student', async () => {
            expect((await post('suspendstudent', {})).status).toBe(400);
        });
        it('fails for an invalid email', async () => {
            expect((await post('suspendstudent', { student: "student1" })).status).toBe(400);
        });
        it('fails for a student that is not a string', async () => {
            expect((await post('suspendstudent', { student: 123 })).status).toBe(400);
        });
        it('fails for an unregistered student', async () => {
            const { status, data } = await post('suspendstudent', { student: unregistered });
            expect(status).toBe(400);
            expect(errorMessages(data).join()).toContain(unregistered);
        });
        it('suspends student1', async () => {
            const { status, data } = await post('suspendstudent', { student: student1.email });
            expect(status).toBe(200);
            expect(data.errors).toEqual([]);
        });
    });

    describe('After suspending student1', () => {
        it('still lists student1 as common to teacher1 and teacher2, marked suspended', async () => {
            expect(await commonStudents([teacher1.email, teacher2.email])).toEqual([expect.objectContaining({ email: student1.email, isSuspended: true })]);
        });
        it("no longer notifies student1 as one of teacher1's students", async () => {
            expect(await recipients(teacher1.email, "Hello students!")).toEqual([]);
        });
        it('notifies only student2 when teacher1 mentions student2', async () => {
            expect(await recipients(teacher1.email, `Hello students! @${student2.email}`)).toEqual([student2.email]);
        });
        it("notifies only student2 of teacher2's students", async () => {
            expect(await recipients(teacher2.email, "Hello students!")).toEqual([student2.email]);
        });
        it('does not notify student1 even when mentioned', async () => {
            expect(await recipients(teacher2.email, `Hello students! @${student1.email}`)).toEqual([student2.email]);
        });
    });
});
