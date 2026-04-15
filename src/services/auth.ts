import { supabase } from "@/lib/supabase";

export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw error;
    return data;
}

export async function signUp(email: string, password: string, mileageRate: number) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {data: {mileage_rate: mileageRate,},},
    });
    if (error) throw error;
    return data;
}

export async function saveUserMileage(id: string, yearlyMileageRate: number) {
    const { data, error } = await supabase
        .from('profiles')
        .upsert({id, yearly_mileage_rate: yearlyMileageRate,})
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export async function resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return data;
}