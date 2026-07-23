import { chromium } from '@playwright/test'
import dotenv from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'docs', 'screenshots')

dotenv.config({ path: path.join(ROOT, '.env.local') })

const BASE_URL = process.env.SCREENSHOT_BASE_URL || 'http://localhost:3000'
const EMAIL = process.env.INITIAL_ADMIN_EMAIL
const PASSWORD = process.env.INITIAL_ADMIN_PASSWORD

const GOALS = { calories: 2200, protein: 140, fat: 70, carbs: 240 }

const HIDE_DEV_UI_CSS = `
  nextjs-portal, [data-nextjs-dialog-overlay], [data-nextjs-toast] {
    display: none !important;
  }
`

const MEAL_PLAN = [
  { meal: 'desayuno', categories: ['frutas', 'carbohidratos'] },
  { meal: 'comida', categories: ['proteina', 'carbohidratos', 'verduras'] },
  { meal: 'cena', categories: ['proteina', 'verduras', 'grasas'] },
  { meal: 'snack', categories: ['frutas', 'grasas'] },
]

function isoDaysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function pickFood(foods, category, salt) {
  const pool = foods.filter(f => f.category === category)
  if (pool.length === 0) throw new Error(`No foods in category ${category}`)
  return pool[salt % pool.length]
}

function amountFor(food, salt) {
  if (food.measureType === 'unit') return (salt % 2) + 1
  return 60 + (salt % 3) * 30
}

async function main() {
  if (!EMAIL || !PASSWORD) {
    console.error('INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD must be set in .env.local')
    process.exit(1)
  }

  try {
    const res = await fetch(`${BASE_URL}/es/login`, { method: 'HEAD' })
    if (!res.ok && res.status !== 307) throw new Error(String(res.status))
  } catch {
    console.error(`No dev server reachable at ${BASE_URL}. Run \`just run\` in another terminal first.`)
    process.exit(1)
  }

  fs.mkdirSync(OUT_DIR, { recursive: true })

  const browser = await chromium.launch()
  const createdIds = []

  try {
    const context = await browser.newContext({
      baseURL: BASE_URL,
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
      serviceWorkers: 'block',
    })

    const loginRes = await context.request.post('/api/auth/login', {
      data: { email: EMAIL, password: PASSWORD },
    })
    if (!loginRes.ok()) {
      console.error(`Login failed (${loginRes.status()}). Check INITIAL_ADMIN_* credentials.`)
      process.exit(1)
    }

    const foodsRes = await context.request.get('/api/foods')
    const { foods } = await foodsRes.json()
    console.log(`Catalog loaded: ${foods.length} foods`)

    console.log('Creating demo log entries...')
    const days = [5, 4, 3, 2, 1, 0]
    for (const dayOffset of days) {
      const date = isoDaysAgo(dayOffset)
      for (const [i, slot] of MEAL_PLAN.entries()) {
        for (const [j, category] of slot.categories.entries()) {
          const salt = dayOffset * 7 + i * 3 + j
          const food = pickFood(foods, category, salt)
          const res = await context.request.post('/api/log', {
            data: {
              date,
              foodName: food.name,
              category: food.category,
              amount: amountFor(food, salt),
              meal: slot.meal,
            },
          })
          if (res.ok()) {
            const body = await res.json()
            createdIds.push(body.id)
          } else {
            console.warn(`  Skipped ${food.name} (${res.status()})`)
          }
        }
      }
    }
    console.log(`Created ${createdIds.length} demo entries`)

    const shot = async (name, { theme, path: urlPath, action }) => {
      const page = await context.newPage()
      await page.addInitScript(([themeValue, goalsValue]) => {
        localStorage.setItem('theme', themeValue)
        localStorage.setItem('macrotracker-goals', goalsValue)
      }, [theme, JSON.stringify(GOALS)])
      await page.goto(urlPath, { timeout: 90000, waitUntil: 'domcontentloaded' })
      await page.waitForLoadState('networkidle', { timeout: 45000 }).catch(() => {})
      await page.addStyleTag({ content: HIDE_DEV_UI_CSS })
      if (action) await action(page)
      await page.screenshot({ path: path.join(OUT_DIR, name) })
      console.log(`  ${name}`)
      await page.close()
    }

    console.log('Capturing screenshots...')
    await shot('home-light.png', { theme: 'light', path: '/es' })
    await shot('home-dark.png', { theme: 'dark', path: '/es' })
    await shot('weekly-chart.png', {
      theme: 'dark',
      path: '/es',
      action: async page => {
        await page.getByRole('button', { name: 'Semanal' }).click()
        await page.locator('[aria-labelledby="weekly-title"]').waitFor()
        await page.waitForTimeout(600)
      },
    })
    await shot('goals-modal.png', {
      theme: 'light',
      path: '/es',
      action: async page => {
        await page.getByRole('button', { name: 'Metas' }).click()
        await page.locator('[aria-labelledby="goals-title"]').waitFor()
      },
    })
    await shot('admin.png', { theme: 'dark', path: '/es/admin' })

    const mobile = await browser.newContext({
      baseURL: BASE_URL,
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      serviceWorkers: 'block',
    })
    const mobileCookies = await context.cookies()
    await mobile.addCookies(mobileCookies)
    const mp = await mobile.newPage()
    await mp.addInitScript(([themeValue, goalsValue]) => {
      localStorage.setItem('theme', themeValue)
      localStorage.setItem('macrotracker-goals', goalsValue)
    }, ['dark', JSON.stringify(GOALS)])
    await mp.goto('/es', { timeout: 90000, waitUntil: 'domcontentloaded' })
    await mp.waitForLoadState('networkidle', { timeout: 45000 }).catch(() => {})
    await mp.addStyleTag({ content: HIDE_DEV_UI_CSS })
    await mp.screenshot({ path: path.join(OUT_DIR, 'mobile-home.png') })
    console.log('  mobile-home.png')
    await mobile.close()
    await context.close()
  } finally {
    console.log('Cleaning up demo entries...')
    const cleanup = await browser.newContext({ baseURL: BASE_URL })
    await cleanup.request.post('/api/auth/login', {
      data: { email: EMAIL, password: PASSWORD },
    })
    let removed = 0
    for (const id of createdIds) {
      const res = await cleanup.request.delete('/api/log', { data: { id } })
      if (res.ok()) removed++
    }
    console.log(`Removed ${removed}/${createdIds.length} demo entries`)
    await cleanup.close()
    await browser.close()
  }

  console.log(`\nDone. Screenshots in docs/screenshots/`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
