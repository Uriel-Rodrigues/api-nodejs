import { AppDataSource } from "../data-source";
import express, {Request, response, Response} from "express";
import { Product } from "../entity/products";
import { PaginationService } from "../services/PaginationService";
import * as yup from 'yup'
//importar a biblioteca para converter o slug automaticamente antes de salvar no banco de dados
import slugify from "slugify"
import { Not } from "typeorm";

//importar verificação de token 
import { verifyToken } from "../middlewares/authMiddleware";

//criar a aplicação express
const router = express.Router()

//criar rota para LISTAR os registros de Produtos presentes no banco 
//verbo - GET

router.get("/product",verifyToken, async (req: Request, res: Response) => {
    try{
        //obter o repositorio da entidade Product
        const productRepository = AppDataSource.getRepository(Product)
        //receber o numero de paginas e definir 1 como padrão
        const page = Number(req.query.page) || 1
        //definir o numero de registro por pagina
        const limit = Number(req.query.limit) || 10 
        //usar o serviço de paginação
        const result = await PaginationService.paginate(productRepository, page, limit, {id:"DESC"})
        //retornar a resposta com os dados e informações da paginação
        res.status(200).json(result)
        return
    }
    catch(error: any){
        console.log(error)
        res.status(500).json({
            manssage:"erro ao listar registros de PRODUTOS "
        })
    }
})

//rota para VISUALIZAR um registro espescifico de produto 
//verbo - GET
//router.get("/:id", async (req: Request, res: Response) => {
router.get("/product/:slug",verifyToken, async (req: Request, res: Response) => {
    try{
        //capiturar o endereço ID que vem pela URL
        //const {id} = req.params
        //capiturar o endereço slug que vem pela URL
        const {slug} = req.params
        //obter repositorio da entidade product
        const productRepository = AppDataSource.getRepository(Product)
        //procurar produto pelo ID
        //const existeProduct = await productRepository.findOneBy({id: parseInt(id)})
        //procurar produto pelo slug
        const existeProduct = await productRepository.findOne({
            where: {slug}
        }) 
        //verificar se o produto existe 
        if(!existeProduct) {
            res.status(404).json({
                menssage: "Produto não encontrado, tente novamente, ou escolha outro produto"
            })
            return
        }
        //retornar resultado 
        res.status(200).json(existeProduct)
    }
    catch(error:any){
        console.log(error)
        res.status(500).json({
            menssage: "erro ao carregar situação"
        })
    }
})

//criar rota para CADASTRAR um novo produto 
//verbo POST
router.post("/product/create",verifyToken, async (req: Request, res: Response) => {
    try{
        //receber os dados que vem do corpo da requisção
        var data = req.body
        //verificar os dados usando yup
        const schema = yup.object().shape({
            name: yup
            .string()
            .required("o capo 'nome' é obrigatorio!")
            .min(3, "o nome do produto precisa de no minimo 3 caracteres"),
            slug: yup
            .string()
            .required("o campo slug é obrigatorio")
            .min(3, "o campo slug deve ter no minimo 3 caracteres"!)
            .max(255, "o campo slux deve ter no maximo 255 caracteres!"),
            description: yup
            .string()
            .required("o campo 'descrição' é obrigatorio!")
            .min(10, "o mcampo precisa de no minimo 10 caracteres"),
            price: yup
            .number()
            .required("o campo de 'preço' é obrigatorio"),
            category: yup
            .number()
            .required("o capo id da categoria do produto é necessario"),
            situation: yup
            .number()
            .required("o capo id da situação do produto é necessario")
        })
        //verificar se os dados passaram na verificação
        await schema.validate(data, {abortEarly:false})

        //gerar slug automaticamente com base no nome
        data.slug = slugify(data.slug, {lower : true, strict: true})
        
        //obter repositorio da entidade Product
        const productRepository = AppDataSource.getRepository(Product) 
        
        //verificar se ja existe algun registro com o mesmo nome
        const existeProduct = await productRepository.findOne({
            where: {name: data.name} 
        })
        if(existeProduct) {
            res.status(201).json({
                menssage: "ja existe um Produto com essse nome"
            })
            return;
        }
        //criar novo registro na entidade
        const newProduct = productRepository.create(data)
        //salvar registro 
        await productRepository.save(newProduct)
        //retornar mensagem de sucesso 
        res.status(200).json({
            menssage: "novo produto cadastrado com sucesso",
            product: newProduct
        })
    }
    catch(error: any){
        //retorna menssagem de erro durante a validação
        if(error instanceof yup.ValidationError){
            res.status(400).json({
                menssage: error.errors
            })
            return
        }
        //retorna resposta de erro
        res.status(500).json({
            menssage:"nao foi possivel cadastrar o produto tente novamente!"
        })
    }
})

