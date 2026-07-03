import type { Metadata } from 'next';
import { PageShell } from '@/components/PageShell';
import { Board } from '@/components/Board';

export const metadata: Metadata = {
  title: '자유게시판 | 게이머 자유 소통 공간',
  description: '로그인 없이 자유롭게 글을 남기는 게이머 커뮤니티. 신작 출시·사전예약·게임 이야기까지, 하고 싶은 말을 편하게 남겨보세요.',
  keywords: ['게임 자유게시판', '게이머 커뮤니티', '익명 게시판', '게임 이야기', '신작 잡담'],
  alternates: { canonical: 'https://gcalen.com/board' },
  openGraph: { url: 'https://gcalen.com/board', type: 'website', title: '자유게시판 | Gcalen' },
};

export default function BoardPage() {
  return (
    <PageShell>
      <section className="board-page">
        <h1>자유게시판</h1>
        <p className="board-intro">
          로그인 없이 자유롭게 글을 남길 수 있어요. 신작·사전예약·게임 이야기 뭐든 환영합니다.
          닉네임과 <strong>비밀번호(숫자 4자리)</strong>만 정하면 내가 쓴 글은 언제든 지울 수 있어요.
          광고·욕설·링크 도배는 자동으로 걸러지고, 신고가 쌓이면 자동 숨김 처리됩니다.
        </p>
        <Board />
      </section>
    </PageShell>
  );
}
