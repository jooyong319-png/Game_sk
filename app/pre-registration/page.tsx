import type { Metadata } from 'next';
import { getPreRegistrationGames } from '@/lib/games';
import { SeoLanding } from '@/components/SeoLanding';

export const metadata: Metadata = {
  title: '모바일 게임 사전예약 일정 | 신작 사전예약 모음',
  description: '출시 예정 모바일 신작 사전예약 일정 총정리. 다가오는 모바일 게임 사전예약·출시일을 한눈에 확인하세요. 매일 업데이트.',
  keywords: ['사전예약', '모바일 게임 사전예약', '신작 사전예약', '사전예약 신작', '모바일 신작', '게임 사전예약', '사전예약 일정'],
  alternates: { canonical: 'https://gcalen.com/pre-registration' },
  openGraph: { url: 'https://gcalen.com/pre-registration', type: 'website', title: '모바일 게임 사전예약 일정' },
};

export default async function Page() {
  // pre_registration=true 우선, 없으면 출시예정 모바일 신작 폴백
  const games = await getPreRegistrationGames();

  return (
    <SeoLanding
      slug="pre-registration"
      h1="모바일 신작 사전예약 일정"
      intro={
        <>
          <p>
            국내 출시 예정인 <strong>모바일 신작</strong>을 모았습니다. 곧 <strong>사전예약</strong>이 시작되거나
            진행 중인 게임을 출시일이 가까운 순으로 정리해 매일 갱신합니다. 레퀴엠M, 오딘Q, 로스트아크 모바일,
            아주르 프로밀리아 등 하반기 기대작을 한눈에 확인할 수 있어요.
          </p>
          <p>
            모바일 게임의 사전예약은 단순한 알림 신청이 아니라, <strong>참여 인원에 따라 출시 첫날 보상이
            달라지는</strong> 중요한 단계입니다. 각 게임의 사전예약 보상과 정확한 일정은 상세 페이지와 공식
            출처에서 확인하고, 출시일을 놓치지 않도록 즐겨찾기에 담아두세요. 더 자세한 라인업 분석은
            {' '}<a href="/blog">신작 가이드</a>에서 볼 수 있습니다.
          </p>
        </>
      }
      games={games}
    />
  );
}
