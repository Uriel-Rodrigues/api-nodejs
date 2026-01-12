import { Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
//Importando a entidade User
import {User} from "./User";

@Entity("situations")
export class Situation  {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    nameSituation!: string

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt!: Date

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate:"CURRENT_TIMESTAMP"})
    updatedAt!: Date

    //Relacionamento OneToMany com a tabela users
    @OneToMany(() => User, (user) => user.situation)
    users!: User[];
}