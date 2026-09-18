/**
 * LenisIsland — the ONE React island (Phase 1 Task 1-3, A16).
 * Visible `Lenis island live` card doubling as hydration proof (NO Counter, NO Framer). Title locked by Task 1-3; status lines VI per F09.
 * Motion wiring lives in ../lib/lenis-init (singleton shared with the BaseLayout
 * inline script); this island only triggers init on mount and tears down on
 * unmount (E13). Direct bundle now via client:load; per-island lazy deferred
 * to Phase 10 (E11). NO parallax/pinning/scrub (E10).
 * NOTE: zero top-level window/document/matchMedia here (E03) — all inside useEffect.
 */
import { useEffect, useState } from 'react';
import { initLenis } from '../lib/lenis-init';

export default function LenisIsland() {
  // Hydration proof: flips only after client mount (SSR renders `false`).
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
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
    <aside className="card" aria-label="Lenis" data-lenis-island>
      <b>Lenis island live.</b>
      <p className="small">Cuộn mượt và êm. Tự tắt hiệu ứng khi bạn bật giảm chuyển động.</p>
      <p className="small" aria-live="polite" data-hydrated={hydrated ? 'true' : 'false'}>
        {hydrated ? 'Đã tải · cuộn mượt.' : 'Đang tải…'}
      </p>
      <details>
        <summary>Ghi chú kỹ thuật</summary>
        <p className="small">
          <code>
            dynamic import, lenis.on('scroll', ScrollTrigger.update) for ScrollTrigger sync, single
            gsap.ticker loop, ~1.2s expo-out, reduced-motion off.
          </code>
        </p>
      </details>
    </aside>
  );
}
