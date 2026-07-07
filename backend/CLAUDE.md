# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository structure

```
portfolio/            ← Spring Boot backend (root)
└── src/main/java/tiago_ursich/portfolio/
    ├── model/        Projeto entity (JPA)
    ├── repository/   ProjetoRepository (Spring Data)
    ├── service/      ProjetoService
    ├── controller/   ProjetoController, AdminController
    ├── filter/       AdminAuthFilter (Bearer-token guard)
    └── config/       SecurityConfig, CorsConfig

frontend/             ← Next.js 14 (App Router)
└── src/
    ├── app/          layout.tsx, globals.css, page.tsx, admin/page.tsx
    └── lib/          api.ts (typed fetch wrappers)
```

## Backend commands

```bash
# Run (from repo root)
./mvnw spring-boot:run

# Build JAR
./mvnw clean package

# Run tests
./mvnw test

# Single test
./mvnw test -Dtest=PortfolioApplicationTests#contextLoads
```

Use `mvnw.cmd` on Windows instead of `./mvnw`.

## Frontend commands

```bash
cd frontend
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start
```

## Stack

**Backend:** Spring Boot 4.1.0, Java 17, Spring MVC, Spring Security, Spring Data JPA, Hibernate, PostgreSQL, Lombok.

**Frontend:** Next.js 14 (App Router), React 18, TypeScript, custom CSS only (no UI framework).

## API design

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | /api/projetos | public | list projects |
| POST | /api/projetos | Bearer token | create project |
| PUT | /api/projetos/{id} | Bearer token | update project |
| DELETE | /api/projetos/{id} | Bearer token | delete project |
| POST | /api/admin/login | public | verify password, returns token |

The "token" is the raw admin password. `AdminAuthFilter` checks `Authorization: Bearer <password>` on all non-GET `/api/projetos` requests. Spring Security is fully stateless (no sessions).

## Environment variables

**Backend** (`application.yaml` / system env):
- `DATABASE_URL` — JDBC URL (default: `jdbc:postgresql://localhost:5432/portfolio`)
- `DATABASE_USERNAME` / `DATABASE_PASSWORD`
- `ADMIN_PASSWORD` — admin panel password (default: `admin`)
- `CORS_ALLOWED_ORIGINS` — comma-separated origins (default: `http://localhost:3000`)

**Frontend** (`frontend/.env.local`):
- `NEXT_PUBLIC_API_URL` — backend base URL (default: `http://localhost:8080`)

## Local setup

1. Create a PostgreSQL database named `portfolio`.
2. Set env vars (or rely on defaults above).
3. Start backend: `./mvnw spring-boot:run` — Hibernate auto-creates the `projetos` table.
4. Start frontend: `cd frontend && npm install && npm run dev`.
5. Site: http://localhost:3000 — Admin: http://localhost:3000/admin.

## Design system

All CSS lives in `frontend/src/app/globals.css`. Key tokens (CSS vars): `--text-primary #1d1d1f`, `--text-secondary #6e6e73`, `--border #d2d2d7`, `--accent #0071e3`. Font stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Inter`. No external UI libraries — avoid adding Tailwind, Bootstrap, or similar.

Social link hrefs in `frontend/src/app/page.tsx` are placeholder URLs — update them to real profiles before deploying.
