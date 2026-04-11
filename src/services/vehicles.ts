import { supabase } from "@/lib/supabase";
import { VehicleRow, VehicleInsert, VehicleUpdate } from "@/types/types";

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

export const updateVehicle = (vehicle: VehicleUpdate) => {}
export const deleteVehicle = () => {}