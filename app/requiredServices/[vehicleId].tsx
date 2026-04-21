import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text } from "react-native";
import { useRequiredServices, useUpdateRequiredService } from "@/hooks/useRequiredServices";
import { useServiceEvents } from "@/hooks/useTimeline";
import { useVehicle } from "@/hooks/useVehicles";
import ServiceIntervalEditor from "@/components/ServiceIntervalEditor";

export default function RequiredServicesPage() {
    const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
    const { data: vehicle } = useVehicle(vehicleId!);
    const { data: services, isLoading: servicesLoading } = useRequiredServices(vehicleId!);
    const { data: serviceEvents } = useServiceEvents(vehicleId!);
    const updateService = useUpdateRequiredService(vehicleId!);

    // Find the last mileage for a given service type from completed service events
    const getLastMileage = (serviceName: string): number | null => {
        if (!serviceEvents) return null;
        for (let i = 0; i < serviceEvents.length; i++) {
            if (serviceEvents[i].service_type === serviceName && serviceEvents[i].mileage_at_service) {
                return serviceEvents[i].mileage_at_service;
            }
        }
        return null;
    };

    if (servicesLoading) return <ActivityIndicator style={styles.container} />;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Required Services</Text>
            <Text style={styles.subtitle}>
                Adjust intervals and enable or disable services
            </Text>

            {(!services || services.length === 0) && (
                <Text style={styles.emptyText}>No required services set up for this vehicle.</Text>
            )}

            {services?.map((service) => {
                const lastMileage = getLastMileage(service.service_name);
                const currentMileage = vehicle?.recent_mileage ?? 0;
                const dueAt = (lastMileage !== null ? lastMileage : currentMileage) + service.interval_miles;

                return (
                    <ServiceIntervalEditor
                        key={service.id}
                        serviceName={service.service_name}
                        intervalMiles={service.interval_miles}
                        enabled={service.enabled}
                        showEnabledToggle={true}
                        onIntervalChange={(newInterval) =>
                            updateService.mutate({ id: service.id, updates: { interval_miles: newInterval } })
                        }
                        onEnabledChange={(enabled) =>
                            updateService.mutate({ id: service.id, updates: { enabled } })
                        }
                    >
                        <Text style={styles.dueText}>
                            Due at: {dueAt.toLocaleString()} mi
                            {lastMileage !== null
                                ? ` (last serviced at ${lastMileage.toLocaleString()} mi)`
                                : ` (current mileage: ${currentMileage.toLocaleString()} mi)`}
                        </Text>
                    </ServiceIntervalEditor>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: "#666",
        marginBottom: 20,
    },
    emptyText: {
        color: "#666",
        fontSize: 16,
        marginTop: 20,
    },
    dueText: {
        fontSize: 13,
        color: "#666",
        marginTop: 8,
    },
});
