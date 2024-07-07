import { Teacher } from "../../Domain/Entities/Teacher.js";
import { RegistrationRequest } from "./RegistrationRequest.js";
export class RegisterTeacherRequest extends RegistrationRequest<Teacher> {
    constructor(teachers: Teacher[]) {
        super(teachers);
    }
}