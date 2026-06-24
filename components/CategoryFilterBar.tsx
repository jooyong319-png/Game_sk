'use client';
import type { Category, EventType, FilterKey } from '@/lib/types';
import { CATEGORY_META, EVENT_TYPE_META } from '@/lib/types';
import styles from './CategoryFilterBar.module.css';

interface Props {
  category: FilterKey | null;
  onCategory: (c: FilterKey | null) => void;
  className?: string;
}

const CATS: Category[] = ['mobile_kr', 'pc_console_kr', 'global_aaa', 'new_server'];
const CAT_ICON: Record<Category, string> = {
  mobile_kr: 'ic-mobile',
  pc_console_kr: 'ic-gamepad',
  global_aaa: 'ic-globe',
  new_server: 'ic-server',
};
const EVENTS: EventType[] = ['free_game', 'game_show', 'sale', 'season'];

// 카테고리/이벤트 아이콘 필터 줄 — 리스트·캘린더 공용. filters.category(전역) 단일 출처를 토글.
export function CategoryFilterBar({ category, onCategory, className }: Props) {
  return (
    <div className={`${styles.bar} ${className ?? ''}`} role="group" aria-label="카테고리·이벤트 필터">
      <button
        type="button"
        className={`${styles.item} ${category === null ? styles.active : ''}`}
        aria-pressed={category === null}
        onClick={() => onCategory(null)}
      >
        <span className={styles.icon}><svg className="ic" aria-hidden="true"><use href="#ic-grid" /></svg></span>
        <span className={styles.label}>전체</span>
      </button>

      {CATS.map(c => (
        <button
          key={c}
          type="button"
          className={`${styles.item} ${category === c ? styles.active : ''}`}
          aria-pressed={category === c}
          onClick={() => onCategory(category === c ? null : c)}
        >
          <span className={styles.icon}><svg className="ic" aria-hidden="true"><use href={`#${CAT_ICON[c]}`} /></svg></span>
          <span className={styles.label}>{CATEGORY_META[c].short}</span>
        </button>
      ))}

      <span className={styles.divider} aria-hidden="true" />

      {EVENTS.map(t => (
        <button
          key={t}
          type="button"
          className={`${styles.item} ${styles.evItem} ${category === t ? styles.active : ''}`}
          aria-pressed={category === t}
          onClick={() => onCategory(category === t ? null : t)}
        >
          <span className={styles.icon}><svg className="ic" aria-hidden="true"><use href={`#${EVENT_TYPE_META[t].icon}`} /></svg></span>
          <span className={styles.label}>{EVENT_TYPE_META[t].label}</span>
        </button>
      ))}
    </div>
  );
}
