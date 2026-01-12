import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Product } from "./products";

@Entity("product_categories") //nome da tabela
export class ProductCategory{ //Nome da classe
    @PrimaryGeneratedColumn() //Ela criará intuma coluna com auto-increment/ serial/ sequence/ identity
    id!: number

    @Column({
        type: "varchar",
        length: 255,
        unique: true
    })
        name!: string

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt!: Date

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
    updatedAt!: Date

    //relacionameto OneToMany com a tabela products
    @OneToMany (() => Product, (product) => product.category)
    products!: Product[]

}