-- ────────────────────────────────────────────────────────────────
-- 자유게시판 이미지 첨부 확장 (board.sql 실행 후 추가로 Run)
--   • posts.image_url 컬럼 추가
--   • post-images 공개 버킷 + 익명 업로드 정책(3MB·이미지타입 제한)
--   • create_post 를 image_url 받도록 갱신 (내용 or 이미지 중 하나만 있어도 OK)
-- ────────────────────────────────────────────────────────────────

-- 1) 컬럼 추가 + anon 이 읽을 수 있게 컬럼 권한
alter table public.posts add column if not exists image_url text;
alter table public.posts add column if not exists ip_prefix text;  -- 마스킹된 IP 앞 2자리(예: 121.130)
grant select (image_url, ip_prefix) on public.posts to anon, authenticated;

-- 2) 스토리지 버킷 (공개, 3MB, 이미지 타입만)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('post-images', 'post-images', true, 3145728,
        array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
  set public = true,
      file_size_limit = 3145728,
      allowed_mime_types = array['image/jpeg','image/png','image/webp'];

-- 익명 업로드 허용 + 공개 읽기 (post-images 버킷 한정)
drop policy if exists "post-images anon upload" on storage.objects;
create policy "post-images anon upload" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'post-images');

drop policy if exists "post-images public read" on storage.objects;
create policy "post-images public read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'post-images');

-- 3) create_post 갱신 — image_url·ip_prefix 추가, 내용/이미지 중 하나만 있어도 통과
drop function if exists public.create_post(text, text, text, text);
drop function if exists public.create_post(text, text, text, text, text);
create or replace function public.create_post(
  p_nickname text, p_content text, p_pw_hash text, p_ip_hash text, p_image_url text, p_ip_prefix text
) returns public.posts
language plpgsql security definer set search_path = public as $$
declare r public.posts;
begin
  if char_length(btrim(p_nickname)) = 0 or char_length(p_nickname) > 20 then
    raise exception 'invalid nickname';
  end if;
  -- 내용과 이미지 둘 다 없으면 거부
  if char_length(btrim(coalesce(p_content, ''))) = 0 and coalesce(p_image_url, '') = '' then
    raise exception 'empty post';
  end if;
  if char_length(coalesce(p_content, '')) > 1000 then
    raise exception 'invalid content';
  end if;
  if p_ip_hash is not null and exists (
    select 1 from public.posts
    where ip_hash = p_ip_hash and created_at > now() - interval '30 seconds'
  ) then
    raise exception 'rate limit';
  end if;
  insert into public.posts (nickname, content, pw_hash, ip_hash, image_url, ip_prefix)
    values (btrim(p_nickname), btrim(coalesce(p_content, '')), p_pw_hash, p_ip_hash,
            nullif(p_image_url, ''), nullif(p_ip_prefix, ''))
    returning * into r;
  return r;
end; $$;

grant execute on function public.create_post(text, text, text, text, text, text) to anon, authenticated;
