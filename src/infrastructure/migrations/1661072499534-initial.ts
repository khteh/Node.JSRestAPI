import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class initial1661072499534 implements MigrationInterface {

    public async up (queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "student",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true, // Auto-increment
                    generationStrategy: 'increment'
                },
                {
                    name: "firstName",
                    type: "varchar(256)"
                },
                {
                    name: "lastName",
                    type: "varchar(256)"
                },
                {
                    name: "email",
                    type: "varchar(256)",
                    isUnique: true
                },
                {
                    name: "isSuspended",
                    type: "tinyint"
                },
                {
                    name: "created",
                    type: "datetime"
                },
                {
                    name: "modified",
                    type: "datetime"
                }
            ],
        }),
            true);
        await queryRunner.createTable(new Table({
            name: "teacher",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true, // Auto-increment
                    generationStrategy: 'increment'
                },
                {
                    name: "firstName",
                    type: "varchar(256)"
                },
                {
                    name: "lastName",
                    type: "varchar(256)"
                },
                {
                    name: "email",
                    type: "varchar(256)",
                    isUnique: true
                },
                {
                    name: "created",
                    type: "datetime"
                },
                {
                    name: "modified",
                    type: "datetime"
                }
            ],
        }),
            true);
    }

    public async down (queryRunner: QueryRunner): Promise<void> {
    }

}
