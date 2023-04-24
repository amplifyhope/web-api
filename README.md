# Amplify Hope API

## Getting Started

### Setting up your environment

```bash
nvm install
yarn
```

Get a copy of `.env` from another engineer. There is also a `.env.example` you can reference.

### Running the project

```bash
nvm use
docker compose up -d
yarn start:dev
```

**NOTE:** `nvm use` is only necessary if your local node default is not version 16.

## Testing

### Unit Testing

To run the suite of unit tests run

```bash
yarn test:unit
```

This will find all test files with the `.unit.ts` suffix and run them.

## Deployment

This project is deployed via bitbucket pipeline, the pipeline configuration can be found at `./bitbucket-pipelines.yml`.

The pipeline will:

- Push a fresh docker image to docker hub.
- Remote into an EC2 instance and pull down the new image.
- Stop the current running container, then spin up a new container with the new image.

## Access

### Endpoints

- Local: <http://localhost:3002>
- Staging: <https://api-stage.amplifyhope.cc>
- Production: <https://api.amplifyhope.cc>

## Other Information

### Local Database

The database used in local development is run as a docker container and the details are configured in `./docker-compose.yml`.

This file looks for the `00_SCHEMA.sql` located at `src/init-db/00_SCHEMA.sql`.

If you need to add to or alter the database, you need to make changes to `00_SCHEMA.sql`.

### Scripts

- Format the entire project based on the `.prettierrc.json`.

  ```bash
  yarn format
  ```

- Check the project for type safety,

  ```bash
  yarn typecheck
  ```

### Links

- [Amplify Hope Website](https://amplifyhope.cc)
- [Docker Repo](https://hub.docker.com/r/agiannellah/ah-api)
