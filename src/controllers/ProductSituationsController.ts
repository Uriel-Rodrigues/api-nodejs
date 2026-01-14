//Importa a biblioteca Express
import express, { request, Request, response, Response} from "express";
//importar coneção com banco de dados
import { AppDataSource } from "../data-source";
//importar a entidade
import { ProductSituation } from "../entity/product_situations";

//criar a aplicação Express
const router = express.Router();

//criar rota para visualizar situação especifica de produdo
//endereço para acessar a apiatraves da aplicação externa com o vermo GET: http: 127.0.0.1:8080/product-situations/:id
router.get("/:id", async (req: Request, res: Response) => {
    try {
        //coletar dados enviados da URL da requisição
        const {id} = req.params
        
        //ober o repositorio da entidade product_situations
        const productSituationsRepository = AppDataSource.getRepository(ProductSituation)

        //buscar a situação no banco de dados pelo id
        const productSituation = await productSituationsRepository.findOneBy({id: parseInt(id)});
        
        //verificar se a situação foi encontrada
        if (!productSituation) {
            res.status(404).json({
                menssage: "situação de produto não encontrada"
            });
        }
        //retornar situação caso encontrada
        res.status(200).json(productSituation)
    }
    catch (error){
        //retornar resposta de erro
        console.log(error);
        res.status(500).json({
            menssage: "erro ao encontrar situação"
        })
    }
});

//Criar rotar para LISTAR registros de situações de produtos ´resentes no banco 
// endereço para acessar a api atravez da aplicação externa com o verbo GET: http;//127.0.0.1:8080/product-situations

router.get("/", async (req: Request, res: Response) => {
    try {
        //obtrer o repositorio a entidade product_situations
        const productSituationRepository = AppDataSource.getRepository(ProductSituation)

        //recuperar todas as situações de produtos do banco 
        const productsituations = await productSituationRepository.find()

        //retornar as situações como resposta
        res.status(200).json(productsituations)
    }
    catch (error){
        //retornar resposta de erro
        console.log(error);
        res.status(500).json({
            menssage: "erro ao listar situações"
        })
    }
});

//criar a porta GET principal
//req(rquisição), res(resposta)
router.post("/", async (req: Request, res: Response) => {
    //
    try{
        //receber os dados enviados no corpo da requisição
        var data = req.body
        // criar a product situation do repositorio
        const productSituationRepository = AppDataSource.getRepository(ProductSituation)
        // criar um novo registro de situação de produto
        const newProductSituation = productSituationRepository.create(data)
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