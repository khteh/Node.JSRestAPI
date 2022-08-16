import { Error } from "../Error"
import { StudentDTO } from "DTO/StudentDTO"
import { UseCaseResponseMessage } from "./UseCaseResponseMessage"
export class CommonStudentsResponse extends UseCaseResponseMessage {
    public Students: StudentDTO[];
    public constructor(id: string, success: boolean = false, students: StudentDTO[], message?: string, errors?: Array<Error>) {
        super(id, success, message, errors);
        this.Students = students;
    }
}