//Importa a biblioteca Express
import express, { request, Request, response, Response} from "express";
//importar coneção com banco de dados
import { AppDataSource } from "../data-source";
//importar a entidade
import { ProductSituation } from "../entity/product_situations";

//criar a aplicação Express
const router = express.Router();

//criar a porta GET principal
//req(rquisição), res(resposta)
router.get("/product_situations", async (req: Request, res: Response) => {
    //
    try{
        // criar a product situation do repositorio
        const productSituationRepository = AppDataSource.getRepository(ProductSituation)
        // criar um novo registro de situação de produto
        const newProductSituation = productSituationRepository.create({
            name: "Em estoque" //valor fico para simular um cadastro
        })
        //salvar o registro no banco de dados
        await productSituationRepository.save(newProductSituation)
        //retornar mensagem de sucesso
        res.status(201).json({
            menssage: "situação de produto cadastrada com sucesso",
            productSituation: newProductSituation 
        }); 

    }
    catch (error){
        //retornar resposta de erro
        console.log(error);
        res.status(500).json({
            menssage: "erro ao cadastrar situação de produto"
        })
    }
});

//exportar a instrução que está dentro da constante router 
export default router