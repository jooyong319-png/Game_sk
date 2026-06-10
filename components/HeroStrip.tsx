'use client';
import type { Game } from '@/lib/types';
import { CATEGORY_META } from '@/lib/types';
import styles from './HeroStrip.module.css';

interface Props {
  items: { g: Game; diff: number }[];
  onPick: (id: string) => void;
}

// §F 우측 '출시 임박' 세로 레일 — D-day 순 컴팩트 행(점 + 게임명 + D-day).
// 상단 가로 큰 배너에서 이관(어색함 주범인 좌측 빈 거터 해소). 장식/글로우 0(정리 모드).
export function HeroStrip({ items, onPick }: Props) {
  return (
    <section className={styles.section} aria-label="출시 임박 게임">
      <h2 className={styles.title}>
        <svg className="ic" aria-hidden="true"><use href="#ic-flame" /></svg> 출시 임박
      </h2>
      <div className={styles.strip}>
        {items.map(({ g, diff }) => {
          const dd = diff === 0 ? 'D-DAY' : `D-${diff}`;
          const cat = CATEGORY_META[g.category];
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => onPick(g.id)}
              className={styles.card}
            >
              <span className={styles.dot} style={{ background: cat.color }} aria-hidden="true" />
              <span className={styles.name}>{g.name_ko}</span>
              <span className={`${styles.dday} ${diff === 0 ? styles.today : ''}`}>{dd}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
