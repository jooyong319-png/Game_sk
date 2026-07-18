'use client';
import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import type { Game } from '@/lib/types';
import { supabase, isSupabaseReady } from '@/lib/supabase';
import { useLocale } from '@/hooks/useLocale';
import { CAL, type Locale } from '@/lib/i18nLabels';
import styles from './BannerCarousel.module.css';

interface Banner {
  id: number | string;
  image_url: string | null;
  title: string | null;
  subtitle: string | null;
  link: string | null;
  c1?: string;        // 코드 배너 그라데이션 색1
  c2?: string;        // 코드 배너 그라데이션 색2
  tag?: string;       // 코드 배너 상단 태그 라벨
  bgImage?: string;   // 코드 배너 배경에 얹을 실제 게임 이미지(선택)
}

// 코드로 디자인한 배너 — 각 서브페이지로 랜딩. Supabase 이미지 배너와 함께 회전. 언어별 문구/링크.
function defaultBanners(lang: Locale | null): Banner[] {
  const p = lang ? `/${lang}` : '';
  if (lang === 'en') {
    return [
      { id: 'd-pre', image_url: null, link: `${p}/pre-registration`, tag: 'Pre-Registration',
        title: 'New titles open for pre-registration', subtitle: 'Sign up early and grab launch-day rewards',
        c1: '#ffc39a', c2: '#f5a58f' },
      { id: 'd-upcoming', image_url: null, link: `${p}/upcoming-games`, tag: 'Upcoming',
        title: "This month's releases, all in one place", subtitle: "Don't miss the games launching soon",
        c1: '#b3a9ee', c2: '#c9a9e4' },
      { id: 'd-events', image_url: null, link: `${p}/events`, tag: 'Events',
        title: 'Free games · sales · game shows', subtitle: 'From Epic freebies to Steam sales',
        c1: '#93d8ba', c2: '#8ac9c2' },
      { id: 'd-newserver', image_url: null, link: `${p}/new-servers`, tag: 'New Servers',
        title: 'New server opening schedule', subtitle: 'The best time to start fresh',
        c1: '#a3c9ec', c2: '#a7b2e6' },
    ];
  }
  if (lang === 'ja') {
    return [
      { id: 'd-pre', image_url: null, link: `${p}/pre-registration`, tag: '事前予約',
        title: '事前予約受付中の新作', subtitle: '発売前に登録して特典をゲット',
        c1: '#ffc39a', c2: '#f5a58f' },
      { id: 'd-upcoming', image_url: null, link: `${p}/upcoming-games`, tag: '発売予定',
        title: '今月の発売ゲームまとめ', subtitle: '見逃せない新作発売日を一目で',
        c1: '#b3a9ee', c2: '#c9a9e4' },
      { id: 'd-events', image_url: null, link: `${p}/events`, tag: 'イベント',
        title: '無料配布・セール・ゲームショー', subtitle: 'Epic無料ゲームからSteamセールまで',
        c1: '#93d8ba', c2: '#8ac9c2' },
      { id: 'd-newserver', image_url: null, link: `${p}/new-servers`, tag: '新規サーバー',
        title: '新規サーバーオープン情報', subtitle: '新しく始めるのに最適なタイミング',
        c1: '#a3c9ec', c2: '#a7b2e6' },
    ];
  }
  return [
    { id: 'd-pre', image_url: null, link: '/pre-registration', tag: '사전예약',
      title: '지금 사전예약 받는 신작', subtitle: '출시 전 미리 등록하고 보상까지 챙기기',
      c1: '#ffc39a', c2: '#f5a58f' },
    { id: 'd-upcoming', image_url: null, link: '/upcoming-games', tag: '출시 예정',
      title: '이번 달 출시 게임 총정리', subtitle: '놓치면 안 되는 신작 출시 일정 한눈에',
      c1: '#b3a9ee', c2: '#c9a9e4' },
    { id: 'd-events', image_url: null, link: '/events', tag: '이벤트',
      title: '무료 배포 · 할인 · 게임쇼', subtitle: '에픽 무료게임부터 스팀 할인까지',
      c1: '#93d8ba', c2: '#8ac9c2' },
    { id: 'd-newserver', image_url: null, link: '/new-servers', tag: '신규 서버',
      title: '새 서버 오픈 일정', subtitle: '새로 시작하기 딱 좋은 타이밍',
      c1: '#a3c9ec', c2: '#a7b2e6' },
  ];
}

// 코드 배너 배경에 실제 게임 이미지를 (겹치지 않게) 하나씩 배정 — 결정적(하이드레이션 안전).
function decorateWithImages(games: Game[], banners: Banner[]): Banner[] {
  const used = new Set<string>();
  const pick = (pred: (g: Game) => boolean): string | undefined => {
    const g = games.find(x => x.image_url && !used.has(x.image_url) && pred(x));
    if (g?.image_url) { used.add(g.image_url); return g.image_url; }
    return undefined;
  };
  return banners.map(b => {
    let bg: string | undefined;
    if (b.id === 'd-pre') bg = pick(g => g.pre_registration === true);
    else if (b.id === 'd-upcoming') bg = pick(g => !g.release_date_approx);
    else if (b.id === 'd-events') bg = pick(() => true);
    else if (b.id === 'd-newserver') bg = pick(g => g.category === 'new_server');
    return bg ? { ...b, bgImage: bg } : b;
  });
}

