import type { ReactNode } from 'react';
import { getAllGames } from '@/lib/games';
import { calcDayDiff, kstDateOnly } from '@/lib/utils';
import { MonthStats } from './MonthStats';
import { HeroStrip } from './HeroStrip';
import { NextByCategory } from './NextByCategory';
import { PromoBanner } from './PromoBanner';
import styles from './PageShell.module.css';

interface Props {
  children: ReactNode;
}

// 서브페이지(출시예정·카테고리·블로그·상세) 공용 3컬럼 셸 — 홈과 동일한 좌/우 사이드바.
// 정적 생성이라 빌드 시각(KST) 기준 D-day(데이터 일일 갱신 시 재배포로 신선도 유지).
export async function PageShell({ children }: Props) {
  const games = await getAllGames();
  const now = kstDateOnly(new Date().toISOString());
  const today = new Date(now); today.setHours(0, 0, 0, 0);
  const imminent = games
    .map(g => ({ g, diff: calcDayDiff(g.release_date, today) }))
    .filter(x => x.diff >= 0 && x.diff <= 7)
    .sort((a, b) => a.diff - b.diff)
    .slice(0, 5);

  return (
    <div className={styles.layout}>
      <aside className={styles.leftCol} aria-label="요약">
        <MonthStats games={games} now={now} />
        <PromoBanner variant="calendar" />
      </aside>

      <main className={styles.main}>{children}</main>

      <aside className={styles.rightCol} aria-label="추천 일정">
        {imminent.length > 0 && <HeroStrip items={imminent} />}
        <NextByCategory games={games} now={now} />
        <PromoBanner variant="update" />
      </aside>
    </div>
  );
}
