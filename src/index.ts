// importar a biblioteca express
import express from "express";

//importar biblioteca para permitir conexão externa
import cors from 'cors'

//importar a biblioteca variaveis de ambiente
import dotenv from "dotenv"


//carregar as variaveis do arquivo .env
dotenv.config();

// criar a aplicação express
const app = express();

//criar o middleware para receber os dados no corpo da requisição
app.use(express.json());

//criar o middleware para permitir requisições externas
app.use(cors());

//incluir as CONTROLLERS
import TestConnectionController from "./controllers/TestConnectionController"
import AuthController from "./controllers/AuthController"
import SituationController from "./controllers/SituationController"
import ProductCategoriesController from "./controllers/ProductCategoriesController"
import ProductSituationsController from "./controllers/ProductSituationsController"

//criar as rotas
app.use('/test', TestConnectionController);
app.use('/auth', AuthController);
app.use('/situation', SituationController);
app.use('/product-categories', ProductCategoriesController);
app.use('/product-situations', ProductSituationsController);

//Iiciar o servidor na porta 8080
app.listen (process.env.PORT, () => {
    console.log(`sevidor iniciado na porta ${process.env.PORT}: http//localhost:${process.env.PORT}`)
});