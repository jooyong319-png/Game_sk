'use client';
import { useMemo, useState, useEffect, useRef, type CSSProperties } from 'react';
import type { Game } from '@/lib/types';
import { CATEGORY_META } from '@/lib/types';
import { calcDayDiff, formatShortDate, getKoreanWeekday } from '@/lib/utils';
import styles from './CalendarView.module.css';

interface Props {
  cursor: Date;
  onCursorChange: (d: Date) => void;
  games: Game[];
  wishlist: { has: (id: string) => boolean };
  onPick: (id: string) => void;
}

interface Cell {
  date: Date;
  iso: string;
  inMonth: boolean;
  games: Game[];
  isToday: boolean;
}

function pad(n: number): string { return String(n).padStart(2, '0'); }
function toISO(d: Date): string { return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }

function buildCells(cursor: Date, games: Game[]): Cell[] {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay();
  const start = new Date(year, month, 1 - startWeekday);
  const today = new Date(); today.setHours(0,0,0,0);
  const byDate = new Map<string, Game[]>();
  for (const g of games) {
    if (!byDate.has(g.release_date)) byDate.set(g.release_date, []);
    byDate.get(g.release_date)!.push(g);
  }
  const cells: Cell[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    d.setHours(0, 0, 0, 0);
    const iso = toISO(d);
    cells.push({
      date: d, iso,
      inMonth: d.getMonth() === month,
      games: byDate.get(iso) ?? [],
      isToday: d.getTime() === today.getTime(),
    });
  }
  return cells;
}

