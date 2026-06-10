'use client';
import type { Category } from '@/lib/types';
import { CATEGORY_META } from '@/lib/types';
import styles from './CategoryRail.module.css';

interface Props {
  search: string;
  category: Category | null;
  days: number;
  counts: Partial<Record<Category, number>>;
  totalCount: number;
  onSearch: (v: string) => void;
  onCategory: (c: Category | null) => void;
  onDays: (d: number) => void;
}

// §F 좌측 카테고리 레일 — 가로 필터바(검색/카테고리/기간) 흡수.
// 카테고리 행: 정보색 점 + 라벨 + 카운트, 활성 강조. 카운트는 Home에서 현재
// 모집단(뷰·검색·기간 반영, 카테고리 제외) 기준으로 주입받는다.
const ORDER: Category[] = ['mobile_kr', 'pc_console_kr', 'global_aaa', 'new_server'];

export function CategoryRail({
  search, category, days, counts, totalCount,
  onSearch, onCategory, onDays,
}: Props) {
  return (
    <aside className={styles.rail} aria-label="카테고리 필터">
      <input
        type="search"
        placeholder="게임명 검색…"
        value={search}
        onChange={e => onSearch(e.target.value)}
        className={styles.search}
        aria-label="게임명 검색"
      />

      <nav className={styles.list} aria-label="카테고리">
        <button
          type="button"
          className={`${styles.row} ${category === null ? styles.active : ''}`}
          aria-pressed={category === null}
          onClick={() => onCategory(null)}
        >
          <span className={styles.dot} style={{ background: 'var(--text-faint)' }} />
          <span className={styles.label}>전체</span>
          <span className={styles.count}>{totalCount}</span>
        </button>
        {ORDER.map(c => {
          const meta = CATEGORY_META[c];
          const active = category === c;
          return (
            <button
              key={c}
              type="button"
              className={`${styles.row} ${active ? styles.active : ''}`}
              aria-pressed={active}
              onClick={() => onCategory(active ? null : c)}
            >
              <span className={styles.dot} style={{ background: meta.color }} />
              <span className={styles.label}>{meta.short}</span>
              <span className={styles.count}>{counts[c] ?? 0}</span>
            </button>
          );
        })}
      </nav>

      <label className={styles.periodField}>
        <span className={styles.periodLabel}>기간</span>
        <select
          className={styles.periodSelect}
          value={days}
          onChange={e => onDays(parseInt(e.target.value, 10))}
        >
          <option value={0}>오늘 이후</option>
          <option value={30}>앞으로 30일</option>
          <option value={90}>앞으로 90일</option>
          <option value={180}>앞으로 6개월</option>
          <option value={365}>앞으로 1년</option>
          <option value={-1}>전체 (과거 포함)</option>
        </select>
      </label>
    </aside>
  );
}
