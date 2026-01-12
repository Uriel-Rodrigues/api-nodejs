import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ProductCategory } from "./product_categories";
import { ProductSituation } from "./product_situations";

@Entity("products") // nome da tabela
export class Product { //nome da classe
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "varchar",
        length: 255,
        unique: true
    })
        name!: string;
    
    @Column({type: "timestamp", default: () => "COURRENT_TIMESTAMP"})
    createdAt!: Date;

    @Column({type: "timestamp", default: () => "CORRENT_TIMESTAMP", onUpdate: "COURRENT_TIMESTAMP"})
    updatedAt!: Date;

    //relacionamento ManyToOne com a tabela product_categories
    @ManyToOne(() => ProductCategory, (category) => category.products)
    @JoinColumn({name: "productCategoryId"})
    category!: ProductCategory

    //relacionamento ManyToOne com a tabela product_situation
    @ManyToOne(() => ProductSituation, (situation) => situation.products )
    @JoinColumn({name: "productSituationId"})
    situation!: ProductSituation


};