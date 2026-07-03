'use client';
import type { CSSProperties } from 'react';
import type { Game } from '@/lib/types';
import { CATEGORY_META } from '@/lib/types';
import { calcDayDiff, getKoreanWeekday } from '@/lib/utils';
import styles from './GameRow.module.css';

interface Props {
  game: Game;
  now: Date;
  wishlist: { has: (id: string) => boolean; toggle: (id: string) => void };
  onPick: (id: string) => void;
  preBadge?: string; // '사전예약 시작' / '사전예약 마감' 등 (선택)
}

// 게임 1행 — 리스트 뷰 + 캘린더 상세 패널 공용. (날짜칼럼 + 본문 + 액션)
export function GameRow({ game: g, now, wishlist, onPick, preBadge }: Props) {
  const diff = calcDayDiff(g.release_date, now);
  const released = diff < 0;
  const isToday = diff === 0;
  const imminent = diff >= 0 && diff <= 7;
  const dd = g.release_date_approx ? '미정' : released ? '출시됨' : isToday ? 'D-DAY' : `D-${diff}`;
  const cat = CATEGORY_META[g.category];
  const isWished = wishlist.has(g.id);
  const mmdd = g.release_date_approx ? '미정' : g.release_date.slice(5).replace('-', '/');
  const weekday = g.release_date_approx ? '' : `(${getKoreanWeekday(g.release_date)})`;
  const tags = [...(g.genres ?? []), ...(g.platforms ?? [])].slice(0, 4);

  return (
    <li
      className={`${styles.row} ${imminent ? styles.rowImminent : ''} ${released ? styles.rowReleased : ''}`}
      style={{ '--cat': cat.color } as CSSProperties}
      role="button"
      tabIndex={0}
      onClick={() => onPick(g.id)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(g.id); } }}
    >
      <div className={styles.thumb}>
        {g.image_url ? (
          <>
            <img src={g.image_url} alt="" aria-hidden="true" className={styles.thumbBg} loading="lazy" />
            <img src={g.image_url} alt={g.name_ko} className={styles.thumbFg} loading="lazy" />
          </>
        ) : (
          <div className={styles.thumbPh}>
            <svg className={styles.thumbPhIcon} aria-hidden="true"><use href="#ic-image" /></svg>
          </div>
        )}
      </div>

      <div className={styles.dateCol}>
        <span className={styles.dMmdd}>{mmdd}</span>
        {weekday && <span className={styles.dWeek}>{weekday}</span>}
        <span className={`${styles.dDday} ${isToday ? styles.ddayToday : imminent ? styles.ddaySoon : ''}`}>{dd}</span>
      </div>

      <div className={styles.main}>
        <div className={styles.titleRow}>
          <span className={styles.badge} style={{ color: cat.color }}>{cat.short}</span>
          <span className={styles.title}>{g.name_ko}</span>
          {preBadge && <span className={styles.preBadge}>{preBadge}</span>}
          {g.name_en && g.name_en !== g.name_ko && <span className={styles.nameEn}>{g.name_en}</span>}
        </div>
        {g.description && <p className={styles.desc}>{g.description}</p>}
        {tags.length > 0 && (
          <div className={styles.tags}>
            {tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        {g.source_url && (
          <a
            className={styles.actBtn}
            href={g.source_url}
            target="_blank"
            rel="noopener"
            aria-label="공식 출처"
            onClick={(e) => e.stopPropagation()}
          >
            <svg className="ic" aria-hidden="true"><use href="#ic-arrow-ur" /></svg>
            <span className={styles.actLabel}>출처</span>
          </a>
        )}
        <button
          type="button"
          className={`${styles.actBtn} ${isWished ? styles.wishOn : ''}`}
          onClick={(e) => { e.stopPropagation(); wishlist.toggle(g.id); }}
          aria-pressed={isWished}
          aria-label="찜"
        >
          <svg className={`ic ${isWished ? 'ic-fill' : ''}`} aria-hidden="true"><use href="#ic-star" /></svg>
          <span className={styles.actLabel}>찜</span>
        </button>
      </div>
    </li>
  );
}
