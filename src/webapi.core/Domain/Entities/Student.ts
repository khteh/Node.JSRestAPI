import { Entity, Column, ManyToMany, JoinTable, Relation } from "typeorm"
import { EntityBase } from "./EntityBase.js"
import type { Teacher } from "./Teacher.js"
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

    //@ManyToMany((type) => Teacher, (teacher) => teacher.students, { cascade: true })
    @ManyToMany("Teacher", { cascade: true })
    @JoinTable() // Note that the inverse relation does not have a @JoinTable. @JoinTable must be only on one side of the relation.
    public teachers: Relation<Teacher>[]

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