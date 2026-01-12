//Importa a biblioteca Express
import express, {Request, Response} from "express";


//criar a aplicação Express
const router = express.Router();

//criar a porta GET principal
//req(rquisição), res(resposta)
router.get("/", (req: Request, res: Response) => {
    res.send ("Ben-vindo uriel!")
});

//exportar a instrução que está dentro da constante router 
export default router