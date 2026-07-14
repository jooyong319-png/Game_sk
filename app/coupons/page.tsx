import type { Metadata } from 'next';
import Link from 'next/link';
import { getActiveCouponGames } from '@/lib/coupons';
import { PageShell } from '@/components/PageShell';
import styles from './coupons.module.css';

export const metadata: Metadata = {
  title: '게임 쿠폰·리딤코드 모음 | 기프트코드 총정리',
  description: '사용 가능한 쿠폰·리딤코드(기프트코드)가 있는 인기 게임 모음. 게임을 눌러 최신 코드와 사용법을 확인하고, 복사해 게임에 입력하면 무료 보상을 받을 수 있어요. 매일 업데이트됩니다.',
  alternates: { canonical: 'https://gcalen.com/coupons' },
  openGraph: { url: 'https://gcalen.com/coupons', type: 'website', title: '게임 쿠폰·리딤코드 모음' },
};

export const dynamic = 'force-dynamic';

export default async function CouponsPage() {
  const games = await getActiveCouponGames();
  const totalCodes = games.reduce((s, g) => s + g.active.length, 0);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: games.map((g, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${g.name} ${g.term}`,
      url: `https://gcalen.com/coupons/${g.key}`,
    })),
  };

  return (
    <PageShell>
      {games.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <section className={styles.wrap}>
        <header className={styles.header}>
          <h1 className={styles.title}><svg className="ic" aria-hidden="true"><use href="#ic-gift" /></svg> 게임 쿠폰·리딤코드 모음</h1>
          <p className={styles.subtitle}>
            지금 <strong>사용 가능한 쿠폰·리딤코드</strong>가 있는 게임입니다. 게임을 눌러 전체 코드와 사용법을 확인하세요.
            {totalCodes > 0 && ` 현재 ${games.length}개 게임 · ${totalCodes}개 코드.`}
          </p>
        </header>

        {games.length === 0 ? (
          <p className={styles.empty}>
            아직 사용 가능한 쿠폰이 없어요. 게임사가 새 쿠폰을 배포하면 이곳에 올라옵니다. 곧 채워질 예정이에요!
          </p>
        ) : (
          <ul className={styles.grid}>
            {games.map(g => (
              <li key={g.key} className={styles.card}>
                <Link href={`/coupons/${g.key}`} className={styles.cardLink}>
                  {g.image_url
                    ? <img className={styles.thumb} src={g.image_url} alt="" loading="lazy" />
                    : <span className={styles.thumbPlaceholder} aria-hidden="true">🎮</span>}
                  <span className={styles.body}>
                    <span className={styles.name}>{g.name}</span>
                    <span className={styles.meta}>
                      <span className={styles.tagCoupon}>{g.term} {g.active.length}개</span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className={styles.links}>
          <Link href="/games" className={styles.link}>전체 게임 목록 →</Link>
        </div>
        <p className={styles.note}>
          코드는 게임사 사정에 따라 만료되거나 조기 소진될 수 있습니다. 각 게임 페이지에서 최신 코드·사용법·지난 코드를 확인하세요.
        </p>
      </section>
    </PageShell>
  );
}
