-- ============================================================
-- Gcalen 커뮤니티 게시판 — 전체 스키마 (이 파일 하나만 Run)
-- 신규 설치·기존 위에 재실행 모두 안전(idempotent).
-- 보안: anon은 안전 컬럼만 SELECT, 모든 쓰기는 SECURITY DEFINER 함수로만.
-- 비번/IP는 서버(API)에서 pepper 붙여 sha256 해시로만 저장. 작성자는 '익명'.
-- ============================================================

-- ── posts ────────────────────────────────────────────────
create table if not exists public.posts (
  id           bigint generated always as identity primary key,
  title        text,
  nickname     text        not null default '익명',
  content      text        not null default '',
  category     text        not null default 'chat',
  image_url    text,
  pw_hash      text        not null,
  ip_hash      text,
  ip_prefix    text,
  report_count int         not null default 0,
  is_hidden    boolean     not null default false,
  created_at   timestamptz not null default now()
);
-- 기존 테이블 누락 컬럼 보강
alter table public.posts add column if not exists title text;
alter table public.posts add column if not exists category text not null default 'chat';
alter table public.posts add column if not exists image_url text;
alter table public.posts add column if not exists ip_prefix text;
alter table public.posts alter column nickname set default '익명';
alter table public.posts alter column content set default '';
alter table public.posts drop constraint if exists posts_category_chk;
alter table public.posts add constraint posts_category_chk check (category in ('chat','humor','news','info'));

create index if not exists posts_created_idx  on public.posts (created_at desc);
create index if not exists posts_ip_idx       on public.posts (ip_hash, created_at desc);
create index if not exists posts_category_idx on public.posts (category, created_at desc);

alter table public.posts enable row level security;
drop policy if exists posts_select_public on public.posts;
create policy posts_select_public on public.posts for select using (is_hidden = false);

revoke all on public.posts from anon, authenticated;
grant select (id, title, nickname, content, category, image_url, ip_prefix, report_count, created_at)
  on public.posts to anon, authenticated;

-- ── post_comments ────────────────────────────────────────
create table if not exists public.post_comments (
  id         bigint generated always as identity primary key,
  post_id    bigint      not null references public.posts(id) on delete cascade,
  nickname   text        not null,
  content    text        not null,
  pw_hash    text        not null,
  ip_hash    text,
  ip_prefix  text,
  is_hidden  boolean     not null default false,
  created_at timestamptz not null default now()
);
create index if not exists post_comments_post_idx on public.post_comments (post_id, created_at);
create index if not exists post_comments_ip_idx   on public.post_comments (ip_hash, created_at desc);

alter table public.post_comments enable row level security;
drop policy if exists post_comments_select_public on public.post_comments;
create policy post_comments_select_public on public.post_comments for select using (is_hidden = false);

revoke all on public.post_comments from anon, authenticated;
grant select (id, post_id, nickname, content, ip_prefix, created_at)
  on public.post_comments to anon, authenticated;

-- ── Storage: post-images 버킷(공개, 3MB, 이미지 타입만) ──
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('post-images','post-images',true,3145728,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=true, file_size_limit=3145728,
  allowed_mime_types=array['image/jpeg','image/png','image/webp'];
drop policy if exists "post-images anon upload" on storage.objects;
create policy "post-images anon upload" on storage.objects
  for insert to anon, authenticated with check (bucket_id='post-images');
drop policy if exists "post-images public read" on storage.objects;
create policy "post-images public read" on storage.objects
  for select to anon, authenticated using (bucket_id='post-images');

-- ── 함수 ─────────────────────────────────────────────────
-- 글 작성: 제목 필수, IP 30초 rate-limit. 작성자는 '익명' 고정.
drop function if exists public.create_post(text,text,text,text);
drop function if exists public.create_post(text,text,text,text,text);
drop function if exists public.create_post(text,text,text,text,text,text);
drop function if exists public.create_post(text,text,text,text,text,text,text);
create or replace function public.create_post(
  p_title text, p_content text, p_pw_hash text, p_ip_hash text,
  p_image_url text, p_ip_prefix text, p_category text
) returns public.posts
language plpgsql security definer set search_path = public as $$
declare r public.posts; cat text;
begin
  if char_length(btrim(coalesce(p_title,''))) = 0 or char_length(p_title) > 60 then
    raise exception 'invalid title';
  end if;
  if char_length(coalesce(p_content,'')) > 1000 then
    raise exception 'invalid content';
  end if;
  if p_ip_hash is not null and exists (
    select 1 from public.posts where ip_hash = p_ip_hash and created_at > now() - interval '30 seconds'
  ) then
    raise exception 'rate limit';
  end if;
  cat := case when p_category in ('chat','humor','news','info') then p_category else 'chat' end;
  insert into public.posts (title, nickname, content, category, image_url, pw_hash, ip_hash, ip_prefix)
    values (btrim(p_title), '익명', btrim(coalesce(p_content,'')), cat,
            nullif(p_image_url,''), p_pw_hash, p_ip_hash, nullif(p_ip_prefix,''))
    returning * into r;
  return r;
end; $$;

create or replace function public.delete_post(p_id bigint, p_pw_hash text)
returns int language plpgsql security definer set search_path = public as $$
declare n int; begin
  delete from public.posts where id=p_id and pw_hash=p_pw_hash;
  get diagnostics n = row_count; return n;
end; $$;

create or replace function public.report_post(p_id bigint)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.posts set report_count = report_count + 1,
    is_hidden = (report_count + 1 >= 8) or is_hidden where id = p_id;
end; $$;

create or replace function public.create_comment(
  p_post_id bigint, p_nickname text, p_content text, p_pw_hash text, p_ip_hash text, p_ip_prefix text
) returns public.post_comments
language plpgsql security definer set search_path = public as $$
declare r public.post_comments; begin
  if not exists (select 1 from public.posts where id=p_post_id and is_hidden=false) then raise exception 'no post'; end if;
  if char_length(btrim(p_nickname))=0 or char_length(p_nickname)>20 then raise exception 'invalid nickname'; end if;
  if char_length(btrim(coalesce(p_content,'')))=0 or char_length(p_content)>500 then raise exception 'invalid content'; end if;
  if p_ip_hash is not null and exists (
    select 1 from public.post_comments where ip_hash=p_ip_hash and created_at > now() - interval '10 seconds'
  ) then raise exception 'rate limit'; end if;
  insert into public.post_comments (post_id, nickname, content, pw_hash, ip_hash, ip_prefix)
    values (p_post_id, btrim(p_nickname), btrim(p_content), p_pw_hash, p_ip_hash, nullif(p_ip_prefix,''))
    returning * into r; return r;
end; $$;

create or replace function public.delete_comment(p_id bigint, p_pw_hash text)
returns int language plpgsql security definer set search_path = public as $$
declare n int; begin
  delete from public.post_comments where id=p_id and pw_hash=p_pw_hash;
  get diagnostics n = row_count; return n;
end; $$;

grant execute on function public.create_post(text,text,text,text,text,text,text) to anon, authenticated;
grant execute on function public.delete_post(bigint,text)                        to anon, authenticated;
grant execute on function public.report_post(bigint)                             to anon, authenticated;
grant execute on function public.create_comment(bigint,text,text,text,text,text) to anon, authenticated;
grant execute on function public.delete_comment(bigint,text)                     to anon, authenticated;

-- 관리자: 숨김글 보기  select * from posts where is_hidden=true;
--         숨김 해제    update posts set is_hidden=false, report_count=0 where id=<id>;
