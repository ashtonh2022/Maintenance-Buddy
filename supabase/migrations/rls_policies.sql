
-- RLS Policies
alter table profiles enable row level security;
alter table vehicles enable row level security;
alter table maintenance_schedules enable row level security;
alter table scheduled_services enable row level security;
alter table timeline_entries enable row level security;
alter table attachments enable row level security;
alter table notifications enable row level security;

-- Profiles: users can read/update their own
create policy "Users can read own profile"
  on profiles for select using (id = auth.uid());
create policy "Users can update own profile"
  on profiles for update using (id = auth.uid());

-- Vehicles: users can CRUD their own
create policy "Users can manage own vehicles"
  on vehicles for all using (user_id = auth.uid());

-- Maintenance Schedules: anyone can read approved, creators can manage their own
create policy "Anyone can read approved schedules"
  on maintenance_schedules for select using (status = 'approved');
create policy "Users can manage own schedules"
  on maintenance_schedules for all using (created_by = auth.uid());

-- Scheduled Services: readable if schedule is approved, manageable by schedule creator
create policy "Anyone can read approved schedule services"
  on scheduled_services for select using (schedule_id in (select id from maintenance_schedules where status = 'approved'));
create policy "Schedule creators can manage services"
  on scheduled_services for all using (
    schedule_id in (select id from maintenance_schedules where created_by = auth.uid())
  );

-- Timeline Entries: users can CRUD entries for their own vehicles
create policy "Users can manage own timeline entries"
  on timeline_entries for all using (
    vehicle_id in (select id from vehicles where user_id = auth.uid())
  );

-- Attachments: users can CRUD attachments on their own timeline entries
create policy "Users can manage own attachments"
  on attachments for all using (
    timeline_entry_id in (
      select id from timeline_entries where vehicle_id in (
        select id from vehicles where user_id = auth.uid()
      )
    )
  );

-- Notifications: users can read/manage their own
create policy "Users can manage own notifications"
  on notifications for all using (user_id = auth.uid());