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
    const [loading, setLoading] = useState(false);

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
        let yearlyMileageRate = 0;
        if (mileageRate === "low") {
            yearlyMileageRate = 5000;
        } else if (mileageRate === "medium") {
            yearlyMileageRate = 12000;
        } else if (mileageRate === "high") {
            yearlyMileageRate = 15000;
        } else if (mileageRate === "custom") {
            if (!customMileage) {
                Alert.alert("Error", "Please enter a custom mileage rate");
                return;
            }
            yearlyMileageRate = Number(customMileage);
        }

        try {
            await signUpMutation.mutateAsync({ email, password, mileageRate: yearlyMileageRate});
            Alert.alert("Success", "Account created", [{
                text: "OK",
                onPress: () => router.replace("/(auth)/login"),
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
            disabled={signUpMutation.isPending}
        >
            <Text style={mileageRate === "low" ? styles.selectedOptionText : styles.optionText}>
                    5,000 miles/year (Low)
                </Text>
        </Pressable>

        <Pressable
            style={[styles.option, mileageRate === "medium" && styles.selectedOption]}
            onPress={() => setMileageRate("medium")}
            disabled={signUpMutation.isPending}
        >
            <Text style={mileageRate === "medium" ? styles.selectedOptionText : styles.optionText}>
                    12,000 miles/year (Medium)
                </Text>
        </Pressable>

        <Pressable
            style={[styles.option, mileageRate === "high" && styles.selectedOption]}
            onPress={() => setMileageRate("high")}
            disabled={signUpMutation.isPending}
        >
            <Text style={mileageRate === "high" ? styles.selectedOptionText : styles.optionText}>
                    15,000 miles/year (High)
                </Text>
        </Pressable>

        <Pressable
            style={[styles.option, mileageRate === "custom" && styles.selectedOption]}
            onPress={() => setMileageRate("custom")}
            disabled={signUpMutation.isPending}
        >
            <Text style={mileageRate === "custom" ? styles.selectedOptionText : styles.optionText}>
                    Custom
                </Text>
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
        backgroundColor: "#2323FF",
        borderColor: "#2323FF",
    },
    optionText: {
        color: "#000",
    },
    selectedOptionText: {
        color: "#fff",
        fontWeight: "600",
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