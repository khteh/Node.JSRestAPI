import 'reflect-metadata'
import config from 'config'
import { expect } from 'vitest'
import port from "../../src/webapi/server.js"
import { post as postTo, errorMessages, resetDatabase } from "../helpers/integration.js"

/*
 * POST /api/addstudents against the real API and database.
 * WARNING: the beforeAll hook empties the student and teacher tables of the test database.
 */
expect(config.util.getEnv('NODE_ENV')).toEqual('test');
const post = (path: string, body: unknown) => postTo(port, path, body);

const teacher = { firstName: "First Name", lastName: "LastName", email: "teacher@example.com" };
const students = [
    { firstName: "First Name", lastName: "LastName", email: "student1@example.com" },
    { firstName: "First Name", lastName: "LastName", email: "student2@example.com" },
];

describe('Add students to teacher tests', () => {
    beforeAll(async () => {
        await resetDatabase();
        expect((await post('register', { teachers: [teacher], students })).status).toBe(201);
    });

    it('Valid students should succeed test', async () => {
        const { status, data } = await post('addstudents', { teacher: { email: teacher.email }, students });
        expect(status).toBe(200);
        expect(data.message).toEqual(`2 students added successfully to teacher ${teacher.email}!`);
        expect(data.errors).toEqual([]);
    });
    it('Students already added should fail test', async () => {
        const { status, data } = await post('addstudents', { teacher: { email: teacher.email }, students });
        expect(status).toBe(400);
        expect(data.message).toEqual(`0 students added successfully to teacher ${teacher.email}!`);
        expect(errorMessages(data)).toHaveLength(2);
    });
    it('InValid students should fail test', async () => {
        const { status, data } = await post('addstudents', { teacher: { email: teacher.email }, students: [{ email: "student1" }, "student2"] });
        expect(status).toBe(400);
        expect(data.message).toContain('without a list of valid students specified');
    });
    it('Unregistered students should fail test', async () => {
        const { status, data } = await post('addstudents', { teacher: { email: teacher.email }, students: ["student3@example.com"] });
        expect(status).toBe(400);
        expect(errorMessages(data)).toEqual(["Invalid student student3@example.com"]);
    });
    it('Unregistered teacher should fail test', async () => {
        const { status, data } = await post('addstudents', { teacher: { email: "teacher3@example.com" }, students });
        expect(status).toBe(400);
        expect(errorMessages(data)).toEqual(["Invalid teacher teacher3@example.com"]);
    });
    it('InValid teacher should fail test', async () => {
        const { status, data } = await post('addstudents', { teacher: { email: "teacher" }, students });
        expect(status).toBe(400);
        expect(data.message).toContain('with invalid teacher email address');
    });
});
