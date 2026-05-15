# TaskFlow — Backend

REST API powering the TaskFlow dashboard.

Frontend lives in a sibling repo: [`task-dashboard-frontend`](../task-dashboard-frontend).
That dev server proxies `/api/*` here.

---

## Features

### 1. Tasks API (`/api/tasks`)

| Endpoint | Purpose |
|---|---|
| `GET /api/tasks` | List with search, filter (`priority`, `status`, `tag`), pagination |
| `GET /api/tasks/:id` | Single task with assignees |
| `POST /api/tasks` | Create (201) |
| `PATCH /api/tasks/:id` | Partial update |
| `DELETE /api/tasks/:id` | Delete (204) |

| Sub-feature | Notes |
|---|---|
| Per-status pagination | `limit` is **per status**; response is up to `3 × limit` items — `totalPages` is taken from the busiest status |
| Title search | `q=` matches case-insensitively |
| Filter `All` | `priority=All`, `status=All`, `tag=All` are accepted and skip that filter |
| Wire enums | DB stores `TODO/IN_PROGRESS/DONE`, but the API exposes `"To Do" / "In Progress" / "Done"` (mapper layer) |
| Validation | Zod-validated query/body/params via `validate()` middleware |
| Errors | Structured JSON with `message` + optional `details` |

### 2. Users API (`/api/users`)

| Endpoint | Purpose |
|---|---|
| `GET /api/users` | List (used for assignee picker) |

### 3. Metrics API (`/api/metrics`)

| Endpoint | Purpose |
|---|---|
| `GET /api/metrics?date=YYYY-MM-DD` | 24 hourly points (3 series: green/orange/blue) for the requested day |

| Sub-feature | Notes |
|---|---|
| Default date | Omitting `date` returns today |
| Empty days | Missing rows are filled with `0` so the chart never breaks |
| Seed coverage | 38 days seeded by default (-30 / today / +7) |

### 4. Cross-cutting

| Item | Notes |
|---|---|
| Health | `GET /api/health` for readiness checks |
| CORS | `CORS_ORIGIN` is comma-separated; only listed origins allowed |
| Module layout | `routes → controller → service → schema → mapper` per feature |
| Express 5 compat | Validate middleware stashes parsed values on `res.locals` (req.query is read-only in Express 5) |

---

## Tech Stack

| Layer | Choice |
|---|---|
| Runtime | Node.js 24 (LTS-class) |
| Framework | Express 5 |
| Language | TypeScript (ESM, `verbatimModuleSyntax`, strict) |
| ORM | Prisma 7 with the `PrismaPg` adapter (config in `prisma.config.ts`) |
| Database | PostgreSQL 16 (Docker for local dev) |
| Validation | Zod |
| Dev runner | `tsx` watch mode |
| Config | `dotenv` + Zod-validated `env.ts` |

---

## Getting Started

```bash
# 1. Install
npm install

# 2. Env
cp .env.example .env

# 3. Database (Docker)
docker compose up -d

# 4. Migrate + seed (5 users, 20 tasks, 38 days of metrics)
npm run db:migrate
npm run db:seed

# 5. Run dev server
npm run dev
```

API is now at `http://localhost:3000/api/*`. The frontend Vite proxy targets this URL.

### Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Watch mode (`tsx`) |
| `npm run build` | Compile to `dist/` |
| `npm start` | Run compiled output |
| `npm run typecheck` | Type-check without emitting |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:reset` | Drop & re-migrate (destructive) |

### Environment

| Variable | Default | Use |
|---|---|---|
| `DATABASE_URL` | postgres://… | Prisma connection (Docker uses port `5433`) |
| `PORT` | `3000` | Express listen port |
| `CORS_ORIGIN` | `http://localhost:5173,...` | Allowed FE origins (comma-separated) |
| `NODE_ENV` | `development` | Env mode |

> Note: docker-compose maps Postgres to `5433` (host) → `5432` (container) to avoid clashing with a local Postgres install.

---

## Architecture

### Folder structure

```
task-dashboard-backend/
├── prisma/
│   ├── schema.prisma          # data model
│   ├── migrations/            # generated
│   └── seed.ts                # mirrors FE fixtures + 38 days of metrics
├── src/
│   ├── config/
│   │   ├── env.ts             # zod-validated env
│   │   └── prisma.ts          # PrismaClient + PrismaPg adapter
│   ├── modules/
│   │   ├── tasks/
│   │   │   ├── task.routes.ts
│   │   │   ├── task.controller.ts
│   │   │   ├── task.service.ts
│   │   │   ├── task.schema.ts
│   │   │   ├── task.mapper.ts # Prisma ↔ wire types
│   │   │   └── task.types.ts
│   │   ├── users/
│   │   └── metrics/
│   ├── middlewares/
│   │   ├── errorHandler.ts
│   │   └── validate.ts        # zod request validator (res.locals strategy)
│   ├── utils/
│   │   └── ApiError.ts
│   ├── app.ts                 # Express factory
│   └── server.ts              # entry point
├── docker-compose.yml         # postgres:16-alpine on port 5433
├── prisma.config.ts           # Prisma 7 config (adapter + migrations path)
└── .env.example
```

### Module pattern (per feature)

Each feature folder has the same role split:

| File | Role |
|---|---|
| `*.routes.ts` | `Router`, mounts middleware (`validate(...)`), calls controller |
| `*.controller.ts` | Parses request, calls service, sends response — **no business logic** |
| `*.service.ts` | Prisma queries + domain logic — pure (no Express types) |
| `*.schema.ts` | Zod schemas for body/query/params |
| `*.mapper.ts` | Prisma row ↔ wire-type conversion (never expose Prisma enums) |
| `*.types.ts` | Wire types (literal strings matching the frontend) |

### Conventions

- **ESM imports use `.js` extension** even for `.ts` files: `import { env } from './config/env.js'`.
- **Never expose Prisma enums** in API responses — always go through the mapper.
- **All inputs validated** via zod through the `validate({ body, query, params })` middleware.
- **Throw `ApiError`** (not raw `Error`) so the error handler can return correct HTTP status.
- **`prisma` singleton** is in `@/config/prisma`.
- See [AGENTS.md](AGENTS.md) for the AI-agent-oriented context.
