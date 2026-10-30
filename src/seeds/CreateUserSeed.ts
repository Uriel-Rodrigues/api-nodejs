import { DataSource } from "typeorm";
import { User } from "../entity/User";
import { Situation } from "../entity/situation";
//importar biblioteca para criptografar senha
import bcrypt from "bcryptjs"
//importar biblioteca para manipular as datas
import {subMonths} from "date-fns"

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
                situation: situation,
                createdAt: subMonths(new Date(), 14)
            },
            {
                name: "Lucas", 
                email: "lucas@email.com.br",
                password:await bcrypt.hash("123456A#s",10), 
                situation: situation,
                createdAt: subMonths(new Date(), 10)
            },
            {
                name: "Luiza", 
                email: "Luiza@email.com.br",
                password:await bcrypt.hash("123456A#s",10), 
                situation: situation,
                createdAt: subMonths(new Date(), 13)
            },
            {
                name: "Amanda", 
                email: "amanda@email.com.br",
                password:await bcrypt.hash("123456A#s",10),
                situation: situation,
                createdAt: subMonths(new Date(), 5)
            },
            {
                name: "Auan", 
                email: "luan@email.com.br",
                password:await bcrypt.hash("123456A#s",10),
                situation: situation,
                createdAt: subMonths(new Date(), 2)
            },
            {
                name: "jessica", 
                email: "jessica@email.com.br",
                password:await bcrypt.hash("123456A#s",10),
                situation: situation,
                createdAt: subMonths(new Date(), 4)
            },
            {
                name: "totoro", 
                email: "totoro@email.com.br",
                password:await bcrypt.hash("123456A#s",10),
                situation: situation,
                createdAt: subMonths(new Date(), 8)
            },
            {
                name: "Batman", 
                email: "batman@email.com.br",
                password:await bcrypt.hash("123456A#s",10),
                situation: situation,
                createdAt: subMonths(new Date(), 15)
            },
            {
                name: "Pocarrontas", 
                email: "pocarrontas@email.com.br",
                password:await bcrypt.hash("123456A#s",10),
                situation: situation,
                createdAt: subMonths(new Date(), 1)
            },
            {
                name: "Peito", 
                email: "peito@email.com.br",
                password:await bcrypt.hash("123456A#s",10),
                situation: situation,
                createdAt: subMonths(new Date(), 16)
            },
            {
                name: "Donald", 
                email: "donald@email.com.br",
                password:await bcrypt.hash("123456A#s",10),
                situation: situation,
                createdAt: subMonths(new Date(), 18)
            },

        ]
        // salvar os registros no banco
        await userRepository.save(user)
        //retornar mensagem de sucesso e fim da seed
        console.log("seed concluida com sucesso: Usuarios cadastrados")

    } 
}