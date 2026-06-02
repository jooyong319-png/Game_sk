import type { Metadata } from 'next';
import { getGamesByCategory } from '@/lib/games';
import { SeoLanding } from '@/components/SeoLanding';

export const metadata: Metadata = {
  title: '신규 모바일 게임 출시 일정',
  description: '국내 출시 예정 신규 모바일 게임 일정 총정리. 넷마블, 카카오게임즈, 넥슨 등 모바일 게임 출시일을 한눈에.',
  alternates: { canonical: 'https://gcalen.com/mobile-games' },
  openGraph: { url: 'https://gcalen.com/mobile-games', type: 'website' },
};

export default async function Page() {
  const games = await getGamesByCategory('mobile_kr');
  return (
    <SeoLanding
      slug="mobile-games"
      h1="국내 신규 모바일 게임 출시 일정"
      intro={<>국내 출시 예정 <strong>신규 모바일 게임</strong> 일정입니다. 다가오는 <strong>모바일 게임 출시</strong>일을 확인하세요.</>}
      games={games}
    />
  );
}
