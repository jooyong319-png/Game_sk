// 메인 페이지에서 /game/[id]로 이동할 때 인터셉트 → 모달로 표시
// 직접 /game/[id] URL 접속 시엔 app/game/[id]/page.tsx (정적 SEO 페이지) 응답

import { getGameById } from '@/lib/games';
import { notFound } from 'next/navigation';
import { GameModal } from '@/components/GameModal';

export default async function InterceptedGamePage({ params }: { params: { id: string } }) {
  const game = await getGameById(params.id);
  if (!game) notFound();
  return <GameModal game={game} />;
}
