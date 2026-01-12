import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Product } from "./products";

@Entity("product_situations") 
    export class ProductSituation {
    
        @PrimaryGeneratedColumn()
        id!: number;

        @Column({
            type: "varchar",
            length: 255,
            unique: true
        })
            name!: string;

        @Column({type: "timestamp", default: () => "COURRENT_TIMESTAMP" })
        createdAt!: Date;

        @Column({type: "timestamp", default: () => "COURRENT_TIMESTAMP", onUpdate:"COURRENT_TIMESTAMP"})
        updatedAt!: Date;

        //relacionamento OneToMany com a tabela products 
        @OneToMany(() => Product, (product) => product.situation)
        products!: Product[]   
    
};