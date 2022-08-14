import { PrimaryGeneratedColumn, Column, Entity } from "typeorm"
/*
* Use Data Mapper pattern: https://typeorm.io/active-record-data-mapper
*/
export abstract class EntityBase {
    @PrimaryGeneratedColumn()
    public id: number
    @Column()
    public created: Date
    @Column()
    public modified: Date
}