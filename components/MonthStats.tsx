import type { Game, Category } from '@/lib/types';
import { CATEGORY_META } from '@/lib/types';
import styles from './MonthStats.module.css';

interface Props {
  games: Game[];
  now: Date; // KST 기준(kstDateOnly) — 로컬 필드가 KST 달력 날짜
}

const ORDER: Category[] = ['mobile_kr', 'pc_console_kr', 'global_aaa', 'new_server'];

// 좌측 레일 위젯 — '이달의 출시' 카테고리별 막대. games.json에서 자동 집계(now의 연-월 기준).
export function MonthStats({ games, now }: Props) {
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-based

  const counts: Record<Category, number> = {
    mobile_kr: 0, pc_console_kr: 0, global_aaa: 0, new_server: 0,
  };
  let total = 0;
  for (const g of games) {
    // release_date는 'YYYY-MM-DD' 문자열 — 타임존 영향 없이 연/월 직접 비교
    const y = Number(g.release_date.slice(0, 4));
    const m = Number(g.release_date.slice(5, 7)) - 1;
    if (y === year && m === month) {
      counts[g.category]++;
      total++;
    }
  }
  const max = Math.max(1, ...ORDER.map(c => counts[c]));

  return (
    <section className={styles.widget} aria-label={`${month + 1}월 출시 통계`}>
      <h3 className={styles.title}>
        <svg className="ic" aria-hidden="true"><use href="#ic-calendar" /></svg>
        {month + 1}월 출시
        <span className={styles.total}>{total}</span>
      </h3>
      <div className={styles.bars}>
        {ORDER.map(c => (
          <div key={c} className={styles.row}>
            <span className={styles.name}>{CATEGORY_META[c].short}</span>
            <span className={styles.track}>
              <span
                className={styles.fill}
                style={{ width: `${(counts[c] / max) * 100}%`, background: CATEGORY_META[c].color }}
              />
            </span>
            <span className={styles.num}>{counts[c]}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
