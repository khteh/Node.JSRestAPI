import { IRepository } from './IRepository.js'
import { Student } from '../Domain/Entities/Student.js'
import { Teacher } from '../Domain/Entities/Teacher.js'
export interface ITeacherRepository extends IRepository<Teacher> {
    AddStudent (teacher: Teacher, student: Student): Promise<Teacher | null>;
}