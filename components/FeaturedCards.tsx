'use client';
import { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import type { Game } from '@/lib/types';
import { CATEGORY_META } from '@/lib/types';
import styles from './FeaturedCards.module.css';

interface Props { games: Game[]; now: Date; }

function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function pad(n: number): string { return String(n).padStart(2, '0'); }
function shortDate(iso: string): string {
  const [, m, d] = iso.split('-');
  return `${m}.${d}`;
}

interface Parts { Days: number; Hours: number; Min: number; Sec: number; }

// 출시까지 라이브 카운트다운 (approx면 미정)
function useReleaseCountdown(releaseDate: string, approx: boolean): { mounted: boolean; parts: Parts | null } {
  const [mounted, setMounted] = useState(false);
  const [parts, setParts] = useState<Parts | null>(null);
  useEffect(() => {
    setMounted(true);
    if (approx) return;
    const target = new Date(`${releaseDate}T00:00:00+09:00`).getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setParts(null); return; }
      setParts({
        Days: Math.floor(diff / 86400000),
        Hours: Math.floor((diff % 86400000) / 3600000),
        Min: Math.floor((diff % 3600000) / 60000),
        Sec: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [releaseDate, approx]);
  return { mounted, parts };
}

function FeaturedCard({ game, badge, badgeColor }: { game: Game; badge: string; badgeColor: string }) {
  const { mounted, parts } = useReleaseCountdown(game.release_date, game.release_date_approx);
  const cat = CATEGORY_META[game.category];
  const showTimer = !game.release_date_approx && mounted && parts;

  return (
    <Link href={`/game/${game.id}`} className={styles.card}>
      <div className={styles.head}>
        <div className={styles.thumb}>
          {game.image_url ? (
            <>
              <img src={game.image_url} alt="" aria-hidden="true" className={styles.thumbBg} loading="lazy" />
              <img src={game.image_url} alt={game.name_ko} className={styles.thumbFg} loading="lazy" />
            </>
          ) : (
            <div className={styles.thumbPh}>
              <svg className={styles.phIcon} aria-hidden="true"><use href="#ic-image" /></svg>
            </div>
          )}
        </div>
        <div className={styles.info}>
          <span className={styles.badge} style={{ color: badgeColor, borderColor: badgeColor }}>{badge}</span>
          <span className={styles.name}>{game.name_ko}</span>
          <span className={styles.date}>{game.release_date_approx ? '미정' : shortDate(game.release_date)}</span>
        </div>
      </div>

      <div className={styles.timerLabel}>
        <svg className="ic" aria-hidden="true"><use href="#ic-calendar" /></svg> 출시까지 남은 시간
      </div>
      {showTimer ? (
        <div className={styles.timer}>
          {(Object.keys(parts) as (keyof Parts)[]).map((label, i) => (
            <Fragment key={label}>
              {i > 0 && <span className={styles.sep} aria-hidden="true">:</span>}
              <div className={styles.unit}>
                <span className={styles.num}>{pad(parts[label])}</span>
                <span className={styles.unitLabel}>{label}</span>
              </div>
            </Fragment>
          ))}
        </div>
      ) : (
        <div className={styles.mijeong}>미정</div>
      )}
    </Link>
  );
}

// 상단 우측 카드 2개 — 위: 사전예약 최신, 아래: 그 외 최신 (출시 임박 순)
export function FeaturedCards({ games, now }: Props) {
  const today = ymd(now);
  const notReleased = (g: Game) => g.release_date_approx || g.release_date >= today;

  const preReg = games
    .filter(g => notReleased(g) && g.pre_registration === true && g.category !== 'new_server'
      && !(g.pre_registration_date && g.pre_registration_date > today)
      && !(g.pre_registration_end_date && g.pre_registration_end_date < today))
    .sort((a, b) => a.release_date.localeCompare(b.release_date))[0];

  const other = games
    .filter(g => notReleased(g) && g.pre_registration !== true && g.id !== preReg?.id)
    .sort((a, b) => a.release_date.localeCompare(b.release_date))[0];

  if (!preReg && !other) return null;

  return (
    <div className={styles.cards}>
      {preReg && <FeaturedCard game={preReg} badge="사전예약" badgeColor="var(--accent-warm)" />}
      {other && <FeaturedCard game={other} badge={CATEGORY_META[other.category].short} badgeColor={CATEGORY_META[other.category].color} />}
    </div>
  );
}