//criar rota para EDITAR registro de um produto
//verbo - PUT
router.put("/product/:id",verifyToken, async(req:Request, res:Response) => {
    try{
        //capiturar o id envado na URL
        const {id} = req.params
        //capiturar os dados enviados no corpo da requisição
        const data = req.body
        //validadar os daos com yup
        const schema = yup.object().shape({
            name: yup
            .string()
            .required("o capo 'nome' é obrigatorio!")
            .min(3, "o nome do produto precisa de no minimo 3 caracteres"),
            description: yup
            .string()
            .required("o campo 'descrição' é obrigatorio!")
            .min(10, "o mcampo precisa de no minimo 10 caracteres"),
            price: yup
            .number()
            .required("o campo de 'preço' é obrigatorio"),
            category: yup
            .number()
            .required("o capo id da categoria do produto é necessario"),
            situation: yup
            .number()
            .required("o capo id da situação do produto é necessario")
        }) 
        //verificar se os dados passaram na validação
        await schema.validate(data,{abortEarly:false}) 
        //obter repositorio da entidade product
        const productRepository = AppDataSource.getRepository(Product)
        //buscar os dados pelo ID encaminhado
        const product = await productRepository.findOneBy({id:parseInt(id)})
        //retornar mensagem caso ID nao seja encontrado
        if(!product){
            res.status(404).json({
                menssage: "erro, produto não encontrado tente novamente"
            })
            return
        }
        //verificar se existe algum registro com o mesmo nome
        const existeProduct = await productRepository.findOne({
            where: {
                name: data.name,
                id: Not(parseInt(id))
            } 
        })
        //caso existe retorna messagem
        if(existeProduct) {
            res.status(200).json({
                menssage: "ja existe um produto com esse nome"
            })
        } 
        //modificar os dados
        productRepository.merge(product, data)
        //salvar dados
        const upDateProduct = await productRepository.save(product) 
        //retornar mensagem de sucesso
        res.status(200).json({
            menssage: "dados de produto editado com sucesso",
            product: upDateProduct
        })

    }
    catch (error: any){
        //retorno de menssagem em caso de erro de validação
        if(error instanceof yup.ValidationError) {
            res.status(400).json({
                menssage: error.errors
            })
            return
        }
        //retornar menssagem de erro
        res.status(500).json({
            menssage: "erro ao editar dados do produto"
        })
    }
})

//criando rota para DELETAR um registro de produto 
//VERBO  - DELETE
router.delete("/product/:id",verifyToken, async (req: Request, res: Response) => {
    try {
        //pegar o id que vem pela URL
        const {id} = req.params;
        //capturar o repositorio de entidade product
        const productRepository = AppDataSource.getRepository(Product);
        //verificar se o id encaminhado existe
        const existeProduct = await productRepository.findOneBy({id: parseInt(id)});          
        //retornar mensagem de erro caso não encontrado
        if(!existeProduct){
            res.status(401).json({
                menssage: "Produto não encontrado por favor tente novamente!"                
            });
            return;
        };
        //deletar registro encontrado
        await productRepository.remove(existeProduct) 
        //retornar mensagem de sucesso apos deletar o registro
        res.status(200).json({
            menssage: "Produto deletado com sucesso!",
            product: existeProduct
        }) 
    }
    catch (error:any){
        console.log(error)
        res.status(500).json({
            menssage: "erro ao tentar delatar o produto selecionado"
        })
        
    };
});
export default router