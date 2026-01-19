import { DataSource } from "typeorm";
import { Situation } from "../entity/situation";

export default class CreateSituationSeed {
    public async run(dataSource: DataSource): Promise<void> {
        console.log("iniciando o seed para a tabela 'situations'...")
        //obter o repositorio da entidade 'situation'
        const situationRepository = dataSource.getRepository(Situation)
        //verificar se já existe registro na tabela
        const existingCount = await situationRepository.count();
        if(existingCount > 0){
            console.log("A tabela 'situations' ja possui dados. nenhuma alteração foi realizada");
            return;
        };
        //criar as situações que devem ser cadastradas no banco de dados
        const situation = [
            {nameSituation: "Ativo"},
            {nameSituation: "Inativo"},
            {nameSituation: "Pendente"}

        ];
        //salvar os registros no banco de daos 
        await situationRepository.save(situation) 
        console.log("seed concluida com sucesso: situações cadastradas!")
    }
};