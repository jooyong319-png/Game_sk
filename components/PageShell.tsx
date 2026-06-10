import Link from 'next/link';
import { getAllGames } from '@/lib/games';
import { calcDayDiff } from '@/lib/utils';
import { CATEGORY_META } from '@/lib/types';
import type { ReactNode } from 'react';
import styles from './PageShell.module.css';

interface Props {
  children: ReactNode;
  /** 우측 출시 임박 사이드바 표시 여부 (기본 true) */
  showRightRail?: boolean;
}

export async function PageShell({ children, showRightRail = true }: Props) {
  let imminent: Awaited<ReturnType<typeof loadImminent>> = [];
  if (showRightRail) {
    imminent = await loadImminent();
  }

  return (
    <div className={styles.layout}>
      {/* 좌 사이드바: 카테고리/페이지 내비 */}
      <aside className={styles.leftNav} aria-label="사이트 내비게이션">
        <LeftNav />
      </aside>

      {/* 중앙 본문 */}
      <main className={styles.main}>{children}</main>

      {/* 우 사이드바: 출시 임박 sticky */}
      {showRightRail && imminent.length > 0 && (
        <aside className={styles.rightRail} aria-label="출시 임박">
          <h3 className={styles.railTitle}>🔥 출시 임박</h3>
          <ul className={styles.railList}>
            {imminent.map(({ g, diff }) => {
              const dd = diff === 0 ? 'D-DAY' : `D-${diff}`;
              const cat = CATEGORY_META[g.category];
              return (
                <li key={g.id}>
                  <Link href={`/game/${g.id}`} className={styles.railCard}>
                    <span className={styles.railCat} style={{ color: cat.color }}>
                      {cat.short}
                    </span>
                    <span className={styles.railName}>{g.name_ko}</span>
                    <span className={styles.railDday}>{dd}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>
      )}
    </div>
  );
}

async function loadImminent() {
  const all = await getAllGames();
  const today = new Date();
  return all
    .map(g => ({ g, diff: calcDayDiff(g.release_date, today) }))
    .filter(x => x.diff >= 0 && x.diff <= 14)
    .sort((a, b) => a.diff - b.diff)
    .slice(0, 5);
}

function LeftNav() {
  const items = [
    { href: '/', label: '📅 캘린더', exact: true },
    { href: '/upcoming-games', label: '출시 예정' },
    { href: '/new-servers', label: '신규 서버' },
    { href: '/mobile-games', label: '모바일' },
    { href: '/pc-console-games', label: 'PC·콘솔' },
    { href: '/global-games', label: '글로벌' },
    { href: '/blog', label: '📰 블로그' },
  ];
  return (
    <nav className={styles.navList}>
      {items.map(it => (
        <Link key={it.href} href={it.href} className={styles.navLink}>
          {it.label}
        </Link>
      ))}
    </nav>
  );
}
