import { IRepository } from './IRepository.js'
import { Student } from '../Domain/Entities/Student.js'
import { Teacher } from '../Domain/Entities/Teacher.js';
export interface IStudentRepository extends IRepository<Student> {
    AddTeacher (student: Student, teacher: Teacher): Promise<Student | null>;
    RegisteredToTeacher (teacher: Teacher): Promise<Student[]>;
}