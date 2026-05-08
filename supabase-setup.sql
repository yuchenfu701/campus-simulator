-- ============================================================
-- 校园模拟器 Supabase 数据库建表脚本
-- 在 Supabase SQL Editor 中运行此脚本
-- ============================================================

-- 启用 UUID 扩展
create extension if not exists "pgcrypto";

-- ── 用户表 ──────────────────────────────────────────────────
create table if not exists users (
  user_id       text primary key,
  name          text not null default '',
  avatar        text default '',
  virtual_avatar jsonb default '{}',
  points        int  default 0,
  inventory     jsonb default '[]',
  friends       jsonb default '[]',
  last_seen     timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ── 帖子表 ──────────────────────────────────────────────────
create table if not exists posts (
  id            uuid primary key default gen_random_uuid(),
  author_id     text not null,
  author_name   text default '',
  author_avatar text default '',
  content       text not null,
  likes         jsonb default '[]',
  comments      jsonb default '[]',
  created_at    timestamptz default now()
);

-- ── 好友请求表 ──────────────────────────────────────────────
create table if not exists friend_requests (
  id               uuid primary key default gen_random_uuid(),
  from_user_id     text not null,
  to_user_id       text not null,
  from_user_name   text default '',
  from_user_avatar text default '',
  status           text default 'pending',
  created_at       timestamptz default now()
);

-- ── 开放公开读写权限（无需登录即可访问）──────────────────────
alter table users           enable row level security;
alter table posts           enable row level security;
alter table friend_requests enable row level security;

-- users 表：所有人可读，本人可写
create policy "users_read_all"   on users for select using (true);
create policy "users_insert_all" on users for insert with check (true);
create policy "users_update_all" on users for update using (true);

-- posts 表：所有人可读写
create policy "posts_read_all"   on posts for select using (true);
create policy "posts_insert_all" on posts for insert with check (true);
create policy "posts_update_all" on posts for update using (true);
create policy "posts_delete_all" on posts for delete using (true);

-- friend_requests 表：所有人可读写
create policy "fr_read_all"   on friend_requests for select using (true);
create policy "fr_insert_all" on friend_requests for insert with check (true);
create policy "fr_update_all" on friend_requests for update using (true);

-- ── 私信表 ──────────────────────────────────────────────────
create table if not exists messages (
  id               uuid primary key default gen_random_uuid(),
  from_user_id     text not null,
  from_user_name   text default '',
  from_user_avatar text default '',
  to_user_id       text not null,
  content          text not null,
  read             boolean default false,
  created_at       timestamptz default now()
);

alter table messages enable row level security;
create policy "msg_read_all"   on messages for select using (true);
create policy "msg_insert_all" on messages for insert with check (true);
create policy "msg_update_all" on messages for update using (true);

-- ── 开启 Realtime（需在 Supabase 控制台 Database > Replication 中也勾选 messages）──
alter publication supabase_realtime add table messages;
