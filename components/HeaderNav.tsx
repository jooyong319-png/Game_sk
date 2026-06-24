'use client';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';

interface NavItem {
  href: string;
  label: string;
}

// 기존 SeoLanding 라우트 그대로 — 헤더 내부링크로 탐색성·SEO 보강(§E).
const NAV: NavItem[] = [
  { href: '/', label: '캘린더' },
  { href: '/upcoming-games', label: '출시 예정' },
  { href: '/pre-registration', label: '사전예약' },
  { href: '/new-servers', label: '신규 서버' },
  { href: '/events', label: '이벤트' },
  { href: '/mobile-games', label: '모바일' },
  { href: '/pc-console-games', label: 'PC·콘솔' },
  { href: '/global-games', label: '글로벌' },
  { href: '/blog', label: '신작 가이드' },
];

export function HeaderNav() {
  const pathname = usePathname();

  return (
    <>
      <nav className="site-nav" aria-label="주요 메뉴">
        {NAV.map(item => {
          const active = pathname === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className="nav-link"
              aria-current={active ? 'page' : undefined}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
      <div className="header-utils">
        <ThemeToggle />
      </div>
    </>
  );
}
