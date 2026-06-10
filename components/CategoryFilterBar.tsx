'use client';
import type { Category } from '@/lib/types';
import { CATEGORY_META } from '@/lib/types';
import styles from './CategoryFilterBar.module.css';

interface Props {
  category: Category | null;
  onCategory: (c: Category | null) => void;
  className?: string;
}

const ORDER: Category[] = ['mobile_kr', 'pc_console_kr', 'global_aaa', 'new_server'];
const ICON: Record<Category, string> = {
  mobile_kr: 'ic-mobile',
  pc_console_kr: 'ic-gamepad',
  global_aaa: 'ic-globe',
  new_server: 'ic-server',
};

// 카테고리 아이콘 필터 줄 — 리스트·캘린더 공용. filters.category(전역) 단일 출처를 토글.
export function CategoryFilterBar({ category, onCategory, className }: Props) {
  return (
    <div className={`${styles.bar} ${className ?? ''}`} role="group" aria-label="카테고리 필터">
      <button
        type="button"
        className={`${styles.item} ${category === null ? styles.active : ''}`}
        aria-pressed={category === null}
        onClick={() => onCategory(null)}
      >
        <span className={styles.icon}><svg className="ic" aria-hidden="true"><use href="#ic-grid" /></svg></span>
        <span className={styles.label}>전체</span>
      </button>
      {ORDER.map(c => (
        <button
          key={c}
          type="button"
          className={`${styles.item} ${category === c ? styles.active : ''}`}
          aria-pressed={category === c}
          onClick={() => onCategory(category === c ? null : c)}
        >
          <span className={styles.icon}><svg className="ic" aria-hidden="true"><use href={`#${ICON[c]}`} /></svg></span>
          <span className={styles.label}>{CATEGORY_META[c].short}</span>
        </button>
      ))}
    </div>
  );
}
