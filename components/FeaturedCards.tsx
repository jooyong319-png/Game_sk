'use client';
import { Fragment, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Game, Category } from '@/lib/types';
import { CATEGORY_META } from '@/lib/types';
import styles from './FeaturedCards.module.css';

interface Props { games: Game[]; now: Date; variant?: 'hero' | 'list'; }

interface FreeGame {
  title: string;
  status: 'current' | 'upcoming';
  start: string | null;
  end: string | null;
  image: string | null;
  url: string | null;
}

// 카드 표시용 정규화 데이터 (게임/무료게임 공통)
interface CardData {
  key: string;
  href: string;
  external: boolean;
  imageUrl: string | null;
  badge: string;
  badgeColor: string;
  name: string;
  dateText: string;
  countdownLabel: string;
  targetMs: number | null;   // null이면 카운트다운 없이 fallbackText 표시
  fallbackText: string;
}

const CATS: Category[] = ['mobile_kr', 'pc_console_kr', 'global_aaa', 'new_server'];
const FREE_COLOR = '#6f9c7a';

function pad(n: number): string { return String(n).padStart(2, '0'); }
function shortDate(iso: string): string { const [, m, d] = iso.split('-'); return `${m}.${d}`; }
function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function gameToCard(game: Game, isPreReg: boolean): CardData {
  const cat = CATEGORY_META[game.category];
  return {
    key: `game-${game.id}`,
    href: `/game/${game.id}`,
    external: false,
    imageUrl: game.image_url,
    badge: isPreReg ? '사전예약' : cat.short,
    badgeColor: isPreReg ? 'var(--accent-warm)' : cat.color,
    name: game.name_ko,
    dateText: game.release_date_approx ? '미정' : shortDate(game.release_date),
    countdownLabel: '출시까지 남은 시간',
    targetMs: game.release_date_approx ? null : new Date(`${game.release_date}T00:00:00+09:00`).getTime(),
    fallbackText: '미정',
  };
}

function freeToCard(free: FreeGame): CardData {
  return {
    key: `free-${free.title}`,
    href: free.url ?? '#',
    external: true,
    imageUrl: free.image,
    badge: '무료',
    badgeColor: FREE_COLOR,
    name: free.title,
    dateText: '에픽게임즈 무료 배포',
    countdownLabel: '무료 종료까지 남은 시간',
    targetMs: free.end ? new Date(free.end).getTime() : null,
    fallbackText: '진행 중',
  };
}

interface Parts { Days: number; Hours: number; Min: number; Sec: number; }
function useCountdown(targetMs: number | null): { mounted: boolean; parts: Parts | null } {
  const [mounted, setMounted] = useState(false);
  const [parts, setParts] = useState<Parts | null>(null);
  useEffect(() => {
    setMounted(true);
    if (targetMs == null) return;
    const tick = () => {
      const diff = targetMs - Date.now();
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
  }, [targetMs]);
  return { mounted, parts };
}

function FeaturedCard({ data }: { data: CardData }) {
  const { mounted, parts } = useCountdown(data.targetMs);
  const showTimer = data.targetMs != null && mounted && parts;

  const inner = (
    <>
      <div className={styles.head}>
        <div className={styles.thumb}>
          {data.imageUrl ? (
            <>
              <img src={data.imageUrl} alt="" aria-hidden="true" className={styles.thumbBg} loading="lazy" />
              <img src={data.imageUrl} alt={data.name} className={styles.thumbFg} loading="lazy" />
            </>
          ) : (
            <div className={styles.thumbPh}>
              <svg className={styles.phIcon} aria-hidden="true"><use href="#ic-image" /></svg>
            </div>
          )}
        </div>
        <div className={styles.info}>
          <span className={styles.badge} style={{ color: data.badgeColor, borderColor: data.badgeColor }}>{data.badge}</span>
          <span className={styles.name}>{data.name}</span>
          <span className={styles.date}>{data.dateText}</span>
        </div>
      </div>

      <div className={styles.timerLabel}>
        <svg className="ic" aria-hidden="true"><use href="#ic-calendar" /></svg> {data.countdownLabel}
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
        <div className={styles.mijeong}>{data.fallbackText}</div>
      )}
    </>
  );

  return data.external
    ? <a href={data.href} target="_blank" rel="noopener" className={styles.card}>{inner}</a>
    : <Link href={data.href} className={styles.card}>{inner}</Link>;
}

// 카드 묶음 — hero(홈): 사전예약 + 리롤 1개 / list(서브페이지 사이드바): 사전예약 + 카테고리별 전부 + 무료게임
export function FeaturedCards({ games, now, variant = 'hero' }: Props) {
  const today = ymd(now);
  const notReleased = (g: Game) => g.release_date_approx || g.release_date >= today;

  const preReg = useMemo(() => games
    .filter(g => notReleased(g) && g.pre_registration === true && g.category !== 'new_server'
      && !(g.pre_registration_date && g.pre_registration_date > today)
      && !(g.pre_registration_end_date && g.pre_registration_end_date < today))
    .sort((a, b) => a.release_date.localeCompare(b.release_date))[0],
    [games, today]);

  // 카테고리별 '가장 임박한 출시' 1개씩 (상단 사전예약 카드와 중복 제외)
  const categoryItems = useMemo(() => CATS
    .map(c => games
      .filter(g => notReleased(g) && g.category === c && g.id !== preReg?.id)
      .sort((a, b) => a.release_date.localeCompare(b.release_date))[0])
    .filter((g): g is Game => Boolean(g))
    .map(g => gameToCard(g, false)),
    [games, preReg?.id, today]);

  // 현재 무료 배포 중인 게임 (에픽) — 클라에서 로드
  const [freeItems, setFreeItems] = useState<CardData[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    fetch('/api/free-games')
      .then(r => r.json())
      .then(d => {
        if (cancelled) return;
        const cur: FreeGame[] = (d.games ?? []).filter((g: FreeGame) => g.status === 'current');
        setFreeItems(cur.map(freeToCard));
        setReady(true);
      })
      .catch(() => { if (!cancelled) setReady(true); });
    return () => { cancelled = true; };
  }, []);

  const pool = useMemo(() => [...categoryItems, ...freeItems], [categoryItems, freeItems]);

  // 진입 시 1회 랜덤 선택 (hero 전용, 무료게임 로드된 뒤 전체 풀에서)
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (variant !== 'hero' || !ready || pool.length === 0) return;
    setIdx(Math.floor(Math.random() * pool.length));
  }, [variant, ready, pool.length]);

  if (!preReg && pool.length === 0) return null;

  // list: 사전예약 + 카테고리별 전부 + 무료게임을 모두 세로로 나열
  if (variant === 'list') {
    const cards = [
      ...(preReg ? [gameToCard(preReg, true)] : []),
      ...categoryItems,
      ...freeItems,
    ];
    return (
      <div className={styles.cards}>
        {cards.map(c => <FeaturedCard key={c.key} data={c} />)}
      </div>
    );
  }

  // hero: 위=사전예약, 아래=리롤 1개
  const bottom = pool.length > 0 ? pool[idx % pool.length] : null;
  return (
    <div className={styles.cards}>
      {preReg && <FeaturedCard data={gameToCard(preReg, true)} />}
      {bottom && <FeaturedCard key={bottom.key} data={bottom} />}
    </div>
  );
}
