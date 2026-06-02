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
  return (
    <section className={styles.section} aria-label="출시 임박 게임">
      <h2 className={styles.title}><svg className="ic" aria-hidden="true"><use href="#ic-flame" /></svg> 출시 임박</h2>
      <div className={styles.strip}>
        {items.map(({ g, diff }) => {
          const dd = diff === 0 ? 'D-DAY' : `D-${diff}`;
          const cat = CATEGORY_META[g.category];
          const catStyle = { '--cat': cat.color } as CSSProperties;
          const glow = diff === 0 ? styles.glowDday : diff <= 3 ? styles.glowCat : '';
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => onPick(g.id)}
              className={`${styles.card} ${glow}`}
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
