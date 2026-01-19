import { AppDataSource } from "./data-source";
import CreateSituationSeed from "./seeds/CreateSituationSeed";
import CreateProductCategoriesSeed from "./seeds/CreateProductCategoriesSeed";
import CreateProductSituationSeed from "./seeds/CreateProductSituationSeed";

const runSeeds = async () => {
    console.log("Conectando ao banco de dados...");
    //inicializar a conexão com o banco de daos 
    await AppDataSource.initialize();
    console.log("banco de dados conectaso.");

    try{
        //criar uma instancia das classes de seed
        const situationSeed = new CreateSituationSeed();
        const productSituationSeed = new CreateProductSituationSeed();
        const productCategoriesSeed = new CreateProductCategoriesSeed();

        //executar as seeds
        await situationSeed.run (AppDataSource)
        await productSituationSeed.run (AppDataSource)
        await productCategoriesSeed.run (AppDataSource)
    }
    catch (error){
        console.error("error ao executar o seed: ", error);
    }
    finally{
        //fechar a conexão com o banco de dados 
        await AppDataSource.destroy();
        console.log("conexão com banco de dados encerrada.")
    }
};

runSeeds();