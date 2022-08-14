export class RegisterTeacherModel {
    public firstname: string;
    public lastname: string;
    public email: string;
    constructor(first: string, last: string, email: string) {
        this.firstname = first;
        this.lastname = last;
        this.email = email;
    }
}