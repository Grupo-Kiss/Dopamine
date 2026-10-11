#!/usr/bin/env node
/**
 * Publish board.json to GitHub Issues.
 *
 * Permissions note (cursor[bot]): can create issues, sub-issues, and
 * blocked_by dependencies; cannot create labels, edit, comment, or close.
 * Scope/epic/task are encoded in titles + body metadata.
 *
 * Usage: node tools/issue-board/publish.mjs
 * Writes tools/issue-board/published.json with number map.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const boardPath = join(__dirname, 'board.json')
const outPath = join(__dirname, 'published.json')
const board = JSON.parse(readFileSync(boardPath, 'utf8'))

function ghJson(args, input) {
  const result = execFileSync('gh', args, {
    encoding: 'utf8',
    input,
    maxBuffer: 10 * 1024 * 1024,
  })
  return result.trim()
}

function createIssue(title, body) {
  const url = ghJson(['issue', 'create', '--title', title, '--body-file', '-'], body)
  const number = Number(url.split('/').pop())
  if (!Number.isFinite(number)) throw new Error(`Bad issue URL: ${url}`)
  const id = Number(
    ghJson(['api', `repos/Grupo-Kiss/Dopamine/issues/${number}`, '--jq', '.id']),
  )
  console.log(`created #${number} ${title}`)
  return { number, id, url, title }
}

function addSubIssue(parentNumber, childId) {
  execFileSync(
    'gh',
    [
      'api',
      '--method',
      'POST',
      `repos/Grupo-Kiss/Dopamine/issues/${parentNumber}/sub_issues`,
      '-F',
      `sub_issue_id=${childId}`,
    ],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  )
}

function addBlockedBy(childNumber, blockerId) {
  execFileSync(
    'gh',
    [
      'api',
      '--method',
      'POST',
      `repos/Grupo-Kiss/Dopamine/issues/${childNumber}/dependencies/blocked_by`,
      '-F',
      `issue_id=${blockerId}`,
    ],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  )
}

function epicBody(epic) {
  const pin = epic.pin ? `\n**Pin:** ${epic.pin}\n` : ''
  const tasks = epic.tasks
    .map((t) => `- [ ] \`${t.id}\` ${t.title}`)
    .join('\n')
  return `**Type:** EPIC (vertical slice)
**Scope:** ${epic.scope === 'mvp' ? 'MVP' : 'Post-MVP'}
**Epic id:** ${epic.id}
**Owning defs:** ${epic.defs.map((d) => `\`${d}\``).join(', ')}
${pin}
## Summary

${epic.summary}

## Delivery rules

- Strict TDD (ADR-0001): every child task starts with a **failing** test.
- Use glossary terms from \`CONTEXT.md\`.
- No feature work outside this slice's owning defs.

## Child tasks (ordered)

${tasks}

Child issues are linked as sub-issues; sequential tasks use native \`blocked_by\` dependencies.
`
}

function taskBody(epic, task, epicNumber, prevTaskNumber) {
  const pin = task.pin || epic.pin
  const pinLine = pin ? `\n**Pin:** ${pin}\n` : ''
  const blocked = prevTaskNumber
    ? `\n**Blocked by:** #${prevTaskNumber}\n`
    : '\n**Blocked by:** _(none — first task in epic)_\n'
  const done = (task.doneWhen || []).map((d) => `- ${d}`).join('\n')
  return `Part of #${epicNumber}

**Type:** TASK (TDD)
**Scope:** ${epic.scope === 'mvp' ? 'MVP' : 'Post-MVP'}
**Task id:** ${task.id}
**Epic:** ${epic.id} — ${epic.title}
**Owning defs:** ${(task.defs || epic.defs).map((d) => `\`${d}\``).join(', ')}
${pinLine}${blocked}
## TDD start (failing test first)

\`${task.failingTest}\`

Write this failing test before any production code (ADR-0001).

## Done when

${done}

## Notes

- Co-locate \`*.test.ts(x)\` beside the module (\`11\`, \`12\`).
- Inject clock/RNG/media/audio fakes — no real RAF/network in domain tests.
- Minigame work must stay **asset-agnostic** (manifests + stable ids).
`
}

function scopeBody(published) {
  const mvpEpics = published.epics.filter((e) => e.scope === 'mvp')
  const postEpics = published.epics.filter((e) => e.scope === 'post-mvp')

  const fmtEpic = (e) => {
    const tasks = e.tasks
      .map((t) => `  - [ ] #${t.number} \`${t.id}\` ${t.title}`)
      .join('\n')
    return `- [ ] #${e.number} **${e.id}** ${e.title}\n${tasks}`
  }

  return `**Type:** SCOPE / BOARD INDEX
**Process:** ADR-0001 — docs first, then strict TDD
**Pin:** Minigame runtime must stay **asset-agnostic** (manifests + stable ids under \`content/minigames/<id>/\`; restyle later without rewriting gameplay)
**Source:** \`tools/issue-board/board.json\` · \`docs/agents/mvp-board.md\`

> Probe issues \`#16\` / \`#17\` are permission checks — ignore/close when possible.

---

## MVP scope

### Goal

Ship a **playable frontend Match** that proves the attention-economy satire loop under strict TDD, with asset-agnostic minigames, before content-API and polish expansion.

### In MVP (v1 ship)

- Scaffold (Vite + TS + React + Vitest + pnpm) + clock/rng/media/audio fakes
- Match state machine (Start Page → Loading → Playing ⇄ Burnout → Recovery → Game Over)
- Dopamine (passive drain, gains, diminishing, Anticipation; **never** direct penalty)
- Focus Chain (full rules) · Input router (**R = Repost**, **Y = Echo**)
- Balance constants from \`06\` · Difficulty continuous multipliers
- Burnout / Recovery / Telegraph
- Content preload gate (local, fail-closed) · Layout desktop + mobile + Dopamine bar
- Hub: Start Page, Loading, Game Over, Credits Modal
- Asset-agnostic minigame runtime + **all three** minigames (Lane Defender first)
- Loop, Pulse, Wave (**Discovery ≠ Anticipation**), Echo core, Alerts core
- Audio unlock + bus stub + Game Over silence
- Baseline stickers + Accessibility Mode persistence

**First playable gate:** epics **E00–E15** (through Wave) with Lane Defender live. Remaining MVP epics finish the v1 ship bar.

### Out of MVP (post-MVP)

- Full game-feel polish · SFX \`.ogg\` production · media pack expansion
- Optional Pixabay/Pexels/Jamendo APIs · Playwright E2E
- Deferred art (wordmark kerning, animated Start Page stickers) · balance playtest retunes

### Hard rules

1. Each task starts with a **failing** test encoding the owning def.
2. Glossary from \`CONTEXT.md\` in types/tests.
3. Minigame runtime stays asset-agnostic.
4. This board issue does not include feature code — scaffold begins on E00.T01.

---

## MVP epics (ordered)

${mvpEpics.map(fmtEpic).join('\n')}

---

## Post-MVP epics (ordered)

${postEpics.map(fmtEpic).join('\n')}

---

## How to work a task

1. Claim the first unblocked open task (native \`blocked_by\` + epic order).
2. Read owning defs + \`CONTEXT.md\`.
3. Write the failing test named in the task body.
4. Minimal code → refactor → PR.
5. Close the task when green; next task unblocks.
`
}

const published = {
  createdAt: new Date().toISOString(),
  epics: [],
  scope: null,
}

// 1) Create epics, then their tasks (with sequential blocked_by + sub-issue links)
for (const epic of board.epics) {
  const scopeTag = epic.scope === 'mvp' ? 'MVP' : 'POST-MVP'
  const epicIssue = createIssue(
    `[EPIC][${scopeTag}] ${epic.id} — ${epic.title}`,
    epicBody(epic),
  )

  const epicRecord = {
    id: epic.id,
    scope: epic.scope,
    number: epicIssue.number,
    idDb: epicIssue.id,
    title: epic.title,
    url: epicIssue.url,
    tasks: [],
  }

  let prev = null
  for (const task of epic.tasks) {
    const taskIssue = createIssue(
      `[TASK][${scopeTag}] ${task.id} — ${task.title}`,
      taskBody(epic, task, epicIssue.number, prev?.number),
    )
    try {
      addSubIssue(epicIssue.number, taskIssue.id)
    } catch (err) {
      console.warn(`sub_issue failed #${epicIssue.number}←#${taskIssue.number}:`, String(err))
    }
    if (prev) {
      try {
        addBlockedBy(taskIssue.number, prev.idDb)
      } catch (err) {
        console.warn(`blocked_by failed #${taskIssue.number}←#${prev.number}:`, String(err))
      }
    }
    const taskRecord = {
      id: task.id,
      number: taskIssue.number,
      idDb: taskIssue.id,
      title: task.title,
      url: taskIssue.url,
      failingTest: task.failingTest,
    }
    epicRecord.tasks.push(taskRecord)
    prev = taskRecord
  }

  published.epics.push(epicRecord)
}

// 2) Epic-level dependencies: each epic blocked by previous epic's last task (MVP chain + post-mvp chain separately)
function wireEpicChain(epics) {
  for (let i = 1; i < epics.length; i++) {
    const prev = epics[i - 1]
    const cur = epics[i]
    const blocker = prev.tasks[prev.tasks.length - 1]
    if (!blocker) continue
    try {
      addBlockedBy(cur.number, blocker.idDb)
      // also block first task of current epic by previous epic last task
      if (cur.tasks[0]) addBlockedBy(cur.tasks[0].number, blocker.idDb)
    } catch (err) {
      console.warn(`epic chain failed ${prev.id}→${cur.id}:`, String(err))
    }
  }
}

wireEpicChain(published.epics.filter((e) => e.scope === 'mvp'))
wireEpicChain(published.epics.filter((e) => e.scope === 'post-mvp'))
// Post-MVP starts after last MVP epic
const mvp = published.epics.filter((e) => e.scope === 'mvp')
const post = published.epics.filter((e) => e.scope === 'post-mvp')
if (mvp.length && post.length) {
  const lastMvpTask = mvp[mvp.length - 1].tasks.slice(-1)[0]
  try {
    addBlockedBy(post[0].number, lastMvpTask.idDb)
    if (post[0].tasks[0]) addBlockedBy(post[0].tasks[0].number, lastMvpTask.idDb)
  } catch (err) {
    console.warn('mvp→post-mvp chain failed:', String(err))
  }
}

// 3) Scope index last (complete numbers)
const scopeIssue = createIssue(board.meta.title, scopeBody(published))
published.scope = {
  number: scopeIssue.number,
  idDb: scopeIssue.id,
  url: scopeIssue.url,
  title: scopeIssue.title,
}

// Attach epics as sub-issues of scope
for (const epic of published.epics) {
  try {
    addSubIssue(scopeIssue.number, epic.idDb)
  } catch (err) {
    console.warn(`scope sub_issue failed for ${epic.id}:`, String(err))
  }
}

writeFileSync(outPath, JSON.stringify(published, null, 2) + '\n')
console.log(`\nBoard index: ${scopeIssue.url}`)
console.log(`Wrote ${outPath}`)
