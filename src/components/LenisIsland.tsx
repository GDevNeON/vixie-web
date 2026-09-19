/**
 * LenisIsland — the ONE React island (Phase 1 Task 1-3, A16).
 * Visible `Lenis island live` card doubling as hydration proof (NO Counter, NO Framer). Title locked by Task 1-3; status lines VI per F09.
 * Motion wiring lives in ../lib/lenis-init (singleton shared with the BaseLayout
 * inline script); this island only triggers init on mount and tears down on
 * unmount (E13). Direct bundle now via client:load; per-island lazy deferred
 * to Phase 10 (E11). NO parallax/pinning/scrub (E10).
 * NOTE: zero top-level window/document/matchMedia here (E03) — all inside useEffect.
 * Phase 2 Task 2-2 (FOUN-09/11): bilingual copy via `lang` prop + dict
 * (E13 — summary is a disclosure button, VI-only on EN failed bilingual);
 * NO aria-live (E17 — no live regions, aria-pressed suffices); explicit
 * reduced-motion guard FIRST in the effect (E01 motion-guard sweep).
 */
import { useEffect, useState } from 'react';
import { initLenis } from '../lib/lenis-init';
import { ui } from '../i18n/ui';

export default function LenisIsland({ lang = 'vi' }: { lang?: keyof typeof ui }) {
  // Hydration proof: flips only after client mount (SSR renders `false`).
  const [hydrated, setHydrated] = useState(false);
  const copy = ui[lang] ?? ui.vi;

  useEffect(() => {
    // Motion-guard FIRST (Task 2-2, E01): never touch motion under reduce.
    // initLenis re-checks internally + settles reveals; this explicit FIRST
    // matchMedia keeps the grep audit green (guard ≤10 lines above motion init).
    if (
      typeof window !== 'undefined' &&
      typeof window.matchMedia !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setHydrated(true);
      return;
    }
    let cleanup: (() => void) | undefined;
    let alive = true;
    initLenis()
      .then((fn) => {
        if (alive) cleanup = fn;
        else fn();
      })
      .catch(() => {
        // initLenis already noops on reduced-motion/failure; native scroll remains.
      });
    setHydrated(true);
    return () => {
      alive = false;
      cleanup?.();
    };
  }, []);

  return (
    <aside className="card" aria-label={copy['lenis.label']} data-lenis-island>
      <b>{copy['lenis.title']}</b>
      <p className="small">{copy['lenis.body']}</p>
      <p className="small" data-hydrated={hydrated ? 'true' : 'false'}>
        {hydrated ? copy['lenis.loaded'] : copy['lenis.loading']}
      </p>
      <details>
        <summary>{copy['lenis.note']}</summary>
        <p className="small">
          <code>
            dynamic import, lenis scroll sync for ScrollTrigger, single ticker loop, ~1.2s
            expo-out, reduced-motion off.
          </code>
        </p>
      </details>
    </aside>
  );
}
