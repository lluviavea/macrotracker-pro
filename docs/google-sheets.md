# Google Sheets Integration

Read this when working with the Google Sheets connection, auth, or data fetching.

## Auth

- **Method**: Application Default Credentials (ADC) via `GOOGLE_APPLICATION_CREDENTIALS` env var
- **Key file**: `~/macrotracker-sa-key.json`
- **Service account email**: `macrotracker-sa@macrotracker-498919.iam.gserviceaccount.com`
- **Spreadsheet ID**: `1-gLdhqGva8eBhJb6xTzvUmUysj49mv4n_5hb2f7SSMo`

## Sheet Names and Structure

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

### LOG Sheet (auto-created)

Columns: `Fecha | Alimento | Categoria | Cantidad | Unidad | Proteina | Grasa | Carbs | Calorias | Preparacion`

Numbers use comma as decimal separator (MX locale) → parse with `val.replace(',', '.')`

## Key Files

- `lib/google-sheets.ts` — Sheets connector + food fetcher + log CRUD
- Route `/api/foods/route.ts` — GET all foods
- Route `/api/log/route.ts` — CRUD for log entries

## MCP Server (for AI agents)

- Server: `xing5/mcp-google-sheets` via `uvx`
- Config in `opencode.json` at project root
- Falls back from OAuth to ADC

Read `docs/nutrition.md` for how food data maps to nutrition values.
Read `docs/architecture.md` for how data flows through the app.
