import { Entity, Column, ManyToMany, JoinTable } from "typeorm"
import { EntityBase } from "./EntityBase.js"
import { Teacher } from "./Teacher.js"
@Entity()
export class Student extends EntityBase {
    @Column({ length: 256 })
    public firstName: string

    @Column({ length: 256 })
    public lastName: string

    @Column({ unique: true, length: 256 })
    public email: string

    @Column()
    public isSuspended: boolean

    @ManyToMany((type) => Teacher, (teacher) => teacher.students)
    @JoinTable()
    public teachers: Teacher[]

    constructor(first: string, last: string, email: string, isSuspended?: boolean) {
        super();
        this.firstName = first;
        this.lastName = last;
        this.email = email;
        this.isSuspended = isSuspended ?? false;
        //this.teachers = []; TypeORM initialization failed! InitializedRelationError: Array initializations are not allowed in entity relations
    }
}
//export type StudentDTO = Pick<Student, { [K in keyof Student]: Student[K] extends Function ? never : K }[keyof Student]>;