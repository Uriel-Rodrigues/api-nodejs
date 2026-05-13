//Importa a biblioteca Express
import express, {Request, Response, Router} from "express";
//importar conxão com banco de dados
import { AppDataSource } from "../data-source";
//importar a entidade
import { User } from "../entity/User";
//importar o serviço de paginação
import { PaginationService } from "../services/PaginationService";
//importar biblioteca para validar os dados antes de cadastrar e editar 
import * as yup from 'yup';
//biblioteca para fazer pesquisas de "diferente de"
import { Not } from "typeorm";
//importar biblioteca para criptografar senha
import bcrypt from "bcryptjs"
//imporat o middlewares de verificação
import { verifyToken } from "../middlewares/authMiddleware";

//criar a aplicação express
const router = express.Router()

//criar rota para LISTAR os registros de Usuarios (user) presentes no banco - verbo GET
router.get("/user", verifyToken,  async(req: Request, res: Response) => {
    try{
        //obter o repositorio da entidade User
        const userRepository = AppDataSource.getRepository(User)
        //recerber o numero da pagina e definir a pagina 1 como padrão
        const page =  Number(req.query.page) || 1
        //definir o numero de registros por pagina
        const limit =Number(req.query.limit) || 10
        //usar o serviso de paginação
        const result = await PaginationService.paginate(userRepository,page,limit,{id:"DESC"}, ["situation"])
        //retornar a resposta com os dados e informções da pagina
        res.status(200).json(result)
        return
    }
    catch(error){
        console.log(error)
        res.status(500).json({
            menssage: "erro ao listar registro de usuarios tente novamente"
        })
    }
})

//tota para VISUALIZAR um usuario especifico - verbo GET
router.get("/user/:id", async(req: Request, res: Response) => {
   try{
        //pegar id do usuario apartir da requisição
        const {id} = req.params
        //obter o repositorio da entidade User
        const userRepository = AppDataSource.getRepository(User)
        //buscar usuario no banco de dados pelo ID
        const user = await userRepository.findOne({
            relations: ["situation"],
            where: {id:parseInt(id)}

        })
        //verificar se o Ususario foi encontrado 
        if(!user){
            res.status(404).json ({
                menssage: "usuario não encontrado!"
            })
        } 
        //retornar o usuario encontrado
        res.status(200).json(user)
    }
    catch(error) {
        res.status(500).json({
            menssage: "erro ao carregar registro do usuario!"
        })
    }

})

//rota para CADASTRAR um usuario - verpo POST
router.post("/user/create",verifyToken, async (req: Request, res: Response) => {
    try {
        //receber os dados que vem no corpo da requisição
        var data = req.body 
        //fazer validação usando yup
        const schema = yup.object().shape({
            name: yup
            .string()
            .required("o campo nome é obrigatorio!")
            .min(3, "o nome deve ter no minimo 3 caracteres para ser valido"),
            email: yup
            .string()
            .required("o campo email é obrigatorio!")
            .email(),
            password: yup.string().required("o campo senha é obrigatorio!").min(6, "o campo deve ter no minimo 6 caracteres!"),
            situation: yup
            .number()
            .required("indique o id da situação")
        })
        //verificar de os dados passaram pela validação
        await schema.validate(data, {abortEarly: false}) 
        //capiturar repositorio 
        const userRepository = AppDataSource.getRepository(User)
        //bucar no repositorio um registro com o mesmo email
        const user = await userRepository.findOne({
            where: {email: data.email} 
        })
        //verificar se existe um registro com mesmo email
        if(user){
            res.status(201).json({
                menssage: "Nome de usuario em uso, tente outro"
            })
        }
        // //criptografar a senha antes de salvar
        // data.password = await bcrypt.hash(data.password,10)

        //criar um novo registro 
        userRepository.create(data)
        //salvar o registro
        const newUser = await userRepository.save(userRepository.create(data))
        //resposta de sucesso
        res.status(201).json({
            menssage: "novo usuario cadastrado com sucesso",
            user: newUser
        })

    }
    catch (error: any){
       if(error instanceof yup.ValidationError){
            res.status(400).json({
                menssage: error.errors
            })
            return
        }
        //retorna resposta de erro
        console.log(error);
        res.status(500).json({
            menssage: "erro ao cadastrar usuario"
        })
    }
})

