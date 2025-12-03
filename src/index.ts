//Importa a biblioteca Express
import express, { request, Request, response, Response} from "express";

//criar a aplicação Express
const app = express();

//criar a porta GET principal
//req(rquisição), res(resposta)
app.get("/", (req: Request, res: Response) => {
    res.send ("benvindo uriel!")
});

//Iiciar o servidor na porta 8080
app.listen (8080, () => {
    console.log("sevidor iniciado na porta 8080: http//localhost:8080")
});