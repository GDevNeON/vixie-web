# Vixie Web

Astro 5 + React + Tailwind CSS v4 + MDX (install-only). Node 20.x (see `.nvmrc`).

```sh
npm create astro@latest -- --template minimal
```

## Commits

Conventional commits: `feat:`, `fix:`, `chore:` (e.g. `feat: add tokens page`).

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Fonts (Phase 1 Task 2-1)

Self-hosted IBM Plex Sans 400/500/600/700 + Mono 400/500/600 (latin+vietnamese,
14 × woff2 in `public/fonts/`, total <200KB). Source-of-files-only via
`@fontsource/ibm-plex-sans` + `@fontsource/ibm-plex-mono`; no `@fontsource`
imports in prod code. License: SIL Open Font License 1.1 — upstream
https://github.com/IBM/plex. See `public/fonts/README`.

## Phase 1 DoD (scaffold + design tokens)

Live URL: `https://wallpapervixieai.vercel.app` (verified 200 on `/` + `/tokens`, 2026-09-18).

| # | Criterion | Status |
|---|-----------|--------|
| 1 | `npm run dev` serves Astro + React islands | ✅ |
| 2 | Tailwind 4 CMYK tokens on `/tokens` | ✅ |
| 3 | Plex self-hosted, 2 preloads, no swap (191,212 B) | ✅ |
| 4 | Consistent header/footer shell (`/` + `/tokens` + 404) | ✅ |
| 5 | Lenis + ScrollTrigger, reduced-motion kill | ✅ |
| 6 | Vercel live from `vixie-web` | ✅ `https://wallpapervixieai.vercel.app` |

Full V1..V8 truth table: `.planning/phase-01-baseline.md`.

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
