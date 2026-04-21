import { useVehicles } from "@/hooks/useVehicles";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAllAppointments } from "@/hooks/useTimeline";

export default function Dashboard() {
    const { data: vehicles, isLoading, error } = useVehicles();
    const { data: appointments, isLoading: appointmentsLoading, error: appointmentsError } = useAllAppointments();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dashboard</Text>

            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            {appointmentsLoading && <Text style={styles.emptyText}>Loading appointments...</Text>}
            {appointmentsError && <Text style={styles.emptyText}>Failed to load appointments.</Text>}
            {!appointmentsLoading && !appointmentsError && appointments?.length === 0 && (<Text style={styles.emptyText}>No upcoming appointments.</Text>)}

        {!appointmentsLoading && !appointmentsError && appointments?.map((appointment) => (
            <View key={appointment.id} style={styles.card}>
                <Text style={styles.cardTitle}>{appointment.service_type}</Text>
                <Text style={styles.cardText}>{appointment.date}</Text>
                {appointment.time ? <Text style={styles.cardText}>{appointment.time}</Text> : null}
                {appointment.description ? <Text style={styles.cardText}>{appointment.description}</Text> : null}
                {appointment.mechanic_shop ? (<Text style={styles.cardText}>Shop: {appointment.mechanic_shop}</Text>) : null}
            </View>
        ))}

            <Pressable
                style={styles.addButton}
                onPress={() => router.push("/vehicle/add")}
            >
                <Text style={styles.addButtonText}>+ Add Vehicle</Text>
            </Pressable>

            {isLoading && <Text style={styles.emptyText}>Loading vehicles...</Text>}
            {error && <Text style={styles.emptyText}>Failed to load vehicles.</Text>}
            {!isLoading && !error && vehicles?.length === 0 && (
                <Text style={styles.emptyText}>No vehicles yet.</Text>
            )}

            {!isLoading && !error && vehicles?.map((vehicle) => (
            <Pressable
                key={vehicle.id}
                style={styles.card}
                onPress={() => router.push(`/vehicle/${vehicle.id}`)}
            >
            <Text style={styles.cardTitle}>
                {vehicle.year} {vehicle.make} {vehicle.model}
            </Text>
            <Text style={styles.cardText}>
                Mileage: {vehicle.recent_mileage}
            </Text>
        </Pressable>
        ))}
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
        fontSize: 28,
        fontWeight: "600",
        marginBottom: 20,
    },
    addButton: {
        backgroundColor: "#2563eb",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignSelf: "flex-start",
        marginBottom: 20,
    },
    addButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    emptyText: {
        color: "#666",
        fontSize: 16,
        marginTop: 20,
    },
    card: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 14,
        marginTop: 12,
        backgroundColor: "#f9fafb",
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 4,
    },
    cardText: {
        fontSize: 14,
        color: "#444",
    },
    sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 10,
},
});
