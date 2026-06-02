'use client';
import { useState, useMemo, useEffect, useCallback } from 'react';
import type { Game, Category } from '@/lib/types';
import { CATEGORY_META } from '@/lib/types';
import { calcDayDiff, formatShortDate } from '@/lib/utils';
import { HeroStrip } from './HeroStrip';
import { MonthTabs } from './MonthTabs';
import { Filters, type FilterState } from './Filters';
import { ViewToggle } from './ViewToggle';
import { CalendarView } from './CalendarView';
import { ListView } from './ListView';
import { GameModal } from './GameModal';
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
    days: 0,           // 0 = 전체 (과거+미래). 기본 '전체'로 과거 게임도 보이게.
    search: '',
    wishlistOnly: false,
  });
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [calendarCursor, setCalendarCursor] = useState<Date>(() => {
    const now = new Date();
    now.setDate(1);
    return now;
  });
  const [openGameId, setOpenGameId] = useState<string | null>(null);

  const wishlist = useWishlist();

  // 모달 열기 + URL 변경 (인스타 스타일)
  const openModal = useCallback((id: string) => {
    setOpenGameId(id);
    try {
      const desiredPath = `/game/${id}`;
      if (window.location.pathname !== desiredPath) {
        window.history.pushState({ modal: id }, '', desiredPath);
      }
    } catch { /* no-op */ }
  }, []);

  // 모달 닫기 + URL 복귀
  const closeModal = useCallback((skipHistory = false) => {
    setOpenGameId(null);
    if (!skipHistory) {
      try {
        if (window.history.state?.modal) {
          window.history.back();
        }
      } catch { /* no-op */ }
    }
  }, []);

  // popstate 처리 (뒤로/앞으로)
  useEffect(() => {
    const onPop = () => {
      const m = window.location.pathname.match(/^\/game\/([^/]+)$/);
      if (m && initialGames.some(g => g.id === m[1])) {
        setOpenGameId(m[1]);
      } else {
        setOpenGameId(null);
      }
    };
    window.addEventListener('popstate', onPop);
    // 초기 URL이 /game/[id]면 모달 열기
    onPop();
    return () => window.removeEventListener('popstate', onPop);
  }, [initialGames]);

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

      // 기간 필터: 과거 게임은 항상 통과, days > 0이면 미래 상한만 적용
      if (filters.days > 0) {
        const r = new Date(g.release_date);
        if (r > future) return false;
      }

      return true;
    });
  }, [initialGames, filters, wishlist.ids]);

  const imminent = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return initialGames
      .map(g => ({ g, diff: calcDayDiff(g.release_date, today) }))
      .filter(x => x.diff >= 0 && x.diff <= 7)
      .sort((a, b) => a.diff - b.diff)
      .slice(0, 5);
  }, [initialGames]);

  const openGame = openGameId ? initialGames.find(g => g.id === openGameId) ?? null : null;

  return (
    <div className={styles.home}>
      <p className={styles.subtitle}>국내외 신규 출시 게임을 한눈에</p>

      {imminent.length > 0 && (
        <HeroStrip items={imminent} onPick={openModal} />
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
          onPick={openModal}
        />
      ) : (
        <ListView games={filteredGames} wishlist={wishlist} onPick={openModal} />
      )}

      <p className={styles.lastUpdated}>
        데이터 마지막 갱신: {formatShortDate(lastUpdated.slice(0, 10))}
      </p>

      {openGame && <GameModal game={openGame} onClose={() => closeModal()} wishlist={wishlist} />}
    </div>
  );
}
