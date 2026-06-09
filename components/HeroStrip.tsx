'use client';
import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Game } from '@/lib/types';
import { CATEGORY_META } from '@/lib/types';
import styles from './HeroStrip.module.css';

interface Props {
  items: { g: Game; diff: number }[];
  onPick: (id: string) => void;
}

// 마운트 후에만 값 산출(SSR 하이드레이션 #418/#423/#425 가드)
function useCountdown(targetDate: string | null): string | null {
  const [remain, setRemain] = useState<number | null>(null);
  useEffect(() => {
    if (!targetDate) {
      setRemain(null);
      return;
    }
    const target = new Date(`${targetDate}T00:00:00+09:00`).getTime();
    const tick = (): void => setRemain(Math.max(0, target - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [targetDate]);
  if (remain === null) return null;
  const total = Math.floor(remain / 1000);
  const hh = String(Math.floor(total / 3600)).padStart(2, '0');
  const mm = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const ss = String(total % 60).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

export function HeroStrip({ items, onPick }: Props) {
  // 정렬상 첫 카드(최근접) — D-0~D-1만 핫카드 승격
  const hot = items.length > 0 && items[0].diff <= 1 ? items[0] : null;
  const countdown = useCountdown(hot ? hot.g.release_date : null);

  return (
    <section className={styles.section} aria-label="출시 임박 게임">
      <h2 className={styles.title}><svg className="ic" aria-hidden="true"><use href="#ic-flame" /></svg> 출시 임박</h2>
      <div className={styles.strip}>
        {items.map(({ g, diff }, idx) => {
          const dd = diff === 0 ? 'D-DAY' : `D-${diff}`;
          const cat = CATEGORY_META[g.category];
          const catStyle = { '--cat': cat.color } as CSSProperties;
          const glow = diff === 0 ? styles.glowDday : diff <= 3 ? styles.glowCat : '';
          const isHot = idx === 0 && hot !== null;
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
              {isHot && countdown && (
                <span className={styles.countdown} aria-label="출시까지 남은 시간">{countdown}</span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
