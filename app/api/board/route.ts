// 자유게시판 쓰기/삭제 — 로그인 없이. 남용 방지가 여기 다 모여있음.
//  • IP rate-limit(create_post RPC 내부, 같은 IP 30초 1회)
//  • 링크·금지어 필터 (아래)
//  • 비밀번호/IP 는 서버 pepper 붙여 sha256 해시 → DB엔 해시만 저장
// 목록 조회(GET)는 클라에서 supabase 직접(SELECT 안전 컬럼) → 여기선 처리 안 함.
import { supabase } from '@/lib/supabase';
import { hashPw, hashIp, ipPrefix, getIp, LINK_RE, BANNED, jsonResponse as json } from '@/lib/boardServer';

export const runtime = 'nodejs';

// ── 글 작성 ──────────────────────────────────────────────────────
export async function POST(req: Request) {
  if (!supabase) return json({ error: '게시판 준비 중이에요.' }, 503);

  let body: { title?: string; password?: string; content?: string; image_url?: string; category?: string };
  try { body = await req.json(); } catch { return json({ error: '잘못된 요청' }, 400); }

  const title = String(body.title ?? '').trim();
  const password = String(body.password ?? '');
  const content = String(body.content ?? '').trim();
  const imageUrl = String(body.image_url ?? '').trim();
  const category = String(body.category ?? 'chat');

  // 이미지 URL은 반드시 우리 Supabase post-images 버킷 공개 URL이어야 함(외부 URL 주입 차단)
  const allowedPrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''}/storage/v1/object/public/post-images/`;
  if (imageUrl && !imageUrl.startsWith(allowedPrefix)) {
    return json({ error: '허용되지 않은 이미지예요.' }, 400);
  }

  if (!title || title.length > 60) return json({ error: '제목은 1~60자로 입력해주세요.' }, 400);
  if (!/^\d{4}$/.test(password)) return json({ error: '비밀번호는 숫자 4자리예요.' }, 400);
  if (content.length > 1000) return json({ error: '내용은 1000자 이하로 입력해주세요.' }, 400);
  if (LINK_RE.test(content) || LINK_RE.test(title)) return json({ error: '링크는 등록할 수 없어요.' }, 400);
  if (BANNED.some(w => content.includes(w) || title.includes(w))) return json({ error: '부적절한 표현이 포함돼 있어요.' }, 400);

  const ip = getIp(req);
  const { data, error } = await supabase.rpc('create_post', {
    p_title: title,
    p_content: content,
    p_pw_hash: hashPw(password),
    p_ip_hash: hashIp(ip),
    p_image_url: imageUrl || null,
    p_ip_prefix: ipPrefix(ip) || null,
    p_category: category,
  });

  if (error) {
    if (/rate/i.test(error.message)) return json({ error: '너무 자주 올리고 있어요. 30초 후 다시 시도해주세요.' }, 429);
    return json({ error: '등록에 실패했어요. 잠시 후 다시 시도해주세요.' }, 500);
  }

  const row = Array.isArray(data) ? data[0] : data;
  return json({
    post: {
      id: row.id,
      title: row.title ?? null,
      nickname: row.nickname,
      content: row.content,
      created_at: row.created_at,
      report_count: row.report_count ?? 0,
      image_url: row.image_url ?? null,
      ip_prefix: row.ip_prefix ?? null,
      category: row.category ?? 'chat',
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
