# space_diplomacy

Retro 3D Space clone of Diplomacy

## Development

### Backend

#### One time setup

Create a `.env` file (copy from the sample). This is gitignored and contains local secrets

[read more](./js_backend/README.md)

```sh
cd js_backend
npm ci
docker compose up -d  # to run local mongodb
npm run dev
```

And

```sh
docker compose down  # to stop local mongodb
```

### Frontend

```sh
cd frontend
npm ci
npm run dev
```

## TODO's

-   Comms to backend
-   Backend to DB comms
-   Auth
-   Deployment
-   Game flow
-   Agree on game state representation
-   Adjudicator function
-   Break this down further
