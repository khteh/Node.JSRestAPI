import { Entity, Column, ManyToMany } from "typeorm"
import { EntityBase } from "./EntityBase"
@Entity()
export class Student extends EntityBase {
    @Column()
    public firstName: string

    @Column()
    public lastName: string

    @Column({ unique: true })
    public email: string

    @Column()
    public isSuspended: boolean

    constructor(first: string, last: string, email: string, isSuspended?: boolean) {
        super();
        this.firstName = first;
        this.lastName = last;
        this.email = email;
        this.isSuspended = isSuspended ?? false;
    }
}