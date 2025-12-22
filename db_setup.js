const { Client } = require('pg');
// require('dotenv').config({ path: '.env' });

// const connectionString = 'postgresql://postgres.hboerklcnkmdehpodemx:Blackcoat_password897@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres';

// const connectionString = 'postgresql://postgres.hboerklcnkmdehpodemx:Blackcoat_password897@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres';
// 

const connectionString =
  "postgresql://postgres.hboerklcnkmdehpodemx:Blackcoat_password897@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres";


const client = new Client({
  connectionString,
  // connectionTimeoutMillis: 10000, // 10 second timeout
  ssl: {
    rejectUnauthorized: false,
  },
});

const schema = `
-- Enable uuid-ossp if not enabled
create extension if not exists "uuid-ossp";

-- Profiles
create table if not exists profiles (
  id uuid references auth.users not null primary key,
  first_name text,
  last_name text,
  avatar_url text,
  email text
);

-- Organizations
create table if not exists organizations (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  created_at timestamptz default now()
);

-- Org Members
create table if not exists organization_members (
  organization_id uuid references organizations not null,
  user_id uuid references profiles not null,
  role text default 'member',
  primary key (organization_id, user_id)
);

-- Projects
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  organization_id uuid references organizations not null,
  name text not null,
  key text not null,
  description text,
  status text default 'Active',
  start_date date,
  target_date date,
  lead_id uuid references profiles,
  created_at timestamptz default now()
);

-- Task Statuses
create table if not exists task_statuses (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects not null,
  name text not null,
  color text,
  position int,
  is_default boolean default false,
  created_at timestamptz default now()
);

-- Tasks
create table if not exists tasks (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects not null,
  parent_id uuid references tasks,
  title text not null,
  description text,
  status_id uuid references task_statuses,
  priority text default 'Medium',
  type text default 'Task',
  story_points int,
  assignee_id uuid references profiles,
  reporter_id uuid references profiles,
  due_date timestamptz,
  tags text[],
  backlog_order float,
  created_at timestamptz default now()
);

-- Comments
create table if not exists comments (
  id uuid default gen_random_uuid() primary key,
  task_id uuid references tasks not null,
  user_id uuid references profiles not null,
  content text not null,
  created_at timestamptz default now()
);

-- Startup OS: Metrics
create table if not exists metrics (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects not null,
  name text not null,
  unit text,
  target_value float,
  direction text default 'Higher',
  frequency text default 'Daily',
  created_at timestamptz default now()
);

create table if not exists metric_entries (
  id uuid default gen_random_uuid() primary key,
  metric_id uuid references metrics not null,
  value float not null,
  notes text,
  date date default CURRENT_DATE,
  user_id uuid references profiles,
  created_at timestamptz default now()
);

-- Startup OS: Recurring Tasks
create table if not exists recurring_tasks (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects not null,
  cron_schedule text not null,
  prompt_text text not null,
  created_at timestamptz default now()
);

-- Dashboard
create table if not exists dashboard_layouts (
  user_id uuid references profiles primary key,
  layout jsonb
);

-- Suggestions
create table if not exists suggestions (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects not null,
  content text not null,
  referrer_id uuid references profiles,
  upvotes int default 0,
  status text default 'Open',
  created_at timestamptz default now()
);
`;

async function run() {
  try {
    await client.connect();
    console.log('Connected to database');
    // await client.query('BEGIN');
    // await client.query(schema);
    // await client.query('COMMIT');
    console.log('Schema applied successfully');
  } catch (e) {
    console.error('Error applying schema:', e);
    console.log(e)
  } finally {
    await client.end();
  }
}

run();
