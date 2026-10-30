import "reflect-metadata";
import { DataSource } from "typeorm";
//importar a biblioteca variaveis de ambiente
import dotenv from "dotenv"
import { Situation } from "./entity/situation";
import { User } from "./entity/User";
import { ProductCategory } from "./entity/product_categories";
import { ProductSituation } from "./entity/product_situations";
import { Product } from "./entity/products";

//carregar as variaveis do arquivo .env
dotenv.config();

//?? operador de coalescência nula - 
// se o valor da esquerda for nulo sera usado o da direita 
//const dialect = process.env.DB_DIALECT ?? "mysql"
const type = process.env.DB_TYPE ?? "postgres" 

export const AppDataSource = new DataSource({ 
    type: type as "postgres",
    //type: dialect as "mysql", //O as no TypeScript serve para forçar o TypeScript a tratar um valor como um determinado tipo, mesmo que ele não tenha certeza disso. "é como dizer:“Eu sei o que estou fazendo. Aceita isso aí.”"  
    host: process.env.DB_HOST, 
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432, //3306, 
    username: process.env.DB_USERNAME, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_DATABASE, 
    synchronize: false, 
    logging: true, 
    entities: [Situation, User, Product, ProductCategory, ProductSituation], 
    subscribers: [], 
    migrations: [__dirname + "/migration/*.js"], 
})

//inicializar a conexão com o banco de dados
AppDataSource.initialize()
    .then(() => {
        console.log("conexão com banco de dados realizada com sucesso!");
    })
    .catch((error) => {
        console.log("error na conexão com o banco de dados:", error);
    });