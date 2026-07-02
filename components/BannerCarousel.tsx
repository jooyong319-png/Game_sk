'use client';
import { useEffect, useState } from 'react';
import { supabase, isSupabaseReady } from '@/lib/supabase';
import styles from './BannerCarousel.module.css';

interface Banner {
  id: number;
  image_url: string;
  title: string | null;
  subtitle: string | null;
  link: string | null;
}

// 홈 상단 히어로 배너 — Supabase `banners` 테이블(active=true, sort 순)에서 읽어 캐러셀로 표시.
// 관리자는 Supabase 대시보드에서 Storage 업로드 + banners 행 추가로 관리(코드/배포 불필요).
// 미설정·0건이면 아무것도 렌더하지 않음(우아한 폴백).
export function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [idx, setIdx] = useState(0);

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

  // 2장 이상이면 5초마다 자동 전환
  useEffect(() => {
    if (banners.length <= 1) return;
    const id = setInterval(() => setIdx(i => (i + 1) % banners.length), 5000);
    return () => clearInterval(id);
  }, [banners.length]);

  // 로딩 중(Supabase 설정된 경우)엔 스켈레톤으로 자리 유지 → 팝인 방지
  if (!loaded) return isSupabaseReady() ? <div className={styles.skeleton} aria-hidden="true" /> : null;
  if (banners.length === 0) return null;
  const safeIdx = idx % banners.length;
  const b = banners[safeIdx];

  const inner = (
    <>
      <img src={b.image_url} alt={b.title ?? '배너'} className={styles.img} />
      {(b.title || b.subtitle) && (
        <div className={styles.overlay}>
          {b.subtitle && <span className={styles.subtitle}>{b.subtitle}</span>}
          {b.title && <span className={styles.title}>{b.title}</span>}
        </div>
      )}
    </>
  );

  return (
    <section className={styles.banner} aria-label="추천 배너">
      {b.link ? (
        <a href={b.link} className={styles.link} target={b.link.startsWith('http') ? '_blank' : undefined} rel="noopener">
          {inner}
        </a>
      ) : inner}

      {banners.length > 1 && (
        <div className={styles.dots}>
          {banners.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.dot} ${i === safeIdx ? styles.dotOn : ''}`}
              onClick={() => setIdx(i)}
              aria-label={`배너 ${i + 1}번`}
              aria-current={i === safeIdx}
            />
          ))}
        </div>
      )}
    </section>
  );
}
