import { useDeleteVehicle, useUpdateVehicle, useVehicle } from '@/hooks/useVehicles';
import { useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { parseYear, parsePositiveInt } from "@/lib/validation";

//variables
export default function EditVehicle() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: vehicle, isLoading } = useVehicle(String(id!));
    const queryClient = useQueryClient();

    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [mileage, setMileage] = useState("");
    const updateVehicleMutation = useUpdateVehicle();
    const deleteVehicleMutation = useDeleteVehicle();

    useEffect(() => {
        if (vehicle) {
            setMake(vehicle.make ?? '');
            setModel(vehicle.model ?? '');
            setYear(String(vehicle.year ?? ''));
            setMileage(String(vehicle.recent_mileage ?? ''));
        }
    }, [vehicle]);

    //function for button
    const handleSaveChanges = async() => {
        if (!make || !model || !year || !mileage) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }
        if (parseYear(year) === null) {
            Alert.alert("Error", "Please enter a valid year (1900 - " + (new Date().getFullYear() + 1) + ")");
            return;
        }
        if (parsePositiveInt(mileage) === null) {
            Alert.alert("Error", "Mileage must be a positive number");
            return;
        }

        try {
        await updateVehicleMutation.mutateAsync({
            id: String(id),
            vehicle: {
                make,
                model,
                year: parseYear(year)!,
                recent_mileage: parsePositiveInt(mileage)!,
            }
        });

        Alert.alert("Success", "Vehicle Updated", [
            { text: "OK", onPress: () => router.back() },
        ]);
    } catch (error: any) {
        Alert.alert("Error", error.message || "Failed to update vehicle");
    }
};
    //Delete button
    const handleDelete = () => {
        Alert.alert("Delete Vehicle", "Are you sure you want to delete this vehicle?",[{
            text: "Cancel", style: "cancel",}, {
            text: "Delete", style: "destructive", onPress: async() => {
                try {
                        await deleteVehicleMutation.mutateAsync(String(id));
                        router.back();
                    } catch (error: any) {
                        Alert.alert("Error", error.message || "Failed to delete vehicle");
                    }
            },},
        ]);
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Edit Vehicle</Text>

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
            placeholder="Mileage"
            value={mileage}
            onChangeText={setMileage}
            keyboardType="numeric"
        />

        <Pressable style={styles.button} onPress={handleSaveChanges}>
        <Text style={styles.buttonText}>Save Changes</Text>
        </Pressable>

        <Pressable style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete Vehicle</Text>
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
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    button: {
        backgroundColor: "#2323FF",
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 8,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
    deleteButton: {
        backgroundColor: "#db1c1c", 
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 12,
    },
    deleteButtonText: {
        color: "#fff",
        fontWeight: "600",
    },
});