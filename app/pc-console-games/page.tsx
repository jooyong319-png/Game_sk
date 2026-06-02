import type { Metadata } from 'next';
import { getGamesByCategory } from '@/lib/games';
import { SeoLanding } from '@/components/SeoLanding';

export const metadata: Metadata = {
  title: '신규 PC·콘솔 게임 출시 일정',
  description: '국내 출시 예정 PC·콘솔 신작 게임 일정 총정리. 스팀, PS5, Xbox, 닌텐도 스위치 게임 출시일을 한눈에.',
  alternates: { canonical: 'https://gcalen.com/pc-console-games' },
  openGraph: { url: 'https://gcalen.com/pc-console-games', type: 'website' },
};

export default async function Page() {
  const games = await getGamesByCategory('pc_console_kr');
  return (
    <SeoLanding
      slug="pc-console-games"
      h1="신규 PC·콘솔 게임 출시 일정"
      intro={<>국내 출시 예정 <strong>PC·콘솔 신작 게임</strong> 일정입니다. 스팀, PS5, Xbox, 스위치 등 <strong>게임 출시</strong>일을 확인하세요.</>}
      games={games}
    />
  );
}
