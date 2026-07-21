# Admin Catalog

Read this when working on the admin food catalog at `/[locale]/admin`.

## Purpose

The admin page lets you **add, edit, and delete** foods from the catalog that appears in the main
app. It is a single-page client component with a sortable, searchable table and a modal form for
create/edit.

The admin route is now protected. Only users with `role = 'admin'` can access it. See `docs/auth.md` for details.

## Files

| File | Responsibility |
| --- | --- |
| `app/[locale]/admin/page.tsx` | Page UI: table, modal, search, sort |
| `app/api/foods/route.ts` | API: GET, POST, PUT, DELETE (Zod-validated) |
| `lib/db/foods.ts` | DB queries: `getAllFoods`, `getFoodByNameAndCategory`, `insertFood`, `updateFood`, `deleteFood`, `seedUserCatalog` |
| `lib/validation.ts` | `createFoodSchema`, `updateFoodSchema`, `deleteFoodSchema` |
| `lib/nutrition-utils.ts` | `lookupNutrition` and `lookupNutritionMatches` for auto-fill |
| `components/FoodAutocomplete.tsx` | Search-as-you-type dropdown for the admin name field |

## Data flow

```text
Page load      → GET    /api/foods            → list all foods (no cache, fresh every request)
Save (create)  → POST   /api/foods            → validate with createFoodSchema → insertFood
Save (edit)    → PUT    /api/foods            → validate with updateFoodSchema → updateFood (also recalculates dependent log entries)
Delete         → DELETE /api/foods            → validate with deleteFoodSchema → deleteFood
```

The `GET /api/foods` route handler has **no `revalidate` segment config** and every
client `fetch('/api/foods')` uses `{ cache: 'no-store' }`. This data is per-user and
mutates often; caching it caused stale lists after edits. Do not reintroduce caching
without a tag-based invalidation strategy (`revalidateTag`) that actually fires on
mutation.

After every successful mutation, `AdminClient` updates the local `foods` state
optimistically (replace on PUT, append on POST, filter on DELETE) so the user sees
the change without waiting for the refetch. `loadFoods()` runs immediately afterwards
to reconcile with the server (picks up server-side normalization such as the
`log_entries` recalculation).

## Auto-fill from `NUTRITION_DATA`

When the admin types in the **Spanish name** field, a dropdown shows matching foods from
`NUTRITION_DATA` (`components/FoodAutocomplete.tsx`). The admin can:

- Click a suggestion to pre-fill every field.
- Press `ArrowDown` / `ArrowUp` + `Enter` to select with the keyboard.
- Press `Escape` or click outside to close the dropdown.

If the admin types a known name and leaves the field (`onBlur`), `lookupNutrition(form.name)` still
pre-fills the macros as a fallback.

Either way, the admin can override any field. The admin still has to click save to persist;
auto-fill does not create a row.

## Sorting & searching

- Search filters by name (ES) OR `nameEn` (EN), case-insensitive.
- Click any macro column header (`protein`, `fat`, `carbs`, `sugar`, `fiber`, `calories`) to toggle
  sort. Default sort is descending; first click sets descending, second flips to ascending.
- Sort state is local (not persisted).

## Recalculation of dependent log entries

`updateFood` (`lib/db/foods.ts`) does more than just `UPDATE foods`:

```typescript
const logRows = await db.select().from(logEntries)
  .where(and(eq(logEntries.foodName, data.name), eq(logEntries.category, data.category)))

for (const row of logRows) {
  const macros = calculateMacros(foodItem, Number(row.amount))
  await db.update(logEntries).set({...macros}).where(eq(logEntries.id, row.id))
}
```

This keeps the denormalized macros in `log_entries` accurate when a food's nutrition values change.
**Caveat**: the recalc only matches by `foodName + category`. If the admin renames a food, the
existing log entries for the old name will not be recalculated.

## Error handling

`handleSave` and `handleDelete` in `AdminClient` check `r.ok` and surface failures via an
`errorMessage` state rendered as a dismissible banner (`role="alert"`). The banner renders
**inside the modal** when it is open (and the modal stays open so the user does not lose the
form), or **above the table** otherwise. Error keys live under the `Admin` i18n namespace:

- `validationError` — server returned a 400 from Zod (`{ error: 'Validation failed', details }`)
- `saveError` — any other failure on POST/PUT
- `deleteError` — any failure on DELETE
- `dismissError` — aria-label for the `✕` button

HTTP 401 still triggers a redirect to `/login` (via `redirectToLogin`), matching the home page.

## Zod schemas (`lib/validation.ts`)

```typescript
createFoodSchema = {
  name, nameEn?, category, protein, fat, carbs, sugar, fiber, calories,
  measureType, unitName?, unitGrams?, preparation?
}

updateFoodSchema = { id, ...createFoodSchema }

deleteFoodSchema = { id }
```

All numeric fields default to 0. `category` must be one of the 7 `FoodCategory` values. `measureType`
is `'gram' | 'unit'`. `preparation` is `'crudo' | 'cocido' | null`. Validation errors return
`{ error: 'Validation failed', details: error.issues }` with status 400.

## UI translation keys

The admin uses the `Admin` namespace in `messages/en.json` and `messages/es.json`. When adding new
strings, add them to both files under the `Admin` key.
