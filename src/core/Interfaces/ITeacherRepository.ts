import { IRepository } from './IRepository'
import { Student } from '../Domain/Entities/Student'
import { Teacher } from '../Domain/Entities/Teacher'
export interface ITeacherRepository extends IRepository<Teacher> {
    AddStudent (teacher: Teacher, student: Student): Promise<Teacher | null>;
}