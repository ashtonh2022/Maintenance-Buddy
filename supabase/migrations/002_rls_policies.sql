-- RLS Policies
alter table profiles enable row level security;
alter table vehicles enable row level security;
alter table required_services enable row level security;
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

-- Required Services: users can CRUD services for their own vehicles
create policy "Users can manage own required services"
  on required_services for all using (
    vehicle_id in (select id from vehicles where user_id = auth.uid())
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

  -- Allow authenticated users to upload to the attachments bucket
  create
policy "Authenticated users can upload attachments"
    on storage.objects for insert
    to authenticated
    with check (bucket_id = 'attachments');

  -- Allow authenticated users to read their attachments
  create
policy "Authenticated users can read attachments"
    on storage.objects for
select
    to authenticated using (bucket_id = 'attachments');

-- Allow authenticated users to delete their attachments
create
policy "Authenticated users can delete attachments"
    on storage.objects for delete
to authenticated
    using (bucket_id = 'attachments');
