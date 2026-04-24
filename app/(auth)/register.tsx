import { useSignUp } from "@/hooks/useAuth";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../constants/colors";

export default function Register() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const signUpMutation = useSignUp();

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        try {
            await signUpMutation.mutateAsync({ email, password });
            router.replace("/(auth)/login")
        } catch (error: any) {
            Alert.alert("Register Failed", error.message || "Something went wrong");
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={[colors.darkNavy, colors.lightBlue]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
            <Text style={styles.title}>Register</Text>

        <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#94A3B8"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
        />

        <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#94A3B8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
        />

        <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#94A3B8"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
        />

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
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        marginBottom: 20,
        color: "#FFFFFF",
    },
    input: {
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.3)",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        color: "#FFFFFF",
    },
    button: {
        backgroundColor: "#2323FF",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 8,
    },
    buttonText: {
        color: "#ffffff",
        fontWeight: "600",
    },
    link: {
        marginTop: 14,
        color: "#2323FF",
        textAlign: "center",
        fontWeight: "500",
    },
});
