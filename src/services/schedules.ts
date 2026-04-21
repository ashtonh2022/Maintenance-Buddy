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

export async function updateRequiredService(id: string, intervalMiles: number): Promise<RequiredServiceRow> {
    const { data, error } = await supabase
        .from("required_services")
        .update({ interval_miles: intervalMiles })
        .eq("id", id)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export type DefaultService = {
    service_name: string;
    interval_miles: number;
};

export const DEFAULT_SCHEDULES: Record<string, DefaultService[]> = {
    petrol: [
        { service_name: "Oil Change", interval_miles: 5000 },
        { service_name: "Tire Rotation", interval_miles: 7500 },
        { service_name: "Air Filter", interval_miles: 15000 },
        { service_name: "Brake Inspection", interval_miles: 20000 },
        { service_name: "Transmission Fluid", interval_miles: 40000 },
        { service_name: "Spark Plugs", interval_miles: 60000 },
        { service_name: "Coolant Flush", interval_miles: 60000 },
    ],
    diesel: [
        { service_name: "Oil Change", interval_miles: 7500 },
        { service_name: "Fuel Filter", interval_miles: 15000 },
        { service_name: "Tire Rotation", interval_miles: 7500 },
        { service_name: "Air Filter", interval_miles: 15000 },
        { service_name: "Brake Inspection", interval_miles: 20000 },
        { service_name: "Transmission Fluid", interval_miles: 45000 },
        { service_name: "Coolant Flush", interval_miles: 60000 },
    ],
    hybrid: [
        { service_name: "Oil Change", interval_miles: 7500 },
        { service_name: "Tire Rotation", interval_miles: 7500 },
        { service_name: "Air Filter", interval_miles: 20000 },
        { service_name: "Brake Inspection", interval_miles: 25000 },
        { service_name: "Transmission Fluid", interval_miles: 60000 },
        { service_name: "Coolant Flush", interval_miles: 60000 },
        { service_name: "Battery Health Check", interval_miles: 30000 },
    ],
    electric: [
        { service_name: "Tire Rotation", interval_miles: 7500 },
        { service_name: "Brake Inspection", interval_miles: 25000 },
        { service_name: "Cabin Air Filter", interval_miles: 15000 },
        { service_name: "Coolant Flush", interval_miles: 50000 },
        { service_name: "Battery Health Check", interval_miles: 30000 },
    ],
};
