# Google Sheets (Legacy)

**DEPRECATED.** Kept for historical reference only. No code path reads from Google Sheets anymore.

## Status

The app now uses **PostgreSQL via Drizzle ORM** as its sole data store. The seed script
(`lib/db/seed.ts`) reads directly from the static `NUTRITION_DATA` array in `lib/nutrition.ts`. The
Google Sheets dependency, the service account, and the `GOOGLE_APPLICATION_CREDENTIALS` env var
have all been removed.

The MCP server in `opencode.json` (`mcp-google-sheets`) is also obsolete and can be deleted if
desired — it is no longer required to run the app.

## What was the source of truth?

Before the migration, the food catalog lived in a Google Sheets workbook with one tab per category
plus a LOG tab. The original sheets were the only writable data source; everything else was a
mirror. The migration to PostgreSQL + `NUTRITION_DATA` made the static array the source of truth so
the app no longer needs a network call to start.

## Original Sheet Structure (for reference)

### Food Category Sheets

| Sheet | Content |
|---|---|
| PROTEINA | Carnes, huevos, pescado |
| CARBOHIDRATOS | Legumbres, granos, tortillas (col A alta prote, col C otros) |
| GRASAS | Aceites, semillas, lácteos grasos |
| FRUTAS | Frutas enteras |
| VERDURAS | Verduras varias |
| CONDIMENTOS | Especias, polvos, salsas |
| SUPLEMENTOS | Vitaminas, minerales, probióticos |

### LOG Sheet

Columns: `Fecha | Alimento | Categoria | Cantidad | Unidad | Proteina | Grasa | Carbs | Calorias | Preparacion`

Numbers use comma as decimal separator (MX locale).

## Original Auth (no longer used)

- **Method**: Service account via `GOOGLE_APPLICATION_CREDENTIALS`
- **Spreadsheet ID**: `1-gLdhqGva8eBhJb6xTzvUmUysj49mv4n_5hb2f7SSMo`

## Adding new foods

Today, the only way to add a food to the catalog is via the admin UI at `/[locale]/admin`. See
`docs/admin.md` for details.

Read `docs/nutrition.md` for how food data maps to nutrition values.
Read `docs/architecture.md` for the current database architecture.
