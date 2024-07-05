import { Error } from "../Error.js"
import { StudentDTO } from "../StudentDTO.js"
import { UseCaseResponseMessage } from "./UseCaseResponseMessage.js"
export class CommonStudentsResponse extends UseCaseResponseMessage {
    public Students: StudentDTO[];
    public constructor(id: string, success: boolean = false, students: StudentDTO[], message?: string, errors?: Array<Error>) {
        super(id, success, message, errors);
        this.Students = students;
    }
}