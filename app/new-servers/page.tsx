import type { Metadata } from 'next';
import { getUpcomingGamesByCategory } from '@/lib/games';
import { SeoLanding } from '@/components/SeoLanding';

export const metadata: Metadata = {
  title: '신규 서버 · 대규모 이벤트 일정 | 리니지·메이플 신서버, 게임 이벤트',
  description: '리니지M, 로스트아크, 메이플스토리, 오딘 등 한국 MMORPG 신규 서버 오픈과 대규모 게임 이벤트·업데이트 일정 총정리. 신서버·이벤트 일정을 한눈에.',
  alternates: { canonical: 'https://gcalen.com/new-servers' },
  openGraph: { url: 'https://gcalen.com/new-servers', type: 'website' },
};

export default async function Page() {
  const games = await getUpcomingGamesByCategory('new_server'); // 지난 출시 제외
  return (
    <SeoLanding
      slug="new-servers"
      h1="신규 서버 · 대규모 이벤트 일정"
      intro={
        <>
          <p>
            리니지M, 로스트아크, 메이플스토리, 오딘, 아이온2 등 한국 MMORPG의 <strong>신규 서버</strong> 오픈과
            {' '}<strong>대규모 이벤트·업데이트</strong> 일정을 한곳에 모았습니다. 원신·스타레일 같은 라이브
            게임의 정규 버전 업데이트와 콜라보 이벤트까지 함께 정리해 매일 갱신합니다.
          </p>
          <p>
            신규 서버와 리부트 월드는 <strong>신규·복귀 유저가 가장 유리하게 출발할 수 있는 시점</strong>입니다.
            오픈 첫날 보상과 선점 효과가 크기 때문에, 시작 타이밍을 맞추는 것이 중요하죠. 더 자세한 분석은
            {' '}<a href="/blog">신작 총정리</a>에서, 정확한 오픈 일정은 각 항목을 눌러 확인하세요. 관심 있는 서버는
            즐겨찾기에 담아두면 오픈일을 놓치지 않습니다.
          </p>
        </>
      }
      games={games}
    />
  );
}
