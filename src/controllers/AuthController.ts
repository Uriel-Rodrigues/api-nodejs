//Importa a biblioteca Express
import express, {Request, Response} from "express";
//imprtar validação com yup
import * as yup from "yup"
//importar serviço de autenticação, responsavel por validar o login do usuario 
import { AuthService } from "../services/AuthService";
//importar conexão com o banco de dados 
import { AppDataSource } from "../data-source";
//importar a entidade user
import { User } from "../entity/User";
//importar biblioteca para genrar a chave recuperar a senha
import crypto from "crypto"

import bcrypt from "bcryptjs"
//importa a biblioteca para enviar email 
import nodemailer from "nodemailer"
import { verifyToken } from "../middlewares/authMiddleware";


//criar a aplicação Express
const router = express.Router();

//criar rota para realizar o login 
//endereço para acessar a api atraves da aplicação externa com o verbo POST: http:localhost:8080/
//aplicção externa deve indicar que esta enciando os dados em forma de objeto: Content-Type: application/json
//dados em formato de objeto 
/*
    "email":"user@email.com.br"
    "password":"123456A#s"
*/
router.post("/auth", async (req: Request, res: Response) => {
    try {
        //recuperar o dados que vem atraves do corpo da requisição
        const {email, password} = req.body
        //verificar se os dados foram encaminhados
        if(!email || !password) {
            res.status(400).json({
                menssage: "E-mail e senhas são obrigatorios!"
            })
            return;
        }
        
        //criar uma instancia do serviço de autenticação
        const authService = new AuthService()
        //chamar o metodo login para validar as credenciais e obter os dados do usuario
        const userData = await authService.login(email, password)


        //retorna mensagem de sucesso 
        res.status(200).json({
            menssage:"login realizado com sucesso!",
            user: userData
        })
    }
    catch (error: any) {
        res.status(401).json({
            menssage: error.menssage || "usuario e ou senha invalidos!"
        })
        return;
    }
});

//criar rota para validar o token 
//endereço para acessar a api atraves da aplicação esterna com verbo GET:
//http://localhost:8080/validate-token
//enviar o bearer token do usuario logado, exemplo: bearer <colocar-o-token-gerado-com-jwt>
router.get("/validate-token", verifyToken, (req: Request, res:Response) => {
    res.status(200).json({
        menssage: "token valido!",
        userId: (req as any).user.id //o id do usuario autenticado 
    })
})

