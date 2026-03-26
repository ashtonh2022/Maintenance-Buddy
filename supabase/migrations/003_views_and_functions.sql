-- Profile creation trigger on signup
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  set local row_security = off;
  insert into profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Computed view: estimated mileage based on rate and time elapsed
create view vehicles_with_estimated_mileage as
select *,
       recent_mileage + (mileage_rate * extract(day from now() - mileage_updated_at) / 365)::int
  as estimated_mileage
from vehicles;
