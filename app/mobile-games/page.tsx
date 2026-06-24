import type { Metadata } from 'next';
import { getUpcomingGamesByCategory } from '@/lib/games';
import { SeoLanding } from '@/components/SeoLanding';

export const metadata: Metadata = {
  title: '신규 모바일 게임 출시 일정',
  description: '국내 출시 예정 신규 모바일 게임 일정 총정리. 넷마블, 카카오게임즈, 넥슨 등 모바일 게임 출시일을 한눈에.',
  alternates: { canonical: 'https://gcalen.com/mobile-games' },
  openGraph: { url: 'https://gcalen.com/mobile-games', type: 'website' },
};

export default async function Page() {
  const games = await getUpcomingGamesByCategory('mobile_kr'); // 지난 출시 제외
  return (
    <SeoLanding
      slug="mobile-games"
      h1="국내 신규 모바일 게임 출시 일정"
      intro={
        <>
          <p>
            국내에 출시 예정인 <strong>신규 모바일 게임</strong> 일정을 한눈에 모았습니다. 넥슨, 넷마블,
            카카오게임즈, 엔씨소프트, 그라비티 등 주요 퍼블리셔의 신작은 물론, 신규 IP와 서브컬처 기대작까지
            출시일이 가까운 순으로 정리해 매일 업데이트합니다.
          </p>
          <p>
            모바일 신작은 정식 출시 전 <strong>사전예약</strong> 기간에 따라 첫날 보상이 달라지는 경우가 많습니다.
            관심 있는 게임은 <a href="/pre-registration">사전예약 페이지</a>에서 함께 확인하고, 출시일을 놓치지
            않도록 즐겨찾기에 추가해두는 것을 추천합니다. 각 게임을 누르면 개발사·플랫폼·장르와 정확한 출시 일정을
            볼 수 있어요.
          </p>
        </>
      }
      games={games}
    />
  );
}
