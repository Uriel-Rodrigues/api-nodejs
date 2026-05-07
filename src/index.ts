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
import UserController from "./controllers/UserController"
import SituationController from "./controllers/SituationController"
import ProductCategoriesController from "./controllers/ProductCategoriesController"
import ProductSituationsController from "./controllers/ProductSituationsController"
import ProctController from "./controllers/ProductController"


//criar as rotas
app.get("/", (req, res) => {
    res.send("API rodando com sucesso")
})
app.use('/', TestConnectionController);
app.use('/', AuthController);
app.use('/', UserController)
app.use('/', SituationController);
app.use('/', ProductCategoriesController);
app.use('/', ProductSituationsController);
app.use('/', ProctController)


//Iiciar o servidor na porta 8080
app.listen (process.env.PORT, () => {
    console.log(`sevidor iniciado na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`)
});