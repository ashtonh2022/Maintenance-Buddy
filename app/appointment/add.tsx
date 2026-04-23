import React, { useState } from "react";
import { Alert, Platform, View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useAddAppointment } from "@/hooks/useTimeline";
import { useLocalSearchParams, router } from "expo-router";
import { formatDate } from "@/lib/validation";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Stack } from "expo-router";

export default function AddAppointment() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const addAppointment = useAddAppointment();

    const [serviceType, setServiceType] = useState("");
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [mechanicShop, setMechanicShop] = useState("");

    const handleAdd = async () => {
        if (!id || !serviceType) {
            Alert.alert("Error", "Please enter a service type");
            return;
        }
        await addAppointment.mutateAsync({
            vehicle_id: id,
            service_type: serviceType,
            date: formatDate(date),
            mechanic_shop: mechanicShop || null,
            is_completed: false,
        });
        router.back();
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: "Add Appointment" }} />
            <Text style={styles.title}>Add Appointment</Text>

            <Text style={styles.label}>Service Type</Text>
            <TextInput style={styles.input} value={serviceType} onChangeText={setServiceType} />

            <Text style={styles.label}>Date</Text>
            <Pressable style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                <Text>{formatDate(date)}</Text>
            </Pressable>
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    onChange={(_, selected) => {
                        setShowDatePicker(Platform.OS === "ios");
                        if (selected) setDate(selected);
                    }}
                />
            )}

            <Text style={styles.label}>Mechanic Shop (Optional)</Text>
            <TextInput style={styles.input} value={mechanicShop} onChangeText={setMechanicShop} />

            <Pressable style={styles.button} onPress={handleAdd}>
                <Text style={styles.buttonText}>Add Appointment</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: "#2323FF",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    dateButton: {
        borderWidth: 1,
        borderColor: "#2323FF",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    button: {
        backgroundColor: "#2323FF",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 8,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
});
