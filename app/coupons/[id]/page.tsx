import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getCouponGame, getCouponPageKeys, getCouponsLastUpdated, getActiveCouponGames, couponKeywords,
} from '@/lib/coupons';
import { formatKoreanDate } from '@/lib/games';
import { CouponList } from '@/components/CouponList';
import { ViewCounter } from '@/components/ViewCounter';
import { PageShell } from '@/components/PageShell';
import styles from '../coupons.module.css';

interface Props {
  params: { id: string }; // coupons.json 키(= 슬러그)
}

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const keys = await getCouponPageKeys();
  return keys.map(id => ({ id }));
}

// 'YYYY-MM-DD' → '2026년 7월'
function yearMonth(iso?: string | null): string {
  if (!iso) return '';
  return `${iso.slice(0, 4)}년 ${Number(iso.slice(5, 7))}월`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = await getCouponGame(params.id);
  if (!g || (g.active.length === 0 && g.expired.length === 0)) return { title: '쿠폰을 찾을 수 없어요' };

  const { name, term, active } = g;
  const lastUpdated = await getCouponsLastUpdated();
  const ym = yearMonth(lastUpdated);
  const url = `https://gcalen.com/coupons/${g.key}`;
  const title = `${name} ${term} 최신 정리${ym ? ` (${ym})` : ''}`;
  const desc = (active.length > 0
    ? `${name} 최신 ${term}(기프트코드) ${active.length}개를 ${ym ? `${ym} 기준 ` : ''}모았습니다. 복사해 게임 내 ${term} 입력란 또는 공식 등록 페이지에 넣으면 무료 보상을 받을 수 있어요. 매일 갱신됩니다.`
    : `${name} ${term}(기프트코드) 정리. 현재 유효한 코드는 없지만 최근 만료 코드와 사용법을 확인하고, 새 코드가 나오면 이곳에서 가장 먼저 받아보세요.`
  ).slice(0, 158);

  return {
    title: { absolute: `${title} | Gcalen` },
    description: desc,
    keywords: [
      ...couponKeywords(name),
      `${name} ${term} 오늘`, `${name} ${term} ${ym}`, `${name} ${term} 최신`,
      '게임 리딤코드', '게임 쿠폰', '기프트코드',
    ],
    alternates: {
      canonical: url,
      languages: { ko: url, en: `https://gcalen.com/en/coupons/${g.key}`, ja: `https://gcalen.com/ja/coupons/${g.key}` },
    },
    openGraph: {
      title, description: desc, url, type: 'article', siteName: '게임 출시 캘린더', locale: 'ko_KR',
      images: [{ url: g.image_url || '/og-image.png', alt: `${name} ${term}` }],
    },
    twitter: { card: 'summary_large_image', title, description: desc, images: [g.image_url || '/og-image.png'] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  };
}

export default async function GameCouponPage({ params }: Props) {
  const g = await getCouponGame(params.id);
  if (!g || (g.active.length === 0 && g.expired.length === 0)) notFound();

  const { key, name, term, active, expired, image_url, game_id, redeem_url } = g;
  const paren = term === '리딤코드' ? '쿠폰·기프트코드' : '기프트코드';
  const heading = term === '리딤코드' ? `${name} 리딤코드` : `${name} 쿠폰 번호`;
  const url = `https://gcalen.com/coupons/${key}`;

  const lastUpdated = await getCouponsLastUpdated();
  const lastUpdatedStr = lastUpdated ? formatKoreanDate(lastUpdated.slice(0, 10)) : null;
  const ym = yearMonth(lastUpdated);
  const todayKst = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
  const freshLabel = lastUpdated === todayKst ? '오늘 업데이트' : lastUpdatedStr ? `${lastUpdatedStr} 업데이트` : null;

  // 최초 등록일 = 코드 중 가장 이른 added (없으면 갱신일)
  const addedDates = [...active, ...expired].map(c => c.added).filter(Boolean).sort() as string[];
  const datePublished = addedDates[0] || lastUpdated || undefined;

  // 관련 게임 쿠폰(내부 링크) — 현재 게임 제외, 유효 쿠폰 있는 게임 최대 8
  const related = (await getActiveCouponGames()).filter(x => x.key !== key).slice(0, 8);

  // 사용법 3스텝(HowTo와 화면 동일 텍스트)
  const steps = [
    { name: '코드 복사', text: `위 코드의 복사 버튼을 눌러 ${term}를 복사합니다.` },
    { name: `${term} 입력 페이지 열기`, text: redeem_url
      ? `${name} 공식 ${term} 등록 페이지를 열거나, 게임 내 설정 › ${term}(기프트코드) 입력 메뉴로 이동합니다.`
      : `${name}를 실행해 설정 › ${term}(기프트코드) 입력 메뉴로 이동합니다.` },
    { name: '등록해 보상 받기', text: '복사한 코드를 붙여넣고 등록하면 보상이 우편함으로 지급됩니다. 대소문자·하이픈(-)까지 정확히 입력하세요.' },
  ];

  // 실검색형 FAQ (화면 + JSON-LD 동일)
  const faqs = [
    {
      q: `${name} ${term}는 어디서 입력하나요?`,
      a: redeem_url
        ? `${name} 공식 ${term} 등록 페이지(웹) 또는 게임 내 설정의 ${term} 입력 메뉴에서 등록할 수 있습니다. 웹 등록 시 계정 로그인 후 캐릭터·서버를 선택하고 코드를 입력하세요.`
        : `게임 내 설정 또는 우편함 근처의 ${term}(기프트코드) 입력 메뉴에서 등록합니다. 게임에 따라 공식 홈페이지의 쿠폰 등록 페이지를 제공하기도 합니다.`,
    },
    {
      q: `오늘 사용 가능한 ${name} ${term}는 무엇인가요?`,
      a: `이 페이지 상단 '사용 가능' 목록이 오늘(${lastUpdatedStr ?? '최근'} 기준) 유효한 코드입니다. 만료·소진된 코드는 아래에 '만료됨'으로 표시하며, 새 코드가 나오면 매일 갱신합니다.`,
    },
    {
      q: `${name} ${term}가 등록되지 않아요.`,
      a: `대소문자와 하이픈(-)까지 정확히 입력했는지 확인하세요. 이미 사용한 코드, 만료·소진된 코드, 계정 레벨·서버(아시아/한국 등) 조건이 맞지 않는 코드는 등록되지 않습니다.`,
    },
    {
      q: `${name} ${term}는 얼마나 자주 나오나요?`,
      a: `보통 공식 방송, 대형 업데이트, 기념 이벤트 시 배포됩니다. 선착순·기간 한정이 많아 나오면 바로 등록하는 것이 좋아요. 이 페이지를 즐겨찾기하면 새 코드를 빠르게 확인할 수 있습니다.`,
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': url,
        url,
        name: `${name} ${term} 최신 정리`,
        ...(image_url ? { primaryImageOfPage: image_url } : {}),
        ...(datePublished ? { datePublished } : {}),
        ...(lastUpdated ? { dateModified: lastUpdated } : {}),
        inLanguage: 'ko',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '홈', item: 'https://gcalen.com/' },
          { '@type': 'ListItem', position: 2, name: '게임 쿠폰', item: 'https://gcalen.com/coupons' },
          { '@type': 'ListItem', position: 3, name: `${name} ${term}`, item: url },
        ],
      },
      {
        '@type': 'HowTo',
        name: `${name} ${term} 사용 방법`,
        step: steps.map((s, i) => ({
          '@type': 'HowToStep', position: i + 1, name: s.name, text: s.text,
          ...(i === 1 && redeem_url ? { url: redeem_url } : {}),
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
          '@type': 'Question', name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className={styles.wrap}>
        <nav className={styles.crumb} aria-label="위치">
          <Link href="/coupons">게임 쿠폰</Link> <span aria-hidden="true">›</span> {name} {term}
        </nav>

        <header className={styles.detailHead}>
          {image_url && <img className={styles.detailThumb} src={image_url} alt={`${name} ${term}`} loading="eager" />}
          <div className={styles.detailHeadBody}>
            <h1 className={styles.title}>{heading} ({paren})</h1>
            {freshLabel && <span className={styles.fresh}>🟢 {freshLabel}</span>}
            <p className={styles.subtitle}>
              {active.length > 0
                ? `${ym ? `${ym} 기준 ` : ''}사용 가능한 ${name} ${term}(기프트코드) ${active.length}개입니다. 코드를 복사해 게임 내 ${term} 입력란 또는 공식 등록 페이지에 넣으면 무료 보상을 받을 수 있어요.`
                : `현재 사용 가능한 ${name} ${term}는 없습니다. 아래는 최근 만료된 코드이며, 새 코드가 나오면 이 페이지에 가장 먼저 업데이트됩니다.`}
            </p>
            <ViewCounter gameId={`coupon:${key}`} />
          </div>
        </header>

        {redeem_url && (
          <a className={styles.redeemBtn} href={redeem_url} target="_blank" rel="noopener nofollow">
            <svg className="ic" aria-hidden="true"><use href="#ic-gift" /></svg>
            {name} 공식 {term} 등록 페이지 열기 →
          </a>
        )}

        {active.length > 0 && <CouponList coupons={active} />}

        {expired.length > 0 && (
          <>
            <h2 className={styles.sectionTitle}>지난 {term} (만료)</h2>
            <CouponList coupons={expired} expired />
          </>
        )}

        {/* 고유 콘텐츠 — 얇은 페이지 방지 */}
        <div className={styles.intro}>
          <p>
            {name} {term}는 게임사가 공식 방송·대형 업데이트·기념 이벤트 때 배포하는 무료 보상 코드입니다.
            이 페이지는 <strong>공식 채널에서 확인된 최신 코드만</strong> 모아 매일 갱신하며, 만료된 코드도 참고용으로 90일간 표시합니다.
            코드는 선착순·기간 한정이 많아 나오면 바로 등록하는 것이 좋고, 서버(아시아·한국 등)나 계정 조건이 붙는 경우가 있으니 각 코드의 보상 설명을 확인하세요.
          </p>
        </div>

        {/* HowTo */}
        <div className={styles.usage}>
          <h2 className={styles.sectionTitle}>{name} {term} 사용 방법</h2>
          <ol className={styles.steps}>
            {steps.map((s, i) => (
              <li key={i}>
                <strong>{s.name}</strong> — {i === 1 && redeem_url
                  ? <>위 <a href={redeem_url} target="_blank" rel="noopener nofollow">공식 {term} 등록 페이지</a>를 열거나, 게임 내 설정 › {term} 입력 메뉴로 이동합니다.</>
                  : s.text}
              </li>
            ))}
          </ol>
        </div>

        {/* FAQ (화면 + 구조화 데이터) */}
        <div className={styles.faq}>
          <h2 className={styles.sectionTitle}>{name} {term} 자주 묻는 질문</h2>
          <dl className={styles.faqList}>
            {faqs.map((f, i) => (
              <div key={i} className={styles.faqItem}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* 관련 게임 쿠폰 — 내부 링크 */}
        {related.length > 0 && (
          <div className={styles.relatedGames}>
            <h2 className={styles.sectionTitle}>다른 게임 {term === '리딤코드' ? '리딤코드·쿠폰' : '쿠폰'}</h2>
            <div className={styles.chips}>
              {related.map(r => (
                <Link key={r.key} href={`/coupons/${r.key}`} className={styles.chip}>
                  {r.name} {r.term}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className={styles.related}>
          <Link href={`/games/${key}`} className={styles.relatedLink}>{name} 게임 허브 (쿠폰·일정 전체) →</Link>
          {game_id && <Link href={`/game/${game_id}`} className={styles.relatedLink}>{name} 출시일·게임 정보 →</Link>}
          <Link href="/coupons" className={styles.relatedLink}>게임 쿠폰 모음 →</Link>
        </div>

        {lastUpdatedStr && (
          <p className={styles.note}>마지막 업데이트: {lastUpdatedStr}. 코드는 게임사 공식 채널 기준으로 검증하며, 만료·소진 시 표시가 변경됩니다.</p>
        )}
      </section>
    </PageShell>
  );
}
