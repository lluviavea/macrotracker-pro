setup:
    mise trust
    mise install
    npm install

db-start:
    docker compose up -d

db-stop:
    docker compose down

db-reset:
    docker compose down -v
    docker compose up -d
    sleep 2
    npx dotenv -e .env.local -- npx drizzle-kit push
    npx tsx lib/db/seed.ts

db-migrate:
    npx dotenv -e .env.local -- npx drizzle-kit push

db-seed:
    npx tsx lib/db/seed.ts

run:
    npx next dev

build:
    npx next build

start:
    npx next start

lint:
    npx eslint .

test:
    npx vitest run

typecheck:
    npx tsc --noEmit
