import { chromium } from 'playwright'
import fs from 'node:fs'
const AXE = fs.readFileSync('/Users/mihaibilde/Development/component-showcase/node_modules/axe-core/axe.min.js', 'utf8')
const BASE = 'http://localhost:6011'
const only = process.env.ONLY ? new RegExp(process.env.ONLY) : null

const index = await (await fetch(`${BASE}/index.json`)).json()
const stories = Object.values(index.entries)
  .filter(e => e.type === 'story' && (!only || only.test(e.id)))

const b = await chromium.launch()
const tally = {}          // ruleId -> node count
const perStory = {}
for (const theme of ['light', 'dark']) {
  const ctx = await b.newContext({ viewport: { width: 1000, height: 800 } })
  await ctx.addInitScript(t => localStorage.setItem('theme', t), theme)
  const p = await ctx.newPage()
  for (const s of stories) {
    await p.goto(`${BASE}/iframe.html?id=${s.id}`, { waitUntil: 'networkidle' })
    await p.waitForTimeout(450)          // let enter-animations settle
    await p.addScriptTag({ content: AXE })
    const r = await p.evaluate(() => window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa'] },
    }))
    for (const v of r.violations) {
      tally[v.id] = (tally[v.id] ?? 0) + v.nodes.length
      const k = `${s.id} [${theme}]`
      ;(perStory[k] ??= {})[v.id] = ((perStory[k] ?? {})[v.id] ?? 0) + v.nodes.length
    }
  }
  await ctx.close()
}
await b.close()
const total = Object.values(tally).reduce((a, n) => a + n, 0)
console.log(`stories=${stories.length} ×2 themes   TOTAL violation nodes = ${total}`)
for (const [k, v] of Object.entries(tally).sort((a,b)=>b[1]-a[1])) console.log(`  ${String(v).padStart(4)}  ${k}`)
if (process.env.DETAIL) {
  console.log('--- per story ---')
  for (const [k, v] of Object.entries(perStory)) console.log(`  ${k}: ${JSON.stringify(v)}`)
}
