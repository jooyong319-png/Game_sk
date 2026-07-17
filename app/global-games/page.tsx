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
      intro={
        <>
          <p>
            전 세계가 주목하는 <strong>글로벌 대작·AAA 신작</strong> 출시 일정을 모았습니다. PS5, Xbox Series,
            닌텐도 스위치2, 스팀(PC)으로 출시되는 해외 대형 신작과 인기 시리즈 후속작을 출시일 순으로 정리해
            매일 갱신합니다. 헤일로, 그랑블루 판타지 리링크, 스플래툰 등 굵직한 라인업을 한눈에 볼 수 있어요.
          </p>
          <p>
            해외 대작은 국가별 출시일이 다르거나 한국어 지원 여부가 갈리는 경우가 있으니, 각 게임을 눌러 대응
            기종과 정확한 일정을 확인하는 것이 좋습니다. 시즌별 기대작 분석은
            {' '}<a href="/blog">신작 총정리</a>에서, 닌텐도 스위치2 라인업은 별도 정리 글에서 다루고 있습니다.
          </p>
        </>
      }
      games={games}
    />
  );
}
