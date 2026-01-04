# 🚗 Sistema de Reservas de Veículos

Projeto desenvolvido para teste técnico da Happmob.


------------------------------------------------------------------------

# ▶ Como Executar o Projeto

## 📌 Requisitos

-   Docker\
-   Docker Compose
-   **Adicionar os arquivos .env na pasta raiz (Fleetcom) e na pasta da api (Fleetcom-api)**

------------------------------------------------------------------------

## 🐳 Execução com Docker 

#### (Ambiente de Desenvolvimento)

Build:

``` bash
docker compose -f docker-compose.dev.yml build
```

Para iniciar todos os serviços em modo de desenvolvimento:

``` bash
docker compose -f docker-compose.dev.yml up
```

Ou, se preferir rodar em segundo plano:

``` bash
docker compose -f docker-compose.dev.yml up -d
```

##### Para criar o usuários de teste e os primeiros dados rode (após subir a docker DEV):

``` bash
docker compose -f docker-compose.dev.yml exec fleetcom-api npx prisma db seed
```

#### (Ambiente de Produção Unificado)

Build:

``` bash
docker compose build
```

Para iniciar todos os serviços:

``` bash
docker compose up
```

Ou, se preferir rodar em segundo plano:

``` bash
docker compose up -d
```

Após subir os serviços:

-   **Frontend** disponível em:\
    👉 http://localhost:4200

-   **API** disponível em:\
    👉 http://localhost:3000/

-   **DOC API** disponível em:\
    👉 http://localhost:3000/docs

-   **MongoDB** disponível internamente no Docker


------------------------------------------------------------------------

## 🌱 Seed Inicial

Ao iniciar a API:

-   Um usuário **administrador padrão** é criado automaticamente
-   Um conjunto inicial de veículos também é inserido

### 👤 Credenciais do usuário admin

    email: disponível no .env
    senha: disponível no .env
------------------------------------------------------------------------


## 📘 Descrição do Projeto

Este projeto consiste em um **Sistema de Reservas de Veículos**,
permitindo que usuários:

-   Criem conta e façam autenticação
-   Visualizem veículos disponíveis
-   Realizem e liberem reservas
-   Consultem suas próprias reservas

O escopo solicitado contempla:

-   **Frontend** → Angular 18\
-   **Backend** → Node.js + TypeScript + MongoDB\
-   **Autenticação** utilizando JWT\
-   **Ambiente unificado com Docker**

------------------------------------------------------------------------

## 🛠 Tecnologias Utilizadas

### **Backend**

-   Node.js 22
-   TypeScript 5.7
-   NestJs
-   JWT
-   Mongoose (MongoDB)
-   Bcrypt
-   Multer
-   Docker
-   Swagger

### **Frontend**

-   Angular 18
-   RxJS
-   Docker

### **Infraestrutura**

-   Docker Compose (ambiente dev com hot-reload)
-   MongoDB

------------------------------------------------------------------------

## 🧩 Arquitetura

O projeto está organizado em três serviços principais:

    /api        → Backend Node + TypeScript
    /frontend   → Aplicação Angular
    /mongo      → Base de dados MongoDB
    docker-compose.dev.yml  → Sobe os três serviços simultaneamente

O arquivo `docker-compose.dev.yml` faz o build de cada container e
inicia:

-   MongoDB\
-   API\
-   Frontend (Angular)

Com hot-reload habilitado (modo desenvolvimento).

------------------------------------------------------------------------

## ✔ Funcionalidades Implementadas

-   Algumas aindanão estão presentes no APP !

### 🔐 Autenticação

-   Login de usuário (rota pública)
-   Proteção com JWT em todas as demais rotas

### 👤 Usuários

-   Cadastro
-   Edição
-   Remoção (API)

### 🚗 Veículos (API)

-   Cadastro
-   Edição
-   Remoção
-   Listagem
-   Seed inicial automático

### 📄 Reservas

-   Criar reserva
-   Liberar reserva
-   Listar reservas de um usuário logado
-   Listagem (API)

------------------------------------------------------------------------

## 🧠 Regras de Negócio

-   Todas as rotas, exceto login, exigem **token JWT**
-   Um veículo **não pode ser reservado se já estiver reservado**
-   Um usuário **não pode ter mais de um veículo reservado por vez**

------------------------------------------------------------------------

# 🔗 Endpoints Disponíveis no README da API


------------------------------------------------------------------------

# ⚠ Limitações Conhecidas

-   A visualização de ADMIn ainda não foi implementada no front.

------------------------------------------------------------------------

# 🚀 Melhorias Futuras

-   Criar painel administrativo completo (gerenciar usuários, veículos e reservas)
-   Adicionar testes de integração e unidade na API com JEST
-   Criar versão de produção dos containers
-   Melhorar documentação Swagger
-   Otimizar design system no front e fidelidade ao disign do Figma em alguns pontos
-   Image cropper
