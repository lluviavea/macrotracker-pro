# Architecture

Read this when understanding how the project is structured, how data flows, or where to add a new
feature. For cross-cutting concerns, see the dedicated docs:

- Admin catalog → `docs/admin.md`
- Authentication & users → `docs/auth.md`
- Daily goals → `docs/goals.md`
- Dark/light mode → `docs/theme.md`
- Nutrition data & formulas → `docs/nutrition.md`
- PWA / installability → `docs/pwa.md`

## Tech Stack

- **Framework**: Next.js 16 (App Router) with Turbopack
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`)
- **i18n**: next-intl v4 (ES + EN, URL prefix routing)
- **Database**: PostgreSQL 17 (via Docker Compose)
- **ORM**: Drizzle ORM (postgres-js driver)
- **Validation**: Zod
- **Theme**: CSS variables + `dark` class on `<html>` (Tailwind v4 dark mode)
- **Runtime**: Node.js 24 (pinned in `mise.toml`)

## Project Structure

```text
app/
  [locale]/
    layout.tsx           - Locale layout (NextIntlClientProvider, lang setter)
    page.tsx             - Main UI (client component, 'use client')
    admin/
      page.tsx           - Admin catalog CRUD (table, modal, sort, search)
  layout.tsx             - Root layout (HTML shell, fonts, ThemeProvider, ToastContainer)
  globals.css            - Tailwind v4 base styles + CSS variables for theme
  api/
    foods/route.ts       - GET/POST/PUT/DELETE: food catalog (admin)
    log/route.ts         - GET/POST/PUT/DELETE: daily log entries
    nutrition/search/    - (placeholder) nutrition lookup endpoint
i18n/
  routing.ts             - next-intl routing config (locales, defaultLocale, prefix)
  request.ts             - next-intl request config (message loader)
  navigation.ts          - createNavigation → locale-aware Link, usePathname, useRouter
proxy.ts                 - next-intl proxy (locale detection, redirect)
messages/
  en.json                - English translations (ICU format)
  es.json                - Spanish translations
components/
  ClientLocale.tsx       - Sets document.documentElement.lang client-side
  LangSwitcher.tsx       - Language toggle button (ES ↔ EN)
  ThemeProvider.tsx      - Dark/light mode context (system preference + localStorage)
  ThemeToggle.tsx        - Sun/moon toggle button
  Toast.tsx              - Imperative toast API + ToastContainer
  DateNavigator.tsx      - Date display + prev/next/today; opens Calendar popover
  Calendar.tsx           - Custom month grid date picker (i18n, keyboard accessible)
  MacroSummary.tsx       - 6 macro cards (calories, P/F/C, sugar, fiber) + goal progress bars
  LogEntryList.tsx       - List of today's entries
  LogEntryRow.tsx        - Single entry (food, amount input, delete, macro breakdown)
  CategoryTabs.tsx       - Category filter buttons
  FoodSearch.tsx         - Search input (bilingual: ES + EN)
  FoodGrid.tsx           - Grid of FoodCard
  FoodCard.tsx           - Single food item with add button
  AddFoodModal.tsx       - Amount + meal picker before adding to log
  GoalsModal.tsx         - Edit daily goals (calories, P/F/C)
lib/
  types.ts               - TypeScript types (FoodItem, FoodCategory, Entry)
  nutrition.ts           - Static NUTRITION_DATA lookup array (~180 entries)
  nutrition-utils.ts     - normalizeName, lookupNutrition helpers
  macros.ts              - calculateMacros, findFood, calculateTotals
  goals.ts               - Goals type + localStorage get/save
  validation.ts          - Zod schemas for all API request bodies
  useFoodLog.ts          - Main client hook (foods, entries, totals, CRUD with optimistic updates)
  db/
    schema.ts            - Drizzle table definitions (foods, log_entries)
    index.ts             - Drizzle client (postgres-js driver)
    foods.ts             - Food queries (getAllFoods, getFoodByNameAndCategory, insert, update, delete)
    logs.ts              - Log CRUD (getLogForDate, addLogEntry, updateLogEntry, deleteLogEntry)
    seed.ts              - Seeds PostgreSQL from NUTRITION_DATA
  __tests__/
    macros.test.ts
    nutrition-utils.test.ts
    validation.test.ts
