import { Entity, Column, JoinTable, ManyToMany } from "typeorm"
import { EntityBase } from "./EntityBase"
import { Student } from "./Student"
@Entity()
export class Teacher extends EntityBase {
    @Column()
    public firstName: string

    @Column()
    public lastName: string

    @Column({ unique: true })
    public email: string

    @ManyToMany(() => Student)
    @JoinTable()
    public student: Student[]

    constructor(first: string, last: string, email: string) {
        super();
        this.firstName = first;
        this.lastName = last;
        this.email = email;
        this.student = [];
    }
}