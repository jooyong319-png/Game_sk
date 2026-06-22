import type { Metadata } from 'next';
import { getAllGames } from '@/lib/games';
import { AdminDashboard } from '@/components/AdminDashboard';

export const metadata: Metadata = {
  title: '관리자',
  robots: { index: false, follow: false }, // 검색 노출 금지
};

export default async function AdminPage() {
  const games = await getAllGames();
  const nameMap: Record<string, string> = {};
  for (const g of games) nameMap[g.id] = g.name_ko;
  return <AdminDashboard nameMap={nameMap} />;
}
