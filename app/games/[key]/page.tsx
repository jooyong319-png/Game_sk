import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getGameHub, getGameHubKeys } from '@/lib/game-hub';
import { getCouponsLastUpdated, couponKeywords } from '@/lib/coupons';
import { formatKoreanDate } from '@/lib/games';
import { CouponList } from '@/components/CouponList';
import { ViewCounter } from '@/components/ViewCounter';
import { PageShell } from '@/components/PageShell';
import styles from './games.module.css';

interface Props {
  params: { key: string }; // coupons.json(게임 카탈로그) 키
}

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const keys = await getGameHubKeys();
  return keys.map(key => ({ key }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const hub = await getGameHub(params.key);
  if (!hub) return { title: '게임을 찾을 수 없어요' };
  const { view } = hub;
  const { name, term } = view;
  const url = `https://gcalen.com/games/${view.key}`;
  const title = `${name} ${term}·이벤트·업데이트 일정 총정리`;
  const desc = `${name}의 최신 ${term}(기프트코드)와 다가오는 업데이트·이벤트·출시 일정을 한곳에 모았습니다. 코드는 복사해 바로 쓰고, 일정은 캘린더로 놓치지 마세요. 매일 업데이트됩니다.`.slice(0, 158);

  return {
    title: { absolute: `${title} | Gcalen` },
    description: desc,
    keywords: [...couponKeywords(name), `${name} 일정`, `${name} 이벤트`, `${name} 업데이트`, `${name} 신규 이벤트`],
    alternates: {
      canonical: url,
      languages: { ko: url, en: `https://gcalen.com/en/games/${view.key}`, ja: `https://gcalen.com/ja/games/${view.key}` },
    },
    openGraph: {
      title, description: desc, url, type: 'article', siteName: '게임 출시 캘린더', locale: 'ko_KR',
      images: [{ url: view.image_url || '/og-image.png', alt: name }],
    },
    twitter: { card: 'summary_large_image', title, description: desc, images: [view.image_url || '/og-image.png'] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  };
}

export default async function GameHubPage({ params }: Props) {
  const hub = await getGameHub(params.key);
  if (!hub) notFound();
  const { view, related } = hub;
  const { key, name, term, active, expired, image_url } = view;

  // 쿠폰도 없고 연결된 일정도 없으면 보여줄 게 없음 → 404(얇은 페이지 방지)
  if (active.length === 0 && expired.length === 0 && related.length === 0) notFound();

  const url = `https://gcalen.com/games/${key}`;
  const lastUpdated = await getCouponsLastUpdated();
  const todayKst = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '홈', item: 'https://gcalen.com/' },
          { '@type': 'ListItem', position: 2, name: '게임 쿠폰', item: 'https://gcalen.com/coupons' },
          { '@type': 'ListItem', position: 3, name, item: url },
        ],
      },
      {
        '@type': 'VideoGame',
        name,
        ...(image_url ? { image: image_url } : {}),
        url,
        applicationCategory: 'Game',
      },
    ],
  };

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className={styles.wrap}>
        <header className={styles.hero}>
          {image_url && <img className={styles.heroImg} src={image_url} alt={name} loading="eager" />}
          <div className={styles.heroBody}>
            <h1 className={styles.title}>{name}</h1>
            <div className={styles.badges}>
              {active.length > 0 && <span className={styles.badge}>{term} {active.length}개</span>}
              {related.length > 0 && <span className={styles.badgeAlt}>일정 {related.length}건</span>}
            </div>
            <p className={styles.lead}>
              {name}의 최신 {term}과 다가오는 업데이트·이벤트·출시 일정을 모았습니다.
            </p>
            <ViewCounter gameId={`hub:${key}`} />
          </div>
        </header>

        {/* ── 쿠폰/리딤코드 요약 ── */}
        {(active.length > 0 || expired.length > 0) && (
          <div className={styles.block}>
            <h2 className={styles.blockTitle}>{name} {term} (기프트코드)</h2>
            {active.length > 0
              ? <CouponList coupons={active} />
              : <p className={styles.muted}>현재 유효한 코드는 없어요. 최근 만료 코드와 사용법은 전용 페이지에서 확인하세요.</p>}
            <Link href={`/coupons/${key}`} className={styles.moreLink}>
              {name} {term} 전용 페이지 (사용법·지난 코드 전체) →
            </Link>
          </div>
        )}

        {/* ── 관련 일정(캘린더) ── */}
        {related.length > 0 && (
          <div className={styles.block}>
            <h2 className={styles.blockTitle}>{name} 출시·업데이트·이벤트 일정</h2>
            <ul className={styles.schedule}>
              {related.map(g => {
                const upcoming = g.release_date_approx || g.release_date >= todayKst;
                const dateStr = g.release_date_approx ? '미정' : formatKoreanDate(g.release_date);
                return (
                  <li key={g.id} className={styles.schedItem}>
                    <Link href={`/game/${g.id}`} className={styles.schedLink}>
                      {g.image_url && <img className={styles.schedThumb} src={g.image_url} alt="" loading="lazy" />}
                      <span className={styles.schedText}>
                        <span className={styles.schedName}>{g.name_ko}</span>
                        <span className={styles.schedMeta}>
                          <span className={upcoming ? styles.schedDateUp : styles.schedDate}>{dateStr}</span>
                          {upcoming && <span className={styles.schedTag}>예정</span>}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className={styles.related}>
          <Link href="/games" className={styles.relatedLink}>전체 게임 목록 →</Link>
          <Link href="/coupons" className={styles.relatedLink}>다른 게임 쿠폰 모음 →</Link>
          <Link href="/" className={styles.relatedLink}>게임 출시 캘린더 →</Link>
        </div>

        {lastUpdated && (
          <p className={styles.note}>마지막 업데이트: {formatKoreanDate(lastUpdated.slice(0, 10))}. 코드·일정은 공식 채널 기준으로 검증합니다.</p>
        )}
      </section>
    </PageShell>
  );
}
