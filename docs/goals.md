# Daily Goals

Read this when working on the daily macro goals feature (calories, protein, fat, carbs).

## Purpose

The user can set personal daily targets for calories and the three primary macros. The
`MacroSummary` component renders a progress bar under each card showing `% of goal` so the user
sees at a glance how close they are to hitting their targets.

## Storage: localStorage (not the database)

Goals are **per-browser, not per-user**. They are stored in `localStorage` under the key
`macrotracker-goals`. Rationale: the app is single-user and local-first, and goals are
personal preferences, not data the user wants to analyze historically.

```json
localStorage['macrotracker-goals'] = JSON.stringify({
  calories: number,
  protein: number,
  fat: number,
  carbs: number
})
```

## Files

| File | Responsibility |
| --- | --- |
| `lib/goals.ts` | `Goals` type, `getGoals()`, `saveGoals()`, default values |
| `lib/useFoodLog.ts` | Owns the `goals` state, passes to `MacroSummary`, exposes `setGoals` |
| `components/GoalsModal.tsx` | Edit modal with 4 numeric inputs |
| `components/MacroSummary.tsx` | Renders progress bars (`% of goal`) when `goals` is passed |

## Defaults

```typescript
const DEFAULTS: Goals = {
  calories: 2000,
  protein:  100,
  fat:      65,
  carbs:    250,
}
```

## API

```typescript
import { getGoals, saveGoals } from '@/lib/goals'

getGoals(): Goals
  // SSR-safe: returns DEFAULTS if window is undefined
  // On client: reads localStorage, merges with DEFAULTS so missing fields are filled in

saveGoals(goals: Goals): void
  // Wraps localStorage.setItem in try/catch (silent failure on quota exceeded)
```

## Component contract

- `MacroSummary` accepts an optional `goals?: Goals` prop. When passed, it renders a progress bar
  per card with `pct = Math.min(100, round((value / goal) * 100))`.
- Cards without a goal (e.g. `sugar`, `fiber`) do not show a bar even if `goals` is passed.
- `GoalsModal` is a controlled modal: parent owns `showGoals` state and passes `goals` + `onSave`
  - `onClose` props.

## Editing flow

1. User clicks "Goals" link in the header → `setShowGoals(true)`.
2. `GoalsModal` mounts with a local copy of `goals` (so cancel discards changes).
3. User edits the 4 numeric inputs (integer parsing, `parseInt`).
4. User clicks "Save" → `saveGoals(editGoals)` + `onSave(editGoals)` + `onClose()`.
5. `onSave` calls `setGoals(newGoals)` in the parent hook, which re-renders `MacroSummary` with
    the new bars.

## Why localStorage instead of the DB?

- Single-user local app — no auth, no multi-device sync.
- Goals are a UI preference, not domain data.
- localStorage avoids a network round-trip and keeps the home page snappy.
- If we ever add auth and multi-device sync, the natural migration is to store goals in a
  `user_preferences` table keyed by user id.

Read `docs/architecture.md` for the overall architecture.
