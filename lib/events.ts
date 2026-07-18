// server-only: fs 사용 → 서버 컴포넌트/route handler에서만 import
import path from 'path';
import { promises as fs } from 'fs';
import type { EventType } from './types';

export { EVENT_TYPE_META } from './types';
export type { EventType } from './types';

export interface GameEvent {
  id: string;
  type: EventType;
  title: string;
  title_en?: string | null;
  title_ja?: string | null;
  start_date: string;        // 'YYYY-MM-DD'
  end_date: string;          // 'YYYY-MM-DD' (단일 일정이면 start와 동일)
  date_approx?: boolean;
  host?: string;             // 게임쇼 장소 / 할인 플랫폼 / 시즌 게임명 등
  description?: string;
  source_url?: string;
  image_url?: string | null;
}

interface EventsData {
  schema_version: number;
  last_updated: string;
  events: GameEvent[];
}

async function readEventsFile(): Promise<EventsData> {
  const filePath = path.join(process.cwd(), 'data', 'events.json');
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw) as EventsData;
}

let cached: Promise<EventsData> | null = null;
function getData(): Promise<EventsData> {
  if (!cached) cached = readEventsFile();
  return cached;
}

function todayKstStr(): string {
  const t = new Date(Date.now() + 9 * 3600 * 1000);
  return t.toISOString().slice(0, 10);
}

// 아직 끝나지 않은 이벤트(진행 중 + 예정), 시작일 오름차순
export async function getUpcomingEvents(): Promise<GameEvent[]> {
  const today = todayKstStr();
  const { events } = await getData();
  return events
    .filter(e => e.end_date >= today)
    .sort((a, b) => a.start_date.localeCompare(b.start_date));
}

export async function getEventsByType(type: EventType): Promise<GameEvent[]> {
  return (await getUpcomingEvents()).filter(e => e.type === type);
}
