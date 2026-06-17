'use client';
import { useMemo, type CSSProperties } from 'react';
import type { Game } from '@/lib/types';
import { CATEGORY_META } from '@/lib/types';
import { calcDayDiff, formatShortDate, getKoreanWeekday } from '@/lib/utils';
import { useWishlist } from '@/hooks/useWishlist';
import styles from './WishlistView.module.css';

export function WishlistView({ games }: { games: Game[] }) {
  const wishlist = useWishlist();
  const items = useMemo(
    () => games.filter(g => wishlist.has(g.id)).sort((a, b) => a.release_date.localeCompare(b.release_date)),
    [games, wishlist.ids],
  );

  return (
    <section className={styles.section}>
      <header className={styles.head}>
        <h1 className={styles.title}>
          <svg className="ic ic-fill" aria-hidden="true" style={{ color: 'var(--accent-warm)' }}><use href="#ic-star" /></svg>
          {' '}내 즐겨찾기{items.length > 0 ? ` (${items.length})` : ''}
        </h1>
        <p className={styles.sub}>관심 게임의 출시 일정을 모아봤어요.</p>
      </header>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon} aria-hidden="true"><svg className="ic"><use href="#ic-star" /></svg></div>
          <p className={styles.emptyText}>아직 즐겨찾기한 게임이 없어요.</p>
          <p className={styles.emptyHint}>게임 상세에서 즐겨찾기 버튼을 눌러 추가하세요.</p>
        </div>
      ) : (
        <ul className={styles.list}>
          {items.map(g => {
            const diff = calcDayDiff(g.release_date);
            const released = diff < 0;
            const dd = g.release_date_approx ? '예정' : released ? '출시됨' : diff === 0 ? 'D-DAY' : `D-${diff}`;
            const soon = diff >= 0 && diff <= 7;
            const cat = CATEGORY_META[g.category];
            const date = g.release_date_approx
              ? '출시일 미정'
              : `${formatShortDate(g.release_date)} (${getKoreanWeekday(g.release_date)})`;
            return (
              <li key={g.id} className={styles.row} style={{ '--cat': cat.color } as CSSProperties}>
                <a className={styles.rowMain} href={`/game/${g.id}`}>
                  <span className={styles.titleRow}>
                    <span className={styles.badge} style={{ color: cat.color }}>{cat.short}</span>
                    <span className={styles.name}>{g.name_ko}</span>
                  </span>
                  <span className={styles.date}>{date}</span>
                </a>
                <span className={`${styles.dday} ${soon ? styles.ddaySoon : ''}`}>{dd}</span>
                <button
                  type="button"
                  className={styles.remove}
                  onClick={() => wishlist.toggle(g.id)}
                  aria-label={`${g.name_ko} 즐겨찾기 제거`}
                >
                  <svg className="ic ic-fill" aria-hidden="true"><use href="#ic-star" /></svg>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
