# task-dashboard-backend

REST API for the TaskFlow dashboard (DEVDEVA Fullstack take-home test).

Companion repo: [`task-dashboard-frontend`](../task-dashboard-frontend)

## Tech Stack

- Node.js 24 + TypeScript (ESM)
- Express 5
- Prisma + PostgreSQL 16
- Zod (validation)

## Getting started

```bash
# 1. Install
npm install

# 2. Copy env
cp .env.example .env

# 3. Start database
docker compose up -d

# 4. Migrate + seed
npm run db:migrate
npm run db:seed

# 5. Run dev server
npm run dev
```

API available at `http://localhost:3000/api/*`.

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Watch mode (tsx) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled output |
| `npm run typecheck` | Type-check without emitting |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:reset` | Drop & re-migrate (destructive) |

## Project Structure

See [AGENTS.md](AGENTS.md) for full conventions, folder layout, and contract.
