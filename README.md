## Requisitos 
*Node.js 22 ou superior - conferir a versão: node - v

## como rodar o projeto baixado
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
