'use client';
import { useState, useMemo, useEffect, useCallback } from 'react';
import type { Game, Category, FilterState } from '@/lib/types';
import { CATEGORY_META } from '@/lib/types';
import { calcDayDiff, formatShortDate, kstDateOnly } from '@/lib/utils';
import { HeroStrip } from './HeroStrip';
import { MonthTabs } from './MonthTabs';
import { CategoryRail } from './CategoryRail';
import { ViewToggle } from './ViewToggle';
import { CalendarView } from './CalendarView';
import { ListView } from './ListView';
import { GameModal } from './GameModal';
import { useWishlist } from '@/hooks/useWishlist';
import { useWishlistFilter } from '@/hooks/useWishlistFilter';
import styles from './Home.module.css';

interface HomeProps {
  initialGames: Game[];
  lastUpdated: string;
  serverNow: string;
}

export function Home({ initialGames, lastUpdated, serverNow }: HomeProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    platform: null,
    days: 0,           // 0 = '오늘 이후'(리스트 기본 하한 today). -1 = 전체(과거 포함). 30/90/.. = 미래 N일 상한.
    search: '',
    wishlistOnly: false,
  });
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [calendarCursor, setCalendarCursor] = useState<Date>(() => {
    const d = kstDateOnly(serverNow);
    d.setDate(1);
    return d;
  });
  // 날짜 의존 렌더용 '현재 시각'. SSR/첫 렌더는 serverNow로 고정(하이드레이션 일치),
  // mount 후 실제 현재 시각으로 교체 → D-day·오늘 셀이 클라에서 정확.
  const [now, setNow] = useState<Date>(() => kstDateOnly(serverNow));
  const [openGameId, setOpenGameId] = useState<string | null>(null);

  const wishlist = useWishlist();
  const wishlistOnly = useWishlistFilter().on; // 헤더 ★ 토글과 공유(§E)

  // mount 직후 1회: 실제 현재 시각/이번 달로 교체 (하이드레이션 이후라 에러 아님)
  useEffect(() => {
    const real = kstDateOnly(new Date().toISOString());
    setNow(real);
    const m = new Date(real);
    m.setDate(1);
    setCalendarCursor(m);
  }, []);

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
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const future = new Date(today);
    if (filters.days > 0) future.setDate(today.getDate() + filters.days);

    return initialGames.filter(g => {
      if (filters.category && g.category !== filters.category) return false;
      if (wishlistOnly && !wishlist.has(g.id)) return false;

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
  }, [initialGames, filters, wishlist.ids, wishlistOnly, now]);

  // 리스트 전용: '오늘 이후' 하한 적용(캘린더 공유 filteredGames는 무하한 → 과거 달 탐색 보존).
  // 기간 '전체 (과거 포함)'(-1) 선택 시에만 과거 복원. 하한은 now(KST, mount 후) 기준이라 SSR 안전.
  const listGames = useMemo(() => {
    if (filters.days === -1) return filteredGames;
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    return filteredGames.filter(g => new Date(g.release_date) >= today);
  }, [filteredGames, filters.days, now]);

  // 통계줄 카테고리 4색 분해용: 현재 뷰(리스트/캘린더)와 동일 모집단으로 카운트 (큐 1순위, 디자이너 데스크#2)
  const visibleGames = view === 'list' ? listGames : filteredGames;
  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<Category, number>> = {};
    for (const g of visibleGames) counts[g.category] = (counts[g.category] ?? 0) + 1;
    return counts;
  }, [visibleGames]);

  // §F 좌측 레일 카테고리별 카운트 — 현재 모집단(검색/플랫폼/기간/위시·리스트뷰 하한
  // 반영) 기준, 카테고리 필터만 제외. 통계줄 '총 N개'와 동일 모집단으로 일치.
  const railCounts = useMemo(() => {
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const future = new Date(today);
    if (filters.days > 0) future.setDate(today.getDate() + filters.days);
    const counts: Partial<Record<Category, number>> = {};
    let total = 0;
    for (const g of initialGames) {
      if (wishlistOnly && !wishlist.has(g.id)) continue;
      if (filters.search) {
        const hay = `${g.name_ko} ${g.name_en ?? ''}`.toLowerCase();
        if (!hay.includes(filters.search.toLowerCase())) continue;
      }
      if (filters.platform) {
        const pf = g.platforms.map(p => p.toLowerCase());
        if (!pf.some(p => p.includes(filters.platform!.toLowerCase()))) continue;
      }
      const rel = new Date(g.release_date);
      if (filters.days > 0 && rel > future) continue;
      if (view === 'list' && filters.days !== -1 && rel < today) continue;
      counts[g.category] = (counts[g.category] ?? 0) + 1;
      total++;
    }
    return { counts, total };
  }, [initialGames, filters.search, filters.platform, filters.days, wishlistOnly, wishlist.ids, now, view]);

  const imminent = useMemo(() => {
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    return initialGames
      .map(g => ({ g, diff: calcDayDiff(g.release_date, today) }))
      .filter(x => x.diff >= 0 && x.diff <= 7)
      .sort((a, b) => a.diff - b.diff)
      .slice(0, 5);
  }, [initialGames, now]);

  const openGame = openGameId ? initialGames.find(g => g.id === openGameId) ?? null : null;

  return (
    <div className={styles.home}>
      <div className={`${styles.layout} ${imminent.length === 0 ? styles.noRail : ''}`}>
        <CategoryRail
          category={filters.category}
          days={filters.days}
          counts={railCounts.counts}
          totalCount={railCounts.total}
          onCategory={c => setFilters({ ...filters, category: c })}
          onDays={d => setFilters({ ...filters, days: d })}
        />

        <div className={styles.main}>
          <div className={styles.topRow}>
            <input
              type="search"
              placeholder="게임명 검색…"
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
              className={styles.topSearch}
              aria-label="게임명 검색"
            />
            <ViewToggle value={view} onChange={setView} />
          </div>

          <MonthTabs
            cursor={calendarCursor}
            onJump={(month) => {
              const next = new Date(calendarCursor);
              const today = new Date(now);
              const useYear = month < today.getMonth() + 1
                ? today.getFullYear() + 1
                : today.getFullYear();
              next.setFullYear(useYear, month - 1, 1);
              setCalendarCursor(next);
            }}
          />

          <p className={styles.stats}>
        {(Object.keys(CATEGORY_META) as Category[])
          .filter(c => (categoryCounts[c] ?? 0) > 0)
          .map(c => (
            <span key={c} className={styles.statsCat}>
              <span className={styles.statsDot} style={{ background: CATEGORY_META[c].color }} />
              {CATEGORY_META[c].short} {categoryCounts[c]}
            </span>
          ))}
        <span className={styles.statsTotal}>총 {visibleGames.length}개</span>
      </p>

      {view === 'calendar' ? (
        <CalendarView
          cursor={calendarCursor}
          onCursorChange={setCalendarCursor}
          games={filteredGames}
          wishlist={wishlist}
          onPick={openModal}
          now={now}
        />
      ) : (
        <ListView games={listGames} wishlist={wishlist} onPick={openModal} now={now} />
      )}

          <p className={styles.lastUpdated}>
            데이터 마지막 갱신: {formatShortDate(lastUpdated.slice(0, 10))}
          </p>
        </div>

        {imminent.length > 0 && (
          <aside className={styles.rightRail} aria-label="출시 임박">
            <HeroStrip items={imminent} onPick={openModal} />
          </aside>
        )}
      </div>

      {openGame && <GameModal game={openGame} onClose={() => closeModal()} wishlist={wishlist} />}
    </div>
  );
}
