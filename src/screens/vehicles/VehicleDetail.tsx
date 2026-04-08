import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function VehicleDetail() {
    const params = useLocalSearchParams();
    const id = String(params.id ?? "");
    const make = String(params.make ?? "");
    const model = String(params.model ?? "");
    const year = String(params.year ?? "");
    const recent_mileage = String(params.recent_mileage ?? "");

    return (
        <View style={styles.container}>
        <View style={styles.topRow}>
        <Pressable style={styles.editButton} onPress={() => router.push("/vehicle/edit")}>
        <Text style={styles.editButtonText}>Edit</Text>
        </Pressable>
        </View>

        <Text style={styles.title}>Vehicle Details</Text>
        <View style={styles.card}>

        <Text style={styles.label}>ID</Text>
        <Text style={styles.value}>{id}</Text>

        <Text style={styles.label}>Make</Text>
        <Text style={styles.value}>{make}</Text>

        <Text style={styles.label}>Model</Text>
        <Text style={styles.value}>{model}</Text>

        <Text style={styles.label}>Year</Text>
        <Text style={styles.value}>{year}</Text>

        <Text style={styles.label}>Mileage</Text>
        <Text style={styles.value}>{recent_mileage}</Text>
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    topRow: {
        marginBottom: 20,
    },
    editButton: {
        alignSelf: "flex-start",
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
});