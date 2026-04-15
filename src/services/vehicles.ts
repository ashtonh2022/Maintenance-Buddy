import { supabase } from "@/lib/supabase";
import { VehicleInsert, VehicleRow, VehicleUpdate } from "@/types/types";

export async function addVehicle(vehicle: VehicleInsert) {
    const { data, error } = await supabase
        .from('vehicles')
        .insert(vehicle)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function getVehicles() {
    const { data, error } = await supabase
        .from('vehicles')
        .select('id, make, model, year, recent_mileage');
    if (error) throw error;
    return data;
}

export async function getVehicle(id: string) {
    const { data, error } = await supabase
        .from('vehicles')
        .select('*, timeline_entries(*)')
        .eq('id', id)
        .single();
    if (error) throw error;
    return data;
}

export async function updateVehicle(vehicle: VehicleUpdate): Promise<VehicleRow> {
    const { id, ...updates } = vehicle;

    const { data, error } = await supabase
        .from("vehicles")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteVehicle(id: string) {
    const { error } = await supabase
        .from("vehicles")
        .delete()
        .eq("id", id);

    if (error) throw error;
}