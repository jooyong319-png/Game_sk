import type { Metadata } from 'next';
import { getUpcomingGamesByCategory } from '@/lib/games';
import { SeoLanding } from '@/components/SeoLanding';

export const metadata: Metadata = {
  title: '신규 서버 오픈 일정 | 리니지·로스트아크·메이플 신서버',
  description: '리니지M, 리니지W, 로스트아크, 메이플스토리, 오딘 등 한국 MMORPG 신규 서버 오픈 일정 총정리. 신서버 오픈일을 한눈에.',
  alternates: { canonical: 'https://gcalen.com/new-servers' },
  openGraph: { url: 'https://gcalen.com/new-servers', type: 'website' },
};

export default async function Page() {
  const games = await getUpcomingGamesByCategory('new_server'); // 지난 출시 제외
  return (
    <SeoLanding
      slug="new-servers"
      h1="신규 서버 오픈 일정"
      intro={<>리니지, 로스트아크, 메이플스토리, 오딘 등 한국 MMORPG <strong>신규 서버</strong> 오픈 일정을 정리했습니다. 새로 시작하기 좋은 <strong>신서버</strong> 오픈일을 확인하세요.</>}
      games={games}
    />
  );
}
