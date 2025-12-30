
# 🚗 Fleetcom API — NestJS + MongoDB + JWT + RBAC + Docker
API desenvolvida para controle de usuários, veículos e reservas, com autenticação JWT, níveis de acesso (roles) e documentação via Swagger (ainda em andamento).

---

## 🧱 Tecnologias Usadas

Feita usando node v22.12.0

| Tecnologia | Uso |
|----------|-----|
| NestJS | Estrutura principal da aplicação |
| MongoDB + Mongoose | Banco de dados |
| JWT | Autenticação |
| RBAC (roles) | Permissões Admin/User |
| Docker & Docker Compose | Deploy containerizado |

---

## 📌 Features
✔ Cadastro, listagem, atualização e remoção de **usuários**  
✔ Roles `admin` e `user` com guard de autorização  
✔ CRUD de **veículos**  
✔ Sistema de **reservas** entre usuários e veículos  
✔ Login com JWT contendo `sub, email, nome, role`  
✔ Swagger documentado automaticamente  
✔ Projeto integrado via **Docker Compose**

---

## 🚀 Como rodar o projeto
### Rodar na pasta raíz

### 🔥 Modo desenvolvimento (hot reload)
```bash
docker compose -f docker-compose.dev.yml up --build
```

### 🏁 Produção (Estrutura a definir)
```bash
docker compose up --build -d
```

---

### 👮 Usuário Admin gerado automaticamente
Seed executado no boot da aplicação.

```json
{ "access_token": "jwt..." }
```

---

### 👤 Roles disponíveis
```ts
enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}
```

---

## 🔗 Swagger
Após iniciar o servidor:

http://localhost:3000/docs

