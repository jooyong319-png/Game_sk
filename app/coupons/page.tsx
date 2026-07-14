import type { Metadata } from 'next';
import Link from 'next/link';
import { getActiveCouponGames } from '@/lib/coupons';
import { CouponList } from '@/components/CouponList';
import { PageShell } from '@/components/PageShell';
import styles from './coupons.module.css';

export const metadata: Metadata = {
  title: '게임 쿠폰·리딤코드 모음 | 기프트코드 총정리',
  description: '인기 게임의 최신 쿠폰 번호·리딤코드(기프트코드)를 한곳에 모았습니다. 코드를 복사해 게임에 입력하면 무료 보상을 받을 수 있어요. 매일 업데이트됩니다.',
  alternates: { canonical: 'https://gcalen.com/coupons' },
  openGraph: { url: 'https://gcalen.com/coupons', type: 'website', title: '게임 쿠폰·리딤코드 모음' },
};

export const dynamic = 'force-dynamic';

export default async function CouponsPage() {
  const games = await getActiveCouponGames();
  const totalCodes = games.reduce((s, g) => s + g.active.length, 0);

  return (
    <PageShell>
      <section className={styles.wrap}>
        <header className={styles.header}>
          <h1 className={styles.title}><svg className="ic" aria-hidden="true"><use href="#ic-gift" /></svg> 게임 쿠폰·리딤코드 모음</h1>
          <p className={styles.subtitle}>
            인기 게임의 최신 쿠폰·리딤코드(기프트코드)를 모았습니다. 코드를 복사해 게임 내 입력란에 넣으면 무료 보상을 받을 수 있어요.
            {totalCodes > 0 && ` 현재 ${games.length}개 게임 · ${totalCodes}개 코드.`}
          </p>
        </header>

        {games.length === 0 ? (
          <p className={styles.empty}>
            아직 등록된 쿠폰이 없어요. 게임사가 새 쿠폰을 배포하면 이곳과 각 게임 전용 페이지에 올라옵니다. 곧 채워질 예정이에요!
          </p>
        ) : (
          <div className={styles.games}>
            {games.map(g => (
              <section key={g.key} className={styles.gameCard}>
                <h2 className={styles.gameName}>
                  <Link href={`/coupons/${g.key}`}>{g.name} {g.term}</Link>
                  <span className={styles.count}>{g.active.length}개</span>
                </h2>
                <CouponList coupons={g.active} />
                <Link href={`/coupons/${g.key}`} className={styles.moreLink}>
                  {g.name} {g.term} 전용 페이지 (사용법·지난 코드) →
                </Link>
              </section>
            ))}
          </div>
        )}

        <p className={styles.note}>
          코드는 게임사 사정에 따라 만료되거나 조기 소진될 수 있습니다. 사용법과 최신 일정은 각 게임 전용 페이지 또는 공식 채널을 확인해 주세요.
        </p>
      </section>
    </PageShell>
  );
}
