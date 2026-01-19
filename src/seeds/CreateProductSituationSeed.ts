import { DataSource } from "typeorm";
import { ProductSituation } from "../entity/product_situations";

export default class CreateProductSituationSeed {
    public async run (dataSource: DataSource): Promise <void>{
        console.log ("iniciando o seed para a tabela 'product_situation'...")
        //obter o repositorio da entidade
        const productSituationRepository = dataSource.getRepository(ProductSituation)
        //verificar se existe cadastros na entidade
        const ProductSituationCount = await productSituationRepository.count()
        if(ProductSituationCount > 0){
            console.log("Entidade 'product_Situation'já possui dados cadastrados: nenhuma alteração foi realizada")
            return;
        }
        //criar registros a serem cadastrados 
        const productSituation = [
            {name:"disponivel"},
            {name:"alugado"},
            {name:"reservado"}
        ];
        //salvar registro no banco de dados
        await productSituationRepository.save(productSituation)
    } 
};