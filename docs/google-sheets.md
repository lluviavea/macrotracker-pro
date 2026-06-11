# Google Sheets (Legacy)

Read this when understanding the original data source.

## Status

**DEPRECATED.** The app now uses PostgreSQL via Drizzle ORM. Google Sheets was the original data
source. The seed script (`lib/db/seed.ts`) now reads directly from the static `NUTRITION_DATA` array
in `lib/nutrition.ts`, removing the Google Sheets dependency entirely.

## Seed Script

```bash
just db-seed
```

Requirements:
- Docker PostgreSQL running (`just db-start`)
- `DATABASE_URL` env var set

The seed script reads:
1. Each entry in `NUTRITION_DATA` → assigned to a category by position → inserts into `foods`
2. Note: Log entries are not seeded; they must be created through the app or migrated manually.

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

## Auth

- **Method**: Service account via `GOOGLE_APPLICATION_CREDENTIALS`
- **Spreadsheet ID**: `1-gLdhqGva8eBhJb6xTzvUmUysj49mv4n_5hb2f7SSMo`

Read `docs/nutrition.md` for how food data maps to nutrition values.
Read `docs/architecture.md` for the current database architecture.
