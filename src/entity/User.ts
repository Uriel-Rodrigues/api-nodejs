import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
// Impotando a entidade Situation
import { Situation } from "./situation";

@Entity("users")
export class User  {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({unique: true})
    email!: string;

    //Relacionamento ManyToOne com a tabela situation
    @ManyToOne(() => Situation, (situation) => situation.users)
    @JoinColumn({name: "situationId"}) //Nome da chave estrangeira
    situation!: Situation;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    creatdAt!: Date;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate:"CURRENT_TIMESTAMP"})
    updatedAt!: Date;
}