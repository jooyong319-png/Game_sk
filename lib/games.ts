import path from 'path';
import { promises as fs } from 'fs';
import type { Game, GamesData, Category } from './types';

// Server-side에서 data/games.json 직접 로드 (정적 빌드 시 평가됨)
async function readGamesFile(): Promise<GamesData> {
  const filePath = path.join(process.cwd(), 'data', 'games.json');
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw) as GamesData;
}

// 정적 빌드용 캐시 (Node 모듈 캐시에 의존)
let cachedPromise: Promise<GamesData> | null = null;
function getGamesData(): Promise<GamesData> {
  if (!cachedPromise) cachedPromise = readGamesFile();
  return cachedPromise;
}

// 전체 게임 (출시일 오름차순)
export async function getAllGames(): Promise<Game[]> {
  const data = await getGamesData();
  return data.games.slice().sort(
    (a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
  );
}

// ID로 한 게임 조회
export async function getGameById(id: string): Promise<Game | null> {
  const all = await getAllGames();
  return all.find(g => g.id === id) ?? null;
}

// 카테고리별
export async function getGamesByCategory(category: Category): Promise<Game[]> {
  const all = await getAllGames();
  return all.filter(g => g.category === category);
}

// 메타 (카테고리 라벨 등)
export async function getCategoriesMap(): Promise<Record<Category, string>> {
  const data = await getGamesData();
  return data.categories;
}

// 데이터 갱신 시각
export async function getLastUpdated(): Promise<string> {
  const data = await getGamesData();
  return data.last_updated;
}

// D-day 계산
export function calcDayDiff(release_date: string, now: Date = new Date()): number {
  const r = new Date(release_date);
  r.setHours(0, 0, 0, 0);
  const t = new Date(now);
  t.setHours(0, 0, 0, 0);
  return Math.ceil((r.getTime() - t.getTime()) / (1000 * 60 * 60 * 24));
}

// 표시용 날짜 포맷 ('2026년 6월 18일')
export function formatKoreanDate(release_date: string): string {
  const d = new Date(release_date);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

// 짧은 포맷 ('2026.06.18')
export function formatShortDate(release_date: string): string {
  const d = new Date(release_date);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

// 요일 (한글)
export function getKoreanWeekday(release_date: string): string {
  const d = new Date(release_date);
  return ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
}
