import { supabase } from "@/lib/supabase";
import { timelineEntryInsert, timelineEntryRow, timelineEntryUpdate } from "@/types/types";

export const addTimelineEntry = async(timelineEntry: timelineEntryInsert): Promise<timelineEntryRow> => {
    const { data, error } = await supabase
        .from("timeline_entries")
        .insert(timelineEntry)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export const getServiceEvents = async(vehicleId: string): Promise<timelineEntryRow[]> => {
    const { data, error } = await supabase
        .from("timeline_entries")
        .select("*")
        .eq("vehicle_id", vehicleId)
        .eq("is_completed", true)
        .order("date",{ascending: false});
    if (error) throw error;
    return data;
}

export const getAppointments = async (vehicleId: string): Promise<timelineEntryRow[]> => {
    const { data, error } = await supabase
        .from("timeline_entries")
        .select("*")
        .eq("vehicle_id", vehicleId)
        .eq("is_completed", false)
        .order("date", { ascending: true });
    if (error) throw error;
    return data;
};

export const getTimelineEntryById = async(id: string): Promise<timelineEntryRow> => {
    const { data, error } = await supabase
        .from("timeline_entries")
        .select("*")
        .eq("id", id)
        .single();
    if (error) throw error;
    return data;
}

export const updateTimelineEntry = async(id: string, timelineEntry: timelineEntryUpdate): Promise<timelineEntryRow> => {
    const { data, error } = await supabase
        .from("timeline_entries")
        .update(timelineEntry)
        .eq("id",id)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export const deleteTimelineEntry = async(id: string): Promise<void> => {
    const { error } = await supabase
        .from("timeline_entries")
        .delete()
        .eq("id",id);
    if (error) throw error;
}

export const getAllAppointments = async (): Promise<timelineEntryRow[]> => {
    const { data, error } = await supabase
        .from("timeline_entries")
        .select("*, vehicles(make, model, year)")
        .eq("is_completed", false)
        .order("date", { ascending: true });
    if (error) throw error;
    return data;
};
