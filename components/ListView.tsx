'use client';
import type { Game } from '@/lib/types';
import { CATEGORY_META } from '@/lib/types';
import { calcDayDiff, formatShortDate, getKoreanWeekday } from '@/lib/utils';
import styles from './ListView.module.css';

interface Props {
  games: Game[];
  wishlist: { has: (id: string) => boolean; toggle: (id: string) => void; ids: Set<string> };
  onPick: (id: string) => void;
}

export function ListView({ games, wishlist, onPick }: Props) {
  if (games.length === 0) {
    return <p className={styles.empty}>조건에 맞는 게임이 없어요. 필터를 바꿔보세요.</p>;
  }
  return (
    <ul className={styles.list}>
      {games.map(g => {
        const diff = calcDayDiff(g.release_date);
        const dd = diff < 0 ? '출시됨' : diff === 0 ? 'D-DAY' : `D-${diff}`;
        const imminent = diff >= 0 && diff <= 7;
        const cat = CATEGORY_META[g.category];
        const weekday = g.release_date_approx ? '' : ` (${getKoreanWeekday(g.release_date)})`;
        const isWished = wishlist.has(g.id);
        return (
          <li key={g.id} className={`${styles.item} ${imminent ? styles.imminent : ''}`}>
            <button
              type="button"
              className={`${styles.wish} ${isWished ? styles.wishOn : ''}`}
              onClick={(e) => { e.stopPropagation(); wishlist.toggle(g.id); }}
              aria-label="위시리스트 토글"
              aria-pressed={isWished}
            >
              {isWished ? '★' : '☆'}
            </button>
            <button type="button" className={styles.cardLink} onClick={() => onPick(g.id)}>
              <div className={styles.cardHeader}>
                <span className={`category-tag cat-bg-${g.category}`}>{cat.short}</span>
                <span className={`${styles.dday} ${diff <= 7 && diff >= 0 ? styles.ddaySoon : ''}`}>{dd}</span>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.name}>{g.name_ko}</h3>
                {g.name_en && g.name_en !== g.name_ko && <span className={styles.nameEn}>{g.name_en}</span>}
                <span className={styles.date}>📅 {formatShortDate(g.release_date)}{weekday}{g.release_date_approx ? ' (예정)' : ''}</span>
                {g.description && <p className={styles.desc}>{g.description}</p>}
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
