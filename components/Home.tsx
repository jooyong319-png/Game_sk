'use client';
import { useState, useMemo, useEffect } from 'react';
import type { Game, Category } from '@/lib/types';
import { CATEGORY_META } from '@/lib/types';
import { calcDayDiff, formatShortDate } from '@/lib/games';
import { HeroStrip } from './HeroStrip';
import { MonthTabs } from './MonthTabs';
import { Filters, type FilterState } from './Filters';
import { ViewToggle } from './ViewToggle';
import { CalendarView } from './CalendarView';
import { ListView } from './ListView';
import { useWishlist } from './useWishlist';
import styles from './Home.module.css';

interface HomeProps {
  initialGames: Game[];
  lastUpdated: string;
}

export function Home({ initialGames, lastUpdated }: HomeProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    platform: null,
    days: 365,
    search: '',
    wishlistOnly: false,
  });
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [calendarCursor, setCalendarCursor] = useState<Date>(() => {
    const now = new Date();
    now.setDate(1);
    return now;
  });

  const wishlist = useWishlist();

  // 필터 적용
  const filteredGames = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const future = new Date(today);
    if (filters.days > 0) future.setDate(today.getDate() + filters.days);

    return initialGames.filter(g => {
      if (filters.category && g.category !== filters.category) return false;
      if (filters.wishlistOnly && !wishlist.has(g.id)) return false;

      if (filters.search) {
        const hay = `${g.name_ko} ${g.name_en ?? ''}`.toLowerCase();
        if (!hay.includes(filters.search.toLowerCase())) return false;
      }

      if (filters.platform) {
        const platforms = g.platforms.map(p => p.toLowerCase());
        if (!platforms.some(p => p.includes(filters.platform!.toLowerCase()))) return false;
      }

      if (filters.days > 0) {
        const r = new Date(g.release_date);
        if (r < today || r > future) return false;
      }

      return true;
    });
  }, [initialGames, filters, wishlist.ids]);

  // 출시 임박 (D-0~D-7)
  const imminent = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return initialGames
      .map(g => ({ g, diff: calcDayDiff(g.release_date, today) }))
      .filter(x => x.diff >= 0 && x.diff <= 7)
      .sort((a, b) => a.diff - b.diff)
      .slice(0, 5);
  }, [initialGames]);

  return (
    <div className={styles.home}>
      <p className={styles.subtitle}>국내외 신규 출시 게임을 한눈에</p>

      {imminent.length > 0 && (
        <HeroStrip items={imminent} />
      )}

      <ViewToggle value={view} onChange={setView} />

      <MonthTabs
        cursor={calendarCursor}
        onJump={(month) => {
          const next = new Date(calendarCursor);
          const today = new Date();
          const useYear = month < today.getMonth() + 1
            ? today.getFullYear() + 1
            : today.getFullYear();
          next.setFullYear(useYear, month - 1, 1);
          setCalendarCursor(next);
        }}
      />

      <Filters
        value={filters}
        onChange={setFilters}
        wishlistCount={wishlist.ids.size}
      />

      <p className={styles.stats}>
        총 {filteredGames.length}개
        {filters.category && ` · ${CATEGORY_META[filters.category].label}`}
      </p>

      {view === 'calendar' ? (
        <CalendarView
          cursor={calendarCursor}
          onCursorChange={setCalendarCursor}
          games={filteredGames}
          wishlist={wishlist}
        />
      ) : (
        <ListView games={filteredGames} wishlist={wishlist} />
      )}

      <p className={styles.lastUpdated}>
        데이터 마지막 갱신: {formatShortDate(lastUpdated.slice(0, 10))}
      </p>
    </div>
  );
}
