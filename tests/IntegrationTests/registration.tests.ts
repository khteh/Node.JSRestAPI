import 'reflect-metadata'
import config from 'config'
import { expect } from 'vitest'
import port from "../../src/webapi/server.js"
import { post as postTo, errorMessages, resetDatabase } from "../helpers/integration.js"

/*
 * POST /api/register against the real API and database.
 * WARNING: the beforeAll hook empties the student and teacher tables of the test database.
 */
expect(config.util.getEnv('NODE_ENV')).toEqual('test');
const post = (path: string, body: unknown) => postTo(port, path, body);

const students = [
    { firstName: "One", lastName: "Student", email: "student1@example.com" },
    { firstName: "Two", lastName: "Student", email: "student2@example.com" },
];
const teachers = [
    { firstName: "One", lastName: "Teacher", email: "teacher1@example.com" },
    { firstName: "Two", lastName: "Teacher", email: "teacher2@example.com" },
];

describe('Registration tests', () => {
    beforeAll(resetDatabase);

    describe('Valid data should succeed tests', () => {
        it('Valid students should succeed test', async () => {
            const { status, data } = await post('register', { students });
            expect(status).toBe(201);
            expect(data.message).toEqual("2 students registered successfully");
            expect(data.errors).toEqual([]);
        });
        it('Valid teachers should succeed test', async () => {
            const { status, data } = await post('register', { teachers });
            expect(status).toBe(201);
            expect(data.message).toEqual("2 teachers registered successfully");
            expect(data.errors).toEqual([]);
        });
    });

    describe('InValid data should fail tests', () => {
        it('Existing students should fail test', async () => {
            const { status, data } = await post('register', { students });
            expect(status).toBe(400);
            expect(errorMessages(data)).toEqual(students.map(s => `Skip existing student ${s.email}`));
        });
        it('Existing teachers should fail test', async () => {
            const { status, data } = await post('register', { teachers });
            expect(status).toBe(400);
            expect(errorMessages(data)).toEqual(teachers.map(t => `Skip existing teacher ${t.email}`));
        });
        it("InValid student's email should fail test", async () => {
            const { status, data } = await post('register', { students: [{ firstName: "Three", lastName: "Student", email: "student3" }] });
            expect(status).toBe(400);
            expect(errorMessages(data)).toEqual(["Skip student with invalid email: student3"]);
        });
        it("InValid teacher's email should fail test", async () => {
            const { status, data } = await post('register', { teachers: [{ firstName: "Three", lastName: "Teacher", email: "teacher3" }] });
            expect(status).toBe(400);
            expect(errorMessages(data)).toEqual(["Skip teacher with invalid email: teacher3"]);
        });
        it('A valid and an invalid student should register the valid one and fail', async () => {
            const { status, data } = await post('register', { students: [{ firstName: "Four", lastName: "Student", email: "student4@example.com" }, { firstName: "Five", lastName: "Student", email: "student5" }] });
            expect(status).toBe(400);
            expect(data.message).toEqual("1 students registered successfully");
            expect(errorMessages(data)).toEqual(["Skip student with invalid email: student5"]);
        });
        it('Empty data should fail test', async () => {
            const { status, data } = await post('register', {});
            expect(status).toBe(400);
            expect(data.message).not.toBe('');
        });
    });
});
