import { getAllGames } from '@/lib/games';
import { kstDateOnly } from '@/lib/utils';
import { CATEGORY_META, type Category } from '@/lib/types';
import styles from './FloatingMonthStats.module.css';

const ORDER: Category[] = ['mobile_kr', 'pc_console_kr', 'global_aaa', 'new_server'];

// 전 페이지 공용 — 좌측 빈 여백에 떠 있는 '이달의 출시' 위젯(넓은 화면 전용, CSS로 숨김 처리).
// 서버 컴포넌트, 빌드 시각(KST) 기준 — 데이터 일일 갱신 시 재배포로 신선도 유지.
export async function FloatingMonthStats() {
  const games = await getAllGames();
  const now = kstDateOnly(new Date().toISOString());
  const year = now.getFullYear();
  const month = now.getMonth();

  const counts: Record<Category, number> = {
    mobile_kr: 0, pc_console_kr: 0, global_aaa: 0, new_server: 0,
  };
  let total = 0;
  for (const g of games) {
    const y = Number(g.release_date.slice(0, 4));
    const m = Number(g.release_date.slice(5, 7)) - 1;
    if (y === year && m === month) {
      counts[g.category]++;
      total++;
    }
  }
  const max = Math.max(1, ...ORDER.map(c => counts[c]));

  return (
    <aside className={styles.float} aria-label={`${month + 1}월 출시 통계`}>
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
    </aside>
  );
}
