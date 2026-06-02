'use client';
import styles from './MonthTabs.module.css';

interface Props {
  cursor: Date;
  onJump: (month: number) => void;
}

export function MonthTabs({ cursor, onJump }: Props) {
  const activeMonth = cursor.getMonth() + 1;
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <nav className={styles.tabs} aria-label="월별 빠른 이동">
      {months.map(m => (
        <button
          key={m}
          type="button"
          className={`${styles.tab} ${m === activeMonth ? styles.active : ''}`}
          onClick={() => onJump(m)}
        >
          {m}월
        </button>
      ))}
    </nav>
  );
}
