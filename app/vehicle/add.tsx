import { useAuth } from "@/contexts/AuthContext";
import { useAddVehicle } from "@/hooks/useVehicles";
import { DEFAULT_SCHEDULES, DefaultService, addRequiredServices } from "@/services/schedules";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

const FUEL_TYPES = ["petrol", "diesel", "hybrid", "electric"] as const;

export default function AddVehicle() {
    const [step, setStep] = useState<1 | 2>(1);

    // Step 1 fields
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [mileage, setMileage] = useState("");
    const [fuelType, setFuelType] = useState<string>("");
    const [mileageRate, setMileageRate] = useState("");

    // Step 2 fields
    const [services, setServices] = useState<DefaultService[]>([]);

    const addVehicle = useAddVehicle();
    const { session } = useAuth();

    const handleStep1 = () => {
        if (!make || !model || !year || !mileage || !fuelType || !mileageRate) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }
        setServices([...DEFAULT_SCHEDULES[fuelType]]);
        setStep(2);
    };

    const adjustInterval = (index: number, amount: number) => {
        setServices(prev => {
            const updated = [...prev];
            const newVal = updated[index].interval_miles + amount;
            if (newVal >= 1000) {
                updated[index] = { ...updated[index], interval_miles: newVal };
            }
            return updated;
        });
    };

    const removeService = (index: number) => {
        setServices(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!session?.user?.id) return;

        try {
            const newVehicle = await addVehicle.mutateAsync({
                make,
                model,
                year: Number(year),
                recent_mileage: Number(mileage),
                fuel_type: fuelType as any,
                mileage_rate: Number(mileageRate),
                user_id: session.user.id,
            });

            if (services.length > 0) {
                await addRequiredServices(
                    services.map(s => ({
                        vehicle_id: newVehicle.id,
                        service_name: s.service_name,
                        interval_miles: s.interval_miles,
                    }))
                );
            }

            Alert.alert("Success", "Vehicle added", [{
                text: "OK",
                onPress: () => router.back(),
            }]);
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to add vehicle");
        }
    };

    if (step === 2) {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Customize Service Schedule</Text>
                <Text style={styles.subtitle}>
                    Adjust intervals to match your vehicle's needs
                </Text>

                {services.map((service, index) => (
                    <View key={index} style={styles.serviceRow}>
                        <View style={styles.serviceHeader}>
                            <Text style={styles.serviceName}>{service.service_name}</Text>
                            <Pressable onPress={() => removeService(index)}>
                                <Text style={styles.removeText}>Remove</Text>
                            </Pressable>
                        </View>
                        <View style={styles.intervalRow}>
                            <Pressable style={styles.arrowButton} onPress={() => adjustInterval(index, -5000)}>
                                <Text style={styles.arrowText}>{"<<"}</Text>
                            </Pressable>
                            <Pressable style={styles.arrowButton} onPress={() => adjustInterval(index, -1000)}>
                                <Text style={styles.arrowText}>{"<"}</Text>
                            </Pressable>
                            <Text style={styles.intervalText}>
                                {service.interval_miles.toLocaleString()} mi
                            </Text>
                            <Pressable style={styles.arrowButton} onPress={() => adjustInterval(index, 1000)}>
                                <Text style={styles.arrowText}>{">"}</Text>
                            </Pressable>
                            <Pressable style={styles.arrowButton} onPress={() => adjustInterval(index, 5000)}>
                                <Text style={styles.arrowText}>{">>"}</Text>
                            </Pressable>
                        </View>
                    </View>
                ))}

                <View style={styles.buttonRow}>
                    <Pressable style={styles.backButton} onPress={() => setStep(1)}>
                        <Text style={styles.backButtonText}>Back</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Save Vehicle</Text>
                    </Pressable>
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Add Vehicle</Text>

            <TextInput
                style={styles.input}
                placeholder="Make"
                value={make}
                onChangeText={setMake}
            />

            <TextInput
                style={styles.input}
                placeholder="Model"
                value={model}
                onChangeText={setModel}
            />

            <TextInput
                style={styles.input}
                placeholder="Year"
                value={year}
                onChangeText={setYear}
                keyboardType="numeric"
            />

            <TextInput
                style={styles.input}
                placeholder="Current Mileage"
                value={mileage}
                onChangeText={setMileage}
                keyboardType="numeric"
            />

            <Text style={styles.label}>Fuel Type</Text>
            <View style={styles.optionRow}>
                {FUEL_TYPES.map((type) => (
                    <Pressable
                        key={type}
                        style={[styles.option, fuelType === type && styles.selectedOption]}
                        onPress={() => setFuelType(type)}
                    >
                        <Text style={fuelType === type ? styles.selectedOptionText : styles.optionText}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <Text style={styles.label}>Yearly Mileage Estimate</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. 12000"
                value={mileageRate}
                onChangeText={setMileageRate}
                keyboardType="numeric"
            />

            <Pressable style={styles.submitButton} onPress={handleStep1}>
                <Text style={styles.buttonText}>Next: Service Schedule</Text>
            </Pressable>
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
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
        marginTop: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: "#2323FF",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    optionRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 12,
        gap: 8,
    },
    option: {
        borderWidth: 1,
        borderColor: "#2323FF",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    selectedOption: {
        backgroundColor: "#2323FF",
    },
    optionText: {
        color: "#000",
    },
    selectedOptionText: {
        color: "#fff",
        fontWeight: "600",
    },
    serviceRow: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    serviceHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    serviceName: {
        fontSize: 16,
        fontWeight: "600",
    },
    removeText: {
        color: "red",
        fontSize: 14,
    },
    intervalRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    arrowButton: {
        borderWidth: 1,
        borderColor: "#2323FF",
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    arrowText: {
        color: "#2323FF",
        fontWeight: "600",
        fontSize: 16,
    },
    intervalText: {
        fontSize: 16,
        fontWeight: "600",
        minWidth: 100,
        textAlign: "center",
    },
    buttonRow: {
        flexDirection: "row",
        gap: 12,
        marginTop: 8,
    },
    backButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#2323FF",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    backButtonText: {
        color: "#2323FF",
        fontWeight: "600",
    },
    button: {
        flex: 1,
        backgroundColor: "#2323FF",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    submitButton: {
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
