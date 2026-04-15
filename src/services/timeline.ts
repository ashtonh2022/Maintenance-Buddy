import { supabase } from "@/lib/supabase";
import { timelineEntryInsert, timelineEntryRow, timelineEntryUpdate } from "@/types/types";

export const addtimelineEntry = async(timelineEntry: timelineEntryInsert): Promise<timelineEntryRow> => {
    const { data, error } = await supabase
        .from("timeline_entries")
        .insert(timelineEntry)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export const gettimelineEntry = async(vehicleId: string): Promise<timelineEntryRow[]> => {
    const { data, error } = await supabase
        .from("timeline_entries")
        .select("*")
        .eq("vehicle_id", vehicleId)
        .order("date",{ascending: false});
    if (error) throw error;
    return data;
}

export const updatetimelineEntry = async(id: string, timelineEntry: timelineEntryUpdate): Promise<timelineEntryRow> => {
    const { data, error } = await supabase
        .from("timeline_entries")
        .update(timelineEntry)
        .eq("id",id)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export const deletetimelineEntry = async(id: string): Promise<void> => {
    const { error } = await supabase
        .from("timeline_entries")
        .delete()
        .eq("id",id);
    if (error) throw error;
}