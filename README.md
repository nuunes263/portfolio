<div align="center">
  <h1>📂 Portfolio</h1>
  <p>
    <strong>Portfolio pessoal — Spring Boot + Thymeleaf + PostgreSQL</strong>
  </p>
  <p>
    <img src="https://img.shields.io/badge/Java-17-%23ED8B00?logo=openjdk&logoColor=white" />
    <img src="https://img.shields.io/badge/Spring_Boot-4.1-%236DB33F?logo=springboot&logoColor=white" />
    <img src="https://img.shields.io/badge/Thymeleaf-%23005C0F?logo=thymeleaf&logoColor=white" />
    <img src="https://img.shields.io/badge/PostgreSQL-16-%234169E1?logo=postgresql&logoColor=white" />
    <img src="https://img.shields.io/badge/Docker-Compose-%232496ED?logo=docker&logoColor=white" />
  </p>
</div>

<br />

Aplicação web monolítica que serve um portfólio interativo com painel admin para CRUD de projetos.

---

## ✨ Funcionalidades

- **Página pública** — grid de projetos com fotos, descrição (com "Ver mais" para textos longos) e links
- **Painel admin** — login com senha, CRUD completo de projetos, upload de imagem do computador
- **API REST** — endpoints JSON para integração
- **Autenticação stateless** — token baseado em senha admin via `Authorization: Bearer`
- **Docker** — ambiente completo com PostgreSQL via `docker compose`

---

## 🚀 Começar

### Local (sem Docker)

```bash
# 1. Criar banco PostgreSQL
createdb portfolio

# 2. Configurar variáveis de ambiente (ou usar defaults)
export DATABASE_HOST=localhost
export DATABASE_PORT=5432
export DATABASE=portfolio
export DATABASE_USER=postgres
export DATABASE_PASSWORD=postgres
export ADMIN_PASSWORD=admin

# 3. Iniciar
./mvnw spring-boot:run   # Linux/macOS
mvnw.cmd spring-boot:run # Windows

# 4. Abrir http://localhost:8080
```

### Docker

```bash
docker compose up -d
docker compose logs -f app
```

Acessar http://localhost:8080. Admin em http://localhost:8080/admin.

---

## 🐳 Docker Compose

| Serviço | Imagem | Porta |
|---------|--------|-------|
| `app`   | build local (`Dockerfile`) | `8080` |
| `db`    | `postgres:16-alpine`       | `5432` |

Para personalizar senhas, criar `.env`:

```env
ADMIN_PASSWORD=senha-forte
DB_PASSWORD=outra-senha
```

---

## 📡 API

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `GET`    | `/api/projetos`       | ❌ | Listar projetos |
| `POST`   | `/api/projetos`       | ✅ Bearer | Criar projeto |
| `PUT`    | `/api/projetos/{id}`  | ✅ Bearer | Atualizar projeto |
| `DELETE` | `/api/projetos/{id}`  | ✅ Bearer | Excluir projeto |
| `POST`   | `/api/projetos/upload`| ✅ Bearer | Upload de imagem |
| `POST`   | `/api/admin/login`    | ❌ | Login (retorna token) |

A autenticação usa a senha admin como token em texto puro. Exemplo:

```bash
curl -X POST /api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"admin"}'
# → { "token": "admin", "ok": true }

curl -X POST /api/projetos \
  -H "Authorization: Bearer admin" \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Meu Projeto","descricao":"...","tecnologias":"Java, Spring"}'
```

---

## 🔧 Variáveis de ambiente

| Variável | Default | Descrição |
|----------|---------|-----------|
| `DATABASE_HOST` | `localhost` | Host do PostgreSQL |
| `DATABASE_PORT` | `5432` | Porta |
| `DATABASE` | `portfolio` | Nome do banco |
| `DATABASE_USER` | `postgres` | Usuário |
| `DATABASE_PASSWORD` | — | Senha |
| `ADMIN_PASSWORD` | `admin` | Senha do painel admin |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:8080` | Origens CORS |

---

## 🗂 Estrutura

```
├── src/main/java/tiago_ursich/portfolio/
│   ├── controller/       REST + page controllers
│   ├── service/          Regras de negócio
│   ├── repository/       Spring Data JPA
│   ├── model/            Entidade Projeto
│   ├── filter/           Filtro de autenticação
│   └── config/           Security, CORS, Web
├── src/main/resources/
│   ├── templates/        index.html, admin.html (Thymeleaf)
│   └── static/
│       ├── css/globals.css
│       ├── js/app.js, admin.js
│       └── foto_perfil.jpeg
├── Dockerfile
├── docker-compose.yml
└── pom.xml
```

---

## 🛠 Stack

| Categoria | Tecnologia |
|-----------|-----------|
| **Linguagem** | Java 17 |
| **Framework** | Spring Boot 4.1 |
| **Template** | Thymeleaf |
| **Frontend** | CSS vanilla + JS vanilla (zero frameworks) |
| **Banco** | PostgreSQL 16 |
| **ORM** | Hibernate / JPA |
| **Auth** | Bearer token (custom filter) |
| **Build** | Maven Wrapper |
| **Container** | Docker + Compose |

---

<div align="center">
  <p>
    <a href="https://linkedin.com/in/tiago-ursich">LinkedIn</a>
    ·
    <a href="https://github.com/nuunes263">GitHub</a>
    ·
    <a href="https://instagram.com/nuursich">Instagram</a>
  </p>
</div>
