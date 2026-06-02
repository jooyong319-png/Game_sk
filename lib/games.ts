// server-only: 이 파일은 fs를 쓰므로 서버 컴포넌트에서만 import 가능
import path from 'path';
import { promises as fs } from 'fs';
import type { Game, GamesData, Category } from './types';

// 서버 전용 데이터 로더 (file I/O)
async function readGamesFile(): Promise<GamesData> {
  const filePath = path.join(process.cwd(), 'data', 'games.json');
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw) as GamesData;
}

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

// 메타
export async function getCategoriesMap(): Promise<Record<Category, string>> {
  const data = await getGamesData();
  return data.categories;
}

// 데이터 갱신 시각
export async function getLastUpdated(): Promise<string> {
  const data = await getGamesData();
  return data.last_updated;
}

// 순수 헬퍼는 lib/utils.ts로 분리됨. 기존 import 호환용 re-export.
export { calcDayDiff, formatKoreanDate, formatShortDate, getKoreanWeekday } from './utils';
