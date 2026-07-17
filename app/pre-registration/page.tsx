import type { Metadata } from 'next';
import { getPreRegistrationGames } from '@/lib/games';
import { SeoLanding } from '@/components/SeoLanding';

export const metadata: Metadata = {
  title: '게임 사전예약 일정 | 신작 사전예약 총정리',
  description: '지금 사전예약 중이거나 곧 시작되는 게임 총정리. 모바일·PC·콘솔 가리지 않고 신작 사전예약을 받는 게임과 출시일을 한눈에 확인하세요. 매일 업데이트.',
  keywords: [
    '사전예약', '게임 사전예약', '사전예약 일정', '사전예약 게임', '사전예약 중인 게임',
    '신작 사전예약', '사전예약 신작', '신작 게임 사전예약', '사전예약 모음',
    '모바일 게임 사전예약', 'PC 게임 사전예약', '콘솔 게임 사전예약',
  ],
  alternates: { canonical: 'https://gcalen.com/pre-registration' },
  openGraph: { url: 'https://gcalen.com/pre-registration', type: 'website', title: '게임 사전예약 일정' },
};

export default async function Page() {
  // pre_registration=true 우선, 없으면 출시예정 모바일 신작 폴백
  const games = await getPreRegistrationGames();

  return (
    <SeoLanding
      slug="pre-registration"
      h1="게임 사전예약 일정"
      intro={
        <>
          <p>
            지금 <strong>사전예약</strong>이 진행 중이거나 곧 시작되는 게임을 모았습니다. 모바일·PC·콘솔을
            가리지 않고 <strong>신작 사전예약</strong>을 받는 게임을 출시일이 가까운 순으로 정리해 매일 갱신합니다.
          </p>
          <p>
            게임 사전예약은 단순한 알림 신청이 아니라, <strong>참여 인원에 따라 출시 첫날 보상이
            달라지는</strong> 중요한 단계입니다. 각 게임의 사전예약 보상과 정확한 일정은 상세 페이지와 공식
            출처에서 확인하고, 출시일을 놓치지 않도록 즐겨찾기에 담아두세요. 더 자세한 라인업 분석은
            {' '}<a href="/blog">신작 총정리</a>에서 볼 수 있습니다.
          </p>
        </>
      }
      games={games}
    />
  );
}
