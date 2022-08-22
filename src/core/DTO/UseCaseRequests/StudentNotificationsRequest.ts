/*
{
"teacher":  "teacherken@gmail.com",
"notification": "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com"
}
*/
import { Student } from "../../Domain/Entities/Student";
import { IUseCaseRequest } from "../../Interfaces/IUseCaseRequest";
import { StudentNotificationsResponse } from "../UseCaseResponse/StudentNotificationsResponse";
export class StudentNotificationsRequest implements IUseCaseRequest<StudentNotificationsResponse>
{
    public Message: string;
    public Teacher: string;
    public Students: string[];
    constructor(message: string, teacher: string, students: string[]) {
        this.Message = message;
        this.Teacher = teacher;
        this.Students = students;
    }
}