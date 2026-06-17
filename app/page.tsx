import type { Metadata } from 'next';
import { getAllGames, getLastUpdated } from '@/lib/games';
import { Home } from '@/components/Home';

export const metadata: Metadata = {
  title: '게임 출시 캘린더 | 국내외 신작·신규 서버 일정 한눈에',
  description: '국내 모바일·PC/콘솔 게임, 글로벌 대작, 한국 MMORPG 신규 서버 오픈 일정을 한눈에. 매일 업데이트되는 게임 출시 캘린더.',
  alternates: { canonical: 'https://gcalen.com/' },
  openGraph: { url: 'https://gcalen.com/', type: 'website' },
};

export default async function HomePage() {
  const games = await getAllGames();
  const lastUpdated = await getLastUpdated();
  // 빌드(SSR) 시점의 '현재 시각' 기준값. 클라 첫 렌더도 이 값을 써서 하이드레이션 불일치 제거.
  const serverNow = new Date().toISOString();

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '게임 출시 캘린더',
    url: 'https://gcalen.com/',
    description: '국내외 신작 게임 및 한국 MMORPG 신규 서버 오픈 일정 캘린더',
    inLanguage: 'ko-KR',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Home initialGames={games} lastUpdated={lastUpdated} serverNow={serverNow} />
      <nav className="seo-nav" aria-label="카테고리 바로가기">
        <a href="/upcoming-games">신규 게임 출시 예정 일정</a>
        <a href="/new-servers">신규 서버·대규모 이벤트 일정</a>
        <a href="/mobile-games">국내 신규 모바일 게임 출시 일정</a>
        <a href="/pc-console-games">신규 PC·콘솔 게임 출시 일정</a>
        <a href="/global-games">글로벌 대작 게임 출시 일정</a>
        <a href="/blog">게임 신작 가이드</a>
      </nav>
    </>
  );
}
