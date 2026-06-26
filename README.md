# Amplify Hope API

Node.js/Express backend for the Amplify Hope donation platform. Handles Stripe checkout, billing portal, magic-link authentication, and Stripe webhook processing.

## Getting Started

```bash
nvm install        # installs Node 24 from .nvmrc
yarn               # install dependencies
cp .env.example .env  # fill in values from a teammate
```

### Running locally

```bash
docker compose up -d   # starts local Postgres on port 5432
yarn start:dev         # ts-node-dev with hot reload
```

The API listens on port **3002**.

## Testing

```bash
yarn test:unit     # runs all *.unit.ts files with Mocha
yarn typecheck     # tsc --noEmit
yarn lint          # ESLint
```

## Deployment

Deployed via GitLab CI (`.gitlab-ci.yml`). Pipelines are triggered on pushes to `main`.

| Stage | Trigger | What it does |
|-------|---------|-------------|
| test | auto | unit tests + Snyk scan |
| build | auto (main only) | builds Docker image, pushes to Docker Hub |
| deploy:staging | auto (main only) | SSH to stage EC2, pulls image, restarts container |
| deploy:production | manual | SSH to prod EC2, pulls image, restarts container |

Containers run with `--restart unless-stopped` so they survive EC2 reboots.

After each deploy, `docker image prune -af` runs to prevent disk accumulation.

## Infrastructure

| Resource | Details |
|----------|---------|
| Compute | Single EC2 instance per environment (prod + stage), Docker container |
| Database | AWS RDS PostgreSQL — shared instance, separate DB per environment |
| Reverse proxy | nginx on the EC2 host, SSL via certbot/Let's Encrypt |
| Docker images | Docker Hub — `agiannellah/ah-api` |

## Endpoints

| Environment | URL |
|-------------|-----|
| Local | http://localhost:3002 |
| Staging | https://api-stage.amplifyhope.cc |
| Production | https://api.amplifyhope.cc |

### Routes

- `GET /health` — DB connectivity check (returns 503 if DB unreachable)
- `GET /products/:type` — Stripe products (one-time or recurring)
- `POST /checkout` — Create Stripe checkout session
- `GET /checkout-sessions/:id` — Fetch session status
- `POST /create-portal-session` — Stripe billing portal
- `POST /stripe-webhooks` — Stripe event handler
- `POST /login` — Send magic link via Resend
- `GET /verify` — Verify magic link JWT, redirect to billing portal

## Local Database

Runs as a Docker container (see `docker-compose.yml`). Schema lives at `src/init-db/00_SCHEMA.sql`. To reset:

```bash
yarn rebuild-db
```

## Useful Scripts

```bash
yarn format      # Prettier
yarn typecheck   # TypeScript check without emit
yarn build       # compile to build/src/ (used in Docker)
```

## Links

- [Frontend repo](https://gitlab.com/amplifyhope/ah-website-ui)
- [Docker Hub](https://hub.docker.com/r/agiannellah/ah-api)
- [Amplify Hope](https://amplifyhope.cc)
