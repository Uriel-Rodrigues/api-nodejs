//Importa a biblioteca Express
import express, {Request, Response, Router} from "express";
//importar conxão com banco de dados
import { AppDataSource } from "../data-source";

//imporat o middlewares de verificação
import { verifyToken } from "../middlewares/authMiddleware";
// importar entidade user
import { User } from "../entity/User";
// importar a entidade Product
import { Product } from "../entity/products";
// importar a biblioteca para subitrair me
import {subMonths, format} from "date-fns"
// importar o lacale em portugues
import { ptBR } from "date-fns/locale";

//criar a aplicação express
const router = express.Router()

//criar a rota paa obter relatorios de usuarios cadastrados mensalmente 
//endereço para acessar api atraves da aplicação esterna com o verbo GET:
//http://localhost:8080/users-report
//enviar o bearer token do usuario logado, exemplo: Bearer
//<colocar-o-token-gerad0-com-jwt>
router.get("/users-report", verifyToken,  async(req: Request, res: Response) => {
    try{
        //obter o repositorio da entidade User
        const userRepository = AppDataSource.getRepository(User)

        //criar um array com o sultimos 12 mees no formato 'YYYY-MM'
        const months = Array.from({length: 12}, (_,i) => {
            const date = subMonths(new Date(), 11 - i)
            return {
                key:format(date, "yyyy-MM"),//chave no formato yyyy-MM
                label: format(date, "MMM", {locale: ptBR}).replace(".",""), //nome do mes abreviado
            }
        })

        //buscar a quantidade de usuarios cadastrados agrupados por mes e ano
        const result = await userRepository
            .createQueryBuilder("user")
            .select([
                `DATE_FORMAT(user.createdAt, '%Y-%m') AS month`,
                `COUNT(user.id) AS users`
            ])
        //filtrar os registros para considerar apenas usuarios criados a partir da data nicial 
        .where("user.createdAt >= :startDate", {startDate: months[0].key + "-01"}) // primeiro dia do primeiro mês
        .groupBy("month") //agrupa os registros pelo mes formatado (YYYY-MM)
        .orderBy("month", "ASC") //ordena os resultados de forma crescente (ASC) pelo mes
        .getRawMany() //executa a consulta e retorna os resultados como um array de objetos javaScript

        const resultMap = new Map(result.map((r) => [r.month, parseInt(r.users, 10)]))

        //prencher os meses ausesntes com 0 usuarios e substituir pelo nome abreviado
        const finalResult = months.map(({key, label}) => ({
            month: label, //nome do mes abreviado
            users: resultMap.get(key) || 0
        }))

        //retorna a resposta com os dados e informações da paginação
        res.status(200).json(finalResult)
        return
    }
    catch(error){
        console.log(error)
        res.status(500).json({
            menssage: "erro ao listar registro de usuarios tente novamente"
        })
    }
})

//criar a rota paa obter relatorios de produtos cadastrados mensalmente 
//endereço para acessar api atraves da aplicação esterna com o verbo GET:
//http://localhost:8080/produts-report
//enviar o bearer token do usuario logado, exemplo: Bearer
//<colocar-o-token-gerad0-com-jwt>
router.get("/products-report", verifyToken,  async(req: Request, res: Response) => {
    try{
        //obter o repositorio da entidade User
        const productRepository = AppDataSource.getRepository(Product)

        //criar um array com o sultimos 12 mees no formato 'YYYY-MM'
        const months = Array.from({length: 12}, (_,i) => {

            // Subtrai meses da data atual para obter os últimos 12 meses.
            const date = subMonths(new Date(), 11 - i)
            return {
                key:format(date, "yyyy-MM"),//chave no formato yyyy-MM
                label: format(date, "MMM", {locale: ptBR}).replace(".",""), //nome do mes abreviado
            }
        })

        //buscar a quantidade de usuarios cadastrados agrupados por mes e ano
        const result = await productRepository
            .createQueryBuilder("product")
            .select([
                `DATE_FORMAT(product.createdAt, '%Y-%m') AS month`,
                `COUNT(product.id) AS products`
            ])
        //filtrar os registros para considerar apenas usuarios criados a partir da data nicial 
        .where("product.createdAt >= :startDate", {startDate: months[0].key + "-01"}) // primeiro dia do primeiro mês
        .groupBy("month") //agrupa os registros pelo mes formatado (YYYY-MM)
        .orderBy("month", "ASC") //ordena os resultados de forma crescente (ASC) pelo mes
        .getRawMany() //executa a consulta e retorna os resultados como um array de objetos javaScript

        const resultMap = new Map(result.map((r) => [r.month, parseInt(r.products, 10)]))

        //prencher os meses ausesntes com 0 usuarios e substituir pelo nome abreviado
        const finalResult = months.map(({key, label}) => ({
            month: label, //nome do mes abreviado
            products: resultMap.get(key) || 0
        }))

        //retorna a resposta com os dados e informações da paginação
        res.status(200).json(finalResult)
        return
    }
    catch(error){
        console.log(error)
        res.status(500).json({
            menssage: "erro ao listar registro de usuarios tente novamente"
        })
    }
})

export default router