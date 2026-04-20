import { supabase } from "@/lib/supabase";
import { NotificationRow, NotificationInsert, NotificationUpdate } from "@/types/types";

export const getNotifications = async(userId: string) => {
    const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("scheduled_date",{ascending: false});
    if (error) throw error;
    return data;
}

export const getUnreadNotifications = async(userId: string) => {
    const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .eq("is_read", false)
        .order("scheduled_date",{ascending: false});
    if (error) throw error;
    return data;
}

export const getUnreadNotificationCount = async(userId: string) => {
    const { count, error } = await supabase
        .from("notifications")
        .select("*", {count: "exact", head: true})
        .eq("user_id", userId)
        .eq("is_read", false)
        .order("scheduled_date",{ascending: false});
    if (error) throw error;
    return count ?? 0;
}

export const createNotifications = async (notification: NotificationInsert) => {
    const { data, error } = await supabase
        .from("notifications")
        .insert(notification)
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const updateNotifications = async(id: string, notification: NotificationUpdate) => {
    const { data, error } = await supabase
        .from("notifications")
        .update(notification)
        .eq("id",id)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export const markNotificationAsRead = async (id: string) => {
    const { data, error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id)
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const markAllNotificationsAsRead = async (userId: string) => {
    const { data, error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("is_read", false)
        .select();
    if (error) throw error;
    return data;
};

export const checkAppointmentReminders = async (userId: string, vehicleId: string) => {
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    let year = tomorrow.getFullYear();
    let month = tomorrow.getMonth() + 1;
    let day = tomorrow.getDate();

    let monthString = month < 10 ? "0" + month : month.toString();
    let dayString = day < 10 ? "0" + day : day.toString();

    let tomorrowString = year + "-" + monthString + "-" + dayString;

    const { data: appointments, error: appointmentError } = await supabase
        .from("timeline_entries")
        .select("*")
        .eq("vehicle_id", vehicleId)
        .eq("is_completed", false)
        .eq("date", tomorrowString)

    if (appointmentError) throw appointmentError;

    if (!appointments || appointments.length == 0) {
        return [];
    }

    const createdNotifications = [];

    for (let i = 0; i < appointments.length; i++) {
        let appointment = appointments[i];
        let message = appointment.service_type + " appointment is coming up";

        const { data: existingNotification, error: existingError } = await supabase
            .from("notifications")
            .select("id")
            .eq("user_id", userId)
            .eq("vehicle_id", vehicleId)
            .eq("message", message)
            .eq("scheduled_date", appointment.date)
            .maybeSingle();

        if (existingError) throw existingError;

        if (!existingNotification) {
            const { data: newNotification, error: insertError } = await supabase
                .from("notifications")
                .insert({
                    user_id: userId,
                    vehicle_id: vehicleId,
                    message: message,
                    scheduled_date: appointment.date,
                    type: "appointment_reminder",
                    is_sent: true,
                    is_read: false,
                })
                .select()
                .single();

            if (insertError) throw insertError;

            createdNotifications.push(newNotification);
        }
    }
    return createdNotifications;
}

export const deleteNotificationByVehicleAndDate = async (vehicleId: string,date: string) => {
    const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("vehicle_id", vehicleId)
        .eq("scheduled_date", date)
        .eq("type", "appointment_reminder");
    if (error) throw error;
};
