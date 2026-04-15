-- Trigger: Automatically creates a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
INSERT INTO public.profiles (id)
VALUES (NEW.id);

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
