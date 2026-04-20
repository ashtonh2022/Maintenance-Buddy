import React from "react";
import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { useExportTxtAllVehicles, useExportPdfAllVehicles, useExportDocxAllVehicles, useExportSummaryTxtVehicle, useExportSummaryPdfVehicle, useExportSummaryDocxVehicle, useExportVehicleFullZip } from "@/hooks/useReports";
import { useAuth } from "@/contexts/AuthContext";
import { useVehicles } from "@/hooks/useVehicles";

export default function Reports() {
    const { session } = useAuth();
    let userId = "";
    if (session && session.user) {
        userId = session.user.id;
    }
    const { data: vehicles, isLoading, error } = useVehicles();

    const exportTxtAll = useExportTxtAllVehicles();
    const exportPdfAll = useExportPdfAllVehicles();
    const exportDocxAll = useExportDocxAllVehicles();

    const exportTxtVehicle = useExportSummaryTxtVehicle();
    const exportPdfVehicle = useExportSummaryPdfVehicle();
    const exportDocxVehicle = useExportSummaryDocxVehicle();

    const exportZipVehicle = useExportVehicleFullZip();

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Reports</Text>

            <View style={styles.box}>
                <Text style={styles.boxTitle}>Summary Reports</Text>

                <View style={styles.vehicleRow}>
                    <Text style={styles.vehicleText}>All Vehicles</Text>
                    <View style={styles.buttonRow}>
                        <Pressable style={styles.formatButton} onPress={() => exportTxtAll.mutate(userId)}>
                            <Text style={styles.buttonText}>TXT</Text>
                        </Pressable>

                        <Pressable style={styles.formatButton} onPress={() => exportPdfAll.mutate(userId)}>
                            <Text style={styles.buttonText}>PDF</Text>
                        </Pressable>

                        <Pressable style={styles.formatButton} onPress={() => exportDocxAll.mutate(userId)}>
                            <Text style={styles.buttonText}>DOCX</Text>
                        </Pressable>
                    </View>
                </View>

                {isLoading && <Text style={styles.message}>Loading vehicles...</Text>}
                {error && <Text style={styles.message}>Failed to load vehicles.</Text>}

                {!isLoading && !error && vehicles?.map((vehicle) => (
                    <View key={vehicle.id} style={styles.vehicleRow}>
                        <Text style={styles.vehicleText}>
                            {vehicle.year} {vehicle.make} {vehicle.model}
                        </Text>
                        <View style={styles.buttonRow}>
                            <Pressable style={styles.formatButton} onPress={() => exportTxtVehicle.mutate(vehicle.id)}>
                                <Text style={styles.buttonText}>TXT</Text>
                            </Pressable>

                            <Pressable style={styles.formatButton} onPress={() => exportPdfVehicle.mutate(vehicle.id)}>
                                <Text style={styles.buttonText}>PDF</Text>
                            </Pressable>

                            <Pressable style={styles.formatButton} onPress={() => exportDocxVehicle.mutate(vehicle.id)}>
                                <Text style={styles.buttonText}>DOCX</Text>
                            </Pressable>
                        </View>
                    </View>
                ))}
            </View>

            <View style={styles.box}>
                <Text style={styles.boxTitle}>Full Export</Text>

                {isLoading && <Text style={styles.message}>Loading vehicles...</Text>}
                {error && <Text style={styles.message}>Failed to load vehicles.</Text>}

                {!isLoading && !error && vehicles?.map((vehicle) => (
                    <View key={vehicle.id} style={styles.vehicleRow}>
                        <Text style={styles.vehicleText}>
                            {vehicle.year} {vehicle.make} {vehicle.model}
                        </Text>

                        <View style={styles.buttonRow}>
                            <Pressable style={styles.formatButton}onPress={() => exportZipVehicle.mutate(vehicle.id)}>
                                <Text style={styles.buttonText}>ZIP</Text>
                            </Pressable>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        gap: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    box: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 15,
        gap: 12,
    },
    boxTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    vehicleRow: {
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 8,
        padding: 10,
        gap: 10,
    },
    vehicleText: {
        fontSize: 16,
        fontWeight: "500",
    },
    buttonRow: {
        flexDirection: "row",
        gap: 10,
    },
    formatButton: {
        backgroundColor: "#333",
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 6,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
    message: {
        fontSize: 14,
        color: "#666",
    },
});