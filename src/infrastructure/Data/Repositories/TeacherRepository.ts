import { Teacher, ITeacherRepository } from "core"
import { RepositoryBase } from "./RepositoryBase"
export class TeacherRepository extends RepositoryBase<Teacher> implements ITeacherRepository {
    constructor() {
        super(Teacher);
    }
}