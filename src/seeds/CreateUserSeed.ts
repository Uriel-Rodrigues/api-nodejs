import { DataSource } from "typeorm";
import { User } from "../entity/User";
import { Situation } from "../entity/situation";
//importar biblioteca para criptografar senha
import bcrypt from "bcryptjs"

export default class CreateUserSeed {
    public async run(dataSource: DataSource): Promise <void> {
        console.log("iniciando seed para entidade 'User'... ")
        // obter o repositorio da entidade User e situation
        const userRepository = dataSource.getRepository(User)
        const situationRepository = dataSource.getRepository(Situation)
        // verificar se ja existe algum registro na tebela
        const existeData = await userRepository.count()
        //retornar mensagem caso algum registro seja encontrado (tabela não sera populada)
        if (existeData > 0) {
            console.log("a entidade usuarios ja contem registros, nenhum registro foi adicionado")
            return
        }
        //buscar situação no banco de dados
        const situation = await situationRepository.findOne( { where: {id: 1} } )

        //verificar se encontrol a situação no banco de dados 
        if (!situation){
            console.log("erro: Nenhuma situação encontrada com ID 1. verifique se a tabela 'situations' esta populada")
            return
        }
        //criar os registros de usuarios que iram ser cadastrados
        const user = [
            {
                name: "Luiz", 
                email:"luis@email.com.br",
                password:await bcrypt.hash("123456A#s",10),  
                situation: situation
            },
            {
                name: "Lucas", 
                email: "lucas@email.com.br",
                password:await bcrypt.hash("123456A#s",10), 
                situation: situation
            },
            {
                name: "Luiza", 
                email: "Luiza@email.com.br",
                password:await bcrypt.hash("123456A#s",10), 
                situation: situation
            },
            {
                name: "Amanda", 
                email: "amanda@email.com.br",
                password:await bcrypt.hash("123456A#s",10),
                situation: situation
            }
        ]
        // salvar os registros no banco
        await userRepository.save(user)
        //retornar mensagem de sucesso e fim da seed
        console.log("seed concluida com sucesso: Usuarios cadastrados")

    } 
}