# Architecture

Read this when understanding how the project is structured and how data flows.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with Turbopack
- **Styling**: Tailwind CSS v4
- **Data Source**: Google Sheets (via `google-spreadsheet` library + service account)
- **Runtime**: Node.js 24

## Project Structure

```
app/
  page.tsx          - Main UI (client component, 'use client')
  layout.tsx        - Root layout with HTML shell
  globals.css       - Tailwind v4 base styles
  api/
    foods/route.ts  - GET: fetches all foods from Google Sheets
    log/route.ts    - CRUD: GET, POST, PUT, DELETE for daily log
lib/
  types.ts          - TypeScript types (FoodItem, FoodCategory, LogEntry)
  nutrition.ts      - Static nutrition lookup table (NUTRITION_DATA array)
  google-sheets.ts  - Sheets connector, food fetching logic, log persistence
  log.ts            - Log persistence helper functions
docs/               - AI-first documentation (this file)
```

## Data Flow

```
User clicks food -> POST /api/log -> Google Sheets (LOG tab)
User changes amount -> PUT /api/log -> Updates row in LOG tab
User deletes entry -> DELETE /api/log -> Removes row from LOG tab
Page load -> GET /api/log?date=YYYY-MM-DD -> Reads LOG tab for that date
Food list -> GET /api/foods -> Reads all category sheets
```

## Component Tree (planned extraction targets)

```
Home (page.tsx)
├── DateNavigator        (date picker + prev/next)
├── MacroSummary          (4 cards: calories, protein, fat, carbs)
├── LogEntryList
│   └── LogEntryRow       (food name, amount input, delete, macro breakdown)
├── CategoryTabs          (filter buttons)
├── FoodSearch            (search input)
└── FoodGrid
    └── FoodCard          (single food item with add button)
```

Read `docs/google-sheets.md` for sheet structure and auth.
Read `docs/nutrition.md` for nutrition data and calculation logic.