//rota para EDITAR um registro - verbo PUT
router.put("/user/:id", async (req: Request, res:Response) => {
   try{
        //pegar o id que esta vindo da requisição
        const {id} = req.params
        //pegaros dados que vem do corpo 
        const data = req.body
        //verificar os dados usando yup
        const schema = yup.object().shape({
            name: yup
            .string()
            .required("o campo nome é obrigatorio")
            .min(3,"o campo nome deve ter no minimo 3 caracteres"),
            email: yup
            .string()
            .required("o campo email é obrigatorio")
            .email("digite um email valido"),
            situation: yup
            .number()
            .required("campo situação é obrigatorio!")
        })
        // verificar se os dados passaram pela 
        await schema.validate(data,{abortEarly: false})
        //obter repositodrio da entidade user
        const userRepository = AppDataSource.getRepository(User)
        //buscar dados pelo ID enviado 
        const user = await userRepository.findOneBy({id: parseInt(id)})
        //verificar se foi mencontrado o usuario
        if (!user){
            res.status(404).json({
                menssage: "erro usuario não encontrado"
            })
            return
        }
        //verificar se existe um usuario com o mesmo nome (excluindo o proprio registro)
        const existeUser = await userRepository.findOne({
            where: {
                email: data.email,
                id: Not(parseInt(id))
            }
        })

        if(existeUser) {
            res.status(400).json({
                menssage: "ja existe um usuario com esse email, tente outro"
            })
            return
        }
        //realizar alteração do registro
        userRepository.merge(user, data) 
        //salvar alteração
        const updateUser = await userRepository.save(user)
        // retornar mensagem de sucesso
        res.status(200).json({
            menssage: "registro atualizado com sucesso"
        })
    }

    catch(error: any){
        //retorna menssagem em cado de erro de validação
        if (error instanceof yup.ValidationError){
            res.status(400).json({
                menssage: error.errors
            })
            return
        }
        //retorna erro em caso de falha
        res.status(500).json({
            menssage: "erro ao editar registro de usuario"
        })
    }
})


//criar rota somente para EDITAR A SENHA VERBO PUT
router.put("/user/user-password/:id", async (req: Request, res:Response) =>{
    try {
        // pegar os dados que vem pela URL
        const {id} = req.params
        //pegar os dados do corpo
        const data = req.body 
        //fazer verificação com yup
        const schema = yup.object().shape({
            password: yup.string().required("o campo senha é obrigatorio").min(6, "o campo deve ter pelo menos 6 caracteres")
        })
        //verificar se passou pela verificação
        await schema.validate(data, {abortEarly: false})
        //obeter repositorio da entidade users
        const userRepository = AppDataSource.getRepository(User)
        //verificar se algum usuario existe com o id captado da URL
        const user = await userRepository.findOneBy({id:parseInt(id)})

        if(!user) {
            res.status(404).json({
                menssage: "usuario não encontrado!"
            })
            return
        }

        // //criptografar a senha
        // data.password = await bcrypt.hash(data.password, 10)
        
        //realizar a alteração do registro
        userRepository.merge(user, data)
        // salvar a alteração
        const updatPassword = await userRepository.save(user)
        //retornar mensagem de sucesso 
        res.status(200).json({
            menssage: "senha atualizada com sucesso!"
        })
        
    } catch (error:any) {
        //verifica se teve erro na validação 
        if(error instanceof yup.ValidationError){
            res.status(400).json({
                menssage:error.errors
            })
        }
        //retorna mensagem de erro
        res.status(500).json({
            menssage: "não foi possivel atualizar a senha do usuario, tente novamente"
        })
    }
} )


//criar rota para DELETAR registro -verbo DELETE
router.delete("/user/:id", async (req:Request, res: Response) => {
    try{
        // pegar os dados a partir do parametro
        const {id} = req.params
        //obter repositorio da entidade user
        const userRepository = AppDataSource.getRepository(User)
        //buscar o usuario no banco pelo id
        const user = await userRepository.findOneBy({id:parseInt(id)})
        // verificar se o usuario foi encontrado
        if(!user){
            res.status(404).json({
                menssage: "usuatio não encontrado!"
            })
            return
        }
        // deletar usuario
        await userRepository.remove(user)
        //mensagem de sucesso
        res.status(200).json({
            menssage: "usuario deletado com sucesso!",
            user: user
        })  

    }
    catch(error: any){
        //retornar mensagem de erro
        res.status(500).json({
            menssage: "erro ao deletar usuario" 
        })
    }
})

export default router