import Link from 'next/link';
import type { Game } from '@/lib/types';
import { CATEGORY_META } from '@/lib/types';
import { calcDayDiff } from '@/lib/utils';
import styles from './PreRegistration.module.css';

interface Props {
  games: Game[];
  now: Date;
  limit?: number;
}

function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// 좌측 레일 위젯 — '지금 가능한 사전예약'.
// 조건: pre_registration=true · (시작일 있으면) 이미 시작 · (마감일 있으면) 아직 안 지남 · 미출시.
// 출시 임박 순으로 최대 limit개. 상세 페이지로 링크(내부링크/SEO).
export function PreRegistration({ games, now, limit = 5 }: Props) {
  const today = ymd(now);
  const active = games
    .filter(g => {
      if (g.pre_registration !== true) return false;
      if (g.pre_registration_date && g.pre_registration_date > today) return false;     // 아직 시작 전
      if (g.pre_registration_end_date && g.pre_registration_end_date < today) return false; // 마감 지남
      if (!g.release_date_approx && g.release_date < today) return false;               // 이미 출시됨
      return true;
    })
    .sort((a, b) => a.release_date.localeCompare(b.release_date))
    .slice(0, limit);

  if (active.length === 0) return null;

  return (
    <section className={styles.widget} aria-label="지금 가능한 사전예약">
      <h2 className={styles.title}>
        <svg className="ic" aria-hidden="true"><use href="#ic-star" /></svg>
        지금 가능한 사전예약
      </h2>
      <div className={styles.list}>
        {active.map(g => {
          const cat = CATEGORY_META[g.category];
          const endDiff = g.pre_registration_end_date ? calcDayDiff(g.pre_registration_end_date, now) : null;
          const relDiff = calcDayDiff(g.release_date, now);
          // 마감일 있으면 '마감 D-n' 우선, 없으면 출시 D-day
          const badge = endDiff !== null && endDiff >= 0
            ? `마감 D-${endDiff}`
            : relDiff > 0 ? `출시 D-${relDiff}` : relDiff === 0 ? '출시 D-DAY' : '진행 중';
          return (
            <Link key={g.id} href={`/game/${g.id}`} className={styles.row}>
              <span className={styles.dot} style={{ background: cat.color }} aria-hidden="true" />
              <span className={styles.name}>{g.name_ko}</span>
              <span className={styles.badge}>{badge}</span>
            </Link>
          );
        })}
      </div>
      <Link href="/pre-registration" className={styles.more}>사전예약 전체 보기 →</Link>
    </section>
  );
}
