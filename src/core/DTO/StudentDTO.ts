export class StudentDTO {
    public id: number;
    public firstName: string
    public lastName: string
    public email: string
    public isSuspended: boolean
    public constructor(id: number, firstName: string, lastName: string, email: string, isSuspended: boolean) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.isSuspended = isSuspended;
    }
}