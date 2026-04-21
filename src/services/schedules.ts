import { supabase } from "@/lib/supabase";
import { RequiredServiceInsert, RequiredServiceRow } from "@/types/types";

export async function getRequiredServices(vehicleId: string): Promise<RequiredServiceRow[]> {
    const { data, error } = await supabase
        .from("required_services")
        .select("*")
        .eq("vehicle_id", vehicleId)
        .order("interval_miles", { ascending: true });
    if (error) throw error;
    return data;
}

export async function addRequiredServices(services: RequiredServiceInsert[]): Promise<RequiredServiceRow[]> {
    const { data, error } = await supabase
        .from("required_services")
        .insert(services)
        .select();
    if (error) throw error;
    return data;
}

export async function deleteRequiredService(id: string): Promise<void> {
    const { error } = await supabase
        .from("required_services")
        .delete()
        .eq("id", id);
    if (error) throw error;
}

export async function updateRequiredService(id: string, updates: { interval_miles?: number; enabled?: boolean }): Promise<RequiredServiceRow> {
    const { data, error } = await supabase
        .from("required_services")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export type DefaultService = {
    service_name: string;
    interval_miles: number;
    skip_first_reminder: boolean;
};

export const DEFAULT_SCHEDULES: Record<string, DefaultService[]> = {
    petrol: [
        { service_name: "Oil Change", interval_miles: 5000, skip_first_reminder: false },
        { service_name: "Tire Rotation", interval_miles: 7500, skip_first_reminder: false },
        { service_name: "Air Filter", interval_miles: 15000, skip_first_reminder: false },
        { service_name: "Brake Inspection", interval_miles: 20000, skip_first_reminder: false },
        { service_name: "Transmission Fluid", interval_miles: 40000, skip_first_reminder: false },
        { service_name: "Spark Plugs", interval_miles: 60000, skip_first_reminder: false },
        { service_name: "Coolant Flush", interval_miles: 60000, skip_first_reminder: false },
    ],
    diesel: [
        { service_name: "Oil Change", interval_miles: 7500, skip_first_reminder: false },
        { service_name: "Fuel Filter", interval_miles: 15000, skip_first_reminder: false },
        { service_name: "Tire Rotation", interval_miles: 7500, skip_first_reminder: false },
        { service_name: "Air Filter", interval_miles: 15000, skip_first_reminder: false },
        { service_name: "Brake Inspection", interval_miles: 20000, skip_first_reminder: false },
        { service_name: "Transmission Fluid", interval_miles: 45000, skip_first_reminder: false },
        { service_name: "Coolant Flush", interval_miles: 60000, skip_first_reminder: false },
    ],
    hybrid: [
        { service_name: "Oil Change", interval_miles: 7500, skip_first_reminder: false },
        { service_name: "Tire Rotation", interval_miles: 7500, skip_first_reminder: false },
        { service_name: "Air Filter", interval_miles: 20000, skip_first_reminder: false },
        { service_name: "Brake Inspection", interval_miles: 25000, skip_first_reminder: false },
        { service_name: "Transmission Fluid", interval_miles: 60000, skip_first_reminder: false },
        { service_name: "Coolant Flush", interval_miles: 60000, skip_first_reminder: false },
        { service_name: "Battery Health Check", interval_miles: 30000, skip_first_reminder: false },
    ],
    electric: [
        { service_name: "Tire Rotation", interval_miles: 7500, skip_first_reminder: false },
        { service_name: "Brake Inspection", interval_miles: 25000, skip_first_reminder: false },
        { service_name: "Cabin Air Filter", interval_miles: 15000, skip_first_reminder: false },
        { service_name: "Coolant Flush", interval_miles: 50000, skip_first_reminder: false },
        { service_name: "Battery Health Check", interval_miles: 30000, skip_first_reminder: false },
    ],
};
