# Phase 2 — Baseline (Task 2-4: responsive guards + e2e matrix + Lighthouse)

Date: 2026-09-18 · Repo: `vixie-web` · Workdir: `D:\Projects\Flutter\VixieAI\VixieWeb\vixie-web`
Scope: Task 2-4 ONLY (FOUN-08 + verify). Task 2-5 appends the full V1..V10 sweep + DoD below.

Suite: `npm run check && npm run build && npm run test:e2e` — ALL GREEN this task:
- `npm run check`: 0 errors / 0 warnings / 0 hints (32 files).
- `npm run build`: 9 pages (`/`, `/404`, `en|vi` × `index|tokens|docs|404`).
- `npm run test:e2e`: **111 passed, 0 failed** (37 tests × 3 viewport projects:
  chromium-phone 375×667, chromium-tablet 768×1024, chromium-desktop 1440×900),
  incl. new `theme.spec.ts` (4), `a11y.spec.ts` (11), `responsive.spec.ts` (5),
  extended `motion.spec.ts` (+2) and `shell.spec.ts` (+1 F14), fixed `routes.spec.ts:19`.

## V4/V5/V6/V8/V10 Evidence (Task 2-4 slice)

| V-ID | Criterion | Evidence | Verdict |
|------|-----------|----------|---------|
| V4 | 375/768/1440 correct + 320 guard + 200% zoom | `responsive.spec.ts`: `/vi/` + `/en/` zero page h-scroll at 320px floor (scrollWidth ≤ innerWidth+1), header/footer/h1 visible at 375+768+1440, burger owns nav at 375 (hidden → open panel → Escape). `.shell` padding 24px desktop → 16px mobile (C16, inside existing 920px query; computed-style verified @1440=24px, @375=16px). Manual spots: 200%-zoom equiv (720px) no overflow both locales; landscape 667×375 header+burger visible, no overflow. Screenshots: `screenshots/phase2-{vi,en}-{375,768,1440}.png` (6 files). | ✅ green |
| V5 | reduced-motion kills Lenis/CSS, reveals settle | `motion.spec.ts` (reduce emulated): `__lenis` undefined + no `data-lenis-init` on `/en/`+`/vi/`, zero `.rv.armed`, native scroll works, **zero console/page errors**, body transition collapses to `0s` (theme instant under reduce). | ✅ green |
| V6 | theme toggle persists, defaults to OS | `theme.spec.ts`: toggle→reload persists dark/light + `vixie-theme` key asserts (`dark`/`light`/null), OS dark → initial `.dark`, OS light → initial light, body transition exactly `0.18s` (180ms token, never instant). | ✅ green |
| V8 | axe 0 critical/serious on samples ×2 themes | `a11y.spec.ts`: AxeBuilder wcag2a+wcag2aa on 5 samples (`/en/`, `/vi/`, `/en/tokens`, `/vi/tokens`, `/en/docs`) × light+dark = 10 runs → 0 critical/serious; skip-link first Tab stop, `top:12px` on focus, Enter moves focus to `#main`. Moderate/minor logged, not gated. Gate fix: `/en/docs` failed `serious:link-in-text-block` (inline `.docs-link` in text `<p>`) → underline always-on in `en|vi/docs/index.astro` (Task 2-2 footer-`.mail` precedent), re-run green. | ✅ green |
| V10 | zero analytics + Lighthouse baseline (NO gate) | `shell.spec.ts` F14: all 10 built HTML files (`index`, `404`, `en|vi` × `index|tokens|docs|404`) grep 0 analytics strings; live-DOM check kept. Lighthouse ONCE on `/en/` (below), recorded only. | ✅ green (baseline, no gate) |

## Lighthouse Baseline — `/en/` (reference only, NOT a gate)

Tool: `npx lighthouse` 13.4.1 · mobile formFactor (simulated throttling) ·
HeadlessChrome 153 (Playwright chromium) · fetch 2026-09-18T11:37:58Z ·
local preview build (`astro preview` on `dist/`, NOT production URL).

| Category | Score |
|----------|-------|
| Performance | 0.96 |
| Accessibility | 1.00 |
| Best Practices | 1.00 |
| SEO | 1.00 |

FCP 2.0s (0.85) · LCP 2.3s (0.93) · TBT 40ms (1.00) · CLS 0.039 (0.99) ·
Speed Index 2.0s (0.99) · TTI 2.7s (0.97). Raw JSON: TEMP `lh-en.json` (not committed).

## Known / Hand-off to Task 2-5

