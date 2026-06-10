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
      intro={<>국내외 <strong>신규 게임 출시</strong> 예정 일정을 한곳에 모았습니다. 모바일 게임부터 PC·콘솔, 글로벌 대작까지 다가오는 <strong>게임 출시일</strong>을 날짜순으로 확인하세요.</>}
      games={games}
    />
  );
}
