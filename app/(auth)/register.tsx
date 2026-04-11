import { useSignUp } from "@/hooks/useAuth";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function Register() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [mileageRate, setMileageRate] = useState<string>("");
    const [customMileage, setCustomMileage] = useState<string>("");

    const signUpMutation = useSignUp();

    //if user leaved any fields blank
    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        //if password does not match confirm password field
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        //asks user for their mileage
        let finalMileageRate = 0;
        if (mileageRate === "low") {
            finalMileageRate = 500;
        } else if (mileageRate === "medium") {
            finalMileageRate = 1000;
        } else if (mileageRate === "high") {
            finalMileageRate = 1500;
        } else if (mileageRate === "custom") {
            if (!customMileage) {
                Alert.alert("Error", "Please enter a custom mileage rate");
                return;
            }
            finalMileageRate = Number(customMileage);
        }

        try {
            await signUpMutation.mutateAsync({ email, password, mileageRate: finalMileageRate});
            Alert.alert("Success", "Account created", [{
                text: "OK",
                onPress: () => router.replace("/login"),
            },]);
        } catch (error: any) {
            Alert.alert("Register Failed", error.message || "Something went wrong");
        
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>

        <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
        />

        <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
        />

        <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
        />

        <Text style={styles.label}>Mileage Rate</Text>

        <Pressable
            style={[styles.option, mileageRate === "low" && styles.selectedOption]}
            onPress={() => setMileageRate("low")}
        >
            <Text>Low</Text>
        </Pressable>

        <Pressable
            style={[styles.option, mileageRate === "medium" && styles.selectedOption]}
            onPress={() => setMileageRate("medium")}
        >
            <Text>Medium</Text>
        </Pressable>

        <Pressable
            style={[styles.option, mileageRate === "high" && styles.selectedOption]}
            onPress={() => setMileageRate("high")}
        >
            <Text>High</Text>
        </Pressable>

        <Pressable
            style={[styles.option, mileageRate === "custom" && styles.selectedOption]}
            onPress={() => setMileageRate("custom")}
        >
            <Text>Custom</Text>
        </Pressable>

        {mileageRate === "custom" && (
            <TextInput
            style={styles.input}
            placeholder="Enter custom mileage"
            value={customMileage}
            onChangeText={setCustomMileage}
            keyboardType="numeric"
            />
        )}

        <Pressable
            style={styles.button}
            onPress={handleRegister}
            disabled={signUpMutation.isPending}
        >
            <Text style={styles.buttonText}>
                {signUpMutation.isPending ? "Creating Account..." : "Register"}
            </Text>
        </Pressable>

        <Pressable onPress={() => router.push("/login")}>
            <Text style={styles.link}>Already have an account? Login</Text>
        </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        marginBottom: 20,
    },
    label: {
        fontSize: 24,
        fontWeight: "600",
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#2323FF",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    option: {
        borderWidth: 1,
        borderColor: "#2323FF",
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
    selectedOption: {
        backgroundColor: "#ffffff",
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
    link: {
        marginTop: 14,
        color: "#2323FF",
        textAlign: "center",
        fontWeight: "500",
    },
});