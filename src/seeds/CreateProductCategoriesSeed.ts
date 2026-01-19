import { DataSource } from "typeorm";
import { ProductCategory } from "../entity/product_categories";

export default class CreateProductCategoriesSeed {
    public async run(dataSource: DataSource): Promise<void> {
        console.log("iniciando o seed para a entidade 'ProductCategories'...")
        //obter o repositorio da entidade 'ProductCategories'
        const productCategoriesRepository = dataSource.getRepository(ProductCategory)
        //Verificar se existe algum cadastro na entidade
        const productCategoriesCont = await productCategoriesRepository.count()
        if (productCategoriesCont > 0){
            console.log ("a 'entidade Product_Category' ja possui dados cadastrados. Nenhuma alteração foi realizada")
            return;
        };
        //criar os registros que devem ser cadastrados na entidade 
        const productCategory = [
            {name: "Apartamento"},
            {name: "Casa"},
            {name: "Loja"}
        ];
        //salvar ps registros criados no banco de dados
        await productCategoriesRepository.save(productCategory)
        console.log("seed concluida com sucesso: categorias de produtos cadastradas")
    }
}; 