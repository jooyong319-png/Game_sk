'use client';
import { useMemo } from 'react';
import type { Game } from '@/lib/types';
import { CATEGORY_META } from '@/lib/types';
import styles from './CalendarView.module.css';

interface Props {
  cursor: Date;
  onCursorChange: (d: Date) => void;
  games: Game[];
  wishlist: { has: (id: string) => boolean };
  onPick: (id: string) => void;
}

interface Cell { date: Date; inMonth: boolean; games: Game[]; isToday: boolean; }

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
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    cells.push({ date: d, inMonth: d.getMonth() === month, games: byDate.get(key) ?? [], isToday: d.getTime() === today.getTime() });
  }
  return cells;
}

export function CalendarView({ cursor, onCursorChange, games, onPick }: Props) {
  const cells = useMemo(() => buildCells(cursor, games), [cursor, games]);
  const monthLabel = `${cursor.getFullYear()}년 ${cursor.getMonth() + 1}월`;
  const prev = () => { const d = new Date(cursor); d.setMonth(d.getMonth() - 1); onCursorChange(d); };
  const next = () => { const d = new Date(cursor); d.setMonth(d.getMonth() + 1); onCursorChange(d); };
  const today = () => { const d = new Date(); d.setDate(1); onCursorChange(d); };

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
        {cells.map((cell, i) => (
          <div key={i} className={`${styles.cell} ${!cell.inMonth ? styles.cellOther : ''} ${cell.isToday ? styles.cellToday : ''}`}>
            <div className={styles.cellDate}>{cell.date.getDate()}</div>
            <div className={styles.cellDots}>
              {cell.games.slice(0, 4).map(g => (
                <button key={g.id} type="button" onClick={() => onPick(g.id)}
                  className={styles.cellDot}
                  style={{ background: CATEGORY_META[g.category].color }}
                  title={g.name_ko}
                  aria-label={g.name_ko}
                />
              ))}
              {cell.games.length > 4 && <span className={styles.cellMore}>+{cell.games.length - 4}</span>}
            </div>
            {cell.games[0] && cell.games.length === 1 && (
              <button type="button" onClick={() => onPick(cell.games[0].id)} className={styles.cellName}>
                {cell.games[0].name_ko}
              </button>
            )}
          </div>
        ))}
      </div>
      {cells.every(c => c.games.length === 0) && (
        <p className={styles.empty}>이 달 출시 일정이 없어요. ‹ ›로 다른 달을 살펴보세요.</p>
      )}
    </section>
  );
}
