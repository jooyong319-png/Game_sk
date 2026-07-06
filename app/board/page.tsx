import type { Metadata } from 'next';
import { PageShell } from '@/components/PageShell';
import { Board } from '@/components/Board';

export const metadata: Metadata = {
  title: '커뮤니티 | 게이머 소통 공간',
  description: '로그인 없이 자유롭게 글을 남기는 게이머 커뮤니티. 잡담·유머·뉴스·정보까지, 게임 이야기를 편하게 나눠보세요.',
  keywords: ['게임 커뮤니티', '게이머 커뮤니티', '게임 잡담', '게임 유머', '게임 뉴스', '게임 정보'],
  alternates: { canonical: 'https://gcalen.com/board' },
  openGraph: { url: 'https://gcalen.com/board', type: 'website', title: '커뮤니티 | Gcalen' },
};

export default function BoardPage() {
  return (
    <PageShell>
      <section className="board-page">
        <h1>커뮤니티</h1>
        <p className="board-intro">
          로그인 없이 자유롭게 글을 남길 수 있어요. <strong>잡담·유머·뉴스·정보/질문</strong> 카테고리로 게임 이야기를 나눠보세요.
          제목과 <strong>비밀번호(숫자 4자리)</strong>만 정하면 내가 쓴 글은 언제든 지울 수 있어요.
          광고·욕설·링크 도배는 자동으로 걸러지고, 신고가 쌓이면 자동 숨김 처리됩니다.
        </p>
        <Board />
      </section>
    </PageShell>
  );
}
