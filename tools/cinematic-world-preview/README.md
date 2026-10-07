# Cinematic world source preview

The primary site now runs through Astro: from `vixie-web`, use `npm run dev` and open `/en/` or `/vi/`. The Astro demo keeps chat in sample mode unless its approved backend is configured.

This optional server is only for previewing the original standalone sketch, including its local sample chat endpoint. Run it with `node tools/cinematic-world-preview/server.mjs` from `vixie-web`; by default it reads `../vixie-web-planning/sketches/002-cinematic-world/` as a sibling checkout and does not edit that source. Set `VIXIE_CINEMATIC_SKETCH_ROOT` if your sketch lives elsewhere.

For the optional local OpenRouter path, copy `.env.example` to `.env` in this directory, set `OPENROUTER_API_KEY`, then run `node --env-file=tools/cinematic-world-preview/.env tools/cinematic-world-preview/server.mjs` from `vixie-web`. The key stays server-side. This server is local-only and does not configure VixieWeb's production chat endpoint.
