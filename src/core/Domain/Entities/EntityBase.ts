import { PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from "typeorm"
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
    @BeforeInsert()
    updateDates () {
        this.created = new Date();
        this.modified = new Date();
    }
    @BeforeUpdate()
    updateModifiedDate () {
        this.modified = new Date();
    }
}