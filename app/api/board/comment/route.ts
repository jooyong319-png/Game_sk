// 자유게시판 댓글 쓰기/삭제 — 게시글 API와 동일한 남용 방지(rate-limit·필터·해시).
import { supabase } from '@/lib/supabase';
import { hashPw, hashIp, ipPrefix, getIp, LINK_RE, BANNED, jsonResponse as json } from '@/lib/boardServer';

export const runtime = 'nodejs';

// ── 댓글 작성 ────────────────────────────────────────────────────
export async function POST(req: Request) {
  if (!supabase) return json({ error: '게시판 준비 중이에요.' }, 503);

  let body: { post_id?: number; nickname?: string; password?: string; content?: string };
  try { body = await req.json(); } catch { return json({ error: '잘못된 요청' }, 400); }

  const postId = Number(body.post_id);
  const nickname = String(body.nickname ?? '').trim();
  const password = String(body.password ?? '');
  const content = String(body.content ?? '').trim();

  if (!postId) return json({ error: '잘못된 요청' }, 400);
  if (!nickname || nickname.length > 20) return json({ error: '닉네임은 1~20자로 입력해주세요.' }, 400);
  if (!/^\d{4}$/.test(password)) return json({ error: '비밀번호는 숫자 4자리예요.' }, 400);
  if (!content || content.length > 500) return json({ error: '댓글은 1~500자로 입력해주세요.' }, 400);
  if (LINK_RE.test(content) || LINK_RE.test(nickname)) return json({ error: '링크는 등록할 수 없어요.' }, 400);
  if (BANNED.some(w => content.includes(w) || nickname.includes(w))) return json({ error: '부적절한 표현이 포함돼 있어요.' }, 400);

  const ip = getIp(req);
  const { data, error } = await supabase.rpc('create_comment', {
    p_post_id: postId,
    p_nickname: nickname,
    p_content: content,
    p_pw_hash: hashPw(password),
    p_ip_hash: hashIp(ip),
    p_ip_prefix: ipPrefix(ip) || null,
  });

  if (error) {
    if (/rate/i.test(error.message)) return json({ error: '너무 빨라요. 잠시 후 다시 시도해주세요.' }, 429);
    if (/no post/i.test(error.message)) return json({ error: '없는 글이에요.' }, 404);
    return json({ error: '등록에 실패했어요.' }, 500);
  }

  const row = Array.isArray(data) ? data[0] : data;
  return json({
    comment: {
      id: row.id,
      post_id: row.post_id,
      nickname: row.nickname,
      content: row.content,
      created_at: row.created_at,
      ip_prefix: row.ip_prefix ?? null,
    },
  });
}

// ── 댓글 삭제(본인 비밀번호) ──────────────────────────────────────
export async function DELETE(req: Request) {
  if (!supabase) return json({ error: '게시판 준비 중이에요.' }, 503);

  let body: { id?: number; password?: string };
  try { body = await req.json(); } catch { return json({ error: '잘못된 요청' }, 400); }

  const id = Number(body.id);
  const password = String(body.password ?? '');
  if (!id || !/^\d{4}$/.test(password)) return json({ error: '잘못된 요청' }, 400);

  const { data, error } = await supabase.rpc('delete_comment', { p_id: id, p_pw_hash: hashPw(password) });
  if (error) return json({ error: '삭제에 실패했어요.' }, 500);
  if (!data || Number(data) === 0) return json({ error: '비밀번호가 일치하지 않아요.' }, 403);
  return json({ ok: true });
}
