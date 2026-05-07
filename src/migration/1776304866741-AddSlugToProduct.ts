import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import { Query } from "typeorm/driver/Query.js";

export class AddSlugToProduct1776304866741 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('products', new TableColumn({
            name: "slug",
            type: "varchar",
            isNullable: false
        }))
        //adicionar a nova coluna depois de nome
        await queryRunner.query('ALTER TABLE products MODIFY COLUMN slug VARCHAR(255) AFTER name ')

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("products", "slug")
    }

}