- **Predicted 2-5 finding (verified by probe, NOT fixed here — 404 samples belong to the
  2-5 sweep):** `/en/404/` + `/vi/404/` fire `serious:link-in-text-block` in BOTH themes
  (same inline-link-in-text shape: `.miss p > a`). One-line fix, same precedent:
  underline always-on for `.miss a` (lives in `src/pages/404.astro`,
  `src/pages/en/404.astro`, `src/pages/vi/404.astro` scoped styles + global
  `.dark .miss a`). 2-5 must apply it when adding the 404 axe samples, or drop it
  here if 2-5 prefers — do NOT let it stay red silently.
- `routes.spec.ts:19` fixed as spec owner: unprefixed unknown path serves the root 404
  which is EN by default (A01) — asserts `lang="en"` + `Back to home.` (was: VI copy).
- `02-RESEARCH.md` on disk is truncated mid-§2.3 (ends at "Anti-FOUC head script (D09,
  matches Tailwind docs \"resp" + a literal `[truncated 7375 chars]` marker) — §3, §5.2,
  §6 unreadable. Task 2-4 proceeded from the acceptance criteria + UI-SPEC §7/C16 +
  VALIDATION V-rows, all self-contained. Recommend re-generating the missing sections
  before 2-6.
- Env note: Node v22.20.0 on this machine (plan pins 20.x via `.nvmrc`/engines).
- No `package.json`/config changes: Lighthouse ran via `npx --yes lighthouse` (npm cache
  only); screenshots via TEMP-dir script (no repo temp files). Repo diff = 1 CSS rule +
  2 one-rule docs fixes + e2e specs + 6 screenshots + this file.

---

# Phase 2 — Task 2-5 Sweep Log: Final V1..V10 + DoD (2026-09-18)

Scope: Task 2-5 ONLY (FOUN-06..FOUN-12 sweep over the translated+themed shell).
Depends on 2-2 + 2-3 + 2-4, all landed (uncommitted on `main` with this task).

## Suite (acceptance #1) — ALL GREEN

- `npm run check`: 0 errors / 0 warnings / 0 hints (32 files).
- `npm run build`: 9 pages (`/`, `/404`, `en|vi` × `index|tokens|docs|404`).
- `npm run test:e2e`: **129 passed, 0 failed** (43 tests × 3 viewport projects:
  chromium-phone 375×667, chromium-tablet 768×1024, chromium-desktop 1440×900),
  up from 111 in 2-4: +18 = 3 new axe samples (`/vi/docs`, `/en/404`, `/vi/404`)
  × 2 themes × 3 projects.

## Fix applied (2-4 hand-off → CLOSED)

- `/en/404` + `/vi/404` (+ root `404.astro`) fired `serious:link-in-text-block`
  in BOTH themes (same inline-link-in-text shape as the 2-4 `/en/docs` find).
  Fix, same precedent as footer `.mail` + docs `.docs-link`: `.miss a`
  underline always-on + `text-underline-offset: 3px` in all three 404 files
  (dark color already swaps via the global `.dark .miss a` rule).
- Verified: targeted 4-run probe (`a11y.spec -g 404`, desktop) green BEFORE the
  full suite, then all 12 404 axe runs green inside the 129.

## V1..V10 truth table (acceptance #2) — ALL GREEN, zero partial (dark never partial)

| V-ID | Criterion | Evidence | Verdict |
|------|-----------|----------|---------|
| V1 | `/vi/*` + `/en/*` resolve; `/` → `/en/` | `i18n.spec.ts`: `/`→`/en/` + lang; 6 locale URLs 200 + `html[lang]`; `/tokens` 404; `dist/` has `en/` + `vi/` + redirect stub | ✅ green |
| V2 | switcher swaps prefix, keeps path/query/hash | `/vi/tokens?a=1#s` ↔ `/en/tokens?a=1#s` both directions; `/vi/`=`Trang chủ`, `/en/`=`Home`; missing-route → homepage allowlist | ✅ green |
| V3 | dict type-safe; all shell strings translated | Tripwire `_enCoversDefault: UIDict = ui.en` + NEGATIVE PROOF re-run in this sweep: deleted `main.label` from EN → `check` 2 errors exit 1 → restored → green (`git diff` on `ui.ts` = empty); chrome 100% via `t()` | ✅ green |
| V4 | 375/768/1440 + 320 guard + 200% zoom | `responsive.spec.ts` (2-4, untouched): zero h-scroll @320 floor, header/footer/h1 @3 sizes, burger owns nav @375; `.shell` 24px→16px | ✅ green |
| V5 | reduced-motion kills Lenis/GSAP/CSS | `motion.spec.ts` (2-4, untouched): `__lenis` undefined, zero `.rv.armed`, native scroll, body transition → `0s`, zero console errors | ✅ green |
| V6 | theme persists, defaults to OS | `theme.spec.ts` (2-4, untouched): toggle→reload persists + `vixie-theme` asserts, OS dark/light initial, 180ms token transition | ✅ green |
| V7 | skip-link first-tab → `#main` | `a11y.spec.ts` V7 (untouched): first Tab stop, `top:12px` on focus, Enter moves focus to `#main` | ✅ green |
| V8 | axe 0 critical/serious ×2 themes | `a11y.spec.ts`: **8 samples** (`/en/`, `/vi/`, `/en/tokens`, `/vi/tokens`, `/en/docs`, `/vi/docs`, `/en/404`, `/vi/404`) × light+dark = **16 runs**, 0 critical/serious; advisory logged only | ✅ green |
| V9 | live + per-locale 404 proven | Local preview: `/en/404` + `/vi/404` 200 with exact §11 copy + home link; unknown route → root 404 (EN default, A01); production URL recorded STALE (see Live section) — re-verify after push | ✅ green (build evidence; live leg pending deploy) |
| V10 | zero analytics + Lighthouse baseline (NO gate) | `shell.spec.ts` F14: 10 built HTML files grep 0 analytics strings; Lighthouse carried from 2-4 (Perf 0.96 / A11y 1.00 / BP 1.00 / SEO 1.00, LCP 2.3s — reference only, not re-run) | ✅ green |

