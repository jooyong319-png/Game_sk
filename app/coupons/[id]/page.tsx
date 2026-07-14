import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getGameCoupons, getCouponPageGameIds, getCouponsLastUpdated, couponDisplayName } from '@/lib/coupons';
import { getGameById, formatKoreanDate } from '@/lib/games';
import { CouponList } from '@/components/CouponList';
import { PageShell } from '@/components/PageShell';
import styles from '../coupons.module.css';

interface Props {
  params: { id: string };
}

export const dynamic = 'force-dynamic';

// 쿠폰이 있는 게임만 정적 경로로 생성(나머지는 dynamicParams로 온디맨드 → 없으면 404)
export async function generateStaticParams() {
  const ids = await getCouponPageGameIds();
  return ids.map(id => ({ id }));
}

// "게임명 쿠폰" 검색어 변형(콜론·첫 단어까지 커버) — 게임 상세와 동일 전략
function couponKeywords(nameKo: string): string[] {
  const noColon = nameKo.replace(/[:：]/g, '').replace(/\s+/g, ' ').trim();
  const first = nameKo.split(/[:：\s]/).filter(Boolean)[0];
  return Array.from(new Set([
    `${nameKo} 쿠폰`, `${nameKo} 쿠폰번호`, `${nameKo} 쿠폰코드`, `${nameKo} 기프트코드`,
    `${noColon} 쿠폰`, `${first} 쿠폰`, `${first} 쿠폰번호`, `${first} 기프트코드`,
  ]));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const game = await getGameById(params.id);
  if (!game) return { title: '쿠폰을 찾을 수 없어요' };
  const { active, expired } = await getGameCoupons(game.id);
  if (active.length === 0 && expired.length === 0) return { title: '쿠폰을 찾을 수 없어요' };

  const name = couponDisplayName(game.name_ko);
  const url = `https://gcalen.com/coupons/${game.id}`;
  const title = `${name} 쿠폰 번호·기프트코드 최신 정리`;
  const desc = (active.length > 0
    ? `${name} 최신 쿠폰 번호(기프트코드) ${active.length}개를 모았습니다. 코드를 복사해 게임 내 쿠폰 입력란에 넣으면 무료 보상을 받을 수 있어요. 만료·신규 쿠폰을 계속 업데이트합니다.`
    : `${name} 쿠폰 번호(기프트코드) 정리. 현재 유효한 쿠폰은 없지만 최근 만료 코드와 사용법을 확인하고, 새 쿠폰이 나오면 이곳에서 가장 먼저 받아보세요.`
  ).slice(0, 158);

  return {
    title: { absolute: `${title} | Gcalen` },
    description: desc,
    keywords: [...couponKeywords(name), '게임 쿠폰', '기프트코드', '쿠폰번호 모음'],
    alternates: { canonical: url },
    openGraph: {
      title, description: desc, url, type: 'article', siteName: '게임 출시 캘린더', locale: 'ko_KR',
      images: [{ url: game.image_url || '/og-image.png', alt: `${name} 쿠폰` }],
    },
    twitter: { card: 'summary_large_image', title, description: desc, images: [game.image_url || '/og-image.png'] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  };
}

export default async function GameCouponPage({ params }: Props) {
  const game = await getGameById(params.id);
  if (!game) notFound();

  const { active, expired } = await getGameCoupons(game.id);
  if (active.length === 0 && expired.length === 0) notFound();

  const name = couponDisplayName(game.name_ko);
  const url = `https://gcalen.com/coupons/${game.id}`;
  const lastUpdated = await getCouponsLastUpdated();
  const lastUpdatedStr = lastUpdated ? formatKoreanDate(lastUpdated.slice(0, 10)) : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '홈', item: 'https://gcalen.com/' },
          { '@type': 'ListItem', position: 2, name: '게임 쿠폰', item: 'https://gcalen.com/coupons' },
          { '@type': 'ListItem', position: 3, name: `${name} 쿠폰`, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `${name} 쿠폰(기프트코드)은 어떻게 사용하나요?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `게임 내 설정 또는 쿠폰 입력 메뉴, 혹은 공식 쿠폰 등록 페이지에 코드를 그대로 입력하면 보상이 지급됩니다. 대소문자와 하이픈(-)까지 정확히 입력해야 하며, 이미 사용했거나 만료·소진된 코드는 등록되지 않습니다.`,
            },
          },
          {
            '@type': 'Question',
            name: `${name} 쿠폰은 얼마나 자주 업데이트되나요?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `게임사가 새 쿠폰을 배포하면 이 페이지에 추가하고, 만료된 코드는 '만료됨'으로 표시합니다. 새 쿠폰을 놓치지 않으려면 이 페이지를 즐겨찾기해 두세요.`,
            },
          },
        ],
      },
    ],
  };

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className={styles.wrap}>
        <nav className={styles.crumb} aria-label="위치">
          <Link href="/coupons">게임 쿠폰</Link> <span aria-hidden="true">›</span> {name}
        </nav>

        <header className={styles.header}>
          <h1 className={styles.title}>
            <svg className="ic" aria-hidden="true"><use href="#ic-gift" /></svg>
            {name} 쿠폰 번호 (기프트코드)
          </h1>
          <p className={styles.subtitle}>
            {active.length > 0
              ? `현재 사용 가능한 ${name} 쿠폰(기프트코드) ${active.length}개입니다. 아래 코드를 복사해 게임 내 쿠폰 입력란 또는 공식 쿠폰 등록 페이지에 넣으면 무료 보상을 받을 수 있어요. 코드는 게임사 사정에 따라 만료되거나 조기 소진될 수 있습니다.`
              : `현재 사용 가능한 ${name} 쿠폰은 없습니다. 아래는 최근 만료된 코드이며, 새 쿠폰이 나오면 이 페이지에 가장 먼저 업데이트됩니다.`}
          </p>
        </header>

        {active.length > 0 && <CouponList coupons={active} />}

        {expired.length > 0 && (
          <>
            <h2 className={styles.sectionTitle}>지난 쿠폰 (만료)</h2>
            <CouponList coupons={expired} expired />
          </>
        )}

        <div className={styles.usage}>
          <h2 className={styles.sectionTitle}>쿠폰 사용 방법</h2>
          <ol className={styles.steps}>
            <li>위 코드의 <strong>복사</strong> 버튼을 눌러 쿠폰 번호를 복사합니다.</li>
            <li>{name}를 실행해 <strong>설정 › 쿠폰(기프트코드) 입력</strong> 메뉴 또는 공식 쿠폰 등록 페이지로 이동합니다.</li>
            <li>복사한 코드를 붙여넣고 등록하면 보상이 우편함으로 지급됩니다. 대소문자·하이픈까지 정확히 입력하세요.</li>
          </ol>
        </div>

        <div className={styles.related}>
          <Link href={`/game/${game.id}`} className={styles.relatedLink}>
            {name} 출시일·게임 정보 보기 →
          </Link>
          <Link href="/coupons" className={styles.relatedLink}>다른 게임 쿠폰 모음 →</Link>
        </div>

        {lastUpdatedStr && (
          <p className={styles.note}>마지막 업데이트: {lastUpdatedStr}. 쿠폰은 게임사 공식 채널 기준으로 검증하며, 만료·소진 시 표시가 변경됩니다.</p>
        )}
      </section>
    </PageShell>
  );
}