docs/                    - AI-first documentation (this file + per-concern docs)
drizzle/                 - Drizzle Kit migration files
docker-compose.yml       - PostgreSQL service definition
mise.toml                - Pinned tool versions (node 24, npm 11, just 1)
```

## Data Flow

All data is scoped to a user. The proxy enforces authentication and the admin role.

### Authentication

```text
Guest visits /            -> proxy checks cookie -> redirect to /login
User submits login        -> POST /api/auth/login    -> verify password -> set session cookie
User submits register     -> POST /api/auth/register -> check invite code -> create user -> seed catalog -> set cookie
User clicks logout        -> POST /api/auth/logout   -> delete session cookie
```

### Food catalog (admin)

```text
Admin opens /admin       -> GET /api/foods        -> SELECT * FROM foods WHERE user_id = ?
Admin saves new food     -> POST /api/foods       -> INSERT INTO foods (with user_id) + revalidatePath('/api/foods')
Admin edits food         -> PUT  /api/foods       -> UPDATE foods WHERE user_id = ? + recalc dependent log_entries
Admin deletes food       -> DELETE /api/foods     -> DELETE FROM foods WHERE user_id = ?
```

### Daily log

```text
User clicks food         -> POST /api/log         -> getFoodByNameAndCategory(user_id) -> INSERT log_entries (with user_id)
User changes amount      -> PUT  /api/log         -> getFoodByNameAndCategory(user_id) -> UPDATE log_entries WHERE user_id = ?
User deletes entry       -> DELETE /api/log       -> DELETE FROM log_entries WHERE user_id = ?
Page load                -> GET /api/log?date=... -> SELECT log_entries WHERE user_id = ? AND date = ?
Food list                -> GET /api/foods        -> SELECT * FROM foods WHERE user_id = ? (cached, 1h revalidation)
```

### Optimistic updates (client side)

The `useFoodLog` hook in `lib/useFoodLog.ts` uses **snapshot-based rollback** for update/delete:

1. Save current entries state to `snapshot`
2. Apply optimistic change to state
3. Send request
4. If request fails: restore from `snapshot` + set typed `error` (`load-foods` or `load-entries`)

Create-entry does NOT use optimistic updates — the new row is only added to state on success. Deleted log entries show an undo toast that re-creates the entry via `createEntry`.

The error banner distinguishes food-catalog errors from daily-log errors and offers a **Retry** button that calls `reloadFoods()` or `reloadEntries()`.

## Database Schema

### users

| Column | Type | Notes |
| --- | --- | --- |
| id | SERIAL | Primary key |
| email | VARCHAR(255) | Unique |
| password_hash | VARCHAR(255) | Bcrypt hash |
| role | VARCHAR(20) | `admin` or `user` |
| created_at | TIMESTAMP | Auto-set |

### foods

| Column | Type | Notes |
| --- | --- | --- |
| id | SERIAL | Primary key |
| user_id | INTEGER | FK → users.id (cascade delete) |
| name | VARCHAR(255) | Spanish food name |
| name_en | VARCHAR(255) | English name (nullable) |
| category | VARCHAR(50) | proteina, carbohidratos, grasas, frutas, verduras, condimentos, suplementos |
| protein | DECIMAL(10,2) | Per 100g (or per `unit_grams`) |
| fat | DECIMAL(10,2) | Per 100g |
| carbs | DECIMAL(10,2) | Per 100g (total) |
| sugar | DECIMAL(10,2) | Per 100g, default 0 (sub-category of carbs) |
| fiber | DECIMAL(10,2) | Per 100g, default 0 (sub-category of carbs) |
| calories | INTEGER | Per 100g |
| measure_type | VARCHAR(10) | `'gram'` or `'unit'` |
| unit_name | VARCHAR(255) | e.g. "huevo", "pieza" |
| unit_grams | DECIMAL(10,2) | grams per unit (e.g. 60 for egg) |
| preparation | VARCHAR(10) | `'crudo'`, `'cocido'`, or NULL |
| created_at | TIMESTAMP | Auto-set |
| updated_at | TIMESTAMP | Auto-set |

### log_entries

Stores daily food logs with **pre-calculated macros** (denormalized for fast reads + historical accuracy when a food is later updated).

| Column | Type | Notes |
| --- | --- | --- |
| id | SERIAL | Primary key |
| user_id | INTEGER | FK → users.id (cascade delete) |
| date | DATE | Log date |
| food_name | VARCHAR(255) | Denormalized food name |
| category | VARCHAR(50) | Denormalized category |
| amount | DECIMAL(10,2) | Amount consumed |
| unit | VARCHAR(50) | `'g'` or unit name (e.g. `'huevo'`) |
| protein | DECIMAL(10,2) | Calculated |
| fat | DECIMAL(10,2) | Calculated |
| carbs | DECIMAL(10,2) | Calculated |
| sugar | DECIMAL(10,2) | Calculated, default 0 |
| fiber | DECIMAL(10,2) | Calculated, default 0 |
| calories | INTEGER | Calculated |
| preparation | VARCHAR(50) | Preparation method (default `''`) |
| meal | VARCHAR(20) | `desayuno` / `comida` / `cena` / `snack` / `''` |
| created_at | TIMESTAMP | Auto-set |

When a food is updated via `PUT /api/foods`, the API **recalculates** the macros for all dependent `log_entries` rows so the totals stay accurate (`lib/db/foods.ts` → `updateFood`).

## Component Tree

```text
RootLayout (app/layout.tsx)
  ├── ThemeProvider             (dark/light context)
  └── [locale]/layout.tsx       (NextIntlClientProvider)
        └── page.tsx  (Home)
              ├── DateNavigator       (date display + prev/next/today; opens Calendar)
              │     └── Calendar       (custom month grid date picker)
              ├── MacroSummary         (6 cards with goal progress bars)
              ├── LogEntryList         (loading skeleton + empty state)
              │   └── LogEntryRow      (food, amount input, delete, macro breakdown)
              ├── CategoryTabs         (filter buttons; sticky while scrolling)
              ├── FoodSearch           (bilingual search; global across categories)
              ├── FoodGrid             (empty states for category/search)
              │   └── FoodCard         (add button; unit label; category badge)
              ├── AddFoodModal         (amount + meal picker; presets; live preview)
              ├── GoalsModal           (edit daily goals)
              ├── ThemeToggle          (current theme icon: moon/sun)
              └── LangSwitcher         (current locale label: ES/EN)
        └── admin/page.tsx  (Admin)
              ├── Search input         (bilingual)
              ├── Add button           (opens modal)
              ├── Food table           (sortable, editable, deletable)
              └── FoodForm modal       (with auto-fill from NUTRITION_DATA)