//criar rota para recuperar a senha 
//endereço para acessar a API da aplicação exterrna com o verbo post 
//a aplicação externa deve indicar que esta enviando os dados em formato de objeto->  content-type: application/json
//dados em forma de objeto
/*
{
    "urlRecoverPassword":"http://localhost",
    "email": "usuario@email.com.br"
} 
*/ 
router.post("/recover-password", async (req:Request, res:Response ) => {
    try{
        //capturar os dados do corpo da requisição
        const data = req.body
        //validar os dados pelo yupe
        const schema = yup.object().shape({
            urlRecoverPassword: yup
                .string()
                .required("o campo nome é obrigatorio!")
                .min(3, "o nome deve ter no minimo 3 caracteres para ser valido"),
            email: yup
                .string()
                .required("o campo email é obrigatorio!")
                .email(),
        })
        //verificar se os dados passaram pela validação
        await schema.validate(data,{abortEarly:false})
        //pegar o repositorio da entidade user
        const userRepository = AppDataSource.getRepository(User)
        //verificar se existe o usuario dentro do banco pelo email
        const existUser = await userRepository.findOneBy({email:data.email})
        //verificar se os dados foram encontrados
        if(!existUser) {
            res.status(404).json({
                menssage: "Usuario não encontrado!"
            })
            return
        } 

        //gerar um token seguro de 65 caractes
        existUser.recoverPassword = await crypto.randomBytes(32).toString("hex")
        //salvar as alterações no banco
        await userRepository.save(existUser) 

        //Criar a variaveis com as credencias do servidoro para enviar email
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
        });

        //criar variavel com conteudo do email 
        var menssage_content = {
            from: process.env.EMAIL_FROM, // sender address
            to: data.email, // list of recipients
            subject: "Recuperar Senha", // subject line

            text: `presado ${existUser.name}\n\n informamos que sua solicitação de alteração de senha foi recebida com sucesso. \n\n clique ou copie o link para criar uma nova senha em nosso sistema: ${data.urlRecoverPassword}?email=${data.email}&key=${existUser.recoverPassword} \n\n esta mensagem foi encaminhada pela empresa ${process.env.APP}.`, // conteudo do email somente texto
            
            html:`presado ${existUser.name}<br><br> informamos que sua solicitação de alteração de senha foi recebida com sucesso. <br><br> clique ou copie o link para criar uma nova senha em nosso sistema: <a href='${data.urlRecoverPassword}?email=${data.email}&key=${existUser.recoverPassword}'>${data.urlRecoverPassword}?email=${data.email}&key=${existUser.recoverPassword}</a> <br><br> esta mensagem foi encaminhada pela empresa ${process.env.APP}.`, // conteudo do email em HTML
        };

        //enviar email
        transporter.sendMail(menssage_content, function (erro){
            if(erro){
                //retornar resposta de erro 
                res.status(200).json({
                    menssage: `email não enviado, tente novamente ou contate ${process.env.EMAIL_ADM}`
                })
                return
            }
            else{
                //retorna resposta de sucesso
                res.status(200).json({
                    menssage:"email encaminhado com sucessso verifique sua caixa de entrada",
                    urlRecoverPassword: `${data.urlRecoverPassword}?email=${data.email}&key=${existUser.recoverPassword}`
                    })
                }
                return
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

//criar rota para validar a chave para recuperar a senha 
//endereço para acessar a API da aplicação exterrna com o verbo post: http://localhost:8080/validate-recover-password 
//a aplicação externa deve indicar que esta enviando os dados em formato de objeto->  content-type: application/json
//dados em forma de objeto
/*
{
    "recoverPassword":"chave-recuperar-senha",
    "email": "usuario@email.com.br"
}
*/

router.post("/validate-recover-password", async (req: Request, res: Response) => {
    try {
        //pegar os dados que vem da requisição 
        const data = req.body
        //validar os dados usando a biblioteca yup
        const schema = yup.object().shape({
            recoverPassword: yup.string().required("a chave é obrigatoria!"),
            email: yup.string().email("E-mail obrigatorio!").required("o email é obrigatorio")
        })
        //verificar se os dados recebidos passaram na verificação
        await schema.validate(data,{abortEarly:false})
        //capturar repositorio do usuario 
        const userRepository = AppDataSource.getRepository(User)
        //verificar se o usuario existe dentro do banco de dados
        const existUser = userRepository.findOneBy({email:data.email, recoverPassword: data.recoverPassword})

        if(!existUser) {
            //retornar mensagem de não encontrado 
            res.status(404).json({
                menssage: "chave para recuperar senha invalida!"
            })
        }
        //retornar mensagem de sucesso 
        res.status(200).json({
            menssage:"chave para alterar senha valida!"
        })
        return
    }
    catch (error:any){
        //verificar se possui erro na validação
        if (error instanceof yup.ValidationError) {
            res.status(400).json({
                menssage:error.errors
            })
            return
        }
        //encaminhar menssagem generica de erro 
        res.status(401).json({
            menssage:"chave de autenticação de senha invalida!"
        })

    }
})

//criar rota para atualizar a senha e apagar achave do banco 
//endereço para acessar a API da aplicação exterrna com o verbo put: http://localhost:8080/update-password 
//a aplicação externa deve indicar que esta enviando os dados em formato de objeto->  content-type: application/json
//dados em forma de objeto
/*
{
    "recoverPassword":"chave-recuperar-senha",
    "email": "usuario@email.com.br"
    "password": "123456A#s"
}
*/

router.put("/update-password", async (req: Request, res: Response) => {
    try{
        //captar os dados quem vem do corpo da requisição
        const data = req.body
        //validar dados recebidos com yup
        const schema = yup.object().shape({
            recoverPassword: yup.string().required("a chave é necessaria!"),
            email: yup.string().email("email é obrigatorio!").required("o campo email é obrigatorio!"),
            password: yup.string().required("obrigatorio fornecer a nova senha").min(6, "o campo deve ter no minimo 6 caracteres")
        })
        //verificar se os dados passaram na verificação
        await schema.validate(data,{abortEarly:false})
        //obter o repositorio da entidade user
        const userRepository = await AppDataSource.getRepository(User)
        //verificar se o usuario realmente existe no banco de dados
        const existUser = await userRepository.findOneBy({email:data.email, recoverPassword:data.recoverPassword})
        //verificar se o usuario foi encontrado
        if(!existUser){
            res.status(404).json({
                menssage: "usuario não encontrado!"
            })
            return
        }

        //verificar se a nova senha é igual a ntiga
        const mesmaSenha = await bcrypt.compare(data.password, existUser.password)
        if (mesmaSenha){
            res.status(401).json({
                menssage: "a nova senha não pode ser igual a antiga!"
            })
            return
        }

        //deletar a chave de verificação gravada dentro do banco de dados
        data.recoverPassword = null
        //atualizar os dados no banco de dados
        userRepository.merge(existUser, data)
        //salvar os dados no banco
        await userRepository.save(existUser)

        //mensagem de sucesso 
        res.status(200).json({
            menssage: "senha atualizada com sucesso!"
        })
    }
    catch (error:any){
        if(error instanceof yup.ValidationError){
            res.status(401).json({
                menssage: error.errors
            })
            return
        }
    //encaminhar mensagem generica de erro 
    res.status(401).json({
        menssage: "Erro senha não atualizada!"
    })
    }
})

//exportar a instrução que está dentro da constante router 
export default router