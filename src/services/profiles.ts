import { supabase } from "@/lib/supabase";
import { ProfileRow, ProfileUpdate } from "@/types/types";

export async function getProfile(userId: string): Promise<ProfileRow | null> {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
    if (error) throw error;
    return data;
}

export async function updateProfile(userId: string, updates: ProfileUpdate): Promise<ProfileRow | null> {
    const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .maybeSingle();
    if (error) throw error;
    return data;
}
