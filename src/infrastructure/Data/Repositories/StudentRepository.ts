import { Student, IStudentRepository } from "core"
import { RepositoryBase } from "./RepositoryBase"
export class StudentRepository extends RepositoryBase<Student> implements IStudentRepository {
    constructor() {
        super(Student);
    }
}