export function CalendarView({ cursor, onCursorChange, games, onPick }: Props) {
  const cells = useMemo(() => buildCells(cursor, games), [cursor, games]);
  const monthLabel = `${cursor.getFullYear()}년 ${cursor.getMonth() + 1}월`;
  const [selectedISO, setSelectedISO] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // 달이 바뀌면 선택 해제
  useEffect(() => { setSelectedISO(null); }, [cursor]);

  // 패널 표시 시 스크롤
  useEffect(() => {
    if (selectedISO && panelRef.current) {
      panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedISO]);

  const prev = () => { const d = new Date(cursor); d.setMonth(d.getMonth() - 1); onCursorChange(d); };
  const next = () => { const d = new Date(cursor); d.setMonth(d.getMonth() + 1); onCursorChange(d); };
  const today = () => { const d = new Date(); d.setDate(1); onCursorChange(d); };

  function onCellClick(cell: Cell) {
    if (!cell.inMonth) {
      // 인접월 셀: 그 달로 점프 + 그 날짜 선택
      onCursorChange(new Date(cell.date.getFullYear(), cell.date.getMonth(), 1));
      setSelectedISO(cell.iso);
      return;
    }
    // 출시 유무와 관계없이 모든 셀 클릭 가능 → 그 날짜 이후 게임 패널 표시
    setSelectedISO(prev => prev === cell.iso ? null : cell.iso);
  }

  // day-detail-panel: 선택 날짜 "이후" 출시 게임 목록
  const panelGames = useMemo(() => {
    if (!selectedISO) return [];
    return games
      .filter(g => g.release_date >= selectedISO)
      .sort((a, b) => a.release_date.localeCompare(b.release_date))
      .slice(0, 20); // 최대 20개만 노출
  }, [selectedISO, games]);

  return (
    <section className={styles.view}>
      <header className={styles.header}>
        <button type="button" className={styles.navBtn} onClick={prev} aria-label="이전 달">‹</button>
        <h2 className={styles.label}>{monthLabel}</h2>
        <button type="button" className={styles.navBtn} onClick={next} aria-label="다음 달">›</button>
        <button type="button" className={styles.todayBtn} onClick={today}>오늘로</button>
      </header>

      <div className={styles.legend} aria-hidden>
        {(['mobile_kr', 'pc_console_kr', 'global_aaa', 'new_server'] as const).map(c => (
          <span key={c} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: CATEGORY_META[c].color }} />
            {CATEGORY_META[c].short}
          </span>
        ))}
      </div>

      <div className={styles.grid}>
        {['일','월','화','수','목','금','토'].map(d => (<div key={d} className={styles.dayHead}>{d}</div>))}
        {cells.map((cell, i) => {
          const has = cell.games.length > 0;
          const showName = has && cell.inMonth;
          const firstGame = cell.games[0];
          const dots = cell.games.slice(0, 3);
          const overflow = cell.games.length - 3;
          const isSelected = selectedISO === cell.iso;
          const isClickable = true; // 모든 셀 클릭 가능 (출시 없는 날도 '이후 출시' 패널 표시)

          return (
            <div
              key={i}
              style={has && firstGame ? ({ '--cat': CATEGORY_META[firstGame.category].color } as CSSProperties) : undefined}
              className={[
                styles.cell,
                !cell.inMonth ? styles.cellOther : '',
                cell.isToday ? styles.cellToday : '',
                has ? styles.cellHas : '',
                isSelected ? styles.cellSelected : '',
                isClickable ? styles.cellClickable : '',
              ].filter(Boolean).join(' ')}
              onClick={() => onCellClick(cell)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onCellClick(cell);
                }
              }}
              title={has ? cell.games.map(g => g.name_ko).join(', ') : undefined}
            >
              <div className={styles.cellDate}>
                {cell.date.getDate()}
                {cell.isToday && <span className={styles.cellTodayBadge}>오늘</span>}
              </div>

              {showName && firstGame && (
                <div className={styles.cellName}>
                  {firstGame.name_ko}
                  {cell.games.length > 1 && <span className={styles.cellMore}>+{cell.games.length - 1}</span>}
                </div>
              )}

              {has && (
                <div className={styles.cellDots}>
                  {dots.map((g, idx) => (
                    <span
                      key={`${g.id}-${idx}`}
                      className={styles.cellDot}
                      style={{ background: CATEGORY_META[g.category].color }}
                      title={g.name_ko}
                    />
                  ))}
                  {overflow > 0 && <span className={styles.cellDotMore}>+{overflow}</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {cells.every(c => c.games.length === 0) && (
        <p className={styles.empty}>이 달 출시 일정이 없어요. ‹ ›로 다른 달을 살펴보세요.</p>
      )}

      {/* day-detail-panel: 셀 클릭 시 그 날짜 이후 출시 게임 리스트 */}
      {selectedISO && (
        <div ref={panelRef} className={styles.dayPanel}>
          <header className={styles.dayPanelHeader}>
            <h3 className={styles.dayPanelTitle}>
              {formatShortDate(selectedISO)} ({getKoreanWeekday(selectedISO)}) 이후 출시 {panelGames.length}건
            </h3>
            <button
              type="button"
              className={styles.dayPanelClose}
              onClick={() => setSelectedISO(null)}
              aria-label="패널 닫기"
            >×</button>
          </header>
          <div className={styles.dayPanelList}>
            {panelGames.length === 0 ? (
              <p className={styles.dayEmpty}>이 날짜 이후 출시 예정 게임이 없어요.</p>
            ) : panelGames.map(g => {
              const diff = calcDayDiff(g.release_date);
              const dd = diff < 0 ? '출시됨' : diff === 0 ? 'D-DAY' : `D-${diff}`;
              const cat = CATEGORY_META[g.category];
              const mmdd = g.release_date.slice(5).replace('-', '.');
              return (
                <button
                  key={g.id}
                  type="button"
                  className={styles.dayRow}
                  onClick={() => onPick(g.id)}
                >
                  <span className={styles.dayRowDate}>{mmdd}</span>
                  <span className={styles.dayRowDot} style={{ background: cat.color }} title={cat.label} />
                  <span className={styles.dayRowName}>{g.name_ko}</span>
                  <span className={`${styles.dayRowDday} ${diff <= 7 && diff >= 0 ? styles.dayRowDdaySoon : ''}`}>{dd}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
