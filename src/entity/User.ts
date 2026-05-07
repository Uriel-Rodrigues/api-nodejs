import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate} from "typeorm";
// Impotando a entidade Situation
import { Situation } from "./situation";
//importar a biblioteca para criptografar a senha
import bcrypt from "bcryptjs"

@Entity("users")
export class User  {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({unique: true})
    email!: string;

    @Column()
    password!: string

    @Column({unique:true})
    recoverPassword!: string

    //Relacionamento ManyToOne com a tabela situation
    @ManyToOne(() => Situation, (situation) => situation.users)
    @JoinColumn({name: "situationId"}) //Nome da chave estrangeira
    situation!: Situation;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt!: Date;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate:"CURRENT_TIMESTAMP"})
    updatedAt!: Date;

    //metodo para criptogravar a senha
    @BeforeInsert() // executa o metodo antes de inserir um novo usuario 
    @BeforeUpdate() //executa o metodo antes de atualizar dados de um usuario 
    async hashPassword(): Promise <void> {
        //verificar se a senha esta criptografada e a criptografa antes de salvar no banco 
        if (this.password && !this.password.startsWith("$2b$")) {
            this.password =  await bcrypt.hash(this.password, 10)
        }
    }

    //metodo para comparar a senha informa pelo usuario com a senha no banco de dados
    async comparePassword (password: string): Promise <boolean> {

        //compara a senha enviada pela requisição com a senha criptografada no banco de dados 
        return bcrypt.compare(password, this.password)
    }

}