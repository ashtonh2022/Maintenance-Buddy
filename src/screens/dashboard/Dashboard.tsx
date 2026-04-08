import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Dashboard() {
    //displays to screen
    return (
        <View style={styles.container}>
        <Text style={styles.title}>Dashboard</Text>
        <Pressable style={styles.addButton} onPress={() => router.push("/vehicle/add")}>
        <Text style={styles.addButtonText}>+ Add Vehicle</Text>
        </Pressable>
        <Text style={styles.emptyText}>No vehicles yet.</Text>
        {/* TODO: display vehicles from database here */}
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
});