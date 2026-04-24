import { useVehicle } from "@/hooks/useVehicles";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useServiceEvents, useAppointments, useDeleteTimelineEntry } from "@/hooks/useTimeline";
import { deleteNotificationByVehicleAndDate } from "@/services/notifications";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

export default function VehicleDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: vehicle, isLoading: vehicleLoading } = useVehicle(id!);
    const { data: serviceEvents, isLoading: serviceEventsLoading, error: serviceEventsError } = useServiceEvents(id!);
    const { data: appointments, isLoading: appointmentsLoading, error: appointmentsError } = useAppointments(id!);
    const deleteEntry = useDeleteTimelineEntry(id!);
    const tap = async () => {
        await Haptics.selectionAsync();
    };

    if (vehicleLoading) return <ActivityIndicator style={styles.container} />;
    

    return (
        <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.container}>
            <LinearGradient
                colors={["#b4a6ea", "#F8FAFC", "#bd9af1"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.topRow}>
                    <Pressable style={styles.backButton} onPress={() => router.push("/(tabs)")}>
                        <Text style={styles.backButtonText}>← Back to Dashboard</Text>
                    </Pressable>

                    <Pressable style={styles.editButton} onPress={() => router.push(`/vehicle/${id}/edit`)}>
                        <Text style={styles.editButtonText}>Edit</Text>
                    </Pressable>
                </View>

            <LinearGradient
                colors={["#2563EB", "#3B82F6", "#60A5FA"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroCard}
            >
                <Text style={styles.heroLabel}>Vehicle Overview</Text>
                <Text style={styles.heroTitle}>
                    {vehicle?.make} {vehicle?.model}
                </Text>
                <Text style={styles.heroSubtext}>
                    Year {vehicle?.year} • {vehicle?.recent_mileage?.toLocaleString()} miles
                </Text>
            </LinearGradient>

                <View style={styles.quickGrid}>
                    <TouchableOpacity
                        style={styles.quickCard}
                        onPress={async () => {
                            await tap();
                            router.push(`/requiredServices/${id}`);
                        }}
                    >
                        <View style={styles.quickIconWrap}>
                            <Ionicons name="construct-outline" size={20} color="#2563EB" />
                        </View>
                        <Text style={styles.quickTitle}>Required Services</Text>
                        <Text style={styles.quickSubtext}>View service schedule</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.quickCard}
                        onPress={async () => {
                            await tap();
                            router.push(`/service/add?id=${id}`);
                        }}
                    >
                        <View style={styles.quickIconWrap}>
                            <Ionicons name="add-circle-outline" size={20} color="#2563EB" />
                        </View>
                        <Text style={styles.quickTitle}>Add Service</Text>
                        <Text style={styles.quickSubtext}>Log completed work</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.heading}>Service History</Text>

                {serviceEventsLoading && <ActivityIndicator />}
                {serviceEventsError && <Text>Error loading service events</Text>}
                {!serviceEventsLoading && !serviceEventsError && serviceEvents?.length === 0 && (<Text>No service events</Text>)}

                {serviceEvents?.map((entry) => (
                    <Pressable
                        key={entry.id} style={styles.section}
                        onPress={() => router.push(`/service/${entry.id}`)}
                    >
                        <Text style={styles.entryTitle}>{entry.service_type}</Text>
                        <Text style={styles.entryText}>Date: {entry.date}</Text>
                        {entry.description ? <Text style={styles.entryText}>{entry.description}</Text> : null}
                        {entry.mileage_at_service ? <Text style={styles.entryText}>Mileage: {entry.mileage_at_service}</Text> : null}
                        {entry.mechanic_shop ? <Text style={styles.entryText}>Shop: {entry.mechanic_shop}</Text> : null}

                        <Pressable
                            style={styles.dangerButton}
                            onPress={async () => {
                                await deleteEntry.mutateAsync(entry.id);
                                await deleteNotificationByVehicleAndDate(entry.vehicle_id, entry.date);
                            }}
                        >
                            <Text style={styles.dangerButtonText}>Delete Service</Text>
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
                        <Text style={styles.entryTitle}>{entry.service_type}</Text>
                        <Text style={styles.entryText}>Date: {entry.date}</Text>
                        {entry.time ? <Text style={styles.entryText}>Time: {entry.time}</Text> : null}
                        {entry.description ? <Text style={styles.entryText}>{entry.description}</Text> : null}
                        {entry.mechanic_shop ? <Text style={styles.entryText}>Shop: {entry.mechanic_shop}</Text> : null}

                    <Pressable
                        style={styles.completeButton}
                        onPress={() => router.push(`/service/add?id=${id}&appointmentId=${entry.id}`)}
                    >
                        <Text style={styles.completeButtonText}>Mark Completed</Text>
                    </Pressable>

                    <Pressable style={styles.dangerButton} onPress={() => deleteEntry.mutate(entry.id)}>
                        <Text style={styles.dangerButtonText}>Delete Appointment</Text>
                    </Pressable>
                    </View>
                ))}
                <Pressable
                    style={styles.addButton}
                    onPress={() => router.push(`/appointment/add?id=${id}`)}
                >
                    <Text style={styles.addButtonText}>Add Appointment</Text>
                </Pressable>
            </ScrollView>
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
    },

    content: {
        paddingHorizontal: 20,
        paddingTop: 62,
        paddingBottom: 120,
    },

    header: {
        marginBottom: 18,
    },

    eyebrow: {
        fontSize: 12,
        fontWeight: "700",
        color: "#2563EB",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 4,
    },

    headerTitle: {
        fontSize: 30,
        fontWeight: "800",
        color: "#0F172A",
    },

    headerSubtitle: {
        marginTop: 6,
        fontSize: 14,
        color: "#64748B",
    },

    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },

    backButton: {
        backgroundColor: "rgba(255,255,255,0.8)",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 14,
    },

    backButtonText: {
        color: "#1E293B",
        fontWeight: "700",
    },

    editButton: {
        backgroundColor: "#2563EB",
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 14,
    },

    editButtonText: {
        color: "#FFFFFF",
        fontWeight: "800",
    },

    heroCard: {
        borderRadius: 26,
        padding: 22,
        marginBottom: 22,
        backgroundColor: "#2563EB",
        shadowColor: "#2563EB",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.18,
        shadowRadius: 20,
        elevation: 8,
    },

    heroLabel: {
        color: "#DBEAFE",
        fontSize: 12,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 1,
    },

    heroTitle: {
        marginTop: 8,
        color: "#FFFFFF",
        fontSize: 28,
        fontWeight: "800",
    },

    heroSubtext: {
        marginTop: 6,
        color: "#E0E7FF",
        fontSize: 14,
    },

    heading: {
        fontSize: 20,
        fontWeight: "800",
        color: "#0F172A",
        marginTop: 22,
        marginBottom: 12,
    },

    quickGrid: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 22,
    },

    quickCard: {
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.88)",
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 14,
        elevation: 3,
    },

    quickIconWrap: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: "#DBEAFE",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },

    quickTitle: {
        fontSize: 15,
        fontWeight: "800",
        color: "#111827",
    },

    quickSubtext: {
        marginTop: 4,
        fontSize: 12,
        color: "#64748B",
    },

    section: {
        backgroundColor: "rgba(255,255,255,0.92)",
        borderRadius: 18,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },

    entryTitle: {
        fontSize: 16,
        fontWeight: "800",
        color: "#0F172A",
        marginBottom: 4,
    },

    entryText: {
        fontSize: 14,
        color: "#64748B",
        marginTop: 2,
    },

    addButton: {
        backgroundColor: "#2563EB",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 8,
        marginBottom: 14,
    },

    addButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "800",
    },

    completeButton: {
        marginTop: 12,
        backgroundColor: "#DBEAFE",
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: "center",
    },

    completeButtonText: {
        color: "#2563EB",
        fontWeight: "800",
    },

    dangerButton: {
        marginTop: 10,
        backgroundColor: "#FEE2E2",
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: "center",
    },

    dangerButtonText: {
        color: "#B91C1C",
        fontWeight: "800",
    },

    emptyText: {
        color: "#64748B",
        fontSize: 15,
        marginBottom: 10,
    },
});