//Importa a biblioteca Express
import express, {Request, Response} from "express";
//criar a aplicação Express
const router = express.Router();

//criar a porta GET principal
//req(rquisição), res(resposta)
router.get("/test-connection", (req: Request, res: Response) => {
    res.status(200).json({
        menssage: "conexão com a API realizada com sucesso!"
    })
});

//exportar a instrução que está dentro da constante router 
export default router