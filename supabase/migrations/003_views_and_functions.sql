-- Enable pg_cron for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;

-----------------------------------------------------------

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

-----------------------------------------------------------

-- Function: check for appointment reminders (tomorrow's appointments)
-- and maintenance due notifications (based on estimated mileage vs required services)
CREATE OR REPLACE FUNCTION public.check_notifications()
RETURNS void AS $$
DECLARE
  v record;
  appt record;
  svc record;
  last_mileage int;
  estimated int;
  miles_since int;
  notif_message text;
  existing_id uuid;
BEGIN
  -- Loop through all vehicles with estimated mileage
  FOR v IN
    SELECT vm.*, p.id as profile_id
    FROM vehicles_with_estimated_mileage vm
    JOIN profiles p ON p.id = vm.user_id
    WHERE p.notifications_enabled = true
  LOOP

    -- 1. Appointment reminders: check for appointments tomorrow
    FOR appt IN
      SELECT * FROM timeline_entries
      WHERE vehicle_id = v.id
        AND is_completed = false
        AND date = current_date + interval '1 day'
    LOOP
      notif_message := appt.service_type || ' appointment is coming up';

      SELECT id INTO existing_id FROM notifications
      WHERE user_id = v.user_id
        AND vehicle_id = v.id
        AND message = notif_message
        AND scheduled_date = appt.date
      LIMIT 1;

      IF existing_id IS NULL THEN
        INSERT INTO notifications (user_id, vehicle_id, message, scheduled_date, type, is_sent, is_read)
        VALUES (v.user_id, v.id, notif_message, appt.date, 'appointment_reminder', true, false);
      END IF;

      existing_id := NULL;
    END LOOP;

    -- 2. Maintenance due: check estimated mileage against required services
    estimated := v.estimated_mileage;

    FOR svc IN
      SELECT * FROM required_services WHERE vehicle_id = v.id AND enabled = true
    LOOP
      -- Find the mileage at the last completed service of this type
      SELECT mileage_at_service INTO last_mileage
      FROM timeline_entries
      WHERE vehicle_id = v.id
        AND service_type = svc.service_name
        AND is_completed = true
      ORDER BY date DESC
      LIMIT 1;

      -- If never serviced, skip if user opted out of first reminder
      IF last_mileage IS NULL THEN
        IF svc.skip_first_reminder THEN
          CONTINUE;
        END IF;
        last_mileage := 0;
      END IF;

      miles_since := estimated - last_mileage;

      -- Notify if within 500 miles of the interval or overdue
      IF miles_since >= (svc.interval_miles - 500) THEN
        notif_message := svc.service_name || ' is due at ' || (last_mileage + svc.interval_miles) || ' miles';

        -- Only create a new notification if none was sent in the last 7 days
        SELECT id INTO existing_id FROM notifications
        WHERE user_id = v.user_id
          AND vehicle_id = v.id
          AND message = notif_message
          AND type = 'maintenance_due'
          AND scheduled_date > current_date - interval '7 days'
        LIMIT 1;

        IF existing_id IS NULL THEN
          INSERT INTO notifications (user_id, vehicle_id, message, scheduled_date, type, is_sent, is_read)
          VALUES (v.user_id, v.id, notif_message, current_date, 'maintenance_due', true, false);
        END IF;

        existing_id := NULL;
      END IF;

      last_mileage := NULL;
    END LOOP;

  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-----------------------------------------------------------

-- Schedule: run check_notifications daily at 8am UTC
-- Requires pg_cron extension (enabled by default on Supabase)
SELECT cron.schedule(
  'daily-notification-check',
  '0 8 * * *',
  'SELECT public.check_notifications()'
);
