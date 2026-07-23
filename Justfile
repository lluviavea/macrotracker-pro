setup:
    mise trust
    mise install
    npm install
    hk install --mise
    @if [ ! -f .env.local ]; then cp .env.example .env.local && echo "Created .env.local from .env.example"; fi
    docker compose up -d
    @echo "Waiting for PostgreSQL to be ready..."
    @until docker exec macrotracker-db pg_isready -U macrotracker >/dev/null 2>&1; do sleep 1; done
    npx dotenv -e .env.local -- npx drizzle-kit push
    npx dotenv -e .env.local -- npx tsx lib/db/seed.ts

db-start:
    docker compose up -d

db-stop:
    docker compose down

db-reset:
    docker compose down -v
    docker compose up -d
    @echo "Waiting for PostgreSQL to be ready..."
    @until docker exec macrotracker-db pg_isready -U macrotracker >/dev/null 2>&1; do sleep 1; done
    npx dotenv -e .env.local -- npx drizzle-kit push
    npx dotenv -e .env.local -- npx tsx lib/db/seed.ts

db-migrate:
    npx dotenv -e .env.local -- npx drizzle-kit push

db-seed:
    npx dotenv -e .env.local -- npx tsx lib/db/seed.ts

db-update-admin:
    npx dotenv -e .env.local -- npx tsx scripts/update-admin.ts

run:
    @if ! docker info >/dev/null 2>&1; then echo "Docker is not running. Please start Docker first."; exit 1; fi
    @if ! docker exec macrotracker-db pg_isready -U macrotracker >/dev/null 2>&1; then \
      docker compose up -d; \
      echo "Waiting for PostgreSQL to be ready..."; \
      until docker exec macrotracker-db pg_isready -U macrotracker >/dev/null 2>&1; do sleep 1; done; \
    fi
    @output=$(npx dotenv -e .env.local -- npx drizzle-kit push --config drizzle.config.ts 2>&1); exit_code=$?; \
    if [ $exit_code -ne 0 ]; then echo "$output"; exit $exit_code; fi; \
    if ! echo "$output" | grep -q "No changes detected"; then \
      echo "$output"; \
    fi
    @echo ""
    @echo "Local:    http://127.0.0.1:3000"
    @echo "Network:  http://$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo '<your-local-ip>'):3000"
    @echo ""
    @bash -o pipefail -c 'npx next dev --hostname 0.0.0.0 2>&1 | grep --line-buffered -vE "^- (Local|Network):"; code=$?; if [ $code -eq 1 ]; then exit 0; else exit $code; fi'

build:
    npx next build

start:
    npx next start

lint:
    npx eslint .

test:
    npx vitest run

test-e2e:
    npx playwright test

test-e2e-ui:
    npx playwright test --ui

screenshots:
    node scripts/capture-screenshots.mjs

typecheck:
    npx tsc --noEmit

hooks-install:
    hk install --mise

# Recipes used by hk git hooks

check-editorconfig *files:
    ec {{ files }}

check-markdown *files:
    markdownlint-cli2 {{ files }}

check-lint *files:
    npx eslint {{ files }}

check-typecheck:
    npx tsc --noEmit

check-test:
    npx vitest run

check-test-e2e:
    npx playwright test

check-commit-msg msg_file:
    committed --commit-file "{{ msg_file }}"
