import type { Metadata } from 'next';
import { getUpcomingGames } from '@/lib/games';
import { SeoLanding } from '@/components/SeoLanding';

export const metadata: Metadata = {
  title: '신규 게임 출시 예정 일정 2026',
  description: '국내외 신규 게임 출시 예정 일정 총정리. 모바일·PC·콘솔·글로벌 대작까지 다가오는 게임 출시일을 한눈에 확인하세요.',
  alternates: { canonical: 'https://gcalen.com/upcoming-games' },
  openGraph: { url: 'https://gcalen.com/upcoming-games', type: 'website' },
};

export default async function Page() {
  const games = await getUpcomingGames(); // 이미 지난 출시 제외
  return (
    <SeoLanding
      slug="upcoming-games"
      h1="신규 게임 출시 예정 일정"
      intro={
        <>
          <p>
            국내외 <strong>신규 게임 출시</strong> 예정 일정을 한곳에 모았습니다. 모바일 게임부터 PC·콘솔,
            글로벌 대작, 한국 MMORPG 신규 서버까지 — 다가오는 <strong>게임 출시일</strong>을 날짜순으로
            정리해 매일 갱신합니다. 흩어진 출시 정보를 찾아다닐 필요 없이 한 페이지에서 확인할 수 있어요.
          </p>
          <p>
            카테고리별로 더 자세히 보고 싶다면 <a href="/mobile-games">모바일</a>,
            {' '}<a href="/pc-console-games">PC·콘솔</a>, <a href="/global-games">글로벌 대작</a>,
            {' '}<a href="/new-servers">신규 서버·이벤트</a> 페이지를 이용하세요. 각 게임을 누르면 개발사와
            플랫폼, 남은 D-day까지 확인할 수 있고, 관심 게임은 즐겨찾기에 담아 출시일을 놓치지 않을 수 있습니다.
          </p>
        </>
      }
      games={games}
    />
  );
}
