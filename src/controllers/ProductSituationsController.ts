//Importa a biblioteca Express
import express, { Request, Response} from "express";
//importar coneção com banco de dados
import { AppDataSource } from "../data-source";
//importar a entidade
import { ProductSituation } from "../entity/product_situations";
//impotando serviço de paginação
import { PaginationService } from "../services/PaginationService";
//importar biblioteca yup
import * as yup from 'yup';
import { Not } from "typeorm";
//importar verificação de token 
import { verifyToken } from "../middlewares/authMiddleware";


//criar a aplicação Express
const router = express.Router();

//criar rota para VISUALIZAR situação especifica de produdo
//endereço para acessar a apiatraves da aplicação externa com o vermo GET: http: 127.0.0.1:8080/product-situations/:id
router.get("/product-situations/:id",verifyToken, async (req: Request, res: Response) => {
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
// endereço para acessar a api atravez da aplicação externa com o verbo GET: http;//127.0.0.1:8080/product-situations?page=1&limit=10
router.get("/product-situations",verifyToken, async (req: Request, res: Response) => {
    try {
        //obtrer o repositorio a entidade product_situations
        const productSituationRepository = AppDataSource.getRepository(ProductSituation);
        //Receber o número da pagina e definir pagina 1 como padrão
        const page = Number(req.query.page) || 1;
        //definir o nuero de registros por pagina
        const limit = Number(req.query.limit) || 10;
        //aplicar o serviço de paginação 
        const result = await PaginationService.paginate(productSituationRepository,page,limit, {id: "DESC"})
        //retornar a resposta com os dados e informações da paginação 
        res.status(200).json (result)
    }
    catch (error){
        //retornar resposta de erro
        console.log(error);
        res.status(500).json({
            menssage: "erro ao listar situações"
        })
    }
});

//Criar rotar para CADASTRAR registros de situações de produtos ´resentes no banco
//req(rquisição), res(resposta)
router.post("/product-situations/create",verifyToken, async (req: Request, res: Response) => {
    //
    try{
        //receber os dados enviados no corpo da requisição
        var data = req.body

        //validar dados usando yup
        const schema = yup.object().shape({
            name: yup
            .string()
            .required("o campo 'nome' é pbrigatorio!")
            .min(3,"o campo precisa ter pelo menos 3 caracteres!")
        })
        //verificar se os dados passaram pela validação
        await schema.validate(data,{abortEarly:false} ) 

        // criar a product situation do repositorio
        const productSituationRepository = AppDataSource.getRepository(ProductSituation)
        
        // recuperar o valor do banco de dados com o valor da coluna name
        const existProductSituation = await productSituationRepository.findOne({
            where: {name: data.name}
        }) 
        //verificar se ja exite uma situação de produto com o mesmo nome
        if(existProductSituation){
            res.status(201).json({
                menssage: "ja existe uma situação de produto com esse nome!"
            })
            return;
        }

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
        //retornar mensagem em caso de erro na verificação
        if(error instanceof yup.ValidationError) {
            res.status(400).json ({
                menssage: error.errors
            });
            return;
        }
        //retornar resposta de erro
        console.log(error);
        res.status(500).json({
            menssage: "erro ao cadastrar situação de produto"
        })
    }
});

//criar rota para EDITAR registro usando PUT
//endereço para acessar API pela aplicação extena usando PUT: http://127.0.0.1:8080/product-situations/:id
router.put("/product-situations/:id", verifyToken, async(req: Request, res: Response) => {
    try{
        //capturandos requisições da URL
        var {id} = req.params
        //capturando requisições do corpo
        const data = req.body
        //validar dados usando yup
        const schema = yup.object().shape({
            name: yup
            .string()
            .required("o campo de 'nome' é obrigatorio")
            .min(3, "é necessario que o registro tenha pelo menos 3 caracteres")
        })
        //verificar se os dados passaram na verificação
        await schema.validate(data, {abortEarly:false})

        //obter repositorio da entidade productSituation
        const productSituationRepository = AppDataSource.getRepository(ProductSituation)
        //procurar situação pelo ID
        const productSituation = await productSituationRepository.findOneBy({id: parseInt(id)}) 
        //retornar mensagem caso registro n seja encontrado 
        if(!productSituation){
            res.status(404).json({
                menssage: "situação de produto não encontrada"
            });
            return;
        } 
        //verifiar se ja existe outra situação com o mesmo nome
        const existeSituation = await productSituationRepository.findOne({
            where: {
                name: data.name,
                id: Not(parseInt(id)) //desconsidera o id da propria busca 
            }
        })
        if(existeSituation) {
            res.status(400).json({
                menssage: "ja existe uma situação de produto com esse nome "
            })
            return
        }  
        //realizar alteração 
        productSituationRepository.merge(productSituation, data)
        //salvar alteração 
        const updateProductSituation = await productSituationRepository.save(productSituation) 
        //retornar mensagem se sucesso
        res.status(200).json ({
            menssage: "categoria de produto atualizada com sucesso",
            productSituation: updateProductSituation 
        }) 
    }
    catch(error){
    //mander mensagem de retorno caso tenha erro na verificação
        if(error instanceof yup.ValidationError){
            res.status(400).json ({
                menssage: error.errors
            })
            return;
        }
        console.log(error)
        res.status(500).json({
            menssage: "error ao modificar situação de produto"
        });
    }
})
//criar rota para DELETAR registros usando delete
//endereço para acessar API pela aplicação externa usando PUT: http://127.0.0.1:8080/situation/:id
router.delete("/product-situations/:id",verifyToken, async (req: Request, res:Response) => {
    try {
        //captar elemento da URL
        var {id} = req.params 
        //criar repositorio da entidade pruduct situation
        const productSituationRepository = AppDataSource.getRepository(ProductSituation)
        //verificar se existe registro pelo ID
        const productSituation = await productSituationRepository.findOneBy({id:parseInt(id)})
        //mensagem de retorno caso não encontrado
        if(!productSituation) {
            res.status(404).json({
                menssage: "erro situação de produto não encontrada"
            });
            return;
        };
        //deletar registro
        await productSituationRepository.remove(productSituation)
        //mensagem de sucesso 
        res.status(200).json({
            menssage: "situação de prosuto deletada com sucesso!"
        })
    }
    catch(erro){
        console.log(erro)
        res.status(500).json({
            menssage: "erro ao deletar situação de produto"
        })
    }
})

//exportar a instrução que está dentro da constante router 
export default router