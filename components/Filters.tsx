'use client';
import type { Category } from '@/lib/types';
import styles from './Filters.module.css';

export interface FilterState {
  category: Category | null;
  platform: string | null;
  days: number;
  search: string;
  wishlistOnly: boolean;
}

interface Props {
  value: FilterState;
  onChange: (next: FilterState) => void;
  wishlistCount: number;
}

export function Filters({ value, onChange, wishlistCount }: Props) {
  const set = <K extends keyof FilterState>(key: K, v: FilterState[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <section className={styles.filters} aria-label="필터">
      <input
        type="search"
        placeholder="게임명 검색…"
        value={value.search}
        onChange={e => set('search', e.target.value)}
        className={styles.search}
        aria-label="게임명 검색"
      />

      <label className={styles.label}>
        카테고리
        <select
          value={value.category ?? ''}
          onChange={e => set('category', (e.target.value || null) as Category | null)}
        >
          <option value="">전체</option>
          <option value="mobile_kr">국내 모바일</option>
          <option value="pc_console_kr">국내 PC·콘솔</option>
          <option value="global_aaa">글로벌 대작</option>
          <option value="new_server">한국 MMO 신규 서버</option>
        </select>
      </label>

      <label className={styles.label}>
        플랫폼
        <select value={value.platform ?? ''} onChange={e => set('platform', e.target.value || null)}>
          <option value="">전체</option>
          <option value="pc">PC</option>
          <option value="ps5">PlayStation 5</option>
          <option value="xbox">Xbox</option>
          <option value="switch">Switch</option>
          <option value="ios">iOS</option>
          <option value="android">Android</option>
        </select>
      </label>

      <label className={styles.label}>
        기간
        <select value={value.days} onChange={e => set('days', parseInt(e.target.value, 10))}>
          <option value={0}>오늘 이후</option>
          <option value={30}>앞으로 30일</option>
          <option value={90}>앞으로 90일</option>
          <option value={180}>앞으로 6개월</option>
          <option value={365}>앞으로 1년</option>
          <option value={-1}>전체 (과거 포함)</option>
        </select>
      </label>

      <button
        type="button"
        className={`${styles.wishBtn} ${value.wishlistOnly ? styles.wishActive : ''}`}
        onClick={() => set('wishlistOnly', !value.wishlistOnly)}
        aria-pressed={value.wishlistOnly}
      >
        <svg className="ic ic-fill" aria-hidden="true"><use href="#ic-star" /></svg> 위시리스트{wishlistCount > 0 ? ` (${wishlistCount})` : ''}
      </button>
    </section>
  );
}