## DoD — 7/7 ROADMAP criteria ✅ + live URL recorded (F11)

| # | Criterion | Verdict |
|---|-----------|---------|
| 1 | Prefixed routes `/en/` + `/vi/` resolve | ✅ V1 |
| 2 | Switcher keeps page context | ✅ V2 |
| 3 | Type-safe dict | ✅ V3 (+ negative proof) |
| 4 | 3 viewports correct | ✅ V4 |
| 5 | Reduced-motion honored | ✅ V5 |
| 6 | Persist + OS theme | ✅ V6 |
| 7 | Axe base clean | ✅ V8 (8×2 matrix) |

## Live URL (F11) — RECORDED AS STALE, re-verify after push

`curl` 2026-09-18 (production `https://wallpapervixieai.vercel.app`):

| Path | Status | Note |
|------|--------|------|
| `/` | 200 (10,897 B) | Phase 1 build still served |
| `/tokens` | 200 (7,895 B) | Phase 1 build still served |
| `/en/` | **404** | Phase 2 tree uncommitted — Vercel never built it |
| `/vi/` | **404** | same |
| `/en/nope-xyz` | 404 | same (probe against stale prod is not the 2-3 per-locale verdict) |

## Screenshots (acceptance #4) — 12 files, representative header/hero/footer set

- Light (2-4, carried): `screenshots/phase2-{en,vi}-{375,768,1440}.png`.
- Dark (this task): `screenshots/phase2-{en,vi}-{375,768,1440}-dark.png` —
  full-page via `npx playwright screenshot --color-scheme dark --full-page`
  against local preview, each gated on `--wait-for-selector html.dark`
  (OS-dark → `.dark` path, same mechanism as the V6 OS tests).
- Eyeballed `phase2-en-375-dark.png`: ink background, paper text, EN copy,
  switcher + sun/moon toggle + MENU in header, hero + Lenis card + footer —
  dark NEVER partial, confirmed visually.

## A01 doc debt (acceptance #5) — PAID HERE

- `vixie-web-planning/PROJECT.md`: "Vietnamese default" → "English default"
  (Active requirement) + "Vietnamese (default)" → "English (default)"
  (Constraints/i18n).
- `vixie-web-planning/REQUIREMENTS.md`: FOUN-06 same swap.
- `vixie-web-planning/STATE.md`: Phase 1 marked complete (FOUN-01..05),
  Phase 2 in progress with FOUN-06..12 checked (2-6 gate pending),
  i18n line → English default (A01).
- Residual, OUT OF SCOPE (not edited): `research/FEATURES.md:26` +
  planning `GEMINI.md:21` still read "Vietnamese default" — Phase-1-era
  research snapshot + agent config; flag for transition.

## F12 spill — NONE

No spill: `/en/docs` + `/vi/docs` stubs translated, full 16-run axe matrix
(incl. 404s) green. Zero V-partial rows.

## F15 — roadmap note, NOT scope

`polish-animation` before the Phase 3 hero stays a Phase 3 planning note;
no Phase 2 code. Owner: Phase 3.

## Hand-off to Task 2-6 (impeccable critique gate)

- Tree state: ALL Phase 2 work (tasks 0-1..2-5) is uncommitted on `main`
  (modified sources + specs + README, untracked `src/i18n/`, `src/pages/en|vi/`,
  4 new specs, 12 screenshots, this file). Recommend ONE Phase-2 commit AFTER
  the 2-6 gate so critique snapshots match the shipped tree — then push →
  Vercel rebuild → re-verify live `/en/` + `/vi/` 200 (closes the V9 live leg).
