-- ────────────────────────────────────────────────────────────────
-- 자유게시판 (로그인 없는 익명 게시판)  gcalen.com/board
-- Supabase SQL Editor에 그대로 붙여넣고 Run.
-- 보안 모델:
--   • anon 은 posts 를 "안전한 컬럼만" SELECT (pw_hash/ip_hash 숨김)
--   • INSERT/DELETE/신고는 SECURITY DEFINER 함수로만 (RLS 우회, 직접 쓰기 불가)
--   • 비밀번호/IP 는 서버(API 라우트)에서 pepper 붙여 sha256 해시로 저장
-- ────────────────────────────────────────────────────────────────

create table if not exists public.posts (
  id           bigint generated always as identity primary key,
  nickname     text        not null,
  content      text        not null,
  pw_hash      text        not null,   -- sha256(password + pepper) : 본인 삭제용
  ip_hash      text,                   -- sha256(ip + pepper)       : rate-limit용
  report_count int         not null default 0,
  is_hidden    boolean     not null default false,
  created_at   timestamptz not null default now()
);

create index if not exists posts_created_idx on public.posts (created_at desc);
create index if not exists posts_ip_idx      on public.posts (ip_hash, created_at desc);

-- ── RLS ──────────────────────────────────────────────────────────
alter table public.posts enable row level security;

drop policy if exists posts_select_public on public.posts;
create policy posts_select_public on public.posts
  for select using (is_hidden = false);   -- 숨김 글은 목록에서 제외

-- 직접 INSERT/UPDATE/DELETE 정책은 만들지 않음 → anon 직접 쓰기 불가.
-- 모든 쓰기는 아래 SECURITY DEFINER 함수 경유.

-- ── 컬럼 권한: 민감 컬럼(pw_hash/ip_hash)은 SELECT에서 제외 ────────
revoke all on public.posts from anon, authenticated;
grant select (id, nickname, content, report_count, created_at)
  on public.posts to anon, authenticated;

-- ── 글 작성: rate-limit(같은 IP 30초 1회) + 길이 검증 후 삽입 ──────
create or replace function public.create_post(
  p_nickname text, p_content text, p_pw_hash text, p_ip_hash text
) returns public.posts
language plpgsql security definer set search_path = public as $$
declare r public.posts;
begin
  if char_length(btrim(p_nickname)) = 0 or char_length(p_nickname) > 20 then
    raise exception 'invalid nickname';
  end if;
  if char_length(btrim(p_content)) = 0 or char_length(p_content) > 1000 then
    raise exception 'invalid content';
  end if;
  if p_ip_hash is not null and exists (
    select 1 from public.posts
    where ip_hash = p_ip_hash and created_at > now() - interval '30 seconds'
  ) then
    raise exception 'rate limit';
  end if;
  insert into public.posts (nickname, content, pw_hash, ip_hash)
    values (btrim(p_nickname), btrim(p_content), p_pw_hash, p_ip_hash)
    returning * into r;
  return r;
end; $$;

-- ── 글 삭제: 비번 해시 일치 시에만 (일치 삭제 행 수 반환) ───────────
create or replace function public.delete_post(p_id bigint, p_pw_hash text)
returns int
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  delete from public.posts where id = p_id and pw_hash = p_pw_hash;
  get diagnostics n = row_count;
  return n;
end; $$;

-- ── 신고: 카운트 누적, 임계치(8) 넘으면 자동 숨김 → 관리자 검토 ────
create or replace function public.report_post(p_id bigint)
returns void
language plpgsql security definer set search_path = public as $$
begin
  update public.posts
     set report_count = report_count + 1,
         is_hidden    = (report_count + 1 >= 8) or is_hidden
   where id = p_id;
end; $$;

grant execute on function public.create_post(text, text, text, text) to anon, authenticated;
grant execute on function public.delete_post(bigint, text)            to anon, authenticated;
grant execute on function public.report_post(bigint)                  to anon, authenticated;

-- 관리자: 숨김 해제/삭제는 Supabase 대시보드에서 posts 테이블 직접 수정.
--   숨김 글 보기:   select * from posts where is_hidden = true;
--   숨김 해제:      update posts set is_hidden = false, report_count = 0 where id = <id>;
