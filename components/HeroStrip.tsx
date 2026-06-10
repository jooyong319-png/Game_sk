import Link from 'next/link';
import type { Game } from '@/lib/types';
import { CATEGORY_META } from '@/lib/types';
import styles from './HeroStrip.module.css';

interface Props {
  items: { g: Game; diff: number }[];
}

// 우측 '출시 임박' 세로 레일 — D-day 순 컴팩트 행(점 + 게임명 + D-day).
// 전 페이지 공용 사이드바라 링크 기반(클릭 시 상세 페이지로 이동). 서버/클라 양쪽 사용 가능.
export function HeroStrip({ items }: Props) {
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
            <Link key={g.id} href={`/game/${g.id}`} className={styles.card}>
              <span className={styles.dot} style={{ background: cat.color }} aria-hidden="true" />
              <span className={styles.name}>{g.name_ko}</span>
              <span className={`${styles.dday} ${diff === 0 ? styles.today : ''}`}>{dd}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
