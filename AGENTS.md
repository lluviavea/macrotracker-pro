<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# MacroTracker - Project Knowledge

## Google Sheets Integration

- **Spreadsheet ID**: `1-gLdhqGva8eBhJb6xTzvUmUysj49mv4n_5hb2f7SSMo`
- **Service account key**: `~/macrotracker-sa-key.json`
- **Service account email**: `macrotracker-sa@macrotracker-498919.iam.gserviceaccount.com`
- **Auth method**: `GOOGLE_APPLICATION_CREDENTIALS` env var pointing to key file

### Sheet Structure (SISTEMA DE HÁBITOS)
| Sheet | Content |
|---|---|
| PROTEINA | Carnes, huevos, pescado |
| CARBOHIDRATOS | Legumbres, granos, tortillas (split: col A alta prote, col C otros) |
| GRASAS | Aceites, semillas, lácteos grasos |
| FRUTAS | Frutas enteras |
| VERDURAS | Verduras varias |
| CONDIMENTOS | Especias, polvos, salsas |
| SUPLEMENTOS | Vitaminas, minerales, probióticos |
| PROGRESO DE SISTEMA DE HÁBITOS | Habit tracker (no usada) |
| COMIDAS SALADAS/DULCES | Meal ideas (no usadas) |
| NECESARIO | Shopping list (no usada) |
| LOG | Daily food log (creada por la app) |

### LOG Sheet Columns
`Fecha | Alimento | Categoria | Cantidad | Unidad | Proteina | Grasa | Carbs | Calorias | Preparacion`

- Numbers stored with comma as decimal separator (MX locale) -> parse with `val.replace(',', '.')`

## MCP Server

- **Server**: `xing5/mcp-google-sheets` via `uvx mcp-google-sheets@latest`
- **Auth**: Uses `GOOGLE_APPLICATION_CREDENTIALS` env var (falls back from OAuth to ADC)
- **Config**: In `opencode.json` at project root

## Nutrition Data

- Stored in `lib/nutrition.ts` as `NUTRITION_DATA` array
- Matches food names normalized (lowercase, no accents, no special chars)
- `preparation` field: `'crudo'` for protein, `'cocido'` for carbs, `null` for others
- `measureType`: `'gram'` or `'unit'`
- For unit items: `unitName` (e.g. "huevo") and `unitGrams` (e.g. 60)
- Macro calculation: `factor = amount * unitGrams / 100` (unit) OR `factor = amount / 100` (gram)

## Architecture

```
app/
  page.tsx          - Main UI (client component)
  layout.tsx        - Root layout
  globals.css       - Tailwind v4 styles
  api/
    foods/route.ts  - GET all foods from sheets
    log/route.ts    - CRUD for daily log (GET, POST, PUT, DELETE)
lib/
  types.ts          - FoodItem, FoodCategory, LogEntry types
  nutrition.ts      - Nutrition lookup table
  google-sheets.ts  - Google Sheets connector + food fetcher
  log.ts            - Log persistence functions
```

- Foods read from sheets on each request (no cache = always fresh)
- Log entries saved individually to LOG sheet on add/change/delete
- Date-based navigation with input type="date"

## Dev Commands

```bash
npm run dev    # Start dev server on :3000
npm run build  # Production build
npm run lint   # Run ESLint
```
