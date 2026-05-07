import { DataSource } from "typeorm";
import { Product } from "../entity/products";
 
export default class CreateProductSeed {
    public async run (dataSource: DataSource): Promise <void>{
        console.log("iniciando seed para tabela 'Product'...");
        //adiquitir repositorio de Product
        const productRepository = dataSource.getRepository(Product);
        //verificar se existe cadastro na entidade Product
        const existeData = await productRepository.count();  
        //se existir retornar mensagem e parar seed
        if(existeData > 0) {
            console.log("ERRO - A tabela 'Product' ja possui dados. nenhuma alteração foi realizada")
            return;
        };
        
        //se não exitir, criar registros para salvar
        const products = [
            {
                name: "Deck Box",
                slug: "deck-box",
                description:"deck box para card game cabem ate 100 cartas slevadas",
                price: 100,
                situation: {id: 1},
                category: {id: 1} 
            },
            {
                name: "Porta Dados D20",
                slug: "porta-dados-D20",
                description: "porta dados (impressão 3D) cabem ate 3 sets de 7 dados",
                price: 30,
                situation: {id: 1},
                category: {id: 1}

            },
            {
                name:"Play Mat",
                slug: "play-mat",
                description:"play mat para card game 70x35 cm",
                price: 60,
                situation: {id: 1},
                category: {id: 1}
            }
        ] 
        //salvar registros no banco 
        await productRepository.save(products)
        //envia mensagem de sucesso 
        console.log("seed concluida com sucesso: produtos cadastrados!")
    }
}