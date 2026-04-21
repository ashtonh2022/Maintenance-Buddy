import { supabase } from "@/lib/supabase";
import { ProfileRow, ProfileUpdate } from "@/types/types";

export async function getProfile(userId: string): Promise<ProfileRow> {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
    if (error) throw error;
    return data;
}

export async function updateProfile(userId: string, updates: ProfileUpdate): Promise<ProfileRow> {
    const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();
    if (error) throw error;
    return data;
}
