/**
 * Lenis + GSAP ScrollTrigger cinematic wiring (Phase 1 Task 1-3, FOUN-05).
 *
 * E04 cinematic: duration 1.2 + expo-out easing (touch stays native).
 * E05 single shared loop: lenis.on('scroll', ScrollTrigger.update) +
 * gsap.ticker.add((t) => lenis.raf(t * 1000)) + lagSmoothing(0). NO separate
 * requestAnimationFrame (double-raf = jitter/scrub-freeze).
 * E06 ScrollTrigger registered. E07 in-page anchors via lenis.scrollTo offset -64.
 * E08 reduced-motion: skip construction entirely + settle reveals (CSS strips
 * transitions). E12 sticky/overflow: Lenis scrolls the real document (no
 * scrollerProxy) — keep html/body overflow visible; inner native scrollers opt
 * out via data-lenis-prevent; sticky header works natively.
 * E13 destroy on pagehide + island unmount, NO View Transitions.
 * E10: NO parallax/particles/pinning/scrub in Phase 1 (Phase 4 owns).
 * Singleton: window.__lenis + <html data-lenis-init>, shared by the BaseLayout
 * inline script and the React island (separate bundles, one instance).
 */

import type Lenis from 'lenis';

declare global {
  interface Window {
    __lenis?: Lenis | undefined;
  }
}

type Cleanup = () => void;
const noop: Cleanup = () => {};

/** Force reveal targets settled (visible) when smooth scroll stays off. */
function settleReveals(doc: Document): void {
  doc.querySelectorAll('.rv.armed').forEach((el) => {
    el.classList.remove('armed');
    el.classList.add('in');
  });
}

export async function initLenis(): Promise<Cleanup> {
  // E03: zero top-level window/document/matchMedia — everything guarded in here.
  if (typeof window === 'undefined' || typeof document === 'undefined') return noop;
  const doc = document;

  // Singleton guard shared between inline script + island.
  if (window.__lenis || doc.documentElement.hasAttribute('data-lenis-init')) return noop;

  // E08: reduced-motion skips construction entirely; content stays settled + native.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    settleReveals(doc);
    return noop;
  }

  // Sync claim first: dynamic imports below are async, so a second concurrent
  // caller must see the claim before the instance exists.
  doc.documentElement.setAttribute('data-lenis-init', 'true');

  let LenisCtor: typeof Lenis;
  let gsap: typeof import('gsap').default;
  let ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger;
  try {
    const [lenisMod, gsapMod, stMod] = await Promise.all([
      import('lenis'),
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]);
    LenisCtor = lenisMod.default;
    gsap = gsapMod.default;
    ScrollTrigger = stMod.ScrollTrigger;
  } catch {
    doc.documentElement.removeAttribute('data-lenis-init');
    return noop;
  }

  // Task 2-2 motion-guard sweep (E01): re-check reduce FIRST before touching
  // ANY motion API — the OS setting may flip during the async imports above.
  // Grep audit: every `new Lenis` / gsap site below sits ≤10 lines under guard.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    doc.documentElement.removeAttribute('data-lenis-init');
    settleReveals(doc);
    return noop;
  }

  gsap.registerPlugin(ScrollTrigger); // E06

  const lenis = new LenisCtor({
    duration: 1.2, // E04 cinematic
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
    smoothWheel: true,
  });
  window.__lenis = lenis;

  lenis.on('scroll', ScrollTrigger.update); // E05-1
  // E05-2 single shared loop: gsap ticker runs in SECONDS, lenis wants MS.
  const raf = (time: number): void => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  // E07: in-page anchors glide with sticky-header offset; native fallback when off.
  const onClick = (ev: MouseEvent): void => {
    const target = ev.target;
    if (!(target instanceof Element)) return;
    const anchor = target.closest('a[href^="#"]');
    if (!(anchor instanceof HTMLAnchorElement)) return;
    const hash = anchor.getAttribute('href');
    if (!hash || hash === '#') return;
    let dest: Element | null = null;
    try {
      dest = doc.querySelector(hash);
    } catch {
      return; // invalid selector — leave native behavior alone
    }
    if (!dest) return;
    ev.preventDefault();
    const active = window.__lenis;
    if (active) active.scrollTo(dest as HTMLElement, { offset: -64 });
    else dest.scrollIntoView();
  };
  doc.addEventListener('click', onClick);

  // E13: full teardown on pagehide (island unmount returns the same cleanup).
  const cleanup: Cleanup = () => {
    doc.removeEventListener('click', onClick);
    gsap.ticker.remove(raf);
    lenis.destroy();
    if (window.__lenis === lenis) window.__lenis = undefined;
    doc.documentElement.removeAttribute('data-lenis-init');
    window.removeEventListener('pagehide', cleanup);
  };
  window.addEventListener('pagehide', cleanup, { once: true });

  return cleanup;
}
