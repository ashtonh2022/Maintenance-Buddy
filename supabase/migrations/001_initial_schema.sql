-- Enums
create type notification_type as enum ('maintenance_due', 'appointment_reminder');
create type schedule_status as enum ('draft', 'pending', 'approved');

-- Profiles extends Supabase auth.users
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'admin')),
  yearly_mileage_rate integer,
  created_at timestamptz not null default now()
);

-- Vehicles
create table vehicles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  year int not null,
  make text not null,
  model text not null,
  recent_mileage int not null default 0,
  mileage_rate int not null default 0,
  mileage_updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Maintenance Schedules
create table maintenance_schedules (
  id uuid primary key default gen_random_uuid(),
  make text not null,
  model text not null,
  year int not null,
  status schedule_status not null default 'draft',
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now()
);

-- Only one approved schedule per make/model/year
create unique index one_approved_schedule
  on maintenance_schedules (make, model, year)
  where status = 'approved';

-- Scheduled Services belong to a schedule
create table scheduled_services (
  id uuid primary key default gen_random_uuid(),
  schedule_id uuid not null references maintenance_schedules(id) on delete cascade,
  service_name text not null,
  interval_miles int,
  interval_months int,
  description text,
  constraint has_interval check (interval_miles is not null or interval_months is not null)
);

-- Service Events (covers both completed services and upcoming appointments)
create table timeline_entries (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  date date not null,
  time time,
  service_type text not null,
  description text,
  mileageAtService int,
  mechanic_shop text,
  tags text[] default '{}',
  is_completed boolean not null default false,
  created_at timestamptz not null default now()
);

-- Attachments (photos + documents)
-- Constraints enforced at application level:
--   Photos: max 3 per event, PNG/JPEG only, 5MB max
--   Documents: max 1 PDF per event, PDF/TXT only, 10MB max
create table attachments (
  id uuid primary key default gen_random_uuid(),
  timeline_entry_id uuid not null references timeline_entries(id) on delete cascade,
  file_path text not null,
  file_size int not null,
  file_type text not null,
  uploaded_at timestamptz not null default now()
);

-- Notifications
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  message text not null,
  scheduled_date date not null,
  is_sent boolean not null default false,
  is_read boolean not null default false,
  type notification_type not null,
  created_at timestamptz not null default now()
);

-- Indexes
create index vehicles_user_id on vehicles(user_id);
create index timeline_entries_vehicle_id on timeline_entries(vehicle_id);
create index attachments_timeline_entry_id on attachments(timeline_entry_id);
create index notifications_user_id on notifications(user_id);
create index notifications_vehicle_id on notifications(vehicle_id);
create index maintenance_schedules_lookup on maintenance_schedules(make, model, year);

