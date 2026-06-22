-- 웹 푸시 알림용 테이블 (Supabase SQL Editor에서 1회 실행)
-- 1) 구독 정보 + 찜한 게임 id 목록
create table if not exists public.push_subscriptions (
  endpoint   text primary key,
  p256dh     text not null,
  auth       text not null,
  game_ids   text[] not null default '{}',
  updated_at timestamptz not null default now()
);
-- game_ids 배열 겹침(overlaps) 조회 가속
create index if not exists push_subscriptions_game_ids_idx
  on public.push_subscriptions using gin (game_ids);

-- 2) 중복 발송 방지 로그 (endpoint+game_id+kind 1회만)
create table if not exists public.push_sent_log (
  endpoint  text not null,
  game_id   text not null,
  kind      text not null,            -- 'd1' | 'dday'
  sent_at   timestamptz not null default now(),
  primary key (endpoint, game_id, kind)
);

-- 3) RLS: 클라이언트(anon)는 자기 구독을 upsert/삭제만, 조회는 불가.
--    cron은 service_role 키로 RLS 우회.
alter table public.push_subscriptions enable row level security;
alter table public.push_sent_log     enable row level security;

-- 역할 모호성 제거: to public (anon 포함 모든 클라 역할). upsert 위해 insert+update 필요.
drop policy if exists "anon insert sub"  on public.push_subscriptions;
drop policy if exists "anon update sub"  on public.push_subscriptions;
drop policy if exists "anon delete sub"  on public.push_subscriptions;
drop policy if exists "pub insert sub"   on public.push_subscriptions;
drop policy if exists "pub update sub"   on public.push_subscriptions;
drop policy if exists "pub delete sub"   on public.push_subscriptions;

create policy "pub insert sub" on public.push_subscriptions
  for insert to public with check (true);
create policy "pub update sub" on public.push_subscriptions
  for update to public using (true) with check (true);
create policy "pub delete sub" on public.push_subscriptions
  for delete to public using (true);
-- push_sent_log 에는 클라 정책 없음 → service_role 만 접근(=cron 전용)
