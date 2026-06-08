// server-only: 이 파일은 fs를 쓰므로 서버 컴포넌트에서만 import
import path from 'path';
import { promises as fs } from 'fs';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;             // 'YYYY-MM-DD'
  tags: string[];
  content: string;          // markdown 본문 (frontmatter 제외)
}

// 단순 frontmatter 파서 (gray-matter 없이)
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
    // 배열: [a, b, c]
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    } else {
      val = val.replace(/^["']|["']$/g, '');
    }
    meta[key] = val;
  }
  return { meta, body };
}

async function readAllPosts(): Promise<BlogPost[]> {
  const dir = path.join(process.cwd(), 'content', 'blog');
  try {
    const files = await fs.readdir(dir);
    const posts: BlogPost[] = [];
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      const slug = file.replace(/\.md$/, '');
      const raw = await fs.readFile(path.join(dir, file), 'utf-8');
      const { meta, body } = parseFrontmatter(raw);
      posts.push({
        slug,
        title: String(meta.title ?? slug),
        description: String(meta.description ?? ''),
        date: String(meta.date ?? '1970-01-01'),
        tags: Array.isArray(meta.tags) ? meta.tags : [],
        content: body,
      });
    }
    // 날짜 내림차순 (최신 먼저)
    return posts.sort((a, b) => b.date.localeCompare(a.date));
  } catch (e) {
    // 폴더 없거나 파일 없으면 빈 배열
    return [];
  }
}

let cached: Promise<BlogPost[]> | null = null;
export function getAllPosts(): Promise<BlogPost[]> {
  if (!cached) cached = readAllPosts();
  return cached;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const all = await getAllPosts();
  return all.find(p => p.slug === slug) ?? null;
}

// 간단한 마크다운 → HTML 변환 (외부 라이브러리 없이)
// 기본 문법만 지원: 제목(#), 굵게(**), 이탤릭(*), 링크([](url)), 리스트(-), 단락
export function markdownToHtml(md: string): string {
  let html = md;

  // 코드 블록 (3중 백틱)
  html = html.replace(/```([\s\S]*?)```/g, (_, code) => `<pre><code>${escape(code.trim())}</code></pre>`);

  // 헤더
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // 굵게 + 이탤릭
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // 링크
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // 리스트 (- 로 시작)
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>[\s\S]+?<\/li>)(?!\s*<li>)/g, '<ul>$1</ul>');

  // 단락 (2번 줄바꿈)
  html = html
    .split(/\n\n+/)
    .map(block => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<')) return trimmed; // 이미 태그면 그대로
      return `<p>${trimmed.replace(/\n/g, '<br/>')}</p>`;
    })
    .join('\n');

  return html;
}

function escape(s: string): string {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}

// 표시용 날짜
export function formatPostDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}
