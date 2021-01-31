# Debts Management
Projeto backend para gerenciar dívidas.

## Pre Requisitos
1. Ter o docker instalado na máquina.

## Passos para rodar o projeto
1. Dentro da pasta backend/ executar o comando <code>docker-compose build</code> realizar o build do conatiner de backend.
3. Dentro da pasta api/ executar o comando <code>docker-compose up</code> após realizar o build do docker.
4. Executar o comando <code>docker exec -it livex-api bash</code> para acessar o docker.
7. No browser acesse http://localhost:5000/health, a mensagem "The server is up!" indica que o servidor está funcionando.

## Libs
* Sequelize: A promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server. It features solid transaction support, relations, eager and lazy loading, read replication and more.

* Body Parser: Node.js body parsing middleware.

## Rotas
