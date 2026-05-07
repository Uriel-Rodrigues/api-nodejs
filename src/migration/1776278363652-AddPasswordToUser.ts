import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddPasswordToUser1776278363652 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('users', new TableColumn({
            name: "password",
            type:"varchar",
            isNullable: false
        }));
        //adicionar a nova coluna apabido de email
        await queryRunner.query('ALTER TABLE users MODIFY COLUMN password varchar(255) AFTER email')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("users", "password")
    }

}
