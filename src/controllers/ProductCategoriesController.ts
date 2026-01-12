//Importa a biblioteca Express
import express, { request, Request, response, Response} from "express";
//importar conexão com banco de dados
import { AppDataSource } from "../data-source";
//importar a endidade
import { ProductCategory } from "../entity/product_categories";

//criar a aplicação Express
const router = express.Router();

//criar a porta GET principal
//req(rquisição), res(resposta)
router.get("/product_categories",async (req: Request, res: Response) => {
    try {
        //criar uma categoria do repositorio de categoria
        const CategoryRepository = AppDataSource.getRepository(ProductCategory)
        //criat um novo registro de categoria (dados simulados)
        const newCategory = CategoryRepository.create({
            name: "itens domenticos" //valor fixo para simular um cadastro
        })
        //salvar o registro no banco de dados
        await CategoryRepository.save(newCategory)
        //retornar resposta de sucesso
        res.status(201).json ({
            menssage: "categoria cadastrada com sucesso!",
            category: newCategory
        });  
    }
    catch (error) {
        //retornar resposta de erro
        console.log(error);
        res.status(500).json({
            menssage: "arro ao cadastrar categoria"
        }) 

    }

});

//exportar a instrução que está dentro da constante router 
export default router