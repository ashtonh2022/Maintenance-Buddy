import { useVehicle } from "@/hooks/useVehicles";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import { useServiceEvents, useAppointments, useDeleteTimelineEntry } from "@/hooks/useTimeline";
import { deleteNotificationByVehicleAndDate } from "@/services/notifications";

export default function VehicleDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: vehicle, isLoading: vehicleLoading } = useVehicle(id!);
    const { data: serviceEvents, isLoading: serviceEventsLoading, error: serviceEventsError } = useServiceEvents(id!);
    const { data: appointments, isLoading: appointmentsLoading, error: appointmentsError } = useAppointments(id!);
    const deleteEntry = useDeleteTimelineEntry(id!);

    if (vehicleLoading) return <ActivityIndicator style={styles.container} />;
    

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.topRow}>
                <Pressable style={styles.backButton} onPress={() => router.push("/(tabs)")}>
                    <Text style={styles.backButtonText}>← Back to Dashboard</Text>
                </Pressable>

            <Pressable style={styles.editButton} onPress={() => router.push(`/vehicle/${id}/edit`)}>
                <Text style={styles.editButtonText}>Edit</Text>
            </Pressable>
        </View>

        <Text style={styles.title}>Vehicle Details</Text>
            <View style={styles.card}>

                <Text style={styles.label}>Make</Text>
                <Text style={styles.value}>{vehicle?.make}</Text>

                <Text style={styles.label}>Model</Text>
                <Text style={styles.value}>{vehicle?.model}</Text>

                <Text style={styles.label}>Year</Text>
                <Text style={styles.value}>{vehicle?.year}</Text>

                <Text style={styles.label}>Mileage</Text>
                <Text style={styles.value}>{vehicle?.recent_mileage}</Text>
            </View>

            <Pressable
                style={styles.addButton}
                onPress={() => router.push(`/requiredServices/${id}`)}
            >
                <Text style={styles.addButtonText}>Required Services</Text>
            </Pressable>

            <Text style={styles.heading}>Service History</Text>

            <Pressable
                style={styles.addButton}
                onPress={() => router.push(`/service/add?id=${id}`)}
            >
                <Text style={styles.addButtonText}>Add Service</Text>
            </Pressable>

            {serviceEventsLoading && <ActivityIndicator />}
            {serviceEventsError && <Text>Error loading service events</Text>}
            {!serviceEventsLoading && !serviceEventsError && serviceEvents?.length === 0 && (<Text>No service events</Text>)}

            {serviceEvents?.map((entry) => (
                <Pressable
                    key={entry.id} style={styles.section}
                    onPress={() => router.push(`/service/${entry.id}`)}
                >
                    <Text>{entry.service_type}</Text>
                    <Text>{entry.date}</Text>
                    {entry.description ? <Text>{entry.description}</Text> : null}
                    {entry.mileage_at_service ? <Text>Mileage: {entry.mileage_at_service}</Text> : null}
                    {entry.mechanic_shop ? <Text>Shop: {entry.mechanic_shop}</Text> : null}

                    <Pressable
                        onPress={async () => {
                            await deleteEntry.mutateAsync(entry.id);
                            await deleteNotificationByVehicleAndDate(entry.vehicle_id, entry.date);
                        }}
                    >
                        <Text style={{ color: "red" }}>Delete</Text>
                    </Pressable>
                </Pressable>
            ))}

            <Text style={styles.heading}>Upcoming Appointments</Text>

            {appointmentsLoading && <ActivityIndicator />}
            {appointmentsError && <Text>Error loading appointments</Text>}
            {!appointmentsLoading && !appointmentsError && appointments?.length === 0 && (
                <Text>No upcoming appointments</Text>
            )}

            {appointments?.map((entry) => (
                <View key={entry.id} style={styles.section}>
                    <Text>{entry.service_type}</Text>
                    <Text>{entry.date}</Text>
                    {entry.time ? <Text>{entry.time}</Text> : null}
                    {entry.description ? <Text>{entry.description}</Text> : null}
                    {entry.mechanic_shop ? <Text>Shop: {entry.mechanic_shop}</Text> : null}

                <Pressable
                    onPress={() => router.push(`/service/add?id=${id}&appointmentId=${entry.id}`)}
                >
                    <Text>Mark Completed</Text>
                </Pressable>

                    <Pressable onPress={() => deleteEntry.mutate(entry.id)}>
                        <Text style={{ color: "red" }}>Delete</Text>
                    </Pressable>
                </View>
            ))}
            <Pressable style={styles.addButton} onPress={() => router.push(`/appointment/add?id=${id}`)}>
                <Text style={styles.addButtonText}>Add Apointment</Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#fff",
        padding: 20,
        paddingBottom: 40,
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    backButton: {
        backgroundColor: "#2323FF",
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
    },
    backButtonText: {
        color: "#fff",
        fontWeight: "600",
    },
    editButton: {
        backgroundColor: "#2323FF",
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
    },
    editButtonText: {
        color: "#fff",
        fontWeight: "600",
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        marginBottom: 20,
    },
    card: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 16,
        backgroundColor: "#f9f9f9",
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginTop: 10,
        color: "#444",
    },
    value: {
        fontSize: 16,
        marginTop: 4,
        color: "#000000",
    },
    heading: {
        fontSize: 20,
        fontWeight: "600",
        marginTop: 20,
        marginBottom: 10,
    },
    section: {
        marginBottom: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        backgroundColor: "#f9f9f9",
    },
    addButton: {
        marginBottom: 16,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: "600",
    },
});