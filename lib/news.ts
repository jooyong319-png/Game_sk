// server-only: fs를 쓰므로 서버 컴포넌트에서만 import
import path from 'path';
import { promises as fs } from 'fs';
import { getAllGames } from './games';
import { firstGameId } from './blog';

// 마크다운/날짜 유틸은 blog에서 재사용 (동일 포맷)
export { markdownToHtml, formatPostDate } from './blog';

export interface NewsItem {
  slug: string;
  title: string;
  description: string;
  date: string;             // 'YYYY-MM-DD'
  tags: string[];
  source: string;           // 출처 매체명 (예: 인벤)
  sourceUrl: string;        // 원문 링크 (저작권 안전판 — 필수)
  content: string;          // markdown 본문 (frontmatter 제외)
  heroGameId: string | null;   // 본문 첫 /game/<id> 링크의 게임 id
  heroImage: string | null;    // 위 게임의 대표 이미지 (없으면 null)
}

// 단순 frontmatter 파서 (gray-matter 없이) — blog.ts와 동일 규칙
function parseFrontmatter(raw: string): { meta: Record<string, string | string[]>; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const fmRaw = match[1];
  const body = match[2];
  const meta: Record<string, string | string[]> = {};
  for (const line of fmRaw.split('\n')) {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (!m) continue;
    const key = m[1];
    let val: string | string[] = m[2].trim();
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    } else {
      val = val.replace(/^["']|["']$/g, '');
    }
    meta[key] = val;
  }
  return { meta, body };
}

async function readAllNews(): Promise<NewsItem[]> {
  const dir = path.join(process.cwd(), 'content', 'news');
  try {
    const files = await fs.readdir(dir);
    const items: NewsItem[] = [];
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      if (file.startsWith('_') || file.startsWith('.')) continue; // 템플릿/숨김 파일 제외
      const slug = file.replace(/\.md$/, '');
      const raw = await fs.readFile(path.join(dir, file), 'utf-8');
      const { meta, body } = parseFrontmatter(raw);
      items.push({
        slug,
        title: String(meta.title ?? slug),
        description: String(meta.description ?? ''),
        date: String(meta.date ?? '1970-01-01'),
        tags: Array.isArray(meta.tags) ? meta.tags : [],
        source: String(meta.source ?? ''),
        sourceUrl: String(meta.source_url ?? ''),
        content: body,
        heroGameId: null,
        heroImage: null,
      });
    }

    // 본문 첫 게임 링크 → 대표 이미지 자동 매핑 (게임 데이터 조인)
    try {
      const games = await getAllGames();
      const imgById = new Map(games.map(g => [g.id, g.image_url]));
      for (const it of items) {
        const gid = firstGameId(it.content);
        it.heroGameId = gid;
        it.heroImage = gid ? (imgById.get(gid) ?? null) : null;
      }
    } catch {
      // 게임 데이터 로드 실패 시 이미지 없이 진행 (뉴스는 정상 노출)
    }

    // 날짜 내림차순 (최신 먼저)
    return items.sort((a, b) => b.date.localeCompare(a.date));
  } catch {
    // 폴더 없거나 파일 없으면 빈 배열
    return [];
  }
}

let cached: Promise<NewsItem[]> | null = null;
export function getAllNews(): Promise<NewsItem[]> {
  if (!cached) cached = readAllNews();
  return cached;
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const all = await getAllNews();
  return all.find(n => n.slug === slug) ?? null;
}

// 관련 뉴스: 태그 겹침 desc → 최신 desc. 자기 자신 제외.
export async function getRelatedNews(slug: string, limit = 4): Promise<NewsItem[]> {
  const all = await getAllNews();
  const current = all.find(n => n.slug === slug);
  if (!current) return [];
  const tagSet = new Set(current.tags);
  const scored = all
    .filter(n => n.slug !== slug)
    .map(n => ({ n, overlap: n.tags.filter(t => tagSet.has(t)).length }))
    .sort((a, b) => b.overlap - a.overlap || b.n.date.localeCompare(a.n.date));
  return scored.slice(0, limit).map(s => s.n);
}
