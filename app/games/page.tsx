import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllGameHubs } from '@/lib/game-hub';
import { PageShell } from '@/components/PageShell';
import styles from './list.module.css';

export const metadata: Metadata = {
  title: '게임 목록 | 쿠폰·리딤코드·업데이트 일정',
  description: 'Gcalen이 추적하는 게임 목록. 각 게임의 최신 쿠폰·리딤코드(기프트코드)와 출시·업데이트·이벤트 일정을 한곳에서 확인하세요. 매일 업데이트됩니다.',
  alternates: { canonical: 'https://gcalen.com/games' },
  openGraph: { url: 'https://gcalen.com/games', type: 'website', title: '게임 목록 | Gcalen' },
};

export const dynamic = 'force-dynamic';

export default async function GamesIndexPage() {
  const games = await getAllGameHubs();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: games.map((g, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: g.name,
      url: `https://gcalen.com/games/${g.key}`,
    })),
  };

  return (
    <PageShell>
      {games.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <section className={styles.wrap}>
        <header className={styles.header}>
          <h1 className={styles.title}><svg className="ic" aria-hidden="true"><use href="#ic-gamepad" /></svg> 게임 목록</h1>
          <p className={styles.subtitle}>
            게임별 <strong>쿠폰·리딤코드</strong>와 <strong>출시·업데이트·이벤트 일정</strong>을 한곳에. 게임을 눌러 허브에서 자세히 확인하세요.
          </p>
        </header>

        {games.length === 0 ? (
          <p className={styles.empty}>아직 등록된 게임이 없어요. 곧 채워질 예정이에요!</p>
        ) : (
          <ul className={styles.grid}>
            {games.map(g => (
              <li key={g.key} className={styles.card}>
                <Link href={`/games/${g.key}`} className={styles.cardLink}>
                  {g.image_url
                    ? <img className={styles.thumb} src={g.image_url} alt="" loading="lazy" />
                    : <span className={styles.thumbPlaceholder} aria-hidden="true">🎮</span>}
                  <span className={styles.body}>
                    <span className={styles.name}>{g.name}</span>
                    <span className={styles.meta}>
                      {g.activeCount > 0 && <span className={styles.tagCoupon}>{g.term} {g.activeCount}</span>}
                      {g.relatedCount > 0 && <span className={styles.tagSched}>일정 {g.relatedCount}</span>}
                      {g.activeCount === 0 && g.relatedCount === 0 && g.expiredCount > 0 && (
                        <span className={styles.tagMuted}>지난 코드 {g.expiredCount}</span>
                      )}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className={styles.links}>
          <Link href="/coupons" className={styles.link}>게임 쿠폰 모음 →</Link>
          <Link href="/" className={styles.link}>게임 출시 캘린더 →</Link>
        </div>
      </section>
    </PageShell>
  );
}
