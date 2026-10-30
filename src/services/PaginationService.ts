import { Repository, ObjectLiteral, FindOptionsOrder } from "typeorm";

//Definir uma interface para o resultado da paginação, que será genérica e adaptavel a qualquer tipo de entidade
interface PaginationResult<T> {
    error: boolean,
    data: T[],
    currentPage: number,
    lastPage: number,
    totalRecords: number,
    relations?: string[] //permite passar expreções como array de strings
}

//Define uma classe de serviço para implementar a lógica de paginação
export class PaginationService{
    //Metodoestatico que realiza a paginação em qualquer repositorio generico
    static async paginate <T extends ObjectLiteral> (
        repository: Repository<T>,
        page: number = 1,
        limit: number = 10,
        order: FindOptionsOrder<T> = {},
        relations?: string[] //receber relations como array de string
    ): Promise <PaginationResult<T>>{

        //consta o total de registros no repositorio para determinar a quantidade total de paginas
        const totalRecords = await repository.count ()
        //calcular o numero da ultima pagina baseado no total de registros e no limite de registros por pagina
        const lastPage = Math.ceil(totalRecords/limit)
        //verificar se a pagina solicitada e valida; se não for, lançar um erro
        if(page > lastPage && lastPage > 0) {
            throw new Error (`pagina invalida total de paginas: ${lastPage}`)
        }
        //calcular o offcet (a partir de qual registro começa a busca)
        const offset = (page - 1) * limit
        //buscar os registros do repositorio  com base no limite, offset e ordem de classificação
        const data = await repository.find({
            take: limit,
            skip: offset,
            order: order,
            relations: relations // usar os relacionametos passados dinamicamente (1 ou mais tabelas)
        })
        //retornar o resultado da paginação em um formato estruturado 
        return {
            error: false,
            data: data,
            currentPage: page,
            lastPage: lastPage,
            totalRecords: totalRecords
        }
    }
}