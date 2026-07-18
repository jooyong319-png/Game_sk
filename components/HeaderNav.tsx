'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { UI, type Locale } from '@/lib/i18nLabels';

interface NavItem {
  href: string;
  label: string;
}

function detectLang(pathname: string): Locale | null {
  const m = pathname.match(/^\/(en|ja)(\/|$)/);
  return m ? (m[1] as Locale) : null;
}

// 상단 accent 링크(캘린더~게임 목록). 앱(standalone)에선 상단바에서 숨기고 ☰ 메뉴 안에 노출.
function buildPrimary(lang: Locale | null): NavItem[] {
  if (!lang) {
    return [
      { href: '/', label: '캘린더' },
      { href: '/news', label: '게임 뉴스' },
      { href: '/blog', label: '신작 총정리' },
      { href: '/coupons', label: '게임 쿠폰' },
      { href: '/games', label: '게임 목록' },
    ];
  }
  const ui = UI[lang];
  const p = `/${lang}`;
  return [
    { href: p, label: ui.calendar },
    { href: `${p}/news`, label: ui.news },
    { href: `${p}/blog`, label: ui.blog },
    { href: `${p}/coupons`, label: ui.coupons },
    { href: `${p}/games`, label: ui.gamesList },
  ];
}

// 기존 SeoLanding 라우트 — 메뉴 안 링크로 유지(탐색성·내부링크·SEO).
function buildNav(lang: Locale | null): NavItem[] {
  if (!lang) {
    return [
      { href: '/upcoming-games', label: '출시 예정' },
      { href: '/pre-registration', label: '사전예약 일정' },
      { href: '/new-servers', label: '신규 서버' },
      { href: '/events', label: '이벤트' },
      { href: '/mobile-games', label: '모바일' },
      { href: '/pc-console-games', label: 'PC·콘솔' },
      { href: '/global-games', label: '글로벌' },
    ];
  }
  const ui = UI[lang];
  const p = `/${lang}`;
  return [
    { href: `${p}/upcoming-games`, label: ui.upcoming },
    { href: `${p}/pre-registration`, label: ui.preReg },
    { href: `${p}/new-servers`, label: ui.newServers },
    { href: `${p}/events`, label: ui.events },
    { href: `${p}/mobile-games`, label: ui.mobile },
    { href: `${p}/pc-console-games`, label: ui.pcConsole },
    { href: `${p}/global-games`, label: ui.global },
  ];
}

export function HeaderNav() {
  const pathname = usePathname();
  const lang = detectLang(pathname);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const ui = lang ? UI[lang] : null;
  const home = lang ? `/${lang}` : '/';

  // 바깥 클릭·Esc로 닫기
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const primary = buildPrimary(lang);
  const nav = buildNav(lang);

  return (
    <div className="header-utils" ref={ref}>
      {/* 좌측: 상시 노출 accent 링크(캘린더~게임 목록) */}
      <nav className="header-primary-nav" aria-label={lang ? 'Main menu' : '주요 메뉴'}>
      <a
        href={home}
        className={`header-cal-link ${pathname === home ? 'header-cal-active' : ''}`}
        aria-current={pathname === home ? 'page' : undefined}
      >
        <svg className="ic" aria-hidden="true"><use href="#ic-calendar" /></svg>
        <span className="header-cal-label">{ui ? ui.calendar : '캘린더'}</span>
      </a>
      <a
        href={primary[1].href}
        className={`header-news-link ${pathname.startsWith(primary[1].href) ? 'header-news-active' : ''}`}
        aria-current={pathname.startsWith(primary[1].href) ? 'page' : undefined}
      >
        <svg className="ic" aria-hidden="true"><use href="#ic-flame" /></svg>
        <span className="header-news-label">{ui ? ui.news : '뉴스'}</span>
      </a>
      <a
        href={primary[2].href}
        className={`header-guide-link ${pathname.startsWith(primary[2].href) ? 'header-guide-active' : ''}`}
        aria-current={pathname.startsWith(primary[2].href) ? 'page' : undefined}
      >
        <svg className="ic" aria-hidden="true"><use href="#ic-file" /></svg>
        <span className="header-guide-label">{ui ? ui.blog : '신작 총정리'}</span>
      </a>
      <a
        href={primary[3].href}
        className={`header-coupon-link ${pathname.startsWith(primary[3].href) ? 'header-coupon-active' : ''}`}
        aria-current={pathname.startsWith(primary[3].href) ? 'page' : undefined}
      >
        <svg className="ic" aria-hidden="true"><use href="#ic-gift" /></svg>
        <span className="header-coupon-label">{ui ? ui.coupons : '게임 쿠폰'}</span>
      </a>
      <a
        href={primary[4].href}
        className={`header-games-link ${pathname.startsWith(primary[4].href) ? 'header-games-active' : ''}`}
        aria-current={pathname.startsWith(primary[4].href) ? 'page' : undefined}
      >
        <svg className="ic" aria-hidden="true"><use href="#ic-gamepad" /></svg>
        <span className="header-games-label">{ui ? ui.gamesList : '게임 목록'}</span>
      </a>
      </nav>

      {/* 우측: 언어 스위처(게임/블로그/뉴스 상세에서만 노출) + 테마 토글 + ☰ 메뉴 */}
      <div className="header-right">
      <LanguageSwitcher />
      <ThemeToggle />
      <button
        type="button"
        className="menu-btn"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={open ? (lang ? 'Close menu' : '메뉴 닫기') : (lang ? 'Open menu' : '메뉴 열기')}
      >
        <svg className="ic" aria-hidden="true"><use href="#ic-menu" /></svg>
      </button>

      {/* 링크는 항상 DOM에 유지(크롤 가능) — 열림 상태만 CSS로 토글 */}
      <nav className={`site-menu ${open ? 'site-menu-open' : ''}`} aria-label={lang ? 'Main menu' : '주요 메뉴'}>
        {/* 앱(standalone) 전용: 상단 accent 링크를 메뉴 안에 노출(웹에선 CSS로 숨김) */}
        <div className="menu-primary">
          {primary.map(item => {
            const active = item.href === home ? pathname === home : pathname.startsWith(item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                className="menu-link menu-link-primary"
                aria-current={active ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            );
          })}
          <div className="menu-divider" />
        </div>
        {nav.map(item => {
          const active = pathname === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className="menu-link"
              aria-current={active ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
      </div>
    </div>
  );
}