- 2-3 acceptance #4 (Vercel per-locale 404 probe on unknown `/en/*` `/vi/*`)
  is still open against a REAL deploy: run it on the post-push URL. Root
  locale-aware fallback (`404.astro` VI-swap) is the compliance vehicle if
  Vercel serves only the root 404.
- Env note carried: Node v22.20.0 on this machine (plan pins 20.x).
- 2-5 repo diff: 3 one-rule 404 underline fixes + `a11y.spec.ts` SAMPLES
  5→8 (+comment) + README Phase-2-DoD + 6 dark screenshots + this log.
  (`src/i18n/ui.ts` negative-proof touched + restored: `git diff` empty.)

---

# Phase 2 — Task 2-6 Score Log: Impeccable critique audit gate ≥90% (2026-09-18)

Scope: Task 2-6 ONLY (QUALITY RATCHET over the finished shell — 4 surfaces:
`/en/`+`/vi/` × light+dark, preview build `:4321`, same server shape as e2e).
Depends on 2-5 (DoD 7/7 green). Runs ON TOP of DoD.

Launcher: `impeccable.cmd context` OK (NO_PRODUCT_MD / no DESIGN.md — evaluate-only
run on incumbent implementation proceeds per SCOPED_EXISTING_ALLOWED; no init offered
as follow-up inside a gate run). Sub-agent/Task tool NOT exposed in this session →
degraded single-context run declared in every snapshot header (Assessment A then B
sequentially, never interleaved). No overlay-injection tool in session → Playwright
full-page captures + console/page-error listeners are the recorded fallback signal.

## No-regress re-verified this task

- `npm run check`: 0 errors / 0 warnings / 0 hints (33 files).
- `npm run build`: 9 pages green (same 9 as 2-5).
- `npm run test:e2e`: **129 passed, 0 failed** (43 × 3 viewport projects) — tracer 1-4
  green, DoD intact, Lighthouse carried 96/100/100/100 (reference only, not re-run).

## Critique totals (PASS BAR: ≥90% applicable max — percentage band, never raw)

Mode Persuade → H7 + H10 scored `n/a` with reason → applicable max **/32** → bar = **≥29/32**.

| Surface | Snapshot | Total | Band | Verdict |
|---------|----------|-------|------|---------|
| `/en/` light | `.impeccable/critique/2026-09-18T12-05-10Z__localhost-en.md` (+`surface-en-light.png`) | **30/32 = 93.8%** | Excellent | ✅ PASS |
| `/en/` dark | `.impeccable/critique/2026-09-18T12-05-10Z~0001__localhost-en.md` (+`surface-en-dark.png`) | **30/32 = 93.8%** | Excellent | ✅ PASS |
| `/vi/` light | `.impeccable/critique/2026-09-18T12-05-17Z__localhost-vi.md` (+`surface-vi-light.png`) | **30/32 = 93.8%** | Excellent | ✅ PASS |
| `/vi/` dark | `.impeccable/critique/2026-09-18T12-05-17Z~0001__localhost-vi.md` (+`surface-vi-dark.png`) | **30/32 = 93.8%** | Excellent | ✅ PASS |

Per-surface evidence (Playwright, preview `:4321`, zero console/page errors all four):
EN H1 `companion living on your wallpaper.` / VI H1 `bạn đồng hành sống trên hình nền.`;
dark captures carry `html.dark` via the OS-media pre-paint path (same mechanism as V6).

## Detector counts

- `impeccable detect --json src/` (full tree): exit **0**, findings **`[]`** → **0 warnings**,
  0 FP adjudications needed. Contrast/a11y hits: none (HARD FAIL path not triggered).
- Allowed-FP identity reasons (mono-caps labels, 5px strip, tight tracking): NOT INVOKED —
  nothing to excuse.

## Audit verdict

`.impeccable/critique/audit-2026-09-18.md` — **19/20 Excellent** (A11y 4 · Perf 3 ·
Theming 4 · Responsive 4 · Integrity 4). **Zero open P0/P1.** P2 ×3 + P3 ×2 logged:
hero mid-void (P2 → Ph3) · empty sample strip (P2 → Ph3/4) · VI H1 diacritic clearance
(P2 → Ph3) · icon-only theme toggle (P3, ACCEPTED per D11 lock) · LCP 2.3s headroom
(P3 → Ph10, F05 reference-only). Trivial fixes: none available without breaking
UI-SPEC locks — nothing withheld.

## Fix loops used: 0 of max 2 per surface

No surface scored <90%, no non-FP detector hit, no P0/P1 → no fix loop consumed on any
surface. Zero accepted-risk RED rows. Gate does not pass silently — it passes on evidence.

## V10 row: ✅ green · Task 2-6 gate: ✅ PASS

Phase 2 closes with 2-6 GREEN on top of 2-5 green (DoD 7/7 + live-URL re-verify after
push per 2-5 hand-off, unchanged by this task).
