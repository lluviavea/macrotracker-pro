# Architecture

Read this when understanding how the project is structured and how data flows.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with Turbopack
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL 17 (via Docker Compose)
- **ORM**: Drizzle ORM
- **Runtime**: Node.js 24

## Project Structure

```
app/
  page.tsx          - Main UI (client component, 'use client')
  layout.tsx        - Root layout with HTML shell
  globals.css       - Tailwind v4 base styles
  api/
    foods/route.ts  - GET: fetches all foods from PostgreSQL
    log/route.ts    - CRUD: GET, POST, PUT, DELETE for daily log
lib/
  types.ts          - TypeScript types (FoodItem, FoodCategory, Entry, LogEntry)
  nutrition.ts      - Static nutrition lookup table (NUTRITION_DATA array)
  nutrition-utils.ts - normalizeName, lookupNutrition helpers
  macros.ts         - calculateMacros, findFood, calculateTotals
  validation.ts   - Zod schemas for API request validation
  db/
    schema.ts       - Drizzle table definitions (foods, log_entries)
    index.ts        - Drizzle client (postgres-js driver)
    foods.ts        - DB food queries (getAllFoods, getFoodByNameAndCategory)
    logs.ts         - DB log CRUD (getLogForDate, addLogEntry, etc.)
    seed.ts         - One-time seed from NUTRITION_DATA to PostgreSQL (Google Sheets deprecated)
docs/               - AI-first documentation (this file)
drizzle/            - Drizzle Kit migration files
docker-compose.yml  - PostgreSQL service definition
```

## Data Flow

```
User clicks food -> POST /api/log -> getFoodByNameAndCategory() -> INSERT INTO log_entries
User changes amount -> PUT /api/log -> getFoodByNameAndCategory() -> UPDATE log_entries
User deletes entry -> DELETE /api/log -> DELETE FROM log_entries
Page load -> GET /api/log?date=YYYY-MM-DD -> SELECT FROM log_entries WHERE date = ?
Food list -> GET /api/foods -> SELECT * FROM foods
```

## Database Schema

### foods

Stores the food catalog. Seeded from Google Sheets (one-time migration).

| Column | Type | Notes |
|---|---|---|---|
| id | SERIAL | Primary key |
| name | VARCHAR(255) | Food name |
| category | VARCHAR(50) | proteina, carbohidratos, etc. |
| protein | DECIMAL(10,2) | Per 100g |
| fat | DECIMAL(10,2) | Per 100g |
| carbs | DECIMAL(10,2) | Per 100g (total carbs) |
| sugar | DECIMAL(10,2) | Per 100g (carbs sub-category) |
| fiber | DECIMAL(10,2) | Per 100g (carbs sub-category) |
| calories | INTEGER | Per 100g |
| measure_type | VARCHAR(10) | 'gram' or 'unit' |
| unit_name | VARCHAR(255) | e.g. "huevo", "pieza" |
| unit_grams | DECIMAL(10,2) | e.g. 60 for egg |
| preparation | VARCHAR(10) | 'crudo', 'cocido', or NULL |

### log_entries

Stores daily food logs with pre-calculated macros (denormalized for fast reads).

| Column | Type | Notes |
|---|---|---|
| id | SERIAL | Primary key |
| date | DATE | Log date |
| food_name | VARCHAR(255) | Denormalized food name |
| category | VARCHAR(50) | Denormalized category |
| amount | DECIMAL(10,2) | Amount consumed |
| unit | VARCHAR(50) | 'g' or unit name |
| protein | DECIMAL(10,2) | Calculated |
| fat | DECIMAL(10,2) | Calculated |
| carbs | DECIMAL(10,2) | Calculated |
| sugar | DECIMAL(10,2) | Calculated (sub-category of carbs) |
| fiber | DECIMAL(10,2) | Calculated (sub-category of carbs) |
| calories | INTEGER | Calculated |
| preparation | VARCHAR(50) | Preparation method |
| created_at | TIMESTAMP | Auto-set |

## Component Tree

```
Home (page.tsx)
├── DateNavigator        (date picker + prev/next)
├── MacroSummary          (6 cards: calories, protein, fat, carbs, sugar, fiber)
├── LogEntryList
│   └── LogEntryRow       (food name, amount input, delete, macro breakdown)
├── CategoryTabs          (filter buttons)
├── FoodSearch            (search input)
└── FoodGrid
    └── FoodCard          (single food item with add button)
```

## Pure Logic Modules

| Module | Responsibility |
|---|---|
| `lib/macros.ts` | `calculateMacros`, `findFood`, `calculateTotals` |
| `lib/nutrition-utils.ts` | `normalizeName`, `lookupNutrition` (from `NUTRITION_DATA`) |

Read `docs/nutrition.md` for nutrition data and calculation logic.
Read `docs/google-sheets.md` for legacy sheet structure (one-time seed source).
