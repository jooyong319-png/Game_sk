// 자유게시판 쓰기/삭제 — 로그인 없이. 남용 방지가 여기 다 모여있음.
//  • IP rate-limit(create_post RPC 내부, 같은 IP 30초 1회)
//  • 링크·금지어 필터 (아래)
//  • 비밀번호/IP 는 서버 pepper 붙여 sha256 해시 → DB엔 해시만 저장
// 목록 조회(GET)는 클라에서 supabase 직접(SELECT 안전 컬럼) → 여기선 처리 안 함.
import { createHash } from 'crypto';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

const PEPPER = process.env.BOARD_SECRET || 'gcalen-board-pepper-v1';
const sha = (s: string) => createHash('sha256').update(s).digest('hex');
const hashPw = (pw: string) => sha(`pw:${pw}:${PEPPER}`);
const hashIp = (ip: string) => sha(`ip:${ip}:${PEPPER}`);

// 익명 게시판이라 외부 링크는 통째로 금지(스팸 도배 차단). 대표 금지어도 컷.
const LINK_RE = /(https?:\/\/|www\.[a-z0-9-]+\.|[a-z0-9-]+\.(?:com|net|org|io|xyz|top|shop|kr|co|biz|info)\b)/i;
const BANNED = ['씨발', '시발', 'ㅅㅂ', '병신', '좆같', '섹스', '카지노', '토토', '바카라', '비아그라', '대출', '먹튀', '홀덤'];

function getIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

function json(body: unknown, status = 200) {
  return Response.json(body, { status });
}

// ── 글 작성 ──────────────────────────────────────────────────────
export async function POST(req: Request) {
  if (!supabase) return json({ error: '게시판 준비 중이에요.' }, 503);

  let body: { nickname?: string; password?: string; content?: string };
  try { body = await req.json(); } catch { return json({ error: '잘못된 요청' }, 400); }

  const nickname = String(body.nickname ?? '').trim();
  const password = String(body.password ?? '');
  const content = String(body.content ?? '').trim();

  if (!nickname || nickname.length > 20) return json({ error: '닉네임은 1~20자로 입력해주세요.' }, 400);
  if (!/^\d{4}$/.test(password)) return json({ error: '비밀번호는 숫자 4자리예요.' }, 400);
  if (!content || content.length > 1000) return json({ error: '내용은 1~1000자로 입력해주세요.' }, 400);
  if (LINK_RE.test(content) || LINK_RE.test(nickname)) return json({ error: '링크는 등록할 수 없어요.' }, 400);
  if (BANNED.some(w => content.includes(w) || nickname.includes(w))) return json({ error: '부적절한 표현이 포함돼 있어요.' }, 400);

  const { data, error } = await supabase.rpc('create_post', {
    p_nickname: nickname,
    p_content: content,
    p_pw_hash: hashPw(password),
    p_ip_hash: hashIp(getIp(req)),
  });

  if (error) {
    if (/rate/i.test(error.message)) return json({ error: '너무 자주 올리고 있어요. 30초 후 다시 시도해주세요.' }, 429);
    return json({ error: '등록에 실패했어요. 잠시 후 다시 시도해주세요.' }, 500);
  }

  const row = Array.isArray(data) ? data[0] : data;
  return json({
    post: {
      id: row.id,
      nickname: row.nickname,
      content: row.content,
      created_at: row.created_at,
      report_count: row.report_count ?? 0,
    },
  });
}

// ── 글 삭제(본인 비밀번호) ────────────────────────────────────────
export async function DELETE(req: Request) {
  if (!supabase) return json({ error: '게시판 준비 중이에요.' }, 503);

  let body: { id?: number; password?: string };
  try { body = await req.json(); } catch { return json({ error: '잘못된 요청' }, 400); }

  const id = Number(body.id);
  const password = String(body.password ?? '');
  if (!id || !/^\d{4}$/.test(password)) return json({ error: '잘못된 요청' }, 400);

  const { data, error } = await supabase.rpc('delete_post', { p_id: id, p_pw_hash: hashPw(password) });
  if (error) return json({ error: '삭제에 실패했어요.' }, 500);
  if (!data || Number(data) === 0) return json({ error: '비밀번호가 일치하지 않아요.' }, 403);
  return json({ ok: true });
}
