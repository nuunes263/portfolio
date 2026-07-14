# AGENTS.md

## Repositório

Portfolio pessoal — aplicação Spring Boot monolítica que serve páginas HTML com Thymeleaf e uma API REST.

## Estrutura

```
├── src/main/java/tiago_ursich/portfolio/
│   ├── model/          Projeto (JPA entity)
│   ├── repository/     ProjetoRepository (Spring Data)
│   ├── service/        ProjetoService
│   ├── controller/     ProjetoController, AdminController, PortfolioPageController, AdminPageController
│   ├── filter/         AdminAuthFilter (Bearer-token guard)
│   └── config/         SecurityConfig, CorsConfig
├── src/main/resources/
│   ├── templates/      index.html, admin.html (Thymeleaf)
│   └── static/
│       ├── css/globals.css
│       ├── js/app.js, admin.js
│       └── foto_perfil.jpeg
├── Dockerfile
├── docker-compose.yml
└── pom.xml
```

## Comandos

| Comando | Descrição |
|---------|-----------|
| `mvnw.cmd spring-boot:run` | Iniciar servidor (http://localhost:8080) |
| `mvnw.cmd clean package` | Build JAR |
| `mvnw.cmd test` | Rodar testes |
| `mvnw.cmd test -Dtest=PortfolioApplicationTests#contextLoads` | Teste único |
| `docker compose up -d` | Subir app + PostgreSQL |
| `docker compose down` | Parar containers |
| `docker compose down -v` | Parar e apagar volume do banco |

Usar `./mvnw` no Unix. Compilar com `JAVA_HOME` apontando para JDK 17.

## Setup local

1. Criar banco PostgreSQL chamado `portfolio`.
2. Configurar variáveis de ambiente (ou usar defaults).
3. `mvnw.cmd spring-boot:run` — Hibernate cria a tabela `projetos` automaticamente (`ddl-auto: update`).
4. Site: http://localhost:8080.
5. Admin: http://localhost:8080/admin.

## Docker

```bash
docker compose up -d          # sobe db + app na porta 8080
docker compose logs -f app    # acompanhar logs
docker compose down           # parar tudo (dados persistem)
docker compose down -v        # parar e destruir volume do banco
```

Para alterar a senha admin ou do banco, criar um `.env` na raiz:

```env
ADMIN_PASSWORD=senha-forte
DB_PASSWORD=outra-senha
```

## Variáveis de ambiente

Todas definidas em `application.yaml` com defaults:

| Variável | Default | Descrição |
|----------|---------|-----------|
| `DATABASE_HOST` | — | Host do PostgreSQL |
| `DATABASE_PORT` | — | Porta |
| `DATABASE` | — | Nome do banco |
| `DATABASE_USER` | — | Usuário |
| `DATABASE_PASSWORD` | — | Senha |
| `ADMIN_PASSWORD` | `admin` | Senha do painel admin |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:8080` | Origens CORS (separadas por vírgula) |

## API

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/api/projetos` | pública | Listar projetos (ordenado por `criadoEm` desc) |
| POST | `/api/projetos` | Bearer | Criar projeto |
| PUT | `/api/projetos/{id}` | Bearer | Atualizar projeto |
| DELETE | `/api/projetos/{id}` | Bearer | Excluir projeto |
| POST | `/api/admin/login` | pública | Login (retorna `{ token, ok }`) |

## Autenticação

Stateless (sem sessões). O "token" é a senha admin em texto puro:
- `POST /api/admin/login` recebe `{ "password": "..." }` e retorna `{ "token": "<admin-password>" }`.
- `AdminAuthFilter` exige `Authorization: Bearer <admin-password>` em requisições não-GET a `/api/projetos`.
- Admin frontend armazena o token em `localStorage`.

## Páginas

- **`/`** — `index.html`: hero com foto, links sociais, grid de projetos (carregados via JS → `/api/projetos`)
- **`/admin`** — `admin.html`: login → CRUD de projetos (JS vanilla)

Ambas usam Thymeleaf como template engine e JS vanilla para interatividade. Nenhuma dependência de framework frontend.

## Convenções de código

- **CSS**: `static/css/globals.css` — usar variáveis CSS existentes (`--text-primary`, `--accent`, etc.). **Não adicionar** Tailwind, Bootstrap ou qualquer framework UI.
- **Foto**: `static/foto_perfil.jpeg` (referenciada como `/foto_perfil.jpeg`).
- **Links sociais**: Hardcoded em `templates/index.html` — atualizar antes do deploy.
- **Tecnologias**: Separadas por vírgula na API. O frontend formata com `formatTech()` (junta com `·`).
- **Path**: API usa caminhos relativos (ex: `/api/projetos`) — mesma origem, sem CORS em produção.
- **Cache**: `fetch(…, { cache: 'no-store' })` para evitar dados obsoletos.
- **Lombok**: Usado (`@Data`, `@Builder`, `@RequiredArgsConstructor`).
- **Validação**: `@NotBlank` em campos obrigatórios (ex: `titulo`).
