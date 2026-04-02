-- Trigger: Automatically fills user defaults in the DB upon insert into auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
new_pantry_id UUID;
BEGIN

INSERT INTO public.users (user_id, first_name, last_name, email)
VALUES (NEW.id, '', '', NEW.email;

INSERT INTO public.user_preferences (user_id, measurement_units)
VALUES (NEW.id, imperial);

RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-----------------------------------------------------------

-- Computed view: estimated mileage based on rate and time elapsed
create view vehicles_with_estimated_mileage as
select *,
       recent_mileage + (mileage_rate * extract(day from now() - mileage_updated_at) / 365)::int
  as estimated_mileage
from vehicles;
