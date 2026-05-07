import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import { string } from "yup";

export class CreateProductsTable1766085419348 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
    name:"products",
    columns: [
        {
            name: "name",
            type: "varchar",
            isUnique: true
        },
        {
            name: "id",
            type: "int",
            isUnique: true,
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment"
        },
        {
            name: "description",
            type: "varchar"
        },
        {
            name: "price",
            type: "float"
        },
        {
            name: "productSituationId",
            type: "int"
        },
        {
            name: "productCategoryId",
            type: "int"
        },
        {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP"
        },
        {
            name: "updatedAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP"
        }
    ]
    }));
    //criando a chave estrangeira com a tebela product_situations
    await queryRunner.createForeignKey(
        "products",
        new TableForeignKey({
            columnNames: ["productSituationId"],
            referencedTableName: "product_situations",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE"
        })
    );
    //criando a chave estrangeira com a tabela product_categories 
    await queryRunner.createForeignKey(
        "products",
        new TableForeignKey({
            columnNames: ["productCategoryId"],
            referencedTableName: "product_categories",
            referencedColumnNames:["id"],
            onDelete: "CASCADE"
        })
    );
};

    public async down(queryRunner: QueryRunner): Promise<void> {
    //remover a chave estrangeira com a tabela product_categories
    const table = await queryRunner.getTable("products"); 

    if (!table) return;

    // FK productCategoryId 
    const categoryFK = table.foreignKeys.find(
        (fk) => fk.columnNames.includes("productCategoryId")
    );
    if (categoryFK)  {
        await queryRunner.dropForeignKey("products", categoryFK)
    }

    // FK productSituationId
    const situationFK = table.foreignKeys.find(
        (fk) => fk.columnNames.includes("productSituationId")
    );
    if (situationFK) {
        await queryRunner.dropForeignKey("products", situationFK)
    }


    //deletando a tabela
    await queryRunner.dropTable("products");
    };

};
