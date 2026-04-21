-- Enums
create type notification_type as enum ('maintenance_due', 'appointment_reminder');
create type fuel_type as enum ('petrol', 'diesel', 'hybrid', 'electric');

-- Profiles extends Supabase auth.users
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'admin')),
  units text not null default 'imperial' check (units in ('imperial', 'metric')),
  notifications_enabled boolean not null default true,
  created_at timestamptz not null default now()
);

-- Vehicles
create table vehicles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  year int not null,
  make text not null,
  model text not null,
  fuel_type fuel_type not null,
  recent_mileage int not null default 0,
  mileage_rate int not null default 0,
  mileage_updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Required Services belong to a vehicle
create table required_services (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  service_name text not null,
  interval_miles int not null,
  skip_first_reminder boolean not null default false,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

-- Service Events (covers both completed services and upcoming appointments)
create table timeline_entries (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  date date not null,
  time time,
  service_type text not null,
  description text,
  mileage_at_service int,
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
create index required_services_vehicle_id on required_services(vehicle_id);

