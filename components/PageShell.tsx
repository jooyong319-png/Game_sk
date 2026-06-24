import type { ReactNode } from 'react';
import { getAllGames } from '@/lib/games';
import { kstDateOnly } from '@/lib/utils';
import type { Category } from '@/lib/types';
import { NextByCategory } from './NextByCategory';
import { PromoBanner } from './PromoBanner';
import { PopularGames } from './PopularGames';
import { CalendarSubscribe } from './CalendarSubscribe';
import { FreeGames } from './FreeGames';
import { AdFit } from './AdFit';
import styles from './PageShell.module.css';

interface Props {
  children: ReactNode;
}

// 서브페이지(출시예정·카테고리·블로그·상세) 공용 2컬럼 셸 — 홈과 동일한 우측 사이드바.
// 정적 생성이라 빌드 시각(KST) 기준 D-day(데이터 일일 갱신 시 재배포로 신선도 유지).
export async function PageShell({ children }: Props) {
  const games = await getAllGames();
  const now = kstDateOnly(new Date().toISOString());
  const meta: Record<string, { name: string; category: Category }> = {};
  for (const g of games) meta[g.id] = { name: g.name_ko, category: g.category };

  return (
    <div className={styles.layout}>
      <main className={styles.main}>{children}</main>

      <aside className={styles.rightCol} aria-label="추천 일정">
        <NextByCategory games={games} now={now} />
        <AdFit unit="DAN-OszywWckdPV6qhbX" width={300} height={250} />
        <FreeGames compact />
        <PopularGames meta={meta} />
        <CalendarSubscribe />
        <PromoBanner variant="update" />
      </aside>
    </div>
  );
}
