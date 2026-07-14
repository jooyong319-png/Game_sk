'use client';
import { usePathname } from 'next/navigation';

interface Tab {
  href: string;
  label: string;
  icon: string;
}

// 설치 앱(standalone) 전용 하단 내비. 웹(브라우저)에선 CSS로 숨김.
const TABS: Tab[] = [
  { href: '/', label: '캘린더', icon: 'ic-calendar' },
  { href: '/news', label: '게임뉴스', icon: 'ic-flame' },
  { href: '/coupons', label: '게임 쿠폰', icon: 'ic-gift' },
  { href: '/wishlist', label: '찜', icon: 'ic-star' },
  { href: '/board', label: '커뮤니티', icon: 'ic-comment' },
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="bottom-tabbar" aria-label="앱 하단 메뉴">
      {TABS.map(tab => {
        const active = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
        // 이미 그 탭이면 이동 대신 맨 위로 스크롤(앱 관습)
        const onClick = active
          ? (e: React.MouseEvent) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
          : undefined;
        return (
          <a
            key={tab.href}
            href={tab.href}
            className="bottom-tab"
            aria-current={active ? 'page' : undefined}
            onClick={onClick}
          >
            <span className="tab-ico">
              <svg className="ic" aria-hidden="true"><use href={`#${tab.icon}`} /></svg>
            </span>
            <span>{tab.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