interface Props { games?: Game[]; }

// 홈 상단 히어로 배너 — Supabase `banners`(active·sort) + 코드 한글 배너 함께 회전.
export function BannerCarousel({ games = [] }: Props) {
  const lang = useLocale();
  const t = lang ? CAL[lang] : null;
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState<Set<string>>(new Set()); // 깨진 배경 이미지 → 메시로 폴백

  useEffect(() => {
    if (!isSupabaseReady() || !supabase) { setLoaded(true); return; }
    let cancelled = false;
    supabase
      .from('banners')
      .select('id,image_url,title,subtitle,link')
      .eq('active', true)
      .order('sort', { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error && data) setBanners(data as Banner[]);
        setLoaded(true);
      });
    return () => { cancelled = true; };
  }, []);

  const defaults = useMemo(() => decorateWithImages(games, defaultBanners(lang)), [games, lang]);
  // Supabase 이미지 배너(있으면) 앞 + 코드 한글 배너 뒤
  const list = useMemo(() => [...banners, ...defaults], [banners, defaults]);

  // 2장 이상이면 5초마다 자동 전환
  useEffect(() => {
    if (list.length <= 1) return;
    const id = setInterval(() => setIdx(i => (i + 1) % list.length), 5000);
    return () => clearInterval(id);
  }, [list.length]);

  // 로딩 중(Supabase 설정된 경우)엔 스켈레톤으로 자리 유지 → 팝인 방지
  if (!loaded) return isSupabaseReady() ? <div className={styles.skeleton} aria-hidden="true" /> : null;
  if (list.length === 0) return null;
  const safeIdx = idx % list.length;
  const b = list[safeIdx];
  const go = (dir: number) => setIdx(i => (i + dir + list.length) % list.length);

  const inner = b.image_url ? (
    <>
      <img src={b.image_url} alt={b.title ?? (lang ? 'Banner' : '배너')} className={styles.img} />
      {(b.title || b.subtitle) && (
        <div className={styles.overlay}>
          {b.subtitle && <span className={styles.subtitle}>{b.subtitle}</span>}
          {b.title && <span className={styles.title}>{b.title}</span>}
        </div>
      )}
    </>
  ) : (
    // 코드 디자인 배너 — 메시 그라데이션(+선택: 게임 이미지 배경) + 한글 텍스트
    <div className={styles.design} style={{ '--g1': b.c1, '--g2': b.c2 } as CSSProperties}>
      {b.bgImage && !failed.has(b.bgImage) && (
        <img
          src={b.bgImage}
          alt=""
          aria-hidden="true"
          className={styles.designBg}
          loading="lazy"
          onError={() => setFailed(prev => new Set(prev).add(b.bgImage!))}
        />
      )}
      <div className={styles.designInner}>
        {b.tag && <span className={styles.tag}>{b.tag}</span>}
        {b.title && <span className={styles.designTitle}>{b.title}</span>}
        {b.subtitle && <span className={styles.designSub}>{b.subtitle}</span>}
        <span className={styles.designCta}>{t ? t.goTo : '바로가기'} <em aria-hidden="true">→</em></span>
      </div>
    </div>
  );

  return (
    <section className={styles.banner} aria-label={lang ? (lang === 'en' ? 'Featured banners' : 'おすすめバナー') : '추천 배너'}>
      {/* key로 배너가 바뀔 때마다 크로스페이드 */}
      <div key={`${b.id}-${safeIdx}`} className={styles.slide}>
        {b.link ? (
          <a href={b.link} className={styles.link} target={b.link.startsWith('http') ? '_blank' : undefined} rel="noopener">
            {inner}
          </a>
        ) : inner}
      </div>

      {list.length > 1 && (
        <>
          <button type="button" className={`${styles.nav} ${styles.navPrev}`} onClick={() => go(-1)} aria-label={lang ? (lang === 'en' ? 'Previous banner' : '前のバナー') : '이전 배너'}>‹</button>
          <button type="button" className={`${styles.nav} ${styles.navNext}`} onClick={() => go(1)} aria-label={lang ? (lang === 'en' ? 'Next banner' : '次のバナー') : '다음 배너'}>›</button>
          <div className={styles.dots}>
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`${styles.dot} ${i === safeIdx ? styles.dotOn : ''}`}
                onClick={() => setIdx(i)}
                aria-label={lang ? `Banner ${i + 1}` : `배너 ${i + 1}번`}
                aria-current={i === safeIdx}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
