import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ProductCategory } from "./product_categories";
import { ProductSituation } from "./product_situations";

@Entity("products") // nome da tabela
export class Product { //nome da classe
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "varchar",length: 255,unique: true})
    name!: string;
    
    @Column({unique: true})
    slug!: string

    @Column({type: "varchar", length:300})
    description!: string;

    @Column()
    price!: number;
    
    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt!: Date;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
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