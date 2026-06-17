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
  { href: '/upcoming-games', label: '출시예정', icon: 'ic-flame' },
  { href: '/new-servers', label: '서버·이벤트', icon: 'ic-server' },
  { href: '/blog', label: '가이드', icon: 'ic-file' },
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="bottom-tabbar" aria-label="앱 하단 메뉴">
      {TABS.map(tab => {
        const active = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
        return (
          <a
            key={tab.href}
            href={tab.href}
            className="bottom-tab"
            aria-current={active ? 'page' : undefined}
          >
            <svg className="ic" aria-hidden="true"><use href={`#${tab.icon}`} /></svg>
            <span>{tab.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
