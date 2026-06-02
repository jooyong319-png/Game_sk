'use client';
import { useMemo } from 'react';
import type { Game } from '@/lib/types';
import { CATEGORY_META } from '@/lib/types';
import { calcDayDiff, formatShortDate, getKoreanWeekday } from '@/lib/utils';
import styles from './ListView.module.css';

interface Props {
  games: Game[];
  wishlist: { has: (id: string) => boolean; toggle: (id: string) => void; ids: Set<string> };
  onPick: (id: string) => void;
}

interface MonthGroup {
  key: string;        // 'YYYY-MM'
  year: number;
  month: number;      // 1~12
  approx: boolean;    // 미정 그룹 여부
  games: Game[];
}

function groupByMonth(games: Game[]): MonthGroup[] {
  const map = new Map<string, MonthGroup>();

  // 정렬: 출시일 오름차순 (approx는 맨 끝)
  const sorted = games.slice().sort((a, b) => {
    if (a.release_date_approx && !b.release_date_approx) return 1;
    if (!a.release_date_approx && b.release_date_approx) return -1;
    return a.release_date.localeCompare(b.release_date);
  });

  for (const g of sorted) {
    const d = new Date(g.release_date);
    const key = g.release_date_approx
      ? `${d.getFullYear()}-approx`
      : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!map.has(key)) {
      map.set(key, {
        key,
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        approx: g.release_date_approx,
        games: [],
      });
    }
    map.get(key)!.games.push(g);
  }
  return Array.from(map.values());
}

export function ListView({ games, wishlist, onPick }: Props) {
  const groups = useMemo(() => groupByMonth(games), [games]);

  if (games.length === 0) {
    return <p className={styles.empty}>조건에 맞는 게임이 없어요. 필터를 바꿔보세요.</p>;
  }

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const currentYM = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

  return (
    <div className={styles.listView}>
      {groups.map(group => {
        const isCurrentMonth = group.key === currentYM;
        const title = group.approx
          ? `${group.year}년 출시 미정`
          : `${group.year}년 ${group.month}월`;
        return (
          <section key={group.key} className={styles.monthSection}>
            <header className={`${styles.monthHeader} ${isCurrentMonth ? styles.monthHeaderCurrent : ''}`}>
              <h3 className={styles.monthTitle}>
                {title}
                <span className={styles.monthCount}>{group.games.length}개</span>
              </h3>
              {isCurrentMonth && <span className={styles.monthBadge}>이번 달</span>}
            </header>

            <ul className={styles.grid}>
              {group.games.map(g => {
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
                      <svg className={`ic ${isWished ? 'ic-fill' : ''}`} aria-hidden="true"><use href="#ic-star" /></svg>
                    </button>
                    <button type="button" className={styles.cardLink} onClick={() => onPick(g.id)}>
                      <div className={`${styles.cardBanner} cat-bg-${g.category}`}>
                        <span className={styles.cardBannerEmoji}>{cat.emoji}</span>
                      </div>
                      <div className={styles.cardHeader}>
                        <span className={`category-tag cat-bg-${g.category}`}>{cat.short}</span>
                        <span className={`${styles.dday} ${imminent ? styles.ddaySoon : ''}`}>{dd}</span>
                      </div>
                      <div className={styles.cardBody}>
                        <h4 className={styles.name}>{g.name_ko}</h4>
                        {g.name_en && g.name_en !== g.name_ko && <span className={styles.nameEn}>{g.name_en}</span>}
                        <span className={styles.date}>
                          📅 {formatShortDate(g.release_date)}{weekday}{g.release_date_approx ? ' (예정)' : ''}
                        </span>
                        {g.description && <p className={styles.desc}>{g.description}</p>}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
