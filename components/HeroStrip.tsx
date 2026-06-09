'use client';
import type { CSSProperties } from 'react';
import type { Game } from '@/lib/types';
import { CATEGORY_META } from '@/lib/types';
import styles from './HeroStrip.module.css';

interface Props {
  items: { g: Game; diff: number }[];
  onPick: (id: string) => void;
}

export function HeroStrip({ items, onPick }: Props) {
  // 최근접 1건(D-0~D-1)만 2칸 대형 구조 유지 (장식·카운트다운은 정리 모드서 제거)
  const hasHot = items.length > 0 && items[0].diff <= 1;
  return (
    <section className={styles.section} aria-label="출시 임박 게임">
      <h2 className={styles.title}><svg className="ic" aria-hidden="true"><use href="#ic-flame" /></svg> 출시 임박</h2>
      <div className={styles.strip}>
        {items.map(({ g, diff }, idx) => {
          const dd = diff === 0 ? 'D-DAY' : `D-${diff}`;
          const cat = CATEGORY_META[g.category];
          const catStyle = { '--cat': cat.color } as CSSProperties;
          const glow = diff === 0 ? styles.glowDday : diff <= 3 ? styles.glowCat : '';
          const isHot = idx === 0 && hasHot;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => onPick(g.id)}
              className={`${styles.card} ${glow} ${isHot ? styles.hotCard : ''}`}
              data-cat={g.category}
              style={catStyle}
            >
              <span className={styles.dot} aria-hidden="true" />
              <span className={styles.cat}>{cat.short}</span>
              <span className={styles.name}>{g.name_ko}</span>
              <span className={`${styles.dday} ${diff === 0 ? styles.today : ''}`}>{dd}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
