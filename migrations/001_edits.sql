-- Create edits table to track all image edits
create table if not exists public.edits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  tool text not null,
  input_size_bytes integer,
  output_width integer,
  output_height integer,
  status text not null default 'success'
);

-- Enable row-level security
alter table public.edits enable row level security;

-- Users can view only their own edits
create policy "Users can view own edits"
  on public.edits for select
  using (auth.uid() = user_id);

-- Users can insert their own edits
create policy "Users can insert own edits"
  on public.edits for insert
  with check (auth.uid() = user_id);

-- Create index on user_id and created_at for faster queries
create index if not exists edits_user_id_created_at_idx
  on public.edits(user_id, created_at desc);
