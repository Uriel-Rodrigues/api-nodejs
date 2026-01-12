## Requisitos 
* Node.js 22 ou superior - conferir a versão: node - v
* Mysql 8 ou suoerior - conferir a versão: mysql --version

## como rodar o projeto baixado
Duplicar o arquivo ".env.exemple" e renomear para ".env" <br>
alterar no arquivo .env as credencias do banco de dados 
1 instalar todas as dependencias 
´´´
npm install
´´´
2- Compilar o arquivo TypeScript.
```
npx tsc
```
3- Excutar o arquivo gerado com node.js.
```
node dist/index.js
```
4- instalar a dependência para rodar processos simultaneamente
```
npm install --save-dev concurrently
``` 

5- compilar o arquivo TypeScript. Excutar o arquivo gerado.
```
npm run start:watch
```
Executar as migration para criar as tabelas no banco de dados.
```
npx typeorm migration:run -d dist/data-source.js
```


## Sequencia para criar o projeto 
1- Criar um novo arquivo packaje 
```
npm init
```

2- instalar o Express para gerenciar as requisições, rotas e URLs, entre outras funcionalidades 
```
npm install express (npm i express) 
```

3- Instalar os pacotes para suporte ao TypeScript
```
npm install --save-dev @types/express
npm install --save-dev @types/node
```

4- Inastalar o compilador de projeto com typescript e reiniciar o projeto quando o arquivo é modificado.123
```
npm install --save-dev ts-node
``` 

5- Gerar o arquivo de configuração para o TypeScript
```
npx tsc --init
```

6- Compilar o arquivo TypeScript.
```
npx tsc
```
7- Excutar o arquivo gerado com node.js.
```
node dist/index.js
```
comando para criar a base de dados 
```
CREATE DATABASE celke CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

instalar a dependencia para conectar o Node.js (TypeScript) com o banco de dados
```
npm install typeorm
```

biblioteca utilizada no typScript para adicionar metadados (informações adicionais) a classes
```
npm install reflect-metadata
```

instalar o drive do banco de dados MySQL
```
npm install mysql2
```

Manipular variaveis de ambiente.
```
npm install dotenv --save
```

instalar os tipos do TypeScript.
```
npm install --save-dev @types/dotenv
```

Criar a migrations que será usada para criar a tebale no banco de dados 
```
npx typeorm migration:create src/migration/<nome-da-migration>
```
```
npx typeorm migration:create src/migration/CreateSituationsTable
```

Executar as migration para criar as tabelas no banco de dados.
```
npx typeorm migration:run -d dist/data-source.js
```