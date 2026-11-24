import { expect } from 'vitest'
import { type IStudentRepository, type ITeacherRepository, RepositoryTypes } from "webapi.core";
import { di } from "../../src/webapi/routes/api.js"

/** POST a JSON body to /api/<path> on the test server; returns the status and the parsed JSON body. */
export async function post (port: number | string, path: string, body: unknown): Promise<{ status: number, data: any }> {
    const response = await fetch(`https://localhost:${port}/api/${path}`, {
        method: "POST",
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    return { status: response.status, data: await response.json() };
}

/** The Description of each entry in a response's "errors" list. */
export const errorMessages = (data: any): string[] => (data?.errors ?? []).map((e: { Code: string, Description: string }) => e.Description);

/** Empties the student, teacher and join tables of the test database. */
export async function resetDatabase (): Promise<void> {
    const studentRepo = di.get<IStudentRepository>(RepositoryTypes.IStudentRepository);
    const teacherRepo = di.get<ITeacherRepository>(RepositoryTypes.ITeacherRepository);
    expect(await studentRepo.DeleteAllRelations()).toBe(true);
    expect(await studentRepo.DeleteAllStudents()).toBe(true);
    expect(await teacherRepo.DeleteAllTeachers()).toBe(true);
}
