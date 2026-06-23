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
          국내 출시 예정 <strong>모바일 신작</strong> 목록입니다. 곧 <strong>사전예약</strong>이 시작되거나 진행 중인 게임을
          출시 가까운 순으로 정리했어요. 각 게임의 사전예약 보상·정확한 일정은 상세 페이지와 공식 출처에서 확인하세요.
        </>
      }
      games={games}
    />
  );
}
