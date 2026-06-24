import type { Metadata } from 'next';
import { getUpcomingGamesByCategory } from '@/lib/games';
import { SeoLanding } from '@/components/SeoLanding';

export const metadata: Metadata = {
  title: '신규 PC·콘솔 게임 출시 일정',
  description: '국내 출시 예정 PC·콘솔 신작 게임 일정 총정리. 스팀, PS5, Xbox, 닌텐도 스위치 게임 출시일을 한눈에.',
  alternates: { canonical: 'https://gcalen.com/pc-console-games' },
  openGraph: { url: 'https://gcalen.com/pc-console-games', type: 'website' },
};

export default async function Page() {
  const games = await getUpcomingGamesByCategory('pc_console_kr'); // 지난 출시 제외
  return (
    <SeoLanding
      slug="pc-console-games"
      h1="신규 PC·콘솔 게임 출시 일정"
      intro={
        <>
          <p>
            국내 출시 예정인 <strong>PC·콘솔 신작 게임</strong> 일정을 모았습니다. 스팀(PC), PS5, Xbox Series,
            닌텐도 스위치·스위치2까지 플랫폼을 가리지 않고, 국산 PC MMORPG부터 콘솔 패키지 신작까지 출시일이
            가까운 순으로 정리해 매일 갱신합니다.
          </p>
          <p>
            아이온2·아키에이지 크로니클·크로노 오디세이 같은 <strong>국산 PC MMORPG 기대작</strong>은
            {' '}<a href="/blog">신작 가이드</a>에서 별도로 분석하고 있습니다. 같은 게임이라도 PC·콘솔 버전의
            출시 시기나 대응 기종이 다를 수 있으니, 각 게임을 눌러 정확한 플랫폼과 일정을 확인하세요.
          </p>
        </>
      }
      games={games}
    />
  );
}
