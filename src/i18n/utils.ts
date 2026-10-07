/**
 * src/i18n/utils.ts — Phase 2 Task 0-2 (FOUN-07 foundation, covers V3).
 * Recipe helpers per Astro i18n docs (02-RESEARCH.md §1.4, B04 pitfall note:
 * `getLangFromUrl` / `useTranslations` are project-authored, NOT Astro
 * exports — no `astro:i18n` import here).
 */
import { ui, defaultLang } from './ui';

export type UIDict = Record<keyof typeof ui['vi'], string>;
export const _enCoversDefault: UIDict = ui.en;

export function getLangFromUrl(url: URL): keyof typeof ui {
  const [, lang] = url.pathname.split('/');
  return lang in ui ? (lang as keyof typeof ui) : defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof UIDict, vars?: Record<string, string>): string {
    const table: Record<string, string> = ui[lang] as Record<string, string>;
    let s = key in table ? table[key] : ui[defaultLang][key];
    for (const [k, v] of Object.entries(vars ?? {})) s = s.replace(`{${k}}`, v);
    return s;
  };
}
