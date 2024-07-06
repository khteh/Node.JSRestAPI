export class RegisterStudentModel {
    public firstName: string;
    public lastName: string;
    public email: string;
    constructor(first: string, last: string, email: string) {
        this.firstName = first;
        this.lastName = last;
        this.email = email;
    }
}