# BACK-END AutBot — Chatbot Inclusivo (MOBILE)
AutBot é uma ferramenta web/mobile com um chatbot acessível e empático, desenvolvido para apoiar pais, cuidadores, professores 
e profissionais da educação que interagem com pessoas com Transtorno do Espectro Autista (TEA).

## Objetivos
- Oferecer suporte informativo sobre rotinas, direitos e inclusão de pessoas com TEA.
- Reduzir barreiras digitais com uma interface clara e inclusiva.


## Funcionalidades Principais



## Tecnologias Utilizadas




## Arquitetura do Sistema (resumo)




## Como Executar o Projeto (localmente)
📦 1. Clonar o repositório
`      `
`      `


📦 2. Instalar as dependências
`npm install`



⚙️ 3. Configurar variáveis de ambiente




🗄️ 4. Configurar o Banco de Dados

Você pode rodar o banco de dados PostgreSQL de duas formas:
-  Execute o comando:
`docker-compose up -d`
Isso subirá um container com o PostgreSQL pronto para uso conforme as configurações definidas no docker-compose.yml.

Pra entrar no terminal do contêiner:
`docker exec -it autbot_postgres bash`

Para entrar no prompt do PostgreSQL:
`psql -U -d <nome_do_banco> (DE ACORDO COM O .ENV)`



🚀 5. Iniciar o projeto
`npm start`
