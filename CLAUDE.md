# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn start:dev        # ts-node-dev with hot reload (port 3002)
yarn test:unit        # Mocha — runs all *.unit.ts files
yarn typecheck        # tsc --noEmit
yarn lint             # ESLint
yarn format           # Prettier
yarn build            # compile TS → build/src/ (used in Docker image)
yarn rebuild-db       # tear down and recreate the local Postgres container
docker compose up -d  # start local Postgres on port 5432 (required before yarn start:dev)
```

Node 24 is required (`.nvmrc`). Use `nvm install` to switch.

## Architecture

Express API (TypeScript) for the Amplify Hope donation platform. Three main concerns:

**Stripe** — checkout sessions, billing portal sessions, and a webhook handler that syncs Stripe product events to the local `stripe_products` table. The webhook route receives a raw body (not JSON-parsed) so Stripe's signature verification works. Stripe is instantiated inline in each controller rather than as a shared singleton.

**Magic-link auth** — `POST /login` sends a signed JWT via Resend email. `GET /verify` decodes the JWT, fetches the Stripe customer, creates a billing portal session, and redirects the user to it. There is no session/cookie layer; the JWT is the only auth token.

**Database** — PostgreSQL via a custom `Pool` wrapper in `src/config/db.ts` that auto-converts snake_case column names to camelCase on every query result. All DB write helpers use `buildUpsertQuery` / `buildDeleteQuery` from the same file. Schema lives in `src/init-db/00_SCHEMA.sql` and runs automatically when the Docker container is first created.

### Key patterns

- `getPool()` returns a lazy singleton; the pool is initialized on first call.
- DB query results come back as camelCase objects — no manual mapping needed.
- `buildUpsertQuery` / `buildDeleteQuery` accept camelCase input objects and convert keys to snake_case internally before building parameterized SQL.
- Config is centralized in `src/config/config.ts`; all env vars are read there. Access config elsewhere by importing that module.
- Sentry is initialized in `src/instrument.ts` and imported as the first line of `src/app.ts` so it captures all errors.

## Testing

Unit tests use Mocha + Chai and live alongside source files as `*.unit.ts`. There are no integration tests — the test suite runs without a database or Stripe connection.

## Deployment

GitLab CI deploys to EC2 via Docker. Pushes to `main` trigger automatic staging deploy; production is a manual gate. Docker image: `agiannellah/ah-api` on Docker Hub.
