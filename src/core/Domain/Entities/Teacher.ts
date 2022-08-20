import { Entity, Column, JoinTable, ManyToMany } from "typeorm"
import { EntityBase } from "./EntityBase"
import { Student } from "./Student"
@Entity()
export class Teacher extends EntityBase {
    @Column({ length: 256 })
    public firstName: string

    @Column({ length: 256 })
    public lastName: string

    @Column({ unique: true, length: 256 })
    public email: string

    @ManyToMany((type) => Student, (student) => student.teachers)
    @JoinTable()
    public students: Student[]

    constructor(first: string, last: string, email: string) {
        super();
        this.firstName = first;
        this.lastName = last;
        this.email = email;
        //this.students = []; TypeORM initialization failed! InitializedRelationError: Array initializations are not allowed in entity relations
    }
}
//export type TeacherDTO = Pick<Teacher, { [K in keyof Teacher]: Teacher[K] extends Function ? never : K }[keyof Teacher]>;