ToastContainer is mounted once at the root, siblings to children.
```

## Pure Logic Modules

| Module | Responsibility |
| --- | --- |
| `lib/macros.ts` | `calculateMacros`, `findFood`, `calculateTotals` |
| `lib/nutrition-utils.ts` | `normalizeName`, `lookupNutrition` (from `NUTRITION_DATA`) |
| `lib/validation.ts` | Zod schemas for `/api/foods` and `/api/log` request bodies |
| `lib/goals.ts` | `Goals` type + `getGoals` / `saveGoals` (localStorage) |
| `lib/useFoodLog.ts` | Main client hook — foods, entries, CRUD, optimistic updates, totals, typed errors |
| `lib/useFocusTrap.ts` | Traps Tab focus inside a modal for accessibility |

## Internationalization (i18n)

Uses **next-intl v4** with URL prefix routing (`/es/...` and `/en/...`).

### Key Files

| File | Purpose |
| --- | --- |
| `i18n/routing.ts` | Defines supported locales (`['en', 'es']`) and `defaultLocale: 'es'`, `localePrefix: 'always'` |
| `i18n/request.ts` | Loads the correct JSON message file per locale |
| `i18n/navigation.ts` | Creates locale-aware `Link`, `usePathname`, `useRouter` |
| `proxy.ts` | Automatically detects/redirects locale on first visit |
| `messages/en.json` | All English UI strings (ICU message format) |
| `messages/es.json` | All Spanish UI strings |

### How it works

1. Proxy intercepts every non-API request and ensures a valid locale prefix.
2. Pages live under `app/[locale]/` — locale is read from the URL segment.
3. `[locale]/layout.tsx` wraps children with `NextIntlClientProvider`, passing locale messages.
4. Every component calls `useTranslations('Namespace')` to get its translated strings.
5. `LangSwitcher` calls `router.replace(pathname, { locale })` to switch.
6. Bilingual content: `food.name` is Spanish, `food.nameEn` is English. Display via
    `locale === 'en' && nameEn ? nameEn : name`.

### Adding a new string

1. Add the key to both `messages/en.json` and `messages/es.json` under the right namespace.
2. Use `const t = useTranslations('Namespace')` and `t('key', { vars })` in the component.
3. ICU message format — `{count, plural, one {...} other {...}}` for plurals.

### Adding a new locale

1. Add locale code to `i18n/routing.ts` `locales` array.
2. Create `messages/{locale}.json` with all required keys.
3. Re-run `next build` to generate static params for the new locale.
