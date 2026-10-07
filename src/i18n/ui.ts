/**
 * src/i18n/ui.ts — Phase 2 Task 0-2 (FOUN-07 foundation, covers V3).
 * Locked copy: 02-UI-SPEC.md §11 (VI + EN user-signed 2026-09-18).
 * Shape: flat `lowercase.dot` keys grouped by region prefix (nav/hero/lenis/
 * docs/notfound/footer/burger/switcher/theme/skip/meta) — logical nesting per
 * B02, physical flat per the Astro i18n recipe (02-RESEARCH.md §1.4) so
 * `keyof UIDict` stays a leaf-key union and the utils lookup is a plain
 * Record access. NO route translation (B-routes out): `/tokens` inside
 * header/hero copy is locked display text, never a URL mapping.
 * Brand `VIXIE`/`Vixie` untranslated (B19); fonts untouched (B16).
 * Nothing imports this file yet — build output identical to pre-task.
 */
export const languages = {
  en: 'English',
  vi: 'Tiếng Việt',
} as const;

export const defaultLang = 'en';

export const ui = {
  en: {
    'nav.home': 'Home',
    'nav.experience': 'The experience',
    'nav.tokens': 'Tokens',
    'nav.docs': 'Docs',
    'nav.blog': 'Blog',
    'nav.download': 'Download',
    'nav.phase': 'Phase 2+',
    'nav.label': 'Main',
    'nav.progress': 'Scroll progress',
    'nav.brand': 'Vixie home',
    'header.cta': 'View /tokens',
    'hero.kicker': 'Phase 2 · FOUN-06..12 · EN default',
    'hero.title': 'An AI companion living on your wallpaper',
    'hero.lead':
      'Phase 2 ships the living frame in two languages: smooth scroll, true tokens, full shell. The app unlocks the download.',
    'hero.primary': 'Download Now',
    'hero.phase': 'Phase 2',
    'hero.secondary': 'Watch Demo',
    // Phase 3 Task 0-2 (LAND-01): hero.* dict slots EN-first (A13), proposal-only
    // until user approves (A19/E20). H1 6-10 words with wallpaper + 1x AI, no
    // Vixie name, no !/? (A01-A05/A17). Sub 1 sentence + Android/Windows (A07/A08/A10).
    // Greeting ___ via {name}. Nothing imports these keys yet (shell-only).
    'hero.eyebrow': 'Companion app — Android + Windows',
    'hero.sub':
      'Pick a character, pin to your screen, talk every day on Android and Windows.',
    'hero.greeting': "Hi, I'm {name}!",
    'hero.role': 'Your everyday companion',
    'hero.note.illustration': 'Illustrative character',
    'hero.note.ai': 'AI character, not a real person',
    'hero.cue': 'Scroll',
    'hero.toast.thanks': 'Thanks! Taking you to download…',
    'hero.error.body': "Couldn't open the link. Please retry.",
    'hero.error.retry': 'Retry',
    'hero.coming.title': 'Coming soon',
    'hero.coming.body': "Coming soon — stay here, we'll point you when links land.",
    'lenis.title': 'Lenis island live.',
    'lenis.body':
      'Smooth and gentle scrolling. Effects switch off when you enable reduced motion.',
    'lenis.note': 'Technical note',
    'lenis.loading': 'Loading…',
    'lenis.loaded': 'Loaded · smooth scroll.',
    'lenis.label': 'Lenis',
    'docs.sidebar': 'Docs sidebar · placeholder',
    'docs.setup': '— Setup',
    'docs.start': '— Start',
    'docs.customize': '— Customize',
    'docs.faq': '— FAQ',
    'notfound.title': '404 ·',
    'notfound.body': 'Page not found.',
    'notfound.home': 'Back to home.',
    'footer.blurb':
      'Cinematic promo site. EN default + VI. Stack: Astro 5 · Tailwind 4 · Lenis + GSAP · Plex VI.',
    'footer.shell': 'Vixie · shell',
    'footer.site': 'Site · Phase 2+',
    'footer.landing': 'Landing',
    'footer.docs': 'Docs',
    'footer.blog': 'Blog',
    'footer.download': 'Download',
    'footer.legal': 'Legal · Phase 2+',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
    'footer.content': 'Content',
    'footer.changelog': 'Changelog',
    'footer.meta': 'Meta',
    'footer.supportcontact': 'Support · Contact · Phase 2+',
    'footer.support': 'Support',
    'footer.contact': 'Contact',
    'footer.rights': '© {year}',
    'burger.menu': 'MENU',
    'burger.close': 'CLOSE',
    'burger.open.label': 'Open menu',
    'burger.close.label': 'Close menu',
    'switcher.vi': 'VI',
    'switcher.en': 'EN',
    'switcher.label': 'Switch language: Vietnamese / English',
    'theme.label': 'Toggle light / dark mode',
    'skip.link': 'Skip to content',
    'main.label': 'Main content',
    'meta.title': 'Vixie Web — Phase 2',
    'meta.description':
      'Phase 2 ships the living frame in two languages: smooth scroll, true tokens, full shell. The app unlocks the download.',
  },
  vi: {
    'nav.home': 'Trang chủ',
    'nav.experience': 'Trải nghiệm',
    'nav.tokens': 'Tokens',
    'nav.docs': 'Tài liệu',
    'nav.blog': 'Blog',
    'nav.download': 'Tải về',
    'nav.phase': 'Phase 2+',
    'nav.label': 'Chính',
    'nav.progress': 'Tiến độ cuộn',
    'nav.brand': 'Vixie home',
    'header.cta': 'Xem /tokens',
    'hero.kicker': 'Phase 1 · FOUN-01..05 · VI first',
    'hero.title': 'Bạn AI sống trên hình nền của bạn',
    'hero.lead':
      'Phase 1 giao khung sống: cuộn mượt, tokens chuẩn, shell đủ. Tải app mở Phase 2.',
    'hero.primary': 'Tải ngay',
    'hero.phase': 'Phase 2',
    'hero.secondary': 'Xem demo',
    // Phase 3 Task 0-2 (LAND-01): hero.* dict slots VI, Việt hóa hết (A15).
    // H1 6-10 chữ, có hình nền + AI 1 lần, không tên Vixie, không !/?.
    // Sub 1 câu cách-dùng + Android/Windows. Greeting ___ via {name}.
    'hero.eyebrow': 'Ứng dụng bạn đồng hành — Android + Windows',
    'hero.sub':
      'Chọn nhân vật, đặt lên màn hình, trò chuyện mỗi ngày trên Android và Windows.',
    'hero.greeting': 'Chào bạn, mình là {name}!',
    'hero.role': 'Bạn đồng hành mỗi ngày',
    'hero.note.illustration': 'Nhân vật minh họa',
    'hero.note.ai': 'Nhân vật AI, không phải người thật',
    'hero.cue': 'Cuộn xuống',
    'hero.toast.thanks': 'Cảm ơn bạn! Đang đưa tới trang tải…',
    'hero.error.body': 'Chưa mở được liên kết. Thử lại giúp mình nhé.',
    'hero.error.retry': 'Thử lại',
    'hero.coming.title': 'Sắp ra mắt',
    'hero.coming.body': 'Sắp ra mắt — để lại trang này, tụi mình báo khi có link nhé.',
    'lenis.title': 'Lenis island live.',
    'lenis.body': 'Cuộn mượt và êm. Tự tắt hiệu ứng khi bạn bật giảm chuyển động.',
    'lenis.note': 'Ghi chú kỹ thuật',
    'lenis.loading': 'Đang tải…',
    'lenis.loaded': 'Đã tải · cuộn mượt.',
    'lenis.label': 'Lenis',
    'docs.sidebar': 'Thanh bên Docs · chỗ giữ',
    'docs.setup': '— Cài đặt',
    'docs.start': '— Bắt đầu',
    'docs.customize': '— Tùy chỉnh',
    'docs.faq': '— FAQ',
    'notfound.title': '404 ·',
    'notfound.body': 'Không tìm thấy trang.',
    'notfound.home': 'Về trang chủ.',
    'footer.blurb':
      'Promo site điện ảnh. VI mặc định + EN Phase 2. Stack: Astro 5 · Tailwind 4 · Lenis + GSAP · Plex VI.',
    'footer.shell': 'Vixie · shell',
    'footer.site': 'Site · Phase 2+',
    'footer.landing': 'Landing',
    'footer.docs': 'Docs',
    'footer.blog': 'Blog',
    'footer.download': 'Download',
    'footer.legal': 'Legal · Phase 2+',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
    'footer.content': 'Content',
    'footer.changelog': 'Changelog',
    'footer.meta': 'Meta',
    'footer.supportcontact': 'Support · Contact · Phase 2+',
    'footer.support': 'Support',
    'footer.contact': 'Contact',
    'footer.rights': '© {year}',
    'burger.menu': 'MENU',
    'burger.close': 'ĐÓNG',
    'burger.open.label': 'Mở menu',
    'burger.close.label': 'Đóng menu',
    'switcher.vi': 'VI',
    'switcher.en': 'EN',
    'switcher.label': 'Chuyển ngôn ngữ: Tiếng Việt / English',
    'theme.label': 'Chuyển chế độ sáng / tối',
    'skip.link': 'Bỏ qua tới nội dung',
    'main.label': 'Nội dung chính',
    'meta.title': 'Vixie Web — Phase 1',
    'meta.description':
      'Phase 1 giao khung sống: cuộn mượt, tokens chuẩn, shell đủ. Tải app mở Phase 2.',
  },
} as const;
