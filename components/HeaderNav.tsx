'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';

interface NavItem {
  href: string;
  label: string;
}

// 상단 accent 링크(캘린더~커뮤니티). 앱(standalone)에선 상단바에서 숨기고 ☰ 메뉴 안에 노출.
const PRIMARY: NavItem[] = [
  { href: '/', label: '캘린더' },
  { href: '/news', label: '게임 뉴스' },
  { href: '/blog', label: '신작 가이드' },
  { href: '/coupons', label: '게임 쿠폰' },
  { href: '/games', label: '게임 목록' },
  { href: '/board', label: '커뮤니티' },
];

// 기존 SeoLanding 라우트 — 메뉴 안 링크로 유지(탐색성·내부링크·SEO).
const NAV: NavItem[] = [
  { href: '/upcoming-games', label: '출시 예정' },
  { href: '/pre-registration', label: '사전예약' },
  { href: '/new-servers', label: '신규 서버' },
  { href: '/events', label: '이벤트' },
  { href: '/mobile-games', label: '모바일' },
  { href: '/pc-console-games', label: 'PC·콘솔' },
  { href: '/global-games', label: '글로벌' },
];

export function HeaderNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  return (
    <div className="header-utils" ref={ref}>
      {/* 좌측: 상시 노출 accent 링크(캘린더~커뮤니티) */}
      <nav className="header-primary-nav" aria-label="주요 메뉴">
      <a
        href="/"
        className={`header-cal-link ${pathname === '/' ? 'header-cal-active' : ''}`}
        aria-current={pathname === '/' ? 'page' : undefined}
      >
        <svg className="ic" aria-hidden="true"><use href="#ic-calendar" /></svg>
        <span className="header-cal-label">캘린더</span>
      </a>
      <a
        href="/news"
        className={`header-news-link ${pathname.startsWith('/news') ? 'header-news-active' : ''}`}
        aria-current={pathname.startsWith('/news') ? 'page' : undefined}
      >
        <svg className="ic" aria-hidden="true"><use href="#ic-flame" /></svg>
        <span className="header-news-label">뉴스</span>
      </a>
      <a
        href="/blog"
        className={`header-guide-link ${pathname.startsWith('/blog') ? 'header-guide-active' : ''}`}
        aria-current={pathname.startsWith('/blog') ? 'page' : undefined}
      >
        <svg className="ic" aria-hidden="true"><use href="#ic-file" /></svg>
        <span className="header-guide-label">신작 가이드</span>
      </a>
      <a
        href="/coupons"
        className={`header-coupon-link ${pathname.startsWith('/coupons') ? 'header-coupon-active' : ''}`}
        aria-current={pathname.startsWith('/coupons') ? 'page' : undefined}
      >
        <svg className="ic" aria-hidden="true"><use href="#ic-gift" /></svg>
        <span className="header-coupon-label">게임 쿠폰</span>
      </a>
      <a
        href="/games"
        className={`header-games-link ${pathname.startsWith('/games') ? 'header-games-active' : ''}`}
        aria-current={pathname.startsWith('/games') ? 'page' : undefined}
      >
        <svg className="ic" aria-hidden="true"><use href="#ic-gamepad" /></svg>
        <span className="header-games-label">게임 목록</span>
      </a>
      <a
        href="/board"
        className={`header-board-link ${pathname === '/board' ? 'header-board-active' : ''}`}
        aria-current={pathname === '/board' ? 'page' : undefined}
      >
        <svg className="ic" aria-hidden="true"><use href="#ic-comment" /></svg>
        <span className="header-board-label">커뮤니티</span>
      </a>
      </nav>

      {/* 우측: 테마 토글 + ☰ 메뉴 */}
      <div className="header-right">
      <ThemeToggle />
      <button
        type="button"
        className="menu-btn"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
      >
        <svg className="ic" aria-hidden="true"><use href="#ic-menu" /></svg>
      </button>

      {/* 링크는 항상 DOM에 유지(크롤 가능) — 열림 상태만 CSS로 토글 */}
      <nav className={`site-menu ${open ? 'site-menu-open' : ''}`} aria-label="주요 메뉴">
        {/* 앱(standalone) 전용: 상단 accent 링크를 메뉴 안에 노출(웹에선 CSS로 숨김) */}
        <div className="menu-primary">
          {PRIMARY.map(item => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
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
        {NAV.map(item => {
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
