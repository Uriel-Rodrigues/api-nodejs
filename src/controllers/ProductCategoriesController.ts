//Importa a biblioteca Express
import express, { request, Request, response, Response} from "express";
//importar conexão com banco de dados
import { AppDataSource } from "../data-source";
//importar a endidade
import { ProductCategory } from "../entity/product_categories";

//criar a aplicação Express
const router = express.Router();

//Criar rota para listar registros especificaos presentes na entidade
//endereço para acessar api atraves de aplicação externa com verbo GET: http://127.0.0.1:8080/product-categories/:id
router.get("/:id", async (req: Request, res: Response) => {
    try {
        //obtendo informação encaminhada pela URL 
        var {id} = req.params
        //obter repositorio da entidade product-categories
        const productCategoriesRepository = AppDataSource.getRepository(ProductCategory)
        //buscar categoria no repositorio pelo ID
        const productCategories = await productCategoriesRepository.findOneBy({id: parseInt(id)});
        //verificar se o ID existe no repositorio 
        if(!productCategories) {
            res.status(404).json({
                menssage:"erro categoria não encontrada"
            })
        }
        //retornar categoria
        res.status(200).json(productCategories);
        return;
    }
    catch(erro){
        console.log(erro)
        res.status(500).json({
            menssage: "erro ao encontrar registro de categoria"
        })
    }
});


//criar rota para listar registros presentes na entidade
//endereço para acessar api atraves de aplicação externa com verbo GET: http://127.0.0.1:8080/product-categories
router.get("/", async (req: Request, res: Response) => {
    try {
        //obter o repositorio da entidade product-categories
        const productCategoriesRepository = AppDataSource.getRepository(ProductCategory);

        //recuperar todos os registros do repositorio
        const productCategory = await productCategoriesRepository.find();
        
        //retornar as categorias de produtos com resposta
        res.status(200).json(productCategory);
    }
    catch(error) {
        console.log(500).json ({
            menssage: "error ao listar categorias"
        })
    }
});

//criar a porta POST principal
//req(rquisição), res(resposta)
router.post("/", async (req: Request, res: Response) => {
    try {
        //captando elementos enviados pelas 
        var data = req.body   
        //criar uma categoria do repositorio de categoria
        const CategoryRepository = AppDataSource.getRepository(ProductCategory)
        //criat um novo registro de categoria (dados simulados)
        const newCategory = CategoryRepository.create(data)
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

//criari rota para editar regitros usando put
//endereço para acessar a API atraves de aplicação externa: http://127.0.0.1:8080/product-categories/:id
router.put("/:id", async (req: Request, res: Response) =>{
    try {
        //obter informação da URL da aplicação
        var {id} = req.params;
        //obter informação do corpo da aplicação
        const data = req.body;
        //criar repositorio da entidade product categories
        const productCategoriesRepository = AppDataSource.getRepository(ProductCategory);
        //procurar registro pelo ID
        const productCategory = await productCategoriesRepository.findOneBy({id: parseInt(id)});
        //retornar mensagem caso não encontrado
        if(!productCategory) {
            res.status(404).json({
                menssage: "erro categoria de produto não encontrada"
            });
            return;
        };
        //editar registro
        productCategoriesRepository.merge(productCategory, data)
        //salvar registro
        const updateProductCategory = productCategoriesRepository.save(productCategory) 
        //retornar mensagem de suceso
        res.status(200).json({
            menssage: "registro de categoria atualizada com sucesso",
            Category: productCategory
        });
    }
    catch(erro){
        console.log(erro)
        res.status(500).json({
            menssage: "categoria de produto não encontrada"
        })
    }
});

//exportar a instrução que está dentro da constante router 
export default router