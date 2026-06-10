import type { Metadata } from 'next';
import { getUpcomingGamesByCategory } from '@/lib/games';
import { SeoLanding } from '@/components/SeoLanding';

export const metadata: Metadata = {
  title: '글로벌 대작 신작 게임 출시 일정 2026',
  description: '전 세계 주목 대작 신작 게임 출시 일정 총정리. GTA 6 등 글로벌 AAA 게임 출시일을 한눈에.',
  alternates: { canonical: 'https://gcalen.com/global-games' },
  openGraph: { url: 'https://gcalen.com/global-games', type: 'website' },
};

export default async function Page() {
  const games = await getUpcomingGamesByCategory('global_aaa'); // 지난 출시 제외
  return (
    <SeoLanding
      slug="global-games"
      h1="글로벌 대작 게임 출시 일정"
      intro={<>전 세계가 주목하는 <strong>대작 신작 게임</strong> 출시 일정입니다. 글로벌 AAA <strong>게임 출시</strong>일을 확인하세요.</>}
      games={games}
    />
  );
}
