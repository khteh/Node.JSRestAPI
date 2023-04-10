import { IRepository } from './IRepository'
import { Student } from '../Domain/Entities/Student'
import { Teacher } from '../Domain/Entities/Teacher';
export interface IStudentRepository extends IRepository<Student> {
    AddTeacher (student: Student, teacher: Teacher): Promise<Student | null>;
    RegisteredToTeacher (teacher: Teacher): Promise<Student[]>;
}