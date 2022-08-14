import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"
import { EntityBase } from "./EntityBase"
@Entity()
export class TeacherStudent extends EntityBase {
    /*constructor(first: string, last: string, email: string) {
        super();
        this.firstName = first;
        this.lastName = last;
        this.email = email;
    }*/
}