//Importa a biblioteca Express
import express, { request, Request, response, Response} from "express";
//importar conexão com banco de dados
import { AppDataSource } from "../data-source";
//importar a endidade
import { ProductCategory } from "../entity/product_categories";
//importando seviso de paginação
import { PaginationService } from "../services/PaginationService";
//importando biblioteca yup
import * as yup from 'yup'
import { Not } from "typeorm";
//importar verificação de token 
import { verifyToken } from "../middlewares/authMiddleware";

//criar a aplicação Express
const router = express.Router();

//Criar rota para LISTAR registros ESPECIFICOS presentes na entidade
//endereço para acessar api atraves de aplicação externa com verbo GET: http://127.0.0.1:8080/product-categories/:id
router.get("/product-categories/:id",verifyToken, async (req: Request, res: Response) => {
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


//criar rota para LISTAR registros presentes na entidade
//endereço para acessar api atraves de aplicação externa com verbo GET: http://127.0.0.1:8080/product-categories
router.get("/product-categories",verifyToken, async (req: Request, res: Response) => {
    try {
        //obter o repositorio da entidade product-categories
        const productCategoriesRepository = AppDataSource.getRepository(ProductCategory);

        //receber o numero de paginas e determinar a pagina 1 como padrão
        const page = Number(req.query.page) || 1
        //definir o numero de registros por pagina
        const limit = Number(req.query.limit) || 10
        //aplicar o serviço de paginação 
        const result = await PaginationService.paginate(productCategoriesRepository,page,limit, {id: "DESC"})
        // Retornar resposta com os dados e informações da paginação
        res.status(200).json(result)  
    }
    catch(error) {
        res.status(500).json ({
            menssage: "error ao listar categorias"
        })
    }
});

//rota para CADASTRAR registros na entidade pelo verbo POST
//req(rquisição), res(resposta)
router.post("/product-categories/create",verifyToken, async (req: Request, res: Response) => {
    try {
        //captando elementos enviados pelas 
        var data = req.body
        
        //validar registro usando yup
        const schema = yup.object().shape({
            name:yup
            .string()
            .required("o campo 'nome' é obrigatorio! ")
            .min(3, "o campo 'nome' deve conter pelo menos 3 caracteres")
        });
        //verificar se os dados passaram na validação 
        await schema.validate(data,{abortEarly:false});

        //criar uma categoria do repositorio de categoria
        const categoryRepository = AppDataSource.getRepository(ProductCategory)
        
        //recuperar o valor do banco de dados com o valor da coluna nome
        const existProductCategories = await categoryRepository.findOne({
            where: {name: data.name}
        })
        //verificar se ja existe um registro com o mesmo nome
        if(existProductCategories){
            res.status(401).json({
                menssage: "ja exisre uma categoria de produto com esse nome!"
            })
            return;
        }
        
        //criat um novo registro de categoria (dados simulados)
        const newCategory = categoryRepository.create(data)
        //salvar o registro no banco de dados
        await categoryRepository.save(newCategory)
        //retornar resposta de sucesso
        res.status(201).json ({
            menssage: "categoria cadastrada com sucesso!",
            category: newCategory
        });  
    }
    catch (error) {
        //retornar mensagem de erro na validação caso acorra
        if(error instanceof yup.ValidationError){
            res.status(400).json ({
                menssage: error.errors
            })
            return;
        }

        //retornar resposta de erro
        console.log(error);
        res.status(500).json({
            menssage: "arro ao cadastrar categoria"
        }) 

    }
});

//criari rota para EDITAR regitros usando put
//endereço para acessar a API atraves de aplicação externa: http://127.0.0.1:8080/product-categories/:id
router.put("/product-categories/:id",verifyToken, async (req: Request, res: Response) =>{
    try {
        //obter informação da URL da aplicação
        var {id} = req.params;
        //obter informação do corpo da aplicação
        const data = req.body;
        
        //validar dados com yup
        const  schema = yup.object().shape({
            name: yup
            .string()
            .required("o campo 'nome' é obrigatorio") 
            .min(3, "o campo 'nome' deve conter pelo menos 3 caracteres")
        })
        //verificar se dados passaram na validação
        await schema.validate(data, {abortEarly:false}) 

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
        //verificar se ja existe uma categoria com o mesmo nome
        const existCategory = await productCategoriesRepository.findOne({
            where:{
                name: data.name,
                id: Not(parseInt(id))// exclui o proprio registro da busca
            }
        })
        if(existCategory) {
            res.status(400).json({
                menssage: "ja existe uma Categoria com esse nome"
            })
            return
        }
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
    catch(error){
        //retornar mensagem em caso de erro na verificação
        if(error instanceof yup.ValidationError) {
            res.status(400).json({
                menssage: error.errors
            });
            return;
        }
        console.log(error)
        res.status(500).json({
            menssage: "categoria de produto não encontrada"
        })
    }
});

//criar rota para deletar registros usando delete
//endereço para acessar API pela aplicação externa usando PUT: http://127.0.0.1:8080/product-categories/:id
router.delete("/product-categories/:id",verifyToken, async (req: Request, res: Response) => {
    try {
        //obter informação da URL
        var {id} = req.params
        //criar repositorio da entidade product-categories
        const productCategoriesRepository = AppDataSource.getRepository(ProductCategory)
        //pesquisar no repositorio pelo ID
        const productCategory = await productCategoriesRepository.findOneBy({id:parseInt(id)}) 
        //verificar se existe
        if(!productCategory){
            res.status(404).json ({
                menssage: "erro categoria de produto não encontrada"
            });
            return;
        };
        //deletar registro
        await productCategoriesRepository.remove(productCategory)
        //menssagem de sucesso
        res.status(200).json ({
            menssage: "categoria de produto deletado com sucesso",
            category: productCategory
        }); 
    }
    catch(erro) {
        console.log(erro)
        res.status(500).json ({
            menssage: "erro ao deletar categoria de produto"
        });
    };
});

//exportar a instrução que está dentro da constante router 
export default router