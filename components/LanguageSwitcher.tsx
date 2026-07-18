'use client';
import { usePathname } from 'next/navigation';
import styles from './LanguageSwitcher.module.css';

type PageLang = 'ko' | 'en' | 'ja';

// 언어별 정적 페이지가 실제로 존재하는 최상위 라우트(app/[lang]/<slug>/page.tsx 목록과 동일하게 유지)
const STATIC_PAGES = new Set([
  'upcoming-games', 'pre-registration', 'new-servers', 'events',
  'mobile-games', 'pc-console-games', 'global-games',
  'about', 'guide', 'contact', 'privacy', 'terms',
  'wishlist', 'coupons', 'games', 'blog', 'news',
]);
// 항목별 상세 페이지(슬러그 하나 더 붙는 형태)가 존재하는 콘텐츠 타입
const DETAIL_TYPES = new Set(['game', 'blog', 'news']);

interface Parsed {
  lang: PageLang;
  // 'home' = /, 'static' = /upcoming-games 류, 'detail' = /game/[id] 류, 'unmapped' = 번역 라우트 없음(쿠폰 상세·게임 허브·admin 등)
  kind: 'home' | 'static' | 'detail' | 'unmapped';
  rel: string; // 언어 접두사 뺀 상대 경로 조각(예: 'upcoming-games', 'game/foo')
}

function parsePath(pathname: string): Parsed {
  const localeMatch = pathname.match(/^\/(en|ja)(\/.*)?$/);
  const lang: PageLang = localeMatch ? (localeMatch[1] as PageLang) : 'ko';
  const rest = localeMatch ? (localeMatch[2] ?? '/') : pathname;

  if (rest === '/' || rest === '') return { lang, kind: 'home', rel: '' };

  const parts = rest.split('/').filter(Boolean);
  if (parts.length === 1 && STATIC_PAGES.has(parts[0])) {
    return { lang, kind: 'static', rel: parts[0] };
  }
  if (parts.length === 2 && DETAIL_TYPES.has(parts[0])) {
    return { lang, kind: 'detail', rel: `${parts[0]}/${parts[1]}` };
  }
  return { lang, kind: 'unmapped', rel: '' };
}

function buildUrl(target: PageLang, p: Parsed): string {
  if (p.kind === 'home' || p.kind === 'unmapped') {
    return target === 'ko' ? '/' : `/${target}`;
  }
  return target === 'ko' ? `/${p.rel}` : `/${target}/${p.rel}`;
}

// 모든 페이지 헤더에 노출. 번역 라우트가 없는 페이지(쿠폰 상세·게임 허브·admin 등)에서는
// 그 언어의 홈으로 안내(대상 페이지가 항상 존재하므로 dead link 없음).
export function LanguageSwitcher() {
  const pathname = usePathname();
  const parsed = parsePath(pathname);

  const langs: { key: PageLang; label: string }[] = [
    { key: 'ko', label: '한국어' },
    { key: 'en', label: 'EN' },
    { key: 'ja', label: '日本語' },
  ];

  return (
    <div className={styles.wrap} role="group" aria-label="Language / 言語 / 언어">
      {langs.map(l => (
        <a
          key={l.key}
          href={buildUrl(l.key, parsed)}
          className={`${styles.btn} ${parsed.lang === l.key ? styles.active : ''}`}
          aria-current={parsed.lang === l.key ? 'page' : undefined}
        >
          {l.label}
        </a>
      ))}
    </div>
  );
}
