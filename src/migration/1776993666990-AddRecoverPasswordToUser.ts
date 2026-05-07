import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
export class AddRecoverPasswordToUser1776993666990 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('users', new TableColumn({
            name: "recoverPassword",
            type:"varchar",
            isUnique: true,
            isNullable: true
        }));
        //adicionar a nova coluna apabido de email
        await queryRunner.query('ALTER TABLE users MODIFY COLUMN recoverPassword varchar(255) AFTER password')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("users","recoverPassword")
    }
}
