/*{
    "recipients":
    [
        "studentbob@gmail.com",
        "studentagnes@gmail.com",
        "studentmiche@gmail.com"
    ]
}*/
import { Error } from "../Error"
import { UseCaseResponseMessage } from "./UseCaseResponseMessage"
export class StudentNotificationsResponse extends UseCaseResponseMessage {
    public Recipients: string[];
    public constructor(id: string, success: boolean = false, recipients: string[], message?: string, errors?: Array<Error>) {
        super(id, success, message, errors);
        this.Recipients = recipients;
    }
}