//Importa a biblioteca Express
import express, {Request, response, Response} from "express";
//importar conxão com banco de dados
import { AppDataSource } from "../data-source";
//importar a entidade
import { Situation } from "../entity/situation";

//criar a aplicação Express
const router = express.Router();
// rota para visualizar uma situação especifica
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

//criar a rota para listar os registros de situações presentes no banco 
//endereço para acessar a api atraves da aplicação externa com o verbo GET: 
// http://127.0.0.1:8080/situations
router.get("/", async (req: Request, res: Response) => {
    try{
        //obter o repositorio da entidade situation
        const situationRepository = AppDataSource.getRepository(Situation);

        //recuperar todas as situações do banco de dados
        const situation = await situationRepository.find();

        //retornar as situações como resposta
        res.status(200).json(situation);

    }
    catch (erro){
        console.log(erro)
        res.status(500).json ({
            menssage: "error ao listar registros de situações"
        })
    }
});

//criar a porta POST principal
//req(rquisição), res(resposta)
router.post("/", async (req: Request, res: Response) => {
    try {
        //Receber os dados enviados no corpo da requisição 
        var data = req.body
        //Criar uma situação do repositorio de situation
        const SituationRepository = AppDataSource.getRepository(Situation)
        //criar um novo registo de situação (dados simulados)
        const newSituation = SituationRepository.create(data)
        //salvar o registro no banco de dados
        await SituationRepository.save(newSituation)
        //retornar resposta de sucesso
        res.status(201).json ({
            menssage: "Situação cadastrado com sucesso!",
            situation: newSituation
        });
    }
    catch (error){
        //retornar resposta de erro
        console.log(error);
        res.status(500).json({
            menssage: "erro ao cadastrar situação"
        });
    }
});

//criar rota para editar registros usando PUT
//endereço para acessar API pela aplicação externa usando PUT: http://127.0.0.1:8080/situation/:id
router.put("/:id", async (req: Request, res: Response) => {
    try{
        //receber dados da URL da requisição
        const {id} = req.params
        //receber dados do corpo da requisição
        const data = req.body
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
    catch(erro) {
        console.log(erro)
        res.status(500).json ({
            menssage: "erro situação não encontrada" 
        });
    }
})

//exportar a instrução que está dentro da constante router 
export default router