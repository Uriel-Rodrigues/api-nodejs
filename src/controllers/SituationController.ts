//Importa a biblioteca Express
import express, {Request, response, Response} from "express";
//importar conxão com banco de dados
import { AppDataSource } from "../data-source";
//importar a entidade
import { Situation } from "../entity/situation";
//importar o serviço de paginação
import { PaginationService } from "../services/PaginationService";
//importar biblioteca para validar os dados antes de cadastrar e editar 
import * as yup from 'yup';

//criar a aplicação Express
const router = express.Router();

//criar a rota para LISTAR os registros de situações presentes no banco 
//endereço para acessar a api atraves da aplicação externa com o verbo GET: 
// http://127.0.0.1:8080/situations?page=1&limit=10
router.get("/", async (req: Request, res: Response) => {
    try{
        //obter o repositorio da entidade situation
        const situationRepository = AppDataSource.getRepository(Situation);
        //Receber o número da pagina e definir pagina 1 como padrão 
        const page = Number(req.query.page) || 1;
        
        //definir o numero de registro por pagina
        const limit = Number(req.query.limit) || 10;

        //usar o serviço de paginação
        const result = await PaginationService.paginate(situationRepository,page,limit, {id: "DESC"})
        
        //retornar a resposta com os dados e informações da paginação
        res.status(200).json(result)
        return;
    }
    catch (erro){
        console.log(erro)
        res.status(500).json ({
            menssage: "error ao listar registros de situações"
        })
    }
});

// rota para VISUALIZAR uma situação especifica
//endereço para acessar a api atraves da aplicação externa com o verbo GET: 
//http:127.0.0.1:8080/situations/:id
router.get("/:id", async (req: Request, res: Response) => {
    try {
        //obter o id da situação a partir dos parametros de rquisição 
        const {id} = req.params;
        //obter o repositorio da entidade situations
        const situationRepository = AppDataSource.getRepository(Situation)
        //buscar a situação no banco de dados pelo ID
        const situation = await situationRepository.findOneBy({id: parseInt(id)});
        //verificar se a situação foi encontrada
        if(!situation){
            res.status(404).json({
                menssage: "situação não encontrada!"
            });
        }
        //retornar a situação encontrada
        res.status(200).json(situation);
        return;
    }
    catch (erro){
        console.log(erro)
        res.status(500).json({
            menssage: "error ao carregar a situação!"
        })
    }
});

//criar a porta para CADASTRAR REGISTROS verbo POST
//req(rquisição), res(resposta)
router.post("/", async (req: Request, res: Response) => {
    try {
        //Receber os dados enviados no corpo da requisição 
        var data = req.body
        //validar os dados utilizando o tup
        const schema = yup.object().shape({
            nameSituation: yup
            .string()
            .required("o campo 'nome' é obrigatorio!")
            .min(3, "o campo 'nome' deve conter no minimo 3 caracteres!")
        });
        //verificar se os dados passaram pela validação
        await schema.validate(data,{abortEarly:false});

        //Criar uma situação do repositorio de situation
        const situationRepository = AppDataSource.getRepository(Situation)

        //recuperar o registro do banco de dados com o valo da coluna nameSituation
        const existSituation = await situationRepository.findOne({
            where: {nameSituation: data.nameSituation}
        })

        //verificar se ja existe uma situação com o mesmo nome
        if(existSituation){
            res.status(201).json ({
                menssage: "ja existe uma situação cadastrada com esse nome!"
            });
            return;
        }

        //criar um novo registo de situação (dados simulados)
        const newSituation = situationRepository.create(data)
        //salvar o registro no banco de dados
        await situationRepository.save(newSituation)
        //retornar resposta de sucesso
        res.status(201).json ({
            menssage: "Situação cadastrado com sucesso!",
            situation: newSituation
        });
    }
    catch (error){
        //retornar mensagem de erro durante a validação
        if(error instanceof yup.ValidationError){
            //retornar error de validação
            res.status(400).json({
                menssage: error.errors
            });
            return;
        }

        //retornar resposta de erro
        console.log(error);
        res.status(500).json({
            menssage: "erro ao cadastrar situação"
        });
    }
});

//criar rota para EDITAR registros usando PUT
//endereço para acessar API pela aplicação externa usando PUT: http://127.0.0.1:8080/situation/:id
router.put("/:id", async (req: Request, res: Response) => {
    try{
        //receber dados da URL da requisição
        const {id} = req.params
        //receber dados do corpo da requisição
        const data = req.body
        //validadar dados usando o yup 
        const schema = yup.object().shape({
            nameSituation: yup
            .string()
            .required("campo 'nome' é obrigatorio para edição")
            .min(3, "o nome da situação precisa de pelomenos 3 caracteres") 
        });
        //verificar se os dados passaram pela validação
        await schema.validate(data,{abortEarly:false})  

        //obter repositorio da entidade situations
        const situationRepository = AppDataSource.getRepository(Situation)
        //buscar situação no banco de dados pelo ID
        const situation = await situationRepository.findOneBy({id:parseInt(id)})
        //verificar se a situação foi encontrada
        if(!situation){
            res.status(404).json ({
                menssage: "erro situação não encontrada"
            })
            return;
        }
        // realizar alteração do registro
        situationRepository.merge(situation, data)
        //salvar alteração
        const updateSituation = await situationRepository.save(situation)
        //retornar mensagem de sucesso
        res.status(200).json({
            menssage: "registro atalçizado com sucesso",
            situation: updateSituation
        });
    }
    catch(error) {
        //retonro de mensagem em casso de erro de validação
        if(error instanceof yup.ValidationError){
            res.status(400).json({
                menssage: error.errors
            })
            return;
        }

        console.log(erro)
        res.status(500).json ({
            menssage: "erro situação não encontrada" 
        });
    }
});

//criar rota para DELETAR registros usando delete
//endereço para acessar API pela aplicação externa usando PUT: http://127.0.0.1:8080/situation/:id
router.delete("/:id", async (req: Request, res: Response) =>{
    try {
        //obter informação pela URL
        var {id} = req.params
        //criar repositoio situation
        const situationRepository = AppDataSource.getRepository(Situation);
        //procuar situação pelo id
        const situation = await situationRepository.findOneBy({id:parseInt(id)});
        //verificar se existe
        if(!situation) {
            res.status(404).json({
                menssage: "situação não encontrada"
            });
            return;
        };
        //deletar situação
        await situationRepository.remove(situation)
        //mensagem de sucesso 
        res.status(200).json({
            menssage: "situação deletada com sucesso!",
            situation: situation
        });
    }
    catch (erro){
        console.log(erro)
        res.status(500).json({
            menssage: "erro ao apagar situação"
        });
    };
});


//exportar a instrução que está dentro da constante router 
export default router