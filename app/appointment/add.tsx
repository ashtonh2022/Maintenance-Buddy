import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useAddAppointment } from "@/hooks/useTimeline";
import { useLocalSearchParams, router } from "expo-router";

export default function AddAppointment() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const addAppointment = useAddAppointment();

    const [serviceType, setServiceType] = useState("");
    const [date, setDate] = useState("");
    const [mileageAtService, setMileageAtService] = useState("");
    const [mechanicShop, setMechanicShop] = useState("");

    //add
    const handleAdd = async () => {
        if (!id || !serviceType || !date || !mileageAtService) {
            return;
        }
        await addAppointment.mutateAsync({
            vehicle_id: id,
            service_type: serviceType,
            date,
            mileage_at_service: Number(mileageAtService),
            mechanic_shop: mechanicShop || null, //makes adding mechanic shop optional
            is_completed: false,
        });
        router.back();
    };
    
    return (
        <View>
            <Text>Add Service Event</Text>

            <Text>Service Type</Text>
            <TextInput value={serviceType} onChangeText={setServiceType} />

            <Text>Date</Text>
            <TextInput value={date} onChangeText={setDate} />

            <Text>Mileage At Service</Text>
            <TextInput value={mileageAtService} onChangeText={setMileageAtService} keyboardType="numeric"/>

            <Text>Mechanic Shop (Optional)</Text>
            <TextInput value={mechanicShop} onChangeText={setMechanicShop} />

            <Pressable onPress={handleAdd}>
                <Text>Add</Text>
            </Pressable>
        </View>
    );